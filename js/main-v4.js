// Alpha AI — unified navigation + showcase marquee

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
  if (!menuToggle || !navLinks) return;
  navLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

(() => {
  const showcase = document.getElementById('showcase');
  const viewport = document.querySelector('.mobile-card-viewport');
  const strip = document.getElementById('mobileCardStrip');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!showcase || !viewport || !strip || reducedMotion) return;

  const originalMarkup = strip.innerHTML;
  let frame = 0;
  let lastTime = 0;
  let offset = 0;
  let loopWidth = 0;
  let active = false;
  let prepared = false;
  let pausedByUser = false;

  function currentSpeed() {
    return window.innerWidth <= 760 ? 0.034 : 0.028;
  }

  function resetTrack() {
    strip.innerHTML = originalMarkup;
    strip.style.transform = 'translate3d(0,0,0)';
    offset = 0;
    loopWidth = 0;
    prepared = false;
  }

  function prepareTrack() {
    if (prepared) return;
    strip.innerHTML = originalMarkup + originalMarkup;
    prepared = true;
    requestAnimationFrame(() => {
      loopWidth = strip.scrollWidth / 2;
    });
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  }

  function animate(time) {
    if (!active || pausedByUser) {
      stop();
      return;
    }

    if (!prepared) prepareTrack();
    if (!loopWidth) loopWidth = strip.scrollWidth / 2;
    if (!loopWidth) {
      stop();
      return;
    }

    if (!lastTime) lastTime = time;
    const delta = time - lastTime;
    lastTime = time;

    offset += delta * currentSpeed();
    if (offset >= loopWidth) offset = 0;

    strip.style.transform = `translate3d(${-offset}px, 0, 0)`;
    frame = requestAnimationFrame(animate);
  }

  function start() {
    if (frame || !active || pausedByUser) return;
    prepareTrack();
    frame = requestAnimationFrame(animate);
  }

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    active = Boolean(entry && entry.isIntersecting);
    if (active) start();
    else stop();
  }, { threshold: 0.2 });

  observer.observe(showcase);

  function pause() {
    pausedByUser = true;
    stop();
  }

  function resume() {
    pausedByUser = false;
    start();
  }

  viewport.addEventListener('pointerdown', pause, { passive: true });
  viewport.addEventListener('mouseenter', pause);
  viewport.addEventListener('pointerup', resume, { passive: true });
  viewport.addEventListener('pointerleave', resume);
  viewport.addEventListener('touchstart', pause, { passive: true });
  viewport.addEventListener('touchend', resume, { passive: true });

  window.addEventListener('resize', () => {
    stop();
    resetTrack();
    prepareTrack();
    if (active && !pausedByUser) start();
  });

  prepareTrack();
})();
