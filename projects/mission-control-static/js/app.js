// Craftech360 Mission Control - Core Application

const AUTH_CODE = 'ravi381381';
const AUTH_KEY = 'cft_mc_auth';

// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true';
    const authModal = document.getElementById('auth-modal');
    const app = document.getElementById('app');
    
    if (isAuth) {
        if (authModal) authModal.classList.add('hidden');
        if (app) app.classList.remove('hidden');
    }
    
    // Auth form
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const code = document.getElementById('auth-code').value;
            const error = document.getElementById('auth-error');
            
            if (code === AUTH_CODE) {
                sessionStorage.setItem(AUTH_KEY, 'true');
                authModal.classList.add('hidden');
                app.classList.remove('hidden');
            } else {
                error.classList.remove('hidden');
            }
        });
    }

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Modal functions
function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// Storage helpers
function saveData(key, data) {
    localStorage.setItem(`cft_mc_${key}`, JSON.stringify(data));
}

function loadData(key) {
    const data = localStorage.getItem(`cft_mc_${key}`);
    return data ? JSON.parse(data) : null;
}

function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Date formatting
function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function formatDateTime(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Notifications
function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in ${
        type === 'success' ? 'bg-emerald-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notif.innerHTML = `<div class="flex items-center gap-2"><span>${message}</span></div>`;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateY(-10px)';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Department configuration
const DEPARTMENTS = {
    engineering: {
        name: 'Engineering',
        emoji: '⚒️',
        agent: 'Forge',
        group: 'CFT Engineering',
        color: 'blue'
    },
    creative: {
        name: 'Creative',
        emoji: '🔥',
        agent: 'Blaze',
        group: 'CFT Creative Hub',
        color: 'orange'
    },
    operations: {
        name: 'Operations',
        emoji: '🗺️',
        agent: 'Atlas',
        group: 'CFT Operations',
        color: 'green'
    },
    bd: {
        name: 'Business Development',
        emoji: '💼',
        agent: 'Blaze',
        group: 'CFT BD Team',
        color: 'purple'
    },
    hr: {
        name: 'HR & Admin',
        emoji: '👥',
        agent: 'Captain',
        group: 'CFT HR & ADMIN',
        color: 'pink'
    }
};

// Team data
const TEAM = {
    founders: [
        { name: 'RaviKumar', role: 'Founder & CEO', initials: 'R' },
        { name: 'Shrishail Pattar', role: 'Co-Founder & MD', initials: 'SP' },
        { name: 'Abilash S', role: 'Co-Founder & CTO', initials: 'AS' },
        { name: 'Pradeep Zille', role: 'Co-Founder & CBO', initials: 'PZ' }
    ],
    software: ['Chetan', 'Harsh', 'Kotresh', 'Karthikeya', 'Rahul', 'Yamuna'],
    embedded: ['Naveen', 'Shashank', 'Pratik'],
    creative: ['Akash', 'Divyashree', 'Manjunath', 'Nikhitha', 'Siva', 'Abhijith'],
    bd: ['Snehal', 'Avijit', 'Nishkal', 'Akshay', 'Amruta'],
    operations: ['Shivraj', 'Shivukumara', 'Thippeswamy', 'Varuna'],
    hr: ['Suman N', 'Suma NC']
};

// Agents data
const AGENTS = [
    { id: 'captain', name: 'Captain', emoji: '🎖️', role: 'Strategic Orchestrator', status: 'active', departments: ['hr', 'general'] },
    { id: 'blaze', name: 'Blaze', emoji: '🔥', role: 'Growth Lead', status: 'active', departments: ['creative', 'bd'] },
    { id: 'forge', name: 'Forge', emoji: '⚒️', role: 'Engineering Lead', status: 'active', departments: ['engineering'] },
    { id: 'atlas', name: 'Atlas', emoji: '🗺️', role: 'Operations Lead', status: 'active', departments: ['operations'] }
];

// Products data
const PRODUCTS = {
    kinetic: [
        { name: 'Aurora', desc: 'LED installation centerpiece with dynamic light & motion' },
        { name: 'Nebula', desc: '360° Volumetric Display, customizable stage backdrop' },
        { name: 'Kinetic Sliding LEDs', desc: 'Touch-controlled pillars merge into unified screen' },
        { name: 'HMRS', desc: 'Horizontal Movement Rotating Screens' },
        { name: 'DNA Display', desc: 'Multi-layer kinetic LED, 3D-like depth effect' },
        { name: 'Tri-Helix', desc: 'Rotating triangular screens, 360°' },
        { name: 'Matrix Screens', desc: 'Grid of synced moving monitors' },
        { name: 'Flying Screens', desc: 'Flowing sculpture with undulating waves' },
        { name: 'Split-Flap Display', desc: 'Physical flipping discs with signature click' },
        { name: 'Kinetic Winch', desc: 'Suspended LEDs that raise/lower in patterns' },
        { name: 'Origami Wall', desc: 'Folding surfaces that shift/expand' },
        { name: 'Sphere Matrix', desc: 'Spherical 360° LED display' }
    ],
    ai: [
        { name: 'AI Photobooth (SaaS)', desc: 'Cloud-based, multiple filters, subscription' },
        { name: 'AI Music Generator', desc: 'Prompt to custom music track' },
        { name: 'AI Bot Greeting', desc: 'Face recognition + personalized welcome' },
        { name: 'AI Bistro', desc: 'Personality quiz → coffee recommendation' },
        { name: 'AI Art', desc: 'Draw → AI brings it alive' },
        { name: 'Face Recognition Check-in', desc: 'Instant event entry' }
    ],
    photobooth: [
        { name: '360 Photobooth', desc: 'Rotating video booth' },
        { name: 'Mirror Photobooth', desc: 'Full-length mirror booth' },
        { name: 'Glambot', desc: 'High-speed camera arm' },
        { name: 'GIFF Booth', desc: 'GIF creation booth' },
        { name: 'Strip Photobooth', desc: 'Film strip style photos' },
        { name: 'AR Photobooth', desc: 'Augmented reality filters' }
    ],
    interactive: [
        { name: 'Immersive Room', desc: '360° projection mapped environment' },
        { name: 'LED Cube', desc: 'Multi-sided LED display cube' },
        { name: 'Holofans + Robotic Arm', desc: '3D holographic displays' },
        { name: 'Interactive Floor/Walls', desc: 'Motion-responsive displays' },
        { name: 'Gesture Screen', desc: 'Touchless gesture control' },
        { name: 'Touch Kiosk', desc: 'Interactive terminals' },
        { name: 'Anamorphic Display', desc: '3D illusion displays' }
    ],
    sustainability: [
        { name: 'Carbon Footprint Calculator', desc: 'Interactive environmental impact' },
        { name: 'Green Miles', desc: 'Gamified eco-friendly behavior' },
        { name: 'Step Into Power', desc: 'Energy-generating floor tiles' }
    ]
};

// Export for other modules
window.MC = {
    openModal,
    closeModal,
    saveData,
    loadData,
    generateId,
    formatDate,
    formatDateTime,
    showNotification,
    DEPARTMENTS,
    TEAM,
    AGENTS,
    PRODUCTS
};
