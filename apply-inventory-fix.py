#!/usr/bin/env python3
"""Fix malformed inventory rows by updating via Apps Script API."""

import re
import csv
import io
import json
import urllib.request

SHEET_URL = 'https://docs.google.com/spreadsheets/d/1MrwDU0XtemyfpwWNX551ulfUIAFECB4cLCPhNJH1yuo/export?format=csv&gid=0'
APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbytl8nzknzcMmltlmuTML_JvjInyL2lBolmK3qNqMuLRcrSfvnDSF3e1KNvGiEcbRxX/exec'

def parse_malformed_row(text):
    """Parse a malformed row that has all data in column A."""
    
    # Extract Item ID
    id_match = re.match(r'^(EC-\d+)\s+', text)
    if not id_match:
        return None
    
    item_id = id_match.group(1)
    rest = text[id_match.end():]
    
    # Find "Electronics" keyword
    elec_match = re.search(r'\s+Electronics\s+', rest)
    if not elec_match:
        return None
    
    item_name = rest[:elec_match.start()].strip()
    rest = rest[elec_match.end():]
    
    # Match: SubCat Qty Status
    pattern = r'^(\w+)\s+(\d+)\s+(Available|In Use|Dead|Maintenance|Reserved)\s+'
    match = re.match(pattern, rest, re.IGNORECASE)
    if not match:
        pattern2 = r'^(\d+)\s+(Available|In Use|Dead|Maintenance|Reserved)\s+'
        match2 = re.match(pattern2, rest, re.IGNORECASE)
        if match2:
            sub_category = ''
            quantity = match2.group(1)
            status = match2.group(2)
            rest = rest[match2.end():]
        else:
            return None
    else:
        sub_category = match.group(1)
        quantity = match.group(2)
        status = match.group(3)
        rest = rest[match.end():]
    
    # Find date pattern
    date_match = re.search(r'(\d{4}-\d{2}-\d{2})', rest)
    if date_match:
        before_date = rest[:date_match.start()].strip()
        value_match = re.search(r'(\d+)\s*$', before_date)
        if value_match:
            value = value_match.group(1)
            location = before_date[:value_match.start()].strip()
        else:
            value = '0'
            location = before_date
        
        added_date = date_match.group(1)
        notes = rest[date_match.end():].strip()
        # Clean up notes - remove duplicate date patterns and "tested SND" suffixes
        notes = re.sub(r'\s*tested\s+SND\s+\d{4}-\d{2}-\d{2}.*$', '', notes, flags=re.IGNORECASE)
    else:
        value = '0'
        location = rest.strip()
        added_date = ''
        notes = ''
    
    return {
        'item_id': item_id,
        'name': item_name,
        'category': 'Electronics',
        'sub_category': sub_category,
        'quantity': int(quantity),
        'status': status,
        'location': location,
        'value': int(value),
        'added_date': added_date,
        'notes': notes
    }

def main():
    # Fetch current data
    with urllib.request.urlopen(SHEET_URL) as response:
        csv_text = response.read().decode('utf-8')
    
    reader = csv.reader(io.StringIO(csv_text))
    rows = list(reader)
    
    fixes = []
    
    for i, row in enumerate(rows[1:], start=2):
        if row[0] and row[0].startswith('EC-') and (len(row) < 2 or not row[1]):
            parsed = parse_malformed_row(row[0])
            if parsed:
                fixes.append({
                    'row': i,
                    'data': parsed
                })
    
    print(f"Found {len(fixes)} rows to fix\n")
    
    # Generate CSV for manual import or Apps Script batch update
    print("Generating corrected data...\n")
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Item ID', 'Item Name', 'Category', 'Sub-Category', 'Quantity', 'Status', 'Location', 'Value (₹)', 'Added Date', 'Notes'])
    
    for fix in fixes:
        d = fix['data']
        writer.writerow([
            d['item_id'],
            d['name'],
            d['category'],
            d['sub_category'],
            d['quantity'],
            d['status'],
            d['location'],
            d['value'],
            d['added_date'],
            d['notes']
        ])
    
    # Save to file
    with open('/root/.openclaw/workspace/inventory-fixes.csv', 'w') as f:
        f.write(output.getvalue())
    
    print(f"Saved corrected data to inventory-fixes.csv")
    print(f"\nFirst 5 fixes:")
    for fix in fixes[:5]:
        d = fix['data']
        print(f"  Row {fix['row']}: {d['item_id']} - {d['name']} (Qty: {d['quantity']}, Val: ₹{d['value']})")

if __name__ == '__main__':
    main()
