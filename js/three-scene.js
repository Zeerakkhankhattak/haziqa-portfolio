/**
 * HAZIQA KHAN: 3D INTERACTIVE WEBGL SCENE
 * Hardware-accelerated Three.js sculpture with mouse tracking, dynamic lighting, and touch/drag controls.
 */

(function init3DHeroScene() {
  const container = document.getElementById('hero-3d-container');
  const canvas = document.getElementById('hero-3d-canvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();

  const width = container.clientWidth || 360;
  const height = container.clientHeight || 360;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 6.2;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Geometry & Materials: Ethereal Metallic Torus Knot
  const geometry = new THREE.TorusKnotGeometry(1.5, 0.42, 140, 32, 2, 3);

  const material = new THREE.MeshStandardMaterial({
    color: 0x1c0f2a,
    metalness: 0.88,
    roughness: 0.22,
    wireframe: false
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Orbiting Particle Cloud
  const particleCount = 70;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 8;
    particlePositions[i + 1] = (Math.random() - 0.5) * 8;
    particlePositions[i + 2] = (Math.random() - 0.5) * 6;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xf472b6,
    size: 0.055,
    transparent: true,
    opacity: 0.65
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 3. Dynamic Studio Lighting
  const ambientLight = new THREE.AmbientLight(0x2d1744, 1.2);
  scene.add(ambientLight);

  const pinkLight = new THREE.PointLight(0xf472b6, 3.8, 18);
  pinkLight.position.set(4, 3, 4);
  scene.add(pinkLight);

  const purpleLight = new THREE.PointLight(0xc084fc, 3.2, 18);
  purpleLight.position.set(-4, -2.5, 3);
  scene.add(purpleLight);

  const rimLight = new THREE.PointLight(0xfbcfe8, 2.0, 15);
  rimLight.position.set(0, 4, -3);
  scene.add(rimLight);

  // 4. Mouse & Drag Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let dragVelocityX = 0;
  let dragVelocityY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    if (!isDragging) {
      targetRotationY = mouseX * 0.85;
      targetRotationX = -mouseY * 0.65;
    }
  });

  // Drag-to-spin controls on canvas
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
    dragVelocityX = 0;
    dragVelocityY = 0;
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;

    dragVelocityX = deltaX * 0.008;
    dragVelocityY = deltaY * 0.008;

    mesh.rotation.y += dragVelocityX;
    mesh.rotation.x += dragVelocityY;
  });

  // Touch controls
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMouseX;
    const deltaY = e.touches[0].clientY - prevMouseY;
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;

    mesh.rotation.y += deltaX * 0.01;
    mesh.rotation.x += deltaY * 0.01;
  }, { passive: true });

  // 5. Resize Observer
  function handleResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  const resizeObserver = new ResizeObserver(() => handleResize());
  resizeObserver.observe(container);

  // 6. Viewport Visibility Management (Pause when out of view)
  let isVisible = true;
  const intersectionObserver = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.05 });
  intersectionObserver.observe(container);

  // 7. Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Constant subtle ambient rotation
    mesh.rotation.z += 0.003;

    if (!isDragging) {
      // Smooth lerp toward mouse targets
      mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.045;
      mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.045;
    } else {
      // Momentum dampening
      mesh.rotation.y += dragVelocityX;
      mesh.rotation.x += dragVelocityY;
      dragVelocityX *= 0.94;
      dragVelocityY *= 0.94;
    }

    // Gentle floating particle animation
    particleSystem.rotation.y = elapsedTime * 0.04;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.15) * 0.1;

    // Moving colored light positions
    pinkLight.position.x = Math.sin(elapsedTime * 0.8) * 4.5;
    pinkLight.position.y = Math.cos(elapsedTime * 0.6) * 3.5;

    purpleLight.position.x = -Math.sin(elapsedTime * 0.7) * 4.5;
    purpleLight.position.y = -Math.cos(elapsedTime * 0.5) * 3.5;

    renderer.render(scene, camera);
  }

  animate();
})();
