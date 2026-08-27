# Placement Season

**30 days. One offer. Don't give up.**

A browser-based life simulator where you play as a final-year college fresher trying to land a software engineering job in 30 days.

## Features

- **Resource Management**: Balance Energy, Skills, Confidence, and Money
- **8 Daily Actions**: Apply jobs, practice DSA, build projects, learn tech, network, prepare resume, attend interviews, rest
- **20+ Fictional Companies** with unique job postings
- **Interview Mini-Game**: 4 question types (MCQ, Debugging, Output Prediction, Behavioral)
- **Dynamic Event System**: Random events with meaningful choices
- **Burnout System**: Push too hard and face consequences
- **Resume & Project System**: Build your profile throughout the game
- **6 Unique Endings**: Based on your performance and decisions
- **Full Save/Load System**: Auto-save after every action
- **Web Audio API Sounds**: Procedural audio feedback
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Beautiful Dark UI**: Modern developer aesthetic with animations

## Gameplay

1. Create your character (name, specialization, personality)
2. Each day, choose how to spend your limited time and energy
3. Apply to jobs, practice skills, build projects, and network
4. Attend interviews when opportunities arise
5. Manage burnout by resting periodically
6. Try to get at least one job offer in 30 days

## How to Run

Simply open `index.html` in a web browser. No server required.

```bash
# Or use a local server
npx serve .
```

## Project Structure

```
/
├── index.html
├── style.css
├── js/
│   ├── main.js       # Entry point, event binding
│   ├── game.js       # Game loop, endings
│   ├── state.js      # Game state management
│   ├── jobs.js       # Job generation & application logic
│   ├── interviews.js # Interview mini-game
│   ├── events.js     # Random event system
│   ├── actions.js    # Player action handlers
│   ├── audio.js      # Web Audio API sounds
│   ├── ui.js         # UI rendering & updates
│   └── data.js       # All game data
└── README.md
```

## Controls

- Click buttons to perform actions
- Use navigation tabs to switch views
- ESC to close modals
- Keyboard-friendly navigation

## Customization

### Adding Companies
Edit `js/data.js` → `GAME_DATA.companies` array

### Adding Questions
Edit `js/data.js` → `mcqQuestions`, `debuggingQuestions`, `outputQuestions`, `behavioralQuestions`

### Adding Events
Edit `js/data.js` → `GAME_DATA.events` array

## Deployment on GitHub Pages

1. Push to GitHub
2. Go to Settings → Pages
3. Select "main" branch
4. Your game will be live at `https://username.github.io/repo-name/`

## Credits

Made for every fresher who kept applying.
