# One-product store — foundation

Zero dependencies. Plain HTML/CSS/JS. No build step, no framework, no install.

## Run it

```powershell
powershell -ExecutionPolicy Bypass -File store\server.ps1
```

Then open <http://localhost:8080/>. (Add `-Port 3000` to change the port.)

## Where the content lives

**Everything is in one file: [`product.js`](product.js).**
Copy, prices, photos, variants, bundles, reviews, FAQ — all of it. Edit that file
and reload; you never need to touch the HTML.

| Want to change… | Edit this key in `product.js` |
| --- | --- |
| Store name, accent colour, contact | `brand` |
| Scrolling top bar messages | `announcements` |
| Product name, pitch, price, photos | `product` |
| Colour/size options | `product.variants` |
| 1x / 2x / 3x pricing tiers | `product.bundles` |
| "As seen in" logos | `pressLogos` |
| Four benefit cards | `benefits` |
| Problem section | `problem` |
| 3-step explainer | `steps` |
| Long feature sections | `features` |
| Us-vs-them table | `comparison` |
| Testimonials | `reviews` |
| Guarantee block | `guarantee` |
| FAQ accordion | `faq` |
| Closing CTA | `finalCta` |

## Adding your photos

Drop files into ``, then point at them:

```js
gallery: [
  { src: "hero.jpg",   alt: "Product, front" },
  { src: "in-use.jpg", alt: "Product in use" },
],
```

Square images (1:1) work best in the gallery; the feature/lifestyle slots are 4:3.
The `.svg` files currently in `` are placeholders — delete them once
your real photos are in.

## Page structure

```
announcement bar → header → hero (gallery + buy box) → press logos → benefits
→ problem → how it works → feature deep-dives → comparison table → reviews
→ guarantee → FAQ → closing CTA → footer
                                   + sticky mobile buy bar & cart drawer
```

## What works

- Image gallery with thumbnails and arrows
- Variant swatches, quantity bundles with per-tier discount maths
- Cart drawer with quantity stepper and live subtotal
- Sticky buy bar on scroll, FAQ accordion, scroll reveals
- Fully responsive down to 375px, with a hamburger menu under 860px

## What's not wired yet

- **Checkout.** Ready to connect: create a Stripe Payment Link (or Shopify /
  PayPal / Lemon Squeezy link) and paste it into `checkout.url` in
  `product.js`. Until then the button shows a "not connected" note.
- **Analytics / pixels** (Meta, TikTok, GA4).
- **Email capture** for abandoned carts.
- **Legal pages** — privacy, terms, shipping policy, refund policy. Required by
  every payment processor before they'll approve an account.
