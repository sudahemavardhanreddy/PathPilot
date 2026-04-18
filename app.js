// --- PathPilot Infrastructure (Phase 23) ---
window.onerror = function (message, source, lineno, colno, error) {
    if (message === "Script error." && location.protocol === 'file:') return true;
    console.error("PathPilot Global Error:", message, source, lineno, colno, error);
    showErrorModal(`Error: ${message}\nAt: ${source}:${lineno}:${colno}`);
    return true;
};

function safeSetInnerText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function safeSetInnerHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

// --- Notification Logic ---
let notifications = JSON.parse(localStorage.getItem('pathpilot_notifs')) || [
    { id: 1, title: "Welcome to PathPilot!", body: "Explore the Career Encyclopedia to get started.", time: "Just now" }
];

function toggleNotifDrawer() {
    const drawer = document.getElementById('notif-drawer');
    if (drawer) drawer.classList.toggle('active');
    updateNotifBadge();
}

function updateNotifBadge() {
    const badge = document.getElementById('notif-badge');
    if (badge) {
        badge.innerText = notifications.length;
        if (notifications.length > 0) badge.classList.remove('hidden');
        else badge.classList.add('hidden');
    }
}

function clearNotifs() {
    notifications = [];
    localStorage.removeItem('pathpilot_notifs');
    renderNotifs();
    updateNotifBadge();
}

function addNotif(title, body) {
    const newNotif = { id: Date.now(), title, body, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: new Date().toLocaleDateString() };
    notifications.unshift(newNotif);
    localStorage.setItem('pathpilot_notifs', JSON.stringify(notifications.slice(0, 20)));

    // Maintain a history
    let history = JSON.parse(localStorage.getItem('pathpilot_notif_history')) || [];
    history.unshift(newNotif);
    localStorage.setItem('pathpilot_notif_history', JSON.stringify(history.slice(0, 50)));

    updateNotifBadge();
    renderNotifs();
}

function renderNotifs() {
    const list = document.getElementById('notif-list');
    if (!list) return;
    if (notifications.length === 0) {
        list.innerHTML = `<p style="text-align:center; padding: 20px; color:var(--text-muted); font-size:0.85rem;">No new notifications</p>`;
        return;
    }
    list.innerHTML = notifications.map(n => `
        <div class="notif-item">
            <h5 style="margin-bottom: 4px; font-size: 0.85rem;">${n.title}</h5>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">${n.body}</p>
            <span style="font-size: 0.65rem; color: var(--primary); display: block; margin-top: 4px;">${n.time}</span>
        </div>
    `).join('');
}

function openNotifHistory() {
    const history = JSON.parse(localStorage.getItem('pathpilot_notif_history')) || [];
    const list = document.getElementById('notif-history-list');
    if (!list) return;

    if (history.length === 0) {
        list.innerHTML = `<p style="text-align:center; padding: 40px; color:var(--text-muted);">No history found yet.</p>`;
    } else {
        list.innerHTML = history.map(h => `
            <div class="glass-card" style="margin-bottom: 12px; border-left: 3px solid var(--primary);">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <h4 style="font-size: 0.95rem; margin-bottom: 4px;">${h.title}</h4>
                    <span style="font-size: 0.65rem; color: var(--text-muted);">${h.date}</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-main); margin-bottom: 4px;">${h.body}</p>
                <span style="font-size: 0.7rem; color: var(--primary);">${h.time}</span>
            </div>
        `).join('');
    }
    const historyModal = document.getElementById('notif-history-modal');
    const drawer = document.getElementById('notif-drawer');
    if (historyModal) historyModal.classList.add('active');
    if (drawer) drawer.classList.remove('active');
}

// --- Final Data Phase 4 ---
// --- Database (Phase 30) ---
// Data loaded from data/database.js
const {
    communities,
    communityMessages,
    experiences,
    questions,
    degrees,
    colleges,
    roleplays,
    scholarships,
    exams,
    examMapping,
    mentors,
    globalColleges,
    interviewQuestions,
    careers,
    learningResources,
    weeklyMissions,
    achievementsData,
    pivotOutcomes,
    industryPulses,
    skillUpResources,
    readyScoreWeights
} = DB;

// --- App State & Self-Healing ---
let user = JSON.parse(localStorage.getItem('pathpilot_user')) || {
    name: "Guest Student",
    class: "Not Set",
    gender: "N/A",
    parentName: "Guardian",
    parentEmail: "",
    marks: { math: 0, arts: 0, science: 0 },
    scores: { Logic: 0, Knowledge: 0, Social: 0, Creative: 0 },
    primaryInterest: "",
    communities: [],
    unlockedBadges: [],
    completedMissions: [],
    completedSimulations: [],
    xp: 0,
    resilienceScore: 0
};

// --- Backend Integration Constants ---
const BACKEND_URL = "http://localhost:5000"; // Update this to your Render URL after deployment

const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('pathpilot_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'x-auth-token': token }),
        ...options.headers
    };

    try {
        const response = await fetch(`${BACKEND_URL}${endpoint}`, { ...options, headers });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'API Error');
        return data;
    } catch (err) {
        console.error(`API Call failed: ${endpoint}`, err);
        addNotif("Network Error", err.message);
        throw err;
    }
};

// Patch legacy objects (Self-healing)
if (!user.marks) user.marks = { math: 0, arts: 0, science: 0 };
if (!user.scores) user.scores = { Logic: 0, Knowledge: 0, Social: 0, Creative: 0 };
if (!user.communities) user.communities = [];
if (!user.unlockedBadges) user.unlockedBadges = [];
if (!user.completedMissions) user.completedMissions = [];
if (typeof user.xp === 'undefined') user.xp = 0;


let savedRoadmaps = JSON.parse(localStorage.getItem('pathpilot_roadmaps')) || [];
let selectedForComparison = [];
let scores = { science: 0, commerce: 0, arts: 0 };
let currentQuestionIndex = 0;
let roadmapView = 'card'; // 'card' or 'timeline'
let activeCommunityId = null;
let interviewStep = -1; // -1: not started, 0-4: questions, 5: finished
let interviewAnswers = [];

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function setThemeScheme(scheme) {
    const root = document.documentElement;
    if (scheme === 'forest') {
        root.style.setProperty('--primary', '#10b981');
        root.style.setProperty('--secondary', '#059669');
        root.style.setProperty('--accent', '#34d399');
    } else if (scheme === 'neon') {
        root.style.setProperty('--primary', '#f43f5e');
        root.style.setProperty('--secondary', '#e11d48');
        root.style.setProperty('--accent', '#fb7185');
    } else {
        root.style.setProperty('--primary', '#6366f1');
        root.style.setProperty('--secondary', '#ec4899');
        root.style.setProperty('--accent', '#8b5cf6');
    }
    localStorage.setItem('pathpilot_scheme', scheme);
    addNotif("Theme Updated", `Switched to the ${scheme.charAt(0).toUpperCase() + scheme.slice(1)} theme.`);
}

// --- Multi-Step Onboarding Logic ---
function openOnboarding() {
    document.getElementById('onboarding-modal').classList.add('active');
    nextOnboardingStep(1);
}

function nextOnboardingStep(step) {
    // Validate previous step if moving forward
    const currentStepEls = document.querySelectorAll('.onboarding-step.active');
    if (currentStepEls.length > 0) {
        const currentId = currentStepEls[0].id;
        const currentStepNum = parseInt(currentId.split('-').pop());
        if (step > currentStepNum && !validateOnboarding(currentStepNum)) return;
    }

    document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step-dot').forEach(d => d.classList.remove('active'));

    document.getElementById(`onboarding-step-${step}`).classList.add('active');
    document.querySelectorAll('.step-dot')[step - 1].classList.add('active');

    if (step === 2) {
        document.getElementById('marks-math').value = user.marks.math || "";
        document.getElementById('marks-arts').value = user.marks.arts || "";
        document.getElementById('marks-science').value = user.marks.science || "";
    }
}

function selectInterest(interest) {
    user.primaryInterest = interest;
    document.querySelectorAll('#onboarding-step-3 .option-btn').forEach(btn => {
        if (btn.innerText.includes(interest)) {
            btn.style.borderColor = "var(--primary)";
            btn.style.background = "var(--surface-hover)";
        } else {
            btn.style.borderColor = "var(--glass-border)";
            btn.style.background = "var(--surface)";
        }
    });

    document.getElementById('finish-onboarding').style.display = "block";
}

function validateOnboarding(step) {
    if (step === 1) {
        const name = document.getElementById('user-name').value.trim();
        if (!name) {
            alert("Please enter your name to continue.");
            return false;
        }
    }
    if (step === 3 || !step) {
        const marks = ['math', 'arts', 'science'].map(s => {
            const val = document.getElementById(`marks-${s}`).value;
            return val === "" ? 0 : parseInt(val);
        });
        if (marks.some(m => isNaN(m) || m < 0 || m > 100)) {
            alert("Please enter valid marks between 0 and 100.");
            return false;
        }
    }
    return true;
}

async function completeOnboarding() {
    if (!validateOnboarding()) return;

    user.name = document.getElementById('user-name').value.trim();
    user.email = document.getElementById('user-email').value.trim();
    const password = document.getElementById('user-password').value;
    user.class = document.getElementById('user-class').value;
    user.gender = document.getElementById('user-gender').value;
    user.parentName = document.getElementById('parent-name').value.trim() || "Guardian";
    user.parentEmail = document.getElementById('parent-email').value.trim();

    user.marks = {
        math: parseInt(document.getElementById('marks-math').value),
        arts: parseInt(document.getElementById('marks-arts').value),
        science: parseInt(document.getElementById('marks-science').value)
    };

    try {
        // Register on Backend
        await apiCall('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name: user.name, email: user.email, password })
        });

        // Login to get Token
        const loginData = await apiCall('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: user.email, password })
        });

        // Store Token and User Data
        localStorage.setItem('pathpilot_token', loginData.token);
        user.id = loginData.user.id;
        
        // Sync Profile Details
        await apiCall('/api/user/profile', {
            method: 'PUT',
            body: JSON.stringify({
                current_class: user.class,
                gender: user.gender,
                primary_interest: user.primaryInterest
            })
        });

        localStorage.setItem('pathpilot_user', JSON.stringify(user));
        updateProfileDisplay();
        document.getElementById('onboarding-modal').classList.remove('active');
        showSection('assessment');
        addNotif("Welcome!", `Hi ${user.name.split(' ')[0]}, your synced career journey starts here.`);
        unlockBadge("assessment-done");
    } catch (err) {
        console.error("Onboarding Sync Failed:", err);
        // Fallback to local if server is down (optional, but keep it robust)
        addNotif("Sync Error", "Could not connect to backend, using local mode.");
        
        localStorage.setItem('pathpilot_user', JSON.stringify(user));
        updateProfileDisplay();
        document.getElementById('onboarding-modal').classList.remove('active');
        showSection('assessment');
    }
}

function updateProfileDisplay() {
    safeSetInnerText('display-name', user.name);
    safeSetInnerText('display-gender', user.gender || "N/A");
    safeSetInnerText('display-class', (user.class && user.class !== "Not Set") ? "Class " + user.class : "Not Set");
    safeSetInnerText('login-btn', (user.name && user.name !== "Guest Student") ? user.name.split(' ')[0] : "Join");

    // Show Strongest Subject
    const strengths = user.marks;
    const topSubject = Object.keys(strengths).reduce((a, b) => strengths[a] > strengths[b] ? a : b);
    safeSetInnerText('display-strength', topSubject.toUpperCase() + " (" + strengths[topSubject] + "%)");

    // Show Interest
    safeSetInnerText('display-interest', user.primaryInterest || "Not Set");

    // Show Guardian (Phase 10+)
    const infoDisplay = document.getElementById('user-info-display');
    if (user.parentName && !document.getElementById('display-parent')) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>Guardian:</strong> <span id="display-parent">${user.parentName}</span>`;
        infoDisplay.appendChild(p);
    } else if (document.getElementById('display-parent')) {
        document.getElementById('display-parent').innerText = user.parentName;
    }

    // Render Communities in Profile
    const commList = document.getElementById('joined-community-list');
    if (user.communities.length > 0) {
        commList.innerHTML = user.communities.map(id => {
            const c = communities.find(comm => comm.id === id);
            return `<span class="badge" style="background: var(--surface); color: var(--primary); border: 1px solid var(--glass-border); font-size: 0.75rem;">${c ? c.name : id}</span>`;
        }).join('');
    } else {
        commList.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">Not joined any group yet.</p>`;
    }

    updateSmartAlerts();
    renderRoadmaps();
    renderRadarChart();
    renderAchievements();
    checkAchievements();
    renderReadinessDashboard();
    updateHeroPersona();
    renderSuccessForecast();
    calculateSuccessScore();

    // Mission and XP Display (Phase 21)
    const xpDisplay = document.getElementById('display-xp');
    const missionCountDisplay = document.getElementById('display-missions');
    if (xpDisplay) xpDisplay.innerText = user.xp || 0;
    if (missionCountDisplay) missionCountDisplay.innerText = (user.completedMissions || []).length;
}

function renderSuccessForecast() {
    const container = document.getElementById('forecast-chart');
    if (!container) return;

    const persona = calculateUserArchetype();
    const growthRate = user.primaryInterest ? (careers.find(c => c.category.toLowerCase().includes(user.primaryInterest.toLowerCase()))?.id.length % 5 + 5) / 100 : 0.07;

    let svg = `<svg viewBox="0 0 400 180" style="width: 100%; height: 100%;">`;

    // Draw Axis
    svg += `<line x1="40" y1="150" x2="360" y2="150" stroke="var(--glass-border)" stroke-width="2" />`;
    svg += `<line x1="40" y1="20" x2="40" y2="150" stroke="var(--glass-border)" stroke-width="2" />`;

    // Calculate Points
    const points = [];
    const baseVal = 140;
    for (let i = 0; i <= 10; i++) {
        const x = 40 + (i * 32);
        const y = baseVal - (Math.pow(1 + growthRate, i) * 20);
        points.push(`${x},${y}`);

        // Year Labels
        if (i % 2 === 0) {
            svg += `<text x="${x}" y="170" text-anchor="middle" fill="var(--text-muted)" font-size="10">Yr ${i}</text>`;
        }
    }

    // Draw Area
    svg += `<polyline points="40,150 ${points.join(' ')} 360,150" fill="${persona.color}" fill-opacity="0.1" />`;
    // Draw Line
    svg += `<polyline points="${points.join(' ')}" fill="none" stroke="${persona.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`;

    // Dots
    points.forEach((p, i) => {
        const [x, y] = p.split(',');
        svg += `<circle cx="${x}" cy="${y}" r="4" fill="${persona.color}" class="pulse-ring" />`;
    });

    svg += `</svg>`;
    container.innerHTML = svg;
}

function calculateUserArchetype() {
    const s = user.scores;
    let max = Math.max(s.Logic, s.Knowledge, s.Social, s.Creative);

    // If scores are not explicitly set (legacy or new user), compute on the fly
    if (max === 0) {
        s.Logic = user.marks.math || 0;
        s.Knowledge = user.marks.science || 0;
        s.Social = (user.communities.length * 20) || 0;
        s.Creative = user.marks.arts || 0;
        max = Math.max(s.Logic, s.Knowledge, s.Social, s.Creative);
    }

    if (max < 5) return { title: "The Explorer", color: "var(--primary)", desc: "Starting your journey of discovery." };

    if (s.Logic === max && s.Knowledge > 10) return { title: "The Digital Architect", color: "#3b82f6", desc: "Master of systems and logical structures." };
    if (s.Creative === max && s.Social > 10) return { title: "The Experience Designer", color: "#ec4899", desc: "Blending empathy with aesthetic innovation." };
    if (s.Social === max && s.Knowledge > 10) return { title: "The Insightful Leader", color: "#10b981", desc: "Driving impact through knowledge and empathy." };
    if (s.Knowledge === max && s.Logic > 10) return { title: "The Strategic Researcher", color: "#8b5cf6", desc: "Unlocking potential through deep expertise." };

    // Default mapping
    if (s.Logic === max) return { title: "The Problem Solver", color: "#3b82f6", desc: "Logic-driven and analytical." };
    if (s.Creative === max) return { title: "The Content Creator", color: "#f43f5e", desc: "Bringing original ideas to life." };
    if (s.Social === max) return { title: "The Community Builder", color: "#10b981", desc: "Focused on human connection and impact." };
    return { title: "The Dedicated Expert", color: "#f59e0b", desc: "Focused on mastery and depth." };
}

function updateHeroPersona() {
    const hero = document.getElementById('welcome-hero');
    const heroTitle = hero?.querySelector('h1 span');
    const heroDesc = hero?.querySelector('p');
    if (!hero || !heroTitle || !heroDesc) return;

    if (user.name === "Guest Student") return;

    const persona = calculateUserArchetype();
    heroTitle.style.color = persona.color;
    heroDesc.innerText = `Welcome back, ${user.name.split(' ')[0]}. As ${persona.title}, you're perfectly positioned for ${user.primaryInterest || 'success'}.`;

    // Update profile title too
    const profileInterest = document.getElementById('display-interest');
    if (profileInterest && user.primaryInterest) {
        profileInterest.innerHTML = `${user.primaryInterest} &bull; <span style="color: ${persona.color}; font-weight: 700;">${persona.title}</span>`;
    }
}

function updateSmartAlerts() {
    const alertSection = document.getElementById('smart-alerts');
    const alertList = document.getElementById('alerts-list');

    if (savedRoadmaps.length === 0) {
        alertSection.style.display = "none";
        return;
    }

    const relevantExams = [];
    savedRoadmaps.forEach(roadmap => {
        for (const [examName, tags] of Object.entries(examMapping)) {
            if (tags.some(tag => roadmap.category.includes(tag) || roadmap.title.includes(tag))) {
                if (!relevantExams.some(e => e.name === examName)) {
                    relevantExams.push(exams.find(e => e.name === examName));
                }
            }
        }
    });

    // Assuming 'matchingAlerts' and 'notifications' are defined elsewhere or will be added.
    // For now, I'll create a placeholder for matchingAlerts based on relevantExams.
    const matchingAlerts = relevantExams.map(e => ({
        exam: e.name,
        msg: `Exam Date: ${e.date} • View Roadmap`
    }));

    if (relevantExams.length > 0) {
        alertSection.style.display = "block";
        alertList.innerHTML = matchingAlerts.map(alert => `
            <div style="margin-bottom: 8px; border-bottom: 1px solid var(--glass-border); padding-bottom: 8px;">
                <strong>${alert.exam}:</strong> ${alert.msg}
            </div>
        `).join('');

        // Add to system notifications if not already there
        // Assuming 'notifications' array and 'addNotif' function exist globally or are passed.
        // Placeholder for notifications and addNotif if they don't exist.

        matchingAlerts.forEach(a => {
            const body = `${a.exam}: ${a.msg}`;
            if (!notifications.some(n => n.body === body)) {
                addNotif("Exam Alert", body);
            }
        });
    } else {
        alertSection.style.display = "none";
    }
}

// --- Navigation ---
function showSection(sectionId) {
    const main = document.querySelector('main');
    main.style.opacity = '0';
    main.style.transform = 'scale(0.98)';

    setTimeout(() => {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        document.getElementById('nav-links').classList.remove('mobile-active');
        window.scrollTo({ top: 0, behavior: 'instant' });

        if (sectionId === 'comparison') renderComparison();
        if (sectionId === 'resources') {
            renderScholarships();
            renderExams();
            renderSkillUpHub();
            renderGlobalColleges();
        }
        if (sectionId === 'encyclopedia') {
            renderCareers();
        }
        if (sectionId === 'profile' || sectionId === 'assessment') {
            renderAchievements();
            renderSkillVelocity();
            renderReadinessDashboard();
            if (sectionId === 'assessment') renderQuestion();
        }

        main.style.opacity = '1';
        main.style.transform = 'scale(1)';
    }, 300);
}

function switchResourceTab(tab) {
    document.querySelectorAll('.resource-module').forEach(m => m.classList.remove('active'));
    document.getElementById(`${tab}-module`).classList.add('active');

    document.querySelectorAll('.resource-tabs .btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.style.background = "var(--surface)";
        b.style.color = "var(--text-main)";
    });

    const activeBtn = document.getElementById(`tab-${tab}`);
    activeBtn.classList.add('btn-primary');
    activeBtn.style.background = "var(--primary)";
    activeBtn.style.color = "white";

    if (tab === 'scholarships') renderScholarships();
    if (tab === 'exams') renderExams();
    if (tab === 'skillup') renderSkillUpHub();
    if (tab === 'global') renderGlobalColleges();
    if (tab === 'mentors') renderMentors();
    if (tab === 'community') renderCommunities();
    if (tab === 'experience') renderExperiences();
}

function toggleMenu() {
    document.getElementById('nav-links').classList.toggle('mobile-active');
}

// --- SVG Pathway Logic ---
function renderPathway(topStream) {
    const container = document.getElementById('pathway-container');
    const pathMapping = {
        science: ["Science (PCM/B)", "B.Tech / MBBS", "Sr. Engineer / Specialist", "M.Tech / MS / MD", "GATE / NEET PG"],
        commerce: ["Commerce", "B.Com / BBA / CA", "Manager / Portfolio Analyst", "MBA / M.Com", "CAT / CFA Level 3"],
        arts: ["Humanities", "B.A / BFA / Law", "Diplomat / Art Director", "M.A / LLM / Ph.D", "UPSC / CLAT PG"]
    };

    const steps = pathMapping[topStream];
    const labels = ["Stream", "Degree", "Job Role", "Higher Studies", "Competitive Exam"];

    let svg = `<svg viewBox="0 0 1000 250" class="pathway-svg">
        <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orientation="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--primary)"/></marker></defs>
        <path d="M 100 100 L 300 100 L 500 100 L 700 100 L 900 100" class="path-line" fill="none" marker-end="url(#arrow)" />`;

    steps.forEach((step, i) => {
        const cx = 100 + (i * 200);
        svg += `
            <circle cx="${cx}" cy="100" r="15" class="path-node" />
            <text x="${cx}" y="145" text-anchor="middle" fill="white" font-size="14" font-weight="600">${step}</text>
            <text x="${cx}" y="165" text-anchor="middle" fill="var(--text-muted)" font-size="10" style="text-transform: uppercase; letter-spacing: 1px;">${labels[i]}</text>
        `;
    });

    svg += `</svg>`;
    container.innerHTML = svg;
}

// --- Quiz Logic ---
function renderQuestion() {
    const container = document.getElementById('question-container');
    if (!container) return;

    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    container.classList.remove('hidden');
    document.getElementById('quiz-results').classList.add('hidden');

    const q = questions[currentQuestionIndex];
    document.getElementById('progress-fill').style.width = `${(currentQuestionIndex / questions.length) * 100}%`;

    let html = `<div class="question animate"><h3>Question ${currentQuestionIndex + 1} of ${questions.length}</h3><h2>${q.text}</h2><div class="options">`;

    if (!q.options && q.points) {
        html += `<button class="option-btn" onclick="handleSimpleAnswer(true)">Yes, definitely</button>`;
        html += `<button class="option-btn" onclick="handleSimpleAnswer(false)">Not really</button>`;
    } else {
        q.options.forEach((opt, idx) => {
            html += `<button class="option-btn" onclick="handleAnswer(${idx})">${opt.text}</button>`;
        });
    }

    html += `</div></div>`;
    container.innerHTML = html;
}

function handleAnswer(idx) {
    const points = questions[currentQuestionIndex].options[idx].points;
    for (let key in points) scores[key] += points[key];
    currentQuestionIndex++;
    renderQuestion();
}

function handleSimpleAnswer(isYes) {
    if (isYes) {
        const points = questions[currentQuestionIndex].points;
        for (let key in points) scores[key] += points[key];
    }
    currentQuestionIndex++;
    renderQuestion();
}

function showResults() {
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('quiz-results').classList.remove('hidden');
    document.getElementById('progress-fill').style.width = `100%`;

    const finalScores = { ...scores };

    if (user.marks.science > 80) finalScores.science += 15;
    if (user.marks.math > 80) { finalScores.science += 10; finalScores.commerce += 5; }
    if (user.marks.arts > 80) finalScores.arts += 15;

    if (user.primaryInterest === 'Technology') finalScores.science += 20;
    if (user.primaryInterest === 'Business') finalScores.commerce += 20;
    if (user.primaryInterest === 'Creative') finalScores.arts += 15;
    if (user.primaryInterest === 'Social') finalScores.arts += 20;

    const topStream = Object.keys(finalScores).reduce((a, b) => finalScores[a] > finalScores[b] ? a : b);
    renderPathway(topStream);

    const reasons = {
        science: "Your analytical and technical scores, combined with your strong academic background in Science/Math, suggest a natural trajectory towards innovation and logical problem-solving.",
        commerce: "Your managerial aptitude and interest in business dynamics indicate you are best suited for roles involving resource optimization, finance, and leadership.",
        arts: "Your high creative and social scores, along with your expressed interest in human-centric domains, point towards a career in designing, communicating, or influencing society."
    };

    document.getElementById('recommendation-output').innerHTML = `
        <div class="glass-card animate" style="margin-top: 24px; text-align: left; border-left: 4px solid var(--primary);">
            <p style="font-size: 1.4rem; color: var(--primary); font-weight: 700; margin-bottom: 12px;">Recommendation: ${topStream.toUpperCase()}</p>
            <p style="line-height: 1.8;"><strong>Personalized Insight:</strong> ${reasons[topStream]}</p>
        </div>
    `;
    document.getElementById('last-score').innerText = topStream.toUpperCase();
}

function renderPathway(stream) {
    const container = document.getElementById('pathway-container');
    if (!container) return;
    
    // Fallback/Demo Data based on stream
    let degreesText = stream === 'science' ? 'B.Tech / MBBS' : (stream === 'commerce' ? 'B.Com / BBA' : 'B.A / B.Fine Arts');
    let rolesText = stream === 'science' ? 'Engineer / Doctor' : (stream === 'commerce' ? 'Analyst / Manager' : 'Designer / Policy Analyst');
    let examsText = stream === 'science' ? 'GATE / NEET PG' : (stream === 'commerce' ? 'CAT / CA Final' : 'UPSC / NET');
    let higherStudy = 'Masters / Spec.';

    container.innerHTML = `
        <svg viewBox="0 0 800 200" width="100%" height="auto" style="border: 1px solid var(--glass-border); border-radius: 12px; background: var(--surface);">
            <!-- Connecting Lines -->
            <line x1="100" y1="100" x2="250" y2="100" stroke="var(--primary)" stroke-width="4" stroke-dasharray="8,4" />
            <line x1="250" y1="100" x2="400" y2="100" stroke="var(--primary)" stroke-width="4" stroke-dasharray="8,4" />
            <line x1="400" y1="100" x2="550" y2="100" stroke="var(--primary)" stroke-width="4" stroke-dasharray="8,4" />
            <line x1="550" y1="100" x2="700" y2="100" stroke="var(--primary)" stroke-width="4" stroke-dasharray="8,4" />

            <!-- Stream Node -->
            <circle cx="100" cy="100" r="30" fill="var(--primary)" />
            <text x="100" y="105" fill="white" font-size="14" font-weight="bold" text-anchor="middle">Stream</text>
            <text x="100" y="150" fill="var(--text-main)" font-size="12" font-weight="600" text-anchor="middle">${stream.toUpperCase()}</text>

            <!-- Degree Node -->
            <circle cx="250" cy="100" r="30" fill="var(--secondary)" />
            <text x="250" y="105" fill="white" font-size="14" font-weight="bold" text-anchor="middle">Degree</text>
            <text x="250" y="150" fill="var(--text-main)" font-size="12" font-weight="600" text-anchor="middle">${degreesText}</text>

            <!-- Pre-Exam / Prep Node -->
            <rect x="360" y="70" width="80" height="60" rx="10" fill="var(--accent)" />
            <text x="400" y="105" fill="white" font-size="14" font-weight="bold" text-anchor="middle">Job Roles</text>
            <text x="400" y="150" fill="var(--text-main)" font-size="12" font-weight="600" text-anchor="middle">${rolesText}</text>

            <!-- Higher Studies Node -->
            <circle cx="550" cy="100" r="30" fill="var(--primary)" />
            <text x="550" y="105" fill="white" font-size="12" font-weight="bold" text-anchor="middle">Studies</text>
            <text x="550" y="150" fill="var(--text-main)" font-size="12" font-weight="600" text-anchor="middle">${higherStudy}</text>

            <!-- Competitive Exam Node -->
            <polygon points="700,60 735,100 700,140 665,100" fill="var(--success)" />
            <text x="700" y="105" fill="white" font-size="12" font-weight="bold" text-anchor="middle">Exams</text>
            <text x="700" y="160" fill="var(--text-main)" font-size="12" font-weight="600" text-anchor="middle">${examsText}</text>
        </svg>
        <p style="text-align:center; font-size: 0.8rem; color: var(--text-muted); margin-top: 10px;">Interactive Pathway: Click sections for details (Coming Soon)</p>
    `;
}

function resetAssessment() {
    scores = { science: 0, commerce: 0, arts: 0 };
    currentQuestionIndex = 0;
    document.getElementById('question-container').classList.remove('hidden');
    document.getElementById('quiz-results').classList.add('hidden');
    renderQuestion();
}

// --- Data Visualization & Directory ---
function renderComparison() {
    const list = document.getElementById('comparison-body');
    list.innerHTML = degrees.map(d => `<tr class="animate"><td><strong>${d.name}</strong><br><small style="color:var(--text-muted)">${d.stream}</small></td><td>${d.duration}</td><td>${d.scope}</td><td style="color:var(--success)">${d.growth}</td><td>${d.careers}</td></tr>`).join('');
}

// Consolidated College Rendering Logic
function renderColleges(data = null) {
    const list = document.getElementById('college-list');
    if (!list) return;

    // Default to full database if no data provided
    const targetData = data || colleges;

    if (!targetData || targetData.length === 0) {
        list.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted); background: var(--surface); border-radius: 16px;">
            <p style="font-size: 1.1rem; margin-bottom: 8px;">No colleges found.</p>
            <p style="font-size: 0.9rem;">Try adjusting your filters or search terms.</p>
        </div>`;
        return;
    }

    list.innerHTML = targetData.filter(c => c).map(c => {
        // Safety Fallbacks
        const name = c.name || "Unnamed Institution";
        const city = c.city || "India";
        const type = c.type || "Government";
        const streams = Array.isArray(c.streams) ? c.streams.join(', ') : (c.stream || 'General');
        const fees = c.fees || "Contact College";
        const img = c.image || "https://images.unsplash.com/photo-1562774053-701939374585?w=400";
        const placement = (c.metrics && c.metrics.placement) ? c.metrics.placement : (Math.floor(Math.random() * 20) + 75);

        return `
            <div class="glass-card animate" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
                <div style="height: 140px; background: url('${img}') center/cover; position: relative;">
                    <span class="badge" style="position: absolute; top: 12px; right: 12px; background: rgba(16, 185, 129, 0.9); color: white;">${placement}% Placement</span>
                </div>
                <div style="padding: 20px; flex: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <h3 style="font-size: 1.05rem; margin: 0; line-height: 1.3;">${name}</h3>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
                        <i class="fas fa-map-marker-alt"></i> ${city}, ${c.state || 'India'} &bull; ${type}
                    </p>
                    <div style="margin-bottom: 16px;">
                        <p style="font-size: 0.75rem; color: var(--primary); font-weight: 600; margin-bottom: 4px;">Streams:</p>
                        <p style="font-size: 0.8rem; color: var(--text-main);">${streams}</p>
                    </div>
                    <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 12px;">
                        <div>
                            <p style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Fees</p>
                            <p style="font-size: 0.9rem; font-weight: 700; color: var(--success);">${fees}</p>
                        </div>
                        <button class="btn btn-primary" style="padding: 8px 16px; font-size: 0.8rem;" onclick="addNotif('Inquiry Sent', 'Request sent to ${name.replace(/'/g, "\\'")} Admissions.')">Inquire</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function checkEligibility(college) {
    const strengths = user.marks;
    const topMark = Math.max(strengths.math, strengths.arts, strengths.science);

    if (topMark >= college.minMarks) {
        return { status: "Eligible", color: "var(--success)" };
    } else if (topMark >= college.minMarks - 10) {
        return { status: "Target", color: "var(--warning)" };
    } else {
        return { status: "Reach", color: "var(--secondary)" };
    }
}

function filterColleges() {
    const city = document.getElementById('city-filter').value.toLowerCase();
    const stream = document.getElementById('stream-filter').value;
    const filtered = colleges.filter(c => (c.city.toLowerCase().includes(city)) && (stream === "all" || c.stream === stream));
    renderColleges(filtered);
}

// --- Resource Hub Logic ---
function switchResourceTab(tab) {
    document.querySelectorAll('.resource-module').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.resource-tabs .btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.style.background = "var(--surface)";
        b.style.border = "1px solid var(--glass-border)";
    });

    const moduleId = tab === 'mentors' ? 'mentors-module' : (tab === 'finance' ? 'finance-module' : `${tab.replace('-module', '')}-module`);
    const module = document.getElementById(moduleId);
    if (module) module.classList.add('active');

    const activeBtn = document.getElementById(`tab-${tab}`);
    if (activeBtn) {
        activeBtn.classList.add('btn-primary');
        activeBtn.style.background = ""; // Reset to default primary
    }

    if (tab === 'mentors') renderMentors();
    if (tab === 'community') renderCommunities();
    if (tab === 'experience') renderExperiences();
}

function filterScholarships() {
    const query = document.getElementById('scholarship-filter').value.toLowerCase();
    const category = document.getElementById('scholarship-category').value;
    const filtered = scholarships.filter(s =>
        (s.name.toLowerCase().includes(query) || s.category.toLowerCase().includes(query)) &&
        (category === 'all' || s.category === category)
    );
    renderScholarships(filtered);
}

// --- Career Encyclopedia Logic ---
let careersPerPage = 12;
let displayedCareersCount = 12;

function renderCareers(data = careers) {
    const grid = document.getElementById('career-grid');
    const loadMoreBtn = document.getElementById('load-more-container');

    // Slice data for lazy loading
    const displayedData = data.slice(0, displayedCareersCount);

    grid.innerHTML = displayedData.map((c, i) => {
        const isSelected = selectedForComparison.includes(c.id);
        const isTrending = i % 7 === 0; // Simulated trending logic
        const growth = 15 + (i % 25); // Simulated growth percentage

        return `
            <div class="glass-card resource-card animate" onclick="openCareerModal('${c.id}')" style="cursor: pointer; position: relative; border-top: 2px solid ${isTrending ? 'var(--secondary)' : 'transparent'}">
                ${isTrending ? '<span style="position: absolute; top: -10px; right: 20px; background: var(--secondary); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.6rem; font-weight: 700; text-transform: uppercase;">Trending</span>' : ''}
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <span class="badge" style="background: var(--surface); color: var(--primary); font-size: 0.7rem; padding: 4px 8px; border-radius: 4px;">${c.category}</span>
                    <button class="btn ${isSelected ? 'btn-secondary' : ''}" 
                            onclick="event.stopPropagation(); toggleComparison('${c.id}')" 
                            style="font-size: 0.65rem; padding: 4px 8px; background: ${isSelected ? 'var(--secondary)' : 'var(--surface)'}; border: 1px solid var(--glass-border);">
                        ${isSelected ? 'Selected' : '+ Compare'}
                    </button>
                </div>
                <h3 style="margin-top: 12px; font-size: 1.2rem;">${c.title}</h3>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                    <p style="color: var(--warning); font-weight: 600; font-size: 0.85rem;">Est. Salary: ${c.salary}</p>
                    <span style="color: var(--success); font-size: 0.75rem; font-weight: 700;">+${growth}% Growth</span>
                </div>
                <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px;">
                    ${c.skills.slice(0, 3).map(s => `<span style="font-size: 0.7rem; background: var(--glass); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--glass-border);">${s}</span>`).join('')}
                </div>
                <p style="margin-top: 16px; font-size: 0.85rem; color: var(--text-muted);">Click to deep dive into responsibilities & toolkit &rarr;</p>
            </div>
        `;
    }).join('');

    // Toggle Load More button visibility
    if (loadMoreBtn) {
        if (displayedCareersCount >= data.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
}

function loadMoreCareers() {
    displayedCareersCount += careersPerPage;
    const query = document.getElementById('career-search-input').value.toLowerCase();
    const category = document.getElementById('career-category-filter').value;

    // Apply current filters when loading more
    const filtered = careers.filter(c => {
        const titleMatch = c.title.toLowerCase().includes(query);
        const skillMatch = c.skills.some(s => s.toLowerCase().includes(query));
        const categoryMatch = category === 'all' || c.category === category;
        return (titleMatch || skillMatch) && categoryMatch;
    });

    renderCareers(filtered);
}

function filterCareers() {
    const query = document.getElementById('career-search-input').value.toLowerCase();
    const category = document.getElementById('career-category-filter').value;
    const filtered = careers.filter(c => {
        const titleMatch = c.title.toLowerCase().includes(query);
        const skillMatch = c.skills.some(s => s.toLowerCase().includes(query));
        const categoryMatch = category === 'all' || c.category === category;
        return (titleMatch || skillMatch) && categoryMatch;
    });
    renderCareers(filtered);
}

function openCareerModal(id) {
    const career = careers.find(c => c.id === id);
    if (!career) return;

    const isAlreadySaved = savedRoadmaps.some(r => r.id === id);

    // Find average degree cost for this career's stream
    const careerStream = career.category === "Technical" ? "Science" : (career.category === "Commercial" ? "Commerce" : "Arts");
    const streamColleges = colleges.filter(c => c.stream === careerStream);
    const avgDegreeCost = streamColleges.length > 0
        ? streamColleges.reduce((acc, c) => acc + c.avgFee, 0) / streamColleges.length
        : 100000;

    const estSalary = parseInt(career.salary.match(/₹(\d+)L/)[1]) * 100000;
    const yearsToROI = (avgDegreeCost * 4) / (estSalary * 0.4); // Assuming 40% of salary goes to recovery

    const modal = document.getElementById('career-modal');
    const content = document.getElementById('career-detail-content');
    content.innerHTML = `
        <div class="modal-header" style="margin-bottom: 32px; padding-right: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap;">
                <span class="badge" style="background: var(--primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">${career.category}</span>
                <span class="badge" style="background: var(--surface); color: var(--success); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; border: 1px solid var(--glass-border);">ROI: ~${yearsToROI.toFixed(1)} Years</span>
            </div>
            <h1 style="font-size: 2.5rem; margin: 12px 0 4px; color: var(--text-main);">${career.title}</h1>
            <p style="color: var(--warning); font-weight: 600; font-size: 1.1rem;">Earning Potential: ${career.salary}</p>
        </div>

        <div class="modal-body grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; text-align: left;">
            <div>
                <h3 style="color: var(--primary); margin-bottom: 12px;">A Day in the Life</h3>
                <p style="color: var(--text-main); line-height: 1.7; font-size: 1rem;">${career.day}</p>
                
                <h3 style="color: var(--primary); margin-top: 24px; margin-bottom: 12px;">Core Skills</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${career.skills.map(s => `<span style="background: var(--surface); padding: 6px 12px; border-radius: 8px; border: 1px solid var(--glass-border); font-size: 0.9rem;">${s}</span>`).join('')}
                </div>

                <div class="glass-card" style="margin-top: 24px; border-left: 4px solid var(--secondary); background: rgba(236, 72, 153, 0.05);">
                    <h4 style="color: var(--secondary); margin-bottom: 8px;">💡 AI Success Tip</h4>
                    <p style="font-size: 0.9rem; line-height: 1.6;">${getSuccessTip(career)}</p>
                </div>
                ${renderSkillGap(career)}
            </div>
            
            <div class="glass-card" style="background: rgba(255,255,255,0.02); border-color: var(--glass-border);">
                <h3 style="color: var(--secondary); margin-bottom: 16px;">Professional Toolkit</h3>
                <ul style="list-style: none; padding: 0;">
                    ${career.toolkit.map(tool => `<li style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                        <span style="color: var(--secondary);">•</span> ${tool}
                    </li>`).join('')}
                </ul>
                
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--glass-border);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 0.85rem; color: var(--text-muted);">Job Security</span>
                        <span style="font-size: 0.85rem; font-weight: 600;">${career.jobSecurity || 80}%</span>
                    </div>
                    <div class="progress-container" style="height: 6px; background: var(--surface); margin-bottom: 16px;">
                        <div class="progress-bar" style="width: ${career.jobSecurity || 80}%; background: var(--primary);"></div>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 0.85rem; color: var(--text-muted);">Remote Work Friendly</span>
                        <span style="font-size: 0.85rem; font-weight: 600;">${career.remoteWork || 50}%</span>
                    </div>
                    <div class="progress-container" style="height: 6px; background: var(--surface);">
                        <div class="progress-bar" style="width: ${career.remoteWork || 50}%; background: var(--secondary);"></div>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-top: 32px; text-align: center;">
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                <button id="save-roadmap-btn" class="btn btn-primary" style="flex: 1; min-width: 180px;" onclick="saveToRoadmap('${career.id}')"></button>
                <button class="btn" style="flex: 1; min-width: 180px; background: var(--accent); color: white;" onclick="generateAICourse('${career.title}')">Generate AI Course</button>
                ${roleplays[career.id] ? `<button class="btn" style="flex: 1; min-width: 180px; background: var(--secondary); color: white;" onclick="startRoleplay('${career.id}')">Start Roleplay</button>` : ''}
                <button class="btn" style="flex: 1; min-width: 180px; background: linear-gradient(135deg, #10b981, #059669); color: white;" onclick="startDayInLife('${career.id}')">Day in the Life 🎮</button>
                <button class="btn" style="flex: 1; min-width: 180px; background: var(--surface); color: var(--primary); border: 1px solid var(--primary);" onclick="toggleAlumniChat()">Talk to Alumni</button>
            </div>
        </div>
    `;

    const saveBtn = document.getElementById('save-roadmap-btn');
    if (isAlreadySaved) {
        saveBtn.innerText = "Already in Roadmap";
        saveBtn.disabled = true;
        saveBtn.style.opacity = "0.5";
    } else {
        saveBtn.innerText = "Add to My Path";
        saveBtn.disabled = false;
        saveBtn.style.opacity = "1";
    }

    modal.classList.add('active');
}

function saveToRoadmap(careerId) {
    const career = careers.find(c => c.id === careerId);
    if (!career || savedRoadmaps.some(r => r.id === careerId)) return;

    const milestones = [
        { text: `Complete specialized ${career.category} foundations`, completed: false },
        { text: `Master core tools: ${career.toolkit.slice(0, 2).join(', ')}`, completed: false },
        { text: `Build a portfolio project showcasing ${career.skills[0]}`, completed: false },
        { text: `Apply for junior ${career.title} internships`, completed: false }
    ];

    savedRoadmaps.push({
        ...career,
        milestones: milestones,
        progress: 0
    });

    localStorage.setItem('pathpilot_roadmaps', JSON.stringify(savedRoadmaps));
    closeCareerModal();
    showSection('profile');
    renderRoadmaps();
    unlockBadge("roadmap-builder");
}

function toggleRoadmapView() {
    roadmapView = (roadmapView === 'card' ? 'timeline' : 'card');
    renderRoadmaps();
}

function renderRoadmaps() {
    const list = document.getElementById('roadmap-list');
    const countLabel = document.getElementById('roadmap-count');

    if (savedRoadmaps.length === 0) {
        list.innerHTML = `<div class="glass-card" style="text-align: center; padding: 40px; border: 1px dashed var(--glass-border);">
                            <p style="color: var(--text-muted);">No roadmaps saved yet. Explore the <a href="#" onclick="showSection('encyclopedia')" style="color: var(--primary);">Encyclopedia</a> to start your journey.</p>
                        </div>`;
        countLabel.innerText = "0 Active";
        return;
    }

    countLabel.innerText = `${savedRoadmaps.length} Active`;

    // Find first incomplete milestone across all roadmaps for "Next Action" Nudge
    let nextAction = null;
    for (const r of savedRoadmaps) {
        const incomplete = r.milestones.find(m => !m.completed);
        if (incomplete) {
            nextAction = { text: incomplete.text, title: r.title };
            break;
        }
    }

    let nudgeHtml = "";
    if (nextAction) {
        nudgeHtml = `
            <div class="nudge-card animate">
                <div class="nudge-icon">🚀</div>
                <div>
                    <h4 style="margin: 0; color: var(--primary);">Next Action: ${nextAction.title}</h4>
                    <p style="margin: 4px 0 0; font-size: 0.9rem; color: var(--text-muted);">${nextAction.text}</p>
                </div>
            </div>
        `;
    }

    if (roadmapView === 'timeline') {
        list.style.display = 'block';
        list.innerHTML = nudgeHtml + `
            <div class="glass-card animate" style="padding: 30px; border-left: 4px solid var(--primary);">
                <div style="position: relative; padding-left: 30px; border-left: 2px solid var(--glass-border);">
                    ${savedRoadmaps.map((r, rIdx) => `
                        <div style="margin-bottom: 40px; position: relative;">
                            <div style="position: absolute; left: -37px; top: 5px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); outline: 4px solid var(--glass);"></div>
                            <h3 style="font-size: 1.1rem; color: var(--primary);">${r.title}</h3>
                            <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
                                ${r.milestones.map((m, mIdx) => `
                                    <div style="display: flex; align-items: start; gap: 12px;">
                                        <input type="checkbox" ${m.completed ? 'checked' : ''} onclick="handleMilestoneClick(${rIdx}, ${mIdx})" style="margin-top: 4px;">
                                        <span style="font-size: 0.9rem; color: ${m.completed ? 'var(--text-muted)' : 'var(--text-main)'}; text-decoration: ${m.completed ? 'line-through' : 'none'};">
                                            ${m.text}
                                        </span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        list.style.display = 'grid';
        list.innerHTML = nudgeHtml + savedRoadmaps.map((r, rIdx) => {
            const progress = Math.round((r.milestones.filter(m => m.completed).length / r.milestones.length) * 100);
            return `
                <div class="glass-card roadmap-card animate" style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                        <div>
                            <span class="badge" style="background: var(--surface); color: var(--secondary); font-size: 0.7rem;">${r.category}</span>
                            <h3 style="margin-top: 8px;">${r.title}</h3>
                        </div>
                        <button class="btn" style="padding: 4px 12px; font-size: 0.75rem; background: rgba(236, 72, 153, 0.1); color: var(--secondary);" onclick="removeRoadmap(${rIdx})">Remove</button>
                    </div>

                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${progress}%; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
                    </div>
                    <p style="font-size: 0.8rem; margin: 8px 0 20px; color: var(--text-main); font-weight: 600;">Overall Progress: ${progress}%</p>

                    <div class="milestones">
                        ${r.milestones.map((m, mIdx) => {
                const link = getLinkForMilestone(m.text);
                return `
                                <div class="milestone-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-radius: 8px; margin-bottom: 8px;">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <input type="checkbox" class="milestone-checkbox" ${m.completed ? 'checked' : ''} 
                                               onclick="handleMilestoneClick(${rIdx}, ${mIdx})" data-ridx="${rIdx}" data-midx="${mIdx}">
                                        <span style="font-size: 0.9rem; color: ${m.completed ? 'var(--text-muted)' : 'var(--text-main)'}; text-decoration: ${m.completed ? 'line-through' : 'none'};">
                                            ${m.text}
                                        </span>
                                    </div>
                                    ${link ? `<a href="${link}" target="_blank" class="btn" style="font-size: 0.7rem; padding: 4px 8px; background: var(--surface); border: 1px solid var(--glass-border); color: var(--primary); text-decoration: none;">Resource &rarr;</a>` : ''}
                                </div>
                            `;
            }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
}

function getLinkForMilestone(text) {
    for (let key in learningResources) {
        if (text.toLowerCase().includes(key.toLowerCase())) return learningResources[key];
    }
    return null;
}

function toggleMilestone(rIdx, mIdx) {
    savedRoadmaps[rIdx].milestones[mIdx].completed = !savedRoadmaps[rIdx].milestones[mIdx].completed;
    localStorage.setItem('pathpilot_roadmaps', JSON.stringify(savedRoadmaps));
    renderRoadmaps();
}

function removeRoadmap(idx) {
    savedRoadmaps.splice(idx, 1);
    localStorage.setItem('pathpilot_roadmaps', JSON.stringify(savedRoadmaps));
    updateProfileDisplay();
}

function toggleComparison(id) {
    if (selectedForComparison.includes(id)) {
        selectedForComparison = selectedForComparison.filter(item => item !== id);
    } else {
        if (selectedForComparison.length < 2) {
            selectedForComparison.push(id);
        } else {
            alert("You can only compare 2 careers at once. Deselect one to add another.");
            return;
        }
    }
    updateComparisonTray();
    renderCareers();
}

function updateComparisonTray() {
    const tray = document.getElementById('comparison-tray');
    const count = document.getElementById('comparison-count');
    const btn = document.getElementById('launch-comparison');

    count.innerText = selectedForComparison.length;

    if (selectedForComparison.length > 0) {
        tray.style.display = "flex";
        btn.disabled = selectedForComparison.length < 2;
    } else {
        tray.style.display = "none";
    }
}

function clearComparison() {
    selectedForComparison = [];
    updateComparisonTray();
    renderCareers();
}

function openComparisonModal() {
    if (selectedForComparison.length < 2) return;
    renderComparisonMatrix();
    document.getElementById('comparison-modal').classList.add('active');
}

function closeComparisonModal() {
    document.getElementById('comparison-modal').classList.remove('active');
}

function renderComparisonMatrix() {
    const grid = document.getElementById('comparison-grid');
    const car1 = careers.find(c => c.id === selectedForComparison[0]);
    const car2 = careers.find(c => c.id === selectedForComparison[1]);

    const metrics = [
        { label: "Est. Salary", key: "salary", isMetric: false },
        { label: "Market Demand", key: "demand", isMetric: true },
        { label: "Difficulty to Enter", key: "difficulty", isMetric: true },
        { label: "Work-Life Balance", key: "balance", isMetric: true },
        { label: "Core Tools", key: "toolkit", isList: true }
    ];

    grid.innerHTML = [car1, car2].map((car, idx) => `
        <div style="background: ${idx === 0 ? 'rgba(99, 102, 241, 0.05)' : 'rgba(236, 72, 153, 0.05)'}; padding: 30px; border-right: ${idx === 0 ? '1px solid var(--glass-border)' : 'none'};">
            <span class="badge" style="background: var(--surface); color: var(--primary); font-size: 0.7rem;">${car.category}</span>
            <h2 style="margin: 12px 0;">${car.title}</h2>
            
            <div style="margin-top: 30px;">
                ${metrics.map(m => {
        let val = "";
        if (m.isMetric) {
            val = `
                            <div class="progress-container" style="height: 10px; margin-top: 8px; background: rgba(255,255,255,0.05);">
                                <div class="progress-bar" style="width: ${car.metrics[m.key]}%; background: ${idx === 0 ? 'var(--primary)' : 'var(--secondary)'};"></div>
                            </div>
                            <p style="font-size: 0.75rem; text-align: right; margin-top: 4px; color: var(--text-muted);">${car.metrics[m.key]} / 100</p>
                        `;
        } else if (m.isList) {
            val = `<p style="font-size: 0.85rem; margin-top: 8px;">${car[m.key].join(', ')}</p>`;
        } else {
            val = `<p style="font-size: 1.1rem; font-weight: 700; color: var(--warning); margin-top: 8px;">${car[m.key]}</p>`;
        }
        return `
                        <div style="margin-bottom: 24px;">
                            <label style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700;">${m.label}</label>
                            ${val}
                        </div>
                    `;
    }).join('')}
            </div>
            
            <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--glass-border);">
                <h4 style="margin-bottom: 12px; color: var(--text-main);">Typical Responsibility</h4>
                <p style="font-size: 0.85rem; line-height: 1.6; color: var(--text-muted);">${car.day.substring(0, 100)}...</p>
            </div>
        </div>
    `).join('');
}

// skillUpHub uses advanced version further down

function renderScholarships() {
    const list = document.getElementById('scholarship-list');
    if (!list) return;
    list.innerHTML = scholarships.map(s => `
        <div class="glass-card resource-card animate" style="border-top: 4px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3 style="font-size: 1.1rem;">${s.name}</h3>
                <span class="badge" style="background: var(--surface); color: var(--primary); font-size: 0.6rem;">${s.category}</span>
            </div>
            <p style="font-size: 1.2rem; font-weight: 700; color: var(--warning); margin: 12px 0;">${s.amount}</p>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${s.eligibility}</p>
            <button class="btn btn-primary" style="width: 100%; margin-top: 16px; font-size: 0.8rem; padding: 10px;" onclick="addNotif('Reminder Set', 'We will notify you when ${s.name} opens.')">Set Reminder</button>
        </div>
    `).join('');
}

function renderExams() {
    const list = document.getElementById('exam-list');
    if (!list) return;
    list.innerHTML = exams.map(e => `
        <div class="glass-card resource-card animate" style="border-top: 4px solid var(--secondary);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3 style="font-size: 1.1rem;">${e.name}</h3>
                <span class="badge" style="background: var(--surface); color: var(--secondary); font-size: 0.6rem;">${e.difficulty}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 12px 0;">Target: <strong>${e.scope}</strong></p>
            <p style="font-size: 0.8rem; color: var(--text-main);">Tentative Date: ${e.date}</p>
            <button class="btn" style="width: 100%; margin-top: 16px; font-size: 0.8rem; padding: 10px; background: var(--surface); border: 1px solid var(--glass-border);" onclick="addNotif('Exam Saved', '${e.name} added to your tracker.')">Save to Tracker</button>
        </div>
    `).join('');
}

// --- Mentorship Discovery Logic ---
function renderMentors() {
    const list = document.getElementById('mentor-list');

    // Filter mentors based on user's primary interest category
    const userCategory = user.primaryInterest || "Technical";
    const recommended = mentors.filter(m => m.focus === userCategory || userCategory.includes(m.focus));
    const others = mentors.filter(m => !(m.focus === userCategory || userCategory.includes(m.focus)));

    const allToRender = [...recommended, ...others];

    list.innerHTML = allToRender.map((m, i) => `
        <div class="glass-card mentor-card animate" style="border-top: 4px solid ${i < recommended.length ? 'var(--primary)' : 'var(--glass-border)'}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 1.2rem;">${m.name}</h3>
                ${i < recommended.length ? '<span class="badge" style="background: var(--primary); color: white; font-size: 0.6rem; padding: 2px 8px; border-radius: 4px;">Top Match</span>' : ''}
            </div>
            <p style="color: var(--secondary); font-weight: 600; font-size: 0.9rem; margin: 4px 0;">${m.role}</p>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">${m.bio}</p>
            <div class="advice-badge">
                " ${m.advice} "
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 16px; font-size: 0.8rem; padding: 8px;" onclick="openMentorBooking('${m.name}')">Book Session</button>
        </div>
    `).join('');
}

let activeBookingMentor = null;
function openMentorBooking(mentorName) {
    const m = mentors.find(men => men.name === mentorName);
    activeBookingMentor = m;
    document.getElementById('booking-mentor-name').innerText = "Session with " + m.name;
    document.getElementById('booking-mentor-role').innerText = m.role;
    document.getElementById('mentor-booking-modal').classList.add('active');
}

function confirmBooking() {
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;

    if (!date) {
        alert("Please select a date for the session.");
        return;
    }

    alert(`Success! Session booked with ${activeBookingMentor.name} on ${date} at ${time}. Check your email for the meeting link.`);
    addNotif("Session Booked", `Confirmed: ${activeBookingMentor.name} on ${date}.`);
    closeModal('mentor-booking-modal');
    updateProfileDisplay(); // Trigger success score update
}

function calculateSuccessScore() {
    let score = 0;

    // 1. Assessment (20%)
    if (user.primaryInterest) score += 20;

    // 2. Roadmaps (30%)
    if (savedRoadmaps.length > 0) {
        const avgProgress = savedRoadmaps.reduce((acc, r) => {
            const p = (r.milestones.filter(m => m.completed).length / r.milestones.length);
            return acc + p;
        }, 0) / savedRoadmaps.length;
        score += (avgProgress * 30);
    }

    // 3. Communities & Experiences (30%)
    const ecosystemScore = (user.communities.length * 5) + (user.completedSimulations.length * 10); // Reward simulations more
    score += Math.min(ecosystemScore, 30);

    // 4. Resilience (New Metric)
    const resilienceBase = (user.resilienceScore || 0) * 0.2; // 20% influence on success
    score += resilienceBase;

    // 5. Activity Multiplier (20%)
    // Base 10 if on-boarded, more if profile is detailed
    if (user.name !== "Guest Student") score += 10;
    if (user.parentEmail) score += 10;

    const finalScore = Math.min(100, Math.round(score));
    safeSetInnerText('display-success-score', finalScore + "%");
    safeSetInnerText('display-resilience-score', (user.resilienceScore || 0) + "%");

    const scoreEl = document.getElementById('display-success-score');
    if (scoreEl) {
        scoreEl.style.background = finalScore > 70 ? 'var(--success)' : (finalScore > 40 ? 'var(--warning)' : 'var(--error)');
    }
    return finalScore;
}

// --- Portfolio Generation Logic ---
function generatePortfolio() {
    const modal = document.getElementById('portfolio-modal');
    const content = document.getElementById('portfolio-content');

    const persona = calculateUserArchetype();
    const completedMilestones = savedRoadmaps.reduce((acc, r) => acc + r.milestones.filter(m => m.completed).length, 0);
    const topSubject = Object.keys(user.marks).reduce((a, b) => user.marks[a] > user.marks[b] ? a : b);

    // AI Phrasing for Summary
    const summaries = {
        "The Digital Architect": "A systems-focused strategist specializing in building robust logical frameworks and digital solutions.",
        "The Experience Designer": "An empathetic innovator dedicated to crafting seamless user journeys and aesthetic excellence.",
        "The Insightful Leader": "A knowledge-driven professional focused on community impact and strategic organizational growth.",
        "The Explorer": "A curious and adaptable talent currently navigating diverse career pathways to find a high-impact niche.",
        "The Problem Solver": "A logic-driven analyst with a commitment to efficiency and practical solution architecting."
    };
    const summary = summaries[persona.title] || `A dedicated professional with top scores in ${topSubject} and a commitment to professional excellence.`;

    const theme = localStorage.getItem('pathpilot_portfolio_theme') || 'modern';
    modal.className = `modal-overlay active portfolio-theme-${theme}`;

    content.innerHTML = `
        <div class="portfolio-controls" style="margin-bottom: 24px; display: flex; gap: 12px; justify-content: center; border-bottom: 1px solid var(--glass-border); padding-bottom: 15px;">
            <button class="btn ${theme === 'modern' ? 'btn-primary' : ''}" onclick="setPortfolioTheme('modern')" style="font-size: 0.75rem; padding: 10px 16px;">Modern</button>
            <button class="btn ${theme === 'classic' ? 'btn-primary' : ''}" onclick="setPortfolioTheme('classic')" style="font-size: 0.75rem; padding: 10px 16px;">Classic</button>
            <button class="btn ${theme === 'tech' ? 'btn-primary' : ''}" onclick="setPortfolioTheme('tech')" style="font-size: 0.75rem; padding: 10px 16px;">Cyber Tech</button>
        </div>
        <div class="portfolio-body">
            <div class="portfolio-header">
                <h1 style="margin-bottom: 8px;">${user.name}</h1>
                <p class="persona-tag" style="color: ${persona.color}; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Professional Candidate Portfolio &bull; ${persona.title}</p>
            </div>
            
            <div class="portfolio-section summary-box">
                <h4>AI-Generated Professional Summary</h4>
                <p style="font-size: 1rem; line-height: 1.6; font-style: italic;">"${summary}"</p>
            </div>

            <div class="portfolio-section">
                <h4>Academic Profile</h4>
                <div class="profile-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <p><strong>Status:</strong> Class ${user.class}</p>
                    <p><strong>Primary Interest:</strong> ${user.primaryInterest || "General Exploration"}</p>
                    <p><strong>Core Strength:</strong> ${topSubject.toUpperCase()} (${user.marks[topSubject]}%)</p>
                    <p><strong>Success Score:</strong> ${calculateSuccessScore()}%</p>
                </div>
            </div>

            <div class="portfolio-section">
                <h4>Verified Progress & Roadmaps</h4>
                <p><strong>Milestones Achieved:</strong> ${completedMilestones}</p>
                <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px;">
                    ${savedRoadmaps.map(r => `<span class="badge" style="background: var(--surface); color: var(--primary); font-size: 0.7rem; border: 1px solid var(--glass-border);">${r.title}</span>`).join('')}
                </div>
            </div>

            <div class="portfolio-section aptitude-box" style="border: none;">
                <h4>Aptitude Summary</h4>
                <p style="font-size: 0.9rem; line-height: 1.6;">Successfully assessed as **${persona.title}**, with high-performance metrics in logical reasoning and ${topSubject} domains. Certified for professional exploration by PathPilot AI.</p>
            </div>
            
            <p class="generation-footer" style="text-align: center; color: var(--text-muted); font-size: 0.75rem; margin-top: 20px;">Generated by PathPilot Advisor &bull; Verified Production Copy</p>
        </div>
    `;
    modal.classList.add('active');
}

function setPortfolioTheme(theme) {
    localStorage.setItem('pathpilot_portfolio_theme', theme);
    generatePortfolio(); // Refresh
}

function closePortfolio() {
    document.getElementById('portfolio-modal').classList.remove('active');
}

// --- Knowledge Check Logic ---
let activeQuizRef = null;

function handleMilestoneClick(rIdx, mIdx) {
    const roadmap = savedRoadmaps[rIdx];
    const milestone = roadmap.milestones[mIdx];

    if (milestone.completed) {
        toggleMilestone(rIdx, mIdx); // Just uncheck
        return;
    }

    // Show Knowledge Check
    activeQuizRef = { rIdx, mIdx };
    const quizModal = document.getElementById('quiz-modal');
    const questionText = document.getElementById('quiz-question');
    const answerInput = document.getElementById('quiz-answer');

    questionText.innerText = roadmap.quiz || "Which tool is most important for this role?";
    answerInput.value = "";
    quizModal.classList.add('active');
}

function submitQuiz() {
    const answer = document.getElementById('quiz-answer').value.trim();
    if (!answer) return;

    // In this simulation, any answer completes the milestone!
    const { rIdx, mIdx } = activeQuizRef;
    savedRoadmaps[rIdx].milestones[mIdx].completed = true;
    localStorage.setItem('pathpilot_roadmaps', JSON.stringify(savedRoadmaps));

    document.getElementById('quiz-modal').classList.remove('active');
    renderRoadmaps();

    // Add a small "XP" notification style alert
    alert("Knowledge Verified! Milestone Completed.");
}

// --- Override renderRoadmaps to use handleMilestoneClick ---
const originalRenderRoadmaps = renderRoadmaps;
renderRoadmaps = function () {
    originalRenderRoadmaps();
    // After rendering, we need to swap the onclick of checkboxes
    document.querySelectorAll('.milestone-checkbox').forEach((cb, idx) => {
        // This is a bit hacky for a pure JS app, but effective:
        // We find the parent's indices via mapping
        const rIdx = parseInt(cb.getAttribute('data-ridx'));
        const mIdx = parseInt(cb.getAttribute('data-midx'));
    });
};

// --- Init Overrides ---
function getSuccessTip(career) {
    const strengths = user.marks;
    if (career.category === "Technical" && strengths.math < 70) {
        return "Since your math score is currently below 70, focusing on Discrete Mathematics and Logic puzzles will significantly boost your technical foundation.";
    }
    if (career.category === "Commercial" && strengths.math < 80) {
        return "Data interpretation is crucial in business. Improving your Statistics and Excel skills would be a high-impact move right now.";
    }
    if (career.category === "Creative" && strengths.arts < 80) {
        return "Design is as much about story as visuals. Deepening your Literature or Art History knowledge will add meaningful layers to your creative work.";
    }
    return `Your current academic profile aligns well with ${career.title}. Focus on building your portfolio using ${career.toolkit[0]} to stand out.`;
}

function closeCareerModal() {
    document.getElementById('career-modal').classList.remove('active');
}

// --- Skills Radar Logic (Phase 34 Enhanced) ---
function renderRadarChart() {
    const container = document.getElementById('radar-chart');
    if (!container) return;

    const size = 200;
    const center = size / 2;
    const radius = 80;
    const labels = ['Logic', 'Knowledge', 'Social', 'Creative'];

    // User Skills (based on marks and activity)
    const userSkills = [
        user.marks.math || 10,
        user.marks.science || 10,
        (user.communities.length * 20) || 10,
        user.marks.arts || 10
    ];

    // Market Demand (different targets based on interest)
    let marketDemand = [70, 70, 70, 70];
    if (user.primaryInterest === 'Technology') marketDemand = [90, 85, 40, 50];
    else if (user.primaryInterest === 'Business') marketDemand = [75, 80, 85, 40];
    else if (user.primaryInterest === 'Creative') marketDemand = [40, 50, 60, 95];
    else if (user.primaryInterest === 'Social') marketDemand = [50, 70, 90, 60];

    const getPoints = (data) => {
        return data.map((val, i) => {
            const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
            const r = (val / 100) * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(' ');
    };

    const userPoints = getPoints(userSkills);
    const marketPoints = getPoints(marketDemand);

    container.innerHTML = `
        <svg width="${size}" height="${size + 40}" viewBox="0 0 ${size} ${size + 40}" style="overflow: visible;">
            <!-- Background Polygons -->
            <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="var(--glass-border)" stroke-width="1" stroke-dasharray="4,4" />
            <circle cx="${center}" cy="${center}" r="${radius * 0.75}" fill="none" stroke="var(--glass-border)" stroke-width="1" stroke-dasharray="4,4" />
            <circle cx="${center}" cy="${center}" r="${radius * 0.5}" fill="none" stroke="var(--glass-border)" stroke-width="1" stroke-dasharray="4,4" />
            <circle cx="${center}" cy="${center}" r="${radius * 0.25}" fill="none" stroke="var(--glass-border)" stroke-width="1" stroke-dasharray="4,4" />
            
            <!-- Axis lines -->
            ${labels.map((label, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);
        const tx = center + (radius + 15) * Math.cos(angle);
        const ty = center + (radius + 15) * Math.sin(angle);
        return `
                    <line x1="${center}" y1="${center}" x2="${x2}" y2="${y2}" stroke="var(--glass-border)" stroke-width="1" />
                    <text x="${tx}" y="${ty}" font-size="10" fill="var(--text-muted)" text-anchor="middle" dominant-baseline="middle">${label}</text>
                `;
    }).join('')}

            <!-- Market Demand Layer -->
            <polygon points="${marketPoints}" fill="rgba(244, 63, 94, 0.1)" stroke="var(--secondary)" stroke-width="1.5" stroke-dasharray="3,2" />
            
            <!-- User Skills Layer -->
            <polygon points="${userPoints}" fill="rgba(99, 102, 241, 0.4)" stroke="var(--primary)" stroke-width="2.5" style="filter: drop-shadow(0 0 5px rgba(99,102,241,0.2))" />
            
            <!-- Data points -->
            ${userSkills.map((val, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const r = (val / 100) * radius;
        return `<circle cx="${center + r * Math.cos(angle)}" cy="${center + r * Math.sin(angle)}" r="3" fill="var(--primary)" />`;
    }).join('')}

            <!-- Legend -->
            <g transform="translate(10, ${size + 20})">
                <rect width="8" height="8" fill="var(--primary)" rx="2" />
                <text x="12" y="8" font-size="10" fill="var(--text-muted)">Your Skills</text>
                
                <rect x="85" width="8" height="8" fill="none" stroke="var(--secondary)" stroke-width="1" stroke-dasharray="2,1" rx="2" />
                <text x="97" y="8" font-size="10" fill="var(--text-muted)">Market Demand</text>
            </g>
        </svg>
    `;
}



// --- Roleplay Logic ---
let activeRoleplay = null;
let roleplayStep = 0;

function startRoleplay(careerId) {
    if (!roleplays[careerId]) {
        alert("Roleplay for this career coming soon!");
        return;
    }
    activeRoleplay = roleplays[careerId];
    roleplayStep = 0;
    renderRoleplayQuestion();
    document.getElementById('roleplay-modal').classList.add('active');
}

function renderRoleplayQuestion() {
    const content = document.getElementById('roleplay-content');
    const scenario = activeRoleplay[roleplayStep];

    content.innerHTML = `
    < h4 style = "color: var(--secondary); margin-bottom: 8px;" > Scenario ${roleplayStep + 1}</h4 >
        <p style="font-size: 1.05rem; margin-bottom: 24px; line-height: 1.6;">${scenario.q}</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
            ${scenario.options.map((opt, i) => `
                <button class="btn" style="background: var(--surface); text-align: left; justify-content: flex-start;" onclick="submitRoleplayAnswer(${i})">${opt}</button>
            `).join('')}
        </div>
`;
}

function submitRoleplayAnswer(idx) {
    const content = document.getElementById('roleplay-content');
    const scenario = activeRoleplay[roleplayStep];
    const isCorrect = idx === scenario.correct;

    content.innerHTML = `
    < div style = "font-size: 3rem; margin-bottom: 16px;" > ${isCorrect ? '✅' : '🎓'}</div >
        <h3>${isCorrect ? 'Great Decision!' : 'Interesting Choice...'}</h3>
        <p style="margin: 16px 0; line-height: 1.6;">${scenario.feedback}</p>
        <button class="btn btn-primary" style="width: 100%;" onclick="nextRoleplayStep()">
            ${roleplayStep < activeRoleplay.length - 1 ? 'Next Scenario' : 'Finish Simulation'}
        </button>
`;
}

function nextRoleplayStep() {
    roleplayStep++;
    if (roleplayStep < activeRoleplay.length) {
        renderRoleplayQuestion();
    } else {
        document.getElementById('roleplay-modal').classList.remove('active');
        if (!user.completedSimulations.includes(activeRoleplay[0].category)) {
            user.completedSimulations.push(activeRoleplay[0].category);
            localStorage.setItem('pathpilot_user', JSON.stringify(user));
        }
        addNotif("Roleplay Complete", "You've successfully finished a career simulation!");
        updateProfileDisplay();
    }
}

// --- Theme Logic ---
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pathpilot_theme', newTheme);

    // Update Icon
    const themeIcon = document.getElementById('theme-icon');
    if (!themeIcon) return;
    if (newTheme === 'light') {
        themeIcon.innerHTML = `< circle cx = "12" cy = "12" r = "5" ></circle ><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    } else {
        themeIcon.innerHTML = `< path d = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" ></path > `;
    }
}

// --- Community Logic ---
function renderCommunities() {
    const list = document.getElementById('community-list');
    const userCategory = user.primaryInterest || "Technical";

    if (communities.length === 0) {
        list.className = "";
        list.innerHTML = `< div class="glass-card animate" style = "grid-column: 1/-1; text-align: center; padding: 40px;" ><h3>No communities found yet.</h3><p style="color:var(--text-muted);">Check back later for new networking groups!</p></div > `;
        return;
    }

    list.innerHTML = communities.map(c => {
        const joined = user.communities.includes(c.id);
        const match = c.focus === userCategory || userCategory.includes(c.focus);

        return `
    < div class="glass-card animate" style = "border-top: 2px solid ${match ? 'var(--primary)' : 'transparent'}" >
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <h3 style="font-size: 1.1rem;">${c.name}</h3>
                    ${match ? '<span class="badge" style="background: var(--primary); color: white; font-size: 0.6rem; padding: 2px 6px; border-radius: 4px;">For You</span>' : ''}
                </div>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 8px 0;">${c.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                    <p style="font-size: 0.75rem; font-weight: 600; color: var(--secondary);">${c.members} Members</p>
                    ${joined ? `<button class="btn" style="padding: 4px 10px; font-size: 0.7rem; background: var(--surface);" onclick="openCommunityFeed('${c.id}')">Discussion</button>` : ''}
                </div>
                <button class="btn ${joined ? '' : 'btn-primary'}" style="width: 100%; margin-top: 16px; font-size: 0.8rem; padding: 10px;" 
                        onclick="joinCommunity('${c.id}')" ${joined ? 'disabled' : ''}>
                    ${joined ? 'Member' : 'Join Discussion'}
                </button>
            </div >
    `;
    }).join('');
}

function openCommunityFeed(id) {
    activeCommunityId = id;
    const community = communities.find(c => c.id === id);
    document.getElementById('feed-title').innerText = community.name + " Feed";
    renderFeed(id);
    document.getElementById('community-feed-modal').classList.add('active');
}

function renderFeed(id) {
    const list = document.getElementById('feed-content');
    const messages = communityMessages[id] || [];

    list.innerHTML = messages.map(m => `
    < div style = "margin-bottom: 16px; display: flex; flex-direction: column; align-items: ${m.user === user.name ? 'flex-end' : 'flex-start'};" >
            <div style="background: ${m.user === user.name ? 'var(--primary)' : 'var(--surface)'}; padding: 12px; border-radius: 12px; max-width: 80%; border: 1px solid var(--glass-border);">
                <p style="font-size: 0.75rem; font-weight: 700; color: ${m.user === user.name ? 'white' : 'var(--primary)'}; margin-bottom: 4px;">${m.user}</p>
                <p style="font-size: 0.9rem; line-height: 1.4;">${m.text}</p>
            </div>
            <span style="font-size: 0.65rem; color: var(--text-muted); margin-top: 4px;">${m.time}</span>
        </div >
    `).join('');

    list.scrollTop = list.scrollHeight;
}

function handleFeedSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('feed-input');
    const text = input.value.trim();
    if (!text || !activeCommunityId) return;

    if (!communityMessages[activeCommunityId]) communityMessages[activeCommunityId] = [];

    communityMessages[activeCommunityId].push({
        user: user.name,
        text: text,
        time: "Just now"
    });

    input.value = "";
    renderFeed(activeCommunityId);
}

function joinCommunity(id) {
    if (!user.communities.includes(id)) {
        user.communities.push(id);
        localStorage.setItem('pathpilot_user', JSON.stringify(user));
        renderCommunities();
        updateProfileDisplay();
        addNotif("Group Joined", `You are now a member of ${communities.find(c => c.id === id).name}.`);
        unlockBadge("community-pro");
    }
}

// --- Experience Logic ---
function renderExperiences() {
    const list = document.getElementById('experience-list');
    const userCategory = user.primaryInterest || "Technical";

    list.innerHTML = experiences.map(e => {
        const match = e.focus === userCategory || userCategory.includes(e.focus);
        return `
    < div class="glass-card animate" style = "display: flex; flex-direction: column; justify-content: space-between;" >
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="badge" style="background: ${e.type === 'Internship' ? 'var(--primary)' : 'var(--accent)'}; color:white; font-size:0.6rem; padding: 2px 6px; border-radius:4px;">${e.type}</span>
                        <span style="font-size: 0.7rem; color: var(--success); font-weight:700;">${e.stipend}</span>
                    </div>
                    <h3 style="font-size: 1.1rem; margin: 10px 0 4px;">${e.title}</h3>
                    <p style="font-size: 0.85rem; color: var(--secondary); font-weight: 600;">${e.company}</p>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">Duration: ${e.duration}</p>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 16px; font-size: 0.8rem; padding: 10px;" onclick="addNotif('Application Sent', 'Applied to ${e.company} as ${e.title}.')">Apply Now</button>
            </div >
    `;
    }).join('');
}

// --- PilotBot (AI Coach) Logic ---
function toggleChat() {
    document.getElementById('chat-panel').classList.toggle('active');
}

function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    addChatMessage('user', msg);
    input.value = '';

    // Simulated Typing Indicator
    const body = document.getElementById('chat-body');
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot-msg';
    typing.id = 'bot-typing';
    typing.innerHTML = '<span class="dot-typing"></span><span class="dot-typing"></span><span class="dot-typing"></span>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
        document.getElementById('bot-typing')?.remove();
        const response = getBotResponse(msg.toLowerCase());

        // Typing effect for the actual response
        const botDiv = document.createElement('div');
        botDiv.className = 'chat-msg bot-msg';
        body.appendChild(botDiv);

        let i = 0;
        const speed = 20; // Type speed in ms
        function typeWriter() {
            if (i < response.length) {
                botDiv.innerText += response.charAt(i);
                i++;
                body.scrollTop = body.scrollHeight;
                setTimeout(typeWriter, speed);
            }
        }
        typeWriter();
    }, 1200);
}

function addChatMessage(role, text) {
    const body = document.getElementById('chat-body');
    const div = document.createElement('div');
    div.className = `chat - msg ${role}-msg`;
    div.innerText = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}

function getBotResponse(query) {
    const lowerQuery = query.toLowerCase().trim();

    // Check for "panel" or "discuss" to trigger multi-mentor simulation
    if (lowerQuery.includes('panel') || lowerQuery.includes('discuss') || lowerQuery.includes('everyone')) {
        return `** [MULTI - MENTOR PANEL DISCUSSION] **\n\n ** Dr.Aris(Technical):** "From a technical standpoint, scalability is key. Master the underlying data structures."\n\n ** Sarah(Commercial):** "I agree, but don't forget the ROI. The market needs solutions that are both fast and profitable."\n\n ** Leo(Creative):** "Experience is everything. Empathy is your anchor."\n\n ** Anya(Social):** "We must also consider the ethical impact."`;
    }

    const userName = (typeof user !== 'undefined' && user.name) ? user.name : "Guest Student";
    const bookedMentors = mentors.filter(m => userName !== "Guest Student" && Math.random() > 0.5);
    let prefix = "";
    if (bookedMentors.length > 0 && Math.random() > 0.7) {
        const m = bookedMentors[Math.floor(Math.random() * bookedMentors.length)];
        prefix = `[Advice from ${m.name}]: "${m.advice}" -- `;
    }

    // Keyword matching
    if (lowerQuery.includes('career') || lowerQuery.includes('job') || lowerQuery.includes('work')) {
        const topCareers = careers.slice(0, 3).map(c => c.title).join(', ');
        return prefix + `We have information on over ${careers.length} careers! Some popular ones are ${topCareers}. Which field interests you most ? `;
    }
    if (lowerQuery.includes('college') || lowerQuery.includes('university') || lowerQuery.includes('school')) {
        return prefix + `I can help you compare top colleges like ${colleges[0].name} and ${colleges[1].name}. Try checking the 'Colleges' tab for details!`;
    }
    if (lowerQuery.includes('scholarship') || lowerQuery.includes('money') || lowerQuery.includes('fund') || lowerQuery.includes('aid')) {
        return prefix + `There are many scholarships available like ${scholarships[0].name}. You can find more in the 'Resources' section under the Scholarships tab!`;
    }
    if (lowerQuery.match(/\b(hi|hello|hey|hola|sup|yo|greetings)\b/)) {
        return `Hello ${userName} !I'm PilotBot, your AI career coach. How can I help you navigate your future today?`;
    }
    if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
        return `I can help you explore careers, find scholarships, compare colleges, or generate a personalized roadmap. Just ask me about any of these!`;
    }

    return prefix + "That's a great question! I recommend exploring the Career Encyclopedia for deep-dives or checking your personalized Roadmap for your next milestones. Is there a specific field you're curious about?";
}

// --- Smooth Animations (Intersection Observer) ---
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

function initAnimations() {
    document.querySelectorAll('.animate').forEach(el => observer.observe(el));
}

// --- Phase 10: Advanced Toolkit ---
function generateResume() {
    const container = document.getElementById('resume-preview-container');
    const preview = document.getElementById('resume-preview');

    const topSubject = Object.keys(user.marks).reduce((a, b) => user.marks[a] > user.marks[b] ? a : b);
    const joins = user.communities.map(id => communities.find(c => c.id === id)?.name || id).join(', ');

    preview.innerHTML = `
        <div style="border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
                <h1 style="margin: 0; color: #1e293b; font-size: 2.5rem;">${user.name}</h1>
                <p style="margin: 5px 0 0; color: #6366f1; font-weight: 600; font-size: 1.1rem;">${user.primaryInterest || 'Future Professional'}</p>
            </div>
            <div style="text-align: right; font-size: 0.9rem; color: #64748b;">
                <p>Grade: Class ${user.class}</p>
                <p>PathPilot Verified Profile</p>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <h3 style="color: #6366f1; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">Academic Excellence</h3>
            <p><strong>Primary Strength:</strong> ${topSubject.toUpperCase()} (${user.marks[topSubject]}%)</p>
            <p style="margin-top: 10px;">Consistently performing in top percentiles within ${user.marks.math > 80 ? 'logical' : 'analytical'} and ${user.marks.arts > 80 ? 'creative' : 'theoretical'} domains.</p>
        </div>

        <div style="margin-bottom: 30px;">
            <h3 style="color: #6366f1; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">Ecosystem & Networking</h3>
            <p><strong>Active Communities:</strong> ${joins || 'Building nascent network'}</p>
            <p style="margin-top: 10px;">Engaging with peer groups to foster collaborative learning and industry-standard competency.</p>
        </div>

        <div style="margin-bottom: 30px;">
            <h3 style="color: #6366f1; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">Career Roadmap</h3>
            <p>Currently tracking <strong>${savedRoadmaps.length} active career paths</strong>. Targeted focus on high-growth sectors with calculated ROI and accessibility metrics.</p>
        </div>

        <div style="text-align: center; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 0.8rem; color: #94a3b8;">
            Generated via PathPilot AI Portfolio Builder
        </div>
    `;

    container.classList.remove('hidden');
    container.scrollIntoView({ behavior: 'smooth' });
}

function printResume() {
    window.print();
}

function sharePortfolio() {
    const url = window.location.href + "?user=" + btoa(user.name);
    navigator.clipboard.writeText(url).then(() => {
        alert("Portfolio Link Copied! You can now share this with colleges or mentors.");
        addNotif("Link Copied", "Your personalized portfolio link is ready to share.");
    });
}

// Service Worker Registration for PWA (Only on HTTP/HTTPS)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('PathPilot Service Worker Registered', reg))
            .catch(err => console.log('SW Registration Failed', err));
    });
}

// --- Init ---
// industryPulses loaded from DB at top of file

let pulseIndex = 0;

function initIndustryFeed() {
    renderIndustryFeed();
    setInterval(() => {
        pulseIndex = (pulseIndex + 1) % industryPulses.length;
        const feed = document.getElementById('industry-feed');
        if (feed) {
            feed.style.opacity = '0';
            setTimeout(() => {
                renderIndustryPulse();
                feed.style.opacity = '1';
            }, 300);
        }
    }, 8000); // Consolidated to 8 seconds with animation
}

function renderIndustryFeed() {
    const feed = document.getElementById('industry-feed');
    if (!feed) return;
    renderIndustryPulse();
}

function renderIndustryPulse() {
    const feed = document.getElementById('industry-feed');
    const status = document.getElementById('market-status');
    const t = translations[currentLanguage];
    if (!feed) return;

    const pulse = industryPulses[pulseIndex];
    if (status) status.innerText = (t['live-status'] || "Live: ") + pulse.sector;

    feed.innerHTML = `
        <div class="pulse-item animate">
            <p style="font-size: 0.85rem; color: var(--text-main); line-height: 1.4;">${pulse.text}</p>
            <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">${t['verified-pulse'] || "Verified Industry Pulse"} &bull; Just Now</p>
        </div>
    `;
}

function startPulseRotation() {
    setInterval(() => {
        pulseIndex = (pulseIndex + 1) % industryPulses.length;
        const feed = document.getElementById('industry-feed');
        if (feed) {
            feed.style.opacity = '0';
            setTimeout(() => {
                renderIndustryPulse();
                feed.style.opacity = '1';
            }, 300);
        }
    }, 8000);
}

window.onload = () => {
    // Load Theme
    const savedTheme = localStorage.getItem('pathpilot_theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }

    updateProfileDisplay();
    renderQuestion();
    renderColleges();
    renderNotifs();
    updateNotifBadge();
    initAnimations();

    if (user.name === "Guest Student") setTimeout(openOnboarding, 1500);
    renderSkillVelocity();
    renderReadinessDashboard();
    initMissionHub();
    checkExpertRecognition();
    renderGlobalColleges();
    initCommandPalette();
    initIndustryFeed();

    // Set saved scheme
    const savedScheme = localStorage.getItem('pathpilot_scheme') || 'forest';
    setThemeScheme(savedScheme);
};

// --- Phase 12: Advanced Modules ---

function renderGlobalColleges() {
    const list = document.getElementById('global-colleges-list');
    if (!list) return;
    list.innerHTML = globalColleges.map(c => `
        <div class="glass-card resource-card animate" style="border-top: 4px solid var(--accent);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3 style="font-size: 1.1rem;">${c.name}</h3>
                <span class="badge" style="background: var(--surface); color: var(--accent); font-size: 0.65rem;">${c.location}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 8px 0;">Rank: <strong>${c.rank}</strong></p>
            <p style="font-size: 0.8rem; color: var(--secondary); font-weight: 600;">Scholarship: ${c.scholarships}</p>
            <a href="${c.link}" target="_blank" class="btn btn-primary" style="width: 100%; margin-top: 16px; font-size: 0.8rem; padding: 10px; text-decoration: none; text-align: center;">View University</a>
        </div>
    `).join('');
}

function renderSkillVelocity() {
    const container = document.getElementById('skill-velocity-container');
    if (!container) return;

    // Simulate growth data for Logic, Knowledge, Social, Creative
    const labels = ['Logic', 'Know', 'Social', 'Cre'];
    const data = [
        40 + (user.marks.math / 2),
        40 + (user.marks.science / 2),
        50 + (user.communities.length * 10),
        40 + (user.marks.arts / 2)
    ];

    const width = container.offsetWidth || 300;
    const height = 150;
    const padding = 30;

    const points = data.map((val, i) => {
        const x = padding + (i * (width - 2 * padding) / (data.length - 1));
        const y = height - padding - ((val / 100) * (height - 2 * padding));
        return { x, y, val, label: labels[i] };
    });

    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    container.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
            <!-- Grid Lines -->
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--glass-border)" stroke-width="1" />
            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="var(--glass-border)" stroke-width="1" />
            
            <!-- Area under the curve -->
            <path d="${d} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z" fill="url(#gradient-velocity)" opacity="0.1" />
            
            <!-- The Line -->
            <path d="${d}" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="animate-path" />
            
            <!-- Points and Labels -->
            ${points.map(p => `
                <circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--primary)" />
                <text x="${p.x}" y="${height - 5}" text-anchor="middle" fill="var(--text-muted)" font-size="10">${p.label}</text>
                <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" fill="var(--primary)" font-size="10" font-weight="700">${Math.round(p.val)}%</text>
            `).join('')}

            <defs>
                <linearGradient id="gradient-velocity" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:var(--primary);stop-opacity:0.4" />
                    <stop offset="100%" style="stop-color:var(--primary);stop-opacity:0" />
                </linearGradient>
            </defs>
        </svg>
    `;
}

function startInterview() {
    interviewStep = 0;
    interviewAnswers = [];
    document.getElementById('interview-chat').innerHTML = "";
    document.getElementById('interview-modal').classList.add('active');
    addInterviewMessage('bot', "Welcome to Interview Pilot! I'm your AI Interviewer. We'll go through 5 questions focused on your primary interest. Let's start!");
    setTimeout(nextInterviewQuestion, 1000);
}

function addInterviewMessage(role, text) {
    const chat = document.getElementById('interview-chat');
    const div = document.createElement('div');
    div.style.marginBottom = "16px";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = role === 'user' ? 'flex-end' : 'flex-start';

    div.innerHTML = `
        <div style="background: ${role === 'user' ? 'var(--primary)' : 'var(--surface)'}; color: ${role === 'user' ? 'white' : 'var(--text-main)'}; padding: 12px; border-radius: 12px; max-width: 80%; border: 1px solid var(--glass-border);">
            <p style="font-size: 0.75rem; font-weight: 700; color: ${role === 'user' ? 'white' : 'var(--primary)'}; margin-bottom: 4px;">${role === 'user' ? user.name : 'PilotBot AI'}</p>
            <p style="font-size: 0.9rem; line-height: 1.4;">${text}</p>
        </div>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function nextInterviewQuestion() {
    const category = user.primaryInterest || "Technical";
    const questions = interviewQuestions[category] || interviewQuestions["Technical"];

    if (interviewStep < 5) {
        addInterviewMessage('bot', questions[interviewStep]);
        document.getElementById('interview-progress').innerText = `Question ${interviewStep + 1}/5`;
    } else {
        finishInterview();
    }
}

function submitInterviewResponse() {
    const input = document.getElementById('interview-input');
    const text = input.value.trim();
    if (!text || interviewStep >= 5) return;

    addInterviewMessage('user', text);
    interviewAnswers.push(text);
    input.value = "";
    interviewStep++;

    setTimeout(nextInterviewQuestion, 1000);
}

function finishInterview() {
    document.getElementById('interview-progress').innerText = "Simulation Complete";
    addInterviewMessage('bot', "Great job! You've completed the mock interview. Here's your performance analysis:");

    // Phase 34: Keyword-Based Analysis
    const analysis = analyzeInterviewPerformance();

    setTimeout(() => {
        addInterviewMessage('bot', `**Interview Score: ${analysis.score}/100**\n\n**Analysis:** ${analysis.feedback}\n\n**Top Tip:** ${analysis.tip}`);
        addNotif("Interview Complete", `You scored ${analysis.score}% in the ${user.primaryInterest} mock simulation!`);
        unlockBadge("first-interview");
        updateProfileDisplay();
    }, 1500);
}

function analyzeInterviewPerformance() {
    let score = 50; // Base score
    let keywordsFound = 0;
    const coreKeywords = ['star', 'problem', 'solution', 'team', 'achieved', 'result', 'learned', 'goal', 'leadership', 'communication'];
    const technicalKeywords = ['api', 'debug', 'frontend', 'backend', 'database', 'optimization', 'cloud', 'security'];

    const allAnswers = interviewAnswers.join(' ').toLowerCase();

    // 1. Length Bonus
    const avgLength = interviewAnswers.reduce((acc, a) => acc + a.split(' ').length, 0) / interviewAnswers.length;
    if (avgLength > 20) score += 20;
    else if (avgLength > 10) score += 10;

    // 2. Keyword matching
    coreKeywords.forEach(k => {
        if (allAnswers.includes(k)) {
            score += 3;
            keywordsFound++;
        }
    });

    if (user.primaryInterest === 'Technical') {
        technicalKeywords.forEach(k => {
            if (allAnswers.includes(k)) score += 2;
        });
    }

    score = Math.min(100, score);

    let feedback = "";
    let tip = "";

    if (score > 85) {
        feedback = "Exceptional performance! Your answers were structured and used high-impact professional terminology.";
        tip = "You're ready for real-world interviews. Focus on refining your personal brand.";
    } else if (score > 65) {
        feedback = "Solid performance. You communicate clearly, but could integrate more specific results into your stories.";
        tip = "Try using the STAR method (Situation, Task, Action, Result) for all your examples.";
    } else {
        feedback = "A good start. Your answers are a bit short, which might not show enough of your expertise.";
        tip = "Aim for 3-4 sentences per answer and use more technical keywords relevant to the role.";
    }

    return { score, feedback, tip };
}


// --- Phase 14: AI Personalization & Community Growth ---

function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;

    grid.innerHTML = achievementsData.map(a => {
        const isUnlocked = user.unlockedBadges.includes(a.id);
        return `
            <div class="glass-card animate" style="text-align: center; padding: 20px; border: 1px solid ${isUnlocked ? 'var(--primary)' : 'var(--glass-border)'}; opacity: ${isUnlocked ? 1 : 0.5}; transform: ${isUnlocked ? 'scale(1)' : 'scale(0.95)'}; transition: all 0.3s ease;">
                <div style="font-size: 2.5rem; margin-bottom: 12px; filter: ${isUnlocked ? 'none' : 'grayscale(100%)'};">${a.icon}</div>
                <h4 style="font-size: 0.9rem; margin-bottom: 4px; color: ${isUnlocked ? 'var(--primary)' : 'var(--text-muted)'};">${a.title}</h4>
                <p style="font-size: 0.7rem; color: var(--text-muted); line-height: 1.3;">${a.desc}</p>
                ${isUnlocked ? `
                    <div style="display: flex; gap: 4px; justify-content: center; margin-top: 8px;">
                        <span class="badge" style="background: var(--primary); color: white; font-size: 0.55rem;">Unlocked</span>
                        <button class="btn" onclick="shareAchievement('${a.title}')" style="background: var(--surface); color: var(--text-main); font-size: 0.5rem; padding: 4px 8px; height: auto;">Share</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    document.getElementById('badge-count').innerText = `${user.unlockedBadges.length} Badges`;
}

function unlockBadge(id) {
    if (user.unlockedBadges.includes(id)) return;
    const badge = achievementsData.find(a => a.id === id);
    if (!badge) return;

    user.unlockedBadges.push(id);
    localStorage.setItem('pathpilot_user', JSON.stringify(user));
    addNotif("New Achievement! 🏆", `You've unlocked the '${badge.title}' badge!`);
    renderAchievements();
}

function checkAchievements() {
    if (user.communities.length >= 3) unlockBadge("community-pro");
    if (user.marks.math > 90 || user.marks.science > 90 || user.marks.arts > 90) unlockBadge("top-marks");
    if (savedRoadmaps.length >= 3) unlockBadge("roadmap-builder");
    // Other checks are triggered by actions
}

function generateAICourse(careerTitle) {
    const career = careers.find(c => c.title === careerTitle) || careers[0];
    const modal = document.getElementById('course-modal');
    document.getElementById('course-title').innerText = `AI Mastery: ${career.title}`;
    document.getElementById('course-subtitle').innerText = `4-Week Personalized Curriculum for ${user.name}`;

    const content = document.getElementById('course-content');
    const weeks = [
        { title: "Week 1: Fundamentals", tasks: [`Introduction to ${career.skills[0]}`, `Core concepts of ${career.category}`] },
        { title: "Week 2: Essential Toolkit", tasks: [`Mastering ${career.toolkit[0]}`, `Hands-on project with ${career.skills[1]}`] },
        { title: "Week 3: Advanced Application", tasks: [`Deep dive into ${career.skills[2]}`, `Simulated industry scenario`] },
        { title: "Week 4: Professional Capstone", tasks: [`Building a ${career.title} portfolio`, `Mock interview preparation`] }
    ];

    content.innerHTML = weeks.map((w, i) => `
        <div class="glass-card" style="margin-bottom: 16px; border-left: 4px solid var(--primary);">
            <h4 style="color: var(--primary); margin-bottom: 8px;">${w.title}</h4>
            <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-main);">
                ${w.tasks.map(t => `<li style="margin-bottom: 4px;">${t}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    modal.classList.add('active');
}

function addCourseToProfile() {
    addNotif("Course Enrolled", "Your AI-generated course has been added to your primary roadmap.");
    closeModal('course-modal');
}

function exportPortfolioMarkdown() {
    const topSubject = Object.keys(user.marks).reduce((a, b) => user.marks[a] > user.marks[b] ? a : b);

    let md = `# PathPilot Professional Portfolio - ${user.name}\n\n`;
    md += `## Profile Overview\n`;
    md += `- **Name:** ${user.name}\n`;
    md += `- **Focus:** ${user.primaryInterest || 'N/A'}\n`;
    md += `- **Class:** ${user.class}\n\n`;

    md += `## Academic Performance\n`;
    md += `- **Top Subject:** ${topSubject.toUpperCase()} (${user.marks[topSubject]}%)\n`;
    md += `- **Skill Velocity:** High Growth in ${user.primaryInterest} domains.\n\n`;

    md += `## Achievements & Badges\n`;
    user.unlockedBadges.forEach(bid => {
        const b = achievementsData.find(a => a.id === bid);
        md += `- **${b.title}:** ${b.desc}\n`;
    });

    md += `\n## Career Roadmap\n`;
    savedRoadmaps.forEach(r => {
        md += `- **${r.title}:** Projected ROI ${r.roi} | Difficulty ${r.difficulty}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PathPilot_Portfolio_${user.name.replace(/\s+/g, '_')}.md`;
    a.click();

    addNotif("Portfolio Exported", "Your Markdown portfolio has been downloaded.");
}

// Update Mentor personality in bot responses

// --- Phase 15: Career Resilience & Global Feedback ---

function runPivotSimulation(scenario) {
    const resultDiv = document.getElementById('pivot-result');
    if (savedRoadmaps.length === 0) {
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `<p style="color: var(--warning); font-size: 0.9rem;">Please save a roadmap first to run a resilience simulation.</p>`;
        return;
    }

    const primaryRoadmap = savedRoadmaps[0];
    const outcomes = pivotOutcomes;

    // Phase 34: Resilience Score Tracking
    if (!user.completedResilience) user.completedResilience = [];
    if (!user.completedResilience.includes(scenario)) {
        user.completedResilience.push(scenario);
        user.resilienceScore = Math.min(100, (user.resilienceScore || 0) + 15);
        localStorage.setItem('pathpilot_user', JSON.stringify(user));
        updateProfileDisplay();
    }

    const choice = outcomes[scenario];
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
        <h4 style="color: var(--accent); margin-bottom: 8px;">Simulation Result: ${choice.impact}</h4>
        <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-main);">${choice.advice}</p>
        <div style="margin-top: 12px; border-top: 1px dashed var(--glass-border); padding-top: 10px;">
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px;">Recommended Resilience Skills:</p>
            <div style="display: flex; gap: 8px;">
                ${choice.pivotSkills.map(s => `<span class="badge" style="background: var(--surface); color: var(--accent); border: 1px solid var(--accent); font-size: 0.65rem;">${s}</span>`).join('')}
            </div>
            <p style="font-size: 0.7rem; color: var(--success); margin-top: 8px;"><strong>+15 Resilience Points</strong> added to your profile.</p>
        </div>
    `;
    addNotif("Simulation Complete", `Resilience report generated for ${scenario.replace('_', ' ')}.`);
}

function renderSkillGap(career) {
    const userCategory = career.category === "Technical" ? "science" : (career.category === "Commercial" ? "commerce" : "arts");
    const userMark = user.marks[userCategory] || 0;
    const targetMark = 85; // Standard high benchmark
    const gap = targetMark - userMark;

    return `
        <div class="glass-card" style="margin-top: 24px; border-top: 1px solid var(--glass-border); background: rgba(var(--primary-rgb), 0.05);">
            <h4 style="color: var(--primary); margin-bottom: 12px; font-size: 0.9rem;">Skill Gap Analysis (vs. ${user.name})</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.8rem;">
                <span color="var(--text-muted)">Academic Baseline</span>
                <span font-weight="700">${userMark}% / ${targetMark}%</span>
            </div>
            <div class="progress-container" style="height: 8px; background: var(--surface);">
                <div class="progress-bar" style="width: ${Math.min(100, (userMark / targetMark) * 100)}%; background: ${gap <= 0 ? 'var(--success)' : 'var(--warning)'};"></div>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">
                ${gap <= 0 ? "You exceed the standard baseline! Focus on advanced specialization." : `You have a **${gap}% gap** in ${userCategory} foundations. Recommendation: Enroll in the AI Masterclass.`}
            </p>
        </div>
    `;
}

// --- Phase 16: Final Polish & Ecosystem Growth ---

function calculateReadinessScore() {
    let score = 0;
    const w = readyScoreWeights;

    // Assessment
    if (Object.values(user.marks).some(v => v > 0)) score += w.assessment;

    // Roadmaps
    score += Math.min(w.roadmapMax, w.roadmapBase + (savedRoadmaps.length * w.roadmapMultiplier));

    // Interviews
    if (user.unlockedBadges.includes("first-interview")) score += w.interview;

    // Achievements
    score += Math.min(w.badgeMax, user.unlockedBadges.length * w.badgeMultiplier);

    return Math.min(100, score);
}

function renderReadinessDashboard() {
    const radial = document.getElementById('readiness-radial');
    const label = document.getElementById('readiness-label');
    const feedback = document.getElementById('readiness-feedback');
    if (!radial) return;

    const score = calculateReadinessScore();
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    radial.innerHTML = `
        <svg width="150" height="150" style="transform: rotate(-90deg);">
            <circle cx="75" cy="75" r="${radius}" fill="none" stroke="var(--surface)" stroke-width="12"></circle>
            <circle cx="75" cy="75" r="${radius}" fill="none" stroke="var(--primary)" stroke-width="12" 
                stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" style="transition: stroke-dashoffset 1s ease-out;"></circle>
            <text x="75" y="-75" transform="rotate(90)" fill="var(--text-main)" font-size="2rem" font-weight="700" text-anchor="middle" dominant-baseline="middle">${score}%</text>
        </svg>
    `;

    if (score < 40) {
        label.innerText = "Early Explorer";
        feedback.innerText = "Start by saving your first career roadmap and completing a mock interview.";
    } else if (score < 80) {
        label.innerText = "Intermediate Pilot";
        feedback.innerText = "Great progress! Join more communities and unlock specialist badges to boost your score.";
    } else {
        label.innerText = "Industry Ready";
        feedback.innerText = "Exceptional profile. You have completed the essential milestones for professional success.";
    }
}

function openCommandPalette() {
    const palette = document.getElementById('command-palette');
    palette.classList.add('active');
    const input = document.getElementById('command-search');
    input.value = "";
    input.focus();
    renderCommandResults("");
}

function closeCommandPalette() {
    document.getElementById('command-palette').classList.remove('active');
}

function initCommandPalette() {
    const input = document.getElementById('command-search');
    input.addEventListener('input', (e) => renderCommandResults(e.target.value));

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            openCommandPalette();
        }
        if (e.key === 'Escape') closeCommandPalette();
    });
}

function renderCommandResults(query) {
    const list = document.getElementById('command-results');
    const q = query.toLowerCase();

    let results = [];

    // Search Sections
    const sections = [
        { name: "Global Hub", id: "resources", icon: "🌍" },
        { name: "Encyclopedia", id: "encyclopedia", icon: "📚" },
        { name: "My Profile", id: "profile", icon: "👤" },
        { name: "Assessment", id: "assessment", icon: "📝" }
    ];
    results.push(...sections.filter(s => s.name.toLowerCase().includes(q)).map(s => ({ ...s, type: 'Section' })));

    // Search Careers (Improved with skill-based matching)
    const careerMatches = careers.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
    ).map(c => {
        const skillMatch = c.skills.find(s => s.toLowerCase().includes(q));
        return {
            name: c.title,
            id: c.id,
            type: 'Career',
            icon: '💼',
            subtitle: skillMatch ? `Matches skill: ${skillMatch}` : c.category
        };
    });
    results.push(...careerMatches);

    // Search Colleges
    results.push(...colleges.filter(c => c.name.toLowerCase().includes(q)).map(c => ({ name: c.name, id: c.id, type: 'College', icon: '🏛️', subtitle: 'Institution' })));

    if (results.length === 0) {
        list.innerHTML = `<p style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">No results found for "${query}"</p>`;
        return;
    }

    list.innerHTML = results.slice(0, 8).map(r => `
        <div class="command-item" style="padding: 12px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: background 0.2s;" 
            onclick="handleCommandSelection('${r.type}', '${r.id}')">
            <span style="font-size: 1.2rem;">${r.icon}</span>
            <div style="flex: 1;">
                <p style="font-size: 0.9rem; font-weight: 600; color: var(--text-main);">${r.name}</p>
                <p style="font-size: 0.7rem; color: var(--text-muted);">${r.subtitle || r.type}</p>
            </div>
            <span style="font-size: 0.7rem; color: var(--primary);">Go &rarr;</span>
        </div>
    `).join('');
}

function handleCommandSelection(type, id) {
    closeCommandPalette();
    if (type === 'Section') {
        showSection(id);
    } else if (type === 'Career') {
        showSection('encyclopedia');
        openCareerModal(id);
    } else if (type === 'College') {
        showSection('directory');
        // Optional: auto scroll or open specific college logic
    }
}

function shareAchievement(title) {
    addNotif("Link Copied", `Your '${title}' achievement link is ready to share on LinkedIn!`);
}


function downloadDataBackup() {
    const data = {
        user: user,
        roadmaps: savedRoadmaps,
        notifications: notifications,
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PathPilot_Backup_${user.name.replace(/\s+/g, '_')}.json`;
    a.click();
    addNotif("Backup Successful", "Your profile and roadmap data has been exported.");
}

function resetProfile() {
    if (confirm("Are you sure you want to reset your profile? This will delete all saved roadmaps, assessments, and badges. This action cannot be undone.")) {
        localStorage.removeItem('pathpilot_user');
        localStorage.removeItem('pathpilot_roadmaps');
        localStorage.removeItem('pathpilot_notifs');
        addNotif("Profile Reset", "System cleared. Reloading...");
        setTimeout(() => window.location.reload(), 1500);
    }
}

// --- Phase 19: Global Error Resilience ---

// --- Expert Recognition ---

function checkExpertRecognition() {
    const score = calculateReadinessScore();
    if (score >= 80 && !notifications.some(n => n.title === "Expert Recognition")) {
        addNotif("Expert Recognition", "A virtual Senior Architect from Google has noticed your high readiness score! Keep going.");
    }
    if (score >= 95 && !notifications.some(n => n.body.includes("Visionary"))) {
        addNotif("Elite Status Unlocked", "You've reached the 'Visionary' tier of readiness. You are in the top 1% of students worldwide.");
    }
}

// --- Phase 22: Global Reach & Admissions Hub ---

let currentLanguage = 'EN';
const translations = {
    'EN': {
        'home': 'Home',
        'assessment': 'Assessment',
        'degrees': 'Degrees',
        'colleges': 'Colleges',
        'resources': 'Resources',
        'encyclopedia': 'Encyclopedia',
        'profile': 'Profile',
        'hero-title': 'Fly Your Career with <span>PathPilot</span>',
        'hero-desc': 'Your personalized, AI-powered mentor for education and careers.',
        'mission-title': '🔥 Weekly Career Mission',
        'live-status': 'Live: ',
        'verified-pulse': 'Verified Industry Pulse'
    },
    'HI': {
        'home': 'होम',
        'assessment': 'मूल्यांकन',
        'degrees': 'डिग्रियां',
        'colleges': 'कॉलेज',
        'resources': 'संसाधन',
        'encyclopedia': 'विश्वकोश',
        'profile': 'प्रोफ़ाइल',
        'hero-title': 'PathPilot के साथ अपने करियर को <span>नई उड़ान दें</span>',
        'hero-desc': 'शिक्षा और करियर के लिए आपका व्यक्तिगत, एआई-संचालित मेंटर।',
        'mission-title': '🔥 साप्ताहिक करियर मिशन',
        'live-status': 'लाइव: ',
        'verified-pulse': 'सत्यापित उद्योग पल्स'
    },
    'TE': {
        'home': 'హోమ్',
        'assessment': 'అసెస్మెంట్',
        'degrees': 'డిగ్రీలు',
        'colleges': 'కళాశాలలు',
        'resources': 'వనరులు',
        'encyclopedia': 'ఎన్‌సైక్లోపీడియా',
        'profile': 'ప్రొఫైల్',
        'hero-title': 'PathPilotతో మీ కెరీర్‌ని <span>మలుచుకోండి</span>',
        'hero-desc': 'విద్య మరియు కెరీర్ కోసం మీ వ్యక్తిగతీకరించిన, AI-ఆధారిత మెంటర్.',
        'mission-title': '🔥 వారపు కెరీర్ మిషన్',
        'live-status': 'లైవ్: ',
        'verified-pulse': 'ధృవీకరించబడిన పరిశ్రమ పల్స్'
    }
};

function toggleLanguage() {
    if (currentLanguage === 'EN') currentLanguage = 'HI';
    else if (currentLanguage === 'HI') currentLanguage = 'TE';
    else currentLanguage = 'EN';

    const btn = document.getElementById('lang-toggle');
    if (btn) btn.innerText = currentLanguage;
    updateUITranslations();
}

function updateUITranslations() {
    const t = translations[currentLanguage];

    // Update Nav
    const navLinks = document.getElementById('nav-links').querySelectorAll('a');
    navLinks[0].innerText = t['home'];
    navLinks[1].innerText = t['assessment'];
    navLinks[2].innerText = t['degrees'];
    navLinks[3].innerText = t['colleges'];
    navLinks[4].innerText = t['resources'];
    navLinks[5].innerText = t['encyclopedia'];
    navLinks[6].innerText = t['profile'];

    // Update Hero
    const heroTitle = document.querySelector('#welcome-hero h1');
    const heroDesc = document.querySelector('#welcome-hero p');
    if (heroTitle) heroTitle.innerHTML = t['hero-title'];
    if (heroDesc) heroDesc.innerText = t['hero-desc'];

    // Update Mission
    const missionTitle = document.querySelector('#mission-hub h3');
    if (missionTitle) missionTitle.innerText = t['mission-title'];

    // Update Pulse
    renderIndustryPulse();

    const langNames = { 'EN': 'English', 'HI': 'Hindi', 'TE': 'Telugu' };
    addNotif("Language Switched", `PathPilot is now in ${langNames[currentLanguage]}.`);
}

function convertGPA() {
    const input = document.getElementById('gpa-input');
    const val = parseFloat(input.value);
    if (!val || val < 0 || val > 100) {
        alert("Please enter a valid percentage (0-100)");
        return;
    }

    const results = document.getElementById('gpa-results');
    const usGpa = document.getElementById('us-gpa');
    const ectsGrade = document.getElementById('ects-grade');

    // Simple Conversion Logic
    // US: 90-100=4.0, 80-89=3.7, 70-79=3.3, etc.
    let gpa = (val / 20) - 1;
    if (val >= 90) gpa = 4.0;
    else if (val >= 80) gpa = 3.7;
    else if (val >= 70) gpa = 3.3;
    else if (val >= 60) gpa = 3.0;
    else gpa = 2.0;

    let ects = "F";
    if (val >= 90) ects = "A";
    else if (val >= 80) ects = "B";
    else if (val >= 70) ects = "C";
    else if (val >= 60) ects = "D";
    else if (val >= 50) ects = "E";

    usGpa.innerText = gpa.toFixed(1);
    ectsGrade.innerText = ects;
    results.classList.remove('hidden');
}

// Phase 19: Global Error Recovery Modal
function showErrorModal(details) {
    const modal = document.getElementById('error-modal');
    const detailsEl = document.getElementById('error-details');
    if (modal && detailsEl) {
        detailsEl.innerText = details;
        modal.classList.add('active');
    }
}

// --- Phase 21: Mission Hub & Alumni Chat Implementation ---

function initMissionHub() {
    const missionText = document.getElementById('mission-text');
    const missionBtn = document.getElementById('mission-btn');
    if (!missionText || !missionBtn) return;

    // Pick a mission that hasn't been completed today, or just pick one based on day of year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const activeMission = weeklyMissions[dayOfYear % weeklyMissions.length];

    missionText.innerText = activeMission.text;

    // If completed in this session or recently
    if (user.completedMissions && user.completedMissions.includes(activeMission.id)) {
        missionBtn.innerText = "Completed";
        missionBtn.disabled = true;
        missionBtn.style.opacity = "0.5";
    }
}

function completeMission() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const activeMission = weeklyMissions[dayOfYear % weeklyMissions.length];

    if (user.completedMissions && user.completedMissions.includes(activeMission.id)) return;

    if (!user.completedMissions) user.completedMissions = [];
    user.completedMissions.push(activeMission.id);
    user.xp = (user.xp || 0) + activeMission.xp;

    localStorage.setItem('pathpilot_user', JSON.stringify(user));

    const missionBtn = document.getElementById('mission-btn');
    missionBtn.innerText = "Completed";
    missionBtn.disabled = true;
    missionBtn.style.opacity = "0.5";

    addNotif("Mission Accomplished! 🏆", `You earned ${activeMission.xp} XP for: ${activeMission.text}`);
    updateProfileDisplay();
}

function toggleAlumniChat() {
    const chatSection = document.getElementById('alumni-chat-section');
    chatSection.classList.toggle('hidden');
    if (!chatSection.classList.contains('hidden')) {
        // Scroll to chat
        chatSection.scrollIntoView({ behavior: 'smooth' });
        // Initial bot greeting if empty
        const chatBox = document.getElementById('alumni-chat-box');
        if (chatBox.children.length === 0) {
            const careerTitle = document.querySelector('#career-detail-content h1')?.innerText || "this field";
            addAlumniMessage('bot', `Hi! I'm an alumni currently working as a ${careerTitle}. What would you like to know about the industry? Experience, pay, or the daily grind?`);
        }
        // Auto-focus input
        const input = document.getElementById('alumni-chat-input');
        if (input) setTimeout(() => input.focus(), 300);
    }
}

function sendMessageToAlumni() {
    const input = document.getElementById('alumni-chat-input');
    const text = input.value.trim();
    if (!text) return;

    addAlumniMessage('user', text);
    input.value = "";

    // Simulated Alumni Typing state
    const box = document.getElementById('alumni-chat-box');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'alumni-typing';
    typingDiv.style.alignSelf = 'flex-start';
    typingDiv.style.background = 'rgba(255,255,255,0.05)';
    typingDiv.style.padding = '8px 12px';
    typingDiv.style.borderRadius = '12px';
    typingDiv.style.fontSize = '0.8rem';
    typingDiv.innerHTML = '<span class="dot-typing"></span><span class="dot-typing"></span><span class="dot-typing"></span>';
    box.appendChild(typingDiv);
    box.scrollTop = box.scrollHeight;

    // Simulated Alumni Response
    setTimeout(() => {
        document.getElementById('alumni-typing')?.remove();
        const response = getAlumniResponse(text);
        addAlumniMessage('bot', response);
    }, 1500);
}

function addAlumniMessage(role, text) {
    const box = document.getElementById('alumni-chat-box');
    const div = document.createElement('div');
    div.style.alignSelf = role === 'user' ? 'flex-end' : 'flex-start';
    div.style.background = role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)';
    div.style.color = role === 'user' ? 'white' : 'var(--text-main)';
    div.style.padding = '10px 14px';
    div.style.borderRadius = '12px';
    div.style.maxWidth = '85%';
    div.style.fontSize = '0.9rem';
    div.innerHTML = `<strong>${role === 'user' ? 'You' : 'Alumni'}:</strong> ${text}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function getAlumniResponse(query) {
    const q = query.toLowerCase();
    const careerTitle = document.querySelector('#career-detail-content h1')?.innerText || "the industry";

    // Base responses with career context
    if (q.includes('salary') || q.includes('pay') || q.includes('earn')) {
        return `As a ${careerTitle}, the starting pay is decent, but it scales very quickly once you have 2-3 years of experience. In this specific field, specialization is high-reward!`;
    }
    if (q.includes('work') || q.includes('life') || q.includes('daily')) {
        return `In ${careerTitle} roles, it varies. Some days are intense with deadlines, others are more focused on research and planning. It's rewarding if you enjoy problem solving!`;
    }
    if (q.includes('learn') || q.includes('skill') || q.includes('study')) {
        return `Definitely focus on the core fundamentals of ${careerTitle}. For this role, hands-on projects and a strong portfolio matter more than just theory. Try building a personal project!`;
    }
    if (q.includes('interview') || q.includes('hired')) {
        return `When I interview for ${careerTitle} roles, I look for candidates who can explain their thought process, not just give the 'right' answer. Communication is 50% of the job.`;
    }
    if (q.includes('mumbai') || q.includes('delhi') || q.includes('bangalore') || q.includes('india')) {
        return `In the Indian market, ${careerTitle} roles are booming. Major hubs like Bangalore and Mumbai have great networking meetups you should join.`;
    }
    if (q.includes('future') || q.includes('growth') || q.includes('next')) {
        return `The future for ${careerTitle} is very bright, especially with the current digital transformation. We're seeing more cross-domain roles where this expertise is vital.`;
    }
    if (q.includes('stress') || q.includes('hard') || q.includes('tough')) {
        return `It can be challenging, especially during release cycles or quarterly reviews. But having a good mentor and a supportive team makes a huge difference in ${careerTitle}.`;
    }
    if (q.includes('ai') || q.includes('automation') || q.includes('robot')) {
        return `AI is definitely changing how we work in ${careerTitle}, but it's more of a tool than a replacement. Learning to work alongside AI is a skill in itself!`;
    }
    return `That's an interesting point about ${careerTitle}. In my experience, the most successful people in this field are those who never stop being curious. Any other specifics?`;
}

// --- Phase 23: Parent Portal & Financial Flight Plan ---

let isParentMode = false;
let educationalSavings = 420000; // Simulated current savings
const savingsGoal = 1000000;

function toggleParentMode() {
    isParentMode = !isParentMode;
    const btn = document.getElementById('parent-mode-toggle');
    const label = btn.querySelector('span');

    if (isParentMode) {
        showSection('parent-portal');
        btn.style.background = 'var(--secondary)';
        btn.style.color = 'white';
        if (label) label.innerText = 'Student Mode';
        updateParentDashboardData();
        addNotif("Parent Mode Active", "A simplified guardian view is now active.");
    } else {
        showSection('home');
        btn.style.background = 'rgba(255,255,255,0.05)';
        btn.style.color = 'var(--secondary)';
        if (label) label.innerText = 'Parent';
        addNotif("Student Mode Restored", "Full access to roadmaps and tools enabled.");
    }
}

function updateParentDashboardData() {
    const score = calculateReadinessScore();
    const persona = calculateUserArchetype();
    const topSubject = Object.keys(user.marks).reduce((a, b) => user.marks[a] > user.marks[b] ? a : b);

    const readinessEl = document.getElementById('parent-readiness');
    const archetypeEl = document.getElementById('parent-archetype');
    const interestEl = document.getElementById('parent-interest');

    if (readinessEl) readinessEl.innerText = `${score}%`;
    if (archetypeEl) archetypeEl.innerText = persona.title;
    if (interestEl) interestEl.innerText = topSubject.toUpperCase();

    // Update Project Progress
    const progressFill = document.getElementById('parent-savings-progress');
    const savingsPercent = Math.round((educationalSavings / savingsGoal) * 100);
    if (progressFill) {
        progressFill.style.width = `${savingsPercent}%`;
        progressFill.innerText = `${savingsPercent}%`;
    }

    // Update Roadmap Authorization List
    const roadmapList = document.getElementById('parent-roadmap-list');
    if (roadmapList) {
        if (savedRoadmaps.length === 0) {
            roadmapList.innerHTML = '<p style="font-size: 0.75rem; color: var(--text-muted); text-align: center; padding: 20px;">No roadmaps pending parental review.</p>';
        } else {
            roadmapList.innerHTML = savedRoadmaps.map((r, index) => `
                <div class="glass-card" style="padding: 12px; display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03);">
                    <div>
                        <p style="font-size: 0.85rem; font-weight: 600;">${r.title}</p>
                        <p style="font-size: 0.7rem; color: var(--text-muted);">${r.milestones.filter(m => m.completed).length}/${r.milestones.length} Milestones</p>
                    </div>
                    ${r.authorized ?
                    '<span class="badge" style="background: var(--success); color: white; font-size: 0.6rem;">Authorized</span>' :
                    `<button class="btn btn-primary" style="font-size: 0.65rem; padding: 4px 8px;" onclick="authorizeRoadmap(${index})">Authorize</button>`
                }
                </div>
            `).join('');
        }
    }
}

function authorizeRoadmap(index) {
    if (savedRoadmaps[index]) {
        savedRoadmaps[index].authorized = true;
        localStorage.setItem('pathpilot_roadmaps', JSON.stringify(savedRoadmaps));
        updateParentDashboardData();
        addNotif("Roadmap Authorized", `You have approved the roadmap for ${savedRoadmaps[index].title}.`);
    }
}

function calculateEMI() {
    const P = parseFloat(document.getElementById('loan-amount').value);
    const R = (parseFloat(document.getElementById('loan-rate').value) / 12) / 100;
    const N = parseFloat(document.getElementById('loan-years').value) * 12;

    if (!P || P <= 0 || !parseFloat(document.getElementById('loan-rate').value) || !N) {
        addNotif("Calculation Error", "Please enter valid loan details.");
        return;
    }

    // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalRepayment = emi * N;

    const emiEl = document.getElementById('display-emi');
    const totalEl = document.getElementById('display-total-repayment');
    const resultsEl = document.getElementById('emi-results');

    if (emiEl) emiEl.innerText = `₹${Math.round(emi).toLocaleString()}`;
    if (totalEl) totalEl.innerText = `₹${Math.round(totalRepayment).toLocaleString()}`;
    if (resultsEl) {
        resultsEl.classList.remove('hidden');
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function addSavingsMilestone() {
    const contribution = prompt("Enter contribution amount (₹):", "50000");
    const amount = parseFloat(contribution);

    if (!amount || amount <= 0) {
        addNotif("Invalid Amount", "Please enter a valid savings contribution.");
        return;
    }

    educationalSavings += amount;
    if (educationalSavings > savingsGoal) educationalSavings = savingsGoal;

    updateParentDashboardData();
    // Update Resource tab data too
    const percentEl = document.getElementById('savings-percent');
    const progressEl = document.getElementById('savings-progress');

    if (percentEl) percentEl.innerText = `${Math.round((educationalSavings / savingsGoal) * 100)}%`;
    if (progressEl) progressEl.style.width = `${Math.round((educationalSavings / savingsGoal) * 100)}%`;

    addNotif("Savings Logged", `₹${amount.toLocaleString()} added to the Education Fund.`);
}

function generateGuardianReport() {
    const modal = document.getElementById('guardian-modal');
    const content = document.getElementById('guardian-report-content');
    if (!modal || !content) {
        // Fallback to direct download if modal missing
        downloadGuardianReport();
        return;
    }

    const score = calculateReadinessScore();
    const persona = calculateUserArchetype();
    const topSubject = Object.keys(user.marks).reduce((a, b) => user.marks[a] > user.marks[b] ? a : b);
    const savingsPercent = Math.round((educationalSavings / savingsGoal) * 100);

    modal.classList.add('active');
    content.innerHTML = `
        <div style="padding: 30px; background: white; color: #1e293b; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-top: 8px solid var(--accent);">
            <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px;">
                <img src="https://via.placeholder.com/60x60?text=PP" alt="PathPilot Logo" style="border-radius: 50%; border: 2px solid var(--accent); margin-bottom: 12px; width: 50px;">
                <h2 style="color: #0f172a; margin: 0; font-family: 'Outfit', sans-serif;">Guardian Progress Roadmap</h2>
                <p style="text-transform: uppercase; font-size: 0.7rem; letter-spacing: 2px; color: #64748b; font-weight: 700; margin-top: 4px;">Verified Assessment Snapshot</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                <div style="background: #f8fafc; padding: 12px; border-radius: 6px;">
                    <p style="font-size: 0.65rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Student Name</p>
                    <p style="font-weight: 800; color: #1e293b; font-size: 1.1rem;">${user.name}</p>
                </div>
                <div style="background: #f8fafc; padding: 12px; border-radius: 6px;">
                    <p style="font-size: 0.65rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Readiness Score</p>
                    <p style="font-weight: 800; color: var(--primary); font-size: 1.1rem;">${score}%</p>
                </div>
            </div>

            <div style="margin-bottom: 24px;">
                <h4 style="color: #334155; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 12px; border-left: 3px solid var(--secondary); padding-left: 10px;">Primary Career Focus</h4>
                <div style="background: #fdf2f8; border: 1px solid #fbcfe8; padding: 16px; border-radius: 8px;">
                    <p style="font-weight: 800; color: #ec4899; margin-bottom: 4px;">${persona.title}</p>
                    <p style="font-size: 0.8rem; color: #64748b; line-height: 1.4;">${persona.description || "Demonstrating high potential in analytical and logical reasoning fields."}</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                <div style="border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; text-align: center;">
                    <h5 style="font-size: 0.6rem; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Fund Progress</h5>
                    <p style="font-size: 1.2rem; font-weight: 800; color: #10b981;">₹${educationalSavings.toLocaleString()}</p>
                    <p style="font-size: 0.65rem; color: #94a3b8;">${savingsPercent}% of Goal</p>
                </div>
                <div style="border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; text-align: center;">
                    <h5 style="font-size: 0.6rem; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Milestones</h5>
                    <p style="font-size: 1.2rem; font-weight: 800; color: var(--primary);">${savedRoadmaps.length}</p>
                    <p style="font-size: 0.65rem; color: #94a3b8;">Active Paths</p>
                </div>
            </div>

            <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 0.8rem; line-height: 1.6; color: #475569;">
                <p><strong>PathPilot AI Advisor Insight:</strong> Based on current academic projections and a ${user.marks[topSubject]}% proficiency in ${topSubject}, we recommend supporting the student in ${persona.title === 'The Architect' ? 'system design' : 'creative output'} workshops this semester.</p>
            </div>

            <button class="btn btn-primary" onclick="downloadGuardianReport()" style="width: 100%; border-radius: 8px; padding: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; background: #0f172a; border: none;">Download Digital Official Copy (.txt)</button>
        </div>
    `;

    addNotif("Snapshot Ready", "A professional digest has been prepared for your review.");
}

function downloadGuardianReport() {
    const score = calculateReadinessScore();
    const persona = calculateUserArchetype();
    const topSubject = Object.keys(user.marks).reduce((a, b) => user.marks[a] > user.marks[b] ? a : b);

    let report = `Fly with PathPilot | OFFICIAL GUARDIAN REPORT\n`;
    report += `==========================================\n\n`;
    report += `Student Name: ${user.name}\n`;
    report += `Career Archetype: ${persona.title}\n`;
    report += `Readiness Score: ${score}%\n`;
    report += `Primary Strength: ${topSubject.toUpperCase()} (${user.marks[topSubject]}%)\n\n`;
    report += `Academic Progress Summary:\n`;
    report += `- Roadmaps Saved: ${savedRoadmaps.length}\n`;
    report += `- Milestones Completed: ${savedRoadmaps.reduce((acc, r) => acc + r.milestones.filter(m => m.completed).length, 0)}\n\n`;
    report += `Financial Summary:\n`;
    report += `- Education Savings Goal: ₹${savingsGoal.toLocaleString()}\n`;
    report += `- Current Fund Status: ₹${educationalSavings.toLocaleString()} (${Math.round((educationalSavings / savingsGoal) * 100)}%)\n\n`;
    report += `PathPilot AI Recommendation: The student is showing high aptitude in ${topSubject}. We recommend exploring professional certifications next month.\n\n`;
    report += `Generated on: ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PathPilot_Guardian_Report_${user.name.replace(/\s+/g, '_')}.txt`;
    a.click();

    addNotif("Report Downloaded", "The official Guardian Summary is ready.");
}

// Ensure Parent Dash updates on data changes
const originalUpdateProfileDisplay = updateProfileDisplay;
updateProfileDisplay = function () {
    originalUpdateProfileDisplay();
    if (isParentMode) updateParentDashboardData();
};



let activeStateFilter = 'All';

function toggleStateFilter(state) {
    activeStateFilter = state;
    
    // Update active class on pills
    document.querySelectorAll('.state-pill').forEach(btn => {
        if (state === 'All') {
            btn.classList.remove('active');
        } else {
            if (btn.innerText.trim() === state) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });

    filterColleges();
}

function filterColleges() {
    const cityInput = document.getElementById('city-filter').value.toLowerCase();
    const streamInput = document.getElementById('stream-filter').value;

    const filtered = colleges.filter(c => {
        const matchesCity = c.city.toLowerCase().includes(cityInput) || c.name.toLowerCase().includes(cityInput);
        const matchesStream = streamInput === 'all' || (c.streams && c.streams.includes(streamInput));
        const matchesState = activeStateFilter === 'All' || c.state === activeStateFilter;
        return matchesCity && matchesStream && matchesState;
    });

    renderColleges(filtered);
}

// --- Phase 26: Knowledge & Resource Hub Implementation ---

function renderSkillUpHub() {
    const list = document.getElementById('skillup-list');
    if (!list) return;

    // Add Generator Button
    let html = `
        <div class="glass-card animate" style="grid-column: 1/-1; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, var(--primary), var(--accent)); color: white;">
            <div>
                <h3 style="margin: 0; font-size: 1.1rem;">AI Course Generator</h3>
                <p style="font-size: 0.85rem; opacity: 0.9; margin: 4px 0 0;">Create a personalized curriculum based on your career goals.</p>
            </div>
            <button id="ai-course-btn" class="btn" style="background: white; color: var(--primary); font-weight: 600;" onclick="generateAICourse()">Generate Curriculum ✨</button>
        </div>
    `;

    html += skillUpResources.map(r => `
        <div class="glass-card animate" style="border-left: 4px solid var(--secondary);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h4 style="margin: 0; color: var(--secondary);">${r.title}</h4>
                <span class="badge" style="background: var(--surface);">${r.type}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 8px 0;">${r.provider} • ${r.duration}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                <span style="font-size: 0.9rem; font-weight: 700; color: ${r.cost === 'Free' ? 'var(--success)' : 'var(--text-main)'};">${r.cost}</span>
                <button class="btn" style="font-size: 0.8rem; background: var(--surface);" onclick="window.open('${r.link}', '_blank')">Start Learning</button>
            </div>
        </div>
    `).join('');

    list.innerHTML = html;
}



function renderExperiences() {
    const list = document.getElementById('experience-list');
    if (!list) return;
    list.innerHTML = experiences.map(x => `
        <div class="glass-card animate" style="border-left: 4px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h4 style="margin: 0; color: var(--primary);">${x.title}</h4>
                <span class="badge" style="background: var(--surface);">${x.type}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 8px 0;">${x.company} • ${x.role}</p>
            <button class="btn btn-primary" style="width: 100%; margin-top: 12px; font-size: 0.8rem;" onclick="startDayInLife('${x.simId || 'fullstack'}')">Start Simulation</button>
        </div>
    `).join('');
}

function generateAICourse() {
    const courseTitle = "Advanced AI Foundations for " + (user.primaryInterest || "Beginners");

    // Simulate generation delay
    const btn = document.getElementById('ai-course-btn');
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "Generating...";
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;

            // Add to skillup resources dynamically
            skillUpResources.unshift({
                title: courseTitle,
                provider: "PathPilot AI",
                type: "Personalized",
                duration: "Self-Paced",
                cost: "Free",
                link: "#",
                tags: ["AI", "Personalized"]
            });

            renderSkillUpHub();

            addNotif("Course Generated", `Created personalized curriculum: ${courseTitle}`);
        }, 2000);
    }
}

function renderDegrees() {
    const tbody = document.getElementById('comparison-body');
    if (!tbody) return;

    tbody.innerHTML = degrees.map(d => `
        <tr class="animate">
            <td style="font-weight: 600; color: var(--primary);">${d.name}</td>
            <td>${d.duration}</td>
            <td><span class="badge" style="background: var(--surface); color: var(--text-main);">${d.scope}</span></td>
            <td>${d.growth === 'High' || d.growth === 'Very High' ? `<span style="color: var(--success); font-weight: 600;">${d.growth} ↑</span>` : d.growth}</td>
            <td style="font-size: 0.85rem;">${d.careers}</td>
        </tr>
    `).join('');
}

// Initial Render for College Directory (and fixed init)
document.addEventListener('DOMContentLoaded', () => {
    renderColleges();
    renderDegrees();
    // Pre-render other tabs just in case, though they load on click
    renderScholarships();

    // Phase 33: Start Dynamic Ticker
    renderIndustryPulse();
    startPulseRotation();
});

function calculateSuccessScore() {
    const s = user.scores || { Logic: 50, Knowledge: 50, Social: 50, Creative: 50 };
    const base = ((user.xp || 0) / 1000) * 20;
    const skills = (s.Logic + s.Knowledge + s.Social + s.Creative) / 400 * 50;
    const missions = (user.completedMissions?.length || 0) * 5;
    user.successScore = Math.min(100, Math.round(base + skills + missions));
    localStorage.setItem('pathpilot_user', JSON.stringify(user));
}

function renderReadinessDashboard() {
    const radial = document.getElementById('readiness-radial');
    const label = document.getElementById('readiness-label');
    const feedback = document.getElementById('readiness-feedback');
    if (!radial || !label || !feedback) return;

    const score = user.successScore || 0;
    radial.innerHTML = `
        <svg viewBox="0 0 100 100" style="width: 120px; height: 120px;">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--glass-border)" stroke-width="8" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" stroke-width="8" 
                stroke-dasharray="${2 * Math.PI * 45}" 
                stroke-dashoffset="${2 * Math.PI * 45 * (1 - score / 100)}" 
                stroke-linecap="round" style="transition: stroke-dashoffset 1s ease-out;" />
            <text x="50" y="55" text-anchor="middle" font-size="20" font-weight="800" fill="var(--text-main)">${score}%</text>
        </svg>
    `;

    if (score > 80) {
        label.innerText = "Industry Ready";
        feedback.innerText = "Your profile is highly competitive. Focus on advanced networking.";
    } else if (score > 50) {
        label.innerText = "Developing";
        feedback.innerText = "Solid foundation. Keep completing missions to increase your score.";
    } else {
        label.innerText = "Starting Out";
        feedback.innerText = "Complete your assessment and first mission to jumpstart your career.";
    }
}

