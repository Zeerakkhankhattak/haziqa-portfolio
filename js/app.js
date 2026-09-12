/**
 * HAZIQA KHAN KHATTAK — PORTFOLIO MAIN CONTROLLER
 * Ambient cursor glow, theme toggling, project filtering, modal viewer, contact drawer, and audio feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Audio Synthesizer (Opt-in Micro-haptics) ---
  let soundEnabled = false;
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  window.playMicroSound = function(freq = 520, duration = 0.08) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignore audio failure if restricted by browser
    }
  };

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.innerHTML = soundEnabled ? '🔊' : '🔇';
      soundToggleBtn.setAttribute('title', soundEnabled ? 'Sound FX On' : 'Sound FX Muted');
      if (soundEnabled) window.playMicroSound(880, 0.1);
      showToast(soundEnabled ? 'Sensory sound feedback enabled ✦' : 'Sound feedback muted');
    });
  }

  // --- 2. Ambient Cursor Glow ---
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursorGlow() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    if (cursorGlow) {
      cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
    requestAnimationFrame(renderCursorGlow);
  }
  renderCursorGlow();

  // --- 3. Theme Toggle (Dusk Plum ↔ Blush Velvet) ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('hkk-theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeToggleBtn) themeToggleBtn.innerHTML = '🌙';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggleBtn) themeToggleBtn.innerHTML = '☀️';
    }
    localStorage.setItem('hkk-theme', theme);
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const nextTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      window.playMicroSound(620);
    });
  }

  // --- 4. Category Filter Tabs ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      window.playMicroSound(540);

      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- 5. Modal Case Study Reader ---
  const modalOverlay = document.getElementById('case-study-modal');
  const modalContentBody = document.getElementById('modal-content-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openCaseStudy(studyId) {
    const data = window.caseStudiesData[studyId];
    if (!data || !modalContentBody) return;

    modalContentBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem;">
          <span class="tag-pill">${data.category}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">${data.timeline}</span>
          <span style="margin-left: auto; font-size: 0.82rem; font-weight: 700; color: var(--accent-blush); background: rgba(244,114,182,0.12); padding: 0.25rem 0.75rem; border-radius: 999px;">
            ${data.impact}
          </span>
        </div>

        <h2 style="font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 800; line-height: 1.2;">${data.title}</h2>
        <p style="font-size: 1.15rem; color: var(--text-secondary); line-height: 1.6; font-style: italic;">"${data.tagline}"</p>

        <div style="border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-card); margin: 0.5rem 0;">
          <img src="${data.image}" alt="${data.title}" style="width: 100%; height: auto; display: block;" />
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; background: var(--bg-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Role</div>
            <div style="font-size: 0.95rem; font-weight: 700; margin-top: 0.25rem;">${data.role}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Tech & Design Tools</div>
            <div style="font-size: 0.88rem; color: var(--accent-blush); margin-top: 0.25rem; font-family: var(--font-mono);">${data.techStack.join(' • ')}</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
          <h3 style="font-size: 1.3rem; color: var(--accent-blush); display: flex; align-items: center; gap: 0.5rem;">
            <span>✦</span> The Core Problem
          </h3>
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1rem;">${data.problem}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <h3 style="font-size: 1.3rem; color: var(--accent-purple); display: flex; align-items: center; gap: 0.5rem;">
            <span>✦</span> User Research & Discovery
          </h3>
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1rem;">${data.research}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <h3 style="font-size: 1.3rem; color: var(--accent-blush); display: flex; align-items: center; gap: 0.5rem;">
            <span>✦</span> The Design Solution
          </h3>
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1rem;">${data.solution}</p>
        </div>

        <div style="background: rgba(244, 114, 182, 0.08); border: 1px solid rgba(244, 114, 182, 0.3); border-radius: var(--radius-lg); padding: 1.75rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--accent-blush); font-weight: 700;">
            THE DESIGN ENGINEER ADVANTAGE ⚡
          </div>
          <h4 style="font-size: 1.15rem; font-weight: 700;">How Software Engineering Shaped This System</h4>
          <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.65;">${data.engineeringHighlight}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <h4 style="font-size: 1.05rem; font-weight: 700;">Key Deliverables</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; padding: 0;">
            ${data.deliverables.map(item => `
              <li style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-secondary); font-size: 0.92rem;">
                <span style="color: var(--accent-blush);">✓</span> ${item}
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    if (modalOverlay) {
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      window.playMicroSound(720);
    }
  }

  function closeCaseStudy() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = 'auto';
      window.playMicroSound(440);
    }
  }

  // Bind click handlers to cards and "View Case Study" buttons
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const studyId = card.dataset.studyId;
      if (studyId) openCaseStudy(studyId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCaseStudy);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeCaseStudy();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCaseStudy();
      closeContactDrawer();
    }
  });

  // --- 6. Interactive Contact Drawer ---
  const contactDrawerOverlay = document.getElementById('contact-drawer-overlay');
  const openDrawerBtns = document.querySelectorAll('.trigger-contact-drawer');
  const closeDrawerBtn = document.getElementById('drawer-close-btn');
  const contactForm = document.getElementById('drawer-contact-form');
  const typeChips = document.querySelectorAll('.type-chip');

  function openContactDrawer() {
    if (contactDrawerOverlay) {
      contactDrawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      window.playMicroSound(680);
    }
  }

  function closeContactDrawer() {
    if (contactDrawerOverlay) {
      contactDrawerOverlay.classList.remove('open');
      document.body.style.overflow = 'auto';
      window.playMicroSound(440);
    }
  }

  openDrawerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactDrawer();
    });
  });

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeContactDrawer);
  if (contactDrawerOverlay) {
    contactDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === contactDrawerOverlay) closeContactDrawer();
    });
  }

  typeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      typeChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      window.playMicroSound(560);
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.playMicroSound(920);
      closeContactDrawer();
      showToast('Thank you! Your message has been sent to Haziqa ✨');
      contactForm.reset();
    });
  }

  // --- 7. Copy Email Toast Notification ---
  const copyEmailBtns = document.querySelectorAll('.trigger-copy-email');
  const toastNotification = document.getElementById('toast-notification');
  const emailAddress = "haziqa.khattak.design@gmail.com";

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.querySelector('.toast-text').textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3600);
  }

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailAddress).then(() => {
        window.playMicroSound(780);
        showToast(`Email copied: ${emailAddress} ✨`);
      }).catch(() => {
        // Fallback
        showToast(`Contact: ${emailAddress}`);
      });
    });
  });

  // --- 8. Magnetic Button Hover Interaction ---
  const magneticItems = document.querySelectorAll('.magnetic-target');
  magneticItems.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
});
