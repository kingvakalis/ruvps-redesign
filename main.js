/**
 * RuVPS — Premium Redesign
 * Main JavaScript: Three.js hero, GSAP animations, interactions
 */

import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   THREE.JS HERO SCENE
═══════════════════════════════════════════════════════ */
function initThreeScene() {
  const container = document.getElementById('hero-canvas');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // ── Wireframe Icosphere ──────────────────────────────
  const geo = new THREE.IcosahedronGeometry(2, 2);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x0088ff,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const sphere = new THREE.Mesh(geo, mat);
  scene.add(sphere);

  // ── Particles ────────────────────────────────────────
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x0088ff,
    size: 1.5,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
  });
  const particlesMesh = new THREE.Points(particleGeo, particleMat);
  scene.add(particlesMesh);

  // ── Secondary smaller particles (accent cyan) ────────
  const particleCount2 = 80;
  const positions2 = new Float32Array(particleCount2 * 3);
  for (let i = 0; i < particleCount2 * 3; i++) {
    positions2[i] = (Math.random() - 0.5) * 14;
  }
  const particleGeo2 = new THREE.BufferGeometry();
  particleGeo2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
  const particleMat2 = new THREE.PointsMaterial({
    color: 0x00c8ff,
    size: 0.8,
    transparent: true,
    opacity: 0.25,
    sizeAttenuation: true,
  });
  const particles2 = new THREE.Points(particleGeo2, particleMat2);
  scene.add(particles2);

  // ── Mouse parallax ───────────────────────────────────
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Animate ──────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.03;
    targetY += (mouseY - targetY) * 0.03;

    sphere.rotation.y += 0.002;
    sphere.rotation.x += 0.001;
    sphere.rotation.y += targetX * 0.003;
    sphere.rotation.x += targetY * 0.003;

    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    particles2.rotation.y -= 0.0003;
    particles2.rotation.z += 0.0001;

    renderer.render(scene, camera);
  }
  animate();

  // ── Resize ───────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Fade in ──────────────────────────────────────────
  renderer.domElement.style.opacity = '0';
  renderer.domElement.style.transition = 'opacity 1.2s ease';
  requestAnimationFrame(() => {
    renderer.domElement.style.opacity = '1';
  });
}

/* ═══════════════════════════════════════════════════════
   NAVBAR SCROLL BEHAVIOR
═══════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

/* ═══════════════════════════════════════════════════════
   GSAP SCROLL ANIMATIONS
═══════════════════════════════════════════════════════ */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // ── Generic .reveal elements ─────────────────────────
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // ── Stagger grids ────────────────────────────────────
  document.querySelectorAll('.stagger-grid').forEach(grid => {
    gsap.from(Array.from(grid.children), {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // ── Features grid cards (individual) ─────────────────
  const featuresGrid = document.querySelector('.features-grid');
  if (featuresGrid) {
    gsap.from(featuresGrid.querySelectorAll('.feature-card'), {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: featuresGrid,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }

  // ── Hero content stagger ─────────────────────────────
  const heroEls = document.querySelectorAll('.hero-content .reveal');
  heroEls.forEach((el, i) => {
    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.3 + i * 0.15,
      ease: 'power2.out',
    });
  });

  // ── Counter animations ───────────────────────────────
  const counterEls = document.querySelectorAll('[data-counter]');
  counterEls.forEach(el => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const decimal = parseInt(el.dataset.decimal || '0');

    gsap.to(
      { val: 0 },
      {
        val: target,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: function () {
          const v = this.targets()[0].val;
          el.textContent = (decimal > 0 ? v.toFixed(decimal) : Math.floor(v)) + suffix;
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // ── Section heading parallax ─────────────────────────
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // ── Product cards tilt ───────────────────────────────
  initCardTilt();

  // ── Navbar link underline on section enter ───────────
  initActiveNav();
}

/* ═══════════════════════════════════════════════════════
   3D CARD TILT ON HOVER
═══════════════════════════════════════════════════════ */
function initCardTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      const rotateY = deltaX * 4;
      const rotateX = -deltaY * 4;

      card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
    });
  });
}

/* ═══════════════════════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL
═══════════════════════════════════════════════════════ */
function initActiveNav() {
  const sections = ['hero', 'products', 'features', 'transfer', 'cta'];
  const navLinks = document.querySelectorAll('.nav-link');

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveNavLink(id),
      onEnterBack: () => setActiveNavLink(id),
    });
  });

  function setActiveNavLink(id) {
    navLinks.forEach(link => {
      link.style.color = '';
    });
    // match href-ish
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.style.color = '#0088FF';
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════
   MIGRATION DOT JS (more precise arc path)
═══════════════════════════════════════════════════════ */
function initMigrationDot() {
  // The CSS animation handles the dot — just ensure the trail particles are synced
  // We enhance by re-timing trail particles to mirror the dot position
  const dot = document.getElementById('migrationDot');
  const trail = document.getElementById('particleTrail');
  if (!dot || !trail) return;

  // Trail particles follow the dot with a delay
  // Already handled by CSS animation-delay on .trail-particle
}

/* ═══════════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLLING WITH OFFSET (for sticky nav)
═══════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════════════════
   PERFORMANCE: Pause Three.js when tab hidden
═══════════════════════════════════════════════════════ */
let isVisible = true;
document.addEventListener('visibilitychange', () => {
  isVisible = !document.hidden;
});

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initThreeScene();
  initNavbar();
  initGSAP();
  initMigrationDot();
  initSmoothScroll();

  // Subtle bg noise / grain layer via canvas (optional premium touch)
  initGrainEffect();
});

/* ═══════════════════════════════════════════════════════
   OPTIONAL: Subtle animated grain/noise overlay
   (Adds premium feel — very subtle, dark)
═══════════════════════════════════════════════════════ */
function initGrainEffect() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.025;
    mix-blend-mode: overlay;
  `;

  const ctx = canvas.getContext('2d');

  function generateNoise() {
    const imageData = ctx.createImageData(256, 256);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.floor(Math.random() * 255);
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  generateNoise();
  document.body.appendChild(canvas);

  // Animate grain
  let frameCount = 0;
  function animateGrain() {
    requestAnimationFrame(animateGrain);
    frameCount++;
    if (frameCount % 3 === 0) {
      generateNoise();
    }
  }
  animateGrain();
}
