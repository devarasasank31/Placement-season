const Events = {
    pendingEvent: null,

    checkForEvent() {
        if (Math.random() > 0.45) return null;

        let eventPool = [...GAME_DATA.events];

        const specialEvent = GAME_DATA.specialEvents.find(e =>
            GameState.day >= e.dayRange[0] && GameState.day <= e.dayRange[1] && Math.random() < 0.3
        );

        let event;
        if (specialEvent) {
            event = { ...specialEvent };
        } else {
            event = eventPool[Math.floor(Math.random() * eventPool.length)];
        }

        event = { ...event };
        const company = GAME_DATA.companies[Math.floor(Math.random() * GAME_DATA.companies.length)];
        event.description = event.description.replace(/{company}/g, company);
        event.company = company;

        return event;
    },

    triggerEvent() {
        const event = this.checkForEvent();
        if (!event) return false;

        this.pendingEvent = event;
        UI.showEvent(event, event.choices);
        return true;
    },

    resolveChoice(choiceIndex) {
        if (!this.pendingEvent) return;

        const event = this.pendingEvent;
        const choice = event.choices[choiceIndex];

        if (choice && choice.effects) {
            const effects = choice.effects;

            Object.keys(effects).forEach(key => {
                const val = effects[key];
                switch (key) {
                    case "energy":
                        GameState.updateResource("energy", val);
                        break;
                    case "skills":
                        GameState.updateResource("skills", val);
                        break;
                    case "confidence":
                        GameState.updateResource("confidence", val);
                        break;
                    case "money":
                        GameState.updateResource("money", val);
                        break;
                    case "burnout":
                        GameState.updateResource("burnout", val);
                        break;
                    case "hasReferral":
                        if (val) {
                            const openJobs = GameState.getOpenJobs();
                            if (openJobs.length > 0) {
                                const targetJob = openJobs[Math.floor(Math.random() * openJobs.length)];
                                targetJob.hasReferral = true;
                                GameState.addEventToLog(`推荐: Referral for ${targetJob.company}`, "positive");
                                UI.showToast(`Referral unlocked for ${targetJob.company}!`, "success");
                            }
                        }
                        break;
                    case "hasInterview":
                        if (val) {
                            const openJobs = GameState.getOpenJobs();
                            if (openJobs.length > 0) {
                                const targetJob = openJobs[Math.floor(Math.random() * openJobs.length)];
                                targetJob.status = "interview";
                                targetJob.currentRound = targetJob.rounds[0];
                                GameState.addCalendarEvent(GameState.day + 1, "interview", `Interview at ${targetJob.company}`);
                                GameState.addEventToLog(`面试: Interview scheduled at ${targetJob.company}`, "positive");
                                UI.showToast(`Interview scheduled at ${targetJob.company}!`, "success");
                            }
                        }
                        break;
                }
            });
        }

        const type = event.type === "positive" ? "positive" : event.type === "negative" ? "negative" : "neutral";
        GameState.addEventToLog(`⚡ ${event.title}`, type);

        this.pendingEvent = null;
        UI.hideEvent();
        UI.updateResources();
        UI.renderActions();
        UI.renderEventsLog();
        UI.renderJobs();
    }
};
