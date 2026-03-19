// User State
let userState = {
  level: 1,
  xp: 350,
  xpTarget: 500,
  coins: 150,
  streak: 3,
  completedQuests: ["q1"],
  unlockedModules: ["m1", "m2"]
};

// Data
const dailyQuests = [
  { id: "q1", title: "First Steps", desc: "Log in to the platform today.", xp: 50, coins: 10 },
  { id: "q2", title: "Knowledge Seeker", desc: "Complete 1 learning module.", xp: 150, coins: 25 },
  { id: "q3", title: "Perfect Score", desc: "Pass a challenge flawlessly.", xp: 200, coins: 50 }
];

const badges = [
  { icon: "🌟", title: "Rising Star", desc: "Reach Level 2" },
  { icon: "🔥", title: "On Fire", desc: "3 Day Streak" },
  { icon: "🧠", title: "Big Brain", desc: "Ace 5 quizzes" }
];

const modules = [
  { id: "m1", title: "Introduction to Algorithms", icon: "🔢", desc: "Learn the basics of sorting and searching.", progress: 100, locked: false },
  { id: "m2", title: "Data Structures", icon: "🏗️", desc: "Stacks, Queues, Trees and more.", progress: 45, locked: false },
  { id: "m3", title: "Advanced Graph Theory", icon: "🕸️", desc: "Dijkstra, A*, and shortest paths.", progress: 0, locked: true },
  { id: "m4", title: "Dynamic Programming", icon: "🧩", desc: "Master the art of memoization.", progress: 0, locked: true }
];

const leaderboard = [
  { name: "Felix Scholar", rank: 1, level: 12, xp: 9540, avatar: "Felix" },
  { name: "Ada Lovelace", rank: 2, level: 11, xp: 8200, avatar: "Aneka" },
  { name: "Alan Turing", rank: 3, level: 11, xp: 8050, avatar: "Oliver" },
  { name: "Grace Hopper", rank: 4, level: 9, xp: 6200, avatar: "Mia" },
  { name: "You", rank: 5, level: userState.level, xp: userState.xp, avatar: "Felix" }
];

// DOM Elements
const xpBar = document.getElementById("xp-bar");
const xpCurrentEl = document.getElementById("user-xp");
const xpTargetEl = document.getElementById("xp-target");
const levelEl = document.getElementById("user-level");
const coinsEl = document.getElementById("user-coins");
const streakEl = document.getElementById("user-streak");

// Navigation Logic
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    // Remove active from all
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    
    // Add active to clicked
    const currentBtn = e.currentTarget;
    currentBtn.classList.add("active");
    const targetId = currentBtn.getAttribute("data-target");
    document.getElementById(targetId).classList.add("active");
  });
});

// Init UI
function initUI() {
  updateStats();
  renderQuests();
  renderBadges();
  renderModules();
  renderLeaderboard();
  
  // Animate XP bar on load
  setTimeout(() => {
    xpBar.style.width = `${(userState.xp / userState.xpTarget) * 100}%`;
  }, 300);
}

// Update Topbar Stats
function updateStats() {
  xpCurrentEl.innerText = userState.xp;
  xpTargetEl.innerText = userState.xpTarget;
  levelEl.innerText = userState.level;
  coinsEl.innerText = userState.coins;
  streakEl.innerText = userState.streak;
  
  const percentage = (userState.xp / userState.xpTarget) * 100;
  xpBar.style.width = `${percentage}%`;
}

// Render Quests
function renderQuests() {
  const container = document.getElementById("quest-list");
  container.innerHTML = "";
  
  dailyQuests.forEach(quest => {
    const isCompleted = userState.completedQuests.includes(quest.id);
    const li = document.createElement("li");
    li.className = `quest-item ${isCompleted ? 'completed' : ''}`;
    
    let btnHtml = isCompleted 
      ? `<button class="btn btn-outline" disabled>Done</button>`
      : `<button class="btn btn-primary" onclick="completeQuest('${quest.id}')">Start</button>`;
      
    li.innerHTML = `
      <div class="quest-info">
        <h4>${quest.title}</h4>
        <p>${quest.desc}</p>
        <div class="quest-reward">+${quest.xp} XP | +${quest.coins} 🪙</div>
      </div>
      <div class="quest-action">
        ${btnHtml}
      </div>
    `;
    container.appendChild(li);
  });
}

// Badges
function renderBadges() {
  const container = document.getElementById("badge-grid");
  badges.forEach(b => {
    const d = document.createElement("div");
    d.className = "badge-icon";
    d.title = `${b.title}: ${b.desc}`;
    d.innerText = b.icon;
    container.appendChild(d);
  });
}

// Modules
function renderModules() {
  const container = document.getElementById("modules-grid");
  container.innerHTML = "";
  
  modules.forEach(m => {
    const div = document.createElement("div");
    div.className = `glass-card module-card ${m.locked ? 'locked' : ''}`;
    
    div.innerHTML = `
      <div class="module-icon">${m.icon}</div>
      <h3>${m.title}</h3>
      <p>${m.desc}</p>
      ${!m.locked ? `
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${m.progress}%"></div>
      </div>
      <button class="btn btn-primary w-100" onclick="openChallenge('${m.id}')" style="width:100%">Continue Learning</button>
      ` : `<button class="btn btn-outline w-100" disabled style="width:100%">Locked</button>`}
    `;
    container.appendChild(div);
  });
}

// Leaderboard
function renderLeaderboard() {
  const tbody = document.querySelector("#leaderboard-table tbody");
  tbody.innerHTML = "";
  
  leaderboard.forEach(user => {
    const tr = document.createElement("tr");
    
    let rankBadge = user.rank;
    if (user.rank <= 3) {
      rankBadge = `<span class="rank-badge rank-${user.rank}">${user.rank}</span>`;
    }
    
    tr.innerHTML = `
      <td>${rankBadge}</td>
      <td>
        <div class="user-row">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}" class="avatar-small">
          <span>${user.name}</span>
        </div>
      </td>
      <td>Lvl ${user.level}</td>
      <td>${user.xp.toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Gamification Logic
window.completeQuest = function(id) {
  const quest = dailyQuests.find(q => q.id === id);
  if(!quest || userState.completedQuests.includes(id)) return;
  
  userState.completedQuests.push(id);
  addReward(quest.xp, quest.coins, `Quest Completed: ${quest.title}`);
  renderQuests();
}

function addReward(xp, coins, reason) {
  userState.coins += coins;
  userState.xp += xp;
  
  showToast(`+${xp} XP | +${coins} 🪙 - ${reason}`);
  
  // Check Level up
  if (userState.xp >= userState.xpTarget) {
    levelUp();
  } else {
    updateStats();
  }
}

function levelUp() {
  userState.level++;
  userState.xp = userState.xp - userState.xpTarget;
  userState.xpTarget = Math.floor(userState.xpTarget * 1.5); // Increase requirement
  
  updateStats();
  
  // Trigger Confetti
  if (window.confetti) {
    const end = Date.now() + (2 * 1000);
    const colors = ['#6366f1', '#ec4899', '#f59e0b'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
  
  showToast(`🎉 LEVEL UP! You are now Level ${userState.level}!`, true);
}

// Toast Notifications
function showToast(message, isImportant = false) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  if (isImportant) {
    toast.style.borderLeftColor = "var(--secondary)";
    toast.innerHTML = `<span class="icon">🏆</span> <span>${message}</span>`;
  } else {
    toast.innerHTML = `<span class="icon">✨</span> <span>${message}</span>`;
  }
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Mock Challenge Modal Implementation
const modalOverlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");
const modalTitle = document.getElementById("modal-title");
let selectedOption = null;
let currentChallengeId = null;

window.openChallenge = function(moduleId) {
  currentChallengeId = moduleId;
  modalTitle.innerText = "Module Challenge";
  
  modalBody.innerHTML = `
    <p>What is the time complexity of retrieving an element from an array by index?</p>
    <div class="options-grid" id="challenge-options">
      <div class="option-btn" data-correct="false">O(n)</div>
      <div class="option-btn" data-correct="false">O(log n)</div>
      <div class="option-btn" data-correct="true">O(1)</div>
      <div class="option-btn" data-correct="false">O(n^2)</div>
    </div>
  `;
  
  const options = document.querySelectorAll(".option-btn");
  options.forEach(opt => {
    opt.addEventListener("click", (e) => {
      options.forEach(o => o.classList.remove("selected"));
      e.target.classList.add("selected");
      selectedOption = e.target;
    });
  });
  
  modalOverlay.classList.add("show");
}

document.getElementById("close-modal").addEventListener("click", () => {
  modalOverlay.classList.remove("show");
  selectedOption = null;
});

document.getElementById("submit-challenge").addEventListener("click", () => {
  if (!selectedOption) return;
  
  const isCorrect = selectedOption.getAttribute("data-correct") === "true";
  
  if (isCorrect) {
    selectedOption.classList.add("correct");
    setTimeout(() => {
      modalOverlay.classList.remove("show");
      addReward(150, 50, "Challenge Passed!");
    }, 1000);
  } else {
    selectedOption.classList.add("wrong");
    selectedOption.classList.remove("selected");
    // Shake animation
    selectedOption.style.transform = "translateX(-10px)";
    setTimeout(() => selectedOption.style.transform = "translateX(10px)", 100);
    setTimeout(() => selectedOption.style.transform = "translateX(0)", 200);
    showToast("Incorrect answer. Try again!", false);
  }
});

// Start
initUI();
