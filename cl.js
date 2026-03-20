function doPost(e) {
  const ss = SpreadsheetApp
    .getActiveSpreadsheet();
  const sh = ss.getActiveSheet();
  const d = JSON.parse(
    e.postData.contents);

  if (d.action==='delete') {
    deleteRow(sh, d.id);
    notify(d,'deleted');
    return ok();
  }
  if (d.action==='update') {
    updateRow(sh, d);
    notify(d,'updated');
    return ok();
  }

  sh.appendRow([
    d.id, d.company, d.clientid,
    d.industry, d.biztype,
    d.gst, d.pan, d.address,
    d.compphone, d.compemail,
    d.website, d.since,
    d.cpname, d.cpdesig,
    d.cpmobile, d.cpemail,
    d.cpdept,
    d.cp2name, d.cp2mobile,
    d.cp2email,
    d.refname, d.refcompany,
    d.refmobile, d.refemail,
    d.refdate, d.leadsource,
    d.relstrength, d.refnotes,
    d.revenue, d.credit,
    d.remarks, d.status,
    d.registered
  ]);
  notify(d,'registered');
  return ok();
}

function deleteRow(sh, id) {
  const rows = sh.getDataRange()
    .getValues();
  for(let i=1;i<rows.length;i++){
    if(rows[i][0]==id){
      sh.deleteRow(i+1); break;
    }
  }
}

function updateRow(sh, d) {
  const rows = sh.getDataRange()
    .getValues();
  for(let i=1;i<rows.length;i++){
    if(rows[i][0]==d.id){
      sh.getRange(i+1,2)
        .setValue(d.company);
      sh.getRange(i+1,4)
        .setValue(d.industry);
      sh.getRange(i+1,13)
        .setValue(d.cpname);
      sh.getRange(i+1,32)
        .setValue(d.status);
      break;
    }
  }
}

function notify(d, act) {
  const email = PropertiesService
    .getScriptProperties()
    .getProperty('NOTIFY_EMAIL');
  if(!email) return;
  MailApp.sendEmail(email,
   'ClientHub: '+d.company+' '+act,
   'Client "'+d.company+
   '" was '+act+'.'
  );
}

function ok() {
  return ContentService
    .createTextOutput('OK');
}