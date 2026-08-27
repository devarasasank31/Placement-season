const GameState = {
    player: {
        name: "Player",
        spec: "java",
        personality: "grinder",
        energy: 100,
        skills: 50,
        confidence: 50,
        money: 2000
    },
    day: 1,
    maxDays: 30,
    jobs: [],
    applications: [],
    completedProjects: [],
    certifications: [],
    resumeQuality: 35,
    atsScore: 35,
    burnout: 0,
    actionsToday: 0,
    eventsLog: [],
    calendarEvents: [],
    stats: {
        applicationsSent: 0,
        interviewsCompleted: 0,
        offers: 0,
        rejections: 0,
        finalRounds: 0,
        currentStreak: 0,
        highestConfidence: 50,
        highestSkills: 50,
        totalMoneyEarned: 0,
        totalMoneySpent: 0,
        daysWorked: 0,
        daysRested: 0,
        projectsBuilt: 0,
        certsEarned: 0,
        avgInterviewScore: 0,
        interviewScores: [],
        dailyActions: []
    },
    currentInterview: null,
    currentEvent: null,
    gameStarted: false,
    gameOver: false,
    pendingInterviewJobs: [],

    reset() {
        this.player = {
            name: "Player",
            spec: "java",
            personality: "grinder",
            energy: 100,
            skills: 50,
            confidence: 50,
            money: 2000
        };
        this.day = 1;
        this.jobs = [];
        this.applications = [];
        this.completedProjects = [];
        this.certifications = [];
        this.resumeQuality = 35;
        this.atsScore = 35;
        this.burnout = 0;
        this.actionsToday = 0;
        this.eventsLog = [];
        this.calendarEvents = [];
        this.stats = {
            applicationsSent: 0,
            interviewsCompleted: 0,
            offers: 0,
            rejections: 0,
            finalRounds: 0,
            currentStreak: 0,
            highestConfidence: 50,
            highestSkills: 50,
            totalMoneyEarned: 0,
            totalMoneySpent: 0,
            daysWorked: 0,
            daysRested: 0,
            projectsBuilt: 0,
            certsEarned: 0,
            avgInterviewScore: 0,
            interviewScores: [],
            dailyActions: []
        };
        this.currentInterview = null;
        this.currentEvent = null;
        this.gameStarted = false;
        this.gameOver = false;
        this.pendingInterviewJobs = [];
    },

    init(playerName, spec, personality) {
        this.reset();
        this.player.name = playerName || "Player";
        this.player.spec = spec;
        this.player.personality = personality;

        switch (personality) {
            case "grinder":
                this.player.skills = Math.min(100, this.player.skills + 10);
                this.player.energy = Math.max(0, this.player.energy - 10);
                break;
            case "networker":
                this.player.confidence = Math.min(100, this.player.confidence + 10);
                this.player.money += 500;
                break;
            case "builder":
                this.player.skills = Math.min(100, this.player.skills + 10);
                this.player.money = Math.max(0, this.player.money - 300);
                break;
            case "balanced":
                break;
        }

        this.stats.highestConfidence = this.player.confidence;
        this.stats.highestSkills = this.player.skills;
        this.gameStarted = true;
        this.generateJobs();
    },

    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    updateResource(resource, amount) {
        if (resource === "energy") {
            this.player.energy = this.clamp(this.player.energy + amount, 0, 100);
        } else if (resource === "skills") {
            this.player.skills = this.clamp(this.player.skills + amount, 0, 100);
            if (this.player.skills > this.stats.highestSkills) {
                this.stats.highestSkills = this.player.skills;
            }
        } else if (resource === "confidence") {
            this.player.confidence = this.clamp(this.player.confidence + amount, 0, 100);
            if (this.player.confidence > this.stats.highestConfidence) {
                this.stats.highestConfidence = this.player.confidence;
            }
        } else if (resource === "money") {
            this.player.money = Math.max(0, this.player.money + amount);
            if (amount > 0) this.stats.totalMoneyEarned += amount;
            if (amount < 0) this.stats.totalMoneySpent += Math.abs(amount);
        } else if (resource === "burnout") {
            this.burnout = this.clamp(this.burnout + amount, 0, 100);
        }
    },

    canAfford(energyCost, moneyCost) {
        return this.player.energy >= energyCost && this.player.money >= (moneyCost || 0);
    },

    generateJobs() {
        const diffKeys = Object.keys(GAME_DATA.difficulties);
        const numJobs = 25 + Math.floor(Math.random() * 8);

        for (let i = 0; i < numJobs; i++) {
            const diffKey = diffKeys[Math.floor(Math.random() * diffKeys.length)];
            const diff = GAME_DATA.difficulties[diffKey];
            const company = GAME_DATA.companies[Math.floor(Math.random() * GAME_DATA.companies.length)];
            const role = GAME_DATA.roles[Math.floor(Math.random() * GAME_DATA.roles.length)];
            const location = GAME_DATA.locations[Math.floor(Math.random() * GAME_DATA.locations.length)];
            const salary = diff.salaryMin + Math.random() * (diff.salaryMax - diff.salaryMin);
            const skillReq = diff.skillMin + Math.floor(Math.random() * (diff.skillMax - diff.skillMin));

            this.jobs.push({
                id: `job_${Date.now()}_${i}`,
                company,
                role,
                difficulty: diffKey,
                difficultyLabel: diff.label,
                salary: Math.round(salary * 10) / 10,
                location,
                skillRequirement: skillReq,
                status: "open",
                rounds: [...diff.rounds],
                currentRound: 0,
                hasReferral: false,
                interviewScore: 0,
                dayApplied: 0,
                expiresDay: this.day + 15 + Math.floor(Math.random() * 10)
            });
        }
    },

    addEventToLog(text, type) {
        this.eventsLog.unshift({ text, type, day: this.day });
        if (this.eventsLog.length > 50) this.eventsLog.pop();
    },

    addCalendarEvent(day, type, text) {
        this.calendarEvents.push({ day, type, text });
    },

    getPipelineCounts() {
        const counts = { applied: 0, oa: 0, interview: 0, final: 0, offer: 0, rejected: 0 };
        this.jobs.forEach(j => {
            if (j.status === "applied") counts.applied++;
            else if (j.status === "oa") counts.oa++;
            else if (j.status === "interview") counts.interview++;
            else if (j.status === "final") counts.final++;
            else if (j.status === "offer") counts.offer++;
            else if (j.status === "rejected") counts.rejected++;
        });
        return counts;
    },

    getOpenJobs() {
        return this.jobs.filter(j => j.status === "open" && j.expiresDay > this.day);
    },

    getAppliedJobs() {
        return this.jobs.filter(j => j.status !== "open" && j.status !== "expired" && j.status !== "rejected");
    },

    getInterviewJobs() {
        return this.jobs.filter(j => j.status === "interview" || j.status === "oa" || j.status === "final");
    },

    getOfferJobs() {
        return this.jobs.filter(j => j.status === "offer");
    },

    save() {
        try {
            const data = JSON.stringify({
                player: this.player,
                day: this.day,
                jobs: this.jobs,
                applications: this.applications,
                completedProjects: this.completedProjects,
                certifications: this.certifications,
                resumeQuality: this.resumeQuality,
                atsScore: this.atsScore,
                burnout: this.burnout,
                stats: this.stats,
                eventsLog: this.eventsLog.slice(0, 20),
                calendarEvents: this.calendarEvents,
                gameStarted: this.gameStarted,
                gameOver: this.gameOver,
                pendingInterviewJobs: this.pendingInterviewJobs
            });
            localStorage.setItem("placement_season_save", data);
            return true;
        } catch (e) {
            console.error("Save failed:", e);
            return false;
        }
    },

    load() {
        try {
            const data = localStorage.getItem("placement_season_save");
            if (!data) return false;
            const parsed = JSON.parse(data);
            Object.assign(this.player, parsed.player);
            this.day = parsed.day;
            this.jobs = parsed.jobs || [];
            this.applications = parsed.applications || [];
            this.completedProjects = parsed.completedProjects || [];
            this.certifications = parsed.certifications || [];
            this.resumeQuality = parsed.resumeQuality || 35;
            this.atsScore = parsed.atsScore || 35;
            this.burnout = parsed.burnout || 0;
            Object.assign(this.stats, parsed.stats);
            this.eventsLog = parsed.eventsLog || [];
            this.calendarEvents = parsed.calendarEvents || [];
            this.gameStarted = parsed.gameStarted || false;
            this.gameOver = parsed.gameOver || false;
            this.pendingInterviewJobs = parsed.pendingInterviewJobs || [];
            this.currentInterview = null;
            this.currentEvent = null;
            this.actionsToday = 0;
            return true;
        } catch (e) {
            console.error("Load failed:", e);
            this.clearSave();
            return false;
        }
    },

    hasSave() {
        return localStorage.getItem("placement_season_save") !== null;
    },

    clearSave() {
        localStorage.removeItem("placement_season_save");
    }
};
