const Interviews = {
    currentJob: null,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 5,
    timer: null,
    timeLeft: 30,
    answered: false,

    startInterview(jobId) {
        const job = Jobs.getJobById(jobId);
        if (!job) return;

        this.currentJob = job;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answered = false;

        this.totalQuestions = job.difficulty === "easy" ? 3 : job.difficulty === "medium" ? 4 : 5;

        this.questions = this.generateQuestions(job);

        UI.showScreen("screen-interview");
        document.getElementById("game-nav").style.display = "none";
        document.querySelector(".topbar").style.display = "none";

        this.updateInterviewUI();
        this.startTimer();
    },

    generateQuestions(job) {
        const questions = [];
        const allMCQ = [...GAME_DATA.mcqQuestions];
        const allDebug = [...GAME_DATA.debuggingQuestions];
        const allOutput = [...GAME_DATA.outputQuestions];
        const allBehavioral = [...GAME_DATA.behavioralQuestions];

        this.shuffle(allMCQ);
        this.shuffle(allDebug);
        this.shuffle(allOutput);
        this.shuffle(allBehavioral);

        const numTechnical = Math.ceil(this.totalQuestions * 0.6);
        const numBehavioral = this.totalQuestions - numTechnical;

        for (let i = 0; i < numTechnical && i < allMCQ.length; i++) {
            questions.push({ ...allMCQ[i], type: "mcq" });
        }

        if (allDebug.length > 0 && numTechnical > 2) {
            questions.push({ ...allDebug[0], type: "debug" });
        }

        if (allOutput.length > 0 && numTechnical > 3) {
            questions.push({ ...allOutput[0], type: "output" });
        }

        for (let i = 0; i < numBehavioral && i < allBehavioral.length; i++) {
            questions.push({ ...allBehavioral[i], type: "behavioral" });
        }

        this.shuffle(questions);
        return questions.slice(0, this.totalQuestions);
    },

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    },

    updateInterviewUI() {
        const job = this.currentJob;
        const roundName = GAME_DATA.roundNames[job.currentRound] || "Interview";

        document.getElementById("interview-company").textContent = job.company;
        document.getElementById("interview-role").textContent = job.role;
        document.getElementById("interview-round").textContent = roundName;
        document.getElementById("interview-difficulty").textContent = job.difficultyLabel;
        document.getElementById("interview-confidence").textContent = Math.round(GameState.player.confidence);
        document.getElementById("interview-qnum").textContent = `Question ${this.currentQuestionIndex + 1}/${this.questions.length}`;
        document.getElementById("interview-score").textContent = this.score;

        this.renderQuestion();
    },

    renderQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endInterview();
            return;
        }

        const q = this.questions[this.currentQuestionIndex];
        const area = document.getElementById("interview-question-area");
        const actions = document.getElementById("interview-actions");
        this.answered = false;

        let questionHTML = `<div class="question-type">${q.category || q.type}</div>`;
        questionHTML += `<div class="question-text">${q.question}</div>`;

        if (q.code) {
            questionHTML += `<div class="code-snippet">${this.escapeHtml(q.code)}</div>`;
        }

        area.innerHTML = questionHTML;

        actions.innerHTML = "";
        q.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "answer-btn";
            btn.textContent = typeof opt === "string" ? `${String.fromCharCode(65 + idx)}. ${opt}` : `${String.fromCharCode(65 + idx)}. ${opt.text}`;
            btn.addEventListener("click", () => this.answer(idx));
            actions.appendChild(btn);
        });

        this.startTimer();
    },

    answer(selectedIndex) {
        if (this.answered) return;
        this.answered = true;
        this.stopTimer();

        const q = this.questions[this.currentQuestionIndex];
        const isBehavioral = q.type === "behavioral";

        let isCorrect = false;
        let scoreGain = 0;

        if (isBehavioral) {
            const selectedOpt = q.options[selectedIndex];
            scoreGain = selectedOpt ? selectedOpt.score : 0;
            isCorrect = scoreGain >= 2;
        } else {
            const correctIndex = q.correct;
            isCorrect = selectedIndex === correctIndex;
            scoreGain = isCorrect ? (10 + Math.floor(GameState.player.confidence / 10)) : 0;
        }

        const buttons = document.querySelectorAll(".answer-btn");
        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (isBehavioral) {
                if (q.options[idx].score >= 3) btn.classList.add("correct");
                else if (q.options[idx].score <= 1) btn.classList.add("wrong");
            } else {
                if (idx === q.correct) btn.classList.add("correct");
                if (idx === selectedIndex && !isCorrect) btn.classList.add("wrong");
            }
        });

        if (isBehavioral) {
            this.score += scoreGain * 3;
            if (scoreGain >= 2) {
                Audio.play("correct");
                UI.showToast(`Good answer! +${scoreGain * 3} points`, "success");
            } else {
                Audio.play("wrong");
                UI.showToast("Could be better...", "warning");
            }
        } else {
            if (isCorrect) {
                this.score += scoreGain;
                Audio.play("correct");
                UI.showToast(`+${scoreGain} points!`, "success");
            } else {
                Audio.play("wrong");
                UI.showToast("Incorrect", "error");
            }
        }

        document.getElementById("interview-score").textContent = this.score;

        setTimeout(() => {
            this.currentQuestionIndex++;
            this.updateInterviewUI();
        }, 1200);
    },

    startTimer() {
        this.timeLeft = this.currentJob.difficulty === "easy" ? 40 : this.currentJob.difficulty === "medium" ? 30 : 25;
        document.getElementById("interview-timer").textContent = `${this.timeLeft}s`;

        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById("interview-timer").textContent = `${this.timeLeft}s`;

            if (this.timeLeft <= 0) {
                this.stopTimer();
                if (!this.answered) {
                    this.answer(-1);
                }
            }
        }, 1000);
    },

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    endInterview() {
        this.stopTimer();
        const job = this.currentJob;
        const maxScore = this.totalQuestions * (10 + 10);
        const percentage = this.score / maxScore;

        const skillBonus = GameState.player.skills / 100;
        const confBonus = GameState.player.confidence / 100;
        const finalScore = percentage * 0.6 + skillBonus * 0.25 + confBonus * 0.15;

        GameState.stats.interviewsCompleted++;
        GameState.stats.interviewScores.push(this.score);

        let result;
        if (finalScore >= 0.75) {
            result = "pass";
        } else if (finalScore >= 0.5) {
            result = "partial";
        } else {
            result = "fail";
        }

        const roundIndex = job.rounds.indexOf(job.currentRound);
        const isLastRound = roundIndex >= job.rounds.length - 1;

        if (result === "fail") {
            job.status = "rejected";
            GameState.stats.rejections++;
            GameState.addEventToLog(`面试失败: Failed ${job.company} interview`, "negative");
            this.showResult("FAILED", `${job.company} - ${job.role}`, "Better luck next time.", false);
        } else if (isLastRound && result === "pass") {
            job.status = "offer";
            GameState.stats.offers++;
            GameState.addEventToLog(`🎉 OFFER from ${job.company}!`, "positive");
            GameState.addCalendarEvent(GameState.day, "offer", `Offer from ${job.company}`);
            setTimeout(() => {
                UI.hideOffer();
                UI.showOffer(job);
            }, 500);
            this.showResult("PASSED!", `${job.company} - ${job.role}`, "You received an offer!", true);
        } else if (result === "pass") {
            Jobs.advanceJobStatus(job.id);
            const nextRound = GAME_DATA.roundNames[job.currentRound] || "Next Round";
            GameState.addEventToLog(`通过: Passed ${job.company} ${nextRound}`, "positive");
            this.showResult("PASSED!", `${job.company} - ${job.role}`, `Next: ${nextRound}`, true);
        } else {
            Jobs.advanceJobStatus(job.id);
            GameState.addEventToLog(`勉强通过: Barely passed ${job.company}`, "neutral");
            this.showResult("PASSED (barely)", `${job.company} - ${job.role}`, "Moving to next round.", true);
        }

        GameState.updateResource("confidence", result === "pass" ? 5 : result === "fail" ? -8 : 2);
        GameState.updateResource("energy", -10);
    },

    showResult(title, subtitle, message, success) {
        const area = document.getElementById("interview-question-area");
        const actions = document.getElementById("interview-actions");

        area.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">${success ? '🎉' : '😞'}</div>
                <h2 style="margin-bottom: 8px;">${title}</h2>
                <p style="color: var(--text-secondary); margin-bottom: 4px;">${subtitle}</p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">${message}</p>
                <p style="margin-top: 12px;">Score: ${this.score} / ${this.totalQuestions * 20}</p>
            </div>
        `;

        actions.innerHTML = `
            <button class="menu-btn btn-primary" onclick="Interviews.exitInterview()" style="width: 100%;">
                Continue
            </button>
        `;
    },

    exitInterview() {
        this.currentJob = null;
        this.questions = [];
        UI.showScreen("screen-game");
        document.getElementById("game-nav").style.display = "";
        document.querySelector(".topbar").style.display = "";
        UI.showView("dashboard");
        UI.updateResources();
        UI.updatePipeline();
        UI.renderActions();
        UI.renderEventsLog();
    },

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
};
