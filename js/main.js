const Main = {
    init() {
        Audio.init();
        this.bindMenuEvents();
        this.bindGameEvents();
        this.updateContinueButton();
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

        document.querySelectorAll("#char-options .char-opt, #personality-options .char-opt").forEach(btn => {
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

document.addEventListener("DOMContentLoaded", () => {
    Main.init();
});
