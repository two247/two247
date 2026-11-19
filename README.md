# TWO247 — The White Owl Holidays
> **"Your Journey. Our Guidance. 24/7."**

Welcome to the official repository for **TWO247 — The White Owl Holidays** website.

---

## 🦉 Brand Concept

- **TWO / The White Owl:** The core visual identity symbolizing wisdom, guidance, elevated vision, and trusted travel navigation.
- **247 / 24×7:** Continuous round-the-clock customer assistance, live on-trip WhatsApp care, and responsive support.
- **Holidays:** Handcrafted holiday packages, domestic & international destinations, and bespoke travel experiences.

---

## 📂 Project Architecture

```text
two247/
│
├── index.html                           # Premium Homepage (14 Sections)
│
├── pages/
│   ├── about.html                       # Our Story, Philosophy & 24/7 Promise
│   ├── packages.html                    # Filterable Holiday Packages Catalog
│   ├── destinations.html                # Domestic & International Destinations Hub
│   ├── custom-trip.html                 # 3-Step Bespoke Trip Planning Form
│   ├── blog.html                        # Destination Guides & Travel Insights
│   └── contact.html                     # 24/7 Travel Desk & Direct WhatsApp
│
├── package/
│   └── package-details.html             # Detailed Itinerary, Inclusions & Lead Form
│
├── destination/
│   └── destination-details.html         # Destination Guides & Recommended Packages
│
├── css/
│   ├── input.css                        # Tailwind & Custom Micro-interactions
│   └── output.css                       # Compiled & Minified Production CSS (30KB)
│
├── js/
│   ├── main.js                          # Core App Initializer & Scroll Reveal
│   ├── navbar.js                        # Transparent-to-Blurred Scroll Navbar & Mobile Drawer
│   ├── slider.js                        # Testimonial & Destination Sliders
│   ├── faq.js                           # Accessible Interactive FAQ Accordion
│   └── form.js                          # Lead Capture & Instant WhatsApp URL Generator
│
├── assets/
│   ├── logo/
│   │   ├── owl-mark.svg                 # Luxury Travel Owl Vector (Amber & Navy)
│   │   └── owl-mark-white.svg           # High-Contrast Owl Vector for Dark Themes
│   ├── icons/
│   └── images/
│
├── data/
│   ├── site-config.js                   # Decoupled Brand, Domain, Contact & Social Config
│   ├── destinations.js                  # Rich Destination Profiles & Experience Data
│   └── packages.js                      # Curated Itineraries, Pricing & Highlights
│
├── components/
│   ├── navbar.html                      # Reusable Navigation Bar Component
│   └── footer.html                      # Reusable Global Footer & Mobile Bottom Bar
│
├── docs/
│   ├── PRD.md                           # Product Requirements Document
│   └── DESIGN_SYSTEM_AND_ARCHITECTURE.md# Design System Tokens & Roadmap
│
├── tailwind.config.js                   # Custom Theme, Color Tokens & Typography
├── package.json                         # Node dependencies & Tailwind build scripts
└── README.md
```

---

## 🎨 Color Palette & Design Tokens (MotionSites Editorial Standard)

| Token | Hex | Usage |
|---|---|---|
| **Primary Canvas** | `#FFFFFF` | Core page background, clean canvas, light aesthetic |
| **Primary Black** | `#000000` | Headlines, brand logo, primary CTA buttons, active states |
| **Secondary Gray** | `#6F6F6F` | Editorial subheadings, menu links, italic emphasis, descriptions |
| **Surface White** | `#FFFFFF` | Cards, clean glassmorphic panels, modals |
| **Border Slate** | `#F1F5F9` | Hairline dividers, subtle card boundaries |

---

## 🚀 Quick Start & Development

### 1. Build Tailwind CSS
```bash
# One-time production build
npm run build:css

# Watch mode during editing
npm run watch:css
```

### 2. Run Local Preview
You can serve the project using any local static web server, such as:
```bash
npx serve .
# or
python3 -m http.server 8000
```
Open `http://localhost:8000` or the provided local URL in your browser.

---

## ⚙️ Decoupled Brand & Domain Configuration

All brand names, domain URLs, WhatsApp numbers, and support contacts are abstracted in `data/site-config.js`. When the client registers the final domain or requests branding adjustments, updating this single file automatically updates all dynamic bindings across the entire website.
