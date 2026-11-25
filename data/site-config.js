// Site and Brand Configuration
// Update this file when brand name, domain, contact info or social links change.
export const siteConfig = {
  brand: {
    name: "TWO247",
    fullName: "TWO247 — The White Owl Holidays",
    tagline: "Your Journey. Our Guidance. 24/7.",
    subTagline: "Handcrafted holiday packages and bespoke travel experiences.",
    currency: "INR",
    currencySymbol: "₹",
    established: "2026",
  },
  domain: {
    // Easily configurable domain
    url: "https://two247.in",
    previewUrl: "https://two247.vercel.app",
  },
  contact: {
    phone: "+91 98862 96699",
    phoneDisplay: "+91 98862 96699",
    whatsapp: "919886296699",
    whatsappMessage: "Hi TWO247 team, I would like to enquire about planning a holiday.",
    email: "info@two247.in",
    supportEmail: "info@two247.in",
    address: "39A, Bollineni Hillside, Perumbakkam, Chennai 600100, Tamil Nadu, India",
    availability: "24 Hours / 7 Days a Week",
  },
  social: {
    instagram: "https://instagram.com/two247holidays",
    facebook: "https://facebook.com/two247holidays",
    linkedin: "https://linkedin.com/company/two247holidays",
    twitter: "https://twitter.com/two247holidays",
  },
  features: {
    enableOnlineBooking: false, // V1 lead generation focus
    enableWhatsAppChat: true,
    enableCustomTripPlanner: true,
  }
};

if (typeof window !== "undefined") {
  window.siteConfig = siteConfig;
}
