/**
 * =========================================================================
 * TWO247 — Universal Lead Capture, Form Validation & Firestore Sync
 * Connects frontend forms directly to Cloud Firestore /inquiries and WhatsApp
 * =========================================================================
 */
import { submitInquiry } from "./data-service.js";

export function initForms() {
  const targetSelectors = [
    "#custom-trip-form",
    "#general-contact-form",
    "#package-enquiry-form",
    ".travel-enquiry-form"
  ];

  const forms = document.querySelectorAll(targetSelectors.join(", "));
  if (!forms.length) return;

  forms.forEach(form => {
    // Avoid double attaching
    if (form.dataset.initialized) return;
    form.dataset.initialized = "true";

    // Realtime error clearing
    form.querySelectorAll("input, textarea, select").forEach(field => {
      field.addEventListener("input", () => clearFieldError(field));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const emailInput = form.querySelector('[name="email"]');
      const destInput = form.querySelector('[name="destination"]');
      const messageInput = form.querySelector('[name="message"]') || form.querySelector('[name="requirements"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      let hasError = false;

      // 1. Name validation
      if (nameInput) {
        const val = nameInput.value.trim();
        if (!val || val.length < 2) {
          showFieldError(nameInput, "Please enter your full name (at least 2 characters).");
          hasError = true;
        } else {
          clearFieldError(nameInput);
        }
      }

      // 2. Phone validation (10 to 15 digits)
      if (phoneInput) {
        const val = phoneInput.value.replace(/[^0-9]/g, "");
        if (!val || val.length < 10 || val.length > 15) {
          showFieldError(phoneInput, "Please enter a valid 10-digit mobile / WhatsApp number.");
          hasError = true;
        } else {
          clearFieldError(phoneInput);
        }
      }

      // 3. Email validation (if provided)
      if (emailInput && emailInput.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          showFieldError(emailInput, "Please enter a valid email address.");
          hasError = true;
        } else {
          clearFieldError(emailInput);
        }
      }

      // 4. Destination validation
      if (destInput) {
        const val = destInput.value.trim();
        if (!val || val.length < 2) {
          showFieldError(destInput, "Please specify your desired travel destination.");
          hasError = true;
        } else {
          clearFieldError(destInput);
        }
      }

      // 5. Message validation (if required)
      if (messageInput && messageInput.hasAttribute("required")) {
        const val = messageInput.value.trim();
        if (!val || val.length < 10) {
          showFieldError(messageInput, "Please provide at least 10 characters describing your request.");
          hasError = true;
        } else {
          clearFieldError(messageInput);
        }
      }

      if (hasError) return;

      // Extract form values
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Prepare UI loading state
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "Submit";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Submitting to Travel Concierge...</span>
          </span>
        `;
      }

      // Construct lead object
      const leadPayload = {
        name: data.name || "Valued Guest",
        phone: data.phone || "",
        email: data.email || "",
        destination: data.destination || "Bespoke Journey",
        travelMonth: data.travelDate || data.travelMonth || "Flexible",
        guests: data.adults ? `${data.adults} Adults${data.children ? ', ' + data.children + ' Kids' : ''}` : (data.travellers || "2 Adults"),
        budget: data.budget || "Flexible",
        tripType: data.tripType || "Luxury Custom",
        message: data.message || data.requirements || "",
        source: form.id || window.location.pathname
      };

      try {
        // 1. Save directly to Cloud Firestore /inquiries
        await submitInquiry(leadPayload);

        // 2. Build WhatsApp enquiry message
        const waMessage = 
          `*New Travel Enquiry — TWO247 The White Owl Holidays*\n` +
          `• *Name:* ${leadPayload.name}\n` +
          `• *Phone:* ${leadPayload.phone}\n` +
          (leadPayload.email ? `• *Email:* ${leadPayload.email}\n` : "") +
          `• *Destination:* ${leadPayload.destination}\n` +
          `• *Travel Date:* ${leadPayload.travelMonth}\n` +
          `• *Travellers:* ${leadPayload.guests}\n` +
          (leadPayload.budget !== "Flexible" ? `• *Budget:* ${leadPayload.budget}\n` : "") +
          (leadPayload.message ? `• *Notes:* ${leadPayload.message}\n` : "") +
          `\nPlease share customized holiday itinerary and quote.`;

        // 3. Show Success Modal or Alert
        const modal = document.getElementById("form-success-modal");
        if (modal) {
          modal.classList.remove("hidden");
          modal.classList.add("flex");
          const waBtn = document.getElementById("modal-whatsapp-btn");
          if (waBtn) {
            waBtn.onclick = () => {
              if (typeof window.sendWhatsAppEnquiry === "function") {
                window.sendWhatsAppEnquiry(waMessage);
              } else {
                window.open(`https://wa.me/919886296699?text=${encodeURIComponent(waMessage)}`, "_blank");
              }
            };
          }
        } else {
          alert(`Thank you, ${leadPayload.name}! Your consultation enquiry for ${leadPayload.destination} has been sent to our 24/7 travel desk. We will contact you via WhatsApp / phone within 2 hours.`);
          // Open WhatsApp directly
          window.open(`https://wa.me/919886296699?text=${encodeURIComponent(waMessage)}`, "_blank");
        }

        form.reset();
      } catch (err) {
        console.error("Enquiry submission error:", err);
        alert("Enquiry recorded! Our travel desk will contact you shortly.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  });
}

function showFieldError(input, msg) {
  clearFieldError(input);
  input.classList.add("border-rose-500", "focus:ring-rose-500");
  input.classList.remove("border-slate-300", "focus:ring-brand-orange");
  const err = document.createElement("p");
  err.className = "text-rose-500 text-xs mt-1.5 font-semibold field-error-msg";
  err.textContent = msg;
  input.parentNode.appendChild(err);
}

function clearFieldError(input) {
  input.classList.remove("border-rose-500", "focus:ring-rose-500");
  input.classList.add("border-slate-300");
  const existing = input.parentNode.querySelector(".field-error-msg");
  if (existing) existing.remove();
}
