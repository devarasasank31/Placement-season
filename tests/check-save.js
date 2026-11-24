// CI check: game state save/load round-trip must be lossless
global.localStorage = (function () {
  let s = {};
  return {
    getItem: (k) => (k in s ? s[k] : null),
    setItem: (k, v) => { s[k] = String(v); },
    removeItem: (k) => { delete s[k]; }
  };
})();
global.window = global;

const fs = require("fs");
const stateSrc = fs.readFileSync("js/state.js", "utf8");
const dataSrc = fs.readFileSync("js/data.js", "utf8");

// Both must be evaluated in ONE scope: GameState.generateJobs() closes over GAME_DATA.
const ctx = eval(stateSrc + "\n" + dataSrc + "\n({ GameState, GAME_DATA })");
const { GameState } = ctx;

let fail = 0;
const pass = (m) => console.log("PASS  " + m);
const bad = (m) => { console.log("FAIL  " + m); fail = 1; };

// 1. Fresh init
GameState.init("Tester", "python", "networker");
GameState.day = 12;
GameState.updateResource("skills", 25);
GameState.updateResource("confidence", -10);
GameState.updateResource("money", -400);
GameState.updateResource("burnout", 15);
GameState.completedProjects.push({ id: "restapi", name: "REST API Backend", icon: "x" });
GameState.certifications.push("AWS Cloud Practitioner");
GameState.stats.applicationsSent = 7;

const snapshot = JSON.stringify({
  p: GameState.player,
  d: GameState.day,
  j: GameState.jobs,
  proj: GameState.completedProjects,
  cert: GameState.certifications,
  q: GameState.resumeQuality,
  b: GameState.burnout,
  s: GameState.stats
});

// 2. Persist, then reset and load — must restore exactly
GameState.save();

GameState.reset();
if (GameState.day !== 1) bad("reset() did not restore day 1");
else pass("reset() returns to day 1");

const ok = GameState.load();
if (!ok) bad("load() returned false");
else pass("load() succeeded");

const restored = JSON.stringify({
  p: GameState.player,
  d: GameState.day,
  j: GameState.jobs,
  proj: GameState.completedProjects,
  cert: GameState.certifications,
  q: GameState.resumeQuality,
  b: GameState.burnout,
  s: GameState.stats
});

if (snapshot !== restored) {
  bad("round-trip mismatch");
  console.log("  before: " + snapshot.slice(0, 200));
  console.log("  after : " + restored.slice(0, 200));
} else {
  pass("save/load round-trip lossless (" + GameState.jobs.length + " jobs, " +
       GameState.completedProjects.length + " projects)");
}

// 3. Corrupted save must fail gracefully, not throw
try {
  localStorage.setItem("placement_season_save", "{ not valid json !!!");
  const before = GameState.day;
  // The game logs the parse failure itself — silence it so CI output stays clean.
  const origErr = console.error;
  console.error = () => {};
  let ok2;
  try { ok2 = GameState.load(); } finally { console.error = origErr; }

  if (ok2 === false) pass("corrupted save handled without throwing");
  else bad("corrupted save should return false");
  if (GameState.day === before) pass("corrupted save left state intact");
} catch (e) {
  bad("corrupted save threw: " + e.message);
}

// 4. Missing save must return false, not throw
try {
  localStorage.removeItem("placement_season_save");
  const ok3 = GameState.load();
  ok3 === false ? pass("missing save returns false") : bad("missing save should return false");
} catch (e) {
  bad("missing save threw: " + e.message);
}

// 5. hasSave / clearSave
GameState.save();
GameState.hasSave() ? pass("hasSave() true after save") : bad("hasSave() false after save");
GameState.clearSave();
GameState.hasSave() ? bad("hasSave() true after clear") : pass("hasSave() false after clear");

// 6. Resource clamping
GameState.reset();
GameState.init("T", "java", "grinder");
GameState.updateResource("energy", 500);
GameState.player.energy === 100 ? pass("energy clamped to 100") : bad("energy not clamped: " + GameState.player.energy);
GameState.updateResource("energy", -500);
GameState.player.energy === 0 ? pass("energy clamped to 0") : bad("energy not clamped: " + GameState.player.energy);
GameState.updateResource("money", -999999);
GameState.player.money === 0 ? pass("money clamped to 0") : bad("money not clamped: " + GameState.player.money);

process.exit(fail);
