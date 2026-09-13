/* =============================================================================
   legal.js — hydrates the legal/policy pages from window.STORE.
   These pages have no product DOM, so they load THIS instead of main.js.
   ============================================================================= */
(function () {
  "use strict";

  var S = window.STORE || {};
  var brand = S.brand || {};

  var $$ = function (sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  };
  var setAll = function (attr, value) {
    $$("[" + attr + "]").forEach(function (n) { n.textContent = value; });
  };

  /* ------------------------------------------------------------- branding -- */
  if (brand.accent) document.documentElement.style.setProperty("--accent", brand.accent);
  if (brand.accentDark) document.documentElement.style.setProperty("--accent-dark", brand.accentDark);

  setAll("data-brand-name", brand.name || "");
  setAll("data-brand-tagline", brand.tagline || "");
  setAll("data-year", new Date().getFullYear());

  /* Email: fill the mailto href, and the label too if it's a placeholder slot. */
  $$("[data-brand-email]").forEach(function (n) {
    if (brand.email) n.href = "mailto:" + brand.email;
    if (n.hasAttribute("data-brand-email-text")) n.textContent = brand.email || "";
  });

  /* Title gets the brand name appended, matching main.js's pattern. */
  if (brand.name) {
    var base = document.title.replace(/\s+—\s+.*$/, "");
    document.title = base + " — " + brand.name;
  }

  /* --------------------------------------------------------------- header -- */
  var header = document.getElementById("header");
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScrollHeader, { passive: true });
    onScrollHeader();
  }

  /* --------------------------------------------------------------- reveals -- */
  (function () {
    var items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (i) { i.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (i) { io.observe(i); });
  })();
})();
