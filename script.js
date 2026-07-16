// ============================================================
// COUNTDOWN — Nikkah: Saturday, 12 December 2026, 4:00 PM IST
// ============================================================
const NIKAH_DATE = new Date('2026-12-12T16:00:00+05:30').getTime();

const cdDays  = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins  = document.getElementById('cd-mins');
const cdSecs  = document.getElementById('cd-secs');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now  = Date.now();
  let diff   = NIKAH_DATE - now;

  if (diff <= 0) {
    cdDays.textContent  = '00';
    cdHours.textContent = '00';
    cdMins.textContent  = '00';
    cdSecs.textContent  = '00';
    return;
  }

  const days  = Math.floor(diff / 86400000); diff -= days  * 86400000;
  const hours = Math.floor(diff / 3600000);  diff -= hours * 3600000;
  const mins  = Math.floor(diff / 60000);    diff -= mins  * 60000;
  const secs  = Math.floor(diff / 1000);

  cdDays.textContent  = pad(days);
  cdHours.textContent = pad(hours);
  cdMins.textContent  = pad(mins);
  cdSecs.textContent  = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================================
// SPLASH SCREEN — dismiss on "Open Invitation" click + autoplay music
// ============================================================
const splashOverlay     = document.getElementById('splashOverlay');
const openInvitationBtn = document.getElementById('openInvitationBtn');
const bgMusic           = document.getElementById('bgMusic');
const musicBtn          = document.getElementById('musicBtn');
const musicRing         = document.getElementById('musicRing');
const iconOn            = musicBtn.querySelector('.music-icon--on');
const iconOff           = musicBtn.querySelector('.music-icon--off');

// Update button appearance to match actual playing state
function syncMusicBtn(playing) {
  if (playing) {
    iconOn.style.display  = '';
    iconOff.style.display = 'none';
    musicBtn.setAttribute('aria-label', 'Pause music');
    musicRing.classList.add('spinning');
  } else {
    iconOn.style.display  = 'none';
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
bgMusic.addEventListener('play',  () => syncMusicBtn(true));

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
const btnYes          = document.getElementById('btnYes');
const btnNo           = document.getElementById('btnNo');
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
btnNo.addEventListener('click',  () => setAttendance('no'));

// ============================================================
// RSVP — Form Submit → Google Sheets via Apps Script
// ============================================================

// 🔑 Paste your Google Apps Script Web App URL here after deploying
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoVmK7CALG_nf-Vim_s1CwfwWhNZIuNZLvY4PAChdKeBajVVEvHVuJ2VduSWY7aPOW/exec';

const rsvpForm    = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
const submitBtn   = rsvpForm.querySelector('.rsvp-submit');

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nameField = document.getElementById('rsvpName');

  // Basic validation
  if (!nameField.value.trim()) {
    nameField.focus();
    nameField.style.borderColor = '#6E473B';
    nameField.style.boxShadow   = '0 0 0 3px rgba(110,71,59,0.18)';
    setTimeout(() => {
      nameField.style.borderColor = '';
      nameField.style.boxShadow   = '';
    }, 2200);
    return;
  }

  // Collect data
  const payload = {
    attendance: attendanceInput.value,
    name:       document.getElementById('rsvpName').value.trim(),
    mobile:     document.getElementById('rsvpMobile').value.trim(),
    guests:     document.getElementById('rsvpGuests').value,
    message:    document.getElementById('rsvpMessage').value.trim(),
  };

  // Disable button and show loading state
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  try {
    // Google Apps Script requires no-cors mode for cross-origin POST
    await fetch(APPS_SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
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
  rsvpForm.hidden    = true;
  rsvpSuccess.hidden = false;
}
