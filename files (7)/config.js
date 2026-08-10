/**
 * config.js
 * Site-wide configuration, loaded FIRST on every page (before nav.js,
 * form-handler.js, enquiry-form.js, or otp-form.js). Change the URL
 * here ONCE if you ever redeploy the Apps Script — every other script
 * reads it from window.SITE_CONFIG instead of hardcoding its own copy.
 *
 * NOTE: your enquiry-form.js and form-handler.js previously had two
 * DIFFERENT URLs. This uses the one from form-handler.js — confirm
 * that's your current live deployment before uploading.
 */
window.SITE_CONFIG = {
    GOOGLE_SHEET_URL: "https://script.google.com/macros/s/AKfycbw9Kk0xmzgryFpddff0dHNnmlrYv5k8orNg5GjzM7K7nIm85CIWhZwGi-keILyLB6Mh_Q/exec"
};
