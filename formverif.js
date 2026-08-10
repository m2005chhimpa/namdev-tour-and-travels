
// 
console.log("Loader JS Started");

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM Loaded");

    const loader = document.getElementById("pageLoader");

    // Show loader for at least 800ms (change as needed)
    setTimeout(() => {

        if (loader) {
            loader.classList.add("hide");
            console.log("Loader Hidden");

            setTimeout(() => {
                loader.remove();
            }, 300);
        }

    }, 2000);   // <-- Change this value

});

// 


const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/YOUR_DEPLOYED_URL/exec";

document.querySelectorAll("form[data-formtype]").forEach(form => {
    const emailField = form.querySelector('[name="email"]');
    const submitBtn = form.querySelector('[type="submit"]');

    if (!emailField || !submitBtn) return; // skip forms missing either

    // Build OTP UI and insert before the submit button
    const otpWrap = document.createElement("div");
    otpWrap.className = "otp-wrap";
    otpWrap.innerHTML = `
        <button type="button" class="send-otp-btn">Send OTP</button>
        <input type="text" class="otp-input" placeholder="Enter OTP" style="display:none;">
    `;
    submitBtn.parentNode.insertBefore(otpWrap, submitBtn);
    submitBtn.style.display = "none";

    const sendOtpBtn = otpWrap.querySelector(".send-otp-btn");
    const otpInput = otpWrap.querySelector(".otp-input");

    sendOtpBtn.addEventListener("click", async () => {
        if (!emailField.value) {
            alert("Please enter your email first.");
            return;
        }
        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = "Sending...";

        try {
            const res = await fetch(GOOGLE_SHEET_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify({ action: "sendOtp", email: emailField.value })
            });
            const result = await res.json();

            if (result.result === "success") {
                alert("OTP sent to your email.");
                otpInput.style.display = "inline-block";
                submitBtn.style.display = "inline-block";
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

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (!otpInput.value) {
            alert("Please enter the OTP sent to your email.");
            return;
        }

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
                submitBtn.style.display = "none";
                sendOtpBtn.textContent = "Send OTP";
            } else {
                alert(result.message || "Invalid OTP. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        }
    });
});






// for animation
function setLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.classList.add("btn-loading");
        button.disabled = true;
    } else {
        button.classList.remove("btn-loading");
        button.disabled = false;
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
    }
}

// 
sendOtpBtn.addEventListener("click", async () => {
    if (!emailField.value) {
        alert("Please enter your email first.");
        return;
    }
    setLoading(sendOtpBtn, true);

    try {
        const res = await fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ action: "sendOtp", email: emailField.value })
        });
        const result = await res.json();

        setLoading(sendOtpBtn, false);

        if (result.result === "success") {
            alert("OTP sent to your email.");
            otpInput.style.display = "inline-block";
            submitBtn.style.display = "inline-block";
            sendOtpBtn.textContent = "Resend OTP";
        } else {
            alert(result.message || "Failed to send OTP.");
        }
    } catch (err) {
        console.error(err);
        setLoading(sendOtpBtn, false);
        alert("Could not send OTP. Please try again.");
    }
});


    

// 
// Hide loader once everything (images etc.) has finished loading
window.addEventListener("load", () => {
    document.getElementById("pageLoader").classList.add("hide");
});

// Show loader again when navigating to another internal page

// document.querySelectorAll('a[href]').forEach(link => {
//     link.addEventListener("click", function (e) {
//         const href = link.getAttribute("href");
//         // Skip: same-page anchors, external links, javascript: links, new-tab links
//         if (!href || href.startsWith("#") || href.startsWith("javascript:") || link.target === "_blank") {
//             return;
//         }
//         document.getElementById("pageLoader").classList.remove("hide");
//     });
// });
document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("pageLoader");

    if (loader) {
        loader.classList.add("hide");

        setTimeout(() => {
            loader.remove();
        }, 300);
    }

    // Show loader on internal page navigation
    document.querySelectorAll("a[href]").forEach(link => {

        link.addEventListener("click", function (e) {

            const href = this.getAttribute("href");

            // Ignore invalid links
            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("javascript:") ||
                this.target === "_blank" ||
                this.hasAttribute("download")
            ) {
                return;
            }

            // Ignore external links
            if (this.hostname !== window.location.hostname) {
                return;
            }

            // Recreate loader if it was removed
            let loader = document.getElementById("pageLoader");

            if (!loader) {
                loader = document.createElement("div");
                loader.id = "pageLoader";
                loader.innerHTML = '<div class="page-spinner"></div>';
                document.body.appendChild(loader);
            }

            loader.classList.remove("hide");

        });

    });

});


// 
document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("pageLoader");

    setTimeout(() => {
        loader.classList.add("hide");

        setTimeout(() => {
            loader.remove();
        }, 300);

    }, 1000); // Test only

});


console.log("hellow just checking js ki loading or not")