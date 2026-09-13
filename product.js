/* =============================================================================
   PRODUCT CONFIG — the ONLY file you need to edit for content.
   Everything on the page is driven from here.

   POSITIONING: a SKIN AND HAIR product that happens to be a showerhead.
   Muravai sells "cleaner water, healthier skin and hair" — generic. We sell
   one idea: it was never your skincare or your shampoo — it was the water.
   That targets people already spending money to fix skin and hair.
   ============================================================================= */

window.STORE = {
  /* --- Brand ------------------------------------------------------------- */
  brand: {
    name: "AQUAVEIL",
    tagline: "Better water. Better skin and hair.",
    accent: "#14727f",
    accentDark: "#0d5560",
    email: "support@aquaveil.example",
    instagram: "#",
    tiktok: "#",
  },

  /* --- Checkout ------------------------------------------------------------ *
   * The Checkout button sends the customer here. Easiest path with zero code:
   *   1. Stripe Dashboard -> Payment Links -> New link -> add "The Aquaveil
   *      Showerhead" at $59.99, tick "Let customers adjust quantity" and
   *      "Collect shipping address", pick allowed countries, then Create.
   *   2. Paste the link below. That's it - the button goes live.
   * A Shopify "Buy" link, PayPal checkout link or Lemon Squeezy URL works the
   * same way. Leave `url` empty and the button shows the "not connected" note.
   * ----------------------------------------------------------------------- */
  checkout: {
    // "embedded": the Stripe form opens INSIDE this site (needs server.js
    //             running with the keys in .env / Railway variables).
    // "link":     send the customer to the hosted Stripe page at `url`.
    // Embedded falls back to the link automatically if the server isn't ready.
    mode: "embedded",
    url: "https://buy.stripe.com/9B63cv2W18Xz6aq3ca2kw04",
    // Optional: a different link per finish, if you make one payment link
    // per colour. Keys must match the variant option names exactly.
    urlByVariant: {
      // "Chrome": "https://buy.stripe.com/...",
      // "Matte Black": "https://buy.stripe.com/...",
      // "Brushed Gold": "https://buy.stripe.com/...",
    },
  },

  /* --- Promotion ------------------------------------------------------------ *
   * A time-boxed offer shown in the announcement bar, the hero pill, the buy
   * box and the checkout summary. Everything switches off by itself after
   * `ends`, so you never have to remember to take it down.
   *
   * HONESTY RULES (these protect your Stripe account and your ad account):
   *  - "Buy 1, Get 1 Free" means two showerheads really ship for $59.99.
   *  - `soldThisMonth` is displayed to customers. Keep it a number you can
   *    stand behind; update it as real orders come in. Set to 0 to hide.
   * ----------------------------------------------------------------------- */
  promo: {
    enabled: true,
    headline: "Buy 1, Get 1 Free",
    detail: "Two Aquaveil showerheads ship for the price of one",
    ends: "2026-09-19T23:59:59-05:00",     // 7 days from launch (Central time)
    soldThisMonth: 50,                      // shown as "50+ sold this month"
    // Line added to "Everything you get today" while the promo is running.
    bonusLabel: "Second Aquaveil Showerhead",
  },

  /* --- Customer videos ------------------------------------------------------ *
   * Vertical phone clips shown in a "Real showers" strip on the homepage.
   * Drop the .mp4 and a poster .jpg in the store folder, add a line here.
   * `caption` is what shows under the tile. Only use clips you have the
   * customer's permission to publish.
   * ----------------------------------------------------------------------- */
  customerVideos: [
    { src: "customer-4.mp4", poster: "customer-4.jpg", caption: "The scalp massager, up close" },
    { src: "customer-2.mp4", poster: "customer-2.jpg", caption: "Why filter your shower water" },
    { src: "customer-1.mp4", poster: "customer-1.jpg", caption: "Jet mode on a tiled shower" },
    { src: "customer-3.mp4", poster: "customer-3.jpg", caption: "Rinse mode, full pressure" },
  ],

  /* --- Site navigation ---------------------------------------------------- *
   * Used by chrome.js to build the header and footer on EVERY page, so nav
   * lives in exactly one place.
   * ----------------------------------------------------------------------- */
  nav: {
    primary: [
      { label: "Shop All", href: "shop.html" },
      { label: "How It Works", href: "product.html#benefits" },
      { label: "FAQs", href: "faq.html" },
    ],
    cta: { label: "Shop now", href: "product.html" },
    footer: [
      {
        heading: "Shop",
        links: [
          { label: "Shop All", href: "shop.html" },
          { label: "The Showerhead", href: "product.html" },
          { label: "Replacement Filters", href: "shop.html#filters" },
        ],
      },
      {
        heading: "Help",
        links: [
          { label: "Track My Order", href: "track.html" },
          { label: "FAQs", href: "faq.html" },
          { label: "How To Install", href: "install.html" },
          { label: "How To Replace Filters", href: "filters.html" },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "Contact", href: "mailto:" },
          { label: "Shipping Policy", href: "shipping.html" },
          { label: "Refund Policy", href: "refunds.html" },
          { label: "Privacy Policy", href: "privacy.html" },
          { label: "Terms of Service", href: "terms.html" },
        ],
      },
    ],
  },

  /* --- Catalog (Shop All page) -------------------------------------------- */
  catalog: [
    {
      id: "showerhead",
      name: "The Aquaveil Showerhead",
      blurb: "Filtered water for your skin and hair. Includes the hose, wall mount and four spare filter cartridges.",
      price: 59.99,
      compareAt: 84.99,
      img: "kit.jpg",
      href: "product.html",
      badge: "Best seller",
    },
    {
      id: "filters",
      name: "Replacement Filters — 3 Pack",
      blurb: "Nine months of filtration. Same cartridge that ships with the head.",
      price: 44.99,
      compareAt: 59.97,
      img: "filter-new.jpg",
      href: "product.html",
      badge: "Save 25%",
    },
    {
      id: "hose",
      name: "Shower Hose & Mount Set",
      blurb: "Stainless steel hose, adjustable mount and Teflon tape. Spare or replacement.",
      price: 24.99,
      compareAt: null,
      img: "benefit-install.jpg",
      href: "product.html",
      badge: null,
    },
  ],

  /* --- Landing page -------------------------------------------------------- */
  landing: {
    heroEyebrow: "Filtered showerhead",
    heroTitle: "It was never your skincare.",
    heroTitleAccent: "It was your water.",   // rendered in italic gold after the title

    // Small pill above the headline. The offer in one line. Leave "" to hide.
    heroOffer: "Free hose, wall mount & 4 filters included",
    // Sits next to the price.
    heroPriceNote: "Free US shipping · 40-day money-back",
    // Three short trust points under the buttons.
    heroChips: ["2-minute install, no tools", "Fits every standard shower", "Ships within 24h"],
    // Square/portrait photo used INSTEAD of the wide banner on phones.
    heroImageMobile: "kit.jpg",

    // KEEP THIS TO ONE LINE. A hero gets about two seconds of attention —
    // headline, one supporting line, button. The full argument about mineral
    // buildup lives further down the page where people have already opted in
    // to reading. A paragraph up here just gets skipped.
    //
    // NOTE ON CLAIMS: describes what hard water DOES. Never claims to treat
    // acne, eczema or any condition — that's a health claim needing clinical
    // substantiation, and it's a fast route to a banned ad account.
    heroBody:
      "Filters out the chlorine and hard-water minerals coating your skin and hair. Installs in two minutes, no tools.",
    heroCta: "Shop the showerhead",
    // Full-bleed landscape banner. Use a WIDE image — 2:1 or wider. It's
    // cropped to fill, so keep the subject away from the extreme edges.
    heroImage: "banner-hero.jpg",
    heroAlign: "left",     // "left" or "center"

    // Accent used ON the dark banners only. Pulled from the gold veining in
    // the marble so the type belongs to the photograph instead of fighting it.
    // Light pages keep the teal — gold on cream has poor contrast.
    heroAccent: "#dcb87f",

    // How hard to darken the image behind the headline, 0–1.
    // Bright/busy photo → 0.85. Already-dark photo → 0.35–0.5, so you don't
    // flatten the lighting that made the shot good in the first place.
    heroScrim: 0.4,

    // Crop anchor. Your showerhead sits in the right third of the frame, so on
    // mobile the crop has to be pushed right or it lands on empty marble.
    heroFocus: "center",
    heroFocusMobile: "76% center",

    // The image's true proportions. The hero sizes itself to this, so the
    // whole photo is always visible — it grows on wide monitors instead of
    // being cropped top and bottom. Set it to your image's width / height.
    heroAspect: "1870 / 841",

    // Image for the "One head. Everything included." block. Falls back to the
    // first gallery shot if unset. A kit/flat-lay works best here — the whole
    // point of the section is showing what lands in the box.
    featuredImage: "kit.jpg",

    // Second full-bleed banner, mid-page, to break up the contained sections.
    midBanner: {
      enabled: true,
      image: "benefit-pressure.jpg",
      eyebrow: "85% of US homes",
      title: "You've been treating the symptom.",
      body: "85% of US homes have hard water. Twice a day it coats you in calcium, magnesium and chlorine — stripping the oils your skin makes to protect itself and leaving a film on every strand of hair. Serums, masks and bond builders are all trying to undo something that goes straight back on tomorrow morning.",
      cta: "See how it works",
      ctaHref: "product.html",
    },
    // Benefit grid under "Fix the water, fix the hair".
    // Ordered deliberately: hair, then skin and scalp, then hardware. We stop
    // short of Muravai, who also pitch water bills, pet washing and car mats —
    // a page afraid to pick. Skin and hair are one story: the same minerals
    // cause both. Water bills are a different story, so they stay off.
    //
    // Each `image` is a 4:3 slot — drop real photos in  and point
    // at them. `icon` is the fallback badge if an image is missing.
    pillars: [
      {
        icon: "leaf",
        title: "Softer, shinier hair",
        body: "Without a mineral film coating every strand, hair lies flat, catches light and stops tangling in the shower.",
        image: "benefit-hair.jpg",
        // Two-panel before/after — shown WHOLE. `imageAspect` makes the media
        // box match the file's real proportions and switches it to contain,
        // so nothing is cropped and both panels stay visible.
        imageAspect: "1536 / 1024",
        imageWhole: true,
      },
      {
        icon: "shield",
        title: "Colour that holds",
        body: "Chlorine is what pulls dye out. Filter it and colour stays true weeks longer between salon visits.",
        image: "benefit-colour.jpg",
        // Two-panel comparison — shown whole so both sides stay visible.
        imageAspect: "1489 / 1056",
        imageWhole: true,
      },
      {
        icon: "leaf",
        title: "Calmer, less dry skin",
        body: "Hard water strips the oils your skin makes to protect itself. That tight, itchy feeling after a shower isn't your moisturiser failing.",
        image: "benefit-skin.jpg",
        // Two-panel comparison — shown whole so both sides stay visible.
        imageAspect: "1536 / 1024",
        imageWhole: true,
      },
      {
        icon: "shield",
        title: "Less flaking and itch",
        body: "The same buildup that dulls hair sits on your scalp. Most people notice the itch settling within a couple of weeks.",
        image: "benefit-scalp.jpg",
        // Two-panel comparison — shown whole so both sides stay visible.
        imageAspect: "1536 / 1024",
        imageWhole: true,
      },
      {
        icon: "bolt",
        title: "Stronger pressure",
        body: "Precision nozzles raise perceived pressure while using less water. Rinse conditioner out in half the time.",
        // Single photo, already 4:3 — fills the card edge to edge with no
        // letterboxing. No imageWhole needed; that's only for comparisons.
        image: "benefit-pressure.jpg",
      },
      {
        icon: "truck",
        title: "Two-minute install",
        body: "Unscrew the old head, screw this one on. No tools, no plumber, fits every standard shower arm.",
        // Four-panel grid — must be seen whole or the panels get sliced.
        image: "benefit-install.jpg",
        imageAspect: "1448 / 1086",
        imageWhole: true,
      },
    ],
    closingTitle: "Two minutes to install. Forty days to change your mind.",
    closingBody: "Free worldwide shipping, four spare filters included, one-time purchase.",
  },

  /* --- Legal pages ---------------------------------------------------------- *
   * These are TEMPLATES, not legal advice. Every payment processor (Stripe,
   * Shopify Payments, PayPal) checks for these before approving a merchant
   * account, and their absence is one of the most common rejection reasons.
   *
   * BEFORE YOU GO LIVE, fill in every [BRACKETED] value below. They are
   * deliberately obvious so you can't miss one. If you sell into the EU/UK,
   * have someone qualified read the privacy policy — GDPR has real teeth.
   *
   * IMPORTANT: the policies below are written to match what the site actually
   * promises — 40-day refunds, 24h dispatch, one-time purchase. If you
   * change those promises anywhere, change them here too. Policies that
   * contradict your product page are worse than no policies at all.
   * ----------------------------------------------------------------------- */
  legal: {
    company: {
      legalName: "[YOUR REGISTERED BUSINESS NAME]",
      tradingAs: "Aquaveil",
      address: "[STREET ADDRESS, CITY, POSTCODE, COUNTRY]",
      registrationNo: "[COMPANY / EIN NUMBER, if you have one]",
      jurisdiction: "[STATE / COUNTRY whose laws govern these terms]",
      lastUpdated: "[DATE YOU PUBLISH THIS]",
    },

    privacy: {
      title: "Privacy Policy",
      intro:
        "This policy explains what personal information we collect when you shop with us, why we collect it, who we share it with, and what rights you have over it.",
      sections: [
        {
          h: "What we collect",
          p: [
            "When you place an order we collect your name, shipping address, billing address, email address and phone number. We need all of these to get a parcel to you and to tell you where it is.",
            "We do NOT collect or store your card details. Payment is handled entirely by our payment processor, and card numbers never touch our systems.",
            "If you contact support, we keep that correspondence so we can help you properly if you write again.",
            "Like most websites we also collect basic technical data — browser type, device, pages viewed, and how you found us — through cookies and analytics.",
          ],
        },
        {
          h: "Who we share it with",
          p: [
            "Our fulfilment partners and manufacturers. To ship your order we pass your name, address and phone number to the supplier who packs and posts it. Some of our fulfilment partners are located outside your country, including in China. This transfer is necessary to perform the contract you entered into when you placed the order.",
            "Our payment processor, to take payment and handle any refund.",
            "Shipping carriers, so they can deliver the parcel and give you tracking.",
            "Analytics and advertising providers, where enabled, to understand how the site is used and to measure ad performance.",
            "We do not sell your personal information.",
          ],
        },
        {
          h: "Cookies",
          p: [
            "We use cookies to remember what's in your cart, to keep the site working, and — where you've allowed it — to measure traffic and ad performance. You can block or delete cookies in your browser, though parts of the site may stop working properly if you do.",
          ],
        },
        {
          h: "How long we keep it",
          p: [
            "Order records are kept for as long as we're required to for tax and accounting purposes, typically six to seven years. Support correspondence is kept for two years. Marketing contacts are kept until you unsubscribe.",
          ],
        },
        {
          h: "Your rights",
          p: [
            "You can ask us for a copy of the personal data we hold about you, ask us to correct it, or ask us to delete it. If you're in the UK or EU you have these rights under GDPR; if you're in California you have comparable rights under the CCPA. Residents of other regions may have similar rights.",
            "To exercise any of these, email us. We'll respond within 30 days. We won't charge you and we won't treat you differently for asking.",
            "If you're unhappy with how we've handled your data, you can complain to your local data protection authority.",
          ],
        },
        {
          h: "Marketing",
          p: [
            "If you opt in, we'll email you occasionally about products and offers. Every email has an unsubscribe link and it works immediately. We won't add you to a marketing list just because you bought something without asking first.",
          ],
        },
      ],
    },

    terms: {
      title: "Terms of Service",
      intro:
        "These terms govern your use of this website and any purchase you make from us. By placing an order you agree to them.",
      sections: [
        {
          h: "Orders",
          p: [
            "Placing an order is an offer to buy. We accept it when we send you an order confirmation. Until then we may decline an order for any reason — including if the item is out of stock, if we spot a pricing error, or if we suspect fraud.",
            "We do our best to describe products accurately, but colours can vary between screens and product photography is illustrative.",
          ],
        },
        {
          h: "Pricing and payment",
          p: [
            "All prices are in US dollars and include applicable taxes unless stated otherwise at checkout.",
            "If a product is listed at an incorrect price due to an error, we'll contact you before shipping and give you the choice of paying the correct price or cancelling for a full refund.",
            "Payment is taken at the time of order through our payment processor.",
          ],
        },
        {
          h: "One-time purchases only",
          p: [
            "Every order on this site is a single, one-time purchase. We do not operate subscriptions, auto-renewals or recurring billing of any kind. You will never be charged again after your order.",
            "If we introduce an optional refill subscription in future, it will be clearly disclosed at checkout, never pre-selected, and cancellable at any time — and these terms will be updated before it goes live.",
          ],
        },
        {
          h: "Delivery and risk",
          p: [
            "Delivery estimates are estimates, not guarantees. Ownership and risk pass to you on delivery.",
            "You are responsible for giving us a correct and complete shipping address. We can't be held responsible for a parcel delivered to an address you supplied incorrectly.",
          ],
        },
        {
          h: "Warranty and disclaimers",
          p: [
            "We warrant that the product will be free from manufacturing defects on arrival. If it isn't, contact us and we'll replace it or refund you.",
            "Beyond that, and to the extent permitted by law, the product is supplied as-is. Nothing on this website is medical advice. Our products are not intended to diagnose, treat, cure or prevent any condition, and individual results vary.",
            "Nothing in these terms limits your statutory consumer rights.",
          ],
        },
        {
          h: "Limitation of liability",
          p: [
            "To the extent permitted by law, our total liability for any claim relating to an order is limited to the amount you paid for that order. We are not liable for indirect or consequential losses.",
          ],
        },
        {
          h: "Intellectual property",
          p: [
            "The content on this site — text, images, layout and branding — belongs to us or is used with permission. Don't copy it for commercial use without asking.",
          ],
        },
        {
          h: "Governing law",
          p: [
            "These terms are governed by the laws of the jurisdiction named at the top of this page, and disputes will be handled by the courts there.",
          ],
        },
      ],
    },

    shipping: {
      title: "Shipping Policy",
      intro:
        "Free tracked shipping worldwide, no minimum order. Here's exactly what to expect.",
      sections: [
        {
          h: "Dispatch",
          p: [
            "Orders placed before 2pm on a business day are dispatched within 24 hours. Orders placed after that, or at weekends, go out the next business day.",
            "You'll get a tracking number by email as soon as your parcel is scanned by the carrier. That can take a further 24–48 hours to start showing movement — a tracking number that shows nothing on day one is normal.",
          ],
        },
        {
          h: "Delivery times",
          p: [
            "United States, United Kingdom and EU: typically 3–6 business days after dispatch.",
            "Canada, Australia and New Zealand: typically 5–10 business days.",
            "Everywhere else: typically 7–14 business days.",
            "These are estimates based on normal carrier performance. Peak periods, customs inspections and weather can add time, and none of that is within our control.",
          ],
        },
        {
          h: "Shipping cost and duties",
          p: [
            "Shipping is free worldwide with no minimum spend.",
            "Where import duties or taxes apply, we cover them. You will not be asked to pay anything on delivery.",
          ],
        },
        {
          h: "If something goes wrong",
          p: [
            "If tracking hasn't updated in 10 business days, email us and we'll chase the carrier.",
            "If a parcel is confirmed lost, we'll send a replacement at no cost or refund you in full — your choice.",
            "If your parcel arrives damaged, send us a photo and we'll replace it. Don't send it back.",
          ],
        },
        {
          h: "Address changes",
          p: [
            "Email us within two hours of ordering and we'll usually be able to change the address. After dispatch we can't redirect a parcel.",
          ],
        },
      ],
    },

    refunds: {
      title: "Refund & Returns Policy",
      intro:
        "Forty days to change your mind. No return shipping, no restocking fee, no forms.",
      sections: [
        {
          h: "The 40-day guarantee",
          p: [
            "Use it properly — daily, in your actual shower — for up to 40 days from delivery. If your skin and hair aren't better, email us and we'll refund you in full.",
            "You do not need to ship anything back. Keep the showerhead.",
            "We ask for one thing only: that you actually used it. A shower filter can't tell you anything in three days.",
          ],
        },
        {
          h: "How to request a refund",
          p: [
            "Email us with your order number. That's the whole process. You don't need to explain yourself, fill in a form, or speak to anyone on the phone.",
            "We aim to reply within one business day.",
          ],
        },
        {
          h: "When you'll get your money",
          p: [
            "Refunds are issued to your original payment method within two business days of approval. Your bank may then take a further 3–10 business days to show it, which is outside our control.",
          ],
        },
        {
          h: "Faulty or damaged items",
          p: [
            "If your order arrives damaged or develops a fault, email us a photo. We'll send a replacement free, or refund you if you'd rather. This applies beyond the 40-day window — a manufacturing defect is our problem regardless of when it shows up.",
          ],
        },
        {
          h: "No recurring charges",
          p: [
            "Every order is a one-time purchase. There is no subscription to cancel and nothing will ever bill you again after checkout.",
          ],
        },
        {
          h: "Exclusions",
          p: [
            "We can't refund orders placed more than 40 days ago, except where the item is faulty.",
            "We may decline refunds where there's clear evidence of abuse — for example repeated orders and refunds from the same customer.",
            "None of this affects your statutory rights.",
          ],
        },
      ],
    },
  },

  /* --- Guides -------------------------------------------------------------- */
  guides: {
    install: {
      title: "How to install your Aquaveil",
      intro: "Two minutes, no tools, no plumber. If your shower arm currently has a head on it, this fits.",
      steps: [
        { title: "Remove the old showerhead", body: "Turn it counter-clockwise by hand. It was only ever hand-tightened. If it's stuck, grip it with a cloth for extra purchase — you don't need a wrench." },
        { title: "Wrap the thread", body: "Wind the included Teflon tape clockwise around the shower arm thread, three or four turns. This is what stops drips later, so don't skip it." },
        { title: "Attach the mount", body: "Screw the adjustable mount onto the arm, hand-tight. Stop when it feels snug — overtightening damages the washer." },
        { title: "Connect the hose", body: "One end to the mount, the other to the showerhead. Check the rubber washer is seated inside each end before you tighten." },
        { title: "Run it and check", body: "Turn the water on and look at both joints. A slow drip means the washer isn't seated or the tape needs another wrap." },
      ],
      tips: [
        "Keep your old showerhead until you're sure there are no leaks",
        "Every connection is hand-tight — tools will crack the plastic",
        "Run the shower for 30 seconds before the first use to flush the new cartridge",
      ],
    },
    filters: {
      title: "How to replace your filter",
      intro: "About 90 days for a two-person household, less if your water is very hard. The cartridge tells you when — you don't need a calendar.",
      steps: [
        { title: "Know when it's time", body: "The cartridge darkens as it loads up. Fresh is white; when it's gone tan or brown, it's done. Reduced pressure is the other sign." },
        { title: "Unscrew the head", body: "Twist the front of the showerhead counter-clockwise to separate it from the body. No tools." },
        { title: "Lift out the old cartridge", body: "It sits in a cradle and lifts straight out. Bin it with household waste — the media isn't recyclable." },
        { title: "Seat the new one", body: "Drop the fresh cartridge in the same orientation, flat end down. Make sure it sits fully into the cradle before closing." },
        { title: "Reassemble and flush", body: "Screw the head back on hand-tight and run the water for 30 seconds. Slight discolouration on first run is normal carbon dust." },
      ],
      tips: [
        "Four spare cartridges ship with your order — over a year of filtration",
        "Buy replacements only when you actually need them — no subscription, no auto-renewal",
        "Very hard water areas may see 60 days rather than 90 — go by colour, not the calendar",
      ],
    },
  },

  /* --- Rotating announcement bar ----------------------------------------- */
  announcements: [
    "Free shipping — 4 spare filters included",
    "40-day money-back guarantee",
    "Ships in 24h · Fits any standard shower arm",
  ],

  /* --- The product ------------------------------------------------------- */
  product: {
    name: "The Aquaveil Showerhead",
    subtitle: "Filtered water, for your hair.",

    pitch:
      "Hard water leaves mineral buildup on every strand — that's the dullness, the tangles, the colour that fades in three weeks. Aquaveil filters it out before it touches your hair.",

    price: 59.99,
    compareAt: 84.99,
    currency: "USD",
    currencySymbol: "$",

    // Keep these equal to the real average and count of `reviews` below.
    // (Currently the average of the 9 placeholder reviews: 43 / 9 = 4.8.)
    rating: 4.8,
    reviewCount: 9,

    highlights: [
      "Installs in 2 minutes — no tools, no plumber",
      "Filters chlorine, heavy metals & hard-water minerals",
      "Boosts pressure while using less water",
      "Fits every standard shower arm",
    ],

    // Gallery order matters: what you get → it working → why it works.
    // `fit: "contain"` shows a wide image whole instead of cropping it to the
    // square slot; leave it off for anything already square-ish.
    gallery: [
      { src: "kit.jpg", alt: "Everything included in the Aquaveil box" },
      { src: "benefit-pressure.jpg", alt: "Aquaveil in use, water running", fit: "contain" },
      { src: "benefit-install.jpg", alt: "Unboxing, mounting and running the Aquaveil", fit: "contain" },
      { src: "filter-used.jpg", alt: "Filter cartridge after 90 days of use" },
    ],

    variants: [
      {
        label: "Finish",
        options: [
          { name: "Chrome", swatch: "#c9ced3", priceDelta: 0 },
          { name: "Matte Black", swatch: "#26262a", priceDelta: 0 },
          { name: "Brushed Gold", swatch: "#c2a15e", priceDelta: 0 },
        ],
      },
    ],

    // Quantity tiers are OFF for this product — the value stack below is the
    // offer instead (BOGO + free gifts), which is what the 18-month-proven
    // competitor funnels actually run.
    bundles: [],
  },

  /* --- THE OFFER ---------------------------------------------------------- *
   * This is the single highest-leverage block on the page. The structure is
   * lifted from funnels that have been profitably running for 18+ months:
   * anchor the price, stack free gifts with STATED dollar values, then total
   * the savings for the customer. It is not a discount — it is a value stack.
   *
   * Every item here must be genuinely included in what you ship. Listing a
   * "free gift" you don't actually send is fraud, and it's the fastest way to
   * lose a payment processor.
   * ----------------------------------------------------------------------- */
  valueStack: {
    heading: "Everything you get today",
    // REWRITTEN to match the actual kit photos. The launch draft promised a
    // free second showerhead and test strips — neither appears in the kit
    // shot or the install flat-lay. Advertising a free item you don't ship is
    // the fastest route to chargebacks and a closed merchant account, so every
    // line below is something visible in your own product photography.
    //
    // If the supplier DOES ship a second head or test strips, add them back —
    // just make sure the photos show them.
    items: [
      { label: "Aquaveil Filtered Showerhead", was: 84.99, now: 59.99 },
      { label: "Stainless steel hose", was: 16.99, free: true },
      { label: "Adjustable wall mount", was: 12.99, free: true },
      { label: "Replacement filters ×4", was: 44.99, free: true },
      { label: "Retail gift box", was: 9.99, free: true },
    ],
    totalWas: 169.95,
    totalNow: 59.99,
    footnote: "Free worldwide shipping. One-time purchase — no subscription, ever.",
  },

  /* --- Filter subscription ------------------------------------------------ *
   * The real business. A showerhead sells once; filters sell forever, at zero
   * additional ad cost. Keep it genuinely optional and genuinely cancellable.
   * ----------------------------------------------------------------------- */
  // OFF FOR LAUNCH. Sell the product first; add refills once orders are
  // coming in and you know the real replacement cadence. Flip `enabled` back
  // to true and the checkbox, cart line and pricing all come back — nothing
  // else needs changing.
  //
  // When you do switch it on, restore the subscription sections in
  // legal.terms and legal.refunds too. Auto-renewal disclosure is legally
  // required in the US (ROSCA) and several states.
  subscription: {
    enabled: false,
    label: "Add filter refills",
    sublabel: "Fresh cartridge delivered every 90 days",
    price: 19.99,
    interval: "per delivery",
    note: "Skip, pause or cancel anytime. No lock-in.",
    defaultOn: false, // never pre-tick a subscription box — that's a dark pattern
  },

  /* --- Trust bar ---------------------------------------------------------- */
  pressLogos: [],
  trustBar: [
    "Free worldwide shipping",
    "40-day money-back guarantee",
    "Fits any standard shower",
    "Secure checkout",
  ],

  /* --- Stock -------------------------------------------------------------- */
  stock: {
    showCounter: false,
    stockLeft: null,
    inStockText: "In stock — ships within 24 hours",
  },

  /* --- Benefit cards ------------------------------------------------------ */
  benefits: [
    {
      icon: "leaf",
      title: "Softer, shinier hair",
      body: "Without calcium and magnesium coating each strand, hair lies flat, reflects light, and actually feels clean.",
    },
    {
      icon: "shield",
      title: "Colour that lasts",
      body: "Chlorine strips dye fast. Filter it out and colour holds weeks longer between salon visits.",
    },
    {
      icon: "bolt",
      title: "Stronger pressure",
      body: "Precision nozzles raise pressure while using less water. Better rinse, smaller bill.",
    },
    {
      icon: "truck",
      title: "Two-minute install",
      body: "Unscrew the old head, screw this on. No tools, no plumber, works with any standard arm.",
    },
  ],

  /* --- Problem ------------------------------------------------------------ */
  problem: {
    eyebrow: "The real problem",
    title: "Your skin and hair aren't the problem. Your water is.",
    body: "Over 85% of US homes have hard water. Every shower deposits calcium, magnesium and chlorine onto your hair — that's the film that makes it dull, tangled and brittle. No mask or serum fixes it, because the problem is reapplied every single day.",
    points: [
      "Hard minerals build a film that blocks moisture",
      "Chlorine strips colour and natural oils",
      "You've been treating the symptom, not the cause",
    ],
    image: "benefit-hair.jpg",
  },

  /* --- How it works ------------------------------------------------------- */
  steps: [
    { title: "Twist off the old one", body: "Hand-tight is all it ever was. Thirty seconds, no tools." },
    { title: "Screw on Aquaveil", body: "Standard thread, fits every shower arm sold in the US, UK and EU." },
    { title: "Feel the difference", body: "Most people notice softer hair by the end of the first week." },
  ],

  /* --- Feature deep-dives -------------------------------------------------- */
  features: [
    {
      eyebrow: "The filtration",
      title: "Fifteen layers between your hair and your pipes",
      body: "KDF-55 and calcium sulfite media strip chlorine and heavy metals, while activated carbon and ceramic balls handle odour, rust and sediment. It's the same media used in whole-house systems, sized for a showerhead.",
      bullets: ["Removes up to 99% of chlorine", "Filters lead, iron, mercury & sediment", "One cartridge lasts ~90 days"],
      image: "features-callout.jpg",
    },
    {
      eyebrow: "See it for yourself",
      title: "The test strip that ends the argument",
      body: "Pull the cartridge after three months and look at it. Everything staining it is what used to run over your skin and hair twice a day. No percentages, no lab claims — just the thing itself.",
      bullets: ["See it for yourself in 90 days", "Four spare cartridges included", "40 days to change your mind"],
      image: "filter-used.jpg",
    },
  ],

  /* --- Comparison ---------------------------------------------------------- */
  comparison: {
    title: "What people try first",
    us: "Aquaveil",
    them: "Bond builders & masks",
    rows: [
      { feature: "Treats the actual cause", us: true, them: false },
      { feature: "Works on every wash", us: true, them: false },
      { feature: "One-time cost", us: true, them: false },
      { feature: "Protects colour", us: true, them: true },
      { feature: "Helps skin too", us: true, them: false },
      { feature: "Under $60", us: true, them: true },
    ],
  },

  /* --- Reviews ------------------------------------------------------------- *
   * PLACEHOLDER REVIEWS — written to show the layout, not from real customers.
   * Replace every entry below with real ones before launch. The FTC rule on
   * fake reviews (2024) carries fines per review, and Stripe/Meta look for
   * them. Real reviews come from the "Leave a review" button on the site and
   * from emailing buyers ~14 days after delivery.
   *   { name, location, rating (1-5), title, body, verified, group }
   * `group` keys match reviewGroups below: frizz · colour · breakage · scalp · skin
   * ----------------------------------------------------------------------- */
  reviews: [
    {
      name: "Marisol V.", location: "Dallas, TX", rating: 5, verified: true, group: "frizz", hero: true,
      title: "My hair finally lays flat",
      body: "We have really hard water in Dallas and my hair was always frizzy no matter what product I used. About a week in I noticed it was softer and I wasn't fighting tangles in the shower. Wish I'd done this years ago.",
    },
    {
      name: "Jenna K.", location: "Austin, TX", rating: 5, verified: true, group: "colour",
      title: "Red stayed red",
      body: "I dye my hair copper and it used to fade to orange in three weeks. This is the first time it's still looked fresh at week five. Install took me two minutes with no tools, exactly like they said.",
    },
    {
      name: "Devon R.", location: "Phoenix, AZ", rating: 5, verified: true, group: "skin",
      title: "No more tight, itchy feeling",
      body: "The tight feeling on my skin after showering is gone. I assumed it was my body wash for years. The pressure is honestly stronger than my old head, which I did not expect from a filter.",
    },
    {
      name: "Priya S.", location: "Houston, TX", rating: 4, verified: true, group: "scalp",
      title: "Scalp calmed down in two weeks",
      body: "Flaking is way down and my scalp doesn't itch at night anymore. Only reason it's four stars is I'd like a longer hose. The four spare filters in the box are a nice touch.",
    },
    {
      name: "Luis M.", location: "San Antonio, TX", rating: 5, verified: true, group: "skin",
      title: "Bought a second one for my mom",
      body: "My wife noticed the difference in her hair before I did. Then I noticed my skin wasn't dry after showers. Ordered another one for my mother's house the same week.",
    },
    {
      name: "Hannah T.", location: "Denver, CO", rating: 5, verified: true, group: "breakage",
      title: "Less hair in the drain",
      body: "I was losing a lot of hair to breakage and blamed my flat iron. Six weeks with this and there's noticeably less in the drain and on my brush. The filter did turn brown fast, which was kind of gross but also proof it's working.",
    },
    {
      name: "Aaliyah B.", location: "Atlanta, GA", rating: 5, verified: true, group: "frizz",
      title: "Curls are defined again",
      body: "Type 3 curls here. Hard water was making them limp and frizzy at the same time. Now they clump and hold definition without piling on gel. The massage nozzles feel great on wash day too.",
    },
    {
      name: "Sofia G.", location: "Fort Worth, TX", rating: 4, verified: true, group: "colour",
      title: "Good product, honest company",
      body: "Blonde and it's staying brighter between salon visits. Took about two weeks to really notice. I emailed a question about the filter and got a reply from an actual person the same day.",
    },
    {
      name: "Mike D.", location: "Chicago, IL", rating: 5, verified: true, group: "scalp",
      title: "Didn't expect to care this much",
      body: "My girlfriend put it in. I figured it was a gimmick. Three weeks later my dandruff is basically gone and the shower pressure is better than before. Fine, it works.",
    },
  ],

  /* --- Guarantee ----------------------------------------------------------- */
  guarantee: {
    title: "Use it for 40 days. If your hair isn't better, we'll refund you.",
    body: "Shower with it daily for six weeks — that's long enough to see it properly. If your hair doesn't feel different, email us and we'll refund you in full. Keep the showerhead.",
    signature: "— The Aquaveil team",
  },

  /* --- FAQ ----------------------------------------------------------------- */
  faq: [
    {
      q: "Will it fit my shower?",
      a: "Yes. Aquaveil uses the universal 1/2-inch NPT thread that every standard shower arm in the US, UK and EU uses. If it currently has a showerhead on it, this fits. Handheld hoses included.",
    },
    {
      q: "How long does the filter last?",
      a: "About 90 days for an average two-person household, or roughly 10,000 litres. Your order includes four spare cartridges, so you are covered for well over a year before you need to buy anything.",
    },
    {
      q: "Will it reduce my water pressure?",
      a: "The opposite. The nozzle plate is designed to increase perceived pressure while using less water — most people notice a stronger spray than their old head, not weaker.",
    },
    {
      q: "How fast will I see a difference in my hair?",
      a: "Most people report softer, less tangled hair within 5–7 washes. Colour retention is the slower one — you'll notice it at your next dye cycle rather than immediately.",
    },
    {
      q: "How long does shipping take?",
      a: "We dispatch within 24 hours. Typically 3–6 business days in the US, UK and EU, 5–10 days elsewhere. Free and tracked, with no minimum order.",
    },
    {
      q: "What if I don't like it?",
      a: "Email us within 40 days for a full refund. You don't need to ship anything back, and there's no restocking fee.",
    },
  ],

  /* --- Feature board -------------------------------------------------------- *
   * A supplied graphic that already carries its own labels and callouts, shown
   * whole and uncropped with NO text laid over it. This is the right home for
   * an annotated image — the hero is not, because our headline sits there.
   * ----------------------------------------------------------------------- */
  featureBoard: {
    enabled: true,
    eyebrow: "Details that matter",
    title: "Everything built into the head",
    image: "features-callout.jpg",
    aspect: "1672 / 941",
    alt: "Aquaveil showerhead with callouts: built-in filter, multi-layer filtration, ionic purification, on/off switch, shower modes, anti-clog nozzles, scalp massager",
  },

  /* --- Cartridge proof ------------------------------------------------------ *
   * The single most persuasive image you will ever put on this page: a fresh
   * white cartridge next to one that has run 90 days of your water. It makes
   * an argument no percentage claim can, and unlike "99.9% removed" it is
   * something you can actually stand behind.
   *
   * TODO — swap in a REAL photo the moment you have one. Shoot both cartridges
   * side by side, same lighting, plain background. Do not stage or darken it.
   * ----------------------------------------------------------------------- */
  filterProof: {
    enabled: true,
    eyebrow: "The proof",
    title: "Ninety days of your water, caught in a cartridge.",
    body:
      "This is the part nobody photographs. On the left, a fresh cartridge. On the right, the same cartridge after three months on ordinary municipal water. Everything that colour is what used to go onto your hair.",
    // `focus` anchors the crop. These are landscape shots dropped into a
    // portrait slot, so without it the cartridge falls outside the frame.
    // Set it to roughly where the cartridge sits across the image width.
    before: { img: "filter-new.jpg", label: "Fresh cartridge", focus: "center" },
    after: { img: "filter-used.jpg", label: "After 90 days", focus: "center" },
    note: "Photographed on our own unit. No filters, no staging.",
  },

  /* --- Review filtering by symptom ------------------------------------------ *
   * Visitors arrive with ONE problem. Letting them filter to their own symptom
   * means the first thing they read is someone exactly like them. Tag each
   * real review with a `group` key below.
   * ----------------------------------------------------------------------- */
  reviewGroups: [
    { key: "all", label: "All" },
    { key: "frizz", label: "Frizz" },
    { key: "colour", label: "Colour fading" },
    { key: "breakage", label: "Breakage" },
    { key: "scalp", label: "Flaky scalp" },
    { key: "skin", label: "Dry skin" },
  ],

  /* --- Ship-by date -------------------------------------------------------- *
   * Computed live, never faked. Orders after the cutoff roll to the next day,
   * and weekends are skipped — so the date shown is one you can actually hit.
   * ----------------------------------------------------------------------- */
  shipBy: {
    enabled: true,
    cutoffHour: 14,        // 2pm local — after this, ships the next business day
    label: "Order today, ships by",
  },

  /* --- Spray modes ---------------------------------------------------------- */
  sprayModes: [
    { name: "Rainfall", body: "Wide, soft coverage. The default for a spa-like rinse." },
    { name: "Mist", body: "Fine and gentle — best for sensitive skin and colour-treated hair." },
    { name: "Jet", body: "Concentrated pressure for rinsing conditioner out fast." },
    { name: "Mixed", body: "Rainfall and jet together. Most people leave it here." },
  ],

  /* --- What's actually in your water ---------------------------------------- */
  contaminants: {
    title: "What your shower is putting on your hair",
    intro:
      "Municipal water is safe to drink. That's a different standard from safe to soak your hair in twice a day.",
    items: [
      { name: "Chlorine", note: "Strips natural oils and fades colour fastest of anything here" },
      { name: "Calcium & magnesium", note: "The hard-water minerals that build up as film" },
      { name: "Rust & sediment", note: "Picked up from old pipes between the plant and your house" },
      { name: "Heavy metals", note: "Lead, mercury and copper, depending on your plumbing" },
      { name: "Microplastics", note: "Increasingly common in municipal supply" },
      { name: "Chloramine", note: "Longer-lasting than chlorine, and harder to filter" },
    ],
  },

  /* --- The honest filter block --------------------------------------------- *
   * THIS IS THE DIFFERENTIATOR. The market leader sells refills on a 30-day
   * subscription while their own page admits users replace every 10 days.
   * We compete by being straight about it: state the real lifespan, tell
   * people how to know, and never sell a refill they don't need.
   * ----------------------------------------------------------------------- */
  filterTruth: {
    eyebrow: "Let's talk about filters",
    title: "Nobody tells you how fast these actually wear out.",
    body:
      "Most filtered showerheads are sold on the head and monetised on the cartridge. You'll see 30-day subscriptions advertised next to fine print admitting the filter is spent in ten. We'd rather just tell you: yours lasts about 90 days for two people, less if your water is very hard.",
    points: [
      "Four spare cartridges included — a year before you buy anything",
      "The cartridge darkens as it loads up. When it's tan, swap it.",
      "One-time purchase — no subscription, no recurring charge, ever.",
    ],
    image: "filter-used.jpg",
  },

  /* --- Final CTA ------------------------------------------------------------ */
  finalCta: {
    title: "Stop buying products to undo what your water did.",
    body: "Showerhead, stainless hose, wall mount and four spare filters — free shipping, 40 days to change your mind.",
  },
};
