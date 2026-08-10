//    <!-- for footer form -->
        //  <script>
      // footer-form-handler.js
// Handles ONLY the footer "Get in Touch" form (#footerEnquiryForm).
// Scoped by unique ID (not a generic selector) so it cannot collide
// with any other form-submission script on the page (e.g. an OTP-based
// enquiry-form.js/otp-form.js bound to a different form).

(function () {
  // Replace with your deployed Apps Script Web App URL
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby9VzqY-cSd5Uj3mXI7RJsPpT4joZobZwrm-Fhoe0-T3rNXzoUUqoqisJrXzlBuMeQ4YA/exec";

  // Unique to this form only
  const FORM_ID = "footerEnquiryForm";
  const FORM_TYPE = "Footer Enquiry";

  function initForm() {
    const form = document.getElementById(FORM_ID);
    if (!form) return; // form not on this page, nothing to do

    if (form.dataset.handlerBound === "true") return; // avoid double-binding
    form.dataset.handlerBound = "true";
    form.addEventListener("submit", handleSubmit);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation(); // extra safety: don't let any other listener on this event also fire

    const form = e.currentTarget;
    const submitBtn = form.querySelector('button[type="submit"]');

    const formData = new FormData(form);
    const data = { formType: FORM_TYPE };
    formData.forEach((value, key) => {
      data[key] = typeof value === "string" ? value.trim() : value;
    });

    if (!data.name || !data.email || !data.phone) {
      showStatus(form, "Please fill in your name, email and phone.", "error");
      return;
    }

    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
    setLoading(submitBtn, true, originalBtnHTML);

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.result === "success") {
        showStatus(form, "Thanks! Your enquiry has been sent.", "success");
        form.reset();
      } else {
        showStatus(form, result.message || "Something went wrong. Try again.", "error");
      }
    } catch (err) {
      console.error("Footer form submission failed:", err);
      showStatus(form, "Network error. Please try again.", "error");
    } finally {
      setLoading(submitBtn, false, originalBtnHTML);
    }
  }

  function setLoading(button, isLoading, originalHTML) {
    if (!button) return;
    button.disabled = isLoading;
    button.innerHTML = isLoading ? "Sending..." : originalHTML;
  }

  function showStatus(form, message, type) {
    let statusEl = form.querySelector(".form-status-msg");
    if (!statusEl) {
      statusEl = document.createElement("div");
      statusEl.className = "form-status-msg";
      form.appendChild(statusEl);
    }
    statusEl.textContent = message;
    statusEl.classList.remove("success", "error");
    statusEl.classList.add(type);

    clearTimeout(statusEl._clearTimer);
    statusEl._clearTimer = setTimeout(() => {
      statusEl.textContent = "";
      statusEl.classList.remove("success", "error");
    }, 5000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initForm);
  } else {
    initForm();
  }
})();
        
    
