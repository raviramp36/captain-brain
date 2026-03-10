// CFT Inventory Management System v3 - Apps Script Backend
// Spreadsheet ID: 1k9-SqlSL3Mv0RqQc44SLp4HAIUzTq_PEaVd48cFVfw0
// URL: https://docs.google.com/spreadsheets/d/1k9-SqlSL3Mv0RqQc44SLp4HAIUzTq_PEaVd48cFVfw0/edit

const SHEET_ID = '1k9-SqlSL3Mv0RqQc44SLp4HAIUzTq_PEaVd48cFVfw0';

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch(action) {
      case 'getInventory':
        return getInventory();
      case 'addItem':
        return addItem(e.parameter);
      case 'updateItem':
        return updateItem(e.parameter);
      case 'deleteItem':
        return deleteItem(e.parameter);
      case 'getBuilds':
        return getBuilds();
      case 'getBuildItems':
        return getBuildItems(e.parameter.buildId);
      default:
        return jsonResponse({error: 'Unknown action: ' + action});
    }
  } catch(error) {
    return jsonResponse({error: error.toString()});
  }
}

function doPost(e) {
  return doGet(e);
}

function getInventory() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0]; // First sheet
  const data = sheet.getDataRange().getValues();
  
  if (data.length === 0) {
    return jsonResponse([]);
  }
  
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  
  return jsonResponse(rows);
}

function addItem(params) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  
  const itemId = params.itemId || generateItemId();
  const newRow = [
    itemId,
    params.itemName || '',
    params.category || '',
    params.quantity || 1,
    params.status || 'Available',
    params.location || 'Warehouse',
    params.value || 0,
    new Date().toLocaleDateString(),
    params.notes || ''
  ];
  
  sheet.appendRow(newRow);
  
  return jsonResponse({
    success: true,
    itemId: itemId,
    message: 'Item added successfully'
  });
}

function updateItem(params) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const itemIdIndex = headers.indexOf('Item ID');
  
  if (itemIdIndex === -1) {
    return jsonResponse({success: false, error: 'Item ID column not found'});
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][itemIdIndex] === params.itemId) {
      // Update the row
      headers.forEach((header, colIndex) => {
        if (params[header] !== undefined && colIndex !== itemIdIndex) {
          sheet.getRange(i + 1, colIndex + 1).setValue(params[header]);
        }
      });
      
      return jsonResponse({
        success: true,
        message: 'Item updated successfully'
      });
    }
  }
  
  return jsonResponse({success: false, error: 'Item not found'});
}

function deleteItem(params) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const itemIdIndex = headers.indexOf('Item ID');
  
  if (itemIdIndex === -1) {
    return jsonResponse({success: false, error: 'Item ID column not found'});
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][itemIdIndex] === params.itemId) {
      sheet.deleteRow(i + 1);
      return jsonResponse({
        success: true,
        message: 'Item deleted successfully'
      });
    }
  }
  
  return jsonResponse({success: false, error: 'Item not found'});
}

function getBuilds() {
  return jsonResponse([]);  // To be implemented
}

function getBuildItems(buildId) {
  return jsonResponse([]);  // To be implemented
}

function generateItemId() {
  const prefix = 'ITM';
  const timestamp = new Date().getTime().toString().slice(-6);
  return `${prefix}-${timestamp}`;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
