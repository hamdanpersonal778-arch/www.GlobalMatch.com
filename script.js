// Sample Client Data
const clientsData = [
    {
        id: 1,
        name: "TechStartup Inc",
        title: "CEO",
        category: "Web Development",
        budget: "$15,000",
        description: "Looking for a full-stack developer to build our e-commerce platform. Need someone with React and Node.js experience.",
        posted: "2 hours ago",
        avatar: "TS"
    },
    {
        id: 2,
        name: "Fashion Brand Co",
        title: "Marketing Manager",
        category: "Digital Marketing",
        budget: "$12,000",
        description: "Need creative digital marketing campaign for Q1 2026. Social media, content creation, and paid ads.",
        posted: "5 hours ago",
        avatar: "FB"
    },
    {
        id: 3,
        name: "E-Learning Platform",
        title: "Content Director",
        category: "Video Production",
        budget: "$18,000",
        description: "Create 10 educational videos for our online courses. High-quality production required.",
        posted: "1 day ago",
        avatar: "EL"
    },
    {
        id: 4,
        name: "Design Studio",
        title: "Project Lead",
        category: "Design",
        budget: "$10,000",
        description: "Logo and brand identity design for new coffee shop. Need modern and minimalist approach.",
        posted: "1 day ago",
        avatar: "DS"
    },
    {
        id: 5,
        name: "Corporate Training",
        title: "HR Manager",
        category: "Consulting",
        budget: "$15,000",
        description: "Business consulting for organizational restructuring. Need experience in corporate environments.",
        posted: "2 days ago",
        avatar: "CT"
    },
    {
        id: 6,
        name: "Content Agency",
        title: "Editor",
        category: "Writing",
        budget: "$8,000",
        description: "Blog posts, articles, and web copy writing. Need SEO-optimized content for SaaS marketing.",
        posted: "2 days ago",
        avatar: "CA"
    },
    {
        id: 7,
        name: "Mobile App Startup",
        title: "CTO",
        category: "Web Development",
        budget: "$15,000",
        description: "iOS and Android app development. Cross-platform solution needed with 3-month timeline.",
        posted: "3 days ago",
        avatar: "MA"
    },
    {
        id: 8,
        name: "Digital Agency",
        title: "Strategy Director",
        category: "Digital Marketing",
        budget: "$14,000",
        description: "Complete SEO optimization and Google Ads campaign management for B2B company.",
        posted: "3 days ago",
        avatar: "DA"
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadClients();
    setupEventListeners();
});
const JOBS_KEY = 'gmc_jobs_v1'
const APPS_KEY = 'gmc_apps_v1'

let jobs = []
let only15k = false
let currentApplyJobId = null

const els = {
    jobs: document.getElementById('jobs'),
    jobForm: document.getElementById('job-form'),
    postFormSection: document.getElementById('post-form'),
    showPostBtn: document.getElementById('show-post-form'),
    cancelPostBtn: document.getElementById('cancel-post'),
    filter15k: document.getElementById('filter-15k'),
    applyModal: document.getElementById('apply-modal'),
    closeModal: document.getElementById('close-modal'),
    applyForm: document.getElementById('apply-form'),
    modalJobTitle: document.getElementById('modal-job-title'),
    applyFeedback: document.getElementById('apply-feedback')
}

function loadJobs(){
    const raw = localStorage.getItem(JOBS_KEY)
    if(raw){
        jobs = JSON.parse(raw)
    } else {
        // seed sample jobs
        jobs = [
            {id:Date.now()+1,title:'Website redesign for SaaS',company:'BluePeak',description:'Full redesign and performance optimization.',salary:15000,taken:false,createdAt:Date.now()},
            {id:Date.now()+2,title:'E-commerce platform build',company:'Harbor Inc',description:'Develop MVP e-commerce site with payments.',salary:18000,taken:false,createdAt:Date.now()},
            {id:Date.now()+3,title:'Mobile app UI/UX',company:'Pixel Labs',description:'Design premium mobile app screens and prototype.',salary:15000,taken:false,createdAt:Date.now()}
        ]
        saveJobs()
    }
}

function saveJobs(){
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
}

function saveApplication(app){
    const raw = localStorage.getItem(APPS_KEY)
    const apps = raw? JSON.parse(raw):[]
    apps.push(app)
    localStorage.setItem(APPS_KEY, JSON.stringify(apps))
}

function renderJobs(){
    els.jobs.innerHTML = ''
    const list = only15k ? jobs.filter(j=>j.salary>=15000) : jobs.slice().sort((a,b)=>b.createdAt-a.createdAt)

    if(list.length===0){
        els.jobs.innerHTML = '<div class="card">No jobs yet. Post one!</div>'
        return
    }

    list.forEach(job=>{
        const card = document.createElement('article')
        card.className = 'job'
        card.innerHTML = `
            <h4>${escapeHtml(job.title)}</h4>
            <div class="meta">${escapeHtml(job.company)} • <span class="salary">$${numberWithCommas(job.salary)}</span></div>
            <div class="desc">${escapeHtml(job.description)}</div>
            <div class="actions">
                <button class="btn-primary apply-btn" data-id="${job.id}" ${job.taken? 'disabled': ''}>Apply</button>
                <button class="btn-outline take-btn" data-id="${job.id}" ${job.taken? 'disabled': ''}>Take Client</button>
            </div>
        `
        if(job.taken){
            const badge = document.createElement('div')
            badge.style.marginTop='8px'
            badge.style.color='#065f46'
            badge.textContent = 'Status: Taken'
            card.appendChild(badge)
        }
        els.jobs.appendChild(card)
    })

    // bind events
    document.querySelectorAll('.apply-btn').forEach(b=>b.addEventListener('click', e=>openApplyModal(e.target.dataset.id)))
    document.querySelectorAll('.take-btn').forEach(b=>b.addEventListener('click', e=>takeClient(Number(e.target.dataset.id))))
}

function openApplyModal(id){
    const job = jobs.find(j=>j.id==id)
    if(!job) return
    currentApplyJobId = job.id
    els.modalJobTitle.textContent = `Apply — ${job.title}`
    els.applyFeedback.classList.add('hidden')
    els.applyModal.classList.remove('hidden')
}

function closeApplyModal(){
    currentApplyJobId = null
    els.applyModal.classList.add('hidden')
    els.applyForm.reset()
}

function takeClient(id){
    const job = jobs.find(j=>j.id===id)
    if(!job) return
    if(job.taken){ alert('Job already taken'); return }
    if(!confirm('Mark this job as taken (simulate accepting client)?')) return
    job.taken = true
    saveJobs()
    renderJobs()
    alert('You marked the job as taken. Congratulations!')
}

function numberWithCommas(x){ return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]) }

// Handlers
document.addEventListener('DOMContentLoaded', ()=>{
    loadJobs()
    renderJobs()

    els.showPostBtn.addEventListener('click', ()=>els.postFormSection.classList.toggle('hidden'))
    els.cancelPostBtn.addEventListener('click', ()=>els.postFormSection.classList.add('hidden'))

    els.jobForm.addEventListener('submit', e=>{
        e.preventDefault()
        const title = document.getElementById('title').value.trim()
        const company = document.getElementById('company').value.trim()
        const description = document.getElementById('description').value.trim()
        const salary = Number(document.getElementById('salary').value) || 0
        if(!title||!company||!description){ alert('Please complete the form'); return }
        const job = {id:Date.now(),title,company,description,salary,taken:false,createdAt:Date.now()}
        jobs.unshift(job)
        saveJobs()
        renderJobs()
        els.jobForm.reset()
        els.postFormSection.classList.add('hidden')
        alert('Job posted — visible locally in your browser')
    })

    els.filter15k.addEventListener('click', ()=>{
        only15k = !only15k
        els.filter15k.textContent = only15k ? 'Showing $15k+' : 'Only $15,000'
        els.filter15k.classList.toggle('btn-primary', only15k)
        renderJobs()
    })

    els.closeModal.addEventListener('click', closeApplyModal)
    els.applyForm.addEventListener('submit', e=>{
        e.preventDefault()
        const name = document.getElementById('applicant-name').value.trim()
        const email = document.getElementById('applicant-email').value.trim()
        const proposal = document.getElementById('applicant-proposal').value.trim()
        if(!name||!email||!proposal){ alert('Please complete the form'); return }
        const app = {id:Date.now(),jobId:currentApplyJobId,name,email,proposal,createdAt:Date.now()}
        saveApplication(app)
        els.applyFeedback.textContent = 'Proposal saved locally. Client contact simulated.'
        els.applyFeedback.classList.remove('hidden')
        els.applyForm.reset()
        // optionally mark job as taken automatically for $15k jobs
        const job = jobs.find(j=>j.id===currentApplyJobId)
        if(job && job.salary>=15000){ job.taken = true; saveJobs(); renderJobs() }
        setTimeout(closeApplyModal,1200)
    })
})

// Load and display clients
function loadClients() {
    const clientsGrid = document.getElementById('clientsGrid');
    
    if (!clientsGrid) return;

    clientsGrid.innerHTML = clientsData.map(client => `
        <div class="client-card">
            <div class="client-header">
                <div class="client-avatar">${client.avatar}</div>
                <div>
                    <div class="client-name">${client.name}</div>
                    <div class="client-title">${client.title}</div>
                </div>
            </div>
            <div class="client-budget">${client.budget}</div>
            <div class="client-category">${client.category}</div>
            <p class="client-description">${client.description}</p>
            <div class="client-footer">
                <span class="client-posted">${client.posted}</span>
                <button class="btn-propose" onclick="handleProposal(${client.id})">Send Proposal</button>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    // Browse Clients button
    const browseBtn = document.querySelector('.hero-content .btn-primary');
    if (browseBtn) {
        browseBtn.addEventListener('click', scrollToSection('#clients'));
    }

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
}

// Smooth scroll function
function smoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href === '#') return;
    
    const element = document.querySelector(href);
    if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Scroll to section
function scrollToSection(sectionId) {
    return function() {
        const element = document.querySelector(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
}

// Handle search
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const categorySelect = document.querySelectorAll('.filter-select')[0];
    const budgetSelect = document.querySelectorAll('.filter-select')[1];

    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    const selectedBudget = budgetSelect.value;

    let filteredClients = clientsData.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm) || 
                              client.description.toLowerCase().includes(searchTerm) ||
                              client.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = selectedCategory === 'All Categories' || 
                               client.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    // Update display
    const clientsGrid = document.getElementById('clientsGrid');
    if (clientsGrid) {
        if (filteredClients.length === 0) {
            clientsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No clients found matching your criteria. Try adjusting your filters.</p>';
        } else {
            clientsGrid.innerHTML = filteredClients.map(client => `
                <div class="client-card">
                    <div class="client-header">
                        <div class="client-avatar">${client.avatar}</div>
                        <div>
                            <div class="client-name">${client.name}</div>
                            <div class="client-title">${client.title}</div>
                        </div>
                    </div>
                    <div class="client-budget">${client.budget}</div>
                    <div class="client-category">${client.category}</div>
                    <p class="client-description">${client.description}</p>
                    <div class="client-footer">
                        <span class="client-posted">${client.posted}</span>
                        <button class="btn-propose" onclick="handleProposal(${client.id})">Send Proposal</button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Scroll to results
    const clientsSection = document.getElementById('clients');
    if (clientsSection) {
        clientsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle proposal submission
function handleProposal(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    
    if (client) {
        alert(`Proposal sent to ${client.name}!\n\nYour proposal for their ${client.category} project (${client.budget}) has been submitted.\n\nThey will review and contact you soon.`);
    }
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || document.querySelector('.contact-form input[type="text"]').value;
    const email = formData.get('email') || document.querySelector('.contact-form input[type="email"]').value;
    const message = formData.get('message') || document.querySelector('.contact-form textarea').value;

    if (name && email && message) {
        alert('Thank you for your message! We will get back to you soon.');
        e.target.reset();
    }
}

// Login button handler
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            alert('Login feature coming soon! Sign up to get started.');
        });
    }

    const signupBtn = document.querySelector('.btn-signup');
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            alert('Sign up page coming soon! Get ready to find amazing clients.');
        });
    }
});
