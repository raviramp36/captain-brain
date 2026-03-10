#!/bin/bash

export GOG_KEYRING_PASSWORD=craftech360
export GOG_ACCOUNT=accounts@craftech360.com

SHEET_ID="1k9-SqlSL3Mv0RqQc44SLp4HAIUzTq_PEaVd48cFVfw0"

# Add Mind Link Sensor (from WhatsApp request)
echo "📦 Adding Mind Link Sensor..."
gog sheets append "$SHEET_ID" "A:I" \
  "FT-001" \
  "FT&S : Mind Link sensor" \
  "Event Equipment" \
  "3" \
  "Available" \
  "Warehouse" \
  "0" \
  "$(date +%Y-%m-%d)" \
  "Working well with all accessories"

echo "✅ Mind Link Sensor added!"

# Add first 5 items from Excel
echo "📊 Adding sample inventory items..."

node << 'SCRIPT'
const fs = require('fs');
const { execSync } = require('child_process');
const data = require('./cft-inventory-sheet1.json');

data.slice(0, 5).forEach((item, i) => {
  console.log(`  ${i+1}. ${item['Item Name']}`);
  const cmd = `gog sheets append "${process.env.SHEET_ID}" "A:I" \
    "${item['Item ID'] || ''}" \
    "${(item['Item Name'] || '').replace(/"/g, '\\"')}" \
    "${item['Category'] || ''}" \
    "${item['Quantity'] || 0}" \
    "${item['Status'] || ''}" \
    "${item['Location'] || ''}" \
    "${item['Value (₹)'] || 0}" \
    "${new Date().toISOString().split('T')[0]}" \
    "${(item['Notes'] || '').replace(/"/g, '\\"').substring(0, 100)}"`;
  
  try {
    execSync(cmd, { env: process.env });
  } catch(e) {
    console.error(`    Error adding ${item['Item Name']}`);
  }
});
SCRIPT

echo "✅ Sample data uploaded!"
echo ""
echo "🔗 View your spreadsheet:"
echo "https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
