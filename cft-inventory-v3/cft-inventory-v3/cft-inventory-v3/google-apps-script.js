/**
 * CFT Inventory & Purchase System - Google Apps Script
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheet: https://docs.google.com/spreadsheets/d/1MrwDU0XtemyfpwWNX551ulfUIAFECB4cLCPhNJH1yuo/edit
 * 2. Create sheet named "PurchaseRequests" with headers:
 *    PR Number | Item Name | Description | Quantity | Project | Department | Requested By | Priority | Needed By | Vendor | Status | Created Date | Approved By | Approved Date | Ordered Date | Received Date | Notes
 * 3. Go to Extensions > Apps Script
 * 4. Delete any existing code and paste this entire script
 * 5. Click Deploy > New deployment (or Manage deployments > Edit)
 * 6. Select type: Web app
 * 7. Set "Execute as": Me
 * 8. Set "Who has access": Anyone
 * 9. Click Deploy and copy the Web App URL
 */

const INVENTORY_SHEET = 'Sheet1';
const PR_SHEET = 'PurchaseRequests';
const DC_SHEET = 'DeliveryChannels';
const DC_ITEMS_SHEET = 'DCItems';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    let data;
    try {
      data = e.postData ? JSON.parse(e.postData.contents) : {};
    } catch(parseError) {
      data = {};
    }
    
    const action = data.action || e.parameter.action;
    let result;
    
    switch(action) {
      // Inventory actions
      case 'get':
        result = getData(ss.getSheetByName(INVENTORY_SHEET));
        break;
      case 'add':
        result = addInventoryRow(ss.getSheetByName(INVENTORY_SHEET), data);
        break;
      case 'update':
        result = updateInventoryRow(ss.getSheetByName(INVENTORY_SHEET), data);
        break;
      case 'delete':
        result = deleteRow(ss.getSheetByName(INVENTORY_SHEET), parseInt(e.parameter.row));
        break;
        
      // DC actions
      case 'createDC':
        result = createDC(ss, data.data);
        break;
      case 'updateDCStatus':
        result = updateDCStatus(ss, data);
        break;
        
      // Purchase Request actions
      case 'createPR':
        result = createPR(ss, data.data);
        break;
      case 'updatePRStatus':
        result = updatePRStatus(ss, data);
        break;
      case 'updatePR':
        result = updatePR(ss, data);
        break;
        
      default:
        result = { error: 'Unknown action: ' + action };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================== INVENTORY FUNCTIONS ====================

function getData(sheet) {
  const data = sheet.getDataRange().getValues();
  return { values: data };
}

function addInventoryRow(sheet, data) {
  sheet.appendRow([
    data.itemId,
    data.name,
    data.category,
    data.subCategory || '',
    data.quantity,
    data.status,
    data.location || '',
    data.value,
    data.addedDate,
    data.notes || ''
  ]);
  return { success: true, message: 'Row added' };
}

function updateInventoryRow(sheet, data) {
  const rowIndex = data.rowIndex;
  const rowData = data.values;
  
  sheet.getRange(rowIndex, 1, 1, 10).setValues([[
    rowData.itemId,
    rowData.name,
    rowData.category,
    rowData.subCategory || '',
    rowData.quantity,
    rowData.status,
    rowData.location || '',
    rowData.value,
    rowData.addedDate,
    rowData.notes || ''
  ]]);
  
  return { success: true, message: 'Row updated' };
}

function deleteRow(sheet, rowIndex) {
  sheet.deleteRow(rowIndex);
  return { success: true, message: 'Row deleted' };
}

// ==================== DC FUNCTIONS ====================

function createDC(ss, data) {
  let dcSheet = ss.getSheetByName(DC_SHEET);
  if (!dcSheet) {
    dcSheet = ss.insertSheet(DC_SHEET);
    dcSheet.appendRow(['DC Number', 'Event Name', 'Activity', 'Event Date', 'Event Location', 'Client Name', 'Client POC', 'Client Phone', 'Site POC', 'Site Phone', 'Carrier Name', 'Carrier Phone', 'Vehicle Number', 'Dispatch Date', 'Expected Return', 'Actual Return', 'Status', 'PM Approver', 'Created Date', 'Notes', 'From Address', 'To Address']);
  }
  
  dcSheet.appendRow([
    data.dcNumber,
    data.eventName,
    data.activity,
    data.eventDate,
    data.eventLocation,
    data.clientName,
    data.clientPOC || '',
    data.clientPhone || '',
    data.sitePOC || '',
    data.sitePhone || '',
    data.carrierName,
    data.carrierPhone || '',
    data.vehicleNumber || '',
    data.dispatchDate || '',
    data.expectedReturn,
    '',
    data.status || 'Draft',
    data.pmApprover || '',
    data.createdDate || new Date().toISOString().split('T')[0],
    data.notes || '',
    data.fromAddress || '',
    data.toAddress || ''
  ]);
  
  return { success: true, message: 'DC created', dcNumber: data.dcNumber };
}

function updateDCStatus(ss, data) {
  const sheet = ss.getSheetByName(DC_SHEET);
  if (!sheet) return { error: 'DC sheet not found' };
  
  const dataRange = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.dcNumber) {
      sheet.getRange(i + 1, 17).setValue(data.status); // Status column
      if (data.pmApprover) {
        sheet.getRange(i + 1, 18).setValue(data.pmApprover);
      }
      if (data.dispatchDate) {
        sheet.getRange(i + 1, 14).setValue(data.dispatchDate);
      }
      return { success: true, message: 'DC status updated' };
    }
  }
  
  return { error: 'DC not found' };
}

// ==================== PURCHASE REQUEST FUNCTIONS ====================

function createPR(ss, data) {
  let prSheet = ss.getSheetByName(PR_SHEET);
  if (!prSheet) {
    prSheet = ss.insertSheet(PR_SHEET);
    prSheet.appendRow(['PR Number', 'Item Name', 'Description', 'Quantity', 'Project', 'Department', 'Requested By', 'Priority', 'Needed By', 'Vendor', 'Status', 'Created Date', 'Approved By', 'Approved Date', 'Ordered Date', 'Received Date', 'Notes']);
  }
  
  prSheet.appendRow([
    data.prNumber,
    data.itemName,
    data.description || '',
    data.quantity,
    data.project,
    data.department,
    data.requestedBy,
    data.priority,
    data.neededBy,
    data.vendor || '',
    data.status || 'Request',
    data.createdDate || new Date().toISOString().split('T')[0],
    '', // Approved By
    '', // Approved Date
    '', // Ordered Date
    '', // Received Date
    ''  // Notes
  ]);
  
  return { success: true, message: 'PR created', prNumber: data.prNumber };
}

function updatePRStatus(ss, data) {
  // Legacy function - redirect to updatePR
  return updatePR(ss, { prNumber: data.prNumber, updates: { status: data.status } });
}

// Update PR with any fields
function updatePR(ss, data) {
  const sheet = ss.getSheetByName(PR_SHEET);
  if (!sheet) return { error: 'PR sheet not found' };
  
  const dataRange = sheet.getDataRange().getValues();
  const headers = dataRange[0];
  
  // Column mapping (1-indexed for setRange)
  const colMap = {
    'prNumber': 1,
    'itemName': 2,
    'description': 3,
    'quantity': 4,
    'project': 5,
    'department': 6,
    'requestedBy': 7,
    'priority': 8,
    'neededBy': 9,
    'vendor': 10,
    'status': 11,
    'createdDate': 12,
    'approvedBy': 13,
    'approvedDate': 14,
    'orderedDate': 15,
    'receivedDate': 16,
    'notes': 17,
    'quoteAmount': 18,
    'quoteNotes': 19,
    'quotedBy': 20,
    'trackingId': 21,
    'orderId': 22,
    'invoiceNumber': 23,
    'finalAmount': 24
  };
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.prNumber) {
      const rowNum = i + 1;
      
      // Update each field in updates object
      if (data.updates) {
        for (const [field, value] of Object.entries(data.updates)) {
          if (colMap[field]) {
            sheet.getRange(rowNum, colMap[field]).setValue(value);
          }
        }
      }
      
      return { success: true, message: 'PR updated' };
    }
  }
  
  return { error: 'PR not found' };
}
