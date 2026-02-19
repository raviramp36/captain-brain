function doPost(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Inventory') || ss.getSheetByName('Sheet1') || ss.getSheets()[0];
  
  // INVENTORY OPERATIONS
  if (action === 'add') {
    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([data.itemId, data.name, data.category, data.subCategory, data.quantity, data.status, data.location, data.value, data.addedDate, data.notes, data.returnDate||'', data.eventProject||'', data.vendorName||'', data.vendorContact||'', data.rentalCost||'', data.deposit||'']);
    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'update') {
    const data = JSON.parse(e.postData.contents);
    sheet.getRange(data.rowIndex, 1, 1, 16).setValues([[data.itemId, data.name, data.category, data.subCategory, data.quantity, data.status, data.location, data.value, data.addedDate, data.notes, data.returnDate||'', data.eventProject||'', data.vendorName||'', data.vendorContact||'', data.rentalCost||'', data.deposit||'']]);
    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'delete') {
    const row = parseInt(e.parameter.row || JSON.parse(e.postData.contents).rowIndex);
    sheet.deleteRow(row);
    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  // DAILY LOG OPERATIONS
  if (action === 'createDailyLog') {
    const data = JSON.parse(e.postData.contents);
    let logSheet = ss.getSheetByName('DailyLog');
    
    // Create sheet if it doesn't exist
    if (!logSheet) {
      logSheet = ss.insertSheet('DailyLog');
      logSheet.appendRow(['Log ID', 'Item ID', 'Item Name', 'Team Member', 'Purpose', 'Request Date', 'Expected Return', 'Status', 'Handed Over By', 'Handover Date', 'Return Date', 'Notes']);
    }
    
    logSheet.appendRow([
      data.logId,
      data.itemId,
      data.itemName,
      data.teamMember,
      data.purpose,
      data.requestDate,
      data.expectedReturn,
      data.status || 'Requested',
      data.handedOverBy || '',
      data.handoverDate || '',
      data.returnDate || '',
      data.notes || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({success:true, logId: data.logId})).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'updateDailyLog') {
    const data = JSON.parse(e.postData.contents);
    const logSheet = ss.getSheetByName('DailyLog');
    if (!logSheet) {
      return ContentService.createTextOutput(JSON.stringify({error:'DailyLog sheet not found'})).setMimeType(ContentService.MimeType.JSON);
    }
    
    const logData = logSheet.getDataRange().getValues();
    for (let i = 1; i < logData.length; i++) {
      if (logData[i][0] === data.logId) {
        if (data.status) logSheet.getRange(i + 1, 8).setValue(data.status);
        if (data.handedOverBy) logSheet.getRange(i + 1, 9).setValue(data.handedOverBy);
        if (data.handoverDate) logSheet.getRange(i + 1, 10).setValue(data.handoverDate);
        if (data.returnDate) logSheet.getRange(i + 1, 11).setValue(data.returnDate);
        break;
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({error:'Unknown action'})).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('API Running').setMimeType(ContentService.MimeType.TEXT);
}
