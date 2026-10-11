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
  window.setTimeout(() => pageLoader?.classList.add('is-done'), 650);
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


// Scroll Action Mode: turns the long page into a reactive mission sequence.
const actionSections = [...document.querySelectorAll('.action-section')];
const missionValue = document.querySelector('#scroll-mission-value');
const missionName = document.querySelector('#scroll-mission-name');
const missionBar = document.querySelector('.scroll-mission > i em');
const missionHud = document.querySelector('.scroll-mission');
const reticle = document.querySelector('.tactical-reticle');
const actionFlash = document.querySelector('.action-flash');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let scrollTicking = false;
let lastScrollY = window.scrollY;
let lastSection = '';
let flashTimer;

function triggerImpact(event) {
  if (prefersReducedMotion || !actionFlash) return;
  const velocity = Math.min(1, Math.abs(window.scrollY - lastScrollY) / 85);
  if (velocity < .42) return;
  const x = event?.clientX ?? window.innerWidth * .5;
  const y = event?.clientY ?? window.innerHeight * .55;
  actionFlash.style.setProperty('--impact-x', `${x}px`);
  actionFlash.style.setProperty('--impact-y', `${y}px`);
  actionFlash.classList.remove('is-hit');
  if (velocity > .72) {
    document.body.classList.add('action-hit');
    reticle?.classList.add('is-locking');
    actionFlash.classList.add('is-heavy');
  }
  window.clearTimeout(flashTimer);
  requestAnimationFrame(() => actionFlash.classList.add('is-hit'));
  flashTimer = window.setTimeout(() => {
    actionFlash.classList.remove('is-hit', 'is-heavy');
    document.body.classList.remove('action-hit');
    reticle?.classList.remove('is-locking');
  }, velocity > .72 ? 720 : 560);
}

function updateActionScene() {
  const y = window.scrollY;
  const center = y + window.innerHeight * .48;
  let active = actionSections[0];
  actionSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + y;
    const distance = Math.abs(center - (sectionTop + rect.height * .38));
    if (!active || distance < Math.abs(center - (active.offsetTop + active.offsetHeight * .38))) active = section;
    const progress = Math.max(-1, Math.min(1, (center - sectionTop) / Math.max(rect.height, 1) - .35));
    if (!prefersReducedMotion) {
      section.style.setProperty('--scroll-shift', `${progress * -12}px`);
      section.style.setProperty('--section-scale', `${1 - Math.abs(progress) * .012}`);
      section.style.setProperty('--section-x', `${progress * 18}`);
    }
  });
  if (active) {
    const id = active.dataset.mission;
    if (id !== lastSection) {
      lastSection = id;
      missionHud?.classList.remove('is-changing');
      requestAnimationFrame(() => missionHud?.classList.add('is-changing'));
      missionValue && (missionValue.textContent = id);
      missionName && (missionName.textContent = active.dataset.missionName);
      active.classList.add('is-current');
      document.querySelectorAll('.action-section').forEach((section) => { if (section !== active) section.classList.remove('is-current'); });
      active.querySelector('.intel-cards')?.classList.add('is-live');
      active.querySelector('.creator-photo-wrap')?.classList.add('is-live');
    }
    missionBar && (missionBar.style.width = `${Math.max(20, Number(id) * 20)}%`);
  }
  const viewport = window.innerHeight;
  document.querySelectorAll('.screens .shot').forEach((shot, index) => {
    if (prefersReducedMotion) return;
    const rect = shot.getBoundingClientRect();
    const offset = (rect.top + rect.height / 2 - viewport / 2) / viewport;
    shot.style.setProperty('--shot-shift', `${Math.max(-12, Math.min(12, offset * (index % 2 ? 7 : -5)))}px`);
  });
  reticle?.style.setProperty('rotate', `${(y * .05) % 360}deg`);
  lastScrollY = y;
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  triggerImpact();
  if (!scrollTicking) {
    window.requestAnimationFrame(updateActionScene);
    scrollTicking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateActionScene, { passive: true });
updateActionScene();

// A deliberate click impact makes all primary controls feel like mission controls.
document.querySelectorAll('.button-primary, .nav-cta, .text-link').forEach((control) => {
  control.addEventListener('pointerdown', (event) => triggerImpact(event));
});


// Heavy scroll choreography: replay the entrance animation every time a mission section is entered.
let previousSection = null;
let heavyFlashTimer;
function heavySectionImpact(section, direction = 1) {
  if (!section || prefersReducedMotion) return;
  document.body.classList.remove('action-hit');
  section.classList.remove('is-entering');
  reticle?.classList.remove('is-locking');
  actionFlash?.classList.remove('is-heavy');
  requestAnimationFrame(() => {
    document.body.classList.add('action-hit');
    section.classList.add('is-entering');
    reticle?.classList.add('is-locking');
    if (actionFlash) {
      actionFlash.style.setProperty('--impact-x', direction > 0 ? '72%' : '28%');
      actionFlash.style.setProperty('--impact-y', '48%');
      actionFlash.classList.add('is-heavy');
    }
    window.clearTimeout(heavyFlashTimer);
    heavyFlashTimer = window.setTimeout(() => {
      document.body.classList.remove('action-hit');
      section.classList.remove('is-entering');
      reticle?.classList.remove('is-locking');
      actionFlash?.classList.remove('is-heavy');
    }, 920);
  });
}
const heavyObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.intersectionRatio < .32) return;
    const section = entry.target;
    const current = section.dataset.mission;
    if (current !== previousSection) {
      const direction = Number(current || 1) >= Number(previousSection || 0) ? 1 : -1;
      previousSection = current;
      heavySectionImpact(section, direction);
    }
  });
}, { threshold: [.32, .58] }) : null;
if (heavyObserver) actionSections.forEach((section) => heavyObserver.observe(section));
