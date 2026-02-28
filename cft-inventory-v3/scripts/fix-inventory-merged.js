#!/usr/bin/env node
/**
 * Fix Inventory Sheet - Merge orphan rows back into parent Notes field
 * Orphan rows = rows where only column A has content (rest empty)
 */

const { execSync } = require('child_process');

const SHEET_ID = '1MrwDU0XtemyfpwWNX551ulfUIAFECB4cLCPhNJH1yuo';

// Set environment for gog CLI
process.env.GOG_KEYRING_PASSWORD = 'craftech360';
process.env.GOG_ACCOUNT = 'accounts@craftech360.com';

async function run() {
    console.log('🔧 Fixing inventory sheet - merging broken rows...\n');
    
    try {
        // Step 1: Get all data from the sheet
        console.log('📥 Fetching all sheet data...');
        const result = execSync(
            `gog sheets get "${SHEET_ID}" "A:P" --json 2>/dev/null`,
            { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
        );
        
        const data = JSON.parse(result);
        const rows = data.values || [];
        
        console.log(`   Found ${rows.length} rows total\n`);
        
        // Step 2: Identify orphan rows and merge them
        const fixedRows = [];
        let orphanCount = 0;
        let currentParent = null;
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            
            // Check if this is an orphan row (only column A has content, columns B+ are empty)
            const hasOnlyFirstCol = row.length <= 1 || 
                (row.slice(1).every(cell => !cell || cell.trim() === ''));
            
            // Check if column A looks like an Item ID (starts with letter+number pattern or is header)
            const isItemId = /^[A-Z]{2}-\d+$/.test(row[0]) || row[0] === 'Item ID';
            
            if (i === 0) {
                // Header row
                fixedRows.push(row);
                continue;
            }
            
            if (hasOnlyFirstCol && !isItemId && currentParent !== null) {
                // This is an orphan row - merge into parent's Notes (column J, index 9)
                const orphanText = row[0] || '';
                if (orphanText.trim()) {
                    // Ensure parent has at least 10 columns
                    while (fixedRows[currentParent].length < 10) {
                        fixedRows[currentParent].push('');
                    }
                    // Append to Notes field with separator
                    const existingNotes = fixedRows[currentParent][9] || '';
                    fixedRows[currentParent][9] = existingNotes + 
                        (existingNotes ? ', ' : '') + orphanText.trim();
                    orphanCount++;
                }
            } else if (isItemId) {
                // This is a valid item row
                fixedRows.push([...row]); // Clone the row
                currentParent = fixedRows.length - 1;
            } else if (row[1] && row[1].trim()) {
                // Row has content in column B, treat as valid row
                fixedRows.push([...row]);
                currentParent = fixedRows.length - 1;
            } else {
                // Orphan without a parent - still try to merge
                console.log(`   ⚠️ Orphan at row ${i+1}: "${(row[0] || '').substring(0, 40)}..."`);
                orphanCount++;
            }
        }
        
        console.log(`🔍 Found ${orphanCount} orphan rows to merge`);
        console.log(`📊 Final row count: ${fixedRows.length} (was ${rows.length})\n`);
        
        if (orphanCount === 0) {
            console.log('✅ No orphan rows found - sheet looks clean!');
            return;
        }
        
        // Step 3: Clear the sheet and write fixed data
        console.log('🗑️  Clearing sheet...');
        execSync(
            `gog sheets update "${SHEET_ID}" "A:P" --clear 2>/dev/null`,
            { encoding: 'utf8' }
        );
        
        console.log('📝 Writing fixed data...');
        
        // Write in batches
        const batchSize = 50;
        for (let i = 0; i < fixedRows.length; i += batchSize) {
            const batch = fixedRows.slice(i, i + batchSize);
            const startRow = i + 1;
            const endRow = startRow + batch.length - 1;
            
            // Convert batch to JSON for gog sheets append
            const jsonData = JSON.stringify(batch);
            
            // Write batch
            execSync(
                `gog sheets append "${SHEET_ID}" "A${startRow}" --json '${jsonData.replace(/'/g, "\\'")}' 2>/dev/null`,
                { encoding: 'utf8' }
            );
            process.stdout.write(`   Wrote rows ${startRow}-${endRow}\r`);
        }
        
        console.log(`\n\n✅ Done! Fixed ${orphanCount} orphan rows.`);
        console.log('🔄 Refresh the inventory dashboard to see clean data.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stdout) console.error('stdout:', error.stdout.toString());
        if (error.stderr) console.error('stderr:', error.stderr.toString());
        process.exit(1);
    }
}

run();
