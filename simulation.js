// --- Phase 24: Day in the Life Simulator ---
const { dayInLifeData } = DB;

let currentSim = {
    careerId: null,
    step: 0,
    energy: 100,
    stress: 0
};

function startDayInLife(careerId) {
    if (!dayInLifeData[careerId] && !dayInLifeData['fullstack']) {
        addNotif("Simulation Not Found", "This career doesn't have a simulation yet. Try Full Stack Developer!");
        return;
    }

    // Default to fullstack if specific one missing for demo
    const data = dayInLifeData[careerId] || dayInLifeData['fullstack'];

    currentSim = {
        careerId: careerId,
        data: data,
        step: 0,
        energy: 100,
        stress: 0
    };

    const modal = document.getElementById('simulation-modal');
    document.getElementById('sim-role-title').innerText = data.title;

    updateSimUI();
    renderSimStep();

    modal.classList.add('active');
}

function updateSimUI() {
    document.getElementById('sim-energy-val').innerText = `${currentSim.energy}%`;
    document.getElementById('sim-energy-bar').style.width = `${currentSim.energy}%`;

    document.getElementById('sim-stress-val').innerText = `${currentSim.stress}%`;
    document.getElementById('sim-stress-bar').style.width = `${currentSim.stress}%`;

    // Visual coloring
    const stressBar = document.getElementById('sim-stress-bar');
    if (currentSim.stress > 70) stressBar.style.backgroundColor = '#f43f5e'; // Red
    else if (currentSim.stress > 40) stressBar.style.backgroundColor = '#fbbf24'; // Yellow
    else stressBar.style.backgroundColor = '#10b981'; // Green
}

function renderSimStep() {
    const event = currentSim.data.events[currentSim.step];

    if (!event) {
        endSimulation();
        return;
    }

    document.getElementById('sim-clock').innerText = event.time;
    document.getElementById('sim-scenario-text').innerText = event.situation;

    const optionsContainer = document.getElementById('sim-options');
    optionsContainer.innerHTML = '';

    event.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.cssText = "display: flex; justify-content: space-between; text-align: left; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); transition: all 0.2s;";
        btn.innerHTML = `<span>${choice.text}</span> <span style="font-size: 0.8rem; opacity: 0.5;">Select →</span>`;
        btn.onmouseover = () => btn.style.background = 'var(--surface-hover)';
        btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.05)';
        btn.onclick = () => makeSimChoice(index);
        optionsContainer.appendChild(btn);
    });
}

function makeSimChoice(index) {
    const event = currentSim.data.events[currentSim.step];
    const choice = event.choices[index];

    // Apply effects
    currentSim.energy = Math.max(0, Math.min(100, currentSim.energy + choice.effect.energy));
    currentSim.stress = Math.max(0, Math.min(100, currentSim.stress + choice.effect.stress));

    updateSimUI();

    // Show Feedback Toast
    addNotif("Outcome", choice.effect.msg);

    // Animate transition
    const content = document.getElementById('sim-content');
    content.style.opacity = '0';

    setTimeout(() => {
        currentSim.step++;
        renderSimStep();
        content.style.opacity = '1';
    }, 800);
}

function endSimulation() {
    const container = document.getElementById('sim-content');
    const score = currentSim.energy - currentSim.stress;
    let grade = 'B';
    let summary = "Good job! You balanced work and health well.";

    if (score > 60) { grade = 'A'; summary = "Amazing! You're a natural productivity master."; }
    else if (score < 0) { grade = 'D'; summary = "Burnout Warning! You prioritized work over sanity."; }

    container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 4rem; font-weight: 800; color: var(--primary); margin-bottom: 10px;">${grade}</div>
            <h2 style="margin-bottom: 12px;">Day Complete!</h2>
            <p style="color: var(--text-muted); margin-bottom: 24px;">${summary}</p>
            
            <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 30px;">
                <div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Final Energy</div>
                    <div style="font-size: 1.2rem; font-weight: 700; color: var(--success);">${currentSim.energy}%</div>
                </div>
                <div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Final Stress</div>
                    <div style="font-size: 1.2rem; font-weight: 700; color: var(--accent);">${currentSim.stress}%</div>
                </div>
            </div>

            <button class="btn btn-primary" onclick="closeModal('simulation-modal')">Finish & Collect XP</button>
        </div>
    `;

    // Award XP
    user.xp = (user.xp || 0) + 50;
    updateProfileDisplay();
    addNotif("Challenge Complete", "You earned 50 XP!");
}
