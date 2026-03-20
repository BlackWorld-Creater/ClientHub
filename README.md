# ClientHub — Client Registration System
### Complete Setup & Usage Guide

---

## 📦 What's Included

| File | Description |
|------|-------------|
| `client-registration-app.html` | Main web app — open in any browser |
| `ClientHub_Template.xlsx` | Pre-formatted Excel / Google Sheets template |
| `README.md` | This setup guide |

---

## ❓ Does Data Save Automatically to Excel?

**No — not automatically on its own.** The app saves data in two ways:

| Method | How it works |
|--------|-------------|
| **Browser Storage** | Saves automatically in your browser (localStorage). Works offline. Data stays as long as you don't clear browser data. |
| **Google Sheets (Online Excel)** | Saves to Google Sheets in real-time via Google Apps Script. Requires one-time 5-minute setup (see below). |

> ✅ Once the Google Apps Script is set up, **every form submission, edit, and delete syncs automatically** to your online sheet — no manual export needed.

---

## 📋 All Fields — Complete List

### Section 1: Client / Company Details
| Column | Field Name | Required | Notes |
|--------|-----------|----------|-------|
| A | Client ID | Auto | Generated automatically |
| B | Client Code | No | e.g. CL-2024-001 |
| C | Company Name | **YES** | Full legal name |
| D | Industry | **YES** | e.g. IT & Software, Healthcare |
| E | Business Type | No | Pvt. Ltd., LLP, etc. |
| F | GST Number | No | 15-digit GSTIN |
| G | PAN Number | No | 10-character PAN |
| H | Registered Address | No | Full address with PIN |
| I | Company Phone | No | Landline / main number |
| J | Company Email | No | Official company email |
| K | Website | No | Full URL |
| L | Client Since | No | Date of first engagement |

### Section 2: Primary Contact Person
| Column | Field Name | Required | Notes |
|--------|-----------|----------|-------|
| M | CP Name | **YES** | Contact person full name |
| N | CP Designation | **YES** | e.g. CEO, Purchase Manager |
| O | CP Mobile | **YES** | Primary mobile number |
| P | CP Alt Phone | No | Alternate / office phone |
| Q | CP Email | **YES** | Direct email address |
| R | CP Department | No | e.g. IT, Procurement |
| S | CP LinkedIn | No | LinkedIn profile URL |
| T | CP Notes | No | Free text notes |

### Section 3: Secondary Contact Person (Optional)
| Column | Field Name | Required | Notes |
|--------|-----------|----------|-------|
| U | SC Name | No | Secondary contact name |
| V | SC Designation | No | Role / title |
| W | SC Mobile | No | Mobile number |
| X | SC Email | No | Email address |

### Section 4: Reference Details
| Column | Field Name | Required | Notes |
|--------|-----------|----------|-------|
| Y | Referred By | No | Person who referred this client |
| Z | Referrer's Company | No | Organisation of referrer |
| AA | Referrer Mobile | No | Contact number |
| AB | Referrer Email | No | Email of referrer |
| AC | Reference Date | No | When the referral was made |
| AD | Lead Source | No | Referral / Cold Call / Website / Exhibition etc. |
| AE | Relationship Strength | No | Strong / Medium / Weak / New |
| AF | Reference Notes | No | Additional context |

### Section 5: Financials
| Column | Field Name | Required | Notes |
|--------|-----------|----------|-------|
| AG | Annual Revenue (₹) | No | Estimated client annual revenue |
| AH | Credit Limit (₹) | No | Approved credit limit |
| AI | Outstanding (₹) | No | Current outstanding amount |

### Section 6: Status & Meta
| Column | Field Name | Required | Notes |
|--------|-----------|----------|-------|
| AJ | Status | **YES** | Active / Prospect / On Hold / Inactive |
| AK | Registered On | Auto | Date of registration |
| AL | Last Updated | Auto | Date of last edit |

---

## 🚀 Setup Guide — Google Sheets (5 Minutes)

### Step 1 — Prepare Your Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet
2. Name it **ClientHub** (or any name you prefer)
3. Open the `ClientHub_Template.xlsx` file provided — you can see all the column headers
4. In your Google Sheet, paste these headers in **Row 1** (or simply upload the `.xlsx` file to Google Drive and open it as a Google Sheet)

### Step 2 — Open Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. A new tab opens with a code editor
3. Delete all existing code in the editor

### Step 3 — Paste This Script

Copy and paste the entire script below:

```javascript
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getActiveSheet();
  const d = JSON.parse(e.postData.contents);

  if (d.action === 'delete') {
    deleteRow(sh, d.id);
    sendNotification(d, 'deleted');
    return ContentService.createTextOutput('OK');
  }

  if (d.action === 'update') {
    updateRow(sh, d);
    sendNotification(d, 'updated');
    return ContentService.createTextOutput('OK');
  }

  // New client registration
  sh.appendRow([
    d.id, d.clientid, d.company, d.industry, d.biztype,
    d.gst, d.pan, d.address, d.compphone, d.compemail,
    d.website, d.since,
    d.cpname, d.cpdesig, d.cpmobile, d.cpphone2, d.cpemail, d.cpdept, d.cplinkedin,
    d.cp2name, d.cp2desig, d.cp2mobile, d.cp2email,
    d.refname, d.refcompany, d.refmobile, d.refemail,
    d.refdate, d.leadsource, d.relstrength, d.refnotes,
    d.revenue, d.credit, d.remarks,
    d.status, d.registered, new Date().toLocaleString()
  ]);

  sendNotification(d, 'registered');
  return ContentService.createTextOutput('OK');
}

function deleteRow(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function updateRow(sheet, d) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(d.id)) {
      const r = i + 1;
      sheet.getRange(r, 3).setValue(d.company);
      sheet.getRange(r, 4).setValue(d.industry);
      sheet.getRange(r, 13).setValue(d.cpname);
      sheet.getRange(r, 14).setValue(d.cpdesig);
      sheet.getRange(r, 15).setValue(d.cpmobile);
      sheet.getRange(r, 17).setValue(d.cpemail);
      sheet.getRange(r, 35).setValue(d.status);
      sheet.getRange(r, 37).setValue(new Date().toLocaleString());
      break;
    }
  }
}

function sendNotification(d, action) {
  const props = PropertiesService.getScriptProperties();
  const email = props.getProperty('NOTIFY_EMAIL');
  if (!email) return;

  const subject = `ClientHub: "${d.company}" was ${action}`;
  const body = `
Client Registration System — Notification

Action   : ${action.toUpperCase()}
Client   : ${d.company || d.id}
Status   : ${d.status || 'N/A'}
Contact  : ${d.cpname || 'N/A'} (${d.cpmobile || 'N/A'})
Time     : ${new Date().toLocaleString()}

— ClientHub Automated Alert
  `;

  MailApp.sendEmail(email, subject, body);
}
```

### Step 4 — Deploy as Web App

1. Click **Deploy** (top right) → **New deployment**
2. Click the gear icon ⚙ next to "Type" → select **Web app**
3. Fill in:
   - **Description**: ClientHub API
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Click **Authorize access** and allow permissions
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC.../exec`)

### Step 5 — Connect to the App

1. Open `client-registration-app.html` in your browser
2. Paste the Web App URL in the yellow banner at the top of the Dashboard
3. That's it! Every submission now saves to your Google Sheet automatically.

---

## 📧 Email Notifications Setup

To receive email alerts when clients are added, edited, or deleted:

1. In Apps Script, go to **Project Settings** (gear icon on left sidebar)
2. Scroll to **Script Properties** → click **Add script property**
3. Property name: `NOTIFY_EMAIL`
4. Value: `your@email.com` (or multiple: `you@email.com,team@email.com`)
5. Click **Save**

In the app, go to **Settings** → toggle **Enable email alerts** ON.

---

## 🔄 How Sync Works

```
User fills form → Clicks "Save Client"
        ↓
Data saved to Browser localStorage (instant backup)
        ↓
App sends POST request to Google Apps Script URL
        ↓
Apps Script appends a new row to Google Sheet
        ↓
Email notification sent (if configured)
```

For **Edit**: Updates specific columns in the matching row.
For **Delete**: Finds the row by Client ID and deletes it.

---

## 🗂 Excel Template — 3 Sheets Explained

| Sheet | Purpose |
|-------|---------|
| **Client Master** | Main data sheet — all 38 columns, 5 sample rows included |
| **Reference Lists** | Dropdown values for Industry, Status, Lead Source, etc. |
| **Dashboard Summary** | Auto-calculated counts by status and lead source |

> If you upload `ClientHub_Template.xlsx` to Google Drive and open as Google Sheet, the formulas in Dashboard Summary will work automatically.

---

## ❗ Troubleshooting

| Problem | Solution |
|---------|---------|
| Data not saving to Google Sheets | Check the Web App URL in Settings — must start with `https://script.google.com` |
| "Could not sync" error | Re-deploy Apps Script (Deploy → Manage deployments → Edit → New version) |
| Email not arriving | Verify `NOTIFY_EMAIL` is set in Script Properties; check spam folder |
| Data missing after browser cleared | Data in localStorage is lost — Google Sheets is the permanent backup |
| Editing doesn't update sheet | Ensure the script's `updateRow()` function was included when you deployed |

---

## 🔒 Data & Privacy Notes

- The app runs entirely in your browser — no data is sent to any third-party server
- Google Sheets data is stored in your own Google account
- The Apps Script runs under your Google account credentials
- No login or password is required for the HTML app itself

---

## 📞 Quick Reference — Required Fields

When registering a new client, these fields are mandatory:

1. **Company Name**
2. **Industry**
3. **Contact Person Name**
4. **Contact Person Designation**
5. **Contact Person Mobile**
6. **Contact Person Email**
7. **Client Status**

All other fields are optional but recommended for complete records.

---

*ClientHub v1.0 — Built for Delhi, India operations · March 2026*
