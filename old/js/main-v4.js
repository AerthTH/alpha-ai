// Alpha AI — V4 Two-tier Header
// Mobile navigation only. Hero remains fully responsive <img>.

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
  const stage = document.getElementById('stage');
  const items = [...document.querySelectorAll('[data-depth]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!stage || reduceMotion) return;

  let raf = null;

  function update() {
    const rect = stage.getBoundingClientRect();
    const viewport = window.innerHeight;
    const centerOffset = (rect.top + rect.height / 2) - viewport / 2;
    const normalized = Math.max(-1, Math.min(1, centerOffset / viewport));

    items.forEach((el) => {
      const depth = Number(el.dataset.depth || 0.2);
      const y = normalized * depth * -135;
      const x = normalized * depth * 24;
      const scale = 1 + (1 - Math.abs(normalized)) * depth * 0.025;

      const baseRotation = getBaseRotation(el);
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${baseRotation}deg)`;
    });

    raf = null;
  }

  function getBaseRotation(el) {
    if (el.classList.contains('card-left-back')) return -8;
    if (el.classList.contains('card-left-front')) return 6;
    if (el.classList.contains('card-right-front')) return 7;
    if (el.classList.contains('card-right-back')) return -7;
    return 0;
  }

  function requestUpdate() {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
})();
