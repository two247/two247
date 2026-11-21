# TWO247 — Brand Design System & Technical Architecture Specification
**Phase 01 & 02: Brand Foundations, Design System & Decoupled Configuration**

---

## 1. Brand Identity Evolution

### The Shift: From Food Business to Premium Travel Navigator

| Dimension | Previous Food Identity | New Travel & Holidays Identity (TWO247) |
|---|---|---|
| **Archetype** | Cozy bistro / culinary character | The Wise Guide & 24/7 Travel Guardian |
| **Owl Symbolism** | Cartoonish / cafe mascot | Sleek, geometric, observant (vision, perspective, day & night vigilance) |
| **Tone** | Casual, quirky, foodie | Sophisticated, trustworthy, inspiring, reassuring |
| **Color Language** | Warm diner/cafe hues | Deep midnight & twilight navy + Sunlit champagne/gold + Pearl white |
| **Value Proposition** | Food & dining hospitality | "Your Journey. Our Guidance. 24/7." |

### Brand Pillars
1. **Unbroken Assurance (24×7):** Travelers are never alone; support is live at every stage.
2. **Curation Over Clutter:** Handcrafted itineraries tailored to personal style rather than bulk generic tours.
3. **Quiet Luxury:** Clean layouts, generous white space, cinematic photography, and subtle micro-interactions.

---

## 2. Decoupled Brand & Domain Configuration Architecture

To strictly satisfy the rule:
> **"Do not start coding until the brand name/domain decision is confirmed. The domain is not yet purchased, so the domain should remain configurable until the client confirms the final name/domain."**

All brand references across the entire application will be consumed through a single, type-safe configuration module:

```typescript
// src/config/site.config.ts
export const siteConfig = {
  // Brand Identity (Easily updated in 1 line if brand name changes)
  brand: {
    name: "TWO247",
    fullName: "TWO247 — The White Owl Holidays",
    shortName: "TWO247",
    tagline: "Your Journey. Our Guidance. 24/7.",
    subTagline: "Handcrafted holiday packages and bespoke travel experiences.",
    legalName: "The White Owl Holidays Pvt. Ltd.",
    currency: "INR",
    currencySymbol: "₹",
  },
  
  // Domain & URL Config (Configurable before domain purchase)
  domain: {
    productionUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://two247holidays.com",
    previewUrl: "https://two247.vercel.app",
  },

  // Contact & Conversion Channels
  contact: {
    phone: "+91 94999 07081",
    phoneDisplay: "+91 94999 07081",
    whatsapp: "919499907081",
    whatsappDefaultMessage: "Hi TWO247 team, I would like to enquire about planning a holiday.",
    email: "info@two247.in",
    supportEmail: "info@two247.in",
    officeAddress: "39A, Bollineni Hillside, Perumbakkam, Chennai 600100, Tamil Nadu, India",
    businessHours: "24 Hours / 7 Days a Week",
  },

  // Social Links
  social: {
    instagram: "https://instagram.com/two247holidays",
    facebook: "https://facebook.com/two247holidays",
    linkedin: "https://linkedin.com/company/two247holidays",
  },

  // SEO & OpenGraph Defaults
  seo: {
    defaultTitle: "TWO247 — The White Owl Holidays | 24/7 Travel Guidance",
    titleTemplate: "%s | TWO247 — The White Owl Holidays",
    description: "Discover memorable holidays, thoughtfully planned around your destination, travel style, and requirements. 24/7 travel support from start to finish.",
    keywords: [
      "luxury travel",
      "holiday packages",
      "international tours",
      "honeymoon packages",
      "custom itinerary",
      "family vacations",
      "travel agency 24/7",
    ],
  },
};

export type SiteConfig = typeof siteConfig;
```

---

## 3. UI Design System Tokens

### 3.1 Color Palette

```css
/* Color Tokens (MotionSites Editorial Standard) */
:root {
  --color-canvas:       #FFFFFF;  /* Pure white primary background */
  --color-primary:      #000000;  /* Master headline, buttons, active menu */
  --color-secondary:    #6F6F6F;  /* Subheadings, menu items, italic emphasis */
  --color-surface:      #FFFFFF;  /* Cards, modals, search containers */
  --color-border:       #F1F5F9;  /* Hairline dividers & borders */
}
```

### 3.2 Typography Hierarchy

- **Display Text (Headings, Logo):** `Instrument Serif` (Editorial elegance, tight tracking `-2.46px`, `leading-[0.95]`).
- **Body Text (Navigation, Descriptions, UI):** `Inter` (Precise, digital legibility).

### 3.3 Core UI Components

1. **Header & Navigation:**
   - Sticky blur backdrop (`backdrop-blur-md bg-white/80`).
   - Clean brand mark with typography lockup.
   - Prominent **"Plan Your Trip"** button with amber accent.
   - Quick one-tap WhatsApp trigger.

2. **Package Cards:**
   - Aspect ratio 4:3 high-resolution destination image.
   - Clean metadata pill badges: `5 Nights / 6 Days`, `Customisable`, `International / Domestic`.
   - Clear starting price formatting: `Starting from ₹45,999 / person`.
   - Quick action: **"View Details"** + Direct WhatsApp enquiry icon.

3. **Destination Spotlight:**
   - Curated cards for India (Kashmir, Kerala, Rajasthan, Goa, Northeast) & International (Dubai, Maldives, Singapore, Bali, Europe, Thailand).
   - "Best Time to Visit" weather indicator badge.

4. **Custom Trip Planner Form:**
   - 3-step progressive disclosure:
     - Step 1: Where & When (Destination, Dates)
     - Step 2: Who & Budget (Travellers: Adults, Kids, Estimated Budget)
     - Step 3: Contact & Notes (Name, Phone, WhatsApp, Specific Requests)
   - Immediate feedback and instant WhatsApp routing option.

5. **Sticky Mobile Action Bar:**
   - Fixed at bottom of mobile viewports:
     - Button 1: `WhatsApp Us` (Direct chat link with prefilled context)
     - Button 2: `Plan My Trip` (Opens modal or scrolls to custom trip form)

---

## 4. Database & Entity Schema (V1)

```prisma
// Proposed Prisma / Supabase Schema for V1

model Destination {
  id          String    @id @default(uuid())
  slug        String    @unique
  name        String
  region      RegionType // DOMESTIC | INTERNATIONAL
  tagline     String
  description String
  coverImage  String
  gallery     String[]
  bestTimeToVisit String
  topExperiences  String[]
  travelTips  String[]
  faqs        Json
  isFeatured  Boolean   @default(false)
  packages    Package[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Package {
  id              String      @id @default(uuid())
  slug            String      @unique
  name            String
  destinationId   String
  destination     Destination @relation(fields: [destinationId], references: [id])
  durationDays    Int
  durationNights  Int
  startingPrice   Int
  category        TripCategory // HONEYMOON | FAMILY | GROUP | LUXURY | ADVENTURE
  highlights      String[]
  coverImage      String
  gallery         String[]
  inclusions      String[]
  exclusions      String[]
  itinerary       Json        // Array of { day: 1, title: "", description: "", meals: [] }
  faqs            Json
  isFeatured      Boolean     @default(false)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model TripEnquiry {
  id             String    @id @default(uuid())
  packageSlug    String?
  destination    String
  name           String
  email          String
  phone          String
  travelDate     DateTime?
  returnDate     DateTime?
  adults         Int       @default(2)
  children       Int       @default(0)
  budgetRange    String?
  tripType       String?
  requirements   String?
  status         EnquiryStatus @default(NEW) // NEW | CONTACTED | CONVERTED | CLOSED
  createdAt      DateTime  @default(now())
}
```

---

## 5. Development Roadmap & Milestones

- **Phase 01:** Architecture & PRD Review *(Done)*
- **Phase 02:** Brand / UI Design System & Component Library Setup *(Current)*
- **Phase 03:** Homepage Implementation (Hero, Value Props, Featured Packages, Testimonials, Lead CTAs)
- **Phase 04:** Packages Listing & Detailed Itinerary Pages
- **Phase 05:** Destinations Listing & Destination Detail Showcase
- **Phase 06:** Custom Trip Planner, About Us & Contact Pages
- **Phase 07:** Blog Infrastructure & SEO Metadata Integration
- **Phase 08:** Mobile Responsiveness & Multi-Device QA
- **Phase 09:** Performance Optimization (Image CDN, Core Web Vitals) & Security
- **Phase 10:** Production Deployment to Vercel
