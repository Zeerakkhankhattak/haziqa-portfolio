/**
 * ============================================================================
 * SCROLL-LINKED IMAGE SEQUENCE ANIMATION COMPONENT
 * ============================================================================
 * 
 * Features:
 * - Preloads frames before start with visual progress indicator.
 * - Hardware-accelerated canvas rendering with requestAnimationFrame.
 * - Only repaints when the target frame index actually changes.
 * - Aspect-ratio preserving cover-fit on window resize (retina DPI ready).
 * - Mobile optimization: loads every 2nd frame if viewport width < 768px.
 * - Accessibility: respects `prefers-reduced-motion` by displaying a static frame.
 * 
 * SPEED & TIMING ADJUSTMENT GUIDE:
 * ----------------------------------------------------------------------------
 * 1. HOW TO MAKE THE ANIMATION SLOWER:
 *    - Increase the container height in CSS (`.scroll-sequence-section`).
 *      For example, change `height: 400vh;` to `height: 600vh;` or `700vh;`.
 *      This requires the user to scroll more pixels to scrub through the 300 frames.
 * 
 * 2. HOW TO MAKE THE ANIMATION FASTER:
 *    - Decrease the container height in CSS (`.scroll-sequence-section`).
 *      For example, change `height: 400vh;` to `height: 250vh;` or `300vh;`.
 * 
 * 3. FINE-TUNING THE SCROLL MAPPING:
 *    - Look at the `calculateProgress()` function below.
 *    - You can offset the start/end points using `scrollPaddingTop` or `scrollPaddingBottom`.
 * ============================================================================
 */

(function initScrollSequence() {
  const container = document.getElementById('scroll-sequence');
  const canvas = document.getElementById('scroll-sequence-canvas');
  const loadingOverlay = document.getElementById('sequence-loading');
  const progressText = document.getElementById('sequence-loader-progress');
  const progressFill = document.getElementById('sequence-progress-fill');
  const scrollHint = document.getElementById('sequence-scroll-hint');

  // Phrases for narrative storytelling during the scrub
  const phrase1 = document.getElementById('sequence-phrase-1');
  const phrase2 = document.getElementById('sequence-phrase-2');

  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');

  // Configuration
  const TOTAL_FRAMES = 300;
  const FOLDER_PATH = 'assets/scroll%20animation';
  const FILE_PREFIX = 'ezgif-frame-';
  const FILE_EXT = '.jpg';

  // Mobile optimization: If viewport width < 768px, load every 2nd frame
  const isMobile = window.innerWidth < 768;
  const frameStep = isMobile ? 2 : 1; // 1 = all 300 frames, 2 = 150 frames

  // Accessibility: Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // State
  const frames = [];
  let loadedCount = 0;
  let currentFrameIndex = -1;
  let isRafScheduled = false;

  // Generate padded frame filename: e.g. 1 -> "001", 42 -> "042"
  function getFrameUrl(frameNumber) {
    const padded = String(frameNumber).padStart(3, '0');
    return `${FOLDER_PATH}/${FILE_PREFIX}${padded}${FILE_EXT}`;
  }

  // Draw image to canvas using "cover" mode while preserving 16:9 aspect ratio
  function drawCoverImage(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Calculate scale factor to cover the canvas
    const scale = Math.max(cw / iw, ch / ih);
    const drawWidth = iw * scale;
    const drawHeight = ih * scale;
    const offsetX = (cw - drawWidth) / 2;
    const offsetY = (ch - drawHeight) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  // Handle high-DPI retina displays & window resizing
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    // Re-render current frame immediately on resize
    if (currentFrameIndex >= 0 && frames[currentFrameIndex]) {
      drawCoverImage(frames[currentFrameIndex]);
    }
  }

  // --------------------------------------------------------------------------
  // SCROLL-TO-FRAME MAPPING LOGIC
  // --------------------------------------------------------------------------
  function calculateProgress() {
    const rect = container.getBoundingClientRect();

    /**
     * TOTAL SCROLLABLE DISTANCE:
     * container.offsetHeight is ~400vh.
     * When sticky element reaches top (rect.top <= 0), it pins for (containerHeight - windowHeight).
     * This is the exact distance the user scrolls while the canvas stays locked in place.
     */
    const totalScrollableDistance = container.offsetHeight - window.innerHeight;

    if (totalScrollableDistance <= 0) return 0;

    // How many pixels the top of the container has passed above the viewport
    const scrolledDistance = -rect.top;

    // Normalize progress strictly between 0.0 (start) and 1.0 (end)
    const rawProgress = scrolledDistance / totalScrollableDistance;
    return Math.min(Math.max(rawProgress, 0), 1);
  }

  function updateScrollFrame() {
    if (frames.length === 0) return;

    const progress = calculateProgress();

    /**
     * SPEED MAPPING:
     * Maps the 0.0 -> 1.0 progress to a frame index from 0 to (frames.length - 1).
     * Scrolling down increases progress -> steps forward.
     * Scrolling up decreases progress -> steps backward.
     */
    const targetIndex = Math.min(
      Math.max(Math.floor(progress * (frames.length - 1)), 0),
      frames.length - 1
    );

    // PERFORMANCE OPTIMIZATION: Only repaint when the frame index actually changes!
    if (targetIndex !== currentFrameIndex) {
      currentFrameIndex = targetIndex;
      drawCoverImage(frames[currentFrameIndex]);
    }

    // Update narrative overlay phrases based on progress milestones
    if (phrase1 && phrase2) {
      if (progress > 0.12 && progress < 0.45) {
        phrase1.classList.add('active');
      } else {
        phrase1.classList.remove('active');
      }

      if (progress > 0.55 && progress < 0.88) {
        phrase2.classList.add('active');
      } else {
        phrase2.classList.remove('active');
      }
    }

    // Fade out scroll hint once user starts actively scrolling
    if (scrollHint) {
      if (progress > 0.05) {
        scrollHint.style.opacity = '0';
      } else {
        scrollHint.style.opacity = '1';
      }
    }
  }

  // RequestAnimationFrame scheduler: guarantees max 60/120fps and never fires redundantly
  function onScroll() {
    if (!isRafScheduled) {
      isRafScheduled = true;
      requestAnimationFrame(() => {
        isRafScheduled = false;
        updateScrollFrame();
      });
    }
  }

  // --------------------------------------------------------------------------
  // PRELOADING LOGIC
  // --------------------------------------------------------------------------
  function preloadFrames() {
    // If reduced motion is requested, load only the initial static frame
    if (prefersReducedMotion) {
      const singleImg = new Image();
      singleImg.src = getFrameUrl(1);
      singleImg.onload = () => {
        frames.push(singleImg);
        resizeCanvas();
        drawCoverImage(singleImg);
        if (loadingOverlay) loadingOverlay.classList.add('loaded');
      };
      return;
    }

    // Determine frames to load (handles mobile stepping)
    const frameIndices = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += frameStep) {
      frameIndices.push(i);
    }

    const totalToLoad = frameIndices.length;

    frameIndices.forEach((frameNum, arrayIndex) => {
      const img = new Image();
      img.src = getFrameUrl(frameNum);

      img.onload = () => {
        loadedCount++;
        frames[arrayIndex] = img;

        // Update loading progress UI
        const percent = Math.round((loadedCount / totalToLoad) * 100);
        if (progressText) progressText.textContent = `${percent}%`;
        if (progressFill) progressFill.style.width = `${percent}%`;

        // When all required frames are ready
        if (loadedCount === totalToLoad) {
          onAllFramesLoaded();
        }
      };

      img.onerror = () => {
        // Graceful fallback if any frame fails
        loadedCount++;
        if (loadedCount === totalToLoad) {
          onAllFramesLoaded();
        }
      };
    });
  }

  function onAllFramesLoaded() {
    // Initial resize and render of frame 0
    resizeCanvas();
    currentFrameIndex = 0;
    drawCoverImage(frames[0]);

    // Smoothly fade out loading overlay
    if (loadingOverlay) {
      loadingOverlay.classList.add('loaded');
    }

    // Listen to scroll events
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    // Initial check in case user loaded the page scrolled down
    updateScrollFrame();
  }

  // Start preloading
  preloadFrames();
})();
