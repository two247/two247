// Form Handling, Validation & WhatsApp Integration
// All validation is pure client-side vanilla JS. Never expose private API keys.
document.addEventListener("DOMContentLoaded", () => {
  // WhatsApp Quick Direct Action
  window.sendWhatsAppEnquiry = (customMsg) => {
    const config = window.siteConfig || { contact: { whatsapp: "919499907081" } };
    const phone = config.contact.whatsapp;
    const defaultMsg = customMsg || "Hi TWO247 team, I would like to plan a holiday with your 24/7 travel assistance.";
    const encoded = encodeURIComponent(defaultMsg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  // Validation helpers
  const isValidEmail = (email) => {
    if (!email) return true; // optional unless marked required
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    if (!phone) return false;
    const digitsOnly = phone.replace(/[^0-9]/g, "");
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const showError = (input, message) => {
    clearError(input);
    input.classList.add("border-rose-500", "focus:ring-rose-500");
    const err = document.createElement("p");
    err.className = "text-rose-500 text-xs mt-1 font-semibold field-error-msg";
    err.textContent = message;
    input.parentNode.appendChild(err);
  };

  const clearError = (input) => {
    input.classList.remove("border-rose-500", "focus:ring-rose-500");
    const existing = input.parentNode.querySelector(".field-error-msg");
    if (existing) existing.remove();
  };

  // Generic Form Validator
  const setupFormValidation = (formId, isTripForm = false) => {
    const form = document.getElementById(formId);
    if (!form) return;

    // Realtime error clearing
    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("input", () => clearError(field));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let hasError = false;

      const nameInput = form.querySelector("[name='name']");
      const phoneInput = form.querySelector("[name='phone']");
      const emailInput = form.querySelector("[name='email']");
      const destInput = form.querySelector("[name='destination']");
      const msgInput = form.querySelector("[name='message']") || form.querySelector("[name='requirements']");

      // Validate Name
      if (nameInput && (!nameInput.value || nameInput.value.trim().length < 2)) {
        showError(nameInput, "Please enter your full name (minimum 2 characters).");
        hasError = true;
      }

      // Validate Phone
      if (phoneInput && !isValidPhone(phoneInput.value)) {
        showError(phoneInput, "Please enter a valid 10-digit phone/WhatsApp number.");
        hasError = true;
      }

      // Validate Email (if provided or required)
      if (emailInput && emailInput.value && !isValidEmail(emailInput.value)) {
        showError(emailInput, "Please enter a valid email address.");
        hasError = true;
      }

      // Validate Destination
      if (destInput && (!destInput.value || destInput.value.trim().length < 2)) {
        showError(destInput, "Please enter your desired destination.");
        hasError = true;
      }

      // Validate Message (minimum 10 characters if provided or required)
      if (msgInput && msgInput.hasAttribute("required") && msgInput.value.trim().length < 10) {
        showError(msgInput, "Please provide at least 10 characters describing your request.");
        hasError = true;
      }

      if (hasError) return;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Format WhatsApp fallback message
      const waMessage = `*New Travel Enquiry — TWO247*\n` +
        `• *Name:* ${data.name || "N/A"}\n` +
        `• *Phone:* ${data.phone || "N/A"}\n` +
        (data.destination ? `• *Destination:* ${data.destination}\n` : "") +
        (data.travelDate ? `• *Travel Date:* ${data.travelDate}\n` : "") +
        (data.adults ? `• *Travellers:* Adults: ${data.adults}, Kids: ${data.children || 0}\n` : "") +
        (data.tripType ? `• *Trip Type:* ${data.tripType}\n` : "") +
        (data.budget ? `• *Budget:* ${data.budget}\n` : "") +
        `• *Notes:* ${data.message || data.requirements || "General Inquiry"}`;

      console.log("Verified lead submitted:", data);

      const modal = document.getElementById("form-success-modal");
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        const waBtn = document.getElementById("modal-whatsapp-btn");
        if (waBtn) {
          waBtn.onclick = () => window.sendWhatsAppEnquiry(waMessage);
        }
      } else {
        alert("Thank you, " + data.name + "! We have received your enquiry. Our 24/7 travel desk will contact you shortly.");
      }

      form.reset();
    });
  };

  setupFormValidation("custom-trip-form", true);
  setupFormValidation("general-contact-form", false);
  setupFormValidation("package-enquiry-form", false);

  // Close modal handler
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modal = document.getElementById("form-success-modal");
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    });
  }
});
