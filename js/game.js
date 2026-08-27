const Game = {
    dailyChanges: [],

    startNewDay() {
        this.dailyChanges = [];
        GameState.actionsToday = 0;

        Jobs.expireOldJobs();

        if (GameState.day % 3 === 0) {
            Jobs.generateNewJobs(2 + Math.floor(Math.random() * 3));
        }

        if (GameState.burnout > 60 && Math.random() < 0.3) {
            GameState.updateResource("confidence", -5);
            GameState.updateResource("energy", -10);
            this.dailyChanges.push({ label: "Burnout penalty", amount: -5, suffix: " conf" });
            UI.showToast("Burnout is affecting you!", "warning");
        }

        if (Math.random() < 0.25) {
            const expense = 100 + Math.floor(Math.random() * 300);
            GameState.updateResource("money", -expense);
            this.dailyChanges.push({ label: "Daily expense", amount: -expense, suffix: "" });
        }

        UI.updateTopBar();
        UI.updateDayInfo();
        UI.updateResources();
        UI.renderActions();
        UI.renderJobs();
        UI.renderEventsLog();
        UI.updatePipeline();
        UI.renderResume();
        UI.renderProjects();
        UI.renderCalendar();
        UI.renderStats();
        GameState.save();
    },

    endDay() {
        const changes = [...this.dailyChanges];

        const eventTriggered = Events.triggerEvent();
        if (eventTriggered) return;

        this.processPendingInterviews();

        if (GameState.burnout > 80) {
            GameState.updateResource("confidence", -8);
            changes.push({ label: "Severe burnout", amount: -8, suffix: " conf" });
        }

        changes.push({ label: "Energy", amount: Math.round(GameState.player.energy), suffix: "/100" });
        changes.push({ label: "Skills", amount: Math.round(GameState.player.skills), suffix: "/100" });
        changes.push({ label: "Confidence", amount: Math.round(GameState.player.confidence), suffix: "/100" });
        changes.push({ label: "Money", amount: GameState.player.money, suffix: "" });

        UI.showDaySummary(changes);

        GameState.day++;

        if (GameState.day > GameState.maxDays) {
            setTimeout(() => this.triggerEnding(), 500);
            return;
        }

        UI.updateTopBar();
        UI.updateDayInfo();
        UI.updateResources();
        UI.renderActions();
        UI.renderCalendar();
        GameState.save();
    },

    processPendingInterviews() {
        const interviewJobs = GameState.getInterviewJobs();
        interviewJobs.forEach(job => {
            if (job.status === "applied" && Math.random() < 0.3) {
                job.status = "oa";
                job.currentRound = job.rounds[0];
                GameState.addEventToLog(`📋 OA scheduled: ${job.company}`, "positive");
            }
        });
    },

    startInterview(jobId) {
        Interviews.startInterview(jobId);
    },

    acceptOffer(jobId) {
        UI.hideOffer();
        const job = Jobs.getJobById(jobId);
        if (job) {
            GameState.stats.offers++;
            this.triggerEnding("offer", job);
        }
    },

    declineOffer(jobId) {
        UI.hideOffer();
        UI.showToast("Offer kept. You can still attend other interviews.", "info");
    },

    triggerEnding(type, job) {
        let ending;

        if (type === "offer" && job) {
            if (job.difficulty === "elite" && job.salary >= 20) {
                ending = {
                    title: "🌟 DREAM OFFER",
                    subtitle: "You nailed it!",
                    message: `You landed an elite offer at ${job.company} as ${job.role} for ₹${job.salary} LPA. Your hard work paid off. This is the beginning of an amazing career.`,
                };
            } else if (job.salary >= 10) {
                ending = {
                    title: "🎉 GREAT OFFER",
                    subtitle: "Well done!",
                    message: `You received a strong offer from ${job.company}. ₹${job.salary} LPA is a great start. Keep growing!`,
                };
            } else {
                ending = {
                    title: "✅ OFFER SECURED",
                    subtitle: "You got a job!",
                    message: `You received an offer from ${job.company} for ₹${job.salary} LPA. It's a start - make the most of it!`,
                };
            }
        } else if (GameState.burnout >= 100) {
            ending = {
                title: "😵 BURNOUT",
                subtitle: "You pushed too hard.",
                message: "You spent 30 days chasing an offer and forgot to take care of yourself. Health comes first. Take a break, recharge, and try again.",
            };
        } else {
            const hasStrongStats = GameState.player.skills >= 70 || GameState.player.confidence >= 70;
            if (hasStrongStats) {
                ending = {
                    title: "💪 KEEP GOING",
                    subtitle: "So close, yet so far.",
                    message: "You didn't get an offer this season, but you've built strong skills and confidence. The next placement season will be different. Don't give up.",
                };
            } else {
                ending = {
                    title: "😔 STILL SEARCHING",
                    subtitle: "The journey continues.",
                    message: "30 days passed without an offer. But every rejection is a lesson. Work on your skills, improve your resume, and come back stronger.",
                };
            }
        }

        const offerJobs = GameState.getOfferJobs();
        const bestSalary = offerJobs.length > 0
            ? `₹${Math.max(...offerJobs.map(j => j.salary))} LPA`
            : "N/A";

        ending.days = GameState.day > GameState.maxDays ? GameState.maxDays : GameState.day - 1;
        ending.apps = GameState.stats.applicationsSent;
        ending.interviews = GameState.stats.interviewsCompleted;
        ending.offers = GameState.stats.offers;
        ending.skills = Math.round(GameState.player.skills);
        ending.confidence = Math.round(GameState.player.confidence);
        ending.money = GameState.player.money;
        ending.bestSalary = bestSalary;

        GameState.gameOver = true;
        GameState.save();

        Audio.play(type === "offer" ? "offer" : "gameover");
        UI.renderEnding(ending);
    },

    restart() {
        GameState.clearSave();
        GameState.reset();
        UI.showScreen("screen-character");
    },

    goToMenu() {
        GameState.clearSave();
        GameState.reset();
        UI.showScreen("screen-menu");
        Main.updateContinueButton();
    }
};
