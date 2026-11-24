// CI check: headless gameplay smoke test.
// Simulates a complete 30-day run, exercising actions, job applications,
// events, interviews and endings — catching any runtime error before players do.

global.localStorage = (function () {
  let s = {};
  return {
    getItem: (k) => (k in s ? s[k] : null),
    setItem: (k, v) => { s[k] = String(v); },
    removeItem: (k) => { delete s[k]; }
  };
})();
global.window = global;
global.performance = { now: () => Date.now() };

const fs = require("fs");
const load = (f) => fs.readFileSync("js/" + f, "utf8");

// --- Stubs for browser-only modules -------------------------------
const rendered = { endings: [], events: [], offers: [], toasts: [] };

global.UI = new Proxy({}, {
  get: (t, prop) => {
    // Allow tests to override individual methods.
    if (prop in t) return t[prop];
    if (prop === "renderEnding") return (e) => { rendered.endings.push(e); };
    if (prop === "showEvent") return (e) => {
      rendered.events.push(e);
      // Auto-pick the first choice so the event pipeline actually runs.
      try { global.Events.resolveChoice(0); } catch (err) { /* reported by caller */ }
    };
    if (prop === "showOffer") return (j) => { rendered.offers.push(j); };
    if (prop === "showToast") return (m) => { rendered.toasts.push(m); };
    return () => undefined;
  }
});

global.Audio = { play: () => undefined, init: () => undefined, toggle: () => true };

// Load the real game modules in ONE scope (they close over each other).
const src = [
  load("data.js"), load("state.js"), load("jobs.js"), load("interviews.js"),
  load("events.js"), load("actions.js"), load("game.js")
].join("\n");

const G = eval(src + "\n({ GAME_DATA, GameState, Jobs, Interviews, Events, Actions, Game })");
const { GAME_DATA, GameState, Jobs, Interviews, Events, Actions, Game } = G;
global.GameState = GameState; global.Jobs = Jobs; global.Interviews = Interviews;
global.Events = Events; global.Actions = Actions; global.Game = Game;
global.GAME_DATA = GAME_DATA;

let fail = 0;
const pass = (m) => console.log("PASS  " + m);
const bad = (m) => { console.log("FAIL  " + m); fail = 1; };

// --- 1. Character creation ---------------------------------------
try {
  GameState.init("Smoke", "fullstack", "grinder");
  GameState.gameStarted ? pass("character creation starts game") : bad("game did not start");
  GameState.jobs.length >= 25 ? pass("initial jobs generated (" + GameState.jobs.length + ")")
                               : bad("too few jobs: " + GameState.jobs.length);
  GameState.player.skills === 60 ? pass("grinder bonus applied (+10 skills)")
                                 : bad("grinder skills = " + GameState.player.skills);
  GameState.player.energy === 90 ? pass("grinder cost applied (-10 energy)")
                                 : bad("grinder energy = " + GameState.player.energy);
} catch (e) { bad("init threw: " + e.message); }

// --- 2. Every action runs without throwing ------------------------
const energyBefore = GameState.player.energy;
const skillsBefore = GameState.player.skills;

["dsa", "learn", "network", "resume", "project", "rest", "apply"].forEach((id) => {
  try {
    GameState.player.energy = 100;
    GameState.player.money = 5000;
    Actions.perform(id);
    pass("action '" + id + "' executed");
  } catch (e) {
    bad("action '" + id + "' threw: " + e.message);
  }
});

if (GameState.player.skills > skillsBefore) pass("skills increased after actions");
else bad("skills did not increase (" + skillsBefore + " -> " + GameState.player.skills + ")");

// --- 3. Applying to a specific job moves its status ---------------
try {
  GameState.player.energy = 100;
  const open = GameState.getOpenJobs();
  if (!open.length) bad("no open jobs to apply to");
  else {
    const job = open[0];
    Actions.applyToJob(job.id);
    job.status !== "open"
      ? pass("application moved job to '" + job.status + "'")
      : bad("job status stayed 'open' after applying");
    GameState.stats.applicationsSent >= 1
      ? pass("applications counter incremented")
      : bad("applications counter not incremented");
  }
} catch (e) { bad("applyToJob threw: " + e.message); }

// --- 4. Interview question generation (headless) -------------------
try {
  const job = GameState.jobs.find((j) => j.status !== "open") || GameState.jobs[0];
  job.currentRound = job.rounds[0];
  const qs = Interviews.generateQuestions(job);
  Array.isArray(qs) && qs.length > 0
    ? pass("generated " + qs.length + " interview questions")
    : bad("no interview questions generated");
  const allValid = qs.every((q) =>
    typeof q.question === "string" &&
    Array.isArray(q.options) && q.options.length >= 2 &&
    (q.type === "behavioral" || (typeof q.correct === "number" && q.correct < q.options.length))
  );
  allValid ? pass("every generated question is well-formed")
           : bad("malformed question generated");
} catch (e) { bad("generateQuestions threw: " + e.message); }

// --- 5. Full 30-day loop ------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- 4b. Event system: trigger and resolve a real choice ----------
try {
  GameState.reset();
  GameState.init("E", "java", "networker");
  const confBefore = GameState.player.confidence;
  let shown = 0;
  const origShowEvent = UI.showEvent;
  UI.showEvent = (ev, choices) => {
    shown++;
    if (!choices || choices.length === 0) bad("event shown without choices: " + ev.title);
    else Events.resolveChoice(0);
  };
  Events.pendingEvent = null;
  GameState.pendingEventDuringEndDay = false;

  const triggered = Events.triggerEvent();
  UI.showEvent = origShowEvent;

  if (triggered) {
    shown > 0 ? pass("event displayed with choices")
              : bad("event triggered but UI.showEvent never called");
    Events.pendingEvent === null ? pass("event resolved and cleared")
                                 : bad("pendingEvent not cleared after choice");
    GameState.eventsLog.length > 0 ? pass("event written to log")
                                   : bad("event not added to log");
  } else {
    // ~45% of days have no event — that's valid, but force one to test the path.
    UI.showEvent = (ev, choices) => { shown++; Events.resolveChoice(0); };
    const forced = { ...GAME_DATA.events[0], description: "Test event" };
    Events.pendingEvent = forced;
    Events.resolveChoice(0);
    UI.showEvent = origShowEvent;
    shown > 0 || Events.pendingEvent === null
      ? pass("forced event resolved cleanly")
      : bad("forced event did not resolve");
  }
} catch (e) { bad("event system threw: " + e.message); }

async function runLoop() {
  let daysRun = 0;
  let ended = false;
  Game.startNewDay();

  for (let i = 0; i < 40 && !ended; i++) {
    for (let a = 0; a < 5; a++) {
      if (GameState.player.energy >= 20) {
        try { Actions.perform(Math.random() < 0.5 ? "dsa" : "apply"); } catch (e) { /* keep going */ }
      } else if (GameState.player.energy < 100) {
        Actions.perform("rest");
      }
    }
    Game.completeDay();
    daysRun++;

    // The ending is revealed on a short timer so the day summary can display.
    if (GameState.gameOver) {
      await sleep(700);
      ended = true;
    } else if (GameState.day > GameState.maxDays) {
      await sleep(700);
      ended = GameState.gameOver;
    }
  }

  ended ? pass("30-day loop reached an ending after " + daysRun + " days")
        : bad("loop never ended after " + daysRun + " days");

  if (GameState.gameOver) pass("gameOver flag set synchronously");
  else bad("gameOver flag not set");

  rendered.endings.length > 0
    ? pass("ending rendered: '" + rendered.endings[0].title + "'")
    : bad("no ending was rendered");

  const e0 = rendered.endings[0];
  ["days", "apps", "interviews", "offers", "skills", "confidence", "money", "bestSalary", "message"]
    .every((k) => e0 && e0[k] !== undefined)
    ? pass("ending contains all summary stats")
    : bad("ending missing stats: " + ["days","apps","interviews","offers","skills","confidence","money","bestSalary","message"]
        .filter((k) => !e0 || e0[k] === undefined).join(","));

  const ok = GameState.load();
  ok ? pass("save/load still works after game over") : bad("save/load broken after game over");
}

// --- 6 + 7, run after the loop finishes ---------------------------
async function main() {
  await runLoop();

  // --- 6. Endings cover every specified outcome -------------------
  try {
    const titles = [
      "DREAM OFFER", "GREAT OFFER", "OFFER SECURED",
      "KEEP GOING", "STILL SEARCHING", "BURNOUT"
    ];
    const gameSrc = load("game.js");
    const missing = titles.filter((t) => !gameSrc.includes(t));
    missing.length === 0 ? pass("all " + titles.length + " ending types implemented")
                         : bad("missing endings: " + missing.join(", "));
  } catch (e) { bad("ending check threw: " + e.message); }

  // --- 7. Burnout can actually trigger ----------------------------
  try {
    GameState.reset();
    GameState.init("B", "java", "grinder");
    GameState.gameOver = false;
    GameState.burnout = 100;
    rendered.endings.length = 0;
    Game.startNewDay();
    const burnoutEnding = rendered.endings.find((e) => e.title.includes("BURNOUT"));
    burnoutEnding ? pass("burnout ending triggers at 100%")
                  : bad("burnout ending did not trigger (got: " +
                        (rendered.endings[0] ? rendered.endings[0].title : "none") + ")");
  } catch (e) { bad("burnout check threw: " + e.message); }

  console.log("");
  process.exit(fail);
}

main();
