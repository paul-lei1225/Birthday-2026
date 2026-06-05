const surpriseButton = document.getElementById("surpriseBtn");
const surpriseMessage = document.getElementById("surpriseMessage");
const surpriseContent = document.getElementById("surpriseContent");
const envelope = document.getElementById("envelope");
const letterTextContent = document.getElementById("letterTextContent");
const canvas = document.getElementById("confetti");
const context = canvas.getContext("2d");

// Keypad and unlock system
const keypadModal = document.getElementById("keypadModal");
const keypadTitle = document.getElementById("keypadTitle");
const keypadMessage = document.getElementById("keypadMessage");
const codeDisplay = document.getElementById("codeDisplay");

let currentCode = "";
let currentUnlockSection = null;

// Codes for each section
const codes = {
  fortune: { code: "8888" }, // June 6
  soundtrack: { code: "263732" }, // June 7
  photos: { code: "0802" }, // June 8
  letter: { code: "1223" }, // June 9
  gift: { code: "0710" } // June 10
};

// Stardew Valley-inspired fortunes
const fortunes = [
  "Like a golden sunflower, your love brings warmth to every season of my life. This year will bloom beautifully.",
  "The spirits say you're about to harvest something magical. A year of growth, joy, and moments that take your breath away awaits.",
  "Even in the darkest winter, you're my spring. This year will be filled with coziness, laughter, and endless cuddles.",
  "The stars have spoken: you deserve all the happiness in this world. Get ready for a year of beautiful surprises.",
  "Like the most perfect crops in the valley, this year will be abundant with love, adventure, and sweet memories together.",
  "The crystal ball shows endless possibilities. You'll create magic wherever you go, and I'll be there cheering you on.",
  "A new season awaits, and it's going to be even better than the last. Your smile is my favorite discovery.",
  "The spirits whisper that this year holds something special—more laughter, more love, and more reasons to be grateful.",
  "Like a perfect day at the beach, this year will be warm, peaceful, and filled with the best moments by your side.",
  "The fortune teller sees a year full of little joys. Dancing in the kitchen, late night talks, and a love that grows stronger every day. ✨"
];

const confettiPieces = [];
const colors = ["#ff1744", "#ffd166", "#7dd3fc", "#c3f0ca", "#f6a6ff"];
let animationFrameId;

// Initialize - check unlocked status on load
window.addEventListener("load", () => {
  checkAndRestoreUnlocks();
  resizeCanvas();
});

const checkAndRestoreUnlocks = () => {
  Object.keys(codes).forEach(section => {
    const isUnlocked = localStorage.getItem(`unlocked-${section}`) === "true";
    if (isUnlocked) {
      unlockSection(section);
    }
  });
};

const openKeypad = (section) => {
  currentUnlockSection = section;
  currentCode = "";
  updateCodeDisplay();
  
  keypadTitle.textContent = "Enter Code";
  keypadMessage.textContent = "";
  
  keypadModal.classList.remove("hidden");
};

const closeKeypad = () => {
  keypadModal.classList.add("hidden");
  currentCode = "";
  currentUnlockSection = null;
};

const addDigit = (digit) => {
  if (currentCode.length < 6) {
    currentCode += digit;
    updateCodeDisplay();
  }
};

const backspace = () => {
  currentCode = currentCode.slice(0, -1);
  updateCodeDisplay();
};

const updateCodeDisplay = () => {
  if (currentCode.length === 0) {
    codeDisplay.textContent = "______";
  } else {
    codeDisplay.textContent = currentCode + "_".repeat(6 - currentCode.length);
  }
};

const submitCode = () => {
  if (currentCode === codes[currentUnlockSection].code) {
    keypadMessage.textContent = "✓ Correct!";
    keypadMessage.style.color = "#4CAF50";
    localStorage.setItem(`unlocked-${currentUnlockSection}`, "true");
    
    setTimeout(() => {
      unlockSection(currentUnlockSection);
      closeKeypad();
      launchConfetti();
    }, 800);
  } else {
    keypadMessage.textContent = "❌ Wrong code. Try again!";
    keypadMessage.style.color = "#ff6b6b";
    currentCode = "";
    updateCodeDisplay();
    setTimeout(() => {
      keypadMessage.style.color = "#666";
    }, 2000);
  }
};

const unlockSection = (section) => {
  const lockedEl = document.getElementById(`${section}Locked`);
  const contentEl = document.getElementById(`${section}Content`);
  
  if (lockedEl) lockedEl.classList.add("hidden");
  if (contentEl) contentEl.classList.remove("hidden");
};

// Confetti animation
const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const createConfetti = (amount = 140) => {
  confettiPieces.length = 0;
  for (let i = 0; i < amount; i += 1) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: 6 + Math.random() * 6,
      velocity: 2 + Math.random() * 3,
      tilt: Math.random() * 10,
      color: colors[i % colors.length],
      rotation: Math.random() * Math.PI,
    });
  }
};

const updateConfetti = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach((piece) => {
    piece.y += piece.velocity;
    piece.rotation += 0.02;
    piece.x += Math.sin(piece.rotation) * 0.5;

    context.save();
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    context.fillStyle = piece.color;
    context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
    context.restore();
  });

  if (confettiPieces.some((piece) => piece.y < canvas.height + 20)) {
    animationFrameId = requestAnimationFrame(updateConfetti);
  } else {
    cancelAnimationFrame(animationFrameId);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
};

const launchConfetti = () => {
  resizeCanvas();
  createConfetti();
  cancelAnimationFrame(animationFrameId);
  updateConfetti();
};

const revealFortune = () => {
  const fortuneDisplay = document.getElementById("fortuneDisplay");
  const fortuneText = document.getElementById("fortuneText");
  
  // Pick a random fortune
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  fortuneText.textContent = randomFortune;
  
  // Hide and show to trigger animation
  fortuneDisplay.classList.add("hidden");
  setTimeout(() => {
    fortuneDisplay.classList.remove("hidden");
  }, 10);
  
  // Launch confetti
  launchConfetti();
};

// Surprise button
surpriseButton.addEventListener("click", () => {
  surpriseMessage.classList.toggle("hidden");
  surpriseContent.classList.toggle("hidden");
  launchConfetti();
});

// Envelope click
envelope.addEventListener("click", () => {
  letterTextContent.classList.remove("hidden");
  launchConfetti();
});

// Window events
window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", (e) => {
  if (keypadModal.classList.contains("hidden")) return;
  
  if (e.key >= "0" && e.key <= "9") {
    addDigit(e.key);
  } else if (e.key === "Backspace") {
    backspace();
  } else if (e.key === "Enter") {
    submitCode();
  } else if (e.key === "Escape") {
    closeKeypad();
  }
});
