/**
 * ============================================================================
 * HAPPY BIRTHDAY INTERACTIVE EXPERIENCE
 * Interactive Canvas Confetti, Web Audio Synth, 3D Animations & Personalization
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const introScreen = document.getElementById('intro-screen');
  const mainApp = document.getElementById('main-app');
  const giftBox = document.getElementById('gift-box');
  
  // Header controls
  const btnMusic = document.getElementById('btn-music');
  const musicIcon = document.getElementById('music-icon');
  const musicStatus = document.getElementById('music-status');
  const btnConfetti = document.getElementById('btn-confetti');
  const btnPersonalize = document.getElementById('btn-personalize');
  const btnShare = document.getElementById('btn-share');

  // Display elements
  const displayName = document.getElementById('display-name');
  const displayMessage = document.getElementById('display-message');
  const letterName = document.querySelector('.letter-name');
  const letterBody = document.getElementById('letter-body');
  const letterSignature = document.getElementById('letter-signature');
  const poppedCounter = document.getElementById('popped-counter');

  // Cake elements
  const candle = document.getElementById('candle');
  const flame = document.getElementById('flame');
  const smoke = document.getElementById('smoke');
  const wishStatus = document.getElementById('wish-status');
  const btnRelight = document.getElementById('btn-relight');

  // Greeting Card & Photo
  const flipperCard = document.getElementById('flipper-card');
  const photoInput = document.getElementById('photo-input');
  const celebrationPhoto = document.getElementById('celebration-photo');

  // Fortune
  const btnNewFortune = document.getElementById('btn-new-fortune');
  const fortuneText = document.getElementById('fortune-text');
  const fortuneBox = document.getElementById('fortune-box');

  // Balloon container
  const balloonContainer = document.getElementById('balloon-container');

  // Modal & Toast
  const modalPersonalize = document.getElementById('modal-personalize');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const personalizeForm = document.getElementById('personalize-form');
  const inputName = document.getElementById('input-name');
  const inputMessage = document.getElementById('input-message');
  const inputSender = document.getElementById('input-sender');
  const shareToast = document.getElementById('share-toast');
  const toastMessage = document.getElementById('toast-message');

  // Canvases
  const confettiCanvas = document.getElementById('confetti-canvas');
  const sparkleCanvas = document.getElementById('sparkle-canvas');

  // State variables
  let isUnboxed = false;
  let isMusicPlaying = false;
  let balloonsPopped = 0;
  let isCandleBlown = false;

  // ==========================================================================
  // 1. INITIALIZE & READ URL PARAMETERS
  // ==========================================================================
  function loadUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const paramName = params.get('name') || 'Diya';
    const paramMessage = params.get('msg') || params.get('message');
    const paramSender = params.get('from') || params.get('sender');

    updateRecipientName(paramName.trim());
    inputName.value = paramName.trim();
    if (paramMessage && paramMessage.trim() !== '') {
      displayMessage.textContent = paramMessage.trim();
      letterBody.textContent = paramMessage.trim();
      inputMessage.value = paramMessage.trim();
    }
    if (paramSender && paramSender.trim() !== '') {
      letterSignature.textContent = paramSender.trim();
      inputSender.value = paramSender.trim();
    }
  }

  function updateRecipientName(name) {
    displayName.textContent = name;
    if (letterName) letterName.textContent = name;
    document.title = `Happy Birthday ${name}! 🎉 Special Celebration`;
  }

  loadUrlParameters();

  // Set formatted current date on card & polaroid
  const today = new Date();
  const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = today.toLocaleDateString(undefined, dateOptions);
  const currentDateEl = document.getElementById('current-date');
  const letterDateEl = document.getElementById('letter-date');
  if (currentDateEl) currentDateEl.textContent = formattedDate;
  if (letterDateEl) letterDateEl.textContent = formattedDate;

  // ==========================================================================
  // 2. WEB AUDIO API SYNTHESIZER (Happy Birthday Melody & Sound Effects)
  // ==========================================================================
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Synthesize musical notes with bell/chime harmonics
  function playNote(freq, startTime, duration) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Warm chime timbre
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Overtones for pleasant music box sound
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);
    gain2.gain.setValueAtTime(0.18, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.35, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    gain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.7);

    osc.connect(gain);
    osc2.connect(gain2);
    gain2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  // Sound FX: Balloon Pop
  function playPopSound() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Audio fallback graceful
    }
  }

  // Sound FX: Gentle Sparkle Chime
  function playChimeSound() {
    try {
      const ctx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        playNote(freq, ctx.currentTime + idx * 0.08, 0.45);
      });
    } catch (e) {}
  }

  // Sound FX: Candle Blow Puff
  function playPuffSound() {
    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {}
  }

  // Happy Birthday Song Melody
  // [frequency in Hz, duration in seconds]
  const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
  const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;

  const birthdayNotes = [
    // Phrase 1: Happy Birthday to you
    [G4, 0.35], [G4, 0.35], [A4, 0.7], [G4, 0.7], [C5, 0.7], [B4, 1.2],
    // Phrase 2: Happy Birthday to you
    [G4, 0.35], [G4, 0.35], [A4, 0.7], [G4, 0.7], [D5, 0.7], [C5, 1.2],
    // Phrase 3: Happy Birthday dear friend
    [G4, 0.35], [G4, 0.35], [G5, 0.7], [E5, 0.7], [C5, 0.7], [B4, 0.7], [A4, 1.2],
    // Phrase 4: Happy Birthday to you
    [F5, 0.35], [F5, 0.35], [E5, 0.7], [C5, 0.7], [D5, 0.7], [C5, 1.4]
  ];

  let melodyTimeout = null;

  function playHappyBirthdaySong() {
    if (!isMusicPlaying) return;
    const ctx = getAudioContext();
    let curTime = ctx.currentTime + 0.1;

    birthdayNotes.forEach(([freq, dur]) => {
      playNote(freq, curTime, dur * 0.9);
      curTime += dur;
    });

    const totalDuration = (curTime - ctx.currentTime) * 1000 + 1500;
    melodyTimeout = setTimeout(() => {
      if (isMusicPlaying) {
        playHappyBirthdaySong();
      }
    }, totalDuration);
  }

  function startMusic() {
    isMusicPlaying = true;
    musicStatus.textContent = 'ON';
    btnMusic.classList.add('active');
    musicIcon.textContent = '🎶';
    playHappyBirthdaySong();
  }

  function stopMusic() {
    isMusicPlaying = false;
    musicStatus.textContent = 'OFF';
    btnMusic.classList.remove('active');
    musicIcon.textContent = '🎵';
    if (melodyTimeout) clearTimeout(melodyTimeout);
  }

  btnMusic.addEventListener('click', () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  // ==========================================================================
  // 3. FULL-SCREEN CONFETTI & FIREWORKS CANNON ENGINE
  // ==========================================================================
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  const confettiColors = ['#ff4d88', '#ffd166', '#38bdf8', '#06d6a0', '#9d4edd', '#ff758f', '#ffffff'];

  function resizeCanvases() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    sparkleCanvas.width = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  class ConfettiParticle {
    constructor(x, y, isExplosion = false) {
      this.x = x;
      this.y = y;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.size = Math.random() * 8 + 6;
      this.type = Math.random() > 0.3 ? 'rect' : 'circle';
      
      if (isExplosion) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 6;
      } else {
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = Math.random() * 3 + 2;
      }

      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 8;
      this.gravity = 0.22;
      this.drag = 0.98;
      this.opacity = 1;
      this.decay = Math.random() * 0.007 + 0.004;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.rotation += this.rotSpeed;
      this.opacity -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;

      if (this.type === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function launchConfetti(count = 120, originX = window.innerWidth / 2, originY = window.innerHeight * 0.4) {
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new ConfettiParticle(originX, originY, true));
    }
    playChimeSound();
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update();
      p.draw(confettiCtx);

      if (p.opacity <= 0 || p.y > window.innerHeight + 50) {
        confettiParticles.splice(i, 1);
      }
    }

    // Gentle continuous drift if page is active
    if (isUnboxed && Math.random() < 0.15 && confettiParticles.length < 80) {
      const p = new ConfettiParticle(Math.random() * confettiCanvas.width, -10, false);
      p.opacity = 0.8;
      confettiParticles.push(p);
    }

    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  btnConfetti.addEventListener('click', () => {
    launchConfetti(140);
  });

  // ==========================================================================
  // 4. SPARKLE CURSOR TRAIL EFFECT
  // ==========================================================================
  const sparkleCtx = sparkleCanvas.getContext('2d');
  let sparkles = [];

  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.color = Math.random() > 0.4 ? '#ffd166' : '#fff';
      this.opacity = 1;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5 - 0.5;
      this.decay = 0.035;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffd166';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function addSparkle(x, y) {
    if (sparkles.length < 50) {
      sparkles.push(new Sparkle(x, y));
    }
  }

  window.addEventListener('mousemove', (e) => {
    addSparkle(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      addSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function animateSparkles() {
    sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.update();
      s.draw(sparkleCtx);
      if (s.opacity <= 0) {
        sparkles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateSparkles);
  }
  animateSparkles();

  // ==========================================================================
  // 5. UNBOXING EXPERIENCE
  // ==========================================================================
  function unboxGift() {
    if (isUnboxed) return;
    isUnboxed = true;

    // Trigger visual opening animation
    giftBox.classList.add('opening');
    playChimeSound();

    setTimeout(() => {
      // Big confetti explosion from gift location
      const boxRect = giftBox.getBoundingClientRect();
      const originX = boxRect.left + boxRect.width / 2;
      const originY = boxRect.top + boxRect.height / 2;
      launchConfetti(180, originX, originY);

      // Fade out intro, show main app
      introScreen.classList.add('unboxed');
      mainApp.classList.remove('hidden');

      // Start cheerful music
      startMusic();

      // Launch floating balloons
      initBalloons();

      // Extra burst
      setTimeout(() => {
        launchConfetti(100, window.innerWidth * 0.2, window.innerHeight * 0.3);
        launchConfetti(100, window.innerWidth * 0.8, window.innerHeight * 0.3);
      }, 700);
    }, 450);
  }

  giftBox.addEventListener('click', unboxGift);
  giftBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      unboxGift();
    }
  });

  // ==========================================================================
  // 6. INTERACTIVE BIRTHDAY CAKE & CANDLE
  // ==========================================================================
  function blowCandle() {
    if (isCandleBlown) return;
    isCandleBlown = true;

    // Extinguish flame and release smoke
    flame.style.opacity = '0';
    flame.style.transform = 'scale(0.3)';
    smoke.classList.remove('hidden');

    playPuffSound();
    playChimeSound();

    wishStatus.innerHTML = '✨ <strong>Your wish has been whispered to the universe! May it all come true!</strong> ✨';
    wishStatus.style.color = '#34d399';
    btnRelight.classList.remove('hidden');

    launchConfetti(90);
  }

  function relightCandle() {
    isCandleBlown = false;
    flame.style.opacity = '1';
    flame.style.transform = 'translateX(-50%)';
    smoke.classList.add('hidden');
    wishStatus.textContent = '🕯️ Candle is glowing! Click it to blow it out!';
    wishStatus.style.color = 'var(--primary-gold)';
    btnRelight.classList.add('hidden');
    playChimeSound();
  }

  candle.addEventListener('click', blowCandle);
  flame.addEventListener('click', (e) => {
    e.stopPropagation();
    blowCandle();
  });
  btnRelight.addEventListener('click', relightCandle);

  // ==========================================================================
  // 7. FLOATING INTERACTIVE BALLOONS (Click to Pop!)
  // ==========================================================================
  const balloonColors = [
    'linear-gradient(135deg, #ff4d88, #ff758f)',
    'linear-gradient(135deg, #ffd166, #ff9f1c)',
    'linear-gradient(135deg, #38bdf8, #0284c7)',
    'linear-gradient(135deg, #06d6a0, #059669)',
    'linear-gradient(135deg, #a855f7, #7c3aed)'
  ];

  function createBalloon() {
    if (!isUnboxed) return;
    if (document.querySelectorAll('.balloon').length > 10) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = `${Math.random() * 85 + 5}%`;
    balloon.style.background = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    balloon.style.animationDuration = `${Math.random() * 6 + 9}s`;

    const tail = document.createElement('div');
    tail.className = 'balloon-tail';
    balloon.appendChild(tail);

    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      popBalloon(balloon);
    });

    balloonContainer.appendChild(balloon);

    // Remove when animation finishes
    balloon.addEventListener('animationend', () => {
      balloon.remove();
    });
  }

  function popBalloon(balloon) {
    if (balloon.classList.contains('popping')) return;
    balloon.classList.add('popping');
    playPopSound();

    const rect = balloon.getBoundingClientRect();
    launchConfetti(25, rect.left + rect.width / 2, rect.top + rect.height / 2);

    balloonsPopped++;
    poppedCounter.textContent = `${balloonsPopped} Balloon${balloonsPopped === 1 ? '' : 's'} Popped! 🎯`;

    setTimeout(() => {
      balloon.remove();
    }, 300);
  }

  function initBalloons() {
    // Initial batch
    for (let i = 0; i < 4; i++) {
      setTimeout(createBalloon, i * 600);
    }
    // Continuous spawn
    setInterval(createBalloon, 2800);
  }

  // ==========================================================================
  // 8. 3D GREETING CARD FLIP
  // ==========================================================================
  flipperCard.addEventListener('click', () => {
    flipperCard.classList.toggle('is-flipped');
    playChimeSound();
  });

  flipperCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flipperCard.classList.toggle('is-flipped');
      playChimeSound();
    }
  });

  // ==========================================================================
  // 9. BIRTHDAY FORTUNE & BLESSING GENERATOR
  // ==========================================================================
  const birthdayFortunes = [
    "“The universe is conspiring to make this your happiest, most unforgettable year yet!”",
    "“May your coffee be strong, your cake be sweeter, and your year be completely unstoppable!”",
    "“You're not getting older, you are upgrading to version Next-Gen Awesome!”",
    "“May every path you take lead to success, peace of mind, and belly laughs.”",
    "“A brand new 365-day adventure starts today. Go write your masterpiece!”",
    "“Here's to another year of radiating positivity, crushing goals, and staying authentic!”",
    "“May your Wi-Fi be fast, your heart be full, and all your wildest dreams come within reach!”",
    "“Count your life by smiles, not tears. Count your age by friends, not years!”"
  ];

  let lastFortuneIndex = 0;

  btnNewFortune.addEventListener('click', () => {
    fortuneBox.classList.add('shake');
    playChimeSound();

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * birthdayFortunes.length);
    } while (newIndex === lastFortuneIndex);
    lastFortuneIndex = newIndex;

    setTimeout(() => {
      fortuneText.textContent = birthdayFortunes[newIndex];
      fortuneBox.classList.remove('shake');
      launchConfetti(35);
    }, 350);
  });

  // ==========================================================================
  // 10. CUSTOM PHOTO UPLOAD (Local Preview)
  // ==========================================================================
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        celebrationPhoto.src = event.target.result;
        launchConfetti(45);
        showToast("✨ Photo updated beautifully!");
      };
      reader.readAsDataURL(file);
    }
  });

  // ==========================================================================
  // 11. PERSONALIZE MODAL & URL SHARING
  // ==========================================================================
  btnPersonalize.addEventListener('click', () => {
    modalPersonalize.classList.remove('hidden');
    inputName.focus();
  });

  function closeModal() {
    modalPersonalize.classList.add('hidden');
  }

  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);
  modalPersonalize.addEventListener('click', (e) => {
    if (e.target === modalPersonalize) closeModal();
  });

  personalizeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = inputName.value.trim();
    const newMsg = inputMessage.value.trim();
    const newSender = inputSender.value.trim();

    if (newName) updateRecipientName(newName);
    if (newMsg) {
      displayMessage.textContent = newMsg;
      letterBody.textContent = newMsg;
    }
    if (newSender) {
      letterSignature.textContent = newSender;
    }

    closeModal();
    launchConfetti(80);
    showToast("🎉 Celebration details updated successfully!");
  });

  // Share functionality: generate custom URL and copy to clipboard
  btnShare.addEventListener('click', () => {
    const curName = displayName.textContent.trim();
    const curMsg = displayMessage.textContent.trim();
    const curSender = letterSignature.textContent.trim();

    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('name', curName);
    if (curMsg) url.searchParams.set('msg', curMsg);
    if (curSender) url.searchParams.set('from', curSender);

    const shareUrl = url.toString();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast(`🔗 Share link copied for ${curName}! Send it to them!`);
      }).catch(() => {
        prompt("Copy this link to share:", shareUrl);
      });
    } else {
      prompt("Copy this link to share:", shareUrl);
    }
  });

  function showToast(message) {
    toastMessage.textContent = message;
    shareToast.classList.remove('hidden');
    setTimeout(() => {
      shareToast.classList.add('hidden');
    }, 4000);
  }
});
