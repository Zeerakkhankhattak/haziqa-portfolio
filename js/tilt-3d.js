/**
 * HAZIQA KHAN: 3D CARD TILT & PERSPECTIVE ENGINE
 * Adds hardware-accelerated 3D perspective tilt, specular reflection, and depth layers.
 */

(function init3DTilt() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return; // Skip 3D tilt on purely touch devices for battery optimization

  const tiltTargets = document.querySelectorAll('.project-card, .bento-card, .portrait-frame, .interactive-sample-card');

  tiltTargets.forEach(card => {
    // Create glare overlay
    const glare = document.createElement('div');
    glare.className = 'card-3d-glare';
    card.appendChild(glare);

    let bounds = null;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease-out';
      glare.style.opacity = '1';
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();

      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const halfWidth = bounds.width / 2;
      const halfHeight = bounds.height / 2;

      // Calculate tilt angles (degrees)
      const xAngle = -((mouseY - halfHeight) / halfHeight) * 10;
      const yAngle = ((mouseX - halfWidth) / halfWidth) * 10;

      card.style.transform = `perspective(1100px) rotateX(${xAngle.toFixed(2)}deg) rotateY(${yAngle.toFixed(2)}deg) translateZ(12px) scale3d(1.02, 1.02, 1.02)`;

      // Update glare position
      const glareX = (mouseX / bounds.width) * 100;
      const glareY = (mouseY / bounds.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(244, 114, 182, 0.08) 40%, transparent 80%)`;
    }

    function onMouseLeave() {
      bounds = null;
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
      card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
      glare.style.opacity = '0';
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
})();
