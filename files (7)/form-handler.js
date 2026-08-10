/**
 * form-handler.js
 * Generic backend connector for every form on the site EXCEPT the hero
 * OTP-verified enquiry form (that one keeps its own inline OTP script).
 *
 * Include this ONE file on every page that has a form with a
 * data-formtype="..." attribute (footer "Get in Touch", Newsletter
 * Signup, Traveler Feedback, and any future forms on other pages):
 *
 *   <script src="././form-handler.js"></script>
 *
 * No other JS is needed on those pages for those forms to work.
 */
(function () {
    // Read from shared config (js/config.js, loaded before this file) instead
    // of hardcoding — one place to update the URL if you ever redeploy.
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzGxcg7V8ltdMi1iDPCbL082My9R4GcjEl3OkbpAmQMg8dHIwnf5IdSLcBzQwAeJ4jRUQ/exec";


    function attachGenericForms() {
        document.querySelectorAll("form[data-formtype]").forEach((form) => {
            // Skip the hero enquiry form — it has its own OTP submit flow.
            if (form.id === "heroEnquiryForm") return;

            // Skip any form opted into email OTP verification — otp-form.js
            // handles those instead (send code, confirm, then submit).
            if (form.dataset.otpVerify === "true") return;

            // Avoid double-binding if this script somehow runs twice.
            if (form.dataset.handlerAttached === "true") return;
            form.dataset.handlerAttached = "true";

            form.addEventListener("submit", async function (e) {
                e.preventDefault();

                const btn = form.querySelector("button[type='submit']");
                const originalLabel = btn ? btn.innerHTML : "";
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = "Sending...";
                }

                const formData = new FormData(form);
                const payload = { formType: form.dataset.formtype };
                formData.forEach((value, key) => {
                    payload[key] = value;
                });

                try {
                    await fetch(GOOGLE_SHEET_URL, {
                        method: "POST",
                        mode: "no-cors", // Apps Script response is opaque; we can't read it back
                        headers: { "Content-Type": "text/plain" },
                        body: JSON.stringify(payload),
                    });
                    alert("Thank you! Your request has been submitted. We'll get back to you soon.");
                    form.reset();
                } catch (err) {
                    console.error(err);
                    alert("Something went wrong. Please try again or call us directly at +91 9784568787.");
                } finally {
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = originalLabel;
                    }
                }
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", attachGenericForms);
    } else {
        attachGenericForms();
    }
})();
