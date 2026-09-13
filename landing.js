/* =============================================================================
   landing.js — hydrates the landing page from window.STORE.
   ============================================================================= */
(function () {
  "use strict";

  var S = window.STORE;
  var P = S.product;
  var L = S.landing || {};

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var money = function (n) { return P.currencySymbol + n.toFixed(2).replace(/\.00$/, ""); };

  document.title = S.brand.name + " — " + S.brand.tagline;
  var md = $('meta[name="description"]');
  if (md) md.setAttribute("content", L.heroBody || P.pitch);

  /* ----------------------------------------------------------------- hero -- */
  $("[data-l-eyebrow]").textContent = L.heroEyebrow || "";
  $("[data-l-title]").textContent = L.heroTitle || P.name;
  $("[data-l-body]").textContent = L.heroBody || P.pitch;
  $("[data-l-cta]").textContent = L.heroCta || "Shop now";
  $("[data-l-image]").src = L.heroImage || P.gallery[0].src;
  $("[data-l-image]").alt = L.heroTitle || P.name;

  // Star line above the headline — the first thing the competitor shows.
  // Renders ONLY from real numbers in product.rating / reviewCount. Until
  // those exist it stays hidden, because an invented rating is the single
  // fastest way to lose a payment processor.
  (function () {
    var host = $("[data-l-rating]");
    if (!host) return;
    if (P.rating == null || !P.reviewCount) { host.remove(); return; }
    var full = Math.round(P.rating);
    host.innerHTML =
      '<span class="banner__stars">' +
        "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full) +
      "</span><span>Rated " + P.rating + " by " + P.reviewCount.toLocaleString() + "+ customers</span>";
    host.hidden = false;
  })();

  if (L.heroAlign === "center") $("[data-hero-align]").classList.add("banner--center");

  // Scrim strength is per-image — a dark photo needs far less than a bright one.
  if (typeof L.heroScrim === "number") {
    document.documentElement.style.setProperty("--hero-scrim", L.heroScrim);
  }

  // Where to anchor the crop. Matters most on mobile, where a wide image
  // keeps only ~30% of its width and a centred crop can lose the subject.
  if (L.heroFocus) document.documentElement.style.setProperty("--hero-focus", L.heroFocus);
  if (L.heroFocusMobile) document.documentElement.style.setProperty("--hero-focus-mobile", L.heroFocusMobile);
  if (L.heroAspect) document.documentElement.style.setProperty("--hero-aspect", L.heroAspect);
  if (L.heroAccent) document.documentElement.style.setProperty("--hero-accent", L.heroAccent);

  // Highlights become a horizontal strip beneath the full-bleed hero.
  $("[data-l-ticks]").innerHTML = (P.highlights || [])
    .map(function (h) {
      return '<span class="hstrip__item"><svg class="ico"><use href="#i-shield"/></svg>' + esc(h) + "</span>";
    })
    .join("");

  /* --------------------------------------------------------- mid banner -- */
  (function () {
    var host = $("[data-mid-banner]");
    var m = L.midBanner;
    if (!m || !m.enabled) { host.remove(); return; }
    $("[data-mid-img]").src = m.image;
    $("[data-mid-img]").alt = m.title;
    $("[data-mid-eyebrow]").textContent = m.eyebrow || "";
    $("[data-mid-title]").textContent = m.title;
    $("[data-mid-body]").textContent = m.body;
    var cta = $("[data-mid-cta]");
    if (m.cta) { cta.textContent = m.cta; cta.href = m.ctaHref || "product.html"; }
    else cta.remove();
    host.hidden = false;
  })();

  /* ---------------------------------------------------------- trust strip -- */
  (function () {
    var host = $("[data-press]");
    var trust = S.trustBar || [];
    var logos = S.pressLogos || [];
    if (logos.length) {
      host.innerHTML = logos.map(function (l) { return "<span>" + esc(l) + "</span>"; }).join("");
      return;
    }
    if (!trust.length) { host.closest(".press").remove(); return; }
    host.classList.add("press__in--trust");
    host.innerHTML = trust
      .map(function (t) {
        return '<span class="press__trust"><svg class="ico"><use href="#i-shield"/></svg>' + esc(t) + "</span>";
      })
      .join("");
  })();

  /* -------------------------------------------------------------- pillars -- */
  // Cards carry a photo when one is configured, and fall back to the icon
  // badge when it isn't — so the grid never looks broken mid-photoshoot.
  $("[data-l-pillars]").innerHTML = (L.pillars || [])
    .map(function (b) {
      // `imagePanel` isolates one half of a two-panel image (e.g. a
      // before/after strip) so a card can show a single side without you
      // having to re-crop the file.
      var mediaCls = "bcard__media" +
        (b.imagePanel ? " bcard__media--" + b.imagePanel : "") +
        (b.imageWhole ? " bcard__media--whole" : "");
      // imageWhole + imageAspect: the box takes the file's own proportions and
      // the image is contained rather than cropped — for pictures that only
      // make sense complete, like a side-by-side comparison.
      var mediaStyle = b.imageWhole && b.imageAspect
        ? ' style="aspect-ratio:' + esc(b.imageAspect) + '"'
        : "";
      var media = b.image
        ? '<div class="' + mediaCls + '"' + mediaStyle + '><img src="' + esc(b.image) + '" alt="' + esc(b.title) + '"' +
          (b.imageFocus ? ' style="object-position:' + esc(b.imageFocus) + '"' : "") +
          ' loading="lazy" /></div>'
        : '<div class="bcard__icon"><svg class="ico"><use href="#i-' + esc(b.icon) + '"/></svg></div>';
      return (
        '<div class="bcard' + (b.image ? " bcard--img" : "") + ' reveal">' +
          media +
          '<div class="bcard__body"><h3>' + esc(b.title) + "</h3><p>" + esc(b.body) + "</p></div>" +
        "</div>"
      );
    })
    .join("");

  /* ------------------------------------------------------------- featured -- */
  (function () {
    var vs = S.valueStack;
    var rows = vs
      ? vs.items
          .map(function (it) {
            return (
              "<li><span>" + esc(it.label) + "</span>" +
              (it.free ? '<span class="stack__free">FREE</span>' : "<strong>" + money(it.now) + "</strong>") +
              "</li>"
            );
          })
          .join("")
      : "";

    $("[data-l-featured]").innerHTML =
      '<div class="feat__media"><img src="' + esc(L.featuredImage || P.gallery[0].src) +
        '" alt="Everything included with ' + esc(P.name) + '" /></div>' +
      '<div class="feat__body">' +
        "<h3>" + esc(P.name) + "</h3>" +
        "<p>" + esc(P.pitch) + "</p>" +
        (rows ? '<ul class="feat__list">' + rows + "</ul>" : "") +
        '<div class="feat__price">' +
          "<strong>" + money(P.price) + "</strong>" +
          (P.compareAt ? "<s>" + money(P.compareAt) + "</s>" : "") +
        "</div>" +
        '<a class="btn btn--primary btn--lg btn--block" href="product.html">Shop the showerhead</a>' +
      "</div>";
  })();

  /* --------------------------------------------------------- filter proof -- */
  (function () {
    var p = S.filterProof;
    if (!p || !p.enabled) { var s = $("#proof"); if (s) s.remove(); return; }
    $("[data-proof-eyebrow]").textContent = p.eyebrow;
    $("[data-proof-title]").textContent = p.title;
    $("[data-proof-body]").textContent = p.body;
    $("[data-proof-before-img]").src = p.before.img;
    $("[data-proof-before-img]").alt = p.before.label;
    if (p.before.focus) $("[data-proof-before-img]").style.objectPosition = p.before.focus;
    $("[data-proof-before-label]").textContent = p.before.label;
    $("[data-proof-after-img]").src = p.after.img;
    $("[data-proof-after-img]").alt = p.after.label;
    if (p.after.focus) $("[data-proof-after-img]").style.objectPosition = p.after.focus;
    $("[data-proof-after-label]").textContent = p.after.label;
    $("[data-proof-note]").textContent = p.note || "";
  })();


  /* -------------------------------------------------------------- reviews -- */
  (function () {
    var host = $("[data-l-reviews]");
    if (!host) return;
    var section = host.closest("section");
    var list = S.reviews || [];
    if (!list.length) { section.remove(); return; }

    var starsTxt = function (r) {
      var full = Math.round(r);
      return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
    };

    // Star emblem under the heading — only from real numbers, same as the hero.
    var big = $("[data-l-rating-big]");
    if (P.rating != null && P.reviewCount) {
      big.innerHTML =
        '<span class="rating__stars">' + starsTxt(P.rating) + "</span>" +
        "<span><strong>" + Number(P.rating).toFixed(1) + "</strong> from " + P.reviewCount + " reviews</span>";
    } else {
      big.remove();
    }

    var SHOW = 6;
    host.innerHTML = list.slice(0, SHOW).map(function (r) {
      return (
        '<div class="review reveal">' +
          '<div class="review__stars">' + starsTxt(r.rating) + "</div>" +
          "<h3>" + esc(r.title) + "</h3>" +
          "<p>" + esc(r.body) + "</p>" +
          '<div class="review__by">' +
            '<span class="review__av">' + esc(r.name.charAt(0)) + "</span>" +
            "<span>" + esc(r.name) + (r.location ? " · " + esc(r.location) : "") + "</span>" +
            (r.verified ? '<span class="review__ver">✓ Verified</span>' : "") +
          "</div>" +
        "</div>"
      );
    }).join("");

    var more = $("[data-l-more-reviews]");
    if (list.length > SHOW) {
      more.textContent = "Read all " + list.length + " reviews";
      more.hidden = false;
    }
    if (window.rescanReveals) window.rescanReveals();
  })();

  /* ------------------------------------------------------- review modal -- */
  (function () {
    var modal = $("#reviewModal");
    if (!modal) return;
    var form = $("[data-review-form]", modal);
    var note = $("[data-review-note]", modal);
    var ratingInput = form.querySelector('input[name="rating"]');
    var starBtns = Array.prototype.slice.call(modal.querySelectorAll("[data-starpick] button"));
    var label = $("[data-starpick-label]", modal);
    var labels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

    var paint = function (n) {
      starBtns.forEach(function (b) { b.classList.toggle("is-on", +b.getAttribute("data-v") <= n); });
    };
    starBtns.forEach(function (b) {
      var v = +b.getAttribute("data-v");
      b.addEventListener("mouseenter", function () { paint(v); });
      b.addEventListener("mouseleave", function () { paint(+ratingInput.value || 0); });
      b.addEventListener("click", function () { ratingInput.value = v; paint(v); label.textContent = labels[v]; });
    });

    var open = function () { modal.hidden = false; document.body.style.overflow = "hidden"; };
    var close = function () { modal.hidden = true; document.body.style.overflow = ""; };
    Array.prototype.slice.call(document.querySelectorAll("[data-open-review]")).forEach(function (b) {
      b.addEventListener("click", open);
    });
    Array.prototype.slice.call(modal.querySelectorAll("[data-close-review]")).forEach(function (b) {
      b.addEventListener("click", close);
    });
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (!modal.hidden && e.key === "Escape") close(); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!ratingInput.value) {
        note.className = "revform__note is-error";
        note.textContent = "Please pick a star rating.";
        return;
      }
      if (!form.checkValidity()) {
        note.className = "revform__note is-error";
        note.textContent = "Please add your name, a headline and a few words.";
        return;
      }
      // No backend yet: hand the review to the store inbox via the visitor's
      // mail client, so nothing is lost while checkout/forms are being wired.
      var f = form.elements;
      var subject = "Aquaveil review: " + f.title.value + " (" + ratingInput.value + "/5)";
      var body =
        "Rating: " + ratingInput.value + "/5\n" +
        "Name: " + f.name.value + "\n" +
        "City: " + f.location.value + "\n" +
        "Noticed most: " + (f.group.value || "-") + "\n\n" +
        f.title.value + "\n" + f.body.value;
      note.className = "revform__note";
      note.textContent = "Thank you! Your review has been submitted and will appear once we've checked it.";
      window.location.href = "mailto:" + S.brand.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      form.reset();
      ratingInput.value = "";
      paint(0);
      label.textContent = "Tap a star";
      setTimeout(close, 2600);
    });
  })();

  /* ------------------------------------------------------------ guarantee -- */
  $("[data-guarantee-title]").textContent = S.guarantee.title;
  $("[data-guarantee-body]").textContent = S.guarantee.body;
  $("[data-guarantee-sig]").textContent = S.guarantee.signature;

  /* -------------------------------------------------------------- closing -- */
  $("[data-l-closing-title]").textContent = L.closingTitle || "";
  $("[data-l-closing-body]").textContent = L.closingBody || "";
  $("[data-l-price]").textContent = money(P.price);
})();
