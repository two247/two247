import { whatsappLink } from "./knowledge.js";

export function renderMessage(container, role, text) {
  const d = document.createElement("div");
  d.className = "cb-msg " + role;
  d.textContent = text;
  container.appendChild(d);
  container.scrollTop = container.scrollHeight;
}

export function renderCard(container, pkg, kb) {
  const d = document.createElement("div");
  d.className = "cb-card";
  d.innerHTML = `<img src="${pkg.image}" alt="${pkg.name}"/><div style="font-weight:600;margin-top:6px">${pkg.name}</div><div style="font-size:12px;color:#64748b">${pkg.destination} • ${pkg.duration}</div><div class="price">${pkg.startingPrice}</div><div style="font-size:12px">${(pkg.highlights || []).slice(0, 3).join(" · ")}</div>`;
  const actions = document.createElement("div");
  actions.className = "cb-actions";
  const wa = document.createElement("button");
  wa.className = "cb-btn primary";
  wa.textContent = "Enquire WhatsApp";
  wa.onclick = () => window.open(whatsappLink("Hi, I'm interested in " + pkg.name), "_blank");
  actions.appendChild(wa);
  d.appendChild(actions);
  container.appendChild(d);
  container.scrollTop = container.scrollHeight;
}

export function renderQuick(container, chips, onPick) {
  const w = document.createElement("div");
  w.className = "cb-quick";
  chips.forEach((c) => {
    const b = document.createElement("button");
    b.className = "cb-chip";
    b.textContent = c;
    b.onclick = () => onPick(c);
    w.appendChild(b);
  });
  container.appendChild(w);
  container.scrollTop = container.scrollHeight;
}

export function typing(container) {
  const d = document.createElement("div");
  d.className = "typing";
  d.id = "cb-typing";
  d.innerHTML = "<span></span><span></span><span></span>";
  container.appendChild(d);
  container.scrollTop = container.scrollHeight;
  return d;
}
