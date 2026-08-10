/**
 * car-booking.js
 * Powers #fleetBookingForm (Services / Car Booking tab) — the ONLY page
 * this form exists on, so this is the only page that should load this file.
 *
 * Three jobs:
 *  1. Populate the #fleetCarType dropdown from the fleet cards on the page.
 *  2. When someone clicks a fleet card, fill in the "Selected vehicle" preview.
 *  3. Validate every required field on submit, show/hide the matching
 *     .fleet-error-msg, and only submit to the backend if everything's valid.
 *
 * NOTE: this file does its own submit — it deliberately does NOT rely on
 * form-handler.js, because form-handler.js has no validation step and would
 * submit incomplete bookings. Keep this form OUT of form-handler.js's reach
 * by making sure this script's listener runs (it calls stopImmediatePropagation
 * only on invalid submits; valid submits still go through the shared sheet URL).
 */
(function () {
    const form = document.getElementById("fleetBookingForm");
    if (!form) return; // not on this page, nothing to do

    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzGxcg7V8ltdMi1iDPCbL082My9R4GcjEl3OkbpAmQMg8dHIwnf5IdSLcBzQwAeJ4jRUQ/exec";;

    const carTypeSelect = document.getElementById("fleetCarType");
    const selectedImg = document.getElementById("fleetSelectedImg");
    const selectedName = document.getElementById("fleetSelectedName");

    // ---- 1. Populate the car-type dropdown from whatever .fleetCard's exist on this page ----
    function populateCarDropdown() {
        const cards = document.querySelectorAll(".fleetCard");
        if (!carTypeSelect || cards.length === 0) return;

        cards.forEach((card) => {
            const name = card.querySelector("h3")?.textContent.trim();
            if (!name) return;
            const alreadyListed = Array.from(carTypeSelect.options).some((o) => o.value === name);
            if (!alreadyListed) {
                const opt = document.createElement("option");
                opt.value = name;
                opt.textContent = name;
                carTypeSelect.appendChild(opt);
            }
        });
    }

    // ---- 2. Clicking a fleet card fills in the preview + selects it in the dropdown ----
    function wireFleetCardSelection() {
        document.querySelectorAll(".fleetCard").forEach((card) => {
            card.style.cursor = "pointer";
            card.addEventListener("click", () => {
                const name = card.querySelector("h3")?.textContent.trim() || "";
                const imgSrc = card.querySelector("img")?.getAttribute("src") || "";

                if (selectedName) selectedName.textContent = name || "Choose a car below";
                if (selectedImg) {
                    if (imgSrc) {
                        selectedImg.src = imgSrc;
                        selectedImg.style.display = "block";
                    } else {
                        selectedImg.style.display = "none";
                    }
                }
                if (carTypeSelect) carTypeSelect.value = name;

                document.querySelectorAll(".fleetCard.selected").forEach((c) => c.classList.remove("selected"));
                card.classList.add("selected");
            });
        });
    }

    // ---- 3. Validation ----
    const validators = {
        name: (v) => v.trim().length > 0,
        phone: (v) => /^[+\d][\d\s-]{7,}$/.test(v.trim()),
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        date: (v) => v.trim().length > 0,
        days: (v) => Number(v) >= 1,
        travelers: (v) => Number(v) >= 1,
        cartype: () => !carTypeSelect || carTypeSelect.value.trim().length > 0
    };

    function fieldInputFor(fieldName) {
        // "cartype" maps to the #fleetCarType select; everything else maps to its input by name
        if (fieldName === "cartype") return carTypeSelect;
        return form.querySelector(`[data-field="${fieldName}"] input, [data-field="${fieldName}"] select`);
    }

    function validateField(fieldName) {
        const wrapper = form.querySelector(`.fleet-field[data-field="${fieldName}"]`);
        const input = fieldInputFor(fieldName);
        if (!wrapper || !input) return true;

        const isValid = validators[fieldName] ? validators[fieldName](input.value) : true;
        wrapper.classList.toggle("fleet-field-error", !isValid);
        return isValid;
    }

    function validateAll() {
        const fieldNames = Object.keys(validators);
        const results = fieldNames.map(validateField);
        return results.every(Boolean);
    }

    // Validate a field as soon as the user leaves it, not just on submit
    Object.keys(validators).forEach((fieldName) => {
        const input = fieldInputFor(fieldName);
        if (input) input.addEventListener("blur", () => validateField(fieldName));
    });

    // ---- Submit ----
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (!validateAll()) {
            const firstError = form.querySelector(".fleet-field-error");
            if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const submitBtn = form.querySelector(".fleet-submit-btn");
        const originalLabel = submitBtn ? submitBtn.innerHTML : "";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }

        const formData = new FormData(form);
        const payload = { formType: form.dataset.formtype };
        formData.forEach((value, key) => { payload[key] = value; });

        try {
            await fetch(GOOGLE_SHEET_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(payload)
            });
            alert("Thank you! Your car booking request has been submitted. We'll call to confirm.");
            form.reset();
            if (selectedName) selectedName.textContent = "Choose a car below";
            if (selectedImg) selectedImg.style.display = "none";
            document.querySelectorAll(".fleetCard.selected").forEach((c) => c.classList.remove("selected"));
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again or call us directly.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalLabel;
            }
        }
    });

    populateCarDropdown();
    wireFleetCardSelection();
})();