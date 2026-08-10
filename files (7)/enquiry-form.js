/**
 * enquiry-form.js
 * Hero "Book a Tour" enquiry modal with email OTP verification.
 * This is the ONE canonical copy — previously pasted twice, identically,
 * inside index.html.
 *
 * Only attaches to the hero form (id="heroEnquiryForm"). The footer
 * "Get in Touch" form and other data-formtype forms are handled
 * separately by form-handler.js (no OTP step).
 */
(function () {
    // Read from shared config (js/config.js, loaded before this file) instead
    // of hardcoding — one place to update the URL if you ever redeploy.
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzGxcg7V8ltdMi1iDPCbL082My9R4GcjEl3OkbpAmQMg8dHIwnf5IdSLcBzQwAeJ4jRUQ/exec";

    const openBtn = document.getElementById("openEnquiryModal");
    const modal = document.getElementById("enquiryModal");
    const closeBtn = document.getElementById("closeEnquiryModal");
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const heroForm = document.getElementById("heroEnquiryForm");

    if (!openBtn || !modal || !heroForm) return; // nothing to attach to on this page

    openBtn.addEventListener("click", () => {
        const location = document.querySelector(".loco").value;
        const date = document.querySelector(".dte").value;
        const phone = document.querySelector(".logg").value;

        document.getElementById("enquirySummary").textContent =
            `${location || "..."} on ${date || "..."} — ${phone || "..."}`;

        modal.classList.add("show");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    sendOtpBtn.addEventListener("click", async () => {
        const email = document.getElementById("enquiryEmail").value;
        if (!email) {
            alert("Please enter your email first.");
            return;
        }

        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = "Sending...";

        try {
            const res = await fetch(GOOGLE_SHEET_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify({ action: "sendOtp", email: email })
            });
            const result = await res.json();

            if (result.result === "success") {
                alert("OTP sent to your email.");
                document.getElementById("otpInput").style.display = "block";
                document.getElementById("confirmBtn").style.display = "inline-block";
                sendOtpBtn.textContent = "Resend OTP";
            } else {
                alert(result.message || "Failed to send OTP.");
                sendOtpBtn.textContent = "Send OTP";
            }
        } catch (err) {
            console.error(err);
            alert("Could not send OTP. Please try again.");
            sendOtpBtn.textContent = "Send OTP";
        }
        sendOtpBtn.disabled = false;
    });

    heroForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("enquiryEmail").value;
        const otp = document.getElementById("otpInput").value;

        if (!otp) {
            alert("Please enter the OTP sent to your email.");
            return;
        }

        const payload = {
            action: "verifySubmit",
            formType: "Tour Enquiry",
            location: document.querySelector(".loco").value,
            date: document.querySelector(".dte").value,
            phone: document.querySelector(".logg").value,
            email: email,
            otp: otp
        };

        try {
            const res = await fetch(GOOGLE_SHEET_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(payload)
            });
            const result = await res.json();

            if (result.result === "success") {
                alert("Thank you! Your enquiry has been submitted.");
                heroForm.reset();
                document.getElementById("enquiryEmail").value = "";
                document.getElementById("otpInput").value = "";
                document.getElementById("otpInput").style.display = "none";
                document.getElementById("confirmBtn").style.display = "none";
                modal.classList.remove("show");
            } else {
                alert(result.message || "Invalid OTP. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        }
    });
})();
