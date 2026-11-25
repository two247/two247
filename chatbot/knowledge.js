let KB = null;
export async function loadKB() {
  if (KB) return KB;
  const urls = [
    new URL("./knowledge-base.json", import.meta.url).href,
    "/chatbot/knowledge-base.json",
    "/public/chatbot/knowledge-base.json",
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        KB = await res.json();
        return KB;
      }
    } catch (_) {}
  }
  console.warn("Could not load knowledge-base.json from any known path");
  return KB || {};
}
export function getKB() { return KB; }
export function searchPackages(q, filters = {}) {
  const kb = KB; if (!kb) return [];
  let list = kb.packages || [];
  if (filters.category) list = list.filter(p => (p.categoryType||"").toLowerCase() === filters.category.toLowerCase());
  if (filters.dest) list = list.filter(p => (p.destination||"").toLowerCase().includes(filters.dest.toLowerCase()));
  if (filters.maxPrice) list = list.filter(p => (p.startingPriceNum||0) <= filters.maxPrice);
  if (q) {
    const t = q.toLowerCase();
    list = list.filter(p => (p.name+p.destination+(p.highlights||[]).join(" ")).toLowerCase().includes(t));
  }
  return list.slice(0,6);
}
export function findPackage(slug) { return (KB?.packages||[]).find(p=>p.slug===slug); }
export function visaInfo(dest) {
  const d = (dest||"").toLowerCase();
  const v = KB?.visaRules?.[d]; if (!v) return null;
  return v.india || v;
}
export function bestTime(dest) { return KB?.bestTimeToVisit?.[(dest||"").toLowerCase()]; }
export function faqs() { return KB?.faqs||[]; }
export function services() { return KB?.services||[]; }
export function honeymoon(dest) { return KB?.honeymoonGuides?.[(dest||"").toLowerCase()]; }
export function siteConfig() { return KB?.siteConfig; }
export function whatsappLink(msg) {
  const sc = KB?.siteConfig;
  const num = sc?.contact?.whatsapp || "919886296699";
  return "https://wa.me/" + num + "?text=" + encodeURIComponent(msg || sc?.contact?.whatsappMessage || "Hi");
}
