/* ==========================================================================
   PAVI — Case study page enhancements
   Line-by-line headline reveal on scroll (soft fade + slide), loaded
   in addition to main.js on every case-study-*.html page.
   ========================================================================== */

(() => {
  'use strict';

  // Wrap every direct text line of a .cs-headline into a reveal span
  // (skips headlines already pre-marked with .reveal-line in markup).
  function prepareHeadlines() {
    document.querySelectorAll('.cs-headline').forEach((h) => {
      if (h.querySelector('.reveal-line')) return; // already marked up
      const text = h.textContent.trim();
      h.innerHTML = `<span class="reveal-line"><span>${text}</span></span>`;
    });
  }

  function initHeadlineReveal() {
    prepareHeadlines();
    const headlines = document.querySelectorAll('.cs-headline');
    if (!headlines.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4, rootMargin: '0px 0px -10% 0px' });

    headlines.forEach((h) => io.observe(h));
  }

  // Generic fade-up reveal for case-study content blocks
  function initBlockReveal() {
    const blocks = document.querySelectorAll('.cs-reveal');
    if (!blocks.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    blocks.forEach((b) => io.observe(b));
  }

  // Scrollspy — highlights the .nav-link whose target section is currently
  // in view. Matches links (href="#id") to sections (id="id") automatically,
  // so any case study can opt in just by adding a .nav-links submenu with
  // anchors that point at real section ids.
  function initScrollspy() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (!navLinks.length) return;

    const targets = Array.prototype.slice.call(navLinks).reduce((map, link) => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section) map.push({ link, section });
      return map;
    }, []);
    if (!targets.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const match = targets.find((t) => t.section === entry.target);
        if (!match) return;
        navLinks.forEach((l) => l.classList.remove('is-active'));
        match.link.classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    targets.forEach((t) => io.observe(t.section));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeadlineReveal();
    initBlockReveal();
    initScrollspy();
  });
})();
