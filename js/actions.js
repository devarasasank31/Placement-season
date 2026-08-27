const Actions = {
    perform(actionId) {
        const action = GAME_DATA.actions.find(a => a.id === actionId);
        if (!action) return;

        if (action.id === "rest") {
            this.rest();
            return;
        }

        if (!GameState.canAfford(action.energyCost, action.moneyCost)) {
            UI.showToast("Not enough resources!", "error");
            Audio.play("error");
            return;
        }

        GameState.updateResource("energy", -action.energyCost);
        if (action.moneyCost > 0) {
            GameState.updateResource("money", -action.moneyCost);
        }

        const changes = [];

        switch (actionId) {
            case "apply":
                this.applyForJobs();
                changes.push({ label: "Applications sent", amount: "Check job board", suffix: "" });
                break;
            case "dsa":
                this.practiceDSA();
                break;
            case "project":
                this.buildProjectAction();
                break;
            case "learn":
                this.learnTechnology();
                break;
            case "network":
                this.network();
                break;
            case "resume":
                this.prepareResume();
                break;
            case "interview":
                this.attendInterview();
                return;
        }

        GameState.actionsToday++;
        GameState.save();
        UI.updateResources();
        UI.renderActions();
        UI.renderJobs();
        UI.renderEventsLog();
        UI.updatePipeline();
    },

    rest() {
        const burnoutPenalty = GameState.burnout > 50 ? Math.floor(GameState.burnout / 5) : 0;
        const energyGain = 30 - burnoutPenalty;
        GameState.updateResource("energy", energyGain);
        GameState.updateResource("confidence", 3);
        GameState.updateResource("burnout", -10);
        GameState.stats.daysRested++;

        UI.showToast(`+${energyGain} Energy, +3 Confidence`, "success");
        Audio.play("success");
        UI.showFloatingText(`+${energyGain} Energy`, true);
        GameState.addEventToLog("😴 Rested and recovered energy", "positive");
    },

    applyForJobs() {
        const openJobs = GameState.getOpenJobs();
        if (openJobs.length === 0) {
            UI.showToast("No open positions available!", "warning");
            GameState.updateResource("energy", 10);
            return;
        }

        const numApps = Math.min(2 + Math.floor(Math.random() * 2), openJobs.length);
        const shuffled = [...openJobs].sort(() => Math.random() - 0.5);
        const targets = shuffled.slice(0, numApps);

        targets.forEach(job => {
            const result = Jobs.processApplication(job.id);
            GameState.stats.applicationsSent++;
            GameState.addCalendarEvent(GameState.day + Math.floor(Math.random() * 5) + 1, "event", `Update from ${job.company}`);
        });

        const confChange = Math.random() > 0.5 ? 2 : -1;
        GameState.updateResource("confidence", confChange);

        UI.showToast(`Applied to ${targets.length} companies`, "success");
        Audio.play("success");
    },

    practiceDSA() {
        const gain = 5 + Math.floor(Math.random() * 6);
        GameState.updateResource("skills", gain);
        GameState.updateResource("confidence", 2);

        if (GameState.burnout > 30) {
            GameState.updateResource("burnout", 5);
        }

        GameState.addEventToLog(`🧩 Practiced DSA: +${gain} Skills`, "positive");
        UI.showToast(`+${gain} Skills`, "success");
        Audio.play("success");
        UI.showFloatingText(`+${gain} Skills`, true);
    },

    buildProjectAction() {
        const unbuilt = GAME_DATA.projects.filter(p => !GameState.completedProjects.some(cp => cp.id === p.id));
        if (unbuilt.length === 0) {
            UI.showToast("All projects built!", "info");
            GameState.updateResource("energy", 25);
            if (GameState.completedProjects.length > 0) {
                GameState.updateResource("money", 100);
            }
            return;
        }

        const proj = unbuilt[Math.floor(Math.random() * unbuilt.length)];
        const gain = proj.skillGain;

        GameState.completedProjects.push(proj);
        GameState.updateResource("skills", gain);
        GameState.updateResource("confidence", 4);
        GameState.resumeQuality = Math.min(100, GameState.resumeQuality + proj.resumeGain);
        GameState.atsScore = Math.min(100, GameState.atsScore + Math.floor(proj.resumeGain / 2));
        GameState.stats.projectsBuilt++;

        GameState.addEventToLog(`🔧 Built ${proj.name}: +${gain} Skills`, "positive");
        UI.showToast(`Built ${proj.name}! +${gain} Skills`, "success");
        Audio.play("success");
        UI.showFloatingText(`+${gain} Skills`, true);
    },

    learnTechnology() {
        const techs = ["React", "Node.js", "Docker", "AWS", "GraphQL", "Redis", "Kubernetes", "TypeScript", "Go", "Rust"];
        const tech = techs[Math.floor(Math.random() * techs.length)];
        const gain = 6;

        GameState.updateResource("skills", gain);
        GameState.resumeQuality = Math.min(100, GameState.resumeQuality + 3);
        GameState.atsScore = Math.min(100, GameState.atsScore + 2);

        GameState.addEventToLog(`📚 Learned ${tech}: +${gain} Skills`, "positive");
        UI.showToast(`Learned ${tech}! +${gain} Skills`, "success");
        Audio.play("success");
        UI.showFloatingText(`+${gain} Skills`, true);
    },

    network() {
        GameState.updateResource("confidence", 5);

        if (Math.random() < 0.35) {
            const openJobs = GameState.getOpenJobs();
            if (openJobs.length > 0) {
                const job = openJobs[Math.floor(Math.random() * openJobs.length)];
                job.hasReferral = true;
                GameState.addEventToLog(`🤝 Referral unlocked: ${job.company}`, "positive");
                UI.showToast(`Referral from ${job.company}!`, "success");
            }
        }

        if (Math.random() < 0.2) {
            const company = GAME_DATA.companies[Math.floor(Math.random() * GAME_DATA.companies.length)];
            GameState.addEventToLog(`💬 Recruiter from ${company} viewed your profile`, "neutral");
            UI.showToast(`Recruiter from ${company} noticed you!`, "info");
        }

        GameState.addEventToLog("🤝 Networked on LinkedIn: +5 Confidence", "positive");
        Audio.play("success");
        UI.showFloatingText("+5 Confidence", true);
    },

    prepareResume() {
        GameState.resumeQuality = Math.min(100, GameState.resumeQuality + 5);
        GameState.atsScore = Math.min(100, GameState.atsScore + 4);
        GameState.updateResource("confidence", 3);

        GameState.addEventToLog("📝 Resume improved!", "positive");
        UI.showToast("Resume improved! +5 Quality", "success");
        Audio.play("success");
        UI.showFloatingText("+5 Resume", true);
    },

    attendInterview() {
        const interviewJobs = GameState.getInterviewJobs();
        if (interviewJobs.length === 0) {
            UI.showToast("No interviews scheduled!", "warning");
            GameState.updateResource("energy", 20);
            return;
        }

        const job = interviewJobs[0];
        Game.startInterview(job.id);
    },

    applyToJob(jobId) {
        const job = Jobs.getJobById(jobId);
        if (!job || job.status !== "open") return;

        if (!GameState.canAfford(10, 0)) {
            UI.showToast("Not enough energy!", "error");
            Audio.play("error");
            return;
        }

        GameState.updateResource("energy", -10);
        GameState.actionsToday++;

        const result = Jobs.processApplication(jobId);
        GameState.stats.applicationsSent++;

        if (result === "rejected") {
            UI.showToast(`Rejected by ${job.company}`, "error");
            Audio.play("error");
        } else {
            UI.showToast(`Applied to ${job.company} - Status: ${result.toUpperCase()}`, "success");
            Audio.play("success");
        }

        GameState.save();
        UI.updateResources();
        UI.renderJobs();
        UI.renderActions();
        UI.updatePipeline();
    },

    improveResume() {
        if (!GameState.canAfford(15, 0)) {
            UI.showToast("Not enough energy!", "error");
            return;
        }
        GameState.updateResource("energy", -15);
        GameState.resumeQuality = Math.min(100, GameState.resumeQuality + 8);
        GameState.atsScore = Math.min(100, GameState.atsScore + 6);
        GameState.actionsToday++;

        GameState.addEventToLog("📝 Resume significantly improved!", "positive");
        UI.showToast("Resume improved! +8 Quality", "success");
        Audio.play("success");
        GameState.save();
        UI.updateResources();
        UI.renderResume();
    },

    addCertification() {
        if (!GameState.canAfford(10, 200)) {
            UI.showToast("Not enough resources!", "error");
            return;
        }
        GameState.updateResource("energy", -10);
        GameState.updateResource("money", -200);

        const certs = ["AWS Cloud Practitioner", "Google IT Support", "Meta Frontend", "MongoDB Developer", "Azure Fundamentals"];
        const cert = certs[Math.floor(Math.random() * certs.length)];

        if (!GameState.certifications.includes(cert)) {
            GameState.certifications.push(cert);
            GameState.resumeQuality = Math.min(100, GameState.resumeQuality + 6);
            GameState.atsScore = Math.min(100, GameState.atsScore + 5);
            GameState.stats.certsEarned++;
            GameState.updateResource("skills", 3);
            GameState.updateResource("confidence", 4);

            GameState.addEventToLog(`🏅 Earned ${cert}`, "positive");
            UI.showToast(`Earned: ${cert}!`, "success");
            Audio.play("success");
        } else {
            UI.showToast("Already have this cert. +3 Skills instead.", "info");
            GameState.updateResource("skills", 3);
        }

        GameState.actionsToday++;
        GameState.save();
        UI.updateResources();
        UI.renderResume();
    }
};
