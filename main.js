/* =============================================================================
   main.js — hydrates the page from window.STORE (product.js)
   No build step, no dependencies.
   ============================================================================= */
(function () {
  "use strict";

  var S = window.STORE;
  var P = S.product;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var money = function (n) {
    return P.currencySymbol + n.toFixed(2).replace(/\.00$/, "");
  };
  var stars = function (r) {
    var full = Math.round(r);
    return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
  };
  var setAll = function (attr, value, prop) {
    $$("[" + attr + "]").forEach(function (n) { n[prop || "textContent"] = value; });
  };

  /* ---------------------------------------------------------------- state -- */
  var heroOutOfView = false;
  var state = {
    image: 0,
    variant: {},          // { "Colour": optionIndex }
    bundle: 0,
    cart: [],
  };
  (P.variants || []).forEach(function (v) { state.variant[v.label] = 0; });
  state.bundle = (P.bundles || []).findIndex(function (b) { return b.popular; });
  if (state.bundle < 0) state.bundle = 0;

  /* ------------------------------------------------------------- branding -- */
  document.documentElement.style.setProperty("--accent", S.brand.accent);
  document.documentElement.style.setProperty("--accent-dark", S.brand.accentDark);
  document.title = P.name + " — " + S.brand.name;
  var metaDesc = $('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", P.pitch);

  setAll("data-brand-name", S.brand.name);
  setAll("data-brand-tagline", S.brand.tagline);
  setAll("data-year", new Date().getFullYear());
  $$("[data-brand-email]").forEach(function (n) {
    n.href = "mailto:" + S.brand.email;
  });

  /* --------------------------------------------------------- announcement -- */
  (function () {
    var slot = $("[data-announce]");
    if (!slot || !S.announcements.length) return;
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

  /* --------------------------------------------------------------- header -- */
  var header = $("#header");
  var onScrollHeader = function () {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* -------------------------------------------------------------- gallery -- */
  var galMain = $("#galleryMain");
  var galThumbs = $("#galleryThumbs");

  function renderThumbs() {
    galThumbs.innerHTML = "";
    P.gallery.forEach(function (img, i) {
      var b = el("button", i === state.image ? "is-active" : "");
      b.type = "button";
      b.setAttribute("aria-label", "View image " + (i + 1));
      b.appendChild(Object.assign(new Image(), { src: img.src, alt: img.alt || "" }));
      b.addEventListener("click", function () { setImage(i); });
      galThumbs.appendChild(b);
    });
  }
  function setImage(i) {
    state.image = (i + P.gallery.length) % P.gallery.length;
    var img = P.gallery[state.image];
    galMain.style.animation = "none";
    void galMain.offsetWidth;
    galMain.style.animation = "";
    galMain.src = img.src;
    galMain.alt = img.alt || P.name;
    // Wide shots (multi-panel grids, landscape in-use photos) would be sliced
    // by the square slot — `fit: "contain"` shows them whole instead.
    galMain.style.objectFit = img.fit || "cover";
    galMain.style.background = img.fit === "contain" ? "var(--tint)" : "";
    $$("#galleryThumbs button").forEach(function (b, bi) {
      b.classList.toggle("is-active", bi === state.image);
    });
    setAll("data-sticky-img", img.src, "src");
  }
  $("[data-gallery-prev]").addEventListener("click", function () { setImage(state.image - 1); });
  $("[data-gallery-next]").addEventListener("click", function () { setImage(state.image + 1); });
  renderThumbs();
  setImage(0);

  /* ------------------------------------------------------------ buy box ---- */
  // Only render stars when there is a real rating behind them.
  // The emblem reads live numbers from product.js; a count of 10,000 or more
  // displays as "10,000+" automatically. Never hardcode numbers here.
  var fmtCount = function (n) {
    return n >= 10000 ? (Math.floor(n / 1000) * 1000).toLocaleString() + "+" : n.toLocaleString();
  };
  var STAR_PATH = "M10 1.7l2.47 5.26 5.77.73-4.24 3.99 1.09 5.7L10 14.57l-5.09 2.81 1.09-5.7-4.24-3.99 5.77-.73z";
  var starsSVG = function (r, idp) {
    var out = "";
    for (var i = 0; i < 5; i++) {
      var f = Math.max(0, Math.min(1, r - i));
      var fill = f >= 1 ? "#e0a02a" : "#dcd7ca";
      if (f > 0 && f < 1) {
        var gid = idp + "-g" + i; // unique per slot so two emblems on one page never collide
        out += '<defs><linearGradient id="' + gid + '"><stop offset="' + (f * 100).toFixed(0) + '%" stop-color="#e0a02a"/><stop offset="' + (f * 100).toFixed(0) + '%" stop-color="#dcd7ca"/></linearGradient></defs>';
        fill = "url(#" + gid + ")";
      }
      out += '<path d="' + STAR_PATH + '" transform="translate(' + i * 21 + ',0)" fill="' + fill + '"/>';
    }
    return '<svg class="emblem__stars" viewBox="0 0 104 20" width="104" height="20" aria-hidden="true" focusable="false">' + out + "</svg>";
  };
  var emblemHTML = function (idp) {
    return (
      '<a class="emblem" href="#reviews" aria-label="Rated ' + Number(P.rating).toFixed(1) +
      ' out of 5">' +
      starsSVG(P.rating, idp) +
      '<span class="emblem__score">' + Number(P.rating).toFixed(1) + "</span>" +
      '<span class="emblem__sep" aria-hidden="true"></span>' +
      '<span class="emblem__count">out of 5</span></a>'
    );
  };
  var hasRating = P.rating != null && P.reviewCount > 0;
  var bigRating = $("[data-rating-big]");
  if (hasRating) {
    $("[data-rating]").innerHTML = emblemHTML("st-hero");
    if (bigRating) bigRating.innerHTML = emblemHTML("st-big");
  } else {
    // No reviews yet: fill the slot with a claim that is true — the guarantee.
    // Swaps to the star emblem automatically once rating/reviewCount are real.
    $("[data-rating]").innerHTML =
      '<a class="emblem" href="#guarantee">' +
      '<svg class="emblem__stars" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><path d="' + STAR_PATH + '" fill="#e0a02a"/></svg>' +
      '<span class="emblem__count"><strong>40-day</strong> money-back guarantee</span></a>';
    if (bigRating) bigRating.remove();
  }

  setAll("data-product-name", P.name);
  $("[data-product-pitch]").textContent = P.pitch;

  (function () {
    var PR = window.PROMO || {};
    var priceEl = $(".price");
    if (!PR.active || !priceEl) return;
    var pill = el("div", "promo-pill");
    var paint = function () {
      pill.innerHTML = "<strong>" + esc(PR.config.headline) + "</strong>" +
        "<span>" + esc(PR.config.detail || "") + "</span>" +
        '<em>Ends in ' + PR.remaining() + "</em>";
    };
    paint(); setInterval(paint, 30000);
    priceEl.insertAdjacentElement("beforebegin", pill);
  })();

  $("[data-price-now]").textContent = money(P.price);
  if (P.compareAt && P.compareAt > P.price) {
    var off = Math.round((1 - P.price / P.compareAt) * 100);
    $("[data-price-was]").textContent = money(P.compareAt);
    $("[data-price-off]").textContent = "Save " + off + "%";
    var badge = $("[data-save-badge]");
    badge.textContent = "Save " + off + "%";
    badge.hidden = false;
  }

  $("[data-highlights]").innerHTML = P.highlights
    .map(function (h) { return "<li>" + esc(h) + "</li>"; })
    .join("");

  /* ------------------------------------------------------------- variants -- */
  (function () {
    var host = $("[data-variants]");
    if (!P.variants || !P.variants.length) { host.remove(); return; }
    P.variants.forEach(function (v) {
      var block = el("div", "variant");
      var label = el("div", "variant__label",
        esc(v.label) + ' — <span data-variant-value="' + esc(v.label) + '"></span>');
      var opts = el("div", "variant__opts");
      v.options.forEach(function (o, i) {
        var b = el("button", "swatch" + (i === 0 ? " is-active" : ""), "<i></i>");
        b.type = "button";
        b.title = o.name;
        b.setAttribute("aria-label", v.label + ": " + o.name);
        b.querySelector("i").style.background = o.swatch;
        b.addEventListener("click", function () {
          state.variant[v.label] = i;
          $$(".swatch", opts).forEach(function (s, si) { s.classList.toggle("is-active", si === i); });
          $('[data-variant-value="' + v.label + '"]').textContent = o.name;
          updateTotals();
        });
        opts.appendChild(b);
      });
      block.appendChild(label);
      block.appendChild(opts);
      host.appendChild(block);
      $('[data-variant-value="' + v.label + '"]').textContent = v.options[0].name;
    });
  })();

  function variantSummary() {
    return (P.variants || [])
      .map(function (v) { return v.options[state.variant[v.label]].name; })
      .join(" · ");
  }
  function unitPrice() {
    var delta = (P.variants || []).reduce(function (sum, v) {
      return sum + (v.options[state.variant[v.label]].priceDelta || 0);
    }, 0);
    return P.price + delta;
  }

  /* -------------------------------------------------------------- bundles -- */
  (function () {
    var host = $("[data-bundles]");
    if (!P.bundles || !P.bundles.length) { host.closest(".bundles").remove(); return; }
    P.bundles.forEach(function (b, i) {
      var btn = el("button", "bundle" + (i === state.bundle ? " is-active" : ""));
      btn.type = "button";
      btn.innerHTML =
        (b.popular ? '<span class="bundle__flag">Most popular</span>' : "") +
        '<span class="bundle__radio"></span>' +
        '<span class="bundle__main">' +
          '<span class="bundle__name">' + esc(b.label) + "</span>" +
          '<span class="bundle__note">' + esc(b.note || "") + "</span>" +
        "</span>" +
        '<span class="bundle__price">' +
          '<span class="bundle__each" data-bundle-total="' + i + '"></span>' +
          (b.discount ? '<span class="bundle__was" data-bundle-was="' + i + '"></span>' : "") +
        "</span>";
      btn.addEventListener("click", function () {
        state.bundle = i;
        $$(".bundle", host).forEach(function (n, ni) { n.classList.toggle("is-active", ni === i); });
        updateTotals();
      });
      host.appendChild(btn);
    });
  })();

  /* ---------------------------------------------------------- value stack -- */
  // Anchor → free gifts with stated values → total saved. This structure is
  // what the longest-running competitor funnels use, and it outperforms a
  // plain percentage discount because each line reads as something gained.
  (function () {
    var host = $("[data-value-stack]");
    var vs = S.valueStack;
    if (!vs || !vs.items || !vs.items.length) { host.remove(); return; }

    var rows = vs.items
      .map(function (it) {
        var right = it.free
          ? '<span class="stack__free">FREE</span>'
          : "<strong>" + money(it.now) + "</strong>";
        return (
          '<li class="stack__row">' +
            '<span class="stack__label">' + esc(it.label) + "</span>" +
            '<span class="stack__vals">' +
              '<span class="stack__was">' + money(it.was) + "</span>" + right +
            "</span>" +
          "</li>"
        );
      })
      .join("");

    var saved = vs.totalWas - vs.totalNow;
    host.innerHTML =
      '<div class="stack__head">' + esc(vs.heading) + "</div>" +
      '<ul class="stack__list">' + rows + "</ul>" +
      '<div class="stack__total">' +
        "<span>Total value <s>" + money(vs.totalWas) + "</s></span>" +
        "<strong>" + money(vs.totalNow) + "</strong>" +
      "</div>" +
      '<div class="stack__save">You save ' + money(saved) + " today</div>" +
      (vs.footnote ? '<div class="stack__foot">' + esc(vs.footnote) + "</div>" : "");
  })();

  /* -------------------------------------------------------- subscription -- */
  // Opt-in only. Never pre-tick a recurring charge.
  var subOn = false;
  (function () {
    var wrap = $("[data-subscription]");
    var sub = S.subscription;
    if (!sub || !sub.enabled) { wrap.remove(); return; }
    wrap.hidden = false;
    $("[data-sub-label]").textContent = sub.label;
    $("[data-sub-sublabel]").textContent = sub.sublabel || "";
    $("[data-sub-note]").textContent = sub.note || "";
    $("[data-sub-price]").innerHTML =
      "<strong>" + money(sub.price) + "</strong><small>" + esc(sub.interval || "") + "</small>";
    var box = $("[data-sub-toggle]");
    box.checked = !!sub.defaultOn;
    subOn = box.checked;
    box.addEventListener("change", function () {
      subOn = box.checked;
      updateTotals();
    });
  })();

  function bundleTotal(i) {
    var b = P.bundles[i];
    return unitPrice() * b.qty * (1 - (b.discount || 0));
  }
  function currentTotal() {
    return P.bundles && P.bundles.length ? bundleTotal(state.bundle) : unitPrice();
  }
  // What the customer actually pays today, including an opted-in subscription.
  function orderTotal() {
    var sub = S.subscription;
    return currentTotal() + (subOn && sub ? sub.price : 0);
  }

  function updateTotals() {
    (P.bundles || []).forEach(function (b, i) {
      var t = $('[data-bundle-total="' + i + '"]');
      if (t) t.textContent = money(bundleTotal(i));
      var w = $('[data-bundle-was="' + i + '"]');
      if (w) w.textContent = money(unitPrice() * b.qty);
    });
    setAll("data-cart-total", money(cartSubtotal() || orderTotal()));
    var fp = $("[data-final-price]");
    if (fp) fp.textContent = money(currentTotal());
    $("[data-price-now]").textContent = money(unitPrice());
  }

  /* ---------------------------------------------------------------- stock -- */
  (function () {
    var cfg = S.stock || {};
    // Only ever show a countdown backed by a real number.
    if (cfg.showCounter && typeof cfg.stockLeft === "number") {
      $("[data-stock]").textContent = "In stock — only " + cfg.stockLeft + " left";
    } else {
      $("[data-stock]").textContent = cfg.inStockText || "In stock — ships within 24 hours";
    }
  })();

  /* ------------------------------------------------------------ pay marks -- */
  $("[data-pay-marks]").innerHTML = ["VISA", "MC", "AMEX", "PAYPAL", "APPLE PAY"]
    .map(function (m) { return "<span>" + m + "</span>"; })
    .join("");

  /* ----------------------------------------------------------------- press -- */
  // Real press mentions if you have them; otherwise the honest trust strip.
  (function () {
    var host = $("[data-press]");
    var logos = S.pressLogos || [];
    if (logos.length) {
      host.innerHTML = logos.map(function (l) { return "<span>" + esc(l) + "</span>"; }).join("");
      return;
    }
    var trust = S.trustBar || [];
    if (!trust.length) { host.closest(".press").remove(); return; }
    host.classList.add("press__in--trust");
    host.innerHTML = trust
      .map(function (t) {
        return '<span class="press__trust"><svg class="ico"><use href="#i-shield"/></svg>' + esc(t) + "</span>";
      })
      .join("");
  })();

  /* -------------------------------------------------------------- benefits -- */
  $("[data-benefits]").innerHTML = S.benefits
    .map(function (b) {
      return (
        '<div class="bcard reveal">' +
          '<div class="bcard__icon"><svg class="ico"><use href="#i-' + esc(b.icon) + '"/></svg></div>' +
          "<h3>" + esc(b.title) + "</h3><p>" + esc(b.body) + "</p>" +
        "</div>"
      );
    })
    .join("");

  /* --------------------------------------------------------------- problem -- */
  $("[data-problem-img]").src = S.problem.image;
  $("[data-problem-eyebrow]").textContent = S.problem.eyebrow;
  $("[data-problem-title]").textContent = S.problem.title;
  $("[data-problem-body]").textContent = S.problem.body;
  $("[data-problem-points]").innerHTML = S.problem.points
    .map(function (p) { return "<li>" + esc(p) + "</li>"; })
    .join("");

  /* ----------------------------------------------------------------- steps -- */
  $("[data-steps]").innerHTML = S.steps
    .map(function (s) {
      return '<div class="step reveal"><h3>' + esc(s.title) + "</h3><p>" + esc(s.body) + "</p></div>";
    })
    .join("");

  /* -------------------------------------------------------------- features -- */
  $("[data-features]").innerHTML = S.features
    .map(function (f, i) {
      return (
        '<div class="feature"><div class="wrap split reveal' + (i % 2 ? " split--flip" : "") + '">' +
          '<div class="split__media"><img src="' + esc(f.image) + '" alt="' + esc(f.title) + '" /></div>' +
          '<div class="split__body">' +
            '<span class="eyebrow">' + esc(f.eyebrow) + "</span>" +
            '<h2 class="h2">' + esc(f.title) + "</h2>" +
            '<p class="lede">' + esc(f.body) + "</p>" +
            '<ul class="ticks">' + f.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" +
          "</div>" +
        "</div></div>"
      );
    })
    .join("");

  /* ------------------------------------------------------------ comparison -- */
  $("[data-compare-title]").textContent = S.comparison.title;
  $("[data-compare]").innerHTML =
    '<div class="compare__row compare__row--head">' +
      "<div>Feature</div><div class=\"is-us\">" + esc(S.comparison.us) + "</div><div>" + esc(S.comparison.them) + "</div>" +
    "</div>" +
    S.comparison.rows
      .map(function (r) {
        return (
          '<div class="compare__row">' +
            '<div class="compare__feat">' + esc(r.feature) + "</div>" +
            '<div class="compare__cell ' + (r.us ? "yes" : "no") + '">' + (r.us ? "✓" : "✕") + "</div>" +
            '<div class="compare__cell ' + (r.them ? "yes" : "no") + '">' + (r.them ? "✓" : "✕") + "</div>" +
          "</div>"
        );
      })
      .join("");

  /* --------------------------------------------------------- feature board -- */
  // Shown whole, never cropped, with nothing laid over it — the graphic
  // already carries its own labels and callouts.
  (function () {
    var fb = S.featureBoard;
    var host = $("[data-feature-board]");
    if (!host) return;
    if (!fb || !fb.enabled) { host.remove(); return; }
    $("[data-fb-eyebrow]").textContent = fb.eyebrow || "";
    $("[data-fb-title]").textContent = fb.title || "";
    var img = $("[data-fb-img]");
    img.src = fb.image;
    img.alt = fb.alt || fb.title || "";
    if (fb.aspect) img.style.aspectRatio = fb.aspect;
    host.hidden = false;
  })();

  /* ---------------------------------------------------------- filter proof -- */
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

  /* --------------------------------------------------------------- reviews -- */
  // No real reviews yet? Hide the section and its nav link rather than fake it.
  if (!S.reviews || !S.reviews.length) {
    var revSection = $("#reviews");
    if (revSection) revSection.remove();
    var revLink = $('.nav a[href="#reviews"]');
    if (revLink) revLink.remove();
  } else {
    // Visitors arrive with one symptom — let them jump straight to it.
    var revHost = $("[data-reviews]");
    var filterHost = $("[data-review-filter]");

    var REV_PER_PAGE = 8; // 40 real reviews = 5 pages
    var revKey = "all";

    var renderReviews = function (key, page) {
      revKey = key;
      var list = key === "all"
        ? S.reviews
        : S.reviews.filter(function (r) { return r.group === key; });

      var oldPager = $(".revpager");
      if (oldPager) oldPager.remove();

      if (!list.length) {
        revHost.innerHTML = '<div class="revfilter__empty">No reviews in this category yet.</div>';
        return;
      }

      var pages = Math.ceil(list.length / REV_PER_PAGE);
      page = Math.min(Math.max(page || 1, 1), pages);

      revHost.innerHTML = list
        .slice((page - 1) * REV_PER_PAGE, page * REV_PER_PAGE)
        .map(function (r) {
          return (
            '<div class="review">' +
              '<div class="review__stars">' + stars(r.rating) + "</div>" +
              "<h3>" + esc(r.title) + "</h3>" +
              "<p>" + esc(r.body) + "</p>" +
              '<div class="review__by">' +
                '<span class="review__av">' + esc(r.name.charAt(0)) + "</span>" +
                "<span>" + esc(r.name) + " · " + esc(r.location) + "</span>" +
                (r.verified ? '<span class="review__ver">✓ Verified</span>' : "") +
              "</div>" +
            "</div>"
          );
        })
        .join("");

      // Pager sits AFTER the grid (.reviews is display:grid) — only when needed.
      if (pages > 1) {
        var nums = "";
        for (var p = 1; p <= pages; p++) {
          nums += '<button type="button" class="chip' + (p === page ? " is-active" : "") + '" data-page="' + p + '">' + p + "</button>";
        }
        revHost.insertAdjacentHTML("afterend",
          '<div class="revpager">' +
            '<button type="button" class="chip" data-page="' + (page - 1) + '"' + (page === 1 ? " disabled" : "") + ">\u2039 Prev</button>" +
            nums +
            '<button type="button" class="chip" data-page="' + (page + 1) + '"' + (page === pages ? " disabled" : "") + ">Next \u203a</button>" +
          "</div>");
        $$("[data-page]", revHost.parentElement).forEach(function (b) {
          b.addEventListener("click", function () {
            renderReviews(revKey, parseInt(b.getAttribute("data-page"), 10));
            $("#reviews").scrollIntoView({ behavior: "smooth", block: "start" });
          });
        });
      }
    };

    // Only show a chip if it actually has reviews behind it.
    var groups = (S.reviewGroups || []).filter(function (g) {
      return g.key === "all" || S.reviews.some(function (r) { return r.group === g.key; });
    });

    if (groups.length > 1) {
      filterHost.innerHTML = groups
        .map(function (g, i) {
          return '<button type="button" class="chip' + (i === 0 ? " is-active" : "") +
                 '" data-group="' + esc(g.key) + '">' + esc(g.label) + "</button>";
        })
        .join("");
      $$(".chip", filterHost).forEach(function (b) {
        b.addEventListener("click", function () {
          $$(".chip", filterHost).forEach(function (o) { o.classList.remove("is-active"); });
          b.classList.add("is-active");
          renderReviews(b.getAttribute("data-group"));
        });
      });
    } else if (filterHost) {
      filterHost.remove();
    }

    renderReviews("all");
  }

  /* ------------------------------------------------------------- guarantee -- */
  $("[data-guarantee-title]").textContent = S.guarantee.title;
  $("[data-guarantee-body]").textContent = S.guarantee.body;
  $("[data-guarantee-sig]").textContent = S.guarantee.signature;

  /* ------------------------------------------------------------------- faq -- */
  (function () {
    var host = $("[data-faq]");
    S.faq.forEach(function (f) {
      var item = el("div", "faq__item");
      item.innerHTML =
        '<button class="faq__q" type="button" aria-expanded="false">' + esc(f.q) + "</button>" +
        '<div class="faq__a"><p>' + esc(f.a) + "</p></div>";
      var q = $(".faq__q", item);
      var a = $(".faq__a", item);
      q.addEventListener("click", function () {
        var open = item.classList.toggle("is-open");
        q.setAttribute("aria-expanded", String(open));
        a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
        // close siblings
        $$(".faq__item", host).forEach(function (other) {
          if (other !== item && other.classList.contains("is-open")) {
            other.classList.remove("is-open");
            $(".faq__q", other).setAttribute("aria-expanded", "false");
            $(".faq__a", other).style.maxHeight = "0px";
          }
        });
      });
      host.appendChild(item);
    });
  })();

  /* -------------------------------------------------------- ship-by date -- */
  // Real date, computed live. After the cutoff it rolls forward, and weekends
  // are skipped — so we never promise a dispatch day we can't hit.
  (function () {
    var cfg = S.shipBy;
    var host = $("[data-shipby]");
    if (!cfg || !cfg.enabled) { host.remove(); return; }
    var d = new Date();
    if (d.getHours() >= (cfg.cutoffHour || 14)) d.setDate(d.getDate() + 1);
    d.setDate(d.getDate() + 1); // 24h dispatch
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    $("[data-shipby-label]").textContent = cfg.label || "Ships by";
    $("[data-shipby-date]").textContent = d.toLocaleDateString(undefined, {
      weekday: "short", month: "short", day: "numeric",
    });
    host.hidden = false;
  })();

  /* ----------------------------------------------------------- spray modes -- */
  (function () {
    var host = $("[data-modes]");
    var modes = S.sprayModes || [];
    if (!modes.length) { host.closest("section").remove(); return; }
    host.innerHTML = modes
      .map(function (m, i) {
        return (
          '<div class="mode reveal">' +
            '<span class="mode__n">' + (i + 1) + "</span>" +
            "<h3>" + esc(m.name) + "</h3><p>" + esc(m.body) + "</p>" +
          "</div>"
        );
      })
      .join("");
  })();

  /* --------------------------------------------------------- contaminants -- */
  (function () {
    var c = S.contaminants;
    var host = $("[data-contam]");
    if (!c || !c.items || !c.items.length) { host.closest("section").remove(); return; }
    $("[data-contam-title]").textContent = c.title;
    $("[data-contam-intro]").textContent = c.intro || "";
    host.innerHTML = c.items
      .map(function (it) {
        return (
          '<div class="contam__item reveal">' +
            '<span class="contam__x">✕</span>' +
            "<div><h3>" + esc(it.name) + "</h3><p>" + esc(it.note) + "</p></div>" +
          "</div>"
        );
      })
      .join("");
  })();

  /* -------------------------------------------------------- filter truth -- */
  (function () {
    var f = S.filterTruth;
    if (!f) { $("#filters").remove(); return; }
    $("[data-filter-img]").src = f.image;
    $("[data-filter-eyebrow]").textContent = f.eyebrow;
    $("[data-filter-title]").textContent = f.title;
    $("[data-filter-body]").textContent = f.body;
    $("[data-filter-points]").innerHTML = (f.points || [])
      .map(function (p) { return "<li>" + esc(p) + "</li>"; })
      .join("");
  })();

  /* ------------------------------------------------------------- final cta -- */
  $("[data-final-title]").textContent = S.finalCta.title;
  $("[data-final-body]").textContent = S.finalCta.body;

  /* ----------------------------------------------------------- scroll-to ---- */
  $$("[data-scroll-to]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = $(b.getAttribute("data-scroll-to"));
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ------------------------------------------------------------------ cart -- */
  var cartEl = $("#cart");
  var scrim = $(".scrim");

  function cartSubtotal() {
    return state.cart.reduce(function (s, i) { return s + i.total; }, 0);
  }
  function openCart(open) {
    cartEl.classList.toggle("is-open", open);
    scrim.classList.toggle("is-open", open);
    cartEl.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
    // Keep the sticky buy bar out of the way while the drawer is open.
    var bar = $("#stickybar");
    if (open) bar.classList.remove("is-visible");
    else if (heroOutOfView) bar.classList.add("is-visible");
  }
  function renderCart() {
    var body = $("[data-cart-body]");
    if (!state.cart.length) {
      body.innerHTML = '<div class="cart__empty">Your cart is empty.</div>';
    } else {
      body.innerHTML = "";
      state.cart.forEach(function (item, idx) {
        var row = el("div", "cart__item");
        row.innerHTML =
          '<img src="' + esc(item.image) + '" alt="" />' +
          "<div style=\"flex:1;min-width:0\">" +
            "<h4>" + esc(item.name) + "</h4>" +
            '<p class="meta">' + esc(item.meta) + "</p>" +
            '<div class="line">' +
              '<span class="qty">' +
                '<button type="button" data-dec>−</button><span>' + item.qty + "</span>" +
                '<button type="button" data-inc>+</button>' +
              "</span>" +
              "<strong>" + money(item.total) + "</strong>" +
            "</div>" +
          "</div>";
        $("[data-dec]", row).addEventListener("click", function () { changeQty(idx, -1); });
        $("[data-inc]", row).addEventListener("click", function () { changeQty(idx, 1); });
        body.appendChild(row);
      });
    }
    setAll("data-cart-total", money(cartSubtotal() || currentTotal()));
  }
  function changeQty(idx, delta) {
    var item = state.cart[idx];
    item.qty += delta;
    if (item.qty <= 0) state.cart.splice(idx, 1);
    else item.total = item.unit * item.qty;
    renderCart();
  }

  $$("[data-add-to-cart]").forEach(function (b) {
    b.addEventListener("click", function () {
      var bundle = (P.bundles || [])[state.bundle] || null;
      var total = currentTotal();
      state.cart.push({
        name: P.name,
        meta: [bundle && bundle.label, variantSummary()].filter(Boolean).join(" · "),
        image: P.gallery[state.image].src,
        qty: 1,
        unit: total,
        total: total,
      });
      // Subscriptions are a separate, separately-removable line.
      if (subOn && S.subscription) {
        state.cart.push({
          name: S.subscription.label,
          meta: S.subscription.sublabel + " · cancel anytime",
          image: P.gallery[P.gallery.length - 1].src,
          qty: 1,
          unit: S.subscription.price,
          total: S.subscription.price,
        });
      }
      renderCart();
      openCart(true);
      toast("Added to cart");
    });
  });
  $$("[data-close-cart]").forEach(function (b) {
    b.addEventListener("click", function () { openCart(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") openCart(false);
  });
  /* ------------------------------------------------------------- checkout -- */
  // Two paths. "embedded" mounts Stripe's checkout form inside this page via
  // server.js (/api/checkout-session). If the server or keys aren't there,
  // or anything fails, we fall back to the hosted payment link so a customer
  // is never stuck with a dead button.
  var panel = $("#checkoutPanel");
  var embedded = null;

  function hostedCheckout(finish, qty) {
    var co = S.checkout || {};
    var url = (co.urlByVariant && co.urlByVariant[finish]) || co.url;
    if (!url) { toast("Checkout isn't connected yet — add your payment link in product.js."); return; }
    var ref = encodeURIComponent((finish || "std").replace(/\s+/g, "-").toLowerCase() + "-x" + qty);
    window.location.href = url + (url.indexOf("?") > -1 ? "&" : "?") + "client_reference_id=" + ref;
  }

  function setDetails(open) {
    var t = $("[data-summary-toggle]");
    var d = $("[data-summary-details]");
    if (!t || !d) return;
    t.setAttribute("aria-expanded", String(open));
    d.classList.toggle("is-open", open);
  }
  var summaryToggle = $("[data-summary-toggle]");
  if (summaryToggle) {
    summaryToggle.addEventListener("click", function () {
      setDetails(summaryToggle.getAttribute("aria-expanded") !== "true");
    });
  }

  function closeCheckout() {
    if (!panel) return;
    document.body.classList.remove("is-checkout");
    panel.hidden = true;
    document.body.style.overflow = "";
    if (embedded) { try { embedded.destroy(); } catch (e) {} embedded = null; }
    $("#checkoutMount").innerHTML = "";
  }

  function fillSummary(finish, qty) {
    var unit = P.price;
    var sub = unit * qty;
    var vs = S.valueStack;
    $$("[data-summary-img]").forEach(function (i) { i.src = P.gallery[0].src; i.alt = P.name; });
    $("[data-summary-name]").textContent = P.name;
    $("[data-summary-meta]").textContent =
      [finish ? "Finish: " + finish : null, "Qty " + qty].filter(Boolean).join(" · ");
    $("[data-summary-price]").innerHTML =
      money(unit) + (P.compareAt ? " <s>" + money(P.compareAt) + "</s>" : "");
    $("[data-summary-list]").innerHTML = vs
      ? vs.items.map(function (it) {
          return "<li><span>" + esc(it.label) + "</span>" +
            (it.free ? '<em>Included</em>' : "") + "</li>";
        }).join("")
      : "";
    $("[data-summary-subtotal]").textContent = money(sub);
    setAll("data-summary-total", money(sub));
    $("[data-summary-guarantee]").textContent = S.guarantee.title;
  }

  function embeddedCheckout(finish, qty) {
    var loading = $("[data-checkout-loading]");
    $("[data-checkout-brand]").textContent = S.brand.name;
    fillSummary(finish, qty);
    document.body.classList.add("is-checkout");
    setDetails(false);
    panel.hidden = false;
    loading.hidden = false;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    var fail = function (why) {
      console.warn("[checkout] embedded unavailable, using hosted link:", why);
      closeCheckout();
      hostedCheckout(finish, qty);
    };

    if (typeof window.Stripe !== "function") return fail("Stripe.js not loaded");

    fetch("/api/config")
      .then(function (r) { return r.ok ? r.json() : Promise.reject("no server"); })
      .then(function (cfg) {
        if (!cfg.ready || !cfg.publishableKey) return Promise.reject("keys not configured");
        var stripe = window.Stripe(cfg.publishableKey);
        return fetch("/api/checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: qty, finish: finish, bogo: !!(window.PROMO && window.PROMO.active) }),
        })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            if (!data.clientSecret) return Promise.reject(data.error || "no client secret");
            return stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret });
          });
      })
      .then(function (instance) {
        embedded = instance;
        loading.hidden = true;
        embedded.mount("#checkoutMount");
      })
      .catch(fail);
  }

  $("[data-checkout]").addEventListener("click", function () {
    if (!state.cart.length) { toast("Your cart is empty."); return; }
    var finish = (state.cart[0].meta || "").split(" · ").pop();
    var qty = state.cart.reduce(function (n, i) { return n + i.qty; }, 0);
    var mode = (S.checkout && S.checkout.mode) || "link";
    openCart(false);
    if (mode === "embedded" && panel) embeddedCheckout(finish, qty);
    else hostedCheckout(finish, qty);
  });
  $$("[data-close-checkout]").forEach(function (b) { b.addEventListener("click", closeCheckout); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel && !panel.hidden) closeCheckout();
  });

  /* ----------------------------------------------------------------- toast -- */
  var toastEl = el("div", "toast");
  document.body.appendChild(toastEl);
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2600);
  }

  /* ------------------------------------------------------------ sticky bar -- */
  (function () {
    var bar = $("#stickybar");
    var anchor = $("#buy");
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          heroOutOfView = !e.isIntersecting;
          bar.classList.toggle("is-visible", heroOutOfView && !cartEl.classList.contains("is-open"));
        });
      },
      { rootMargin: "-120px 0px 0px 0px" }
    ).observe(anchor);
  })();

  /* --------------------------------------------------------------- reveals -- */
  (function () {
    var items = $$(".reveal");
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
    items.forEach(function (i, idx) {
      i.style.transitionDelay = (idx % 4) * 60 + "ms";
      io.observe(i);
    });
  })();

  // Drop the "not connected" note once a payment link is configured.
  if (S.checkout && S.checkout.url) { var cn = $("[data-cart-note]"); if (cn) cn.remove(); }

  /* ------------------------------------------------------------------ init -- */
  updateTotals();
  renderCart();
})();
