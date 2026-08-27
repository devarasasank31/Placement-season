<p align="center">
  <img src="https://img.shields.io/badge/PLAY-NOW-brightgreen?style=for-the-badge&logo=javascript&logoColor=white" alt="Play Now">
  <img src="https://img.shields.io/badge/VERSION-1.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/ZERO-DEPENDENCIES-red?style=for-the-badge" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/LICENSE-MIT-yellow?style=for-the-badge" alt="License">
</p>

<h1 align="center">🎯 PLACEMENT SEASON</h1>

<p align="center">
  <b>30 days. One offer. Don't give up.</b><br>
  <i>A browser-based life simulator where you play as a final-year fresher trying to land a software engineering job in 30 days.</i>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-play-online">Play Online</a> •
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-customization">Customize</a> •
  <a href="#-deploy">Deploy</a>
</p>

---

## 🚀 Quick Start

### **Option 1: Clone & Run (Recommended)**

```bash
# 1. Clone the repository
git clone https://github.com/devarasasank31/Placement-season.git

# 2. Navigate into the project
cd Placement-season

# 3. Open index.html in your browser
# Windows:
start index.html

# macOS:
open index.html

# Linux:
xdg-open index.html
```

### **Option 2: One-Line Install**

```bash
git clone https://github.com/devarasasank31/Placement-season.git && cd Placement-season && start index.html
```

### **Option 3: No Git? Just Download**

1. Click **Code** → **Download ZIP** on the GitHub page
2. Extract the ZIP file
3. Double-click `index.html`

### **Option 4: Live Server (Optional)**

```bash
# Using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# Or use any local server
npx serve .
python -m http.server 8000
```

**That's it. No build step. No npm install. No configuration. Just open and play.**

---

## 🌐 Play Online

**[Click here to play instantly](https://devarasasank31.github.io/Placement-season/)**

> No download required. Works on any device with a modern browser.

---

## 🎮 Features

<table>
<tr>
<td width="50%">

### 🧠 Resource Management
- **Energy** — Power your daily actions
- **Skills** — Technical ability for interviews
- **Confidence** — Affects interview performance
- **Money** — Spend on courses, projects, expenses

</td>
<td width="50%">

### ⚡ 8 Daily Actions
- Apply for Jobs
- Practice DSA
- Build Projects
- Learn Technology
- Network on LinkedIn
- Prepare Resume
- Attend Interviews
- Rest

</td>
</tr>
<tr>
<td>

### 💼 20+ Fictional Companies
NovaStack, ByteForge, CloudNest, CodeOrbit, PixelGrid, DataPulse, DevNexus, QuantumWorks, FinEdge, Buildly, and more...

</td>
<td>

### 🎯 Interview Mini-Game
- Multiple Choice Questions
- Debugging Challenges
- Output Prediction
- Behavioral Questions

</td>
</tr>
<tr>
<td>

### 🎲 20+ Random Events
Recruiter messages, friend offers, laptop breakdowns, burnout warnings, startup outreach, campus drives, and more.

</td>
<td>

### 🏆 6 Unique Endings
- 🌟 Dream Offer
- 🎉 Great Offer
- ✅ Offer Secured
- 💪 Keep Going
- 😔 Still Searching
- 😵 Burnout

</td>
</tr>
</table>

### ✨ Additional Features

| Feature | Description |
|---------|-------------|
| 💾 **Auto-Save** | Saves after every action via localStorage |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |
| 🔊 **Sound Effects** | Web Audio API procedural sounds |
| 🎨 **Dark Theme** | Modern developer aesthetic with animations |
| 📊 **Statistics** | Detailed performance tracking |
| 📅 **Calendar** | Visual 30-day timeline |
| 📄 **Resume Builder** | Improve your resume throughout the game |
| 🔧 **Project System** | Build 10 different portfolio projects |
| 🏅 **Certifications** | Earn AWS, Google, Meta certificates |
| 🔥 **Burnout System** | Push too hard and face consequences |

---

## 📸 Screenshots

### Main Menu
```
╔══════════════════════════════════════╗
║                                      ║
║         PLACEMENT SEASON             ║
║    30 days. One offer. Don't give up.║
║                                      ║
║      [ START NEW GAME ]              ║
║      [ CONTINUE ]                    ║
║      [ HOW TO PLAY ]                 ║
║                                      ║
╚══════════════════════════════════════╝
```

### Dashboard
```
╔══════════════════════════════════════╗
║ DAY 14 / 30          💾 🔊          ║
╠══════════════════════════════════════╣
║ Dashboard │ Jobs │ Resume │ Projects ║
╠══════════════════════════════════════╣
║ RESOURCES          TODAY'S PLAN      ║
║ ⚡ Energy  72/100  DAY 14           ║
║ 🧠 Skills  48/100  16 days left     ║
║ 💪 Conf    61/100                   ║
║ 💰 Money   ₹1,850  [Apply] [DSA]   ║
║                    [Build] [Learn]   ║
║ PIPELINE            [Network] [Rest] ║
║ 📋12→ 📝3→ 🎯1→ ⭐0→ 🎉0           ║
╚══════════════════════════════════════╝
```

---

## 🛠️ Project Structure

```
Placement-season/
├── index.html          # Main HTML file
├── style.css           # All styles (dark theme)
├── README.md           # This file
├── js/
│   ├── main.js         # Entry point & event binding
│   ├── game.js         # Game loop & endings
│   ├── state.js        # State management & save/load
│   ├── data.js         # All game data (1000+ lines)
│   ├── jobs.js         # Job board & applications
│   ├── interviews.js   # Interview mini-game
│   ├── events.js       # Random event system
│   ├── actions.js      # Player action handlers
│   ├── audio.js        # Web Audio API sounds
│   └── ui.js           # UI rendering & updates
└── assets/             # (reserved for future)
```

---

## 🎯 How to Play

### Day 1-10: Foundation Phase
- Practice DSA to boost skills
- Build 1-2 projects
- Apply to easy/medium companies
- Network on LinkedIn

### Day 11-20: Intensify
- Apply aggressively
- Attend interviews
- Learn new technologies
- Build resume quality

### Day 21-30: Final Push
- Target hard/elite companies
- Maximize interview performance
- Balance rest to avoid burnout
- Accept the best offer!

---

## 🎨 Customization

### Add Your Own Companies
```javascript
// In js/data.js
GAME_DATA.companies.push("YourCompany");
```

### Add Custom Questions
```javascript
// In js/data.js
GAME_DATA.mcqQuestions.push({
    question: "Your question here?",
    options: ["A", "B", "C", "D"],
    correct: 0,
    category: "Custom"
});
```

### Add Custom Events
```javascript
// In js/data.js
GAME_DATA.events.push({
    id: "custom_event",
    title: "Your Event",
    icon: "⚡",
    description: "Something happened!",
    type: "positive",
    choices: [
        { label: "Option A", effects: { skills: 5 } },
        { label: "Option B", effects: { confidence: 3 } }
    ]
});
```

---

## 🚀 Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch, **/(root)** folder
5. Click **Save**
6. Your game is live at:
   ```
   https://devarasasank31.github.io/Placement-season/
   ```

---

## 🏗️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Structure & semantics |
| CSS3 | Styling, animations, gradients |
| Vanilla JavaScript | Game logic, no frameworks |
| localStorage | Save/load game state |
| Web Audio API | Procedural sound effects |
| CSS Grid/Flexbox | Responsive layouts |

**Zero dependencies. Zero build tools. Pure browser magic.**

---

## 📊 Game Statistics

- **13 files** created
- **5,000+ lines** of code
- **20+ fictional companies**
- **43+ technical questions**
- **15 behavioral questions**
- **10 debugging challenges**
- **10 output prediction questions**
- **20+ random events**
- **10 portfolio projects**
- **6 unique endings**
- **4 question types** in interviews
- **8 daily actions**
- **4 resource types**
- **5 specializations**
- **4 personality types**

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 💬 Made With

Made for every fresher who kept applying.

**If this game helped you prepare for placements, give it a ⭐!**

---

<p align="center">
  <a href="https://devarasasank31.github.io/Placement-season/">🎮 Play Now</a> •
  <a href="https://github.com/devarasasank31/Placement-season">⭐ Star on GitHub</a> •
  <a href="https://github.com/devarasasank31/Placement-season/issues">🐛 Report Bug</a>
</p>
