/**
 * TWO247 — Legacy form.js shim
 * Re-exports and runs the unified initForms() from forms.js
 */
import { initForms } from "./forms.js";

document.addEventListener("DOMContentLoaded", () => {
  initForms();
});
