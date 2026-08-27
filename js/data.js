const GAME_DATA = {
    companies: [
        "NovaStack", "ByteForge", "CloudNest", "CodeOrbit", "PixelGrid",
        "DataPulse", "DevNexus", "QuantumWorks", "FinEdge", "Buildly",
        "TechSpring", "CoreLabs", "SynthWave", "ArcBit", "VoxelIO",
        "Zentra", "PrismTech", "LogicForge", "NeoByte", "CyberPulse"
    ],

    roles: [
        "SDE-1", "SDE-2", "Frontend Developer", "Backend Developer",
        "Full Stack Developer", "ML Engineer", "Data Engineer",
        "DevOps Engineer", "Cloud Engineer", "System Design Engineer"
    ],

    specializations: {
        java: { name: "Java Backend", skills: ["Java", "Spring Boot", "SQL", "System Design"] },
        python: { name: "Python", skills: ["Python", "Django", "ML", "Data Structures"] },
        fullstack: { name: "Full Stack", skills: ["JavaScript", "React", "Node.js", "MongoDB"] },
        dataai: { name: "Data / AI", skills: ["Python", "TensorFlow", "SQL", "Statistics"] },
        frontend: { name: "Frontend", skills: ["JavaScript", "React", "CSS", "TypeScript"] }
    },

    difficulties: {
        easy: { label: "Easy", skillMin: 25, skillMax: 40, salaryMin: 4, salaryMax: 6, rounds: [1, 2] },
        medium: { label: "Medium", skillMin: 40, skillMax: 60, salaryMin: 6, salaryMax: 10, rounds: [1, 2, 3] },
        hard: { label: "Hard", skillMin: 60, skillMax: 80, salaryMin: 10, salaryMax: 16, rounds: [1, 2, 3, 4] },
        elite: { label: "Elite", skillMin: 80, skillMax: 95, salaryMin: 16, salaryMax: 30, rounds: [1, 2, 3, 4, 5] }
    },

    roundNames: {
        1: "Online Assessment",
        2: "Technical Interview",
        3: "DSA / Coding",
        4: "Behavioral",
        5: "Final Round"
    },

    locations: [
        "Bengaluru", "Hyderabad", "Pune", "Mumbai", "Delhi NCR",
        "Chennai", "Gurugram", "Noida", "Remote", "Work from Home"
    ],

    actions: [
        {
            id: "apply",
            name: "Apply for Jobs",
            icon: "📋",
            energyCost: 10,
            moneyCost: 0,
            description: "Send applications to open positions",
            gains: "May generate interview opportunities"
        },
        {
            id: "dsa",
            name: "Practice DSA",
            icon: "🧩",
            energyCost: 20,
            moneyCost: 0,
            description: "Sharpen your problem-solving skills",
            gains: "+5 to +10 Skills"
        },
        {
            id: "project",
            name: "Build Project",
            icon: "🔧",
            energyCost: 25,
            moneyCost: 100,
            description: "Work on a portfolio project",
            gains: "+8 to +12 Skills"
        },
        {
            id: "learn",
            name: "Learn Technology",
            icon: "📚",
            energyCost: 20,
            moneyCost: 50,
            description: "Pick up a new tech skill",
            gains: "+6 Skills"
        },
        {
            id: "network",
            name: "Network on LinkedIn",
            icon: "🤝",
            energyCost: 10,
            moneyCost: 0,
            description: "Connect with professionals",
            gains: "+5 Confidence, referral chance"
        },
        {
            id: "resume",
            name: "Prepare Resume",
            icon: "📝",
            energyCost: 15,
            moneyCost: 0,
            description: "Polish your resume",
            gains: "Better application success"
        },
        {
            id: "interview",
            name: "Attend Interview",
            icon: "🎯",
            energyCost: 20,
            moneyCost: 0,
            description: "Take your scheduled interview",
            gains: "Performance-based outcome",
            onlyIfInterview: true
        },
        {
            id: "rest",
            name: "Rest",
            icon: "😴",
            energyCost: 0,
            moneyCost: 0,
            description: "Recover your energy",
            gains: "+30 Energy, small confidence",
            energyGain: 30
        }
    ],

    projects: [
        {
            id: "restapi",
            name: "REST API Backend",
            icon: "⚡",
            description: "Build a production-ready REST API with authentication",
            skillGain: 8,
            resumeGain: 5,
            energyCost: 25,
            moneyCost: 0
        },
        {
            id: "chatbot",
            name: "AI Chatbot",
            icon: "🤖",
            description: "Create a conversational AI using NLP techniques",
            skillGain: 10,
            resumeGain: 8,
            energyCost: 30,
            moneyCost: 150
        },
        {
            id: "ecommerce",
            name: "E-Commerce Platform",
            icon: "🛒",
            description: "Full-stack e-commerce with cart, payments, admin",
            skillGain: 12,
            resumeGain: 10,
            energyCost: 35,
            moneyCost: 200
        },
        {
            id: "dashboard",
            name: "Analytics Dashboard",
            icon: "📊",
            description: "Real-time data visualization dashboard",
            skillGain: 9,
            resumeGain: 7,
            energyCost: 25,
            moneyCost: 50
        },
        {
            id: "rag",
            name: "RAG Application",
            icon: "🔍",
            description: "Retrieval-Augmented Generation with vector search",
            skillGain: 11,
            resumeGain: 9,
            energyCost: 30,
            moneyCost: 100
        },
        {
            id: "datatool",
            name: "Data Analysis Tool",
            icon: "📈",
            description: "Python tool for data processing and visualization",
            skillGain: 7,
            resumeGain: 5,
            energyCost: 20,
            moneyCost: 0
        },
        {
            id: "devtool",
            name: "Developer CLI Tool",
            icon: "🛠️",
            description: "Command-line tool to boost developer productivity",
            skillGain: 8,
            resumeGain: 6,
            energyCost: 20,
            moneyCost: 0
        },
        {
            id: "social",
            name: "Social Media App",
            icon: "💬",
            description: "Full-stack social platform with real-time features",
            skillGain: 13,
            resumeGain: 11,
            energyCost: 40,
            moneyCost: 250
        },
        {
            id: "weather",
            name: "Weather Dashboard",
            icon: "🌤️",
            description: "Clean weather app with API integration",
            skillGain: 5,
            resumeGain: 3,
            energyCost: 15,
            moneyCost: 0
        },
        {
            id: "portfolio",
            name: "Personal Portfolio",
            icon: "🌐",
            description: "Stunning portfolio website to showcase your work",
            skillGain: 4,
            resumeGain: 6,
            energyCost: 15,
            moneyCost: 30
        }
    ],

    events: [
        {
            id: "recruiter_msg",
            title: "Recruiter Message",
            icon: "💬",
            description: "A recruiter from {company} viewed your profile and wants to chat.",
            type: "positive",
            choices: [
                { label: "Respond enthusiastically", effects: { confidence: 5, hasReferral: true } },
                { label: "Ignore", effects: { confidence: -2 } }
            ]
        },
        {
            id: "friend_offer",
            title: "Friend Got an Offer",
            icon: "🎉",
            description: "Your friend just got an offer at {company}. They encourage you to keep going.",
            type: "positive",
            choices: [
                { label: "Feel motivated", effects: { confidence: 8 } },
                { label: "Feel pressured", effects: { confidence: -3, skills: 2 } }
            ]
        },
        {
            id: "referral",
            title: "Referral Opportunity",
            icon: "🤝",
            description: "Someone at {company} is willing to refer you for a position.",
            type: "positive",
            choices: [
                { label: "Ask for referral", effects: { hasReferral: true, confidence: 5 } },
                { label: "Apply on my own", effects: { confidence: 3 } }
            ]
        },
        {
            id: "job_disappeared",
            title: "Job Posting Removed",
            icon: "❌",
            description: "A job you were eyeing at {company} has been taken down.",
            type: "negative",
            choices: [
                { label: "Move on", effects: { confidence: -3 } }
            ]
        },
        {
            id: "hiring_freeze",
            title: "Hiring Freeze",
            icon: "❄️",
            description: "{company} has frozen their hiring process. Your application is on hold.",
            type: "negative",
            choices: [
                { label: "Focus on other companies", effects: { confidence: -5 } }
            ]
        },
        {
            id: "resume_shortlisted",
            title: "Resume Shortlisted!",
            icon: "✅",
            description: "Great news! {company} has shortlisted your resume for the next round.",
            type: "positive",
            choices: [
                { label: "Celebrate!", effects: { confidence: 10 } }
            ]
        },
        {
            id: "rejection_email",
            title: "Rejection Email",
            icon: "😞",
            description: "You received a rejection from {company}. Better luck next time.",
            type: "negative",
            choices: [
                { label: "Stay resilient", effects: { confidence: -5, skills: 2 } },
                { label: "Take a break", effects: { energy: 15, confidence: -3 } }
            ]
        },
        {
            id: "recruiter_schedule",
            title: "Interview Scheduled",
            icon: "📅",
            description: "A recruiter from {company} wants to schedule your interview.",
            type: "positive",
            choices: [
                { label: "Accept for tomorrow", effects: { energy: -10, hasInterview: true } },
                { label: "Ask for later", effects: { confidence: -2 } }
            ]
        },
        {
            id: "hidden_job",
            title: "Hidden Job Opening",
            icon: "🔎",
            description: "You discovered an unlisted position at {company}.",
            type: "positive",
            choices: [
                { label: "Apply immediately", effects: { energy: -5, hasReferral: true } }
            ]
        },
        {
            id: "linkedin_attention",
            title: "LinkedIn Attention!",
            icon: "🔥",
            description: "Your recent post about a project is getting attention. Recruiters are noticing.",
            type: "positive",
            choices: [
                { label: "Keep posting", effects: { confidence: 12, skills: 3 } }
            ]
        },
        {
            id: "laptop_broken",
            title: "Laptop Issues",
            icon: "💻",
            description: "Your laptop is acting up. You need to get it repaired.",
            type: "negative",
            choices: [
                { label: "Pay ₹500 for repair", effects: { money: -500 } },
                { label: "Deal with it", effects: { energy: -15, confidence: -5 } }
            ]
        },
        {
            id: "burnout_warning",
            title: "Burnout Warning",
            icon: "⚠️",
            description: "You're feeling exhausted. Your body is telling you to rest.",
            type: "negative",
            choices: [
                { label: "Take a rest day", effects: { energy: 25, confidence: 5 } },
                { label: "Push through", effects: { burnout: 20, confidence: -10 } }
            ]
        },
        {
            id: "placement_drive",
            title: "Campus Placement Drive",
            icon: "🏫",
            description: "Your college announced a placement drive with multiple companies!",
            type: "positive",
            choices: [
                { label: "Register immediately", effects: { energy: -10, confidence: 8 } }
            ]
        },
        {
            id: "startup_outreach",
            title: "Startup Outreach",
            icon: "🚀",
            description: "A startup founder found your GitHub profile and is impressed.",
            type: "positive",
            choices: [
                { label: "Schedule a call", effects: { confidence: 10, hasInterview: true } },
                { label: "Politely decline", effects: { confidence: 2 } }
            ]
        },
        {
            id: "unexpected_interview",
            title: "Walk-in Interview",
            icon: "⚡",
            description: "{company} is conducting walk-in interviews today!",
            type: "positive",
            choices: [
                { label: "Go for it!", effects: { energy: -20, hasInterview: true } },
                { label: "Not prepared", effects: { confidence: -3 } }
            ]
        },
        {
            id: "mock_interview",
            title: "Mock Interview",
            icon: "🎓",
            description: "A senior is offering free mock interviews to help you prepare.",
            type: "positive",
            choices: [
                { label: "Accept", effects: { confidence: 8, skills: 3 } },
                { label: "Skip", effects: {} }
            ]
        },
        {
            id: "money_expense",
            title: "Unexpected Expense",
            icon: "💸",
            description: "You have an unexpected expense this month.",
            type: "negative",
            choices: [
                { label: "Pay ₹300", effects: { money: -300 } },
                { label: "Skip it", effects: { confidence: -5 } }
            ]
        },
        {
            id: "skill_boost",
            title: "Breakthrough!",
            icon: "💡",
            description: "Something clicked while studying. You had a learning breakthrough!",
            type: "positive",
            choices: [
                { label: "Ride the wave", effects: { skills: 10, confidence: 5 } }
            ]
        },
        {
            id: "bad_sleep",
            title: "Bad Night's Sleep",
            icon: "😫",
            description: "You couldn't sleep well last night. You're feeling groggy.",
            type: "negative",
            choices: [
                { label: "Push through", effects: { energy: -15 } },
                { label: "Take it easy today", effects: { energy: -5, confidence: -3 } }
            ]
        },
        {
            id: "code_contest",
            title: "Coding Contest",
            icon: "🏆",
            description: "There's an online coding contest happening this weekend.",
            type: "positive",
            choices: [
                { label: "Participate", effects: { energy: -20, skills: 8, confidence: 6 } },
                { label: "Skip", effects: {} }
            ]
        }
    ],

    mcqQuestions: [
        {
            question: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
            correct: 1,
            category: "DSA"
        },
        {
            question: "Which data structure is used for BFS traversal?",
            options: ["Stack", "Queue", "Heap", "Tree"],
            correct: 1,
            category: "DSA"
        },
        {
            question: "What does 'HTTP' stand for?",
            options: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "HyperText Transmission Process", "Home Tool Transfer Protocol"],
            correct: 0,
            category: "CS Basics"
        },
        {
            question: "Which sorting algorithm has average case O(n log n)?",
            options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
            correct: 2,
            category: "DSA"
        },
        {
            question: "What is a hash table's average lookup time?",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correct: 2,
            category: "DSA"
        },
        {
            question: "Which HTTP method is used to update a resource?",
            options: ["GET", "POST", "PUT", "DELETE"],
            correct: 2,
            category: "Web Dev"
        },
        {
            question: "What is the purpose of DNS?",
            options: ["Encrypt data", "Translate domain names to IP", "Manage databases", "Render web pages"],
            correct: 1,
            category: "Networking"
        },
        {
            question: "In Java, which keyword is used for inheritance?",
            options: ["implements", "extends", "inherits", "super"],
            correct: 1,
            category: "Java"
        },
        {
            question: "What does SQL stand for?",
            options: ["Structured Query Language", "Simple Query Language", "Standard Query Logic", "System Query Language"],
            correct: 0,
            category: "Databases"
        },
        {
            question: "Which protocol is used for secure web browsing?",
            options: ["HTTP", "FTP", "HTTPS", "SMTP"],
            correct: 2,
            category: "Networking"
        },
        {
            question: "What is the space complexity of merge sort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correct: 2,
            category: "DSA"
        },
        {
            question: "In JavaScript, what does '===' check?",
            options: ["Value only", "Type only", "Value and type", "Reference only"],
            correct: 2,
            category: "JavaScript"
        },
        {
            question: "What is a REST API?",
            options: ["A database query", "An architectural style for web services", "A programming language", "A CSS framework"],
            correct: 1,
            category: "Web Dev"
        },
        {
            question: "Which data structure uses LIFO principle?",
            options: ["Queue", "Stack", "Array", "Linked List"],
            correct: 1,
            category: "DSA"
        },
        {
            question: "What is the primary key in a database?",
            options: ["A foreign reference", "A unique identifier for a record", "An encrypted field", "An index"],
            correct: 1,
            category: "Databases"
        },
        {
            question: "What does 'OOP' stand for?",
            options: ["Object-Oriented Programming", "Open Online Platform", "Operational Output Process", "Ordered Object Protocol"],
            correct: 0,
            category: "CS Basics"
        },
        {
            question: "Which Git command creates a new branch?",
            options: ["git branch", "git checkout -b", "git new", "git fork"],
            correct: 1,
            category: "Git"
        },
        {
            question: "What is the time complexity of accessing an array element by index?",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correct: 2,
            category: "DSA"
        },
        {
            question: "In Python, which keyword defines a function?",
            options: ["function", "func", "def", "define"],
            correct: 2,
            category: "Python"
        },
        {
            question: "What does CSS stand for?",
            options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"],
            correct: 1,
            category: "Web Dev"
        },
        {
            question: "What is the purpose of a load balancer?",
            options: ["Encrypt traffic", "Distribute incoming requests", "Store data", "Render pages"],
            correct: 1,
            category: "System Design"
        },
        {
            question: "Which of these is NOT a JavaScript framework?",
            options: ["React", "Angular", "Django", "Vue"],
            correct: 2,
            category: "Web Dev"
        },
        {
            question: "What is recursion?",
            options: ["Loop iteration", "A function calling itself", "Parallel processing", "Memory allocation"],
            correct: 1,
            category: "DSA"
        },
        {
            question: "What does API stand for?",
            options: ["Application Programming Interface", "Advanced Protocol Integration", "Application Process Input", "Automated Program Interface"],
            correct: 0,
            category: "CS Basics"
        },
        {
            question: "Which data structure is best for priority queues?",
            options: ["Array", "Linked List", "Heap", "Stack"],
            correct: 2,
            category: "DSA"
        },
        {
            question: "What is a microservice architecture?",
            options: ["Single large application", "Suite of small independent services", "A database pattern", "A testing framework"],
            correct: 1,
            category: "System Design"
        },
        {
            question: "In SQL, which command is used to remove a table?",
            options: ["REMOVE", "DELETE", "DROP", "DESTROY"],
            correct: 2,
            category: "Databases"
        },
        {
            question: "What is the purpose of middleware?",
            options: ["Frontend rendering", "Software between OS and applications", "Database management", "File storage"],
            correct: 1,
            category: "Web Dev"
        },
        {
            question: "Which of these is a NoSQL database?",
            options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
            correct: 2,
            category: "Databases"
        },
        {
            question: "What is Big O notation used for?",
            options: ["Measuring code length", "Describing algorithm complexity", "Naming variables", "Commenting code"],
            correct: 1,
            category: "DSA"
        },
        {
            question: "What does CI/CD stand for?",
            options: ["Code Integration / Code Deployment", "Continuous Integration / Continuous Deployment", "Central Interface / Central Database", "Computer Intelligence / Computer Design"],
            correct: 1,
            category: "DevOps"
        },
        {
            question: "In React, what is a hook?",
            options: ["A CSS selector", "A function that lets you use state in functional components", "A database query", "An API call"],
            correct: 1,
            category: "Web Dev"
        },
        {
            question: "What is the difference between TCP and UDP?",
            options: ["TCP is faster", "TCP is reliable and ordered, UDP is faster but unreliable", "No difference", "UDP is encrypted"],
            correct: 1,
            category: "Networking"
        },
        {
            question: "What is a design pattern?",
            options: ["A UI layout", "A reusable solution to a common problem", "A database schema", "A testing method"],
            correct: 1,
            category: "System Design"
        },
        {
            question: "Which Java collection maintains insertion order?",
            options: ["HashSet", "TreeSet", "LinkedHashSet", "None of these"],
            correct: 2,
            category: "Java"
        },
        {
            question: "What is an index in a database?",
            options: ["A data structure to speed up queries", "A type of table", "A security feature", "A backup mechanism"],
            correct: 0,
            category: "Databases"
        },
        {
            question: "What does DOM stand for?",
            options: ["Document Object Model", "Data Object Management", "Digital Output Mode", "Document Order Map"],
            correct: 0,
            category: "Web Dev"
        },
        {
            question: "What is the use of 'git stash'?",
            options: ["Delete changes", "Temporarily store uncommitted changes", "Merge branches", "View history"],
            correct: 1,
            category: "Git"
        },
        {
            question: "Which algorithm is used for shortest path in a graph?",
            options: ["Binary Search", "Dijkstra's Algorithm", "Quick Sort", "BFS"],
            correct: 1,
            category: "DSA"
        },
        {
            question: "What is a closure in JavaScript?",
            options: ["A method to close a program", "A function that remembers its outer scope", "A way to close browser tabs", "A loop termination"],
            correct: 1,
            category: "JavaScript"
        },
        {
            question: "What is the purpose of Docker?",
            options: ["Version control", "Containerization for consistent environments", "Database management", "Frontend design"],
            correct: 1,
            category: "DevOps"
        },
        {
            question: "What is an event loop?",
            options: ["A loop that runs forever", "A mechanism that handles async operations", "A for-loop for events", "A UI component"],
            correct: 1,
            category: "JavaScript"
        },
        {
            question: "What does ACID stand for in databases?",
            options: ["Atomicity, Consistency, Isolation, Durability", "Automatic, Concurrent, Independent, Direct", "Applied, Cached, Indexed, Distributed", "Asynchronous, Consistent, Isolated, Dynamic"],
            correct: 0,
            category: "Databases"
        }
    ],

    debuggingQuestions: [
        {
            question: "What is wrong with this code?",
            code: "function add(a, b) {\n  return a + b;\n}\nconsole.log(add(5));",
            options: ["Missing return keyword", "Function needs async", "Missing second argument", "Syntax error in console.log"],
            correct: 2,
            category: "Debugging"
        },
        {
            question: "What is wrong with this code?",
            code: "const arr = [1, 2, 3];\narr.push(4);\narr = [5, 6];",
            options: ["push doesn't exist", "Can't reassign const variable", "Array syntax is wrong", "Nothing is wrong"],
            correct: 1,
            category: "Debugging"
        },
        {
            question: "What is wrong with this code?",
            code: "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}",
            options: ["Syntax error", "var has function scope issue", "setTimeout doesn't work", "Nothing is wrong"],
            correct: 1,
            category: "Debugging"
        },
        {
            question: "What is wrong with this code?",
            code: "class Animal {\n  constructor(name) { this.name = name; }\n}\nclass Dog extends Animal {\n  bark() { return this.name + ' says woof'; }\n}\nconst d = new Dog();\nconsole.log(d.bark());",
            options: ["extends syntax is wrong", "Missing super() call", "this.name doesn't exist", "Nothing is wrong"],
            correct: 1,
            category: "Debugging"
        },
        {
            question: "What is wrong with this code?",
            code: "const obj = { a: 1, b: 2 };\nif (obj.a = 3) {\n  console.log('yes');\n}",
            options: ["Should use ==", "Assignment in condition", "obj.a doesn't exist", "Syntax error"],
            correct: 1,
            category: "Debugging"
        },
        {
            question: "What is wrong with this code?",
            code: "let x = 10;\nwhile (x > 0) {\n  console.log(x);\n}",
            options: ["Missing braces", "Infinite loop - no x update", "let can't be used", "while syntax is wrong"],
            correct: 1,
            category: "Debugging"
        },
        {
            question: "What is wrong with this code?",
            code: "function greet() {\n  console.log(name);\n  var name = 'Alice';\n}",
            options: ["var is deprecated", "Variable used before declaration (hoisting issue)", "Missing return", "console.log syntax"],
            correct: 1,
            category: "Debugging"
        },
        {
            question: "What is wrong with this code?",
            code: "try {\n  JSON.parse('invalid');\n} catch(e) {\n  console.log(e.message);\n}",
            options: ["try-catch syntax is wrong", "JSON.parse doesn't throw", "Nothing is wrong", "catch needs a different parameter"],
            correct: 2,
            category: "Debugging"
        },
        {
            question: "What is wrong with this code?",
            code: "async function fetchData() {\n  const data = fetch('/api');\n  return data.json();\n}",
            options: ["async syntax is wrong", "Missing await before fetch", "fetch doesn't exist", "json() method doesn't exist"],
            correct: 1,
            category: "Debugging"
        },
        {
            question: "What is wrong with this code?",
            code: "let arr = [1, 2, 3];\nlet [a, ...b] = arr;\nconsole.log(b);",
            options: ["Spread syntax is wrong", "destructuring doesn't work", "Nothing is wrong", "b will be undefined"],
            correct: 2,
            category: "Debugging"
        }
    ],

    outputQuestions: [
        {
            question: "What is the output?",
            code: "console.log(typeof null);",
            options: ["'null'", "'undefined'", "'object'", "'boolean'"],
            correct: 2,
            category: "Output"
        },
        {
            question: "What is the output?",
            code: "console.log(1 + '2' + 3);",
            options: ["6", "'123'", "'33'", "123"],
            correct: 1,
            category: "Output"
        },
        {
            question: "What is the output?",
            code: "console.log([] == false);",
            options: ["true", "false", "TypeError", "undefined"],
            correct: 0,
            category: "Output"
        },
        {
            question: "What is the output?",
            code: "for (let i = 0; i < 5; i++) {\n  if (i === 3) break;\n  console.log(i);\n}",
            options: ["0 1 2 3", "0 1 2", "0 1 2 3 4", "0 1 2 3 4"],
            correct: 1,
            category: "Output"
        },
        {
            question: "What is the output?",
            code: "console.log('hello'.toUpperCase());",
            options: ["'Hello'", "'HELLO'", "'hello'", "Error"],
            correct: 1,
            category: "Output"
        },
        {
            question: "What is the output?",
            code: "console.log(0.1 + 0.2 === 0.3);",
            options: ["true", "false", "undefined", "NaN"],
            correct: 1,
            category: "Output"
        },
        {
            question: "What is the output?",
            code: "let x = [1, 2, 3].map(n => n * 2);\nconsole.log(x);",
            options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "undefined"],
            correct: 1,
            category: "Output"
        },
        {
            question: "What is the output?",
            code: "console.log(typeof NaN);",
            options: ["'NaN'", "'undefined'", "'number'", "'object'"],
            correct: 2,
            category: "Output"
        },
        {
            question: "What is the output?",
            code: "let a = { x: 1 };\nlet b = a;\nb.x = 2;\nconsole.log(a.x);",
            options: ["1", "2", "undefined", "Error"],
            correct: 1,
            category: "Output"
        },
        {
            question: "What is the output?",
            code: "console.log([...'hello'].length);",
            options: ["1", "5", "undefined", "Error"],
            correct: 1,
            category: "Output"
        }
    ],

    behavioralQuestions: [
        {
            question: "Tell me about a challenging project you worked on.",
            options: [
                { text: "Describe a full-stack project with clear impact", score: 3 },
                { text: "Mention a college project briefly", score: 2 },
                { text: "Say you haven't worked on challenging projects", score: 0 },
                { text: "Talk about theoretical knowledge instead", score: 1 }
            ],
            category: "Behavioral"
        },
        {
            question: "How do you handle tight deadlines?",
            options: [
                { text: "Prioritize tasks, break them down, communicate early", score: 3 },
                { text: "Work extra hours and push through", score: 2 },
                { text: "I usually don't face tight deadlines", score: 1 },
                { text: "I ask for help from teammates", score: 2 }
            ],
            category: "Behavioral"
        },
        {
            question: "Why do you want to join our company?",
            options: [
                { text: "Specific reasons about tech stack, culture, growth", score: 3 },
                { text: "Good company with good salary", score: 1 },
                { text: "I need a job", score: 0 },
                { text: "I admire the product and want to contribute", score: 2 }
            ],
            category: "Behavioral"
        },
        {
            question: "Describe a time you worked in a team.",
            options: [
                { text: "Clear example with role, contribution, and result", score: 3 },
                { text: "Group project in college", score: 2 },
                { text: "I prefer working alone", score: 0 },
                { text: "I haven't worked in teams much", score: 1 }
            ],
            category: "Behavioral"
        },
        {
            question: "What are your strengths?",
            options: [
                { text: "Specific skills with examples", score: 3 },
                { text: "Generic: hardworking, smart", score: 1 },
                { text: "Technical skills with project examples", score: 2 },
                { text: "I'm a quick learner", score: 2 }
            ],
            category: "Behavioral"
        },
        {
            question: "Where do you see yourself in 5 years?",
            options: [
                { text: "Growing as an engineer, leading projects", score: 3 },
                { text: "In a senior role at this company", score: 2 },
                { text: "I haven't thought about it", score: 0 },
                { text: "Running my own startup", score: 1 }
            ],
            category: "Behavioral"
        },
        {
            question: "How do you handle conflict in a team?",
            options: [
                { text: "Listen, communicate openly, find common ground", score: 3 },
                { text: "I avoid conflicts", score: 1 },
                { text: "I follow what the team lead says", score: 2 },
                { text: "I haven't had team conflicts", score: 1 }
            ],
            category: "Behavioral"
        },
        {
            question: "Tell me about a bug you fixed.",
            options: [
                { text: "Specific debugging process and learning", score: 3 },
                { text: "Fixed some bugs in a project", score: 2 },
                { text: "I'm good at debugging but no specific example", score: 1 },
                { text: "I haven't debugged much", score: 0 }
            ],
            category: "Behavioral"
        },
        {
            question: "Why should we hire you?",
            options: [
                { text: "Match skills to role, show unique value", score: 3 },
                { text: "I'm a hard worker and quick learner", score: 2 },
                { text: "Because I need the job", score: 0 },
                { text: "I have relevant project experience", score: 2 }
            ],
            category: "Behavioral"
        },
        {
            question: "How do you stay updated with technology?",
            options: [
                { text: "Follow blogs, build projects, online courses", score: 3 },
                { text: "YouTube and Stack Overflow", score: 2 },
                { text: "I read tech news occasionally", score: 1 },
                { text: "I don't follow tech news much", score: 0 }
            ],
            category: "Behavioral"
        },
        {
            question: "Describe your problem-solving approach.",
            options: [
                { text: "Understand, plan, implement, test, optimize", score: 3 },
                { text: "I try different approaches until it works", score: 2 },
                { text: "I Google the solution", score: 1 },
                { text: "I ask for help", score: 1 }
            ],
            category: "Behavioral"
        },
        {
            question: "Tell me about a time you failed.",
            options: [
                { text: "Specific failure, lesson learned, how you improved", score: 3 },
                { text: "Failed a test but studied harder", score: 2 },
                { text: "I rarely fail", score: 1 },
                { text: "I don't like to talk about failures", score: 0 }
            ],
            category: "Behavioral"
        },
        {
            question: "What is your development process?",
            options: [
                { text: "Plan, code, test, review, deploy", score: 3 },
                { text: "I just start coding", score: 1 },
                { text: "Follow agile methodology", score: 2 },
                { text: "I don't have a specific process", score: 1 }
            ],
            category: "Behavioral"
        },
        {
            question: "How do you handle feedback?",
            options: [
                { text: "Welcome it, learn from it, implement improvements", score: 3 },
                { text: "I listen and try to improve", score: 2 },
                { text: "I don't get much feedback", score: 1 },
                { text: "I sometimes get defensive but try to improve", score: 1 }
            ],
            category: "Behavioral"
        },
        {
            question: "What motivates you?",
            options: [
                { text: "Building things that solve real problems", score: 3 },
                { text: "Learning new technologies", score: 2 },
                { text: "Getting a good job", score: 1 },
                { text: "Money and recognition", score: 1 }
            ],
            category: "Behavioral"
        }
    ],

    specialEvents: [
        {
            id: "dream_company",
            title: "Dream Company Drive",
            icon: "⭐",
            description: "Your dream company is conducting campus placements next week!",
            type: "positive",
            dayRange: [5, 15]
        },
        {
            id: "hackathon",
            title: "Hackathon Invitation",
            icon: "🏆",
            description: "A 24-hour hackathon with job opportunities for winners!",
            type: "positive",
            dayRange: [8, 20]
        },
        {
            id: "resume_workshop",
            title: "Resume Workshop",
            icon: "📝",
            description: "A free resume review workshop by industry professionals.",
            type: "positive",
            dayRange: [3, 10]
        },
        {
            id: "tech_talk",
            title: "Tech Talk by CTO",
            icon: "🎤",
            description: "CTO of a major company is giving a talk. Great networking chance!",
            type: "positive",
            dayRange: [5, 15]
        },
        {
            id: "final_week_push",
            title: "Final Week Panic",
            icon: "😱",
            description: "Only a few days left! Companies are making final hiring decisions.",
            type: "negative",
            dayRange: [25, 30]
        }
    ]
};
