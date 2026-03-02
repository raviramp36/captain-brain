// CFT Inventory System v3 - App Logic

const CONFIG = {
    SHEET_ID: '1MrwDU0XtemyfpwWNX551ulfUIAFECB4cLCPhNJH1yuo',
    // Using Netlify function to proxy CSV (avoids CORS issues)
    CSV_URL: '/.netlify/functions/get-inventory',
    // Google Apps Script for write operations
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxgrvkJMxdHjv_T3m8Oxp_QwMfIvyFtaend0BZa_DEeAWbzWmeRnd3bgfxcbOSw5vB3/exec'
};

const CATEGORY_PREFIXES = {
    'IT Assets': 'IT',
    'Electronic Components': 'EC',
    'Event Equipment': 'EV',
    'Mechanical Division': 'MC',
    'Office Assets': 'OA',
    'Dead Stock': 'DS',
    'Rented Equipment': 'RE'
};

const CATEGORY_ICONS = {
    'IT Assets': '💻',
    'Electronic Components': '🔌',
    'Event Equipment': '🎪',
    'Mechanical Division': '⚙️',
    'Office Assets': '🪑',
    'Dead Stock': '📦',
    'Rented Equipment': '🔄'
};

const CATEGORY_COLORS = {
    'IT Assets': '#6366f1',
    'Electronic Components': '#22c55e',
    'Event Equipment': '#f59e0b',
    'Mechanical Division': '#ef4444',
    'Office Assets': '#3b82f6',
    'Dead Stock': '#64748b',
    'Rented Equipment': '#ec4899'
};

const STATUS_COLORS = {
    'Available': '#22c55e',
    'In Use': '#3b82f6',
    'Checked Out': '#f59e0b',
    'Maintenance': '#ef4444',
    'Dead Stock': '#64748b'
};

const SUB_CATEGORIES = {
    'IT Assets': [
        'Laptops',
        'Desktops',
        'Monitors',
        'Networking',
        'Storage',
        'Printers',
        'Peripherals'
    ],
    'Electronic Components': [
        'Microcontrollers',
        'Power Supplies',
        'Sensors',
        'Cables',
        'PCBs',
        'Buttons',
        'Peripherals'
    ],
    'Event Equipment': [
        'Sensors',
        'IT Assets',
        'LED Panels',
        'Kinetic Displays',
        'Projectors',
        'Holofans',
        'Photobooths'
    ],
    'Mechanical Division': [
        'Motors',
        'Gears',
        'Aluminum Profiles',
        'Bearings',
        'Winches',
        'Hardware',
        'Frames',
        'Tools'
    ],
    'Office Assets': [
        'Furniture',
        'Appliances',
        'Storage',
        'Stationery',
        'Cleaning'
    ],
    'Dead Stock': [
        'Damaged',
        'Obsolete',
        'Spare Parts',
        'Pending Disposal'
    ],
    'Rented Equipment': [
        'Laptops',
        'Camera',
        'Printer',
        'Accessories',
        'VR Headsets',
        'Other'
    ]
};

let inventoryData = [];
let filteredData = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadData();
});

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            switchView(view);
        });
    });
}

function switchView(viewName) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewName);
    });
    
    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName + 'View').classList.add('active');
    
    // Update title
    const titles = {
        dashboard: 'Dashboard',
        inventory: 'All Items',
        add: 'Add New Item',
        categories: 'Categories'
    };
    document.getElementById('pageTitle').textContent = titles[viewName] || 'Dashboard';
}

// Parse CSV string into array of arrays
function parseCSV(csv) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < csv.length; i++) {
        const char = csv[i];
        const nextChar = csv[i + 1];
        
        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                currentField += '"';
                i++; // Skip next quote
            } else if (char === '"') {
                inQuotes = false;
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentLine.push(currentField);
                currentField = '';
            } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
                currentLine.push(currentField);
                lines.push(currentLine);
                currentLine = [];
                currentField = '';
                if (char === '\r') i++; // Skip \n after \r
            } else if (char !== '\r') {
                currentField += char;
            }
        }
    }
    
    // Handle last field/line
    if (currentField || currentLine.length > 0) {
        currentLine.push(currentField);
        lines.push(currentLine);
    }
    
    return lines;
}

// Load Data from Google Sheets (via CSV export)
async function loadData() {
    try {
        // Add cache-busting parameter
        const cacheBuster = Date.now();
        const response = await fetch(CONFIG.CSV_URL + '?_=' + cacheBuster, {
            cache: 'no-store'
        });
        const csvText = await response.text();
        const data = parseCSV(csvText);
        
        if (data && data.length > 1) {
            // Skip header row
            inventoryData = data.slice(1).filter(row => row[0]).map((row, index) => ({
                rowIndex: index + 2, // +2 because of 0-index and header
                itemId: row[0] || '',
                name: row[1] || '',
                category: row[2] || '',
                subCategory: row[3] || '',
                quantity: parseInt(row[4]) || 0,
                status: row[5] || 'Available',
                location: row[6] || '',
                value: parseInt(row[7]) || 0,
                addedDate: row[8] || '',
                notes: row[9] || '',
                // Rental fields (columns K-P)
                returnDate: row[10] || '',
                eventProject: row[11] || '',
                vendorName: row[12] || '',
                vendorContact: row[13] || '',
                rentalCost: parseInt(row[14]) || 0,
                deposit: parseInt(row[15]) || 0
            }));
            
            filteredData = [...inventoryData];
            
            updateDashboard();
            updateInventoryTable();
            updateCategoriesView();
            
            document.getElementById('lastSync').textContent = new Date().toLocaleTimeString();
            showToast('Data synced successfully!', 'success');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Failed to load data. Check console.', 'error');
    }
}

// Update Dashboard
function updateDashboard() {
    // Stats
    const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
    const availableItems = inventoryData.filter(i => i.status === 'Available').reduce((sum, item) => sum + item.quantity, 0);
    const inUseItems = inventoryData.filter(i => i.status === 'In Use').reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = inventoryData.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('availableItems').textContent = availableItems;
    document.getElementById('inUseItems').textContent = inUseItems;
    document.getElementById('totalValue').textContent = '₹' + totalValue.toLocaleString('en-IN');
    
    // Category Chart
    const categoryChart = document.getElementById('categoryChart');
    const categoryCounts = {};
    Object.keys(CATEGORY_PREFIXES).forEach(cat => categoryCounts[cat] = 0);
    inventoryData.forEach(item => {
        if (categoryCounts.hasOwnProperty(item.category)) {
            categoryCounts[item.category] += item.quantity;
        }
    });
    
    const maxCount = Math.max(...Object.values(categoryCounts), 1);
    categoryChart.innerHTML = Object.entries(categoryCounts).map(([cat, count]) => `
        <div class="category-bar">
            <span class="category-bar-label">${cat}</span>
            <div class="category-bar-track">
                <div class="category-bar-fill" style="width: ${(count/maxCount)*100}%; background: ${CATEGORY_COLORS[cat]}"></div>
            </div>
            <span class="category-bar-value">${count}</span>
        </div>
    `).join('');
    
    // Status Chart
    const statusChart = document.getElementById('statusChart');
    const statusCounts = {};
    Object.keys(STATUS_COLORS).forEach(status => statusCounts[status] = 0);
    inventoryData.forEach(item => {
        if (statusCounts.hasOwnProperty(item.status)) {
            statusCounts[item.status] += item.quantity;
        }
    });
    
    statusChart.innerHTML = Object.entries(statusCounts).map(([status, count]) => `
        <div class="status-item">
            <span class="status-dot" style="background: ${STATUS_COLORS[status]}"></span>
            <span class="status-item-label">${status}</span>
            <span class="status-item-value">${count}</span>
        </div>
    `).join('');
    
    // Recent Items
    const recentList = document.getElementById('recentList');
    const recentItems = [...inventoryData]
        .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
        .slice(0, 5);
    
    recentList.innerHTML = recentItems.map(item => `
        <div class="recent-item">
            <div>
                <div class="recent-item-name">${item.name}</div>
                <div class="recent-item-category">${item.category}</div>
            </div>
            <span class="recent-item-date">${item.addedDate}</span>
        </div>
    `).join('');
}

// Update Inventory Table
function updateInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">No items found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredData.map(item => `
        <tr>
            <td><code>${item.itemId}</code></td>
            <td>${item.name}</td>
            <td>${CATEGORY_ICONS[item.category] || '📦'} ${item.category}</td>
            <td>${item.quantity}</td>
            <td><span class="status-badge status-${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span></td>
            <td>${item.location || '-'}</td>
            <td>₹${item.value.toLocaleString('en-IN')}</td>
            <td><button class="action-btn" onclick="editItem(${item.rowIndex})">✏️ Edit</button></td>
        </tr>
    `).join('');
}

// Update Categories View
function updateCategoriesView() {
    const grid = document.getElementById('categoriesGrid');
    const categoryCounts = {};
    Object.keys(CATEGORY_PREFIXES).forEach(cat => categoryCounts[cat] = 0);
    inventoryData.forEach(item => {
        if (categoryCounts.hasOwnProperty(item.category)) {
            categoryCounts[item.category] += item.quantity;
        }
    });
    
    grid.innerHTML = Object.entries(categoryCounts).map(([cat, count]) => `
        <div class="category-card" onclick="filterByCategory('${cat}')">
            <div class="category-card-icon">${CATEGORY_ICONS[cat]}</div>
            <div class="category-card-name">${cat}</div>
            <div class="category-card-count">${count}</div>
            <div class="category-card-label">items</div>
        </div>
    `).join('');
}

// Filter Items
function filterItems() {
    const search = document.getElementById('globalSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';
    
    filteredData = inventoryData.filter(item => {
        const matchSearch = !search || 
            item.name.toLowerCase().includes(search) ||
            item.itemId.toLowerCase().includes(search) ||
            item.category.toLowerCase().includes(search);
        const matchCategory = !category || item.category === category;
        const matchStatus = !status || item.status === status;
        
        return matchSearch && matchCategory && matchStatus;
    });
    
    updateInventoryTable();
}

function filterByCategory(category) {
    document.getElementById('categoryFilter').value = category;
    switchView('inventory');
    filterItems();
}

// Add Item
async function addItem(e) {
    e.preventDefault();
    
    const category = document.getElementById('itemCategory').value;
    const itemId = generateItemId(category);
    const today = new Date().toISOString().split('T')[0];
    
    const newItem = {
        itemId: itemId,
        name: document.getElementById('itemName').value,
        category: category,
        subCategory: document.getElementById('itemSubCategory').value,
        quantity: parseInt(document.getElementById('itemQuantity').value) || 1,
        status: document.getElementById('itemStatus').value,
        location: document.getElementById('itemLocation').value,
        value: parseInt(document.getElementById('itemValue').value) || 0,
        addedDate: today,
        notes: document.getElementById('itemNotes').value,
        // Rental fields (only relevant for Rented Equipment)
        returnDate: document.getElementById('itemReturnDate')?.value || '',
        eventProject: document.getElementById('itemEventProject')?.value || '',
        vendorName: document.getElementById('itemVendorName')?.value || '',
        vendorContact: document.getElementById('itemVendorContact')?.value || '',
        rentalCost: parseInt(document.getElementById('itemRentalCost')?.value) || 0,
        deposit: parseInt(document.getElementById('itemDeposit')?.value) || 0
    };
    
    try {
        showToast('Adding item...', 'success');
        
        const response = await fetch(CONFIG.APPS_SCRIPT_URL + '?action=add', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });
        
        showToast('✅ Item added successfully!', 'success');
        document.getElementById('addItemForm').reset();
        toggleRentalFields(); // Hide rental fields after reset
        
        // Reload data after short delay
        setTimeout(() => loadData(), 1500);
        
    } catch (error) {
        console.error('Error adding item:', error);
        showToast('Failed to add item: ' + error.message, 'error');
    }
}

function generateItemId(category) {
    const prefix = CATEGORY_PREFIXES[category] || 'XX';
    const existing = inventoryData.filter(i => i.category === category).length;
    const num = String(existing + 1).padStart(3, '0');
    return `${prefix}-${num}`;
}

function updateItemId() {
    const category = document.getElementById('itemCategory').value;
    if (category) {
        const newId = generateItemId(category);
        console.log('Generated ID:', newId);
    }
    updateSubCategoryDropdown('itemSubCategory', category);
}

function updateSubCategoryDropdown(selectId, category) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    const subCats = SUB_CATEGORIES[category] || [];
    select.innerHTML = '<option value="">Select Sub-Category</option>' +
        subCats.map(sub => `<option value="${sub}">${sub}</option>`).join('');
}

function updateEditSubCategory() {
    const category = document.getElementById('editItemCategory').value;
    updateSubCategoryDropdown('editItemSubCategory', category);
}

// Toggle rental fields visibility
function toggleRentalFields() {
    const category = document.getElementById('itemCategory').value;
    const rentalFields = document.getElementById('rentalFields');
    if (rentalFields) {
        rentalFields.style.display = (category === 'Rented Equipment') ? 'block' : 'none';
    }
}

function toggleEditRentalFields() {
    const category = document.getElementById('editItemCategory').value;
    const rentalFields = document.getElementById('editRentalFields');
    if (rentalFields) {
        rentalFields.style.display = (category === 'Rented Equipment') ? 'block' : 'none';
    }
}

// Edit Item
function editItem(rowIndex) {
    const item = inventoryData.find(i => i.rowIndex === rowIndex);
    if (!item) return;
    
    document.getElementById('editRowIndex').value = rowIndex;
    document.getElementById('editItemId').value = item.itemId;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemCategory').value = item.category;
    
    // Populate sub-category dropdown first, then set value
    updateSubCategoryDropdown('editItemSubCategory', item.category);
    document.getElementById('editItemSubCategory').value = item.subCategory;
    
    document.getElementById('editItemQuantity').value = item.quantity;
    document.getElementById('editItemStatus').value = item.status;
    document.getElementById('editItemLocation').value = item.location;
    document.getElementById('editItemValue').value = item.value;
    document.getElementById('editItemNotes').value = item.notes;
    
    // Rental fields
    document.getElementById('editItemReturnDate').value = item.returnDate || '';
    document.getElementById('editItemEventProject').value = item.eventProject || '';
    document.getElementById('editItemVendorName').value = item.vendorName || '';
    document.getElementById('editItemVendorContact').value = item.vendorContact || '';
    document.getElementById('editItemRentalCost').value = item.rentalCost || 0;
    document.getElementById('editItemDeposit').value = item.deposit || 0;
    
    // Toggle rental fields visibility
    toggleEditRentalFields();
    
    document.getElementById('editModal').classList.add('active');
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
}

async function saveEdit(e) {
    e.preventDefault();
    
    const rowIndex = parseInt(document.getElementById('editRowIndex').value);
    const existingItem = inventoryData.find(i => i.rowIndex == rowIndex);
    
    const updatedData = {
        rowIndex: rowIndex,
        itemId: document.getElementById('editItemId').value,
        name: document.getElementById('editItemName').value,
        category: document.getElementById('editItemCategory').value,
        subCategory: document.getElementById('editItemSubCategory').value,
        quantity: parseInt(document.getElementById('editItemQuantity').value) || 1,
        status: document.getElementById('editItemStatus').value,
        location: document.getElementById('editItemLocation').value,
        value: parseInt(document.getElementById('editItemValue').value) || 0,
        addedDate: existingItem?.addedDate || '',
        notes: document.getElementById('editItemNotes').value,
        // Rental fields
        returnDate: document.getElementById('editItemReturnDate')?.value || '',
        eventProject: document.getElementById('editItemEventProject')?.value || '',
        vendorName: document.getElementById('editItemVendorName')?.value || '',
        vendorContact: document.getElementById('editItemVendorContact')?.value || '',
        rentalCost: parseInt(document.getElementById('editItemRentalCost')?.value) || 0,
        deposit: parseInt(document.getElementById('editItemDeposit')?.value) || 0
    };
    
    try {
        showToast('Updating item...', 'success');
        
        await fetch(CONFIG.APPS_SCRIPT_URL + '?action=update', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        
        closeModal();
        showToast('✅ Item updated successfully!', 'success');
        
        // Reload data after short delay
        setTimeout(() => loadData(), 1500);
        
    } catch (error) {
        console.error('Error updating item:', error);
        showToast('Failed to update item: ' + error.message, 'error');
    }
}

async function deleteItem() {
    const rowIndex = document.getElementById('editRowIndex').value;
    
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    try {
        showToast('Deleting item...', 'success');
        
        await fetch(CONFIG.APPS_SCRIPT_URL + '?action=delete&row=' + rowIndex, {
            method: 'POST',
            mode: 'no-cors'
        });
        
        closeModal();
        showToast('✅ Item deleted successfully!', 'success');
        
        // Reload data after short delay
        setTimeout(() => loadData(), 1500);
        
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast('Failed to delete item: ' + error.message, 'error');
    }
}

// Export
function exportData() {
    const headers = ['Item ID', 'Name', 'Category', 'Sub-Category', 'Quantity', 'Status', 'Location', 'Value', 'Added Date', 'Notes'];
    const rows = filteredData.map(item => [
        item.itemId, item.name, item.category, item.subCategory,
        item.quantity, item.status, item.location, item.value,
        item.addedDate, item.notes
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cft-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showToast('Exported to CSV!', 'success');
}

// Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modal on outside click
document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target.id === 'editModal') {
        closeModal();
    }
});
