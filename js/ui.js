const UI = {
    showScreen(screenId) {
        document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.add("active");
    },

    showView(viewId) {
        document.querySelectorAll(".game-view").forEach(v => v.classList.remove("active"));
        document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
        const view = document.getElementById(`view-${viewId}`);
        if (view) view.classList.add("active");
        const navBtn = document.querySelector(`.nav-btn[data-screen="${viewId}"]`);
        if (navBtn) navBtn.classList.add("active");
    },

    updateResources() {
        const p = GameState.player;
        document.getElementById("res-energy-val").textContent = `${Math.round(p.energy)}/100`;
        document.getElementById("res-skills-val").textContent = `${Math.round(p.skills)}/100`;
        document.getElementById("res-confidence-val").textContent = `${Math.round(p.confidence)}/100`;
        document.getElementById("res-money-val").textContent = `₹${p.money.toLocaleString()}`;

        document.getElementById("bar-energy").style.width = `${p.energy}%`;
        document.getElementById("bar-skills").style.width = `${p.skills}%`;
        document.getElementById("bar-confidence").style.width = `${p.confidence}%`;

        if (p.energy <= 20) {
            document.getElementById("bar-energy").style.background = "linear-gradient(90deg, #e17055, #d63031)";
        } else {
            document.getElementById("bar-energy").style.background = "";
        }
    },

    updateTopBar() {
        document.getElementById("topbar-day").textContent = `DAY ${GameState.day} / ${GameState.maxDays}`;
    },

    updateDayInfo() {
        const daysLeft = GameState.maxDays - GameState.day;
        document.getElementById("day-label").textContent = `DAY ${GameState.day}`;
        document.getElementById("day-sub").textContent = daysLeft > 0
            ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left. Make them count.`
            : "Last day. Give it everything.";
    },

    updatePipeline() {
        const counts = GameState.getPipelineCounts();
        document.getElementById("pipe-applied").textContent = counts.applied;
        document.getElementById("pipe-oa").textContent = counts.oa;
        document.getElementById("pipe-interview").textContent = counts.interview;
        document.getElementById("pipe-final").textContent = counts.final;
        document.getElementById("pipe-offer").textContent = counts.offer;
    },

    renderActions() {
        const grid = document.getElementById("actions-grid");
        grid.innerHTML = "";

        GAME_DATA.actions.forEach(action => {
            const btn = document.createElement("button");
            btn.className = "action-card-btn";

            const hasInterview = GameState.getInterviewJobs().length > 0;
            let disabled = false;
            let reason = "";

            if (action.onlyIfInterview && !hasInterview) {
                disabled = true;
                reason = "No interview scheduled";
            } else if (!action.onlyIfInterview && action.id !== "rest") {
                if (!GameState.canAfford(action.energyCost, action.moneyCost)) {
                    disabled = true;
                    reason = action.energyCost > GameState.player.energy ? "Not enough energy" : "Not enough money";
                }
            } else if (action.id === "rest" && GameState.player.energy >= 100) {
                disabled = true;
                reason = "Energy is full";
            }

            btn.disabled = disabled;
            btn.title = disabled ? reason : action.description;

            const costText = action.id === "rest"
                ? `+${action.energyGain} Energy`
                : action.moneyCost > 0
                    ? `${action.energyCost} Energy, ₹${action.moneyCost}`
                    : `${action.energyCost} Energy`;

            btn.innerHTML = `
                <span class="action-icon">${action.icon}</span>
                <span class="action-name">${action.name}</span>
                <span class="action-cost">${costText}</span>
                <span class="action-gain">${action.gains}</span>
            `;

            btn.addEventListener("click", () => {
                if (!disabled) {
                    Audio.play("click");
                    Actions.perform(action.id);
                }
            });

            grid.appendChild(btn);
        });
    },

    renderEventsLog() {
        const log = document.getElementById("events-log");
        if (GameState.eventsLog.length === 0) {
            log.innerHTML = '<p class="events-empty">No events yet. Start your day!</p>';
            return;
        }
        log.innerHTML = GameState.eventsLog.slice(0, 10).map(e =>
            `<div class="event-log-item ${e.type}">${e.text}</div>`
        ).join("");
    },

    renderJobs(filter = "all") {
        const list = document.getElementById("jobs-list");
        let jobs = GameState.jobs;

        switch (filter) {
            case "open": jobs = jobs.filter(j => j.status === "open"); break;
            case "applied": jobs = jobs.filter(j => ["applied", "oa", "interview", "final"].includes(j.status)); break;
            case "interview": jobs = jobs.filter(j => ["interview", "oa", "final"].includes(j.status)); break;
            case "offers": jobs = jobs.filter(j => j.status === "offer"); break;
        }

        if (jobs.length === 0) {
            list.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">No jobs found.</p>';
            return;
        }

        list.innerHTML = jobs.map(job => {
            const statusClass = `status-${job.status}`;
            const diffClass = `diff-${job.difficulty}`;
            const isExpired = job.expiresDay <= GameState.day;

            let actionBtn = "";
            if (job.status === "open" && !isExpired) {
                const canApply = GameState.canAfford(10, 0) && GameState.player.energy >= 10;
                actionBtn = `<button class="job-apply-btn" onclick="Actions.applyToJob('${job.id}')" ${!canApply ? 'disabled' : ''}>Apply</button>`;
            } else if (job.status === "interview" || job.status === "oa" || job.status === "final") {
                actionBtn = `<button class="job-apply-btn" onclick="Game.startInterview('${job.id}')" style="background: var(--confidence-color)">Start Interview</button>`;
            }

            return `
                <div class="job-card">
                    <div>
                        <div class="job-company">${job.company}</div>
                        <div class="job-role">${job.role}</div>
                        <div class="job-details">
                            <span class="job-detail"><strong>Required:</strong> ${job.skillRequirement}+ Skills</span>
                            <span class="job-detail"><strong>Salary:</strong> ₹${job.salary} LPA</span>
                            <span class="job-detail"><strong>Location:</strong> ${job.location}</span>
                            <span class="job-difficulty ${diffClass}">${job.difficultyLabel}</span>
                        </div>
                    </div>
                    <div class="job-actions">
                        <span class="job-status ${statusClass}">${isExpired ? 'EXPIRED' : job.status.toUpperCase()}</span>
                        ${actionBtn}
                    </div>
                </div>
            `;
        }).join("");
    },

    renderResume() {
        const spec = GAME_DATA.specializations[GameState.player.spec];
        document.getElementById("resume-name").textContent = GameState.player.name;
        document.getElementById("resume-spec").textContent = spec.name;

        const skillsDiv = document.getElementById("resume-skills-list");
        const baseSkills = [...spec.skills];
        const allSkills = [...baseSkills];
        if (GameState.completedProjects.length > 0) allSkills.push("Git");
        if (GameState.completedProjects.length > 2) allSkills.push("Docker");
        if (GameState.certifications.length > 0) allSkills.push("Cloud");
        skillsDiv.innerHTML = allSkills.map(s => `<span class="skill-tag">${s}</span>`).join("");

        const projDiv = document.getElementById("resume-projects-list");
        if (GameState.completedProjects.length === 0) {
            projDiv.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No projects yet. Build some!</p>';
        } else {
            projDiv.innerHTML = GameState.completedProjects.map(p =>
                `<div class="project-item">${p.icon} ${p.name}</div>`
            ).join("");
        }

        const certsDiv = document.getElementById("resume-certs-list");
        if (GameState.certifications.length === 0) {
            certsDiv.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">None yet.</p>';
        } else {
            certsDiv.innerHTML = GameState.certifications.map(c =>
                `<div class="project-item">🏅 ${c}</div>`
            ).join("");
        }

        document.getElementById("resume-ats").textContent = GameState.atsScore;
        const quality = GameState.resumeQuality;
        let qLabel = "Basic";
        if (quality >= 80) qLabel = "Outstanding";
        else if (quality >= 60) qLabel = "Strong";
        else if (quality >= 45) qLabel = "Good";
        else if (quality >= 30) qLabel = "Decent";
        document.getElementById("resume-quality").textContent = qLabel;
        document.getElementById("resume-total-score").textContent = GameState.resumeQuality;
    },

    renderProjects() {
        const grid = document.getElementById("projects-grid");
        grid.innerHTML = GAME_DATA.projects.map(proj => {
            const built = GameState.completedProjects.some(p => p.id === proj.id);
            const canBuild = !built && GameState.canAfford(proj.energyCost, proj.moneyCost);

            return `
                <div class="project-card ${built ? 'built' : ''}">
                    <span class="project-icon">${proj.icon}</span>
                    <div class="project-name">${proj.name}</div>
                    <div class="project-desc">${proj.description}</div>
                    <div class="project-bonus">+${proj.skillGain} Skills, +${proj.resumeGain} Resume</div>
                    <div class="project-cost">Cost: ${proj.energyCost} Energy${proj.moneyCost > 0 ? `, ₹${proj.moneyCost}` : ''}</div>
                    <button class="project-build-btn ${built ? 'built-btn' : ''}"
                        ${!canBuild ? 'disabled' : ''}
                        onclick="Actions.buildProject('${proj.id}')">
                        ${built ? '✓ Built' : 'Build Project'}
                    </button>
                </div>
            `;
        }).join("");
    },

    renderCalendar() {
        const grid = document.getElementById("calendar-grid");
        grid.innerHTML = "";

        for (let d = 1; d <= 30; d++) {
            const div = document.createElement("div");
            div.className = "calendar-day";

            if (d < GameState.day) div.classList.add("past");
            else if (d === GameState.day) div.classList.add("current");
            else div.classList.add("future");

            const dayEvents = GameState.calendarEvents.filter(e => e.day === d);
            dayEvents.forEach(e => {
                if (e.type === "interview") div.classList.add("has-interview");
                else if (e.type === "offer") div.classList.add("has-offer");
                else if (e.type === "event") div.classList.add("has-event");
            });

            div.textContent = d;
            grid.appendChild(div);
        }
    },

    renderStats() {
        const grid = document.getElementById("stats-grid");
        const s = GameState.stats;
        const totalApps = s.applicationsSent;
        const responseRate = totalApps > 0 ? Math.round(((s.interviewsCompleted + s.finalRounds + s.offers) / totalApps) * 100) : 0;
        const interviewRate = s.interviewsCompleted > 0 ? Math.round((s.offers / s.interviewsCompleted) * 100) : 0;
        const avgScore = s.interviewScores.length > 0
            ? Math.round(s.interviewScores.reduce((a, b) => a + b, 0) / s.interviewScores.length)
            : 0;

        const statsData = [
            { label: "Applications Sent", value: s.applicationsSent },
            { label: "Response Rate", value: `${responseRate}%` },
            { label: "Interviews", value: s.interviewsCompleted },
            { label: "Final Rounds", value: s.finalRounds },
            { label: "Offers", value: s.offers },
            { label: "Rejections", value: s.rejections },
            { label: "Offer Rate", value: `${interviewRate}%` },
            { label: "Avg Interview Score", value: avgScore },
            { label: "Days Remaining", value: GameState.maxDays - GameState.day },
            { label: "Money Earned", value: `₹${s.totalMoneyEarned.toLocaleString()}` },
            { label: "Money Spent", value: `₹${s.totalMoneySpent.toLocaleString()}` },
            { label: "Projects Built", value: s.projectsBuilt },
            { label: "Certs Earned", value: s.certsEarned },
            { label: "Highest Skills", value: s.highestSkills },
            { label: "Highest Confidence", value: s.highestConfidence },
            { label: "Days Worked", value: s.daysWorked },
            { label: "Days Rested", value: s.daysRested },
            { label: "Burnout", value: `${GameState.burnout}%` }
        ];

        grid.innerHTML = statsData.map(s =>
            `<div class="stat-card">
                <div class="stat-value">${s.value}</div>
                <div class="stat-label">${s.label}</div>
            </div>`
        ).join("");
    },

    showToast(message, type = "info") {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    showFloatingText(text, positive, x, y) {
        const container = document.getElementById("floating-text-container");
        const el = document.createElement("div");
        el.className = `floating-text ${positive ? 'positive' : 'negative'}`;
        el.textContent = text;
        el.style.left = (x || window.innerWidth / 2) + "px";
        el.style.top = (y || window.innerHeight / 2) + "px";
        container.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    },

    showDaySummary(changes) {
        const modal = document.getElementById("modal-day-summary");
        const body = document.getElementById("summary-body");
        const daysLeft = GameState.maxDays - GameState.day;

        document.getElementById("summary-title").textContent = `Day ${GameState.day} Complete`;

        let html = "";
        changes.forEach(c => {
            const sign = c.amount > 0 ? "+" : "";
            const cls = c.amount > 0 ? "positive" : "negative";
            html += `<div class="summary-item">
                <span>${c.label}</span>
                <span class="change ${cls}">${sign}${c.amount}${c.suffix || ''}</span>
            </div>`;
        });

        html += `<div class="summary-item"><span>Days Remaining</span><span>${daysLeft}</span></div>`;
        body.innerHTML = html;
        modal.classList.add("active");
    },

    hideDaySummary() {
        document.getElementById("modal-day-summary").classList.remove("active");
    },

    showEvent(event, choices) {
        const modal = document.getElementById("modal-event");
        document.getElementById("event-icon").textContent = event.icon;
        document.getElementById("event-title").textContent = event.title;
        document.getElementById("event-desc").textContent = event.description;
        const choicesDiv = document.getElementById("event-choices");
        choicesDiv.innerHTML = "";

        choices.forEach((choice, idx) => {
            const btn = document.createElement("button");
            btn.className = "event-choice-btn";
            btn.textContent = choice.label;
            btn.addEventListener("click", () => {
                Audio.play("click");
                Events.resolveChoice(idx);
            });
            choicesDiv.appendChild(btn);
        });

        modal.classList.add("active");
    },

    hideEvent() {
        document.getElementById("modal-event").classList.remove("active");
    },

    showOffer(job) {
        const modal = document.getElementById("modal-offer");
        const content = document.getElementById("offer-content");
        content.innerHTML = `
            <h1>🎉 OFFER RECEIVED!</h1>
            <div class="offer-company">${job.company}</div>
            <div class="offer-role">${job.role}</div>
            <div class="offer-salary">₹${job.salary} LPA</div>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">Location: ${job.location}</p>
            <div class="offer-buttons">
                <button class="menu-btn btn-primary" onclick="Game.acceptOffer('${job.id}')">ACCEPT OFFER</button>
                <button class="menu-btn btn-secondary" onclick="Game.declineOffer('${job.id}')">KEEP SEARCHING</button>
            </div>
        `;
        modal.classList.add("active");
        Audio.play("offer");
    },

    hideOffer() {
        document.getElementById("modal-offer").classList.remove("active");
    },

    renderEnding(ending) {
        const content = document.getElementById("ending-content");
        content.innerHTML = `
            <div class="ending-title">${ending.title}</div>
            <div class="ending-subtitle">${ending.subtitle}</div>
            <div class="ending-stats">
                <div class="ending-stat"><span class="stat-label">Days Survived</span><span class="stat-value">${ending.days}</span></div>
                <div class="ending-stat"><span class="stat-label">Applications</span><span class="stat-value">${ending.apps}</span></div>
                <div class="ending-stat"><span class="stat-label">Interviews</span><span class="stat-value">${ending.interviews}</span></div>
                <div class="ending-stat"><span class="stat-label">Offers</span><span class="stat-value">${ending.offers}</span></div>
                <div class="ending-stat"><span class="stat-label">Final Skills</span><span class="stat-value">${ending.skills}</span></div>
                <div class="ending-stat"><span class="stat-label">Confidence</span><span class="stat-value">${ending.confidence}</span></div>
                <div class="ending-stat"><span class="stat-label">Money</span><span class="stat-value">₹${ending.money.toLocaleString()}</span></div>
                <div class="ending-stat"><span class="stat-label">Best Salary</span><span class="stat-value">${ending.bestSalary || 'N/A'}</span></div>
            </div>
            <div class="ending-message">${ending.message}</div>
            <div class="ending-buttons">
                <button class="menu-btn btn-primary" onclick="Game.restart()">PLAY AGAIN</button>
                <button class="menu-btn btn-secondary" onclick="Game.goToMenu()">MAIN MENU</button>
            </div>
        `;
        this.showScreen("screen-ending");
    }
};
