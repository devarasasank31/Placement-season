const Main = {
    __booted: false,

    init() {
        if (this.__booted) return;
        this.__booted = true;

        Audio.init();
        this.bindMenuEvents();
        this.bindGameEvents();
        this.updateContinueButton();
    },

    /*
     * Hides the boot loader and reports exactly how long the game took to
     * become interactive. The number is shown in the menu footer so players
     * can see real load performance.
     */
    finishBoot() {
        const ms = window.__bootHide ? window.__bootHide() : 0;

        const paint = () => {
            const foot = document.querySelector(".menu-footer");
            if (!foot) return;
            const nav = Math.round(performance.getEntriesByType("navigation")[0]?.responseEnd || 0);
            foot.innerHTML =
                `Made for every fresher who kept applying.<br>` +
                `<span style="color:var(--text-muted);font-size:.75rem;">` +
                `⚡ Interactive in <b style="color:var(--accent-light)">${ms} ms</b>` +
                ` · network ${nav} ms · ${performance.getEntriesByType("resource").length} files</span>`;
        };

        // Wait for full load so the reported numbers are complete.
        if (document.readyState === "complete") paint();
        else window.addEventListener("load", paint, { once: true });
    },

    updateContinueButton() {
        const btn = document.getElementById("btn-continue");
        if (GameState.hasSave()) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    },

    bindMenuEvents() {
        document.getElementById("btn-new-game").addEventListener("click", () => {
            Audio.play("click");
            UI.showScreen("screen-character");
        });

        document.getElementById("btn-continue").addEventListener("click", () => {
            Audio.play("click");
            if (GameState.load()) {
                UI.showScreen("screen-game");
                Game.startNewDay();
            } else {
                UI.showToast("No save found or save corrupted.", "error");
            }
        });

        document.getElementById("btn-how-to-play").addEventListener("click", () => {
            Audio.play("click");
            UI.showScreen("screen-howto");
        });

        document.getElementById("btn-back-howto").addEventListener("click", () => {
            Audio.play("click");
            UI.showScreen("screen-menu");
        });

        document.querySelectorAll("#spec-options .char-opt, #personality-options .char-opt").forEach(btn => {
            btn.addEventListener("click", () => {
                Audio.play("click");
                const parent = btn.parentElement;
                parent.querySelectorAll(".char-opt").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
            });
        });

        document.getElementById("btn-start-game").addEventListener("click", () => {
            Audio.play("click");
            const name = document.getElementById("char-name").value.trim() || "Player";
            const spec = document.querySelector("#spec-options .char-opt.selected")?.dataset.spec || "java";
            const personality = document.querySelector("#personality-options .char-opt.selected")?.dataset.personality || "grinder";

            GameState.init(name, spec, personality);
            UI.showScreen("screen-game");
            Game.startNewDay();
            UI.showToast(`Welcome, ${name}! Your placement season begins.`, "info");
        });
    },

    bindGameEvents() {
        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                Audio.play("click");
                const view = btn.dataset.screen;
                UI.showView(view);

                if (view === "resume") UI.renderResume();
                if (view === "projects") UI.renderProjects();
                if (view === "calendar") UI.renderCalendar();
                if (view === "stats") UI.renderStats();
                if (view === "jobs") UI.renderJobs();
            });
        });

        document.getElementById("btn-next-day").addEventListener("click", () => {
            Audio.play("dayEnd");
            Game.endDay();
        });

        document.getElementById("btn-close-summary").addEventListener("click", () => {
            Audio.play("click");
            UI.hideDaySummary();
            if (GameState.gameOver) return;
            Game.startNewDay();
        });

        document.getElementById("btn-save").addEventListener("click", () => {
            Audio.play("click");
            if (GameState.save()) {
                UI.showToast("Game saved!", "success");
            } else {
                UI.showToast("Save failed!", "error");
            }
        });

        document.getElementById("btn-sound-toggle").addEventListener("click", () => {
            const enabled = Audio.toggle();
            document.getElementById("btn-sound-toggle").textContent = enabled ? "🔊" : "🔇";
        });

        document.getElementById("btn-end-game").addEventListener("click", () => {
            Audio.play("click");
            if (confirm("Are you sure you want to end the game early?")) {
                Game.triggerEnding();
            }
        });

        document.getElementById("btn-improve-resume").addEventListener("click", () => {
            Audio.play("click");
            Actions.improveResume();
        });

        document.getElementById("btn-add-cert").addEventListener("click", () => {
            Audio.play("click");
            Actions.addCertification();
        });

        document.querySelectorAll(".job-filters .filter-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                Audio.play("click");
                document.querySelectorAll(".job-filters .filter-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                UI.renderJobs(btn.dataset.filter);
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                UI.hideDaySummary();
                UI.hideEvent();
                UI.hideOffer();
            }
        });
    }
};

/*
 * Race-safe bootstrap.
 * With `defer` scripts, DOM may already be parsed when this runs, so a bare
 * DOMContentLoaded listener can fire too late (or never) and leave the page
 * stuck on the loader. Check readyState first, then fall back to the event.
 */
function __boot() {
    try {
        Main.init();
    } catch (e) {
        // Never let a runtime error keep the player stuck on the loader.
        console.error("Boot init failed:", e);
    } finally {
        Main.finishBoot();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", __boot);
} else {
    __boot();
}

// Safety net: never let the loader hang for more than 8s.
setTimeout(() => {
    if (!Main.__booted) __boot();
    if (window.__bootHide && !window.__BOOT_DONE) window.__bootHide();
}, 8000);
