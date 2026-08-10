const SHEET_NAME = "Sheet1";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.action === "sendOtp") {
    return sendOtp(data.email);
  }

  if (data.action === "verifySubmit") {
    return verifyAndSubmit(data);
  }

  // Anything without an "action" field is a plain form submission —
  // footer "Get in Touch", Newsletter Signup, Traveler Feedback, or any
  // future form that uses form-handler.js.
  if (data.formType) {
    return saveGenericForm(data);
  }

  return jsonResponse({ result: "error", message: "Unknown request" });
}

function sendOtp(email) {
  if (!email) {
    return jsonResponse({ result: "error", message: "Email required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  CacheService.getScriptCache().put("otp_" + email, otp, 300);

  MailApp.sendEmail({
    to: email,
    subject: "Your verification code - Namdev's Tour & Travels",
    body: "Your OTP is: " + otp + "\nThis code expires in 5 minutes."
  });

  return jsonResponse({ result: "success" });
}

function verifyAndSubmit(data) {
  const cache = CacheService.getScriptCache();
  const storedOtp = cache.get("otp_" + data.email);

  if (!storedOtp || storedOtp !== data.otp) {
    return jsonResponse({ result: "error", message: "Invalid or expired OTP" });
  }
  cache.remove("otp_" + data.email);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  sheet.appendRow([
    new Date(),
    data.formType || "Tour Enquiry",
    data.name || "",
    data.email || "",
    data.phone || "",
    data.location || "",
    data.date || "",
    data.people || "",
    data.car || "",
    data.rating || "",
    data.message || ""
  ]);

  return jsonResponse({ result: "success" });
}

// Handles: footer "Get in Touch", Newsletter Signup, Traveler Feedback,
// and any other form submitted via form-handler.js.
function saveGenericForm(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  sheet.appendRow([
    new Date(),
    data.formType || "",
    data.name || "",
    data.email || "",
    data.phone || "",
    data.location || data.destination || "",
    data.date || "",
    data.count || data.people || "",
    data.car || "",
    data.rating || "",
    data.message || ""
  ]);

  return jsonResponse({ result: "success" });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput("This endpoint is live and accepting POST requests.")
    .setMimeType(ContentService.MimeType.TEXT);
}
