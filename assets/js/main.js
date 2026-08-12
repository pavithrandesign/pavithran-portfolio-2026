/* ==========================================================================
   PAVI — Shared interaction engine
   Cursor, magnetic buttons, featured-work reveal + tilt, role rotators,
   count-up numbers, nav scroll behavior, copy-to-clipboard.
   Loaded on every page. Case-study-only scroll reveal lives in case-study.js.
   ========================================================================== */

(() => {
  'use strict';

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * 1. Custom cursor — concentric dot + outline ring
   * ------------------------------------------------------------------ */
  function initCursor() {
    if (!isFinePointer) return;

    document.body.classList.add('has-custom-cursor');

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    });

    document.addEventListener('mouseleave', () => {
      dot.classList.add('is-hidden');
      ring.classList.add('is-hidden');
    });

    function tick() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    const hoverTargets = 'a, button, .featured-work, input, textarea, [data-cursor-hover]';
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(hoverTargets);
      if (!target) return;
      ring.classList.add('is-hovering');
      if (target.closest('[data-cursor-dark]')) {
        ring.classList.add('is-dark');
        dot.classList.add('is-dark');
      }
    });
    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(hoverTargets);
      if (!target) return;
      ring.classList.remove('is-hovering', 'is-dark');
      dot.classList.remove('is-dark');
    });
  }

  /* ------------------------------------------------------------------ *
   * 2. Magnetic buttons — pull toward cursor within bounds
   * ------------------------------------------------------------------ */
  function initMagnetic() {
    if (!isFinePointer || prefersReducedMotion) return;
    const els = document.querySelectorAll('[data-magnetic]');
    const strength = 0.35;

    els.forEach((el) => {
      let bounds;
      el.addEventListener('mouseenter', () => {
        bounds = el.getBoundingClientRect();
      });
      el.addEventListener('mousemove', (e) => {
        if (!bounds) bounds = el.getBoundingClientRect();
        const relX = e.clientX - bounds.left - bounds.width / 2;
        const relY = e.clientY - bounds.top - bounds.height / 2;
        el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 3. Nav scroll behavior — background on scroll, hide on scroll down
   * ------------------------------------------------------------------ */
  function initNav() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    let lastY = window.scrollY;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 8);
      if (y > lastY && y > 160) {
        nav.classList.add('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
      lastY = y;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * 4. Hero + headline mask-reveal on load
   * ------------------------------------------------------------------ */
  function initHeroReveal() {
    const ready = () => document.documentElement.classList.add('is-loaded');
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(ready).catch(ready);
      setTimeout(ready, 600); // safety fallback
    } else {
      window.addEventListener('load', ready);
    }
  }

  /* ------------------------------------------------------------------ *
   * 5. Featured Work — entrance reveal + subtle tilt (no bento grid)
   *    There can be more than one .featured-work card stacked on the
   *    homepage — each gets its own independent observer/tilt.
   * ------------------------------------------------------------------ */
  function initFeaturedWork() {
    const cards = document.querySelectorAll('.featured-work');
    if (!cards.length) return;

    cards.forEach((card, i) => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            card.classList.add('is-visible');
            io.disconnect();
          }
        });
      }, { threshold: 0.15 });
      io.observe(card);
      card.style.transitionDelay = `${i * 0.08}s`;

      if (!isFinePointer || prefersReducedMotion) return;
      let raf = null;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(1400px) rotateX(${(-py * 2.5).toFixed(2)}deg) rotateY(${(px * 2.5).toFixed(2)}deg)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = card.classList.contains('is-visible') ? 'translateY(0)' : '';
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 6. Role rotators — hero "what I do".
   *    Every .role-rotator found in the document gets its own independent cycle.
   * ------------------------------------------------------------------ */
  function initRoleRotators(scope) {
    const rotators = (scope || document).querySelectorAll('.role-rotator');
    rotators.forEach((rotator) => {
      const spans = [...rotator.querySelectorAll('span')];
      if (spans.length < 2) return;
      let i = 0;
      setInterval(() => {
        const current = spans[i];
        const next = spans[(i + 1) % spans.length];
        current.classList.add('is-exiting');
        current.classList.remove('is-active');
        next.classList.add('is-active');
        setTimeout(() => current.classList.remove('is-exiting'), 750);
        i = (i + 1) % spans.length;
      }, 3800);
    });
  }

  /* ------------------------------------------------------------------ *
   * 7. Count-up numbers on scroll into view
   * ------------------------------------------------------------------ */
  function initCountUp(scope) {
    const nums = (scope || document).querySelectorAll('[data-count-to]');
    if (!nums.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.countTo);
        const suffix = el.dataset.suffix || '';
        const isDecimal = String(target).includes('.');
        const duration = 1400;
        const start = performance.now();
        function frame(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = target * eased;
          el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
          if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    nums.forEach((n) => io.observe(n));
  }

  /* ------------------------------------------------------------------ *
   * 8. Copy-to-clipboard (contact section)
   * ------------------------------------------------------------------ */
  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const value = btn.dataset.copy;
        try {
          await navigator.clipboard.writeText(value);
        } catch (err) {
          const ta = document.createElement('textarea');
          ta.value = value;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        const label = btn.querySelector('.copy-btn') || btn;
        const original = label.textContent;
        label.textContent = 'Copied';
        label.classList.add('is-copied');
        setTimeout(() => {
          label.textContent = original;
          label.classList.remove('is-copied');
        }, 1600);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initHeroReveal();
    initCursor();
    initMagnetic();
    initNav();
    initFeaturedWork();
    initRoleRotators(document);
    initCopyButtons();
    initCountUp(document); // case study stat rows
  });
})();
