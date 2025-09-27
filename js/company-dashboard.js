// ===================================
// COMPANY DASHBOARD JAVASCRIPT
// ===================================

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8787/api/v1";

// Global state
let currentCompany = null;
let currentJobs = [];
let currentApplications = [];
let currentCategories = [];
let currentSection = 'overview';

// API Service Functions
class CompanyAPI {
    static async fetchCompany(companyId) {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/${companyId}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Failed to fetch company');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching company:', error);
            showNotification('Failed to load company information', 'error');
            return null;
        }
    }

    static async updateCompany(companyId, companyData) {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update company");
            }

            return data.data;
        } catch (error) {
            console.error("Error updating company:", error);
            throw error;
        }
    }

    static async fetchCompanyJobs(companyId) {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/${companyId}/jobs`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Failed to fetch company jobs');
            }
            
            return data.data || [];
        } catch (error) {
            console.error('Error fetching company jobs:', error);
            showNotification('Failed to load jobs', 'error');
            return [];
        }
    }

    static async createJob(companyId, jobData) {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/${companyId}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create job");
            }

            return data.data;
        } catch (error) {
            console.error("Error creating job:", error);
            throw error;
        }
    }

    static async updateJob(jobId, jobData) {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update job");
            }

            return data.data;
        } catch (error) {
            console.error("Error updating job:", error);
            throw error;
        }
    }

    static async deleteJob(jobId) {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete job");
            }

            return data;
        } catch (error) {
            console.error("Error deleting job:", error);
            throw error;
        }
    }

    static async fetchJobApplications(jobId) {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applications`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Failed to fetch applications');
            }
            
            return data.data || [];
        } catch (error) {
            console.error('Error fetching applications:', error);
            return [];
        }
    }

    static async updateApplicationStatus(applicationId, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update application status");
            }

            return data.data;
        } catch (error) {
            console.error("Error updating application status:", error);
            throw error;
        }
    }

    static async fetchCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Failed to fetch categories');
            }
            
            return data.data || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
}

// Utility Functions
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${
            type === "success" ? "check-circle" : 
            type === "error" ? "exclamation-circle" : 
            "info-circle"
        }"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add("show"), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
        return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
}

// Company Info Template
function createCompanyInfoTemplate(company) {
    if (!company) {
        return `
            <div class="empty-state">
                <i class="fas fa-building"></i>
                <h3>No Company Found</h3>
                <p>Please create a company profile first.</p>
            </div>
        `;
    }

    return `
        <div class="company-header">
            <div class="company-logo-large">
                <img src="${company.logo || 'https://via.placeholder.com/80x80?text=' + company.name.charAt(0)}" alt="${company.name}">
            </div>
            <div class="company-details">
                <h1>${company.name}</h1>
                <p><i class="fas fa-industry"></i> ${company.industry || 'Not specified'}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${company.location || 'Not specified'}</p>
                <p><i class="fas fa-users"></i> ${company.size || 'Not specified'}</p>
                ${company.website ? `<p><i class="fas fa-globe"></i> <a href="${company.website}" target="_blank">${company.website}</a></p>` : ''}
            </div>
        </div>
        <div class="company-description">
            <p>${company.description || 'No description available'}</p>
        </div>
    `;
}

// Job Card Template
function createJobCardTemplate(job) {
    const timeAgo = getTimeAgo(job.createdAt);
    
    return `
        <div class="job-card-dashboard" data-job-id="${job.id}">
            <div class="job-card-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <div class="job-meta">
                        <span class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            ${job.location || 'Not specified'}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-briefcase"></i>
                            ${job.type || 'Not specified'}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-money-bill-wave"></i>
                            ${job.salary || 'Not specified'}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-clock"></i>
                            ${timeAgo}
                        </span>
                    </div>
                </div>
                <div class="job-actions">
                    <button class="btn-secondary edit-job-btn" data-job-id="${job.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-secondary view-applications-btn" data-job-id="${job.id}">
                        <i class="fas fa-users"></i> Applications
                    </button>
                    <button class="btn-danger delete-job-btn" data-job-id="${job.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="job-description">
                <p>${job.description ? job.description.substring(0, 200) + '...' : 'No description'}</p>
            </div>
        </div>
    `;
}

// Application Card Template
function createApplicationCardTemplate(application) {
    const timeAgo = getTimeAgo(application.createdAt);
    const statusClass = `status-${application.status || 'pending'}`;
    
    return `
        <div class="application-card" data-application-id="${application.id}">
            <div class="application-header">
                <div class="applicant-info">
                    <h4>${application.fullName}</h4>
                    <p>Applied for: ${application.jobTitle || 'Unknown Job'}</p>
                    <p><i class="fas fa-clock"></i> Applied ${timeAgo}</p>
                </div>
                <span class="application-status ${statusClass}">
                    ${(application.status || 'pending').toUpperCase()}
                </span>
            </div>
            <div class="application-details">
                <p><strong>Email:</strong> ${application.email}</p>
                <p><strong>Phone:</strong> ${application.phone}</p>
                ${application.coverLetter ? `<p><strong>Cover Letter:</strong> ${application.coverLetter.substring(0, 150)}...</p>` : ''}
                ${application.resumeUrl ? `<p><strong>Resume:</strong> <a href="${application.resumeUrl}" target="_blank">View Resume</a></p>` : ''}
            </div>
            <div class="application-actions">
                <button class="btn-secondary view-application-btn" data-application-id="${application.id}">
                    View Details
                </button>
                <select class="status-select" data-application-id="${application.id}">
                    <option value="pending" ${application.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="reviewed" ${application.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
                    <option value="interviewed" ${application.status === 'interviewed' ? 'selected' : ''}>Interviewed</option>
                    <option value="hired" ${application.status === 'hired' ? 'selected' : ''}>Hired</option>
                    <option value="rejected" ${application.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </div>
        </div>
    `;
}

// Load Company Information
async function loadCompanyInfo() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        showNotification('Please log in to access the dashboard', 'error');
        return;
    }

    // For now, we'll use the userId as companyId
    // In a real app, you'd have a separate company creation flow
    const companyId = userId;
    
    try {
        currentCompany = await CompanyAPI.fetchCompany(companyId);
        const companyInfoCard = document.getElementById('companyInfoCard');
        
        if (currentCompany) {
            companyInfoCard.innerHTML = createCompanyInfoTemplate(currentCompany);
        } else {
            companyInfoCard.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-building"></i>
                    <h3>Company Not Found</h3>
                    <p>Please create a company profile first.</p>
                    <button class="btn-primary" onclick="showCompanyCreationModal()">
                        Create Company
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading company info:', error);
    }
}

// Load Jobs
async function loadJobs() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const companyId = userId;
    
    try {
        currentJobs = await CompanyAPI.fetchCompanyJobs(companyId);
        const jobsContainer = document.getElementById('jobsContainer');
        
        if (currentJobs.length === 0) {
            jobsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-briefcase"></i>
                    <h3>No Jobs Posted</h3>
                    <p>Start by posting your first job opening.</p>
                    <button class="btn-primary" onclick="showJobModal()">
                        Post Your First Job
                    </button>
                </div>
            `;
        } else {
            jobsContainer.innerHTML = `
                <div class="jobs-grid">
                    ${currentJobs.map(job => createJobCardTemplate(job)).join('')}
                </div>
            `;
            
            // Add event listeners
            addJobEventListeners();
        }
        
        updateStats();
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}

// Load Applications
async function loadApplications() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const companyId = userId;
    
    try {
        // Get all applications for all jobs
        const allApplications = [];
        for (const job of currentJobs) {
            const applications = await CompanyAPI.fetchJobApplications(job.id);
            applications.forEach(app => {
                app.jobTitle = job.title;
                allApplications.push(app);
            });
        }
        
        currentApplications = allApplications;
        const applicationsContainer = document.getElementById('applicationsContainer');
        
        if (currentApplications.length === 0) {
            applicationsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>No Applications Yet</h3>
                    <p>Applications will appear here once candidates start applying to your jobs.</p>
                </div>
            `;
        } else {
            applicationsContainer.innerHTML = currentApplications.map(app => createApplicationCardTemplate(app)).join('');
            
            // Add event listeners
            addApplicationEventListeners();
        }
        
        updateStats();
    } catch (error) {
        console.error('Error loading applications:', error);
    }
}

// Load Recent Applications for Overview
async function loadRecentApplications() {
    const recentApplicationsContainer = document.getElementById('recentApplications');
    
    if (currentApplications.length === 0) {
        recentApplicationsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>No Recent Applications</h3>
                <p>Recent applications will appear here.</p>
            </div>
        `;
        return;
    }
    
    // Show last 5 applications
    const recentApps = currentApplications.slice(0, 5);
    recentApplicationsContainer.innerHTML = recentApps.map(app => createApplicationCardTemplate(app)).join('');
    
    // Add event listeners
    addApplicationEventListeners();
}

// Update Statistics
function updateStats() {
    document.getElementById('totalJobs').textContent = currentJobs.length;
    document.getElementById('totalApplications').textContent = currentApplications.length;
    document.getElementById('pendingApplications').textContent = 
        currentApplications.filter(app => app.status === 'pending').length;
    document.getElementById('hiredCount').textContent = 
        currentApplications.filter(app => app.status === 'hired').length;
}

// Load Categories
async function loadCategories() {
    try {
        currentCategories = await CompanyAPI.fetchCategories();
        const categorySelect = document.querySelector('select[name="categoryId"]');
        
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Select category</option>' +
                currentCategories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Event Listeners
function addJobEventListeners() {
    // Edit job buttons
    document.querySelectorAll('.edit-job-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            const job = currentJobs.find(j => j.id === jobId);
            if (job) {
                showJobModal(job);
            }
        });
    });
    
    // Delete job buttons
    document.querySelectorAll('.delete-job-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            const job = currentJobs.find(j => j.id === jobId);
            if (job) {
                deleteJob(job);
            }
        });
    });
    
    // View applications buttons
    document.querySelectorAll('.view-applications-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            switchToSection('applications');
            // Filter applications by job
            filterApplicationsByJob(jobId);
        });
    });
}

function addApplicationEventListeners() {
    // View application buttons
    document.querySelectorAll('.view-application-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const applicationId = this.getAttribute('data-application-id');
            const application = currentApplications.find(app => app.id === applicationId);
            if (application) {
                showApplicationModal(application);
            }
        });
    });
    
    // Status change selects
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            const applicationId = this.getAttribute('data-application-id');
            const newStatus = this.value;
            updateApplicationStatus(applicationId, newStatus);
        });
    });
}

// Navigation
function switchToSection(section) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Update page title
    document.getElementById('pageTitle').textContent = 
        section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ');
    
    // Show/hide sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');
    
    currentSection = section;
    
    // Load section-specific data
    switch (section) {
        case 'overview':
            loadRecentApplications();
            break;
        case 'jobs':
            loadJobs();
            break;
        case 'applications':
            loadApplications();
            break;
    }
}

// Job Modal Functions
function showJobModal(job = null) {
    const modal = document.getElementById('jobModal');
    const title = document.getElementById('jobModalTitle');
    const form = document.getElementById('jobForm');
    const submitBtn = document.getElementById('submitJobBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    
    if (job) {
        title.textContent = 'Edit Job';
        btnText.textContent = 'Update Job';
        
        // Populate form
        Object.keys(job).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = job[key];
            }
        });
    } else {
        title.textContent = 'Create New Job';
        btnText.textContent = 'Create Job';
        form.reset();
    }
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function hideJobModal() {
    const modal = document.getElementById('jobModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Application Modal Functions
function showApplicationModal(application) {
    const modal = document.getElementById('applicationModal');
    const details = document.getElementById('applicationDetails');
    
    details.innerHTML = `
        <div class="application-detail">
            <h3>${application.fullName}</h3>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Applied for:</strong> ${application.jobTitle}</p>
            <p><strong>Applied on:</strong> ${formatDate(application.createdAt)}</p>
            ${application.coverLetter ? `<div><strong>Cover Letter:</strong><br><p>${application.coverLetter}</p></div>` : ''}
            ${application.resumeUrl ? `<div><strong>Resume:</strong><br><a href="${application.resumeUrl}" target="_blank" class="btn-primary">View Resume</a></div>` : ''}
        </div>
    `;
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function hideApplicationModal() {
    const modal = document.getElementById('applicationModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Job Management Functions
async function deleteJob(job) {
    if (!confirm(`Are you sure you want to delete "${job.title}"?`)) {
        return;
    }
    
    try {
        await CompanyAPI.deleteJob(job.id);
        showNotification('Job deleted successfully', 'success');
        loadJobs();
        loadApplications(); // Refresh applications as they may be affected
    } catch (error) {
        showNotification('Failed to delete job', 'error');
    }
}

async function updateApplicationStatus(applicationId, status) {
    try {
        await CompanyAPI.updateApplicationStatus(applicationId, status);
        showNotification('Application status updated', 'success');
        
        // Update local state
        const application = currentApplications.find(app => app.id === applicationId);
        if (application) {
            application.status = status;
        }
        
        // Refresh display
        if (currentSection === 'applications') {
            loadApplications();
        } else if (currentSection === 'overview') {
            loadRecentApplications();
        }
        
        updateStats();
    } catch (error) {
        showNotification('Failed to update application status', 'error');
    }
}

// Filter Functions
function filterApplicationsByJob(jobId) {
    const filteredApps = jobId ? 
        currentApplications.filter(app => app.jobId === jobId) : 
        currentApplications;
    
    const applicationsContainer = document.getElementById('applicationsContainer');
    applicationsContainer.innerHTML = filteredApps.map(app => createApplicationCardTemplate(app)).join('');
    addApplicationEventListeners();
}

// Initialize Dashboard
async function initializeDashboard() {
    // Load initial data
    await loadCompanyInfo();
    await loadCategories();
    
    // Load jobs and applications
    await loadJobs();
    await loadApplications();
    
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchToSection(section);
        });
    });
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Job creation buttons
    document.getElementById('createJobBtn').addEventListener('click', showJobModal);
    document.getElementById('createJobBtn2').addEventListener('click', showJobModal);
    
    // Modal close buttons
    document.getElementById('closeJobModal').addEventListener('click', hideJobModal);
    document.getElementById('closeApplicationModal').addEventListener('click', hideApplicationModal);
    document.getElementById('cancelJobForm').addEventListener('click', hideJobModal);
    
    // Job form submission
    document.getElementById('jobForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const jobData = Object.fromEntries(formData.entries());
        const jobId = document.getElementById('jobId').value;
        
        const submitBtn = document.getElementById('submitJobBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        
        try {
            const userId = localStorage.getItem('userId');
            const companyId = userId;
            
            if (jobId) {
                // Update existing job
                await CompanyAPI.updateJob(jobId, jobData);
                showNotification('Job updated successfully', 'success');
            } else {
                // Create new job
                await CompanyAPI.createJob(companyId, jobData);
                showNotification('Job created successfully', 'success');
            }
            
            hideJobModal();
            loadJobs();
        } catch (error) {
            showNotification('Failed to save job', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
    
    // Company profile form
    document.getElementById('companyProfileForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const companyData = Object.fromEntries(formData.entries());
        
        try {
            const userId = localStorage.getItem('userId');
            const companyId = userId;
            
            await CompanyAPI.updateCompany(companyId, companyData);
            showNotification('Company profile updated successfully', 'success');
            loadCompanyInfo();
        } catch (error) {
            showNotification('Failed to update company profile', 'error');
        }
    });
    
    // Filters
    document.getElementById('jobFilter').addEventListener('change', function() {
        const jobId = this.value;
        filterApplicationsByJob(jobId);
    });
    
    document.getElementById('statusFilter').addEventListener('change', function() {
        const status = this.value;
        const filteredApps = status ? 
            currentApplications.filter(app => app.status === status) : 
            currentApplications;
        
        const applicationsContainer = document.getElementById('applicationsContainer');
        applicationsContainer.innerHTML = filteredApps.map(app => createApplicationCardTemplate(app)).join('');
        addApplicationEventListeners();
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                setTimeout(() => {
                    this.style.display = 'none';
                }, 300);
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (!userId) {
        showNotification('Please log in to access the dashboard', 'error');
        // Redirect to login page or show login modal
        return;
    }
    
    initializeDashboard();
});

// Add notification styles
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 10001;
    max-width: 350px;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left: 4px solid #10b981;
}

.notification.success i {
    color: #10b981;
}

.notification.info {
    border-left: 4px solid #3b82f6;
}

.notification.info i {
    color: #3b82f6;
}

.notification.error {
    border-left: 4px solid #ef4444;
}

.notification.error i {
    color: #ef4444;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 1rem;
}

.modal.show {
    opacity: 1;
}

.modal-content {
    background: white;
    border-radius: 1rem;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.modal.show .modal-content {
    transform: scale(1);
}

.modal-content.large {
    max-width: 800px;
}

.modal-header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    position: relative;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.75rem;
    color: #111827;
}

.modal-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #f3f4f6;
    color: #111827;
}

.modal-body {
    padding: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #1a8917;
    box-shadow: 0 0 0 3px rgba(26, 137, 23, 0.1);
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
    .notification {
        right: 10px;
        left: 10px;
        max-width: none;
    }
    
    .modal-header {
        padding: 1.5rem 1.5rem 1rem;
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .form-actions {
        flex-direction: column;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);
