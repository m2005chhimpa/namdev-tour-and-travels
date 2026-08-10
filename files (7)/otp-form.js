/**
 * otp-form.js
 * Adds an email-OTP verification step to any form marked with
 * data-otp-verify="true" — for example the footer "Get in Touch" form,
 * or (later) the Car Booking form. Reuses the SAME backend actions
 * ("sendOtp" / "verifySubmit") that already power the hero Tour Enquiry
 * form, so no new Apps Script endpoint is needed.
 *
 * The hero form is untouched — it keeps its own dedicated modal flow in
 * enquiry-form.js. This file explicitly does nothing to that form.
 *
 * Requirements for any form that opts in:
 *   1. data-otp-verify="true" on the <form> tag
 *   2. an <input name="email"> field inside it
 *   3. a <button type="submit"> inside it
 * That's it — the OTP button/input are created automatically and
 * styled using the .send-otp-btn / .otp-input classes already defined
 * for the hero modal.
 */
(function () {
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzGxcg7V8ltdMi1iDPCbL082My9R4GcjEl3OkbpAmQMg8dHIwnf5IdSLcBzQwAeJ4jRUQ/exec";

    function wireForm(form) {
        const emailField = form.querySelector('[name="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!emailField || !submitBtn) return; // form isn't set up for OTP, skip it safely

        // Insert "Send OTP" button + hidden OTP input right before the submit button
        const wrap = document.createElement("div");
        wrap.className = "otp-wrap";
        wrap.innerHTML = `
            <button type="button" class="send-otp-btn">Send OTP to verify email</button>
            <input type="text" class="otp-input" placeholder="Enter the code we emailed you" style="display:none;">
        `;
        submitBtn.parentNode.insertBefore(wrap, submitBtn);
        submitBtn.style.display = "none"; // hidden until OTP is sent

        const sendBtn = wrap.querySelector(".send-otp-btn");
        const otpInput = wrap.querySelector(".otp-input");

        sendBtn.addEventListener("click", async () => {
            const email = emailField.value;
            if (!email) {
                alert("Please enter your email first.");
                return;
            }
            sendBtn.disabled = true;
            sendBtn.textContent = "Sending...";

            try {
                const res = await fetch(GOOGLE_SHEET_URL, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain" },
                    body: JSON.stringify({ action: "sendOtp", email: email })
                });
                const result = await res.json();

                if (result.result === "success") {
                    alert("OTP sent to your email.");
                    otpInput.style.display = "inline-block";
                    submitBtn.style.display = "inline-block";
                    sendBtn.textContent = "Resend OTP";
                } else {
                    alert(result.message || "Failed to send OTP.");
                    sendBtn.textContent = "Send OTP to verify email";
                }
            } catch (err) {
                console.error(err);
                alert("Could not send OTP. Please try again.");
                sendBtn.textContent = "Send OTP to verify email";
            }
            sendBtn.disabled = false;
        });

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            if (otpInput.style.display === "none" || !otpInput.value) {
                alert("Please verify your email with the OTP first.");
                return;
            }

            const originalLabel = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            const formData = new FormData(form);
            const payload = { action: "verifySubmit", formType: form.dataset.formtype, otp: otpInput.value };
            formData.forEach((value, key) => { payload[key] = value; });

            try {
                const res = await fetch(GOOGLE_SHEET_URL, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain" },
                    body: JSON.stringify(payload)
                });
                const result = await res.json();

                if (result.result === "success") {
                    alert("Thank you! Your request has been submitted.");
                    form.reset();
                    otpInput.style.display = "none";
                    otpInput.value = "";
                    submitBtn.style.display = "none";
                    sendBtn.textContent = "Send OTP to verify email";
                } else {
                    alert(result.message || "Invalid OTP. Please try again.");
                }
            } catch (err) {
                console.error(err);
                alert("Something went wrong. Please try again.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalLabel;
            }
        });
    }

    function init() {
        document.querySelectorAll('form[data-otp-verify="true"]').forEach(wireForm);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
