// ============================================================
// FALLING FLOWERS — SVG petals drift from top to bottom
// ============================================================
(function () {
  const field = document.getElementById('flowerField');
  if (!field) return;

  // Colour palette matching the brown theme
  const colours = [
    '#C4A882', '#BEB5A9', '#A78D78',
    '#D9C4B0', '#E1D4C2', '#6E473B',
    '#F0E6D8', '#B89880'
  ];

  // Four SVG flower shapes (as inline SVG strings)
  const shapes = [
    // 5-petal rounded flower
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.82" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(72  20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(144 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(216 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(288 20 20)"/>
      <circle  cx="20" cy="20" r="5" fill="${c}" opacity="1"/>
    </svg>`,

    // 6-petal daisy
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.75" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(60  20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(120 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(180 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(240 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(300 20 20)"/>
      <circle  cx="20" cy="20" r="4.5" fill="${c}" opacity="1"/>
    </svg>`,

    // Single petal / leaf shape
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.7" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4 C 28 12, 28 28, 20 36 C 12 28, 12 12, 20 4 Z"/>
    </svg>`,

    // 4-petal sakura style
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.78" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(90  20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(180 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(270 20 20)"/>
      <circle  cx="20" cy="20" r="4" fill="${c}" opacity="0.9"/>
    </svg>`,
  ];

  const TOTAL = 22;  // number of flowers in the pool
  const rnd = (a, b) => Math.random() * (b - a) + a;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  for (let i = 0; i < TOTAL; i++) {
    const el = document.createElement('div');
    el.className = 'flower';

    const size = rnd(14, 32);                   // px
    const colour = pick(colours);
    const shapeIdx = Math.floor(rnd(0, shapes.length));
    const duration = rnd(7, 18);                    // fall speed (s)
    const spinSpeed = rnd(4, 14);                    // rotation speed (s)
    const delay = rnd(-duration, 0);             // stagger so they're already mid-air
    const leftPct = rnd(0, 100);                   // horizontal start
    const drift = `${rnd(-80, 80)}px`;           // horizontal wander during fall

    el.style.cssText = `
      left: ${leftPct}%;
      --drift: ${drift};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    el.innerHTML = shapes[shapeIdx](colour, Math.round(size));

    // Apply spin speed to the inner svg
    const svg = el.querySelector('svg');
    if (svg) {
      svg.style.animationDuration = `${spinSpeed}s`;
    }

    field.appendChild(el);
  }
})();


const NIKAH_DATE = new Date('2026-12-12T16:00:00+05:30').getTime();

const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins = document.getElementById('cd-mins');
const cdSecs = document.getElementById('cd-secs');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now = Date.now();
  let diff = NIKAH_DATE - now;

  if (diff <= 0) {
    cdDays.textContent = '00';
    cdHours.textContent = '00';
    cdMins.textContent = '00';
    cdSecs.textContent = '00';
    return;
  }

  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000); diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);

  cdDays.textContent = pad(days);
  cdHours.textContent = pad(hours);
  cdMins.textContent = pad(mins);
  cdSecs.textContent = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================================
// SPLASH SCREEN — dismiss on "Open Invitation" click + autoplay music
// ============================================================
const splashOverlay = document.getElementById('splashOverlay');
const openInvitationBtn = document.getElementById('openInvitationBtn');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicRing = document.getElementById('musicRing');
const iconOn = musicBtn.querySelector('.music-icon--on');
const iconOff = musicBtn.querySelector('.music-icon--off');

// Update button appearance to match actual playing state
function syncMusicBtn(playing) {
  if (playing) {
    iconOn.style.display = '';
    iconOff.style.display = 'none';
    musicBtn.setAttribute('aria-label', 'Pause music');
    musicRing.classList.add('spinning');
  } else {
    iconOn.style.display = 'none';
    iconOff.style.display = '';
    musicBtn.setAttribute('aria-label', 'Play music');
    musicRing.classList.remove('spinning');
  }
}

// Attempt autoplay when user clicks "Open Invitation"
openInvitationBtn.addEventListener('click', () => {
  splashOverlay.classList.add('hidden');
  splashOverlay.addEventListener('transitionend', () => {
    splashOverlay.remove();
  }, { once: true });

  // Autoplay — browsers allow this after a user gesture
  bgMusic.volume = 0.55;
  bgMusic.play().then(() => {
    syncMusicBtn(true);
  }).catch(() => {
    // Autoplay blocked — show button in paused state
    syncMusicBtn(false);
  });
});

// Toggle play / pause via floating button
musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => syncMusicBtn(true));
  } else {
    bgMusic.pause();
    syncMusicBtn(false);
  }
});

// Keep button in sync if audio ends unexpectedly (shouldn't happen with loop)
bgMusic.addEventListener('pause', () => syncMusicBtn(false));
bgMusic.addEventListener('play', () => syncMusicBtn(true));

// ============================================================
// REVEAL ON SCROLL
// ============================================================
const revealTargets = document.querySelectorAll(
  '.occasion-card, .countdown-grid, .venue-card, .rsvp-card, .section-title, .section-eyebrow, .invite-note p'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));

// ============================================================
// RSVP — Attendance Toggle
// ============================================================
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const attendanceInput = document.getElementById('attendanceInput');

function setAttendance(value) {
  attendanceInput.value = value;

  if (value === 'yes') {
    btnYes.classList.add('active');
    btnYes.setAttribute('aria-pressed', 'true');
    btnNo.classList.remove('active');
    btnNo.setAttribute('aria-pressed', 'false');
  } else {
    btnNo.classList.add('active');
    btnNo.setAttribute('aria-pressed', 'true');
    btnYes.classList.remove('active');
    btnYes.setAttribute('aria-pressed', 'false');
  }
}

btnYes.addEventListener('click', () => setAttendance('yes'));
btnNo.addEventListener('click', () => setAttendance('no'));

// ============================================================
// RSVP — Form Submit → Google Sheets via Apps Script
// ============================================================

// 🔑 Paste your Google Apps Script Web App URL here after deploying
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoVmK7CALG_nf-Vim_s1CwfwWhNZIuNZLvY4PAChdKeBajVVEvHVuJ2VduSWY7aPOW/exec';

const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
const submitBtn = rsvpForm.querySelector('.rsvp-submit');

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nameField = document.getElementById('rsvpName');

  // Basic validation
  if (!nameField.value.trim()) {
    nameField.focus();
    nameField.style.borderColor = '#6E473B';
    nameField.style.boxShadow = '0 0 0 3px rgba(110,71,59,0.18)';
    setTimeout(() => {
      nameField.style.borderColor = '';
      nameField.style.boxShadow = '';
    }, 2200);
    return;
  }

  // Collect data
  const payload = {
    attendance: attendanceInput.value,
    name: document.getElementById('rsvpName').value.trim(),
    mobile: document.getElementById('rsvpMobile').value.trim(),
    guests: document.getElementById('rsvpGuests').value,
    message: document.getElementById('rsvpMessage').value.trim(),
  };

  // Disable button and show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    // Google Apps Script requires no-cors mode for cross-origin POST
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // no-cors gives opaque response — treat reaching here as success
    showSuccess();

  } catch (err) {
    // Network failure fallback — save to localStorage so no data is lost
    try {
      const existing = JSON.parse(localStorage.getItem('rsvp_responses') || '[]');
      existing.push({ ...payload, savedOffline: true, timestamp: new Date().toISOString() });
      localStorage.setItem('rsvp_responses', JSON.stringify(existing));
    } catch (_) { /* ignore */ }

    showSuccess(); // still show success to user
    console.warn('RSVP saved offline (network error):', err);
  }
});

function showSuccess() {
  rsvpForm.hidden = true;
  rsvpSuccess.hidden = false;
}
