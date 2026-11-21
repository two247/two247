import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const { packages } = await import(path.join(root, "data/packages.js"));
const { destinations } = await import(path.join(root, "data/destinations.js")).catch(() => ({ destinations: [] }));
const { siteConfig } = await import(path.join(root, "data/site-config.js"));

function loadJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
const ck = path.join(root, "data/curated-knowledge");

const kb = {
  version: "1.0",
  generatedAt: new Date().toISOString(),
  packages,
  destinations,
  siteConfig,
  visaRules: loadJson(path.join(ck, "visa-requirements.json")).visa,
  bestTimeToVisit: loadJson(path.join(ck, "best-time-to-visit.json")).bestTime,
  travelTips: loadJson(path.join(ck, "travel-tips.json")).tips,
  honeymoonGuides: loadJson(path.join(ck, "honeymoon-guides.json")).honeymoon,
  faqs: loadJson(path.join(ck, "faq.json")).faqs,
  services: loadJson(path.join(ck, "service-offerings.json")).services,
  destinationHighlights: loadJson(path.join(ck, "destination-highlights.json")).highlights,
};

const jsonStr = JSON.stringify(kb, null, 2);

// Write to public/chatbot/
const publicOutDir = path.join(root, "public", "chatbot");
fs.mkdirSync(publicOutDir, { recursive: true });
fs.writeFileSync(path.join(publicOutDir, "knowledge-base.json"), jsonStr);

// Write to chatbot/ (so direct root server fetches like /chatbot/knowledge-base.json succeed)
const chatbotDir = path.join(root, "chatbot");
fs.mkdirSync(chatbotDir, { recursive: true });
fs.writeFileSync(path.join(chatbotDir, "knowledge-base.json"), jsonStr);

// Copy styles.css to public/chatbot/ as well
const stylesSrc = path.join(chatbotDir, "styles.css");
if (fs.existsSync(stylesSrc)) {
  fs.copyFileSync(stylesSrc, path.join(publicOutDir, "styles.css"));
}

console.log("Wrote knowledge-base.json to both public/chatbot and chatbot directories.");
