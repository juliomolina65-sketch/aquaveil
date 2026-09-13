/* =============================================================================
   chrome.js — builds the announcement bar, header and footer on EVERY page.
   Nav lives in product.js under `nav`, so you edit it in one place.
   Load order on every page: product.js → chrome.js → (page-specific script)
   ============================================================================= */
(function () {
  "use strict";

  var S = window.STORE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* --------------------------------------------------------------- theme --- */
  document.documentElement.style.setProperty("--accent", S.brand.accent);
  document.documentElement.style.setProperty("--accent-dark", S.brand.accentDark);

  var href = function (h) {
    return h === "mailto:" ? "mailto:" + S.brand.email : h;
  };

  /* -------------------------------------------------------- announcement --- */
  (function () {
    var host = $("[data-site-announce]");
    if (!host || !S.announcements || !S.announcements.length) return;
    host.className = "announce";
    host.innerHTML = "<span></span>";
    var slot = $("span", host);
    var i = 0;
    var show = function () {
      slot.textContent = S.announcements[i % S.announcements.length];
      slot.style.animation = "none";
      void slot.offsetWidth;
      slot.style.animation = "";
      i++;
    };
    show();
    if (S.announcements.length > 1) setInterval(show, 4200);
  })();

  /* --------------------------------------------------------------- header --- */
  (function () {
    var host = $("[data-site-header]");
    if (!host) return;
    var nav = S.nav || { primary: [], cta: null };

    host.className = "header";
    host.id = "header";
    host.innerHTML =
      '<div class="wrap header__in">' +
        '<a class="logo" href="index.html">' + esc(S.brand.name) + "</a>" +
        '<nav class="nav">' +
          (nav.primary || [])
            .map(function (l) { return '<a href="' + esc(href(l.href)) + '">' + esc(l.label) + "</a>"; })
            .join("") +
        "</nav>" +
        '<div class="header__right">' +
          (nav.cta
            ? '<a class="btn btn--sm btn--primary" href="' + esc(href(nav.cta.href)) + '">' + esc(nav.cta.label) + "</a>"
            : "") +
          '<button class="menubtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobilenav">' +
            "<span></span><span></span><span></span>" +
          "</button>" +
        "</div>" +
      "</div>" +
      '<nav class="mobilenav" id="mobilenav" hidden>' +
        (nav.primary || [])
          .map(function (l) { return '<a href="' + esc(href(l.href)) + '">' + esc(l.label) + "</a>"; })
          .join("") +
        (nav.cta
          ? '<a class="btn btn--primary btn--block" href="' + esc(href(nav.cta.href)) + '">' + esc(nav.cta.label) + "</a>"
          : "") +
      "</nav>";

    var menuBtn = $(".menubtn", host);
    var mobileNav = $("#mobilenav", host);
    var setMenu = function (open) {
      mobileNav.hidden = !open;
      menuBtn.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    menuBtn.addEventListener("click", function () { setMenu(mobileNav.hidden); });
    $$("a", mobileNav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

    var onScroll = function () { host.classList.toggle("is-stuck", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* --------------------------------------------------------------- footer --- */
  (function () {
    var host = $("[data-site-footer]");
    if (!host) return;
    var cols = (S.nav && S.nav.footer) || [];

    host.className = "footer";
    host.innerHTML =
      '<div class="wrap footer__grid">' +
        '<div class="footer__brand">' +
          '<div class="logo logo--footer">' + esc(S.brand.name) + "</div>" +
          '<p class="footer__tag">' + esc(S.brand.tagline) + "</p>" +
          '<a class="footer__mail" href="mailto:' + esc(S.brand.email) + '">' + esc(S.brand.email) + "</a>" +
        "</div>" +
        cols
          .map(function (c) {
            return (
              '<div class="footer__col">' +
                "<h4>" + esc(c.heading) + "</h4>" +
                c.links
                  .map(function (l) { return '<a href="' + esc(href(l.href)) + '">' + esc(l.label) + "</a>"; })
                  .join("") +
              "</div>"
            );
          })
          .join("") +
      "</div>" +
      '<div class="wrap footer__legal">' +
        "<span>© " + new Date().getFullYear() + " " + esc(S.brand.name) + ". All rights reserved.</span>" +
        ((S.checkout && S.checkout.url) ? "" : "<span>Demo store — checkout is not live yet.</span>") +
      "</div>";
  })();

  /* ------------------------------------------------------------- reveals --- */
  // Shared across every page so content pages animate like the product page.
  //
  // IMPORTANT: page scripts (landing.js, main.js, pages.js) inject .reveal
  // elements AFTER this file runs. Anything created later would never be
  // observed and would sit at opacity:0 forever — invisible, with any lazy
  // images inside it never loading. So we scan on DOMContentLoaded (after
  // the page scripts have rendered) and expose a rescan for later additions.
  var io = null;

  // Opt in to the hidden-then-fade behaviour only when we can actually deliver
  // it. Without this class the CSS leaves everything visible.
  var canReveal = "IntersectionObserver" in window;
  if (canReveal) document.documentElement.classList.add("js-reveal");

  function revealAll() {
    document.documentElement.classList.remove("js-reveal");
  }

  // Failsafe: if NOTHING has revealed shortly after load, the observer isn't
  // firing (hidden tab, prerender, odd browser). Show everything rather than
  // leaving the visitor staring at a blank page.
  window.addEventListener("load", function () {
    setTimeout(function () {
      if (!document.querySelector(".reveal.is-in") && document.querySelector(".reveal")) {
        revealAll();
      }
    }, 1600);
  });

  function scanReveals() {
    var items = $$(".reveal:not([data-revealed])");
    if (!items.length) return;
    if (!canReveal) {
      items.forEach(function (i) { i.setAttribute("data-revealed", ""); });
      revealAll();
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
          });
        },
        { threshold: 0.12 }
      );
    }
    items.forEach(function (i, idx) {
      i.setAttribute("data-revealed", "");
      i.style.transitionDelay = (idx % 4) * 60 + "ms";
      io.observe(i);
    });
  }
  window.rescanReveals = scanReveals;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scanReveals);
  } else {
    scanReveals();
  }
  // Belt and braces: catch anything injected after load (e.g. images that
  // change layout, or a page script that renders asynchronously).
  window.addEventListener("load", scanReveals);
})();
