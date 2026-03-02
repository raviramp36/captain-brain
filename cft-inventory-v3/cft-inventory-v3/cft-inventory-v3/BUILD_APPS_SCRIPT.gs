/**
 * Product Builds - Google Apps Script Backend
 * 
 * ADD THIS TO YOUR EXISTING APPS SCRIPT
 * 
 * Required Sheets:
 * - Builds (columns: Build ID, Product Name, Description, Target Category, Status, Created By, Created Date, Completed Date, Result Item ID, Est Value, Component Count)
 * - Build_Items (columns: Build ID, Item ID, Item Name, Category, Qty Used, Date Added)
 * - Inventory (existing)
 */

// Process Build Actions
function processProductBuildAction(data) {
  const action = data.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  switch (action) {
    case 'createBuild':
      return createProductBuild(ss, data);
    case 'completeBuild':
      return completeProductBuild(ss, data);
    case 'cancelBuild':
      return cancelProductBuild(ss, data);
    default:
      return { success: false, error: 'Unknown action: ' + action };
  }
}

// Create Build
function createProductBuild(ss, data) {
  try {
    // Get or create Builds sheet
    let buildsSheet = ss.getSheetByName('Builds');
    if (!buildsSheet) {
      buildsSheet = ss.insertSheet('Builds');
      buildsSheet.appendRow(['Build ID', 'Product Name', 'Description', 'Target Category', 'Status', 'Created By', 'Created Date', 'Completed Date', 'Result Item ID', 'Est Value', 'Component Count']);
    }
    
    // Get or create Build_Items sheet
    let buildItemsSheet = ss.getSheetByName('Build_Items');
    if (!buildItemsSheet) {
      buildItemsSheet = ss.insertSheet('Build_Items');
      buildItemsSheet.appendRow(['Build ID', 'Item ID', 'Item Name', 'Category', 'Qty Used', 'Date Added']);
    }
    
    // Add build record
    buildsSheet.appendRow([
      data.buildId,
      data.productName,
      data.description || '',
      data.targetCategory || 'Event Equipment',
      'In Progress',
      data.createdBy,
      data.createdDate,
      '', // completedDate
      '', // resultItemId
      data.estValue || 0,
      data.items ? data.items.length : 0
    ]);
    
    // Add build items and reduce inventory qty
    const inventorySheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Inventory');
    const inventoryData = inventorySheet.getDataRange().getValues();
    
    if (data.items && data.items.length > 0) {
      data.items.forEach(item => {
        // Add to Build_Items
        buildItemsSheet.appendRow([
          data.buildId,
          item.itemId,
          item.name,
          item.category || 'Electronics',
          item.qty,
          data.createdDate
        ]);
        
        // Reduce inventory qty
        for (let i = 1; i < inventoryData.length; i++) {
          if (inventoryData[i][0] === item.itemId) {
            const currentQty = parseInt(inventoryData[i][4]) || 0;
            const newQty = Math.max(0, currentQty - item.qty);
            inventorySheet.getRange(i + 1, 5).setValue(newQty); // Column 5 = Quantity
            break;
          }
        }
      });
    }
    
    return { success: true, buildId: data.buildId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Complete Build - Create new inventory item
function completeProductBuild(ss, data) {
  try {
    const buildsSheet = ss.getSheetByName('Builds');
    const inventorySheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Inventory');
    
    // Find the build row
    const buildsData = buildsSheet.getDataRange().getValues();
    let buildRow = -1;
    for (let i = 1; i < buildsData.length; i++) {
      if (buildsData[i][0] === data.buildId) {
        buildRow = i + 1;
        break;
      }
    }
    
    if (buildRow === -1) {
      return { success: false, error: 'Build not found' };
    }
    
    // Generate new item ID based on target category
    const inventoryData = inventorySheet.getDataRange().getValues();
    const categoryPrefixes = {
      'Event Equipment': 'EV',
      'Electronics': 'EC',
      'IT Assets': 'IT'
    };
    const prefix = categoryPrefixes[data.targetCategory] || 'EV';
    
    // Find highest ID for this category
    let maxNum = 0;
    for (let i = 1; i < inventoryData.length; i++) {
      const id = inventoryData[i][0] || '';
      if (id.startsWith(prefix + '-')) {
        const num = parseInt(id.split('-')[1]) || 0;
        if (num > maxNum) maxNum = num;
      }
    }
    const newItemId = prefix + '-' + String(maxNum + 1).padStart(3, '0');
    
    // Add new inventory item
    inventorySheet.appendRow([
      newItemId,
      data.productName,
      data.targetCategory,
      'Assembled', // Sub-category
      1, // Quantity
      'Available', // Status
      'Warehouse', // Location
      data.estValue || 0,
      data.completedDate,
      (data.description || '') + ' | Built from: ' + data.buildId
    ]);
    
    // Update build record
    buildsSheet.getRange(buildRow, 5).setValue('Completed'); // Status
    buildsSheet.getRange(buildRow, 8).setValue(data.completedDate); // Completed Date
    buildsSheet.getRange(buildRow, 9).setValue(newItemId); // Result Item ID
    
    return { success: true, newItemId: newItemId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Cancel Build - Restore component quantities
function cancelProductBuild(ss, data) {
  try {
    const buildsSheet = ss.getSheetByName('Builds');
    const buildItemsSheet = ss.getSheetByName('Build_Items');
    const inventorySheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Inventory');
    
    // Find the build row
    const buildsData = buildsSheet.getDataRange().getValues();
    let buildRow = -1;
    for (let i = 1; i < buildsData.length; i++) {
      if (buildsData[i][0] === data.buildId) {
        buildRow = i + 1;
        break;
      }
    }
    
    if (buildRow === -1) {
      return { success: false, error: 'Build not found' };
    }
    
    // Get build items and restore quantities
    const buildItems = buildItemsSheet.getDataRange().getValues();
    const inventoryData = inventorySheet.getDataRange().getValues();
    
    for (let i = 1; i < buildItems.length; i++) {
      if (buildItems[i][0] === data.buildId) {
        const itemId = buildItems[i][1];
        const qtyUsed = parseInt(buildItems[i][4]) || 0;
        
        // Restore inventory qty
        for (let j = 1; j < inventoryData.length; j++) {
          if (inventoryData[j][0] === itemId) {
            const currentQty = parseInt(inventoryData[j][4]) || 0;
            inventorySheet.getRange(j + 1, 5).setValue(currentQty + qtyUsed);
            break;
          }
        }
      }
    }
    
    // Update build status
    buildsSheet.getRange(buildRow, 5).setValue('Cancelled');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * ADD THIS TO YOUR doPost FUNCTION:
 * 
 * // Product Builds
 * if (data.action === 'createBuild' || data.action === 'completeBuild' || data.action === 'cancelBuild') {
 *   return processProductBuildAction(data);
 * }
 */
