import { loadKB, searchPackages, visaInfo, bestTime, faqs, services, honeymoon, whatsappLink } from "./knowledge.js";
import { classify } from "./nlp.js";
import { renderMessage, renderCard, renderQuick, typing } from "./renderers.js";

export class Conversation {
  constructor(messagesEl) { this.messagesEl = messagesEl; this.ctx = {}; }
  async init() { await loadKB(); this.sayBot("Hi! I'm TWO247's travel assistant. How can I help you plan your trip?"); this.quick(["Show packages","Plan honeymoon","Visa info","Services"]); }
  sayBot(t){ renderMessage(this.messagesEl,"bot",t); }
  sayUser(t){ renderMessage(this.messagesEl,"user",t); }
  quick(chips){ renderQuick(this.messagesEl, chips, (c)=>this.handle(c)); }
  async handle(text) {
    this.sayUser(text);
    const t = typing(this.messagesEl);
    await new Promise(r=>setTimeout(r,300));
    t.remove();
    const { intent, entities } = classify(text);
    const kb = (await import("./knowledge.js")).getKB();
    switch(intent) {
      case "general.greeting": this.sayBot("Hello! Ready to plan your next trip?"); this.quick(["Show packages","Plan honeymoon","Visa info"]); break;
      case "general.goodbye": this.sayBot("Thanks for chatting! Have a great day."); break;
      case "honeymoon.planning": {
        const d = entities.destination;
        if (d && honeymoon(d)) {
          const h = honeymoon(d);
          this.sayBot(`Great choice! For ${d}, here are romantic experiences: ${(h.experiences||[]).join(", ")}.`);
          (h.packages||[]).forEach(s=>{const p=(kb.packages||[]).find(x=>x.slug===s); if(p) renderCard(this.messagesEl,p,kb);});
        } else {
          this.sayBot("I can help plan your honeymoon! Which destination are you considering? (Maldives, Switzerland...)");
        }
        this.quick(["Maldives honeymoon","Switzerland honeymoon","Contact agent"]);
        break;
      }
      case "package.discovery": {
        const list = searchPackages(text, {category:entities.category, dest:entities.destination, maxPrice:entities.maxPrice});
        if (list.length) { this.sayBot(`Found ${list.length} package(s):`); list.forEach(p=>renderCard(this.messagesEl,p,kb)); }
        else this.sayBot("No matching packages found. Try different filters.");
        this.quick(["Show all packages","Plan honeymoon","Contact agent"]);
        break;
      }
      case "visa.requirements": {
        const info = visaInfo(entities.destination);
        if (info) this.sayBot(`${entities.destination}: ${info.type}. Cost ${info.cost}. Processing ${info.processing}. Validity ${info.validity}. Requirements: ${(info.requirements||[]).join(", ")}.`);
        else this.sayBot("Which destination's visa info do you need?");
        break;
      }
      case "destination.info": {
        const bt = bestTime(entities.destination);
        if (bt) this.sayBot(`Best time to visit ${entities.destination}: ${bt.months}. ${bt.summary}`);
        else this.sayBot("Ask me about best time to visit a destination.");
        break;
      }
      case "travel.tips": this.sayBot("Tips: "+(kb.travelTips?.packing||[]).join("; ")); break;
      case "service.inquiry": this.sayBot("Our services: "+services().map(s=>s.name).join(", ")); break;
      case "booking.assistance": { this.sayBot("You can enquire via WhatsApp for quick assistance."); const b=document.createElement("button"); b.className="cb-btn primary"; b.textContent="Open WhatsApp"; b.onclick=()=>window.open(whatsappLink(),"_blank"); this.messagesEl.appendChild(b); this.messagesEl.scrollTop=this.messagesEl.scrollHeight; break; }
      default: this.sayBot("I'm still learning. Let me connect you to an agent."); const b=document.createElement("button"); b.className="cb-btn primary"; b.textContent="Chat on WhatsApp"; b.onclick=()=>window.open(whatsappLink(text),"_blank"); this.messagesEl.appendChild(b); this.messagesEl.scrollTop=this.messagesEl.scrollHeight;
    }
  }
}
