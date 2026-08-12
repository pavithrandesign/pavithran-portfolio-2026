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

  document.addEventListener('DOMContentLoaded', () => {
    initHeadlineReveal();
    initBlockReveal();
  });
})();
