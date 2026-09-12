/**
 * HAZIQA KHAN: PORTFOLIO MAIN CONTROLLER
 * Ambient cursor glow, theme toggling, project filtering, modal viewer, contact drawer, and audio feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  // SVG Icons for Toggle Buttons (No emojis)
  const soundOnSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
  const soundMutedSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;

  const sunSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const moonSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  // 1. Audio Synthesizer (Opt-in Sensory Haptics)
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
      // Ignore audio restriction if muted by browser policy
    }
  };

  if (soundToggleBtn) {
    soundToggleBtn.innerHTML = soundMutedSvg;
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.innerHTML = soundEnabled ? soundOnSvg : soundMutedSvg;
      soundToggleBtn.setAttribute('title', soundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted');
      if (soundEnabled) window.playMicroSound(880, 0.1);
      showToast(soundEnabled ? 'Sensory sound feedback enabled' : 'Sound feedback muted');
    });
  }

  // 2. Ambient Cursor Glow
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

  // 3. Theme Toggle: Dusk Plum and Blush Velvet
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('hkk-theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeToggleBtn) themeToggleBtn.innerHTML = moonSvg;
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggleBtn) themeToggleBtn.innerHTML = sunSvg;
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

  // 4. Category Filter Tabs
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

  // 5. Modal Case Study Reader
  const modalOverlay = document.getElementById('case-study-modal');
  const modalContentBody = document.getElementById('modal-content-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openCaseStudy(studyId) {
    const data = window.caseStudiesData[studyId];
    if (!data || !modalContentBody) return;

    const checkSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-blush);" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
    const sparkSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="color: var(--accent-blush);" aria-hidden="true"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>`;

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
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Tech and Design Tools</div>
            <div style="font-size: 0.88rem; color: var(--accent-blush); margin-top: 0.25rem; font-family: var(--font-mono);">${data.techStack.join(' • ')}</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
          <h3 style="font-size: 1.3rem; color: var(--accent-blush); display: flex; align-items: center; gap: 0.5rem;">
            ${sparkSvg} The Core Problem
          </h3>
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1rem;">${data.problem}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <h3 style="font-size: 1.3rem; color: var(--accent-purple); display: flex; align-items: center; gap: 0.5rem;">
            ${sparkSvg} User Research and Discovery
          </h3>
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1rem;">${data.research}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <h3 style="font-size: 1.3rem; color: var(--accent-blush); display: flex; align-items: center; gap: 0.5rem;">
            ${sparkSvg} The Design Solution
          </h3>
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1rem;">${data.solution}</p>
        </div>

        <div style="background: rgba(244, 114, 182, 0.08); border: 1px solid rgba(244, 114, 182, 0.3); border-radius: var(--radius-lg); padding: 1.75rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--accent-blush); font-weight: 700;">
            THE DESIGN ENGINEER PERSPECTIVE
          </div>
          <h4 style="font-size: 1.15rem; font-weight: 700;">How Software Engineering Shaped This System</h4>
          <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.65;">${data.engineeringHighlight}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <h4 style="font-size: 1.05rem; font-weight: 700;">Key Deliverables</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; padding: 0;">
            ${data.deliverables.map(item => `
              <li style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-secondary); font-size: 0.92rem;">
                ${checkSvg} ${item}
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

  // Bind click handlers to cards
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
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

  // 6. Interactive Contact Drawer
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
      const interestInput = document.getElementById('contact-interest-input');
      if (interestInput) {
        interestInput.value = chip.dataset.value || chip.textContent.trim();
      }
      window.playMicroSound(560);
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('drawer-submit-btn') || contactForm.querySelector('button[type="submit"]');
      const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
      const originalText = btnText ? btnText.textContent : 'Send Message';
      const statusMsg = document.getElementById('drawer-form-status');

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');
      const interestInput = document.getElementById('contact-interest-input');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      const interest = interestInput ? interestInput.value : 'Full-time Role';

      if (!name || !email || !message) {
        showToast('Please complete all fields before sending');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Delivering Message...';
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.color = 'var(--accent-blush)';
        statusMsg.textContent = 'Sending message directly...';
      }

      try {
        const response = await fetch("https://formsubmit.co/ajax/hazika007@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            interest: interest,
            message: message,
            _subject: `New Portfolio Message from ${name} (${interest})`,
            _replyto: email,
            _template: "table"
          })
        });

        const data = await response.json();

        if (response.ok || data.success === "true" || data.success === true) {
          window.playMicroSound(920);
          showToast('Message delivered successfully');
          contactForm.reset();

          typeChips.forEach((c, idx) => {
            if (idx === 0) c.classList.add('selected');
            else c.classList.remove('selected');
          });
          if (interestInput) interestInput.value = 'Full-time Role';

          if (statusMsg) {
            statusMsg.style.color = '#25d366';
            statusMsg.textContent = 'Message sent successfully';
          }

          setTimeout(() => {
            closeContactDrawer();
            if (statusMsg) {
              statusMsg.style.display = 'none';
              statusMsg.textContent = '';
            }
          }, 2000);
        } else {
          throw new Error(data.message || 'Submission error');
        }
      } catch (err) {
        console.warn('Direct delivery fallback triggered:', err);
        window.playMicroSound(440);
        showToast('Opening your email application...');

        const mailtoUrl = `mailto:hazika007@gmail.com?subject=${encodeURIComponent(`Inquiry from ${name} (${interest})`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\nMessage:\n${message}`)}`;
        window.open(mailtoUrl, '_blank');

        if (statusMsg) {
          statusMsg.style.color = '#f59e0b';
          statusMsg.textContent = 'Opening your email client to send message...';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = originalText;
      }
    });
  }

  // 7. Toast Notification & Copy Email
  const copyEmailBtns = document.querySelectorAll('.trigger-copy-email');
  const toastNotification = document.getElementById('toast-notification');
  const emailAddress = "hazika007@gmail.com";

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
        showToast('Email address copied to clipboard');
      }).catch(() => {
        showToast('Email address copied');
      });
    });
  });

  // 8. Magnetic Button Hover Interaction
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
