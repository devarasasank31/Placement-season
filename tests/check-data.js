// CI check: verify game data completeness
const fs = require("fs");
const src = fs.readFileSync("js/data.js", "utf8");
const d = eval(src + "\n;GAME_DATA");

const expect = [
  ["companies", 20], ["roles", 5], ["actions", 8],
  ["projects", 10], ["events", 20], ["specialEvents", 5],
  ["mcqQuestions", 40], ["debuggingQuestions", 10],
  ["outputQuestions", 10], ["behavioralQuestions", 15]
];

let fail = 0;
expect.forEach(([k, min]) => {
  const n = (d[k] || []).length;
  if (n >= min) console.log("PASS  " + k + " = " + n + " (min " + min + ")");
  else { console.log("FAIL  " + k + " = " + n + " (min " + min + ")"); fail = 1; }
});

// Every event must have at least one choice
d.events.forEach((e, i) => {
  if (!e.choices || e.choices.length === 0) {
    console.log("FAIL  event[" + i + "] " + e.id + " has no choices"); fail = 1;
  }
});
if (fail === 0) console.log("PASS  all events have choices");

// Every MCQ/debug/output question needs a valid correct index
[["mcqQuestions", d.mcqQuestions], ["debuggingQuestions", d.debuggingQuestions], ["outputQuestions", d.outputQuestions]]
  .forEach(([name, arr]) => {
    const bad = arr.filter(q => typeof q.correct !== "number" || q.correct < 0 || q.correct >= q.options.length);
    if (bad.length) { console.log("FAIL  " + name + ": " + bad.length + " invalid correct index"); fail = 1; }
    else console.log("PASS  " + name + " answers valid");
  });

// Behavioral questions need scores
const badBeh = d.behavioralQuestions.filter(q => !Array.isArray(q.options) || q.options.some(o => typeof o.score !== "number"));
if (badBeh.length) { console.log("FAIL  behavioralQuestions: " + badBeh.length + " malformed"); fail = 1; }
else console.log("PASS  behavioralQuestions scores valid");

process.exit(fail);
