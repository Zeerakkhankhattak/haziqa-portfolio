/**
 * HAZIQA KHAN KHATTAK — INTERACTIVE DESIGN ENGINEER LAB
 * Live token generator, component state tester, and code vs canvas inspector.
 */

document.addEventListener('DOMContentLoaded', () => {
  const hueSlider = document.getElementById('lab-hue-slider');
  const satSlider = document.getElementById('lab-sat-slider');
  const radiusSlider = document.getElementById('lab-radius-slider');
  const blurSlider = document.getElementById('lab-blur-slider');

  const hueValDisplay = document.getElementById('lab-hue-val');
  const satValDisplay = document.getElementById('lab-sat-val');
  const radiusValDisplay = document.getElementById('lab-radius-val');
  const blurValDisplay = document.getElementById('lab-blur-val');

  const sampleCard = document.getElementById('lab-sample-card');
  const sampleBtn = document.getElementById('lab-sample-btn');
  const sampleDot = document.getElementById('lab-sample-dot');
  const stateChips = document.querySelectorAll('.state-toggle-chip');

  const modeButtons = document.querySelectorAll('.mode-btn');
  const canvasPanel = document.getElementById('lab-canvas-viewport');
  const codeOutput = document.getElementById('lab-code-output');
  const codeBlock = document.getElementById('lab-code-block');

  // Default state values
  let currentHue = 325; // Blush Pink / Orchid
  let currentSat = 85;
  let currentRadius = 18;
  let currentBlur = 20;
  let activeVariant = 'primary'; // 'primary', 'glass', 'haptic', 'outline'

  // Update dynamic CSS custom variables on the preview card
  function updateTokens() {
    const accentColor = `hsl(${currentHue}, ${currentSat}%, 68%)`;
    const glowColor = `hsla(${currentHue}, ${currentSat}%, 65%, 0.35)`;
    const bgCard = `hsla(${currentHue - 35}, 45%, 15%, 0.75)`;
    const borderColor = `hsla(${currentHue}, ${currentSat}%, 70%, 0.38)`;

    if (sampleCard) {
      sampleCard.style.setProperty('--lab-preview-accent', accentColor);
      sampleCard.style.setProperty('--lab-preview-glow', glowColor);
      sampleCard.style.setProperty('--lab-preview-bg', bgCard);
      sampleCard.style.setProperty('--lab-preview-border', borderColor);
      sampleCard.style.borderRadius = `${currentRadius}px`;
      sampleCard.style.backdropFilter = `blur(${currentBlur}px)`;
    }

    if (sampleBtn) {
      sampleBtn.style.setProperty('--lab-preview-accent', accentColor);
      sampleBtn.style.setProperty('--lab-preview-glow', glowColor);
      sampleBtn.style.borderRadius = `${Math.min(currentRadius, 24)}px`;
    }

    if (sampleDot) {
      sampleDot.style.background = accentColor;
      sampleDot.style.boxShadow = `0 0 12px ${accentColor}`;
    }

    // Update text displays
    if (hueValDisplay) hueValDisplay.textContent = `${currentHue}°`;
    if (satValDisplay) satValDisplay.textContent = `${currentSat}%`;
    if (radiusValDisplay) radiusValDisplay.textContent = `${currentRadius}px`;
    if (blurValDisplay) blurValDisplay.textContent = `${currentBlur}px`;

    updateCodeSnippet(accentColor, glowColor, borderColor);
  }

  function updateCodeSnippet(accentColor, glowColor, borderColor) {
    if (!codeBlock) return;

    const codeSnippet = `// Token Definition: Scribe / Prism System
export const designTokens = {
  accent: "${accentColor}",
  glow: "${glowColor}",
  border: "${borderColor}",
  radius: "${currentRadius}px",
  glassBlur: "${currentBlur}px",
  activeVariant: "${activeVariant}"
};

// React Component Output
export const InteractivePill = () => (
  <button
    className="haptic-pill-btn"
    style={{
      background: "${activeVariant === 'primary' ? accentColor : 'transparent'}",
      border: "1px solid ${borderColor}",
      borderRadius: "${Math.min(currentRadius, 24)}px",
      boxShadow: "0 8px 24px ${glowColor}",
      backdropFilter: "blur(${currentBlur}px)"
    }}
  >
    <span>${activeVariant.toUpperCase()} ACTION</span>
  </button>
);`;

    codeBlock.textContent = codeSnippet;
  }

  // Event Listeners for Sliders
  if (hueSlider) {
    hueSlider.addEventListener('input', (e) => {
      currentHue = parseInt(e.target.value);
      updateTokens();
    });
  }

  if (satSlider) {
    satSlider.addEventListener('input', (e) => {
      currentSat = parseInt(e.target.value);
      updateTokens();
    });
  }

  if (radiusSlider) {
    radiusSlider.addEventListener('input', (e) => {
      currentRadius = parseInt(e.target.value);
      updateTokens();
    });
  }

  if (blurSlider) {
    blurSlider.addEventListener('input', (e) => {
      currentBlur = parseInt(e.target.value);
      updateTokens();
    });
  }

  // Variant Chips
  stateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      stateChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeVariant = chip.dataset.variant || 'primary';

      if (sampleBtn) {
        if (activeVariant === 'primary') {
          sampleBtn.style.background = `hsl(${currentHue}, ${currentSat}%, 68%)`;
          sampleBtn.style.color = '#ffffff';
          sampleBtn.style.border = 'none';
          sampleBtn.innerHTML = `Explore State <span>✨</span>`;
        } else if (activeVariant === 'glass') {
          sampleBtn.style.background = 'rgba(255, 255, 255, 0.08)';
          sampleBtn.style.color = '#fbcfe8';
          sampleBtn.style.border = `1px solid hsla(${currentHue}, ${currentSat}%, 70%, 0.4)`;
          sampleBtn.innerHTML = `Frosted Glass <span>🔮</span>`;
        } else if (activeVariant === 'haptic') {
          sampleBtn.style.background = `hsla(${currentHue}, ${currentSat}%, 60%, 0.2)`;
          sampleBtn.style.color = '#ffffff';
          sampleBtn.style.border = `1px solid hsla(${currentHue}, ${currentSat}%, 60%, 0.6)`;
          sampleBtn.innerHTML = `Haptic Pulse <span>⚡</span>`;
        } else if (activeVariant === 'loading') {
          sampleBtn.style.background = `hsl(${currentHue}, ${currentSat}%, 68%)`;
          sampleBtn.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> Processing...`;
        }
      }

      updateTokens();
    });
  });

  // Mode Switcher: Canvas vs Code
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.mode;
      if (mode === 'code') {
        if (canvasPanel) canvasPanel.style.display = 'none';
        if (codeOutput) codeOutput.style.display = 'block';
      } else {
        if (canvasPanel) canvasPanel.style.display = 'flex';
        if (codeOutput) codeOutput.style.display = 'none';
      }
    });
  });

  // Interactive sample click micro-reaction
  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      sampleBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        sampleBtn.style.transform = 'scale(1)';
      }, 150);

      // Play soft sound if enabled
      if (window.playMicroSound) {
        window.playMicroSound(660);
      }
    });
  }

  // Initial render
  updateTokens();
});
