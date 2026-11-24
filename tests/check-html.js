// CI check: verify HTML structure, critical IDs, and load-time optimizations
const fs = require("fs");
const h = fs.readFileSync("index.html", "utf8");

let fail = 0;
const pass = (m) => console.log("PASS  " + m);
const bad = (m) => { console.log("FAIL  " + m); fail = 1; };

// Script tag balance
const open = (h.match(/<script/g) || []).length;
const close = (h.match(/<\/script>/g) || []).length;
open === close ? pass("script tags balanced (" + open + ")") : bad("script tags unbalanced " + open + "/" + close);

// Loading performance
(h.match(/<script defer/g) || []).length === 10
  ? pass("10 deferred scripts (non-blocking)")
  : bad("expected 10 deferred scripts, got " + (h.match(/<script defer/g) || []).length);

(h.match(/<script src=/g) || []).length === 0
  ? pass("no render-blocking scripts in body")
  : bad("blocking scripts still present in body");

h.includes('rel="preload" href="style.css"') ? pass("CSS preloaded") : bad("CSS preload missing");
h.includes("Cache-Control") ? pass("cache meta present") : bad("cache meta missing");
h.indexOf('rel="stylesheet"') < h.indexOf("<script defer")
  ? pass("stylesheet loads before scripts")
  : bad("stylesheet must load before scripts");

// Boot loader + timer (the user-facing load indicator)
h.includes('id="boot-loader"') ? pass("boot loader present") : bad("boot loader missing");
h.includes("__bootHide") ? pass("inline load timer present") : bad("inline load timer missing");
h.indexOf("<body>") < h.indexOf('id="boot-loader"') && h.indexOf('id="boot-loader"') < h.indexOf("</body>")
  ? pass("boot loader inside <body> (paints instantly)")
  : bad("boot loader must be inside <body>");

// Inline boot script must be in <head> and run before <body> paints
const bootIdx = h.indexOf("__BOOT_START = t0");
const headEnd = h.indexOf("</head>");
const bodyIdx = h.indexOf("<body>");
const bootTagStart = h.lastIndexOf("<script", bootIdx);

bootIdx > -1 && bootIdx < headEnd && headEnd < bodyIdx
  ? pass("boot clock defined in <head>, before <body>")
  : bad("boot clock must be defined in <head> before <body>");

// The boot script must be inline (no network fetch) so it runs at first byte
h.slice(bootTagStart, h.indexOf(">", bootTagStart)).includes(" src=")
  ? bad("boot script must be inline, not an external fetch")
  : pass("boot script is inline (zero network latency)");

// Core element IDs every screen/modal depends on
const ids = [
  "screen-menu", "screen-howto", "screen-character", "screen-game",
  "screen-interview", "screen-ending",
  "modal-day-summary", "modal-event", "modal-offer",
  "actions-grid", "jobs-list", "projects-grid", "calendar-grid", "stats-grid",
  "toast-container", "floating-text-container",
  "btn-new-game", "btn-continue", "btn-start-game", "btn-next-day",
  "bar-energy", "bar-skills", "bar-confidence", "res-money-val"
];
const missing = ids.filter((i) => !h.includes('id="' + i + '"'));
missing.length === 0 ? pass("all " + ids.length + " core element IDs present")
                     : bad("missing element IDs: " + missing.join(", "));

// Script load order: data.js must come first, main.js last
const order = [...h.matchAll(/<script defer src="([^"]+)"/g)].map((m) => m[1]);
order[0] === "js/data.js" ? pass("data.js loads first") : bad("data.js must load first, got " + order[0]);
order[order.length - 1] === "js/main.js" ? pass("main.js loads last") : bad("main.js must load last, got " + order[order.length - 1]);

process.exit(fail);
