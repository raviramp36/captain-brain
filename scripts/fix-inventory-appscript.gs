/**
 * Fix Inventory Sheet - Merge Orphan Rows
 * 
 * HOW TO USE:
 * 1. Open the Inventory Google Sheet
 * 2. Click Extensions → Apps Script
 * 3. Delete any existing code and paste this entire script
 * 4. Click Save (disk icon)
 * 5. Click Run → select "fixOrphanRows"
 * 6. Grant permissions if prompted
 * 7. Check the Execution Log for results
 */

function fixOrphanRows() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  Logger.log('Starting fix - found ' + data.length + ' rows');
  
  const fixedRows = [];
  let orphanCount = 0;
  let currentParentIndex = -1;
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Header row - keep as is
    if (i === 0) {
      fixedRows.push(row);
      continue;
    }
    
    // Check if this looks like a valid Item ID (XX-### format)
    const itemId = String(row[0] || '').trim();
    const isValidItemId = /^[A-Z]{2}-\d+$/.test(itemId);
    
    // Check if row has content beyond column A
    const hasMultipleColumns = row.slice(1).some(cell => cell && String(cell).trim() !== '');
    
    if (isValidItemId && hasMultipleColumns) {
      // This is a valid item row
      fixedRows.push([...row]);
      currentParentIndex = fixedRows.length - 1;
    } else if (currentParentIndex >= 0 && itemId && !isValidItemId) {
      // This is an orphan row - merge into parent's Notes (column J, index 9)
      const orphanText = itemId;
      
      // Ensure parent row has enough columns
      while (fixedRows[currentParentIndex].length < 16) {
        fixedRows[currentParentIndex].push('');
      }
      
      // Append to Notes field
      const existingNotes = String(fixedRows[currentParentIndex][9] || '');
      fixedRows[currentParentIndex][9] = existingNotes + 
        (existingNotes ? ', ' : '') + orphanText;
      
      orphanCount++;
      Logger.log('Merged orphan row ' + (i+1) + ': "' + orphanText.substring(0, 30) + '..."');
    } else if (hasMultipleColumns) {
      // Row has data in multiple columns but unusual ID - keep it
      fixedRows.push([...row]);
      currentParentIndex = fixedRows.length - 1;
    }
    // Skip completely empty rows
  }
  
  Logger.log('Merged ' + orphanCount + ' orphan rows');
  Logger.log('New row count: ' + fixedRows.length + ' (was ' + data.length + ')');
  
  if (orphanCount === 0) {
    Logger.log('No orphan rows found - sheet is already clean!');
    SpreadsheetApp.getUi().alert('✅ No fixes needed - sheet is already clean!');
    return;
  }
  
  // Clear and rewrite sheet
  sheet.clear();
  
  // Write fixed data
  const range = sheet.getRange(1, 1, fixedRows.length, 16);
  range.setValues(fixedRows);
  
  // Format header row
  sheet.getRange(1, 1, 1, 16).setFontWeight('bold').setBackground('#f0f0f0');
  
  Logger.log('✅ Done! Fixed ' + orphanCount + ' orphan rows.');
  SpreadsheetApp.getUi().alert(
    '✅ Fixed!\n\n' +
    'Merged ' + orphanCount + ' orphan rows.\n' +
    'Row count: ' + data.length + ' → ' + fixedRows.length
  );
}

/**
 * Add menu item for easy access
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🔧 Inventory Tools')
    .addItem('Fix Orphan Rows', 'fixOrphanRows')
    .addToUi();
}
