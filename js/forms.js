/**
 * TWO247 — Form Validation & Lead Generator
 * Validates fields (phone, email, destination, message) with real-time feedback
 * and generates pre-filled WhatsApp enquiry routing without pretending fake backend success.
 */
export function initForms() {
  const forms = document.querySelectorAll('.travel-enquiry-form');
  if (!forms.length) return;

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = form.querySelector('[name="name"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const emailInput = form.querySelector('[name="email"]');
      const destInput = form.querySelector('[name="destination"]');
      const messageInput = form.querySelector('[name="message"]');
      const statusBox = form.querySelector('.form-status');

      // Helper validation
      const setError = (input, msg) => {
        isValid = false;
        input.classList.add('border-red-500', 'focus:ring-red-400');
        input.classList.remove('border-slate-200', 'focus:ring-brand-orange');
        let errText = input.parentElement.querySelector('.error-msg');
        if (!errText) {
          errText = document.createElement('p');
          errText.className = 'error-msg text-xs text-red-500 mt-1.5';
          input.parentElement.appendChild(errText);
        }
        errText.textContent = msg;
      };

      const clearError = (input) => {
        input.classList.remove('border-red-500', 'focus:ring-red-400');
        input.classList.add('border-slate-200', 'focus:ring-brand-orange');
        const errText = input.parentElement.querySelector('.error-msg');
        if (errText) errText.remove();
      };

      // Name validation
      if (nameInput) {
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
          setError(nameInput, 'Please enter your full name (minimum 2 characters).');
        } else {
          clearError(nameInput);
        }
      }

      // Phone validation (10+ digits)
      if (phoneInput) {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.replace(/\s+/g, ''))) {
          setError(phoneInput, 'Please enter a valid phone number with country code if applicable.');
        } else {
          clearError(phoneInput);
        }
      }

      // Email validation (optional but if provided must be valid)
      if (emailInput && emailInput.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          setError(emailInput, 'Please enter a valid email address.');
        } else {
          clearError(emailInput);
        }
      }

      // Destination validation
      if (destInput && (!destInput.value || destInput.value === '')) {
        setError(destInput, 'Please select or enter your preferred destination.');
      } else if (destInput) {
        clearError(destInput);
      }

      if (!isValid) return;

      // Submit State
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-navy inline" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Preparing WhatsApp Trip Plan...
        `;
      }

      // Create pre-filled WhatsApp message for lead routing
      const name = nameInput ? nameInput.value.trim() : 'Guest';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : 'N/A';
      const dest = destInput ? destInput.value.trim() : 'Unspecified';
      const message = messageInput ? messageInput.value.trim() : 'I would like to plan a trip with TWO247.';

      const waText = encodeURIComponent(
        `*New Trip Enquiry — TWO247 The White Owl Holidays*\n` +
        `• *Name:* ${name}\n` +
        `• *Phone:* ${phone}\n` +
        `• *Email:* ${email}\n` +
        `• *Destination:* ${dest}\n` +
        `• *Requirements:* ${message}\n\n` +
        `Please share customized holiday package options.`
      );

      setTimeout(() => {
        if (statusBox) {
          statusBox.classList.remove('hidden', 'text-red-600', 'bg-red-50');
          statusBox.classList.add('text-emerald-700', 'bg-emerald-50', 'border', 'border-emerald-200');
          statusBox.innerHTML = `
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Enquiry Prepared!</strong> Opening WhatsApp with our 24/7 travel desk...</span>
            </div>
          `;
        }

        // WhatsApp direct link (standard Indian business format or company placeholder)
        const waUrl = `https://wa.me/919499907081?text=${waText}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 700);
    });
  });
}
