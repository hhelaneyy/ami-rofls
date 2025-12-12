"use strict";

// ===== СПИСОК ВИДЕО =====
const STREAM_IDS = [
  "3GQVQu92FbU",
  "KKRgNAZQJEA",
  "hzw7k0nJyv4",
  "MIb4ZtAAH-U",
  "23123"
];

const FUNFACTS = [
  "im very eepy today pls forgib me",
  "mepphy is evil",
  "LA LA LA LAVA CHI CHI CHI CHICKEN",
  "my favourite horse is a white horse cuz in german they're called Schimmel wich means mold",
  "I'VE BEEN WAITING A WHOLE YEAR FOR THIS",
  "I GOT SICK I SORRY I SORRY I SORRY I SORRY",
  "this is the last time you're seeing this model",
  "IM SCARED IM SCARED IM SCARED IM SCARED IM SCARED",
  "happy ptide month i like women",
  "I HAVENT SUNG IN WEEKS",
  "guess whos back back again ami's back tell a friend",
  "the amis yearn for the mines",
  "i stream on wifi again",
  "uhm uhm uhm uh uh uhm uh hm",
  "the female lombax (lorax) is BACK BABYYY",
  "luigi.",
  "ive never speedran anything ever before in my life but this game is cute and fun :3",
  "bowserrr BOWSEHEHRFRR WHEN I GET YUO FOR TAKINGNMY WIFEEE!!!!",
  "im very sleepy i cant think of a funny joke",
  "i ate something bad before stream i am goign to explode into 20 bajillion pieces",
  "i got a letter by google into the mail they told me i can hav moneyyyyyyy",
  "kaden has no idea he needs to carry me",
  "the ami in gaming stands for ami",
  "my bank account hates to see vivienne medrano's gay little animation shows coming",
  "ITSA ME, MAERYO",
  "i have a bingo addiction",
  "#1 super mario player in the world world record holder of every record in the world. record for most super mario world records. no clickbait",
  "nintendo is scared of me",
  "im bad gamer and very eepy",
  "IM YOUTUBE PARTNER WHICH MEANS I NEED TO LOCK IN FRFR",
  "i am very sick. i have covid",
  "if my cat interrupts the stream you are legally obligated to tip me so i can spoil her (for legal reasons this is a joke)",
  "i miss stolas please bring him back to me",
  "im not in any condition to go live right now but im doing it anyways!!!!! LOL!!!!!",
  "blitzo and i are equally mentally stable!",
  "crazy? i was crazy once",
  "I DONT KNOW HOW TO PLAY THIS LMFAOOOOOOOOOO grab popcorn",
  "GOOD MORNING AMERICA!!!!",
  "if verosika forgives blitzo i will eat a rock",
  "if ur reading this send me money",
  "please stand by"
];

const SECRET_FACT = "<span style='color:#ff4081; cursor:pointer;' onclick='window.location.href=\"crying.html\"'>stream ends when i clear world is mine on normal or i break down crying (CLICK ME)</span>";

// ===== Storage =====
function getAppData() {
  try {
    return JSON.parse(localStorage.getItem("ami_app_data")) || {
      collectedFacts: [],
      achievements: {},
      secretFactShown: false,
      secretFactHandled: false
    };
  } catch {
    return { collectedFacts: [], achievements: {}, secretFactShown: false, secretFactHandled: false };
  }
}

function setAppData(data) { try { localStorage.setItem("ami_app_data", JSON.stringify(data)); } catch {} }
function getCollectedFacts() { return getAppData().collectedFacts; }
function setCollectedFacts(facts) { const data = getAppData(); data.collectedFacts = facts; setAppData(data); }
function getAchievements() { return getAppData().achievements; }
function setAchievements(achievements) { const data = getAppData(); data.achievements = achievements; setAppData(data); }
function getSecretFactStatus() { return getAppData().secretFactShown; }
function setSecretFactShown() { const data = getAppData(); data.secretFactShown = true; setAppData(data); }
function getSecretHandledStatus() { return getAppData().secretFactHandled; }
function setSecretHandled() { const data = getAppData(); data.secretFactHandled = true; setAppData(data); }

// ===== UI =====
function showToast(title, subtitle) {
  const toast = document.getElementById("achievementToast");
  if (!toast) return;
  const titleEl = document.getElementById("toastTitle");
  const subEl = document.getElementById("toastSubtitle");
  if(titleEl) titleEl.textContent = title;
  if(subEl) subEl.textContent = subtitle;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}

function updateFactCounter() {
  const counters = document.querySelectorAll('[id="factProgress"]');
  const collected = getCollectedFacts().length;
  const total = FUNFACTS.length;
  counters.forEach(c => c.textContent = `${collected} / ${total} collected`);
  if (collected === total && total > 0 && !getAchievements().trulyFan) {
      unlockAchievement("trulyFan", "Truly Fan Badge");
  }
}

// ===== Achievements =====
function unlockAchievement(id, prize) {
  const achievements = getAchievements();
  if (achievements[id] && achievements[id].unlocked) return;
  achievements[id] = { unlocked: true, unlockedAt: new Date().toISOString(), prize };
  setAchievements(achievements);
  if (id === "marathonAmi") localStorage.setItem("marathonAmiUnlocked", "true");
  
  const card = document.getElementById("ach_" + id);
  if (card) {
    card.classList.remove("locked");
    card.classList.add("unlocked");
    const emojiEl = document.getElementById("ach_" + id + "_emoji");
    if (emojiEl) emojiEl.textContent = "🏆";
  }
  showToast("Achievement Unlocked!", prize);
}

function checkAchievementStatus(id) {
  const achievements = getAchievements();
  return achievements[id] && achievements[id].unlocked;
}

function checkMarathonAchievement() { return localStorage.getItem("marathonAmiUnlocked") === "true"; }

// ===== Funfacts Logic =====
function handleFactButton() {
  const factTextEl = document.getElementById("factText");
  const factBtn = document.getElementById("factBtn");
  let collected = getCollectedFacts();

  if (getSecretFactStatus() && !getSecretHandledStatus()) {
    factBtn.textContent = "YOU CANT LOOK AWAY.";
    factBtn.classList.add("danger");
    factBtn.disabled = true;
    setSecretHandled();
    return;
  }

  if (!getSecretFactStatus() && Math.random() < 0.01) {
    factTextEl.innerHTML = SECRET_FACT;
    setSecretFactShown();
    return;
  }

  if (Math.random() < 0.3) {
    const available = FUNFACTS.filter(f => !collected.includes(f));
    if (available.length > 0) {
      const newFact = available[Math.floor(Math.random() * available.length)];
      factTextEl.textContent = newFact;
      collected.push(newFact);
      setCollectedFacts(collected);
      updateFactCounter();
      return;
    }
  }

  if (collected.length > 0) {
    factTextEl.textContent = collected[Math.floor(Math.random() * collected.length)];
    return;
  }

  const firstFact = FUNFACTS[Math.floor(Math.random() * FUNFACTS.length)];
  factTextEl.textContent = firstFact;
  collected.push(firstFact);
  setCollectedFacts(collected);
  updateFactCounter();
}

// ===== Marathon Timer =====
function startMarathonTimer() {
  const progressBar = document.querySelector(".timer-bar");
  const timerText = document.querySelector(".timer-text");
  if (!progressBar || !timerText) return;

  const duration = 300000; 
  let saved = JSON.parse(localStorage.getItem("marathonTimer")) || {};
  let elapsed = saved.elapsed || 0;
  
  if (checkMarathonAchievement()) {
      progressBar.style.width = "100%";
      timerText.textContent = "Marathon Completed! You are crazy.";
      return;
  }

  let startTime = Date.now();
  const interval = setInterval(() => {
    let currentSessionElapsed = Date.now() - startTime;
    let totalElapsed = currentSessionElapsed + elapsed;
    const percentage = Math.min(100, (totalElapsed / duration) * 100);
    progressBar.style.width = percentage + "%";
    const seconds = Math.floor(Math.min(duration, totalElapsed) / 1000);
    timerText.textContent = `Time: ${seconds}s / 300s`;

    localStorage.setItem("marathonTimer", JSON.stringify({ elapsed: totalElapsed }));
    startTime = Date.now();
    elapsed = totalElapsed;

    if (totalElapsed >= duration) {
      clearInterval(interval);
      if (!checkMarathonAchievement()) unlockAchievement("marathonAmi", "Marathon with Ami");
      timerText.textContent = "Achievement unlocked!";
      localStorage.removeItem("marathonTimer");
      renderAchievements(); 
    }
  }, 1000);
}

// ===== Achievements Page Render =====
function renderAchievements() {
  const marathonTimer = JSON.parse(localStorage.getItem("marathonTimer")) || { elapsed: 0 };
  
  // Добавил "voxtek" в список
  const ids = ["trulyFan", "marathonAmi", "secretCry", "voxtek"];
  
  ids.forEach(id => {
    const card = document.getElementById("ach_" + id);
    if (!card) return;

    const unlocked = checkAchievementStatus(id) || (id === "marathonAmi" && checkMarathonAchievement());
    const emojiEl = document.getElementById("ach_" + id + "_emoji");

    if (unlocked) {
      card.classList.remove("locked");
      card.classList.add("unlocked");
      if (emojiEl) emojiEl.textContent = "🏆";
    } else {
      card.classList.remove("unlocked");
      card.classList.add("locked");
      if (emojiEl) emojiEl.textContent = "🔒";
    }

    if (id === "marathonAmi") {
       const counterEl = card.querySelector('.achievement-counter');
       if (counterEl) {
         const seconds = Math.floor(marathonTimer.elapsed / 1000);
         counterEl.textContent = unlocked ? "Completed!" : `${seconds} / 300 seconds`;
       }
    }
  });
}

// ===== SECRET LINK SPAWNER =====
function trySpawnSecretNav() {
    if (window.location.pathname.includes("player.html")) return;

    // Шанс 1% (0.01)
    const CHANCE = 0.01; 

    if (Math.random() < CHANCE) {
        const nav = document.querySelector('.nav');
        if (nav) {
            console.log("Secret revealed!");
            const link = document.createElement('a');
            link.href = '/player';
            link.className = 'nav-link secret-link';
            link.textContent = '👁️ ???'; 
            nav.appendChild(link);
        }
    }
}

// ===== PLAYER PAGE SETUP (With Secret Error ID) =====
function setupPlayerPage() {
    const container = document.getElementById("player-container");
    if (!container) return;

    container.innerHTML = ""; 

    const randomVideoId = STREAM_IDS[Math.floor(Math.random() * STREAM_IDS.length)];
    
    // Создаем обертку
    const wrapper = document.createElement("div");
    wrapper.className = "video-wrapper";

    // --- ПРОВЕРКА НА СЕКРЕТНЫЙ ID "23123" ---
    if (randomVideoId === "23123") {
        const errorScreen = document.createElement("div");
        errorScreen.className = "player-error";
        
        errorScreen.innerHTML = `
            <h3>Oops, something went wrong...</h3>
            <p>HER FACE WAS MADE FOR RADIO.</p>
        `;
        
        wrapper.appendChild(errorScreen);
        container.appendChild(wrapper);
        return; 
    }

    // --- ОБЫЧНАЯ ЛОГИКА ---
    const imgTester = new Image();
    imgTester.src = `https://img.youtube.com/vi/${randomVideoId}/maxresdefault.jpg`;

    imgTester.onload = function() {
        const iframe = document.createElement("iframe");
        const origin = window.location.origin;

        iframe.src = `https://www.youtube.com/embed/${randomVideoId}?autoplay=1&mute=0.5&controls=1&playsinline=1&origin=${origin}`;
        iframe.title = "Ami Stream";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        
        wrapper.appendChild(iframe);
        container.appendChild(wrapper);
    };

    imgTester.onerror = function() {
        // Если видео недоступно — тоже показываем ошибку
        const errorScreen = document.createElement("div");
        errorScreen.className = "player-error";
        
        errorScreen.innerHTML = `
            <h3>Oops, something went wrong...</h3>
            <p>HER FACE WAS MADE FOR RADIO.</p>
        `;
        
        wrapper.appendChild(errorScreen);
        container.appendChild(wrapper);
    };
}

// ===== LOGO MODAL LOGIC =====
function setupLogoModal() {
    const logo = document.getElementById('mainLogo');
    const modal = document.getElementById('logoModal');
    
    if (!logo || !modal) return; 

    const closeBtn = modal.querySelector('.close-btn');

    logo.addEventListener('click', () => { modal.style.display = 'flex'; });
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.style.display = 'none'; });
}


// ===== Reset =====
function resetAll() {
  localStorage.removeItem("ami_app_data");
  localStorage.removeItem("marathonAmiUnlocked");
  localStorage.removeItem("marathonTimer");
  renderAchievements();
  updateFactCounter();
  const factText = document.getElementById("factText");
  if (factText) factText.textContent = "Click the button to reveal a funfact! ✨";
  const factBtn = document.getElementById("factBtn");
  if(factBtn) {
      factBtn.disabled = false;
      factBtn.textContent = "Touch the Angel of Death!!";
      factBtn.classList.remove("danger");
  }
  showToast("Reset Complete", "Clean slate!");
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  trySpawnSecretNav();

  if (window.location.pathname.includes("player.html")) {
      setupPlayerPage();
      
      // Я убрал блок try/catch с history.replaceState, 
      // чтобы ссылка оставалась .../player.html
      
      // !!! ВЫДАЧА ДОСТИЖЕНИЯ !!!
      unlockAchievement("voxtek", "Voxtek Employee"); 
  }

  updateFactCounter();
  renderAchievements();

  if (window.location.pathname.includes("crying.html")) {
    unlockAchievement("secretCry", "WHAT THE F#CK IS THAT??");
  }

  const factBtn = document.getElementById("factBtn");
  if (factBtn) {
    const factText = document.getElementById("factText");
    const collected = getCollectedFacts();
    if (collected.length > 0) factText.textContent = collected[collected.length - 1];
    factBtn.addEventListener("click", handleFactButton);
  }

  const resetBtn = document.getElementById("resetAchievements");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const confirmModal = document.getElementById("confirmModal");
      if (confirmModal) {
        confirmModal.classList.add("show");
        const yes = document.getElementById("confirmYes");
        const no = document.getElementById("confirmNo");
        if (yes) yes.onclick = () => { resetAll(); confirmModal.classList.remove("show"); };
        if (no) no.onclick = () => confirmModal.classList.remove("show");
      } else {
        if (confirm("Reset everything?")) resetAll();
      }
    });
  }

  startMarathonTimer();
  setupLogoModal(); 
});