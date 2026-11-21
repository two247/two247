import { Conversation } from "./conversation.js";

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = new URL("./styles.css", import.meta.url).href;
document.head.appendChild(link);

let conv;
export function initChatbot() {
  if (document.getElementById("cb-fab")) return;
  const fab = document.createElement("button");
  fab.id = "cb-fab";
  fab.textContent = "💬";
  fab.setAttribute("aria-label", "Open chat");

  const panel = document.createElement("div");
  panel.id = "cb-panel";
  panel.innerHTML = `
    <div id="cb-header">
      <span>TWO247 Assistant</span>
      <button id="cb-close" aria-label="Close chat">×</button>
    </div>
    <div id="cb-messages"></div>
    <div id="cb-composer">
      <input id="cb-input" placeholder="Ask about destinations, packages..." autocomplete="off"/>
      <button id="cb-send">Send</button>
    </div>
  `;

  document.body.appendChild(panel);
  document.body.appendChild(fab);

  const messages = panel.querySelector("#cb-messages");

  const openChat = async () => {
    panel.classList.add("open");
    document.body.classList.add("cb-open");
    if (!conv) {
      conv = new Conversation(messages);
      await conv.init();
    }
  };

  const closeChat = () => {
    panel.classList.remove("open");
    document.body.classList.remove("cb-open");
  };

  fab.onclick = openChat;
  panel.querySelector("#cb-close").onclick = closeChat;

  const send = () => {
    const inp = panel.querySelector("#cb-input");
    const v = inp.value.trim();
    if (!v) return;
    inp.value = "";
    if (conv) conv.handle(v);
  };

  panel.querySelector("#cb-send").onclick = send;
  panel.querySelector("#cb-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChatbot);
} else {
  initChatbot();
}

export default initChatbot;
