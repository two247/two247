const intents = [
  {name:"honeymoon.planning", kw:["honeymoon","romantic","couple","anniversary"]},
  {name:"package.discovery", kw:["package","packages","trip","tour","holiday","destination","destinations"]},
  {name:"service.inquiry", kw:["service","services","custom","corporate","group"]},
  {name:"destination.info", kw:["visit","things to do","best time","weather","season"]},
  {name:"visa.requirements", kw:["visa","passport"]},
  {name:"travel.tips", kw:["tip","tips","packing","currency","insurance"]},
  {name:"booking.assistance", kw:["book","booking","payment","contact","agent","whatsapp","call","phone","number","help","talk","support"]},
  {name:"general.greeting", kw:["hi","hello","hey","good morning","good afternoon","good evening"]},
  {name:"general.goodbye", kw:["bye","thanks","thank you","goodbye"]}
];
export function classify(text) {
  const t = (text||"").toLowerCase();
  let best=null, score=0;
  for (const i of intents) {
    let s = i.kw.reduce((a,k)=> a + (t.includes(k)?1:0),0);
    if (s>score){score=s;best=i.name;}
  }
  // entity extraction
  const destMatch = t.match(/maldives|dubai|thailand|bali|switzerland|turkey|singapore|malaysia|kashmir|paris/i);
  const dest = destMatch?destMatch[0].toLowerCase():null;
  const cat = t.includes("family")?"family": t.includes("luxury")?"luxury": t.includes("adventure")?"adventure": t.includes("honeymoon")?"honeymoon":null;
  const priceMatch = t.match(/under\s*(\d+)/) || t.match(/(\d+)\s*k/);
  let maxPrice = null;
  if (priceMatch) { maxPrice = parseInt(priceMatch[1]); if (t.includes("k") && maxPrice<1000) maxPrice*=1000; }
  return { intent: best||"fallback", confidence: score?0.8:0.3, entities:{ destination:dest, category:cat, maxPrice } };
}
