// CFT Inventory - Google Apps Script
// Deploy this as a Web App with "Anyone" access

function doPost(e) {
  try {
    const action = e.parameter.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Inventory') || ss.getSheets()[0];
    
    if (action === 'add') {
      const data = JSON.parse(e.postData.contents);
      const row = [
        data.itemId,
        data.name,
        data.category,
        data.subCategory,
        data.quantity,
        data.status,
        data.location,
        data.value,
        data.addedDate,
        data.notes,
        data.returnDate || '',
        data.eventProject || '',
        data.vendorName || '',
        data.vendorContact || '',
        data.rentalCost || '',
        data.deposit || ''
      ];
      sheet.appendRow(row);
      return ContentService.createTextOutput(JSON.stringify({success: true, itemId: data.itemId}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'update') {
      const data = JSON.parse(e.postData.contents);
      const rowIndex = data.rowIndex;
      const values = [[
        data.itemId,
        data.name,
        data.category,
        data.subCategory,
        data.quantity,
        data.status,
        data.location,
        data.value,
        data.addedDate,
        data.notes,
        data.returnDate || '',
        data.eventProject || '',
        data.vendorName || '',
        data.vendorContact || '',
        data.rentalCost || '',
        data.deposit || ''
      ]];
      sheet.getRange(rowIndex, 1, 1, 16).setValues(values);
      return ContentService.createTextOutput(JSON.stringify({success: true, rowIndex: rowIndex}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'delete') {
      const row = parseInt(e.parameter.row || JSON.parse(e.postData.contents).rowIndex);
      sheet.deleteRow(row);
      return ContentService.createTextOutput(JSON.stringify({success: true, deletedRow: row}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // DC Operations
    if (action === 'createDC') {
      const data = JSON.parse(e.postData.contents);
      const dcSheet = ss.getSheetByName('DeliveryChannels') || ss.insertSheet('DeliveryChannels');
      
      // Add DC header
      const dcRow = [
        data.dcNumber, data.eventName, data.activity, data.eventDate, data.eventLocation,
        data.clientName, data.clientPOC, data.clientPhone, data.sitePOC, data.sitePhone,
        data.carrierName, data.carrierPhone, data.vehicleNumber, data.dispatchDate,
        data.expectedReturn, data.actualReturn, data.status, data.pmApprover,
        data.approvalDate, data.notes, data.createdDate, data.fromAddress, data.toAddress
      ];
      dcSheet.appendRow(dcRow);
      
      // Add items to DCItems sheet
      const itemsSheet = ss.getSheetByName('DCItems') || ss.insertSheet('DCItems');
      data.items.forEach(item => {
        itemsSheet.appendRow([data.dcNumber, item.itemId, item.name, item.category, item.qty, '', '']);
      });
      
      return ContentService.createTextOutput(JSON.stringify({success: true, dcNumber: data.dcNumber}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'updateDCStatus') {
      const data = JSON.parse(e.postData.contents);
      const dcSheet = ss.getSheetByName('DeliveryChannels');
      const dcData = dcSheet.getDataRange().getValues();
      for (let i = 1; i < dcData.length; i++) {
        if (dcData[i][0] === data.dcNumber) {
          dcSheet.getRange(i + 1, 17).setValue(data.status);
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'dispatchDC') {
      const data = JSON.parse(e.postData.contents);
      const dcSheet = ss.getSheetByName('DeliveryChannels');
      const dcData = dcSheet.getDataRange().getValues();
      for (let i = 1; i < dcData.length; i++) {
        if (dcData[i][0] === data.dcNumber) {
          dcSheet.getRange(i + 1, 14).setValue(data.dispatchDate);
          dcSheet.getRange(i + 1, 17).setValue('Dispatched');
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'closeDC') {
      const data = JSON.parse(e.postData.contents);
      const dcSheet = ss.getSheetByName('DeliveryChannels');
      const dcData = dcSheet.getDataRange().getValues();
      for (let i = 1; i < dcData.length; i++) {
        if (dcData[i][0] === data.dcNumber) {
          dcSheet.getRange(i + 1, 16).setValue(data.actualReturn);
          dcSheet.getRange(i + 1, 17).setValue('Closed');
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'approveDC') {
      const data = JSON.parse(e.postData.contents);
      const dcSheet = ss.getSheetByName('DeliveryChannels');
      const dcData = dcSheet.getDataRange().getValues();
      for (let i = 1; i < dcData.length; i++) {
        if (dcData[i][0] === data.dcNumber) {
          dcSheet.getRange(i + 1, 17).setValue('Approved');
          dcSheet.getRange(i + 1, 18).setValue(data.approver);
          dcSheet.getRange(i + 1, 19).setValue(data.date);
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({error: 'Unknown action'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: 'CFT Inventory API is running'}))
    .setMimeType(ContentService.MimeType.JSON);
}
