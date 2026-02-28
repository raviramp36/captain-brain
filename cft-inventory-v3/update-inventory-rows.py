#!/usr/bin/env python3
"""Update malformed inventory rows via Apps Script API."""

import re
import csv
import io
import json
import urllib.request
import time

SHEET_URL = 'https://docs.google.com/spreadsheets/d/1MrwDU0XtemyfpwWNX551ulfUIAFECB4cLCPhNJH1yuo/export?format=csv&gid=0'
APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbytl8nzknzcMmltlmuTML_JvjInyL2lBolmK3qNqMuLRcrSfvnDSF3e1KNvGiEcbRxX/exec'

def parse_malformed_row(text):
    """Parse a malformed row that has all data in column A."""
    id_match = re.match(r'^(EC-\d+)\s+', text)
    if not id_match:
        return None
    
    item_id = id_match.group(1)
    rest = text[id_match.end():]
    
    elec_match = re.search(r'\s+Electronics\s+', rest)
    if not elec_match:
        return None
    
    item_name = rest[:elec_match.start()].strip()
    rest = rest[elec_match.end():]
    
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
        notes = re.sub(r'\s*tested\s+SND\s+\d{4}-\d{2}-\d{2}.*$', '', notes, flags=re.IGNORECASE)
    else:
        value = '0'
        location = rest.strip()
        added_date = ''
        notes = ''
    
    return {
        'itemId': item_id,
        'name': item_name,
        'category': 'Electronics',
        'subCategory': sub_category,
        'quantity': int(quantity),
        'status': status,
        'location': location,
        'value': int(value),
        'addedDate': added_date,
        'notes': notes
    }

def update_row(row_index, data):
    """Update a row via Apps Script."""
    payload = {
        'rowIndex': row_index,
        **data
    }
    
    req = urllib.request.Request(
        APPS_SCRIPT_URL + '?action=update',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            result = response.read().decode('utf-8')
            return True, result
    except Exception as e:
        return False, str(e)

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
    
    print(f"Updating {len(fixes)} malformed rows...\n")
    
    success = 0
    failed = 0
    
    for i, fix in enumerate(fixes):
        row_num = fix['row']
        data = fix['data']
        
        print(f"[{i+1}/{len(fixes)}] Row {row_num}: {data['itemId']} - {data['name'][:30]}...", end=' ')
        
        ok, result = update_row(row_num, data)
        
        if ok:
            print("✓")
            success += 1
        else:
            print(f"✗ ({result})")
            failed += 1
        
        # Rate limiting
        time.sleep(0.5)
    
    print(f"\nDone! Success: {success}, Failed: {failed}")

if __name__ == '__main__':
    main()
