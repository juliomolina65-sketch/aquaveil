/* =============================================================================
   pages.js — one script for the four support pages. Each block no-ops unless
   that page's markup is present, so the same file serves all of them.
     shop.html · track.html · faq.html · install.html · filters.html
   ============================================================================= */
(function () {
  "use strict";

  var S = window.STORE;
  var P = S.product;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var money = function (n) { return P.currencySymbol + n.toFixed(2).replace(/\.00$/, ""); };

  var pageTitle = function (t) { document.title = t + " — " + S.brand.name; };

  /* ------------------------------------------------------------- catalog --- */
  (function () {
    var host = $("[data-catalog]");
    if (!host) return;
    pageTitle("Shop all");
    host.innerHTML = (S.catalog || [])
      .map(function (p) {
        return (
          '<a class="cat__item reveal" id="' + esc(p.id) + '" href="' + esc(p.href) + '">' +
            '<div class="cat__media">' +
              (p.badge ? '<span class="cat__badge">' + esc(p.badge) + "</span>" : "") +
              '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" />' +
            "</div>" +
            '<div class="cat__body">' +
              "<h3>" + esc(p.name) + "</h3>" +
              "<p>" + esc(p.blurb) + "</p>" +
              '<div class="cat__price"><strong>' + money(p.price) + "</strong>" +
                (p.compareAt ? "<s>" + money(p.compareAt) + "</s>" : "") +
              "</div>" +
            "</div>" +
          "</a>"
        );
      })
      .join("");
  })();

  /* --------------------------------------------------------------- track --- */
  (function () {
    var form = $("[data-track-form]");
    if (!form) return;
    pageTitle("Track my order");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // No order system connected yet — say so plainly rather than fake a status.
      $("[data-track-out]").innerHTML =
        "Order lookup isn't connected yet. Once checkout is live this will query " +
        "your store's order system directly. In the meantime, email " +
        '<a href="mailto:' + esc(S.brand.email) + '">' + esc(S.brand.email) + "</a> " +
        "with your order number and we'll look it up by hand.";
      $("[data-track-out]").classList.add("is-shown");
      console.info("[track] Wire this to your order provider (Shopify Admin API or Stripe) when checkout is live.");
    });
  })();

  /* ----------------------------------------------------------------- faq --- */
  (function () {
    var host = $("[data-faq]");
    if (!host) return;
    pageTitle("FAQs");
    (S.faq || []).forEach(function (f) {
      var item = document.createElement("div");
      item.className = "faq__item";
      item.innerHTML =
        '<button class="faq__q" type="button" aria-expanded="false">' + esc(f.q) + "</button>" +
        '<div class="faq__a"><p>' + esc(f.a) + "</p></div>";
      var q = $(".faq__q", item);
      var a = $(".faq__a", item);
      q.addEventListener("click", function () {
        var open = item.classList.toggle("is-open");
        q.setAttribute("aria-expanded", String(open));
        a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
        $$(".faq__item", host).forEach(function (o) {
          if (o !== item && o.classList.contains("is-open")) {
            o.classList.remove("is-open");
            $(".faq__q", o).setAttribute("aria-expanded", "false");
            $(".faq__a", o).style.maxHeight = "0px";
          }
        });
      });
      host.appendChild(item);
    });
  })();

  /* --------------------------------------------------------------- legal --- */
  // One renderer for all four policy pages. Which one it builds comes from the
  // data-legal attribute on the page, so they stay in a single config block.
  (function () {
    var host = $("[data-legal]");
    if (!host) return;
    var which = host.getAttribute("data-legal");
    var L = S.legal || {};
    var doc = L[which];
    if (!doc) { host.innerHTML = "<p>Policy not configured.</p>"; return; }

    var co = L.company || {};
    pageTitle(doc.title);
    $("[data-legal-title]").textContent = doc.title;
    $("[data-legal-intro]").textContent = doc.intro || "";
    $("[data-legal-meta]").textContent =
      co.legalName + (co.tradingAs ? " (trading as " + co.tradingAs + ")" : "") +
      " · Last updated " + co.lastUpdated;

    host.innerHTML = (doc.sections || [])
      .map(function (s) {
        return (
          '<section class="legal__s">' +
            "<h2>" + esc(s.h) + "</h2>" +
            (s.p || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") +
          "</section>"
        );
      })
      .join("");

    $("[data-legal-foot]").innerHTML =
      "<h2>Contact</h2>" +
      "<p>Questions about this policy? Email <a href='mailto:" + esc(S.brand.email) + "'>" +
        esc(S.brand.email) + "</a> and a person will answer.</p>" +
      "<p class='legal__addr'>" + esc(co.legalName) + "<br />" +
        esc(co.address) + "<br />" +
        (co.registrationNo ? "Reg. " + esc(co.registrationNo) + "<br />" : "") +
        "Governed by the laws of " + esc(co.jurisdiction) + "</p>";
  })();

  /* -------------------------------------------------------------- guides --- */
  (function () {
    var stepsHost = $("[data-guide-steps]");
    if (!stepsHost) return;
    var which = /filters\.html/.test(location.pathname) ? "filters" : "install";
    var g = (S.guides || {})[which];
    if (!g) return;

    pageTitle(g.title);
    $("[data-guide-title]").textContent = g.title;
    $("[data-guide-intro]").textContent = g.intro;
    stepsHost.innerHTML = g.steps
      .map(function (s) {
        return '<li class="reveal"><h3>' + esc(s.title) + "</h3><p>" + esc(s.body) + "</p></li>";
      })
      .join("");
    $("[data-guide-tips]").innerHTML = (g.tips || [])
      .map(function (t) { return "<li>" + esc(t) + "</li>"; })
      .join("");
  })();
})();
