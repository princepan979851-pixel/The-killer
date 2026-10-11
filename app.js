const screenshots = [
  { src: 'assets/gameplay-01.jpg', alt: 'War Killer screenshot showing a soldier entering a red combat zone', title: 'Approach / Red Sector', meta: 'CAM_01 — HP 52 / 100' },
  { src: 'assets/gameplay-02.jpg', alt: 'War Killer screenshot showing a firefight near shipping containers', title: 'Contact / First Fire', meta: 'CAM_02 — HP 68 / 100' },
  { src: 'assets/gameplay-03.jpg', alt: 'War Killer screenshot showing multiple enemies in the distance', title: 'Threat / Multiple Targets', meta: 'CAM_03 — SQUAD CONTACT' },
  { src: 'assets/gameplay-04.jpg', alt: 'War Killer screenshot showing a soldier crossing open red terrain', title: 'Clear / Last Stand', meta: 'CAM_04 — HP 100 / 100' }
];

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
const lightboxMeta = document.querySelector('#lightbox-meta');
const lightboxCount = document.querySelector('#lightbox-count');
let activeIndex = 0;
let lastFocusedElement = null;

function renderLightbox(index) {
  activeIndex = (index + screenshots.length) % screenshots.length;
  const shot = screenshots[activeIndex];
  lightboxImage.src = shot.src;
  lightboxImage.alt = shot.alt;
  lightboxTitle.textContent = shot.title;
  lightboxMeta.textContent = shot.meta;
  lightboxCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(screenshots.length).padStart(2, '0')}`;
}
function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  renderLightbox(index);
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close').focus();
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocusedElement?.focus();
}

document.querySelectorAll('.shot').forEach((shot) => {
  shot.addEventListener('click', () => openLightbox(Number(shot.dataset.index)));
});
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev')?.addEventListener('click', () => renderLightbox(activeIndex - 1));
document.querySelector('.lightbox-next')?.addEventListener('click', () => renderLightbox(activeIndex + 1));
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') renderLightbox(activeIndex - 1);
  if (event.key === 'ArrowRight') renderLightbox(activeIndex + 1);
});

const heroProof = document.querySelector('.hero-proof');
if (heroProof && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    heroProof.style.transform = `rotate(4deg) translate(${x * 5}px, ${y * 4}px)`;
  }, { passive: true });
}

// Keep external CTAs explicit and analytics-free: the supplied URLs are the source of truth.
document.querySelectorAll('a[href^="https://play.google.com"], a[href^="https://www.instagram.com"]').forEach((link) => {
  link.addEventListener('click', () => link.setAttribute('aria-label', `${link.textContent.trim()} — opens in a new tab`));
});


// Cinematic entry, scroll telemetry and pointer feedback keep the page alive without adding assets.
const pageLoader = document.querySelector('#page-loader');
window.addEventListener('load', () => {
  window.setTimeout(() => { pageLoader?.classList.add('is-done'); document.body.classList.add('is-ready'); }, 650);
});

const progressBar = document.querySelector('.scroll-progress i');
const updateScrollProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const missionClock = document.querySelector('#mission-clock');
const bootTime = Date.now();
const updateMissionClock = () => {
  if (!missionClock) return;
  const elapsed = Math.floor((Date.now() - bootTime) / 1000);
  const hh = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  missionClock.textContent = `${hh}:${mm}:${ss}`;
};
window.setInterval(updateMissionClock, 1000);
updateMissionClock();

const cursorOrb = document.querySelector('.cursor-orb');
if (cursorOrb && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursorOrb.classList.add('is-active');
    cursorOrb.style.left = `${event.clientX}px`;
    cursorOrb.style.top = `${event.clientY}px`;
  }, { passive: true });
  document.querySelectorAll('a, button').forEach((interactive) => {
    interactive.addEventListener('mouseenter', () => cursorOrb.classList.add('is-hover'));
    interactive.addEventListener('mouseleave', () => cursorOrb.classList.remove('is-hover'));
  });
}

document.querySelectorAll('.shot').forEach((shot) => {
  shot.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = shot.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - .5) * -4;
    const rotateY = ((event.clientX - rect.left) / rect.width - .5) * 5;
    shot.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  shot.addEventListener('pointerleave', () => { shot.style.transform = ''; });
});


// Smooth cinematic scroll: one lerped loop drives parallax, HUD and ticker. Only transform/opacity are animated.
const actionSections = [...document.querySelectorAll('.action-section')];
const missionValue = document.querySelector('#scroll-mission-value');
const missionName = document.querySelector('#scroll-mission-name');
const missionBar = document.querySelector('.scroll-mission > i em');
const missionHud = document.querySelector('.scroll-mission');
const reticle = document.querySelector('.tactical-reticle');
const ticker = document.querySelector('.signal-ticker');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Parallax layers: [element, strength]. Positive strength moves slower than the page.
const layers = [
  ['.hero-proof', -.07], ['.hero-hud.hud-a', .05], ['.hero-hud.hud-b', -.04], ['.hero-hud.hud-c', .06],
  ['.proof-stamp', .09], ['.creator-photo-wrap', -.05], ['.creator-copy', .03],
  ['.final-crosshair', -.08], ['.screens .shot:nth-child(2)', -.045], ['.screens .shot:nth-child(3)', .04]
].map(([selector, strength]) => [document.querySelector(selector), strength]).filter(([el]) => el);

let currentY = window.scrollY;
let targetY = window.scrollY;
let velocity = 0;
let rafId = 0;
let lastSection = '';

function updateActiveSection() {
  const center = targetY + window.innerHeight * .5;
  let active = actionSections[0];
  let best = Infinity;
  actionSections.forEach((section) => {
    const top = section.offsetTop;
    const distance = center < top ? top - center : Math.max(0, center - (top + section.offsetHeight));
    if (distance < best) { best = distance; active = section; }
  });
  if (!active || active.dataset.mission === lastSection) return;
  lastSection = active.dataset.mission;
  missionHud?.classList.remove('is-changing');
  requestAnimationFrame(() => missionHud?.classList.add('is-changing'));
  if (missionValue) missionValue.textContent = lastSection;
  if (missionName) missionName.textContent = active.dataset.missionName;
  if (missionBar) missionBar.style.width = `${Math.max(20, Number(lastSection) * 20)}%`;
  actionSections.forEach((section) => section.classList.toggle('is-current', section === active));
  active.querySelector('.intel-cards')?.classList.add('is-live');
  active.querySelector('.creator-photo-wrap')?.classList.add('is-live');
}

function frame() {
  targetY = window.scrollY;
  const delta = targetY - currentY;
  currentY += delta * .12;
  velocity += (delta - velocity) * .2;
  const vh = window.innerHeight;
  if (!reduceMotion) {
    layers.forEach(([el, strength]) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const offset = (rect.top + rect.height / 2 - vh / 2);
      el.style.translate = `0 ${(offset * strength).toFixed(1)}px`;
    });
    if (ticker) ticker.style.setProperty('--ticker-skew', `${Math.max(-4, Math.min(4, velocity * .06)).toFixed(2)}deg`);
    reticle?.style.setProperty('rotate', `${(currentY * .05) % 360}deg`);
  }
  updateActiveSection();
  rafId = (Math.abs(delta) > .3 || Math.abs(velocity) > .3) ? requestAnimationFrame(frame) : 0;
}
function kick() { if (!rafId) rafId = requestAnimationFrame(frame); }
window.addEventListener('scroll', kick, { passive: true });
window.addEventListener('resize', kick, { passive: true });
kick();

// Soft magnetic pull on primary buttons (mouse only).
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.button-primary, .nav-cta').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .14;
      const y = (event.clientY - rect.top - rect.height / 2) * .22;
      button.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
    button.addEventListener('pointerleave', () => { button.style.translate = ''; });
  });
}

window.setTimeout(() => { pageLoader?.classList.add('is-done'); document.body.classList.add('is-ready'); }, 4000);
