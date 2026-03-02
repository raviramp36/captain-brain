// Craftech360 Mission Control - Tasks Module

const TASKS_KEY = 'tasks';

// Sample tasks
const sampleTasks = [
    {
        id: 'task_001',
        title: 'Prepare LED panel test for Aurora installation',
        description: 'Run full diagnostic on all Aurora LED panels before Dell event',
        department: 'engineering',
        priority: 'high',
        status: 'progress',
        assignee: 'Naveen',
        project: 'Dell Annual Meet 2026',
        due: '2026-02-25',
        createdAt: '2026-02-18T10:00:00',
        createdBy: 'Ravi'
    },
    {
        id: 'task_002',
        title: 'Create social media content calendar for March',
        description: 'Plan Instagram and LinkedIn posts for entire month',
        department: 'creative',
        priority: 'normal',
        status: 'pending',
        assignee: 'Nikhitha',
        project: '',
        due: '2026-02-28',
        createdAt: '2026-02-19T14:00:00',
        createdBy: 'Ravi'
    },
    {
        id: 'task_003',
        title: 'Coordinate transport for Mumbai event',
        description: 'Book truck, arrange packing team, create checklist',
        department: 'operations',
        priority: 'urgent',
        status: 'progress',
        assignee: 'Shivraj',
        project: 'Amazon Product Launch',
        due: '2026-02-26',
        createdAt: '2026-02-17T11:00:00',
        createdBy: 'Pattar'
    },
    {
        id: 'task_004',
        title: 'Follow up with Titan for contract',
        description: 'They requested revised quote. Send and follow up.',
        department: 'bd',
        priority: 'high',
        status: 'approval',
        assignee: 'Snehal',
        project: 'Titan Brand Activation',
        due: '2026-02-22',
        createdAt: '2026-02-15T16:00:00',
        createdBy: 'Ravi'
    },
    {
        id: 'task_005',
        title: 'Complete onboarding for new embedded intern',
        description: 'Setup workstation, create accounts, assign mentor',
        department: 'hr',
        priority: 'normal',
        status: 'done',
        assignee: 'Suman',
        project: '',
        due: '2026-02-18',
        createdAt: '2026-02-16T09:00:00',
        createdBy: 'Ravi',
        completedAt: '2026-02-18T17:00:00'
    },
    {
        id: 'task_006',
        title: 'Design new product brochure',
        description: 'Update brochure with latest kinetic installations',
        department: 'creative',
        priority: 'normal',
        status: 'progress',
        assignee: 'Divyashree',
        project: '',
        due: '2026-03-01',
        createdAt: '2026-02-19T10:00:00',
        createdBy: 'Ravi'
    },
    {
        id: 'task_007',
        title: 'Fix AI Photobooth login issue',
        description: 'Users reporting intermittent login failures',
        department: 'engineering',
        priority: 'urgent',
        status: 'pending',
        assignee: 'Chetan',
        project: 'AI Photobooth SaaS',
        due: '2026-02-21',
        createdAt: '2026-02-20T08:00:00',
        createdBy: 'Abilash'
    }
];

// Initialize tasks
document.addEventListener('DOMContentLoaded', function() {
    let tasks = MC.loadData(TASKS_KEY);
    if (!tasks || tasks.length === 0) {
        tasks = sampleTasks;
        MC.saveData(TASKS_KEY, tasks);
    }
    
    renderTasks(tasks);
    setupEventListeners();
});

// Render tasks
function renderTasks(tasks) {
    renderKanban(tasks);
    renderList(tasks);
}

// Render Kanban view
function renderKanban(tasks) {
    const columns = {
        pending: document.getElementById('col-pending'),
        progress: document.getElementById('col-progress'),
        approval: document.getElementById('col-approval'),
        done: document.getElementById('col-done')
    };
    
    // Clear columns
    Object.values(columns).forEach(col => { if (col) col.innerHTML = ''; });
    
    // Group tasks
    const grouped = { pending: [], progress: [], approval: [], done: [] };
    tasks.forEach(task => {
        if (grouped[task.status]) {
            grouped[task.status].push(task);
        }
    });
    
    // Sort by priority
    const priorityOrder = { urgent: 0, high: 1, normal: 2 };
    Object.values(grouped).forEach(arr => {
        arr.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));
    });
    
    // Render cards
    Object.entries(grouped).forEach(([status, statusTasks]) => {
        if (!columns[status]) return;
        
        statusTasks.forEach(task => {
            columns[status].innerHTML += createKanbanCard(task);
        });
        
        // Update counts
        const countEl = document.getElementById(`count-${status}`);
        if (countEl) countEl.textContent = statusTasks.length;
    });
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Create Kanban card
function createKanbanCard(task) {
    const dept = MC.DEPARTMENTS[task.department] || {};
    const priorityColors = {
        urgent: 'border-l-4 border-l-red-500',
        high: 'border-l-4 border-l-orange-500',
        normal: ''
    };
    const priorityBadges = {
        urgent: '<span class="badge priority-urgent">🔴 Urgent</span>',
        high: '<span class="badge priority-high">🟠 High</span>',
        normal: ''
    };
    
    const isOverdue = task.due && new Date(task.due) < new Date() && task.status !== 'done';
    
    return `
        <div class="kanban-card ${priorityColors[task.priority] || ''}" onclick="viewTask('${task.id}')">
            <div class="flex items-start justify-between mb-2">
                <span class="text-lg">${dept.emoji || '📋'}</span>
                ${priorityBadges[task.priority] || ''}
            </div>
            <h4 class="font-medium text-slate-900 mb-2">${task.title}</h4>
            <div class="space-y-1 text-sm text-slate-500">
                ${task.assignee ? `<div class="flex items-center gap-1"><i data-lucide="user" class="w-3 h-3"></i>${task.assignee}</div>` : ''}
                ${task.due ? `<div class="flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}"><i data-lucide="calendar" class="w-3 h-3"></i>${isOverdue ? '⚠️ ' : ''}${MC.formatDate(task.due)}</div>` : ''}
                ${task.project ? `<div class="flex items-center gap-1"><i data-lucide="folder" class="w-3 h-3"></i>${task.project}</div>` : ''}
            </div>
        </div>
    `;
}

// Render List view
function renderList(tasks) {
    const tbody = document.getElementById('tasks-table-body');
    if (!tbody) return;
    
    const statusBadges = {
        pending: '<span class="badge badge-warning">Pending</span>',
        progress: '<span class="badge badge-info">In Progress</span>',
        approval: '<span class="badge badge-purple">Awaiting Approval</span>',
        done: '<span class="badge badge-success">Done</span>'
    };
    
    const priorityBadges = {
        urgent: '<span class="badge priority-urgent">Urgent</span>',
        high: '<span class="badge priority-high">High</span>',
        normal: '<span class="badge priority-normal">Normal</span>'
    };
    
    tbody.innerHTML = tasks.map(task => {
        const dept = MC.DEPARTMENTS[task.department] || {};
        return `
            <tr>
                <td>
                    <div class="font-medium text-slate-900">${task.title}</div>
                    ${task.project ? `<div class="text-sm text-slate-500">${task.project}</div>` : ''}
                </td>
                <td><span class="flex items-center gap-1">${dept.emoji || ''} ${dept.name || task.department}</span></td>
                <td>${task.assignee || '-'}</td>
                <td>${priorityBadges[task.priority] || ''}</td>
                <td>${statusBadges[task.status] || ''}</td>
                <td>${task.due ? MC.formatDate(task.due) : '-'}</td>
                <td>
                    <button onclick="viewTask('${task.id}')" class="text-blue-600 hover:text-blue-800 mr-2">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <button onclick="editTask('${task.id}')" class="text-slate-600 hover:text-slate-800 mr-2">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                    </button>
                    <button onclick="deleteTask('${task.id}')" class="text-red-600 hover:text-red-800">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Setup event listeners
function setupEventListeners() {
    // View toggle
    const kanbanBtn = document.getElementById('view-kanban');
    const listBtn = document.getElementById('view-list');
    const kanbanBoard = document.getElementById('kanban-board');
    const listView = document.getElementById('list-view');
    
    if (kanbanBtn && listBtn) {
        kanbanBtn.addEventListener('click', () => {
            kanbanBtn.classList.add('bg-slate-100', 'text-slate-700');
            kanbanBtn.classList.remove('text-slate-500');
            listBtn.classList.remove('bg-slate-100', 'text-slate-700');
            listBtn.classList.add('text-slate-500');
            kanbanBoard.classList.remove('hidden');
            listView.classList.add('hidden');
        });
        
        listBtn.addEventListener('click', () => {
            listBtn.classList.add('bg-slate-100', 'text-slate-700');
            listBtn.classList.remove('text-slate-500');
            kanbanBtn.classList.remove('bg-slate-100', 'text-slate-700');
            kanbanBtn.classList.add('text-slate-500');
            listView.classList.remove('hidden');
            kanbanBoard.classList.add('hidden');
        });
    }
    
    // Department select - show WhatsApp preview
    const deptSelect = document.getElementById('task-department');
    if (deptSelect) {
        deptSelect.addEventListener('change', function() {
            const preview = document.getElementById('whatsapp-preview');
            const target = document.getElementById('whatsapp-target');
            const agent = document.getElementById('whatsapp-agent');
            const dept = MC.DEPARTMENTS[this.value];
            
            if (dept) {
                preview.classList.remove('hidden');
                target.textContent = dept.group;
                agent.textContent = `Managed by: ${dept.agent} ${dept.emoji}`;
            } else {
                preview.classList.add('hidden');
            }
        });
    }
    
    // Filters
    const filterDept = document.getElementById('filter-department');
    const filterPriority = document.getElementById('filter-priority');
    const searchInput = document.getElementById('search-tasks');
    
    [filterDept, filterPriority, searchInput].forEach(el => {
        if (el) {
            el.addEventListener('change', filterTasks);
            el.addEventListener('input', filterTasks);
        }
    });
}

// Filter tasks
function filterTasks() {
    const dept = document.getElementById('filter-department')?.value;
    const priority = document.getElementById('filter-priority')?.value;
    const search = document.getElementById('search-tasks')?.value.toLowerCase();
    
    let tasks = MC.loadData(TASKS_KEY) || [];
    
    if (dept) tasks = tasks.filter(t => t.department === dept);
    if (priority) tasks = tasks.filter(t => t.priority === priority);
    if (search) tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(search) ||
        (t.assignee && t.assignee.toLowerCase().includes(search)) ||
        (t.project && t.project.toLowerCase().includes(search))
    );
    
    renderTasks(tasks);
}

// Open new task modal
function openNewTaskModal() {
    document.getElementById('task-id').value = '';
    document.getElementById('task-form').reset();
    document.getElementById('whatsapp-preview').classList.add('hidden');
    MC.openModal('new-task-modal');
}

// Save task
function saveTask() {
    const id = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value;
    const department = document.getElementById('task-department').value;
    
    if (!title || !department) {
        MC.showNotification('Please fill in required fields', 'error');
        return;
    }
    
    const taskData = {
        id: id || MC.generateId(),
        title: title,
        description: document.getElementById('task-description').value,
        department: department,
        priority: document.getElementById('task-priority').value,
        status: id ? undefined : 'pending',
        assignee: document.getElementById('task-assignee').value,
        project: document.getElementById('task-project').value,
        due: document.getElementById('task-due').value,
        createdAt: id ? undefined : new Date().toISOString(),
        createdBy: 'Founder'
    };
    
    let tasks = MC.loadData(TASKS_KEY) || [];
    
    if (id) {
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...taskData };
        }
    } else {
        taskData.status = 'pending';
        tasks.push(taskData);
    }
    
    MC.saveData(TASKS_KEY, tasks);
    MC.closeModal('new-task-modal');
    
    // Show WhatsApp notification
    const dept = MC.DEPARTMENTS[department];
    if (dept && !id) {
        MC.showNotification(`Task sent to ${dept.group} via WhatsApp!`, 'success');
    } else {
        MC.showNotification(id ? 'Task updated!' : 'Task created!', 'success');
    }
    
    renderTasks(tasks);
}

// View task
function viewTask(id) {
    const tasks = MC.loadData(TASKS_KEY) || [];
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const dept = MC.DEPARTMENTS[task.department] || {};
    const statusLabels = {
        pending: 'Pending',
        progress: 'In Progress',
        approval: 'Awaiting Approval',
        done: 'Completed'
    };
    
    document.getElementById('task-details').innerHTML = `
        <div class="space-y-4">
            <div class="flex items-start gap-3">
                <span class="text-3xl">${dept.emoji || '📋'}</span>
                <div>
                    <h3 class="text-xl font-semibold text-slate-900">${task.title}</h3>
                    <p class="text-slate-500">${dept.name || task.department}</p>
                </div>
            </div>
            
            ${task.description ? `<div class="p-4 bg-slate-50 rounded-lg text-slate-700">${task.description}</div>` : ''}
            
            <div class="grid grid-cols-2 gap-4">
                <div class="p-3 bg-slate-50 rounded-lg">
                    <div class="text-xs text-slate-500 uppercase">Status</div>
                    <div class="font-medium">${statusLabels[task.status] || task.status}</div>
                </div>
                <div class="p-3 bg-slate-50 rounded-lg">
                    <div class="text-xs text-slate-500 uppercase">Priority</div>
                    <div class="font-medium">${task.priority}</div>
                </div>
                ${task.assignee ? `
                <div class="p-3 bg-slate-50 rounded-lg">
                    <div class="text-xs text-slate-500 uppercase">Assignee</div>
                    <div class="font-medium">${task.assignee}</div>
                </div>` : ''}
                ${task.due ? `
                <div class="p-3 bg-slate-50 rounded-lg">
                    <div class="text-xs text-slate-500 uppercase">Due Date</div>
                    <div class="font-medium">${MC.formatDate(task.due)}</div>
                </div>` : ''}
                ${task.project ? `
                <div class="p-3 bg-slate-50 rounded-lg col-span-2">
                    <div class="text-xs text-slate-500 uppercase">Project</div>
                    <div class="font-medium">${task.project}</div>
                </div>` : ''}
            </div>
            
            <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div class="text-sm text-emerald-700">
                    <strong>WhatsApp Group:</strong> ${dept.group || 'N/A'}<br>
                    <strong>Managed by:</strong> ${dept.agent || 'N/A'}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('task-actions').innerHTML = `
        ${task.status !== 'done' ? `
            <button onclick="updateTaskStatus('${task.id}', 'done')" class="btn btn-success">
                <i data-lucide="check" class="w-4 h-4 inline mr-1"></i>Mark Complete
            </button>
            <button onclick="sendFollowUp('${task.id}')" class="btn btn-secondary">
                <i data-lucide="message-circle" class="w-4 h-4 inline mr-1"></i>Send Follow-up
            </button>
        ` : ''}
        <button onclick="editTask('${task.id}')" class="btn btn-secondary">Edit</button>
        <button onclick="MC.closeModal('view-task-modal')" class="btn btn-secondary">Close</button>
    `;
    
    MC.openModal('view-task-modal');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Edit task
function editTask(id) {
    MC.closeModal('view-task-modal');
    
    const tasks = MC.loadData(TASKS_KEY) || [];
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description || '';
    document.getElementById('task-department').value = task.department;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-due').value = task.due || '';
    document.getElementById('task-assignee').value = task.assignee || '';
    document.getElementById('task-project').value = task.project || '';
    
    // Trigger department preview
    document.getElementById('task-department').dispatchEvent(new Event('change'));
    
    MC.openModal('new-task-modal');
}

// Update task status
function updateTaskStatus(id, newStatus) {
    let tasks = MC.loadData(TASKS_KEY) || [];
    const index = tasks.findIndex(t => t.id === id);
    
    if (index !== -1) {
        tasks[index].status = newStatus;
        if (newStatus === 'done') {
            tasks[index].completedAt = new Date().toISOString();
        }
        MC.saveData(TASKS_KEY, tasks);
        MC.closeModal('view-task-modal');
        MC.showNotification('Task marked as complete!', 'success');
        renderTasks(tasks);
    }
}

// Send follow-up
function sendFollowUp(id) {
    const tasks = MC.loadData(TASKS_KEY) || [];
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const dept = MC.DEPARTMENTS[task.department];
    MC.showNotification(`Follow-up sent to ${dept?.group || 'WhatsApp'}!`, 'success');
}

// Delete task
function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    let tasks = MC.loadData(TASKS_KEY) || [];
    tasks = tasks.filter(t => t.id !== id);
    MC.saveData(TASKS_KEY, tasks);
    MC.showNotification('Task deleted', 'error');
    renderTasks(tasks);
}

// Make functions global
window.openNewTaskModal = openNewTaskModal;
window.saveTask = saveTask;
window.viewTask = viewTask;
window.editTask = editTask;
window.updateTaskStatus = updateTaskStatus;
window.sendFollowUp = sendFollowUp;
window.deleteTask = deleteTask;
