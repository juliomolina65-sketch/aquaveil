/**
 * AQUAVEIL — store server (Railway, or `node server.js` locally).
 *
 * Serves the static store AND the two tiny endpoints Stripe Embedded Checkout
 * needs. Zero npm dependencies: Node 18+ has fetch built in.
 *
 *   GET  /                          store homepage (index.html)
 *   GET  /api/config                publishable key for the browser
 *   POST /api/checkout-session      creates an embedded Checkout Session
 *   GET  /api/session-status?id=    order status for thanks.html
 *
 * Config comes from environment variables (Railway → Variables) or a local
 * `.env` file next to this script, which is git-ignored and never deployed:
 *   STRIPE_SECRET_KEY        sk_live_... or sk_test_...   (never in the browser)
 *   STRIPE_PUBLISHABLE_KEY   pk_live_... or pk_test_...   (safe in the browser)
 *   STRIPE_PRODUCT_ID        prod_...  (optional — product.js has the default)
 *
 * The old "Bueno" pages that used to live on "/" are still here under /bueno.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

/* ------------------------------------------------------------- .env ------ */
(function loadDotEnv() {
  const file = path.join(ROOT, ".env");
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file, "utf8").split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  });
})();

const PORT = process.env.PORT || 8080;
// STRIPE_MODE=test swaps in the test keys so you can run fake orders with
// Stripe's test card (4242 4242 4242 4242). Anything else means live.
const TEST = (process.env.STRIPE_MODE || "live").toLowerCase() === "test";
const SECRET = (TEST ? process.env.STRIPE_TEST_SECRET_KEY : process.env.STRIPE_SECRET_KEY) || "";
const PUBLISHABLE = (TEST ? process.env.STRIPE_TEST_PUBLISHABLE_KEY : process.env.STRIPE_PUBLISHABLE_KEY) || "";
const PRODUCT_ID = process.env.STRIPE_PRODUCT_ID || "prod_VFW8AzNpBAaiwi";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

// Friendly path -> real file
const ROUTES = {
  "/": "index.html",
  "/thanks": "thanks.html",
  // Legacy Bueno project, kept reachable but off the store's front door.
  "/bueno": "rescue-pitch.html",
  "/bueno/signup": "signup.html",
  "/bueno/partners": "rescue-partners.html",
  "/bueno/report": "report.html",
  "/bueno/demo": "rescue-demo.html",
};

/* ---------------------------------------------------------- helpers ------ */
const send = (res, code, body, type) => {
  res.writeHead(code, {
    "Content-Type": type || "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  });
  res.end(body);
};
const json = (res, code, obj) => send(res, code, JSON.stringify(obj), "application/json; charset=utf-8");

// Streams files and honours HTTP Range requests. iPhones (Safari) refuse to
// play <video> from a server that can't do byte ranges — they just show a
// blank tile — so this is required for the customer clips, not optional.
const serveFile = (res, filePath, req) => {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, "Not found");
    const type = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    const range = req && req.headers.range;
    const base = {
      "Content-Type": type,
      "X-Content-Type-Options": "nosniff",
      "Accept-Ranges": "bytes",
      "Cache-Control": /\.(mp4|webm|jpg|jpeg|png|webp|avif|ico|woff2)$/i.test(filePath) ? "public, max-age=86400" : "no-store",
    };
    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(range);
      let start = m && m[1] ? parseInt(m[1], 10) : 0;
      let end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1;
      if (!m || isNaN(start) || start >= stat.size) {
        res.writeHead(416, { "Content-Range": "bytes */" + stat.size });
        return res.end();
      }
      end = Math.min(end, stat.size - 1);
      res.writeHead(206, Object.assign(base, {
        "Content-Range": "bytes " + start + "-" + end + "/" + stat.size,
        "Content-Length": end - start + 1,
      }));
      return fs.createReadStream(filePath, { start, end }).pipe(res);
    }
    res.writeHead(200, Object.assign(base, { "Content-Length": stat.size }));
    fs.createReadStream(filePath).pipe(res);
  });
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 1e5) { reject(new Error("body too large")); req.destroy(); } });
    req.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); } });
    req.on("error", reject);
  });

// Stripe's API takes form-encoded bodies, nested keys in bracket notation.
const form = (obj, prefix) => {
  const out = [];
  Object.keys(obj).forEach((k) => {
    const v = obj[k];
    const key = prefix ? prefix + "[" + k + "]" : k;
    if (v == null) return;
    if (typeof v === "object") out.push(form(v, key));
    else out.push(encodeURIComponent(key) + "=" + encodeURIComponent(v));
  });
  return out.filter(Boolean).join("&");
};

async function stripe(method, endpoint, body) {
  if (!SECRET) throw new Error("STRIPE_SECRET_KEY is not set");
  const r = await fetch("https://api.stripe.com/v1" + endpoint, {
    method,
    headers: {
      Authorization: "Bearer " + SECRET,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2024-06-20",
    },
    body: body ? form(body) : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw new Error((data.error && data.error.message) || "Stripe error " + r.status);
  return data;
}

// The product's default price, looked up once and cached.
// Test mode has its own product catalogue, so the live product ID won't exist
// there. In that case we create a matching test product on the fly (test
// objects are free and separate from anything live).
let priceCache = null;
async function defaultPriceId() {
  if (priceCache) return priceCache;
  let product;
  try {
    product = await stripe("GET", "/products/" + PRODUCT_ID);
  } catch (e) {
    if (!TEST) throw e;
    console.log("[stripe] live product not found in test mode; creating a test product");
    product = await stripe("POST", "/products", {
      name: "The Aquaveil Showerhead (TEST)",
      default_price_data: { currency: "usd", unit_amount: 5999 },
    });
  }
  if (!product.default_price) throw new Error("Product has no default price set in Stripe");
  priceCache = typeof product.default_price === "string" ? product.default_price : product.default_price.id;
  return priceCache;
}

const originOf = (req) => {
  const proto = req.headers["x-forwarded-proto"] || "http";
  return proto + "://" + req.headers.host;
};

/* --------------------------------------------------------------- api ------ */
async function api(req, res, pathname, url) {
  if (pathname === "/api/config" && req.method === "GET") {
    return json(res, 200, {
      publishableKey: PUBLISHABLE,
      ready: Boolean(SECRET && PUBLISHABLE),
      mode: TEST ? "test" : "live",
    });
  }

  if (pathname === "/api/checkout-session" && req.method === "POST") {
    const body = await readBody(req);
    const qty = Math.max(1, Math.min(10, parseInt(body.quantity, 10) || 1));
    const finish = String(body.finish || "").slice(0, 40);
    const bogo = body.bogo === true;
    const price = await defaultPriceId();
    const session = await stripe("POST", "/checkout/sessions", {
      ui_mode: "embedded",
      mode: "payment",
      line_items: { 0: { price, quantity: qty, adjustable_quantity: { enabled: "true", minimum: 1, maximum: 10 } } },
      shipping_address_collection: { allowed_countries: { 0: "US" } },
      phone_number_collection: { enabled: "true" },
      allow_promotion_codes: "true",
      return_url: originOf(req) + "/thanks.html?session_id={CHECKOUT_SESSION_ID}",
      metadata: {
        finish: finish || "Standard",
        source: "aquaveil-site",
        // Fulfilment note: during Buy-1-Get-1 every paid unit ships as two.
        promo: bogo ? "buy1get1" : "none",
        units_to_ship: String(bogo ? qty * 2 : qty),
      },
    });
    return json(res, 200, { clientSecret: session.client_secret });
  }

  if (pathname === "/api/session-status" && req.method === "GET") {
    const id = url.searchParams.get("id") || "";
    if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return json(res, 400, { error: "bad session id" });
    const s = await stripe("GET", "/checkout/sessions/" + id);
    return json(res, 200, {
      status: s.status,
      paymentStatus: s.payment_status,
      email: (s.customer_details && s.customer_details.email) || "",
      name: (s.customer_details && s.customer_details.name) || "",
      total: s.amount_total,
      currency: s.currency,
    });
  }

  return json(res, 404, { error: "not found" });
}

/* ------------------------------------------------------------ server ------ */
http
  .createServer(async (req, res) => {
    let url;
    try {
      url = new URL(req.url, "http://x");
    } catch (e) {
      return send(res, 400, "Bad request");
    }
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.startsWith("/api/")) {
      try {
        await api(req, res, pathname, url);
      } catch (e) {
        console.error("[api]", pathname, e.message);
        json(res, 500, { error: e.message });
      }
      return;
    }

    // Never serve the secrets file or the server itself.
    if (pathname === "/.env" || pathname === "/server.js") return send(res, 404, "Not found");

    // /b/<slug> — Bueno client pages; b.html reads the slug.
    if (pathname === "/b" || pathname.startsWith("/b/")) {
      return serveFile(res, path.join(ROOT, "b.html"), req);
    }

    if (ROUTES[pathname]) return serveFile(res, path.join(ROOT, ROUTES[pathname]), req);

    // Plain static, with a guard so nobody can walk out of the folder.
    const target = path.normalize(path.join(ROOT, pathname));
    if (!target.startsWith(ROOT)) return send(res, 403, "Forbidden");

    serveFile(res, target, req);
  })
  .listen(PORT, () => {
    console.log("Aquaveil store running on http://localhost:" + PORT);
    console.log("Stripe:", (TEST ? "TEST mode, " : "LIVE mode, ") + (SECRET && PUBLISHABLE ? "configured" : "NOT configured (add the keys to .env)"));
  });
