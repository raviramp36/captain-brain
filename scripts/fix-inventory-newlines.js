#!/usr/bin/env node
/**
 * Fix Inventory Sheet - Replace newlines in cells with semicolons
 * This prevents CSV export from breaking rows
 */

const { execSync } = require('child_process');

const SHEET_ID = '1MrwDU0XtemyfpwWNX551ulfUIAFECB4cLCPhNJH1yuo';
const SHEET_NAME = 'Inventory'; // Adjust if different

// Set environment for gog CLI
process.env.GOG_KEYRING_PASSWORD = 'craftech360';
process.env.GOG_ACCOUNT = 'accounts@craftech360.com';

async function run() {
    console.log('🔧 Fixing newlines in inventory sheet...\n');
    
    try {
        // Step 1: Get all data from the sheet
        console.log('📥 Fetching sheet data...');
        const result = execSync(
            `gog sheets get "${SHEET_ID}" --range "A:P" --format json 2>/dev/null`,
            { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
        );
        
        const data = JSON.parse(result);
        const rows = data.values || [];
        
        console.log(`   Found ${rows.length} rows\n`);
        
        // Step 2: Find cells with newlines and prepare updates
        const updates = [];
        let fixedCount = 0;
        
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const cellValue = row[colIndex];
                if (cellValue && typeof cellValue === 'string' && cellValue.includes('\n')) {
                    // Replace newlines with "; "
                    const fixedValue = cellValue.replace(/\n+/g, '; ').replace(/;\s*;\s*/g, '; ').trim();
                    
                    // Convert to A1 notation
                    const colLetter = String.fromCharCode(65 + colIndex); // A, B, C...
                    const cellRef = `${colLetter}${rowIndex + 1}`;
                    
                    updates.push({
                        range: cellRef,
                        original: cellValue.substring(0, 50) + '...',
                        fixed: fixedValue.substring(0, 50) + '...',
                        fullFixed: fixedValue
                    });
                    fixedCount++;
                }
            }
        }
        
        console.log(`🔍 Found ${fixedCount} cells with newlines\n`);
        
        if (updates.length === 0) {
            console.log('✅ No fixes needed - sheet is clean!');
            return;
        }
        
        // Step 3: Show what will be fixed
        console.log('📝 Cells to fix:');
        updates.slice(0, 10).forEach(u => {
            console.log(`   ${u.range}: "${u.original}" → "${u.fixed}"`);
        });
        if (updates.length > 10) {
            console.log(`   ... and ${updates.length - 10} more\n`);
        }
        
        // Step 4: Apply fixes using gog sheets update
        console.log('\n🔄 Applying fixes...');
        
        for (const update of updates) {
            try {
                // Escape the value for shell
                const escapedValue = update.fullFixed
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"')
                    .replace(/\$/g, '\\$')
                    .replace(/`/g, '\\`');
                
                execSync(
                    `gog sheets update "${SHEET_ID}" --range "${update.range}" --value "${escapedValue}" 2>/dev/null`,
                    { encoding: 'utf8' }
                );
                process.stdout.write('.');
            } catch (err) {
                process.stdout.write('x');
            }
        }
        
        console.log('\n\n✅ Done! Fixed ' + fixedCount + ' cells.');
        console.log('🔄 Refresh the inventory dashboard to see the corrected data.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

run();
