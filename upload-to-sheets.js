const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');

// Data from Excel
const inventoryData = require('./cft-inventory-sheet1.json');
const buildsData = require('./cft-inventory-builds.json');
const buildItemsData = require('./cft-inventory-build_items.json');

console.log('📊 Inventory items:', inventoryData.length);
console.log('🔨 Builds:', buildsData.length);
console.log('🧩 Build items:', buildItemsData.length);

// We need Google Service Account credentials to upload
// For now, let's create the structure for Apps Script

const appsScriptCode = `
// CFT Inventory Management System - Apps Script Backend
// Auto-generated from Excel data

const SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

function doGet(e) {
  const action = e.parameter.action;
  
  switch(action) {
    case 'getInventory':
      return getInventory();
    case 'getBuilds':
      return getBuilds();
    case 'getBuildItems':
      return getBuildItems(e.parameter.buildId);
    case 'addItem':
      return addItem(e.parameter);
    default:
      return ContentService.createTextOutput(JSON.stringify({error: 'Unknown action'}));
  }
}

function getInventory() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    let obj = {};
    headers.forEach((header, i) => obj[header] = row[i]);
    return obj;
  });
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}

function addItem(params) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Sheet1');
  const newRow = [
    params.itemId || generateItemId(),
    params.itemName,
    params.category,
    params.quantity || 1,
    params.status || 'Available',
    params.location || 'Warehouse',
    params.value || 0,
    new Date(),
    params.notes || ''
  ];
  sheet.appendRow(newRow);
  return ContentService.createTextOutput(JSON.stringify({success: true, itemId: newRow[0]})).setMimeType(ContentService.MimeType.JSON);
}

function generateItemId() {
  return 'ITM-' + new Date().getTime();
}
`;

fs.writeFileSync('APPS_SCRIPT_COMPLETE.gs', appsScriptCode);
console.log('✅ Apps Script code generated: APPS_SCRIPT_COMPLETE.gs');

