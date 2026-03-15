/**
 * script.js
 * Bali Yoga Retreat — Vanilla JS
 * No dependencies. Lightweight.
 */

"use strict";

/* ─── DOM REFERENCES ──────────────────────── */
const header    = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const navMenu   = document.getElementById("nav-menu");
const navLinks  = document.querySelectorAll(".nav__link");
const yearEl    = document.getElementById("footer-year");
const sections  = document.querySelectorAll("section[id]");

/* ─── CURRENT YEAR ────────────────────────── */
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ─── SCROLL: HEADER STATE ────────────────── */
function onScroll() {
  const scrolled = window.scrollY > 60;
  header.classList.toggle("scrolled", scrolled);
  updateActiveNav();
}

window.addEventListener("scroll", onScroll, { passive: true });

// Run once on load in case page is refreshed mid-scroll
onScroll();

/* ─── MOBILE NAVIGATION ───────────────────── */
function openMenu() {
  navMenu.classList.add("is-open");
  navToggle.classList.add("open");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  navMenu.classList.remove("is-open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function toggleMenu() {
  navMenu.classList.contains("is-open") ? closeMenu() : openMenu();
}

navToggle.addEventListener("click", toggleMenu);

// Close when a link is clicked
navLinks.forEach((link) => link.addEventListener("click", closeMenu));

// Close on outside click
document.addEventListener("click", (e) => {
  if (
    navMenu.classList.contains("is-open") &&
    !navMenu.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    closeMenu();
  }
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
    closeMenu();
    navToggle.focus();
  }
});

/* ─── ACTIVE NAV HIGHLIGHTING ─────────────── */
function updateActiveNav() {
  let current = "";

  sections.forEach((sec) => {
    const sectionTop = sec.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = sec.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${current}`);
  });
}

/* ─── SCROLL REVEAL ───────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
  }
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

/* ─── STAGGER GRID CHILDREN ───────────────── */
/**
 * When a grid enters the viewport, add incremental
 * transition delays to its child .reveal elements
 * so they cascade into view naturally.
 */
const staggerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const revealChildren = entry.target.querySelectorAll(".reveal");
      revealChildren.forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.09}s`;
      });

      staggerObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.05 }
);

document
  .querySelectorAll(".practices__grid, .benefits__list, .gallery__grid, .timeline")
  .forEach((grid) => staggerObserver.observe(grid));

/* ─── SMOOTH SCROLL (Safari fallback) ─────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const headerHeight = header ? header.offsetHeight : 72;
    const targetTop    = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top: targetTop, behavior: "smooth" });
  });
});
