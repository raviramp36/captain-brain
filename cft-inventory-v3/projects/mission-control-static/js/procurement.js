// Craftech360 Mission Control - Procurement Module

const VENDORS_KEY = 'vendors';
const RENTALS_KEY = 'rentals';
const ORDERS_KEY = 'orders';

// Sample data
const sampleVendors = [
    { id: 'v1', name: 'TechRent Solutions', category: 'equipment', contact: 'Rajesh Kumar', phone: '+919876543210', email: 'rajesh@techrent.in', notes: 'Good for laptops and AV equipment. Net 15 payment.' },
    { id: 'v2', name: 'FastTrack Logistics', category: 'transport', contact: 'Suresh M', phone: '+919988776655', email: 'suresh@fasttrack.in', notes: 'Reliable for inter-city transport. Has refrigerated trucks.' },
    { id: 'v3', name: 'LED World', category: 'equipment', contact: 'Amit Shah', phone: '+919123456789', email: 'amit@ledworld.in', notes: 'Specializes in LED panels and screens.' },
    { id: 'v4', name: 'Event Supplies Co', category: 'supplies', contact: 'Priya R', phone: '+918765432109', email: 'priya@eventsupplies.in', notes: 'Cables, connectors, consumables.' }
];

const sampleRentals = [
    { id: 'r1', item: '10x Dell Laptops', vendorId: 'v1', vendor: 'TechRent Solutions', project: 'Dell Annual Meet 2026', startDate: '2026-03-12', endDate: '2026-03-16', cost: 25000, status: 'active', notes: 'i5, 8GB RAM, Windows 11' },
    { id: 'r2', item: '2x 55" LED Screens', vendorId: 'v3', vendor: 'LED World', project: 'Amazon Product Launch', startDate: '2026-02-26', endDate: '2026-02-28', cost: 15000, status: 'active', notes: 'With stands' },
    { id: 'r3', item: 'Transport Truck', vendorId: 'v2', vendor: 'FastTrack Logistics', project: 'Titan Brand Activation', startDate: '2026-03-18', endDate: '2026-03-22', cost: 35000, status: 'active', notes: 'Bangalore to Delhi' }
];

const sampleOrders = [
    { id: 'o1', item: 'HDMI Cables 5m x20', source: 'Amazon', project: 'Dell Annual Meet 2026', orderDate: '2026-02-18', deliveryDate: '2026-02-22', cost: 4500, status: 'shipped', tracking: 'AMZ123456789', notes: '' },
    { id: 'o2', item: 'USB-C Adapters x15', source: 'Amazon', project: '', orderDate: '2026-02-19', deliveryDate: '2026-02-23', cost: 2200, status: 'ordered', tracking: '', notes: 'For office stock' },
    { id: 'o3', item: 'Gaffer Tape x50 rolls', source: 'IndustryBuying', project: '', orderDate: '2026-02-15', deliveryDate: '2026-02-20', cost: 8500, status: 'delivered', tracking: 'IB98765432', notes: 'Black, 2 inch' }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load or initialize data
    if (!MC.loadData(VENDORS_KEY)) MC.saveData(VENDORS_KEY, sampleVendors);
    if (!MC.loadData(RENTALS_KEY)) MC.saveData(RENTALS_KEY, sampleRentals);
    if (!MC.loadData(ORDERS_KEY)) MC.saveData(ORDERS_KEY, sampleOrders);
    
    renderAll();
    populateVendorDropdowns();
});

// Tab switching
function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    
    // Update content
    document.querySelectorAll('[id^="content-"]').forEach(el => el.classList.add('hidden'));
    document.getElementById(`content-${tab}`).classList.remove('hidden');
    
    // Re-render icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Render all
function renderAll() {
    renderStats();
    renderVendors();
    renderRentals();
    renderOrders();
    renderRecent();
}

// Render stats
function renderStats() {
    const vendors = MC.loadData(VENDORS_KEY) || [];
    const rentals = MC.loadData(RENTALS_KEY) || [];
    const orders = MC.loadData(ORDERS_KEY) || [];
    
    const activeRentals = rentals.filter(r => r.status === 'active');
    const pendingOrders = orders.filter(o => o.status !== 'delivered');
    
    // Calculate this month's spend
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    let spend = 0;
    rentals.forEach(r => {
        const date = new Date(r.startDate);
        if (date.getMonth() === thisMonth && date.getFullYear() === thisYear) {
            spend += r.cost || 0;
        }
    });
    orders.forEach(o => {
        const date = new Date(o.orderDate);
        if (date.getMonth() === thisMonth && date.getFullYear() === thisYear) {
            spend += o.cost || 0;
        }
    });
    
    document.getElementById('stat-vendors').textContent = vendors.length;
    document.getElementById('stat-rentals').textContent = activeRentals.length;
    document.getElementById('stat-orders').textContent = pendingOrders.length;
    document.getElementById('stat-spend').textContent = spend.toLocaleString('en-IN');
}

// Render vendors
function renderVendors() {
    const vendors = MC.loadData(VENDORS_KEY) || [];
    const container = document.getElementById('vendors-list');
    
    if (vendors.length === 0) {
        container.innerHTML = '<p class="text-slate-500 text-sm">No vendors added yet</p>';
        return;
    }
    
    const categoryLabels = {
        equipment: '🖥️ Equipment',
        transport: '🚚 Transport',
        electronics: '⚡ Electronics',
        supplies: '📦 Supplies',
        services: '🔧 Services',
        other: '📋 Other'
    };
    
    container.innerHTML = vendors.map(v => `
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold">
                    ${v.name.charAt(0)}
                </div>
                <div>
                    <div class="font-medium text-slate-900">${v.name}</div>
                    <div class="text-sm text-slate-500">${categoryLabels[v.category] || v.category} • ${v.contact || 'No contact'}</div>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-sm text-slate-500">
                    ${v.phone ? `<a href="tel:${v.phone}" class="hover:text-blue-600">${v.phone}</a>` : ''}
                </div>
                <button onclick="editVendor('${v.id}')" class="text-slate-400 hover:text-slate-600">
                    <i data-lucide="edit" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteVendor('${v.id}')" class="text-red-400 hover:text-red-600">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Render rentals table
function renderRentals() {
    const rentals = MC.loadData(RENTALS_KEY) || [];
    const tbody = document.getElementById('rentals-table');
    
    if (rentals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-slate-500 py-8">No rentals yet</td></tr>';
        return;
    }
    
    const statusBadges = {
        active: '<span class="badge badge-info">Active</span>',
        returned: '<span class="badge badge-success">Returned</span>',
        overdue: '<span class="badge badge-danger">Overdue</span>'
    };
    
    // Check for overdue
    const now = new Date();
    rentals.forEach(r => {
        if (r.status === 'active' && new Date(r.endDate) < now) {
            r.status = 'overdue';
        }
    });
    
    tbody.innerHTML = rentals.map(r => `
        <tr>
            <td class="font-medium">${r.item}</td>
            <td>${r.vendor}</td>
            <td>${r.project || '-'}</td>
            <td>${MC.formatDate(r.startDate)} - ${MC.formatDate(r.endDate)}</td>
            <td>₹${(r.cost || 0).toLocaleString('en-IN')}</td>
            <td>${statusBadges[r.status] || r.status}</td>
            <td>
                <button onclick="editRental('${r.id}')" class="text-blue-600 hover:text-blue-800 mr-2"><i data-lucide="edit" class="w-4 h-4"></i></button>
                ${r.status === 'active' ? `<button onclick="markReturned('${r.id}')" class="text-emerald-600 hover:text-emerald-800 mr-2"><i data-lucide="check" class="w-4 h-4"></i></button>` : ''}
                <button onclick="deleteRental('${r.id}')" class="text-red-600 hover:text-red-800"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </td>
        </tr>
    `).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Render orders table
function renderOrders() {
    const orders = MC.loadData(ORDERS_KEY) || [];
    const tbody = document.getElementById('orders-table');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-slate-500 py-8">No orders yet</td></tr>';
        return;
    }
    
    const statusBadges = {
        ordered: '<span class="badge badge-warning">Ordered</span>',
        shipped: '<span class="badge badge-info">Shipped</span>',
        delivered: '<span class="badge badge-success">Delivered</span>'
    };
    
    tbody.innerHTML = orders.map(o => `
        <tr>
            <td class="font-medium">${o.item}</td>
            <td>${o.source}</td>
            <td>${o.project || '-'}</td>
            <td>${MC.formatDate(o.orderDate)}</td>
            <td>${o.deliveryDate ? MC.formatDate(o.deliveryDate) : '-'}</td>
            <td>₹${(o.cost || 0).toLocaleString('en-IN')}</td>
            <td>${statusBadges[o.status] || o.status}</td>
            <td>
                <button onclick="editOrder('${o.id}')" class="text-blue-600 hover:text-blue-800 mr-2"><i data-lucide="edit" class="w-4 h-4"></i></button>
                ${o.status !== 'delivered' ? `<button onclick="markDelivered('${o.id}')" class="text-emerald-600 hover:text-emerald-800 mr-2"><i data-lucide="check" class="w-4 h-4"></i></button>` : ''}
                <button onclick="deleteOrder('${o.id}')" class="text-red-600 hover:text-red-800"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </td>
        </tr>
    `).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Render recent activity on overview
function renderRecent() {
    const rentals = MC.loadData(RENTALS_KEY) || [];
    const orders = MC.loadData(ORDERS_KEY) || [];
    
    const recentRentals = rentals.slice(0, 3);
    const recentOrders = orders.slice(0, 3);
    
    const rentalsContainer = document.getElementById('recent-rentals');
    const ordersContainer = document.getElementById('recent-orders');
    
    if (recentRentals.length > 0) {
        rentalsContainer.innerHTML = recentRentals.map(r => `
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                    <div class="font-medium text-sm">${r.item}</div>
                    <div class="text-xs text-slate-500">${r.vendor} • ${r.project || 'No project'}</div>
                </div>
                <span class="badge ${r.status === 'active' ? 'badge-info' : 'badge-success'}">${r.status}</span>
            </div>
        `).join('');
    }
    
    if (recentOrders.length > 0) {
        ordersContainer.innerHTML = recentOrders.map(o => `
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                    <div class="font-medium text-sm">${o.item}</div>
                    <div class="text-xs text-slate-500">${o.source} • ₹${(o.cost || 0).toLocaleString('en-IN')}</div>
                </div>
                <span class="badge ${o.status === 'delivered' ? 'badge-success' : o.status === 'shipped' ? 'badge-info' : 'badge-warning'}">${o.status}</span>
            </div>
        `).join('');
    }
}

// Populate vendor dropdowns
function populateVendorDropdowns() {
    const vendors = MC.loadData(VENDORS_KEY) || [];
    const select = document.getElementById('rental-vendor');
    
    select.innerHTML = '<option value="">Select vendor...</option>' + 
        vendors.map(v => `<option value="${v.id}">${v.name}</option>`).join('');
}

// Save Vendor
function saveVendor() {
    const id = document.getElementById('vendor-id').value;
    const data = {
        id: id || MC.generateId(),
        name: document.getElementById('vendor-name').value,
        category: document.getElementById('vendor-category').value,
        contact: document.getElementById('vendor-contact').value,
        phone: document.getElementById('vendor-phone').value,
        email: document.getElementById('vendor-email').value,
        notes: document.getElementById('vendor-notes').value
    };
    
    if (!data.name) {
        MC.showNotification('Vendor name is required', 'error');
        return;
    }
    
    let vendors = MC.loadData(VENDORS_KEY) || [];
    if (id) {
        const idx = vendors.findIndex(v => v.id === id);
        if (idx !== -1) vendors[idx] = data;
    } else {
        vendors.push(data);
    }
    
    MC.saveData(VENDORS_KEY, vendors);
    MC.closeModal('add-vendor-modal');
    document.getElementById('vendor-form').reset();
    document.getElementById('vendor-id').value = '';
    
    renderAll();
    populateVendorDropdowns();
    MC.showNotification(id ? 'Vendor updated!' : 'Vendor added!');
}

// Save Rental
function saveRental() {
    const id = document.getElementById('rental-id').value;
    const vendorId = document.getElementById('rental-vendor').value;
    const vendors = MC.loadData(VENDORS_KEY) || [];
    const vendor = vendors.find(v => v.id === vendorId);
    
    const data = {
        id: id || MC.generateId(),
        item: document.getElementById('rental-item').value,
        vendorId: vendorId,
        vendor: vendor ? vendor.name : 'Unknown',
        project: document.getElementById('rental-project').value,
        startDate: document.getElementById('rental-start').value,
        endDate: document.getElementById('rental-end').value,
        cost: parseInt(document.getElementById('rental-cost').value) || 0,
        status: document.getElementById('rental-status').value,
        notes: document.getElementById('rental-notes').value
    };
    
    if (!data.item || !vendorId) {
        MC.showNotification('Item and vendor are required', 'error');
        return;
    }
    
    let rentals = MC.loadData(RENTALS_KEY) || [];
    if (id) {
        const idx = rentals.findIndex(r => r.id === id);
        if (idx !== -1) rentals[idx] = data;
    } else {
        rentals.push(data);
    }
    
    MC.saveData(RENTALS_KEY, rentals);
    MC.closeModal('add-rental-modal');
    document.getElementById('rental-form').reset();
    document.getElementById('rental-id').value = '';
    
    renderAll();
    MC.showNotification(id ? 'Rental updated!' : 'Rental added!');
}

// Save Order
function saveOrder() {
    const id = document.getElementById('order-id').value;
    const data = {
        id: id || MC.generateId(),
        item: document.getElementById('order-item').value,
        source: document.getElementById('order-source').value,
        project: document.getElementById('order-project').value,
        orderDate: document.getElementById('order-date').value,
        deliveryDate: document.getElementById('order-delivery').value,
        cost: parseInt(document.getElementById('order-cost').value) || 0,
        status: document.getElementById('order-status').value,
        tracking: document.getElementById('order-tracking').value,
        notes: document.getElementById('order-notes').value
    };
    
    if (!data.item || !data.source) {
        MC.showNotification('Item and source are required', 'error');
        return;
    }
    
    let orders = MC.loadData(ORDERS_KEY) || [];
    if (id) {
        const idx = orders.findIndex(o => o.id === id);
        if (idx !== -1) orders[idx] = data;
    } else {
        orders.push(data);
    }
    
    MC.saveData(ORDERS_KEY, orders);
    MC.closeModal('add-order-modal');
    document.getElementById('order-form').reset();
    document.getElementById('order-id').value = '';
    
    renderAll();
    MC.showNotification(id ? 'Order updated!' : 'Order added!');
}

// Mark returned
function markReturned(id) {
    let rentals = MC.loadData(RENTALS_KEY) || [];
    const idx = rentals.findIndex(r => r.id === id);
    if (idx !== -1) {
        rentals[idx].status = 'returned';
        MC.saveData(RENTALS_KEY, rentals);
        renderAll();
        MC.showNotification('Marked as returned!');
    }
}

// Mark delivered
function markDelivered(id) {
    let orders = MC.loadData(ORDERS_KEY) || [];
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
        orders[idx].status = 'delivered';
        MC.saveData(ORDERS_KEY, orders);
        renderAll();
        MC.showNotification('Marked as delivered!');
    }
}

// Delete functions
function deleteVendor(id) {
    if (!confirm('Delete this vendor?')) return;
    let vendors = MC.loadData(VENDORS_KEY) || [];
    vendors = vendors.filter(v => v.id !== id);
    MC.saveData(VENDORS_KEY, vendors);
    renderAll();
    populateVendorDropdowns();
    MC.showNotification('Vendor deleted', 'error');
}

function deleteRental(id) {
    if (!confirm('Delete this rental?')) return;
    let rentals = MC.loadData(RENTALS_KEY) || [];
    rentals = rentals.filter(r => r.id !== id);
    MC.saveData(RENTALS_KEY, rentals);
    renderAll();
    MC.showNotification('Rental deleted', 'error');
}

function deleteOrder(id) {
    if (!confirm('Delete this order?')) return;
    let orders = MC.loadData(ORDERS_KEY) || [];
    orders = orders.filter(o => o.id !== id);
    MC.saveData(ORDERS_KEY, orders);
    renderAll();
    MC.showNotification('Order deleted', 'error');
}

// Edit functions (populate form and open modal)
function editVendor(id) {
    const vendors = MC.loadData(VENDORS_KEY) || [];
    const v = vendors.find(x => x.id === id);
    if (!v) return;
    
    document.getElementById('vendor-id').value = v.id;
    document.getElementById('vendor-name').value = v.name;
    document.getElementById('vendor-category').value = v.category;
    document.getElementById('vendor-contact').value = v.contact || '';
    document.getElementById('vendor-phone').value = v.phone || '';
    document.getElementById('vendor-email').value = v.email || '';
    document.getElementById('vendor-notes').value = v.notes || '';
    
    MC.openModal('add-vendor-modal');
}

function editRental(id) {
    const rentals = MC.loadData(RENTALS_KEY) || [];
    const r = rentals.find(x => x.id === id);
    if (!r) return;
    
    document.getElementById('rental-id').value = r.id;
    document.getElementById('rental-item').value = r.item;
    document.getElementById('rental-vendor').value = r.vendorId;
    document.getElementById('rental-project').value = r.project || '';
    document.getElementById('rental-start').value = r.startDate;
    document.getElementById('rental-end').value = r.endDate;
    document.getElementById('rental-cost').value = r.cost || '';
    document.getElementById('rental-status').value = r.status;
    document.getElementById('rental-notes').value = r.notes || '';
    
    MC.openModal('add-rental-modal');
}

function editOrder(id) {
    const orders = MC.loadData(ORDERS_KEY) || [];
    const o = orders.find(x => x.id === id);
    if (!o) return;
    
    document.getElementById('order-id').value = o.id;
    document.getElementById('order-item').value = o.item;
    document.getElementById('order-source').value = o.source;
    document.getElementById('order-project').value = o.project || '';
    document.getElementById('order-date').value = o.orderDate;
    document.getElementById('order-delivery').value = o.deliveryDate || '';
    document.getElementById('order-cost').value = o.cost || '';
    document.getElementById('order-status').value = o.status;
    document.getElementById('order-tracking').value = o.tracking || '';
    document.getElementById('order-notes').value = o.notes || '';
    
    MC.openModal('add-order-modal');
}

// Make functions global
window.switchTab = switchTab;
window.saveVendor = saveVendor;
window.saveRental = saveRental;
window.saveOrder = saveOrder;
window.editVendor = editVendor;
window.editRental = editRental;
window.editOrder = editOrder;
window.deleteVendor = deleteVendor;
window.deleteRental = deleteRental;
window.deleteOrder = deleteOrder;
window.markReturned = markReturned;
window.markDelivered = markDelivered;
