const Jobs = {
    generateNewJobs(count) {
        const diffKeys = Object.keys(GAME_DATA.difficulties);
        for (let i = 0; i < count; i++) {
            const diffKey = diffKeys[Math.floor(Math.random() * diffKeys.length)];
            const diff = GAME_DATA.difficulties[diffKey];
            const company = GAME_DATA.companies[Math.floor(Math.random() * GAME_DATA.companies.length)];
            const role = GAME_DATA.roles[Math.floor(Math.random() * GAME_DATA.roles.length)];
            const location = GAME_DATA.locations[Math.floor(Math.random() * GAME_DATA.locations.length)];
            const salary = diff.salaryMin + Math.random() * (diff.salaryMax - diff.salaryMin);
            const skillReq = diff.skillMin + Math.floor(Math.random() * (diff.skillMax - diff.skillMin));

            GameState.jobs.push({
                id: `job_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`,
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
                expiresDay: GameState.day + 10 + Math.floor(Math.random() * 10)
            });
        }
    },

    expireOldJobs() {
        GameState.jobs.forEach(j => {
            if (j.status === "open" && j.expiresDay <= GameState.day) {
                j.status = "expired";
            }
        });
    },

    calculateApplicationSuccess(job) {
        const p = GameState.player;
        let baseChance = 0.3;

        const skillDiff = p.skills - job.skillRequirement;
        baseChance += skillDiff * 0.02;

        baseChance += (GameState.resumeQuality - 35) * 0.005;
        baseChance += (p.confidence - 50) * 0.003;

        if (job.hasReferral) baseChance += 0.25;

        switch (job.difficulty) {
            case "easy": baseChance += 0.15; break;
            case "medium": baseChance += 0.05; break;
            case "hard": baseChance -= 0.05; break;
            case "elite": baseChance -= 0.15; break;
        }

        if (GameState.burnout > 50) baseChance -= (GameState.burnout - 50) * 0.004;

        return GameState.clamp(baseChance, 0.05, 0.95);
    },

    processApplication(jobId) {
        const job = GameState.jobs.find(j => j.id === jobId);
        if (!job || job.status !== "open") return null;

        const success = this.calculateApplicationSuccess(job);
        const roll = Math.random();

        job.dayApplied = GameState.day;

        if (roll < success * 0.3) {
            job.status = "oa";
            GameState.addEventToLog(`OA邀请: ${job.company} invited you for Online Assessment`, "positive");
            return "oa";
        } else if (roll < success * 0.6) {
            job.status = "interview";
            GameState.addEventToLog(`面试邀请: ${job.company} invited you for interview`, "positive");
            return "interview";
        } else if (roll < success * 0.85) {
            job.status = "applied";
            GameState.addEventToLog(`申请已发送: Applied to ${job.company}`, "neutral");
            return "applied";
        } else {
            job.status = "rejected";
            GameState.stats.rejections++;
            GameState.addEventToLog(`被拒: Rejected by ${job.company}`, "negative");
            return "rejected";
        }
    },

    advanceJobStatus(jobId) {
        const job = GameState.jobs.find(j => j.id === jobId);
        if (!job) return;

        const roundIndex = job.rounds.indexOf(job.currentRound);

        if (roundIndex < job.rounds.length - 1) {
            job.currentRound = job.rounds[roundIndex + 1];
            if (job.currentRound === job.rounds[job.rounds.length - 1]) {
                job.status = "final";
            } else {
                job.status = "interview";
            }
        } else {
            job.status = "interview";
        }
    },

    getJobById(id) {
        return GameState.jobs.find(j => j.id === id);
    }
};
