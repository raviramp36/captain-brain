#!/usr/bin/env python3
"""Parse malformed inventory rows and generate corrected data."""

import re
import csv
import io
import urllib.request

SHEET_URL = 'https://docs.google.com/spreadsheets/d/1MrwDU0XtemyfpwWNX551ulfUIAFECB4cLCPhNJH1yuo/export?format=csv&gid=0'

def parse_malformed_row(text):
    """Parse a malformed row that has all data in column A."""
    
    # Pattern: EC-XXX Name Electronics SubCat Qty Status Location Value Date Notes
    
    # Extract Item ID
    id_match = re.match(r'^(EC-\d+)\s+', text)
    if not id_match:
        return None
    
    item_id = id_match.group(1)
    rest = text[id_match.end():]
    
    # Find "Electronics" keyword to split name from category
    elec_match = re.search(r'\s+Electronics\s+', rest)
    if not elec_match:
        return None
    
    item_name = rest[:elec_match.start()].strip()
    rest = rest[elec_match.end():]
    
    # Pattern after Electronics: SubCat Qty Status Location Value Date Notes
    # SubCat is one word, Qty is a number, Status is "Available" or similar
    
    # Try to match: SubCat Qty Status
    pattern = r'^(\w+)\s+(\d+)\s+(Available|In Use|Dead|Maintenance|Reserved)\s+'
    match = re.match(pattern, rest, re.IGNORECASE)
    if not match:
        # Try without sub-category
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
    
    # Now rest contains: Location Value Date Notes
    # Find the date pattern (2026-02-20 or similar)
    date_match = re.search(r'(\d{4}-\d{2}-\d{2})', rest)
    if date_match:
        # Value is the number just before the date
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
    else:
        # No date found, try to extract value from end of location
        value = '0'
        location = rest.strip()
        added_date = ''
        notes = ''
    
    return {
        'item_id': item_id,
        'name': item_name,
        'category': 'Electronics',
        'sub_category': sub_category,
        'quantity': quantity,
        'status': status,
        'location': location,
        'value': value,
        'added_date': added_date,
        'notes': notes
    }

def main():
    # Fetch current data
    with urllib.request.urlopen(SHEET_URL) as response:
        csv_text = response.read().decode('utf-8')
    
    reader = csv.reader(io.StringIO(csv_text))
    rows = list(reader)
    
    print("Malformed rows found and parsed:\n")
    print("="*80)
    
    fixed_count = 0
    for i, row in enumerate(rows[1:], start=2):  # Skip header, 1-indexed for sheets
        # Check if malformed (column B is empty but A has data starting with EC-)
        if row[0] and row[0].startswith('EC-') and (len(row) < 2 or not row[1]):
            parsed = parse_malformed_row(row[0])
            if parsed:
                fixed_count += 1
                print(f"Row {i}: {parsed['item_id']}")
                print(f"  Name: {parsed['name']}")
                print(f"  Category: {parsed['category']}")
                print(f"  SubCat: {parsed['sub_category']}")
                print(f"  Qty: {parsed['quantity']}")
                print(f"  Status: {parsed['status']}")
                print(f"  Location: {parsed['location']}")
                print(f"  Value: {parsed['value']}")
                print(f"  Date: {parsed['added_date']}")
                print(f"  Notes: {parsed['notes'][:50]}..." if len(parsed['notes']) > 50 else f"  Notes: {parsed['notes']}")
                print()
            else:
                print(f"Row {i}: FAILED TO PARSE - {row[0][:60]}...")
                print()
    
    print(f"\nTotal fixed: {fixed_count}")

if __name__ == '__main__':
    main()
