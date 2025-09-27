// ===================================
// JOBS PAGE JAVASCRIPT
// ===================================

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8787/api/v1";
const JOBS_PER_PAGE = 10;

// Supabase Configuration
const SUPABASE_URL = "https://ocitqmzzwgoultmonqbu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jaXRxbXp6d2dvdWx0bW9ucWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTYxNjcsImV4cCI6MjA3MjAzMjE2N30.zUNloGL54q-QOQkOjkBHAxhsjsJC91Lmf07_VuBaTJo";
const SUPABASE_BUCKET = "resumes"; // Replace with your bucket name

// Global state
let currentPage = 0;
let currentSearch = "";
let currentCategoryId = "";
let currentCompanyId = "";
let isLoading = false;
let allCategories = [];

// Supabase Client
class SupabaseClient {
  static async uploadFile(file, fileName) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("bucket", SUPABASE_BUCKET);

      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${fileName}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error uploading file:", errorData);
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${fileName}`;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
}

// API Service Functions
class JobsAPI {
  static async fetchJobs(
    page = 0,
    limit = JOBS_PER_PAGE,
    search = "",
    companyId = "",
    categoryId = ""
  ) {
    try {
      const params = new URLSearchParams({
        page,
        limit,
      });

      if (search) params.append("search", search);
      if (companyId) params.append("companyId", companyId);
      if (categoryId) params.append("categoryId", categoryId);

      const response = await fetch(`${API_BASE_URL}/jobs?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to fetch jobs");
      }

      return data.data || [];
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
  }

  static async fetchCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      if (!data.success) {
        throw new Error("Failed to fetch categories");
      }

      return data.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      // showNotification("Failed to load categories. Please try again.", "error");
      return [];
    }
  }

  static async fetchEmployees(page = 0, limit = 10, search = "") {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);

      const response = await fetch(`${API_BASE_URL}/employees?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to fetch employees");
      }

      return data.data || [];
    } catch (error) {
      console.error("Error fetching employees:", error);
      showNotification("Failed to load employees. Please try again.", "error");
      return [];
    }
  }

  static async createEmployee(employeeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create employee profile");
      }

      return data;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  }

  static async createCompany(companyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create company");
      }

      return data;
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    }
  }

  static async submitJobApplication(applicationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/job-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      return data;
    } catch (error) {
      console.error("Error submitting application:", error);
      throw error;
    }
  }
}

// Job Card Template
function createJobCard(job) {
  const formattedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const timeAgo = getTimeAgo(job.createdAt);

  return `
        <div class="job-card" data-type="all" data-job-id="${
          job.id
        }" data-company-id="${job.companyId || ""}">
            <div class="job-header">
                <div class="company-logo">
                    <img src="https://via.placeholder.com/60x60?text=${job.title.charAt(
                      0
                    )}" alt="Company Logo">
                </div>
                <div class="job-meta">
                    ${
                      job.type === "remote"
                        ? '<span class="remote-badge">Remote</span>'
                        : ""
                    }
                    ${
                      isNewJob(job.createdAt)
                        ? '<span class="new-badge">New</span>'
                        : ""
                    }
                    <button class="save-job-btn" data-job-id="${job.id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>

            <div class="job-body">
                <h3 class="job-title" data-job-id="${job.id}">${job.title}</h3>
                <div class="company-info">
                    <span class="company-name">Company</span>
                    <span class="verified-badge">
                        <i class="fas fa-check-circle"></i> Verified
                    </span>
                </div>

                <div class="job-details">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${job.location || "Location not specified"}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-briefcase"></i>
                        <span>${
                          job.experience
                            ? `${job.experience}+ years experience`
                            : "Experience not specified"
                        }</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>${job.salary || "Salary not specified"}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${job.type || "Type not specified"}</span>
                    </div>
                </div>

                <div class="job-description">
                    <p>${job.description || "No description available"}</p>
                </div>

                <div class="job-skills">
                ${
                  job.jobSkill && job.jobSkill.length > 0
                    ? job.jobSkill
                        .slice(0, 5)
                        .map(
                          (js) =>
                            `<span class="skill-tag">${
                              js.skill?.name || "Skill"
                            }</span>`
                        )
                        .join("")
                    : '<span class="skill-tag">Skills not specified</span>'
                }
                </div>

                <div class="job-footer">
                    <span class="posted-time">
                        <i class="fas fa-calendar-alt"></i> Posted ${timeAgo}
                    </span>
                    <div class="job-actions">
                        <button class="quick-apply-btn" data-job-id="${
                          job.id
                        }">Quick Apply</button>
                        <button class="view-job-btn" data-job-id="${
                          job.id
                        }">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Category Card Template
function createCategoryCard(category, jobCount = 0) {
  return `
        <div class="category-card" data-category-id="${category.id}">
            <div class="category-icon">
                <i class="fas fa-${getCategoryIcon(category.name)}"></i>
            </div>
            <div class="category-content">
                <h3 class="category-name">${category.name}</h3>
                ${
                  category.name.toLowerCase().includes("tech")
                    ? '<div class="trending-badge"><i class="fas fa-fire"></i> Hot</div>'
                    : ""
                }
            </div>
        </div>
    `;
}

// Employee Card Template
function createEmployeeCard(employee) {
  const timeAgo = getTimeAgo(employee.createdAt);

  return `
        <div class="talent-card" data-category="all" data-employee-id="${
          employee.id
        }">
            <div class="talent-header">
                <div class="talent-avatar">
                    <img src="https://randomuser.me/api/portraits/${
                      employee.gender || "men"
                    }/${Math.floor(Math.random() * 100)}.jpg" alt="${
    employee.fullName
  }">
                    <span class="availability-dot ${
                      employee.availability === "full-time" ? "available" : ""
                    }" title="${
    employee.availability === "full-time"
      ? "Available for hire"
      : "Currently employed"
  }"></span>
                </div>
                <div class="talent-info">
                    <h3 class="talent-name">${employee.fullName}</h3>
                    <p class="talent-headline">${employee.profession}</p>
                    <div class="talent-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${
                          employee.location || "Location not specified"
                        }</span>
                        <span><i class="fas fa-briefcase"></i> ${
                          employee.experience || 0
                        }+ Years</span>
                    </div>
                </div>
                <button class="talent-action-btn" data-employee-id="${
                  employee.id
                }">
                    <i class="fas fa-envelope"></i>
                </button>
            </div>
            <div class="talent-body">
                <p class="talent-summary">${
                  employee.bio || "No bio available"
                }</p>
                <div class="talent-skills">
                    ${
                      employee.skills && employee.skills.length > 0
                        ? employee.skills
                            .slice(0, 5)
                            .map(
                              (skill) =>
                                `<span class="skill-tag">${
                                  skill.skill?.name || "Skill"
                                }</span>`
                            )
                            .join("")
                        : '<span class="skill-tag">Skills not specified</span>'
                    }
                </div>
                <div class="talent-achievements">
                    <div class="achievement">
                        <i class="fas fa-dollar-sign"></i>
                        <span>$${employee.hourlyRate || 0}/hour</span>
                    </div>
                    <div class="achievement">
                        <i class="fas fa-clock"></i>
                        <span>${employee.availability || "Not specified"}</span>
                    </div>
                </div>
            </div>
            <div class="talent-footer">
                <button class="view-profile-btn" data-employee-id="${
                  employee.id
                }">View Full Profile</button>
                <button class="save-talent-btn" data-employee-id="${
                  employee.id
                }">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
        </div>
    `;
}

// Utility Functions
function isNewJob(createdAt) {
  const jobDate = new Date(createdAt);
  const now = new Date();
  const diffInHours = (now - jobDate) / (1000 * 60 * 60);
  return diffInHours <= 24; // Consider jobs posted within 24 hours as "new"
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

function getCategoryIcon(categoryName) {
  const iconMap = {
    technology: "laptop-code",
    tech: "laptop-code",
    finance: "chart-line",
    banking: "chart-line",
    sales: "handshake",
    marketing: "handshake",
    healthcare: "heartbeat",
    health: "heartbeat",
    education: "graduation-cap",
    training: "graduation-cap",
    engineering: "hard-hat",
    hospitality: "concierge-bell",
    tourism: "concierge-bell",
  };

  const name = categoryName.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return icon;
    }
  }
  return "briefcase"; // Default icon
}

// Notification system (made global for reuse across handlers)
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
            <i class="fas fa-${
              type === "success"
                ? "check-circle"
                : type === "error"
                ? "exclamation-circle"
                : "info-circle"
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

// Saved jobs count updater (global so toggleSaveJob can call it)
function updateSavedJobsCount() {
  const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
  const savedCount = document.querySelector(".saved-count");
  if (savedCount) {
    savedCount.textContent = savedJobs.length;
  }
}

// Quick Apply modal (global so dynamically added job cards can use it)
function showApplicationModal(
  jobTitle,
  company,
  jobId = null,
  companyId = null
) {
  const modalHTML = `
            <div class="application-modal" id="applicationModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Quick Apply - ${jobTitle}</h3>
                        <p class="company-info">${company}</p>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="quickApplyForm">
                            <div class="form-group">
                                <label>Full Name *</label>
                                <input type="text" name="fullName" required placeholder="John Doe">
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" name="email" required placeholder="john@example.com">
                            </div>
                            <div class="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" name="phone" required placeholder="+237 6XX XXX XXX">
                            </div>
                            <div class="form-group">
                                <label>Resume/CV *</label>
                                <div class="file-upload">
                                    <input type="file" id="resumeFile" name="resume" accept=".pdf,.doc,.docx" required>
                                    <label for="resumeFile">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <span>Choose file or drag here</span>
                                    </label>
                                </div>
                                <div class="file-upload-progress" style="display: none;">
                                    <div class="progress-bar">
                                        <div class="progress-fill"></div>
                                    </div>
                                    <span class="progress-text">Uploading...</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Cover Letter (Optional)</label>
                                <textarea name="coverLetter" rows="4" placeholder="Tell us why you're a great fit for this role..."></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn-cancel">Cancel</button>
                                <button type="submit" class="btn-submit" id="submitBtn">
                                    <span class="btn-text">Submit Application</span>
                                    <span class="btn-loading" style="display: none;">
                                        <i class="fas fa-spinner fa-spin"></i> Submitting...
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("applicationModal");
  const closeBtn = modal.querySelector(".modal-close");
  const cancelBtn = modal.querySelector(".btn-cancel");
  const form = modal.querySelector("#quickApplyForm");
  const fileInput = modal.querySelector("#resumeFile");
  const fileLabel = modal.querySelector(".file-upload label span");
  const progressContainer = modal.querySelector(".file-upload-progress");
  const progressFill = modal.querySelector(".progress-fill");
  const progressText = modal.querySelector(".progress-text");
  const submitBtn = modal.querySelector("#submitBtn");
  const btnText = modal.querySelector(".btn-text");
  const btnLoading = modal.querySelector(".btn-loading");

  // Show modal
  setTimeout(() => modal.classList.add("show"), 10);

  // File upload handling
  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      const file = this.files[0];
      fileLabel.textContent = file.name;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("File size must be less than 5MB", "error");
        this.value = "";
        fileLabel.textContent = "Choose file or drag here";
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        showNotification("Please upload a PDF or Word document", "error");
        this.value = "";
        fileLabel.textContent = "Choose file or drag here";
        return;
      }
    }
  });

  // Close modal function
  function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => modal.remove(), 300);
  }

  // Event listeners
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  // Form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const coverLetter = formData.get("coverLetter");
    const resumeFile = formData.get("resume");

    if (!resumeFile || resumeFile.size === 0) {
      showNotification("Please select a resume file", "error");
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = "none";
    btnLoading.style.display = "inline-flex";
    progressContainer.style.display = "block";

    try {
      // Generate unique filename
      const fileExtension = resumeFile.name.split(".").pop();
      const fileName = `resume_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}.${fileExtension}`;

      // Upload file to Supabase
      progressText.textContent = "Uploading resume...";
      const resumeUrl = await SupabaseClient.uploadFile(resumeFile, fileName);

      // Prepare application data
      const applicationData = {
        jobId: jobId || "default-job-id", // You might want to get this from the job card
        companyId: companyId || "default-company-id", // You might want to get this from the job card
        fullName: fullName,
        email: email,
        phone: phone,
        coverLetter: coverLetter || "",
        resumeUrl: resumeUrl,
      };

      // Submit application
      progressText.textContent = "Submitting application...";
      await JobsAPI.submitJobApplication(applicationData);

      showNotification(
        `Application submitted successfully for ${jobTitle}!`,
        "success"
      );
      closeModal();
    } catch (error) {
      console.error("Error submitting application:", error);
      showNotification(
        error.message || "Failed to submit application. Please try again.",
        "error"
      );

      // Reset button state
      submitBtn.disabled = false;
      btnText.style.display = "inline";
      btnLoading.style.display = "none";
      progressContainer.style.display = "none";
    }
  });
}

// Initialize the page
async function initializePage() {
  try {
    // Load categories first
    await loadCategories();
    await loadJobs();
    // showNotification("Jobs loaded successfully!", "success");
  } catch (error) {
    console.error("Error initializing page:", error);
    // showNotification("Failed to initialize page. Please refresh.", "error");
  }
}

// Load and display employees for talent marketplace
async function loadEmployees(append = false) {
  if (isLoading) return;

  isLoading = true;
  const talentGrid = document.querySelector(".talent-grid");

  if (!talentGrid) return;

  if (!append) {
    talentGrid.innerHTML =
      '<div class="loading-spinner">Loading professionals...</div>';
  }

  try {
    const employees = await JobsAPI.fetchEmployees(0, 10, "");

    if (!append) {
      talentGrid.innerHTML = "";
    } else {
      // Remove loading spinner if it exists
      const loadingSpinner = talentGrid.querySelector(".loading-spinner");
      if (loadingSpinner) loadingSpinner.remove();
    }

    if (employees.length === 0 && !append) {
      talentGrid.innerHTML = `
        <div class="no-jobs-found">
          <i class="fas fa-users"></i>
          <h3>No professionals found</h3>
          <p>Check back later for new talent or create your own profile.</p>
        </div>
      `;
    } else {
      employees.forEach((employee) => {
        talentGrid.insertAdjacentHTML(
          "beforeend",
          createEmployeeCard(employee)
        );
      });

      // Add event listeners to new employee cards
      addEmployeeEventListeners();
    }
  } catch (error) {
    console.error("Error loading employees:", error);
    if (!append) {
      talentGrid.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Failed to load professionals</h3>
          <p>Please try again later or refresh the page.</p>
          <button onclick="loadEmployees()" class="retry-btn">Retry</button>
        </div>
      `;
    }
  } finally {
    isLoading = false;
  }
}

// Load and display categories
async function loadCategories() {
  const categoriesGrid = document.querySelector(".categories-grid");
  if (!categoriesGrid) return;

  // Keep the "All Categories" card and replace others
  const allCategoriesCard = categoriesGrid.querySelector(
    '.category-card[data-category="more"]'
  );
  categoriesGrid.innerHTML = "";

  try {
    // Dynamically fetch categories
    allCategories = await JobsAPI.fetchCategories();

    // Add dynamic categories
    allCategories.slice(0, 7).forEach((category) => {
      const categoryCard = createCategoryCard(category);
      categoriesGrid.insertAdjacentHTML("beforeend", categoryCard);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    categoriesGrid.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Failed to load categories</h3>
        <p>Please try again later or refresh the page.</p>
      </div>
    `;
    return;
  }

  // Add back the "All Categories" card
  if (allCategoriesCard) {
    categoriesGrid.appendChild(allCategoriesCard);
  } else {
    categoriesGrid.insertAdjacentHTML(
      "beforeend",
      `
            <div class="category-card" data-category="more">
                <div class="category-icon">
                    <i class="fas fa-th"></i>
                </div>
                <div class="category-content">
                    <h3 class="category-name">All Categories</h3>
                    <p class="category-jobs">View all</p>
                </div>
            </div>
        `
    );
  }

  // Add event listeners to new category cards
  addCategoryEventListeners();
}
// Load and display jobs
async function loadJobs(append = false) {
  if (isLoading) return;

  isLoading = true;
  const jobsList = document.querySelector(".jobs-list");

  if (!append) {
    jobsList.innerHTML = '<div class="loading-spinner">Loading jobs...</div>';
  }

  try {
    const jobs = await JobsAPI.fetchJobs(
      currentPage,
      JOBS_PER_PAGE,
      currentSearch,
      currentCompanyId,
      currentCategoryId
    );

    if (!append) {
      jobsList.innerHTML = "";
    } else {
      // Remove loading spinner if it exists
      const loadingSpinner = jobsList.querySelector(".loading-spinner");
      if (loadingSpinner) loadingSpinner.remove();
    }

    if (jobs.length === 0 && !append) {
      jobsList.innerHTML = `
                <div class="no-jobs-found">
                    <i class="fas fa-briefcase"></i>
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search criteria or check back later for new opportunities.</p>
                </div>
            `;
    } else {
      jobs.forEach((job) => {
        jobsList.insertAdjacentHTML("beforeend", createJobCard(job));
      });

      // Add event listeners to new job cards
      addJobEventListeners();
    }

    // Update stats
    updateJobStats(jobs.length, append);
  } catch (error) {
    console.error("Error loading jobs:", error);
    if (!append) {
      jobsList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Failed to load jobs</h3>
                    <p>Please try again later or refresh the page.</p>
                    <button onclick="loadJobs()" class="retry-btn">Retry</button>
                </div>
            `;
    }
  } finally {
    isLoading = false;
  }
}

// Add event listeners to category cards
function addCategoryEventListeners() {
  const categoryCards = document.querySelectorAll(
    ".category-card[data-category-id]"
  );

  categoryCards.forEach((card) => {
    card.addEventListener("click", function () {
      const categoryId = this.getAttribute("data-category-id");
      const categoryName = this.querySelector(".category-name").textContent;

      currentCategoryId = categoryId;
      currentPage = 0;

      showNotification(`Showing ${categoryName} jobs...`);
      loadJobs();

      // Scroll to jobs section
      document.querySelector(".featured-jobs").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

// Add event listeners to employee cards
function addEmployeeEventListeners() {
  // Save employee buttons
  const saveEmployeeBtns = document.querySelectorAll(
    ".save-talent-btn[data-employee-id]:not(.listener-added)"
  );
  saveEmployeeBtns.forEach((btn) => {
    btn.classList.add("listener-added");
    btn.addEventListener("click", function () {
      const employeeId = this.getAttribute("data-employee-id");
      toggleSaveEmployee(employeeId, this);
    });
  });

  // Contact employee buttons
  const contactEmployeeBtns = document.querySelectorAll(
    ".talent-action-btn[data-employee-id]:not(.listener-added)"
  );
  contactEmployeeBtns.forEach((btn) => {
    btn.classList.add("listener-added");
    btn.addEventListener("click", function () {
      const employeeId = this.getAttribute("data-employee-id");
      const employeeCard = this.closest(".talent-card");
      const employeeName =
        employeeCard.querySelector(".talent-name").textContent;
      showContactModal(employeeName);
    });
  });

  // View profile buttons
  const viewProfileBtns = document.querySelectorAll(
    ".view-profile-btn[data-employee-id]:not(.listener-added)"
  );
  viewProfileBtns.forEach((btn) => {
    btn.classList.add("listener-added");
    btn.addEventListener("click", function () {
      const employeeId = this.getAttribute("data-employee-id");
      const employeeCard = this.closest(".talent-card");
      const employeeName =
        employeeCard.querySelector(".talent-name").textContent;
      showNotification(`Opening ${employeeName}'s full profile...`, "info");
    });
  });
}

// Toggle save employee
function toggleSaveEmployee(employeeId, button) {
  let savedEmployees = JSON.parse(localStorage.getItem("savedEmployees")) || [];

  if (button.classList.contains("saved")) {
    // Remove from saved
    button.classList.remove("saved");
    button.innerHTML = '<i class="far fa-bookmark"></i>';
    savedEmployees = savedEmployees.filter((id) => id !== employeeId);
    showNotification("Profile removed from saved list");
  } else {
    // Add to saved
    button.classList.add("saved");
    button.innerHTML = '<i class="fas fa-bookmark"></i>';
    savedEmployees.push(employeeId);
    showNotification("Profile saved successfully!", "success");
  }

  localStorage.setItem("savedEmployees", JSON.stringify(savedEmployees));
}

// Add event listeners to job cards
function addJobEventListeners() {
  // Save job buttons
  const saveJobBtns = document.querySelectorAll(
    ".save-job-btn[data-job-id]:not(.listener-added)"
  );
  saveJobBtns.forEach((btn) => {
    btn.classList.add("listener-added");
    btn.addEventListener("click", function () {
      const jobId = this.getAttribute("data-job-id");
      toggleSaveJob(jobId, this);
    });
  });

  // Quick apply buttons
  const quickApplyBtns = document.querySelectorAll(
    ".quick-apply-btn[data-job-id]:not(.listener-added)"
  );
  quickApplyBtns.forEach((btn) => {
    btn.classList.add("listener-added");
    btn.addEventListener("click", function () {
      const jobId = this.getAttribute("data-job-id");
      const jobCard = this.closest(".job-card");
      const jobTitle = jobCard.querySelector(".job-title").textContent;
      const company = jobCard.querySelector(".company-name").textContent;
      const companyId = jobCard.getAttribute("data-company-id") || null;

      showApplicationModal(jobTitle, company, jobId, companyId);
    });
  });

  // View job buttons and job titles
  const viewJobBtns = document.querySelectorAll(
    ".view-job-btn[data-job-id]:not(.listener-added), .job-title[data-job-id]:not(.listener-added)"
  );
  viewJobBtns.forEach((btn) => {
    btn.classList.add("listener-added");
    btn.addEventListener("click", function () {
      const jobId = this.getAttribute("data-job-id");
      const jobCard = this.closest(".job-card");
      const jobTitle = jobCard.querySelector(".job-title").textContent;
      const company = jobCard.querySelector(".company-name").textContent;

      showNotification(`Opening details for ${jobTitle} at ${company}...`);
      // Here you could redirect to a job details page or show a modal
    });
  });
}

// Toggle save job
function toggleSaveJob(jobId, button) {
  let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

  if (button.classList.contains("saved")) {
    // Remove from saved
    button.classList.remove("saved");
    button.innerHTML = '<i class="far fa-heart"></i>';
    savedJobs = savedJobs.filter((id) => id !== jobId);
    showNotification("Job removed from saved list");
  } else {
    // Add to saved
    button.classList.add("saved");
    button.innerHTML = '<i class="fas fa-heart"></i>';
    savedJobs.push(jobId);
    showNotification("Job saved successfully!", "success");
  }

  localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  updateSavedJobsCount();
}

// Update job statistics
function updateJobStats(newJobsCount, append) {
  const statNumber = document.querySelector(".stat-item .stat-number");
  if (statNumber && !append) {
    // This is a simplified update - in a real app, you'd get total count from API
    statNumber.textContent = newJobsCount > 0 ? `${newJobsCount * 50}+` : "0";
  }
}

// Search functionality
async function handleSearch(searchTerm) {
  currentSearch = searchTerm;
  currentPage = 0;

  if (searchTerm) {
    showNotification(`Searching for "${searchTerm}"...`);
  }

  await loadJobs();

  // Scroll to jobs section
  document.querySelector(".featured-jobs").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Load more jobs (pagination)
async function loadMoreJobs() {
  currentPage++;
  await loadJobs(true);
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the page with API data
  initializePage();

  // ===================================
  // VIEW TOGGLE FUNCTIONALITY
  // ===================================
  const toggleJobsBtn = document.getElementById("toggle-jobs");
  const toggleTalentBtn = document.getElementById("toggle-talent");
  const jobsView = document.getElementById("jobs-view");
  const talentView = document.getElementById("talent-view");

  if (toggleJobsBtn && toggleTalentBtn && jobsView && talentView) {
    toggleJobsBtn.addEventListener("click", () => {
      toggleTalentBtn.classList.remove("active");
      toggleJobsBtn.classList.add("active");
      talentView.style.display = "none";
      jobsView.style.display = "block";
      showNotification("Switched to Jobs view");

      // Update floating button text
      updateFloatingButtonText("Post a Job");
    });

    toggleTalentBtn.addEventListener("click", () => {
      toggleJobsBtn.classList.remove("active");
      toggleTalentBtn.classList.add("active");
      jobsView.style.display = "none";
      talentView.style.display = "block";
      showNotification("Switched to Talent Marketplace");

      // Update floating button text
      updateFloatingButtonText("Create Profile");

      // Load employees when switching to talent view
      loadEmployees();
    });
  }

  // Function to update floating button text
  function updateFloatingButtonText(text) {
    const floatingBtn = document.getElementById("floatingActionBtn");
    if (floatingBtn) {
      const btnText = floatingBtn.querySelector(".btn-text");
      if (btnText) {
        btnText.textContent = text;
      }
    }
  }

  // ===================================
  // HERO SEARCH FUNCTIONALITY
  // ===================================
  const heroJobSearch = document.getElementById("heroJobSearch");
  const searchButton = document.querySelector(".search-button");
  const heroOptionLinks = document.querySelectorAll(".hero-option-link");

  // Handle hero search
  function handleHeroSearch() {
    const searchTerm = heroJobSearch.value.trim();
    handleSearch(searchTerm);
  }

  // Search event listeners
  if (searchButton) {
    searchButton.addEventListener("click", handleHeroSearch);
  }

  if (heroJobSearch) {
    heroJobSearch.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        handleHeroSearch();
      }
    });
  }

  // Hero option links
  heroOptionLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const optionText = this.querySelector(".option-text").textContent;

      switch (optionText) {
        case "Find your next opportunity":
          showNotification("Showing all available jobs...");
          document
            .querySelector(".featured-jobs")
            .scrollIntoView({ behavior: "smooth" });
          break;
        case "Connect with local employers":
          showNotification("Viewing top companies...");
          document
            .querySelector(".top-companies")
            .scrollIntoView({ behavior: "smooth" });
          break;
        case "Post a job or find talent":
          showPostJobModal();
          break;
        case "Build your professional profile":
          showNotification("Opening profile builder...");
          break;
      }
    });
  });

  // ===================================
  // LOCATION DROPDOWN
  // ===================================
  const deliverLocation = document.getElementById("deliverLocation");
  const locationDropdown = document.querySelector(".location-dropdown");
  const locationItems = locationDropdown.querySelectorAll("li");

  locationItems.forEach((item) => {
    item.addEventListener("click", function () {
      const city = this.textContent;
      deliverLocation.textContent = city;
      localStorage.setItem("jobLocation", city);
      showNotification(`Showing jobs in ${city}`);
    });
  });

  // Load saved location
  const savedLocation = localStorage.getItem("jobLocation");
  if (savedLocation) {
    deliverLocation.textContent = savedLocation;
  }

  // ===================================
  // CATEGORY CARDS (Legacy static cards)
  // ===================================
  const staticCategoryCards = document.querySelectorAll(
    ".category-card[data-category]:not([data-category-id])"
  );

  staticCategoryCards.forEach((card) => {
    card.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      if (category === "more") {
        // Show all categories or navigate to categories page
        showNotification("Showing all categories...");
        return;
      }

      // For static categories, reset filters and show all jobs
      currentCategoryId = "";
      currentPage = 0;
      handleSearch("");
    });
  });

  // ===================================
  // JOB FILTER TABS
  // ===================================
  const filterTabs = document.querySelectorAll(".filter-tab");
  const jobCards = document.querySelectorAll(".job-card");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Update active tab
      filterTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      // Reset pagination and apply filter
      currentPage = 0;

      if (filter === "all") {
        currentCategoryId = "";
        currentSearch = "";
      } else {
        // For now, we'll use search to filter by type
        // In a more advanced implementation, you might have separate API parameters
        currentSearch = filter === "remote" ? "remote" : "";
      }

      loadJobs();
    });
  });

  // Initialize saved jobs count
  updateSavedJobsCount();

  // ===================================
  // FLOATING ACTION BUTTON
  // ===================================
  const floatingActionBtn = document.getElementById("floatingActionBtn");
  const postJobBtn = document.querySelector(".post-job-btn");

  if (floatingActionBtn) {
    floatingActionBtn.addEventListener("click", function () {
      // Check which view is currently active
      const jobsView = document.getElementById("jobs-view");
      const talentView = document.getElementById("talent-view");

      if (talentView && talentView.style.display !== "none") {
        // In talent view - create employee profile
        showEmployeeCreationModal();
      } else {
        // In jobs view - show post job modal
        showPostJobModal();
      }
    });
  }

  if (postJobBtn) {
    postJobBtn.addEventListener("click", function () {
      showPostJobModal();
    });
  }

  function showPostJobModal() {
    showNotification("Opening job posting form...", "info");
    // open the job posting modal or redirect to posting page
  }

  // ===================================
  // COMPANIES SLIDER
  // ===================================
  const companiesSwiper = new Swiper(".companies-swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
    },
  });

  // ===================================
  // VIEW COMPANY JOBS
  // ===================================
  const viewCompanyBtns = document.querySelectorAll(".view-company-btn");

  viewCompanyBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const companyCard = this.closest(".company-card");
      const companyName =
        companyCard.querySelector(".company-name").textContent;

      showNotification(`Viewing jobs from ${companyName}...`);
      // Filter jobs by company
      jobSearchInput.value = companyName;
      handleJobSearch();
    });
  });

  // ===================================
  // NEWSLETTER SUBSCRIPTION
  // ===================================
  const alertsForm = document.querySelector(".alerts-form");

  if (alertsForm) {
    alertsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;

      showNotification(
        `Subscribed! Job alerts will be sent to ${email}`,
        "success"
      );
      this.reset();

      // Save to localStorage
      localStorage.setItem("jobAlertsEmail", email);
    });
  }

  // Notification system moved to global scope above

  // ===================================
  // SMOOTH SCROLL
  // ===================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ===================================
  // INTERSECTION OBSERVER
  // ===================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  document
    .querySelectorAll(".category-card, .job-card, .resource-card")
    .forEach((el) => {
      observer.observe(el);
    });

  // ===================================
  // HEADER SEARCH FUNCTIONALITY
  // ===================================
  const headerSearchInput = document.querySelector(".search-input");
  const headerSearchBtn = document.querySelector(".search-btn");

  if (headerSearchBtn) {
    headerSearchBtn.addEventListener("click", function () {
      const searchTerm = headerSearchInput
        ? headerSearchInput.value.trim()
        : "";
      handleSearch(searchTerm);
    });
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const searchTerm = this.value.trim();
        handleSearch(searchTerm);
      }
    });
  }

  // ===================================
  // MOBILE NAVIGATION
  // ===================================
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");

  mobileNavItems.forEach((item) => {
    item.addEventListener("click", function () {
      mobileNavItems.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // ===================================
  // EMPLOYER CTA
  // ===================================
  const ctaButton = document.querySelector(".cta-button");

  if (ctaButton) {
    ctaButton.addEventListener("click", function () {
      showNotification("Redirecting to employer dashboard...", "info");
      // Redirect to employer registration/dashboard
    });
  }

  // ===================================
  // RESOURCE LINKS
  // ===================================
  const resourceLinks = document.querySelectorAll(".resource-link");

  resourceLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const resourceTitle =
        this.closest(".resource-card").querySelector("h3").textContent;
      showNotification(`Opening ${resourceTitle}...`, "info");
    });
  });

  // ===================================
  // TALENT MARKETPLACE FUNCTIONALITY
  // ===================================

  // Talent Filter Tabs
  const talentFilterTabs = document.querySelectorAll(
    "#talent-filter-tabs .filter-tab"
  );
  const talentCards = document.querySelectorAll(".talent-card");

  talentFilterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Update active tab
      talentFilterTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");
      filterTalentCards(filter);
    });
  });

  function filterTalentCards(filter) {
    talentCards.forEach((card) => {
      const cardCategories = card.getAttribute("data-category").split(",");

      if (filter === "all" || cardCategories.includes(filter)) {
        card.style.display = "block";
        card.style.animation = "fadeInUp 0.5s ease";
      } else {
        card.style.display = "none";
      }
    });
  }

  // View Profile Buttons
  const viewProfileBtns = document.querySelectorAll(".view-profile-btn");
  viewProfileBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const talentCard = this.closest(".talent-card");
      const talentName = talentCard.querySelector(".talent-name").textContent;
      showNotification(`Opening ${talentName}'s full profile...`, "info");
    });
  });

  // Save Talent Buttons
  const saveTalentBtns = document.querySelectorAll(".save-talent-btn");
  let savedTalents = JSON.parse(localStorage.getItem("savedTalents")) || [];

  saveTalentBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const talentCard = this.closest(".talent-card");
      const talentName = talentCard.querySelector(".talent-name").textContent;
      const talentId = talentName.replace(/\s+/g, "-").toLowerCase();

      if (this.classList.contains("saved")) {
        // Remove from saved
        this.classList.remove("saved");
        this.innerHTML = '<i class="far fa-bookmark"></i>';
        savedTalents = savedTalents.filter((id) => id !== talentId);
        showNotification("Profile removed from saved list");
      } else {
        // Add to saved
        this.classList.add("saved");
        this.innerHTML = '<i class="fas fa-bookmark"></i>';
        savedTalents.push(talentId);
        showNotification("Profile saved successfully!", "success");
      }

      localStorage.setItem("savedTalents", JSON.stringify(savedTalents));
    });
  });

  // Contact Talent Buttons
  const talentActionBtns = document.querySelectorAll(".talent-action-btn");
  talentActionBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const talentCard = this.closest(".talent-card");
      const talentName = talentCard.querySelector(".talent-name").textContent;
      showContactModal(talentName);
    });
  });

  function showContactModal(talentName) {
    const modalHTML = `
            <div class="contact-modal" id="contactModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Contact ${talentName}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="contactTalentForm">
                            <div class="form-group">
                                <label>Your Name *</label>
                                <input type="text" required placeholder="Your full name">
                            </div>
                            <div class="form-group">
                                <label>Company Name *</label>
                                <input type="text" required placeholder="Your company">
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" required placeholder="your@email.com">
                            </div>
                            <div class="form-group">
                                <label>Message *</label>
                                <textarea rows="5" required placeholder="Tell ${talentName} about the opportunity..."></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn-cancel">Cancel</button>
                                <button type="submit" class="btn-submit">Send Message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("contactModal");
    const closeBtn = modal.querySelector(".modal-close");
    const cancelBtn = modal.querySelector(".btn-cancel");
    const form = modal.querySelector("#contactTalentForm");

    // Show modal
    setTimeout(() => modal.classList.add("show"), 10);

    // Close modal function
    function closeModal() {
      modal.classList.remove("show");
      setTimeout(() => modal.remove(), 300);
    }

    // Event listeners
    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    // Form submission
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showNotification(`Message sent to ${talentName}!`, "success");
      closeModal();
    });
  }

  // Create Profile Button
  const createProfileBtn = document.querySelector(".create-profile-btn");
  if (createProfileBtn) {
    createProfileBtn.addEventListener("click", function () {
      showEmployeeCreationModal();
    });
  }

  // Company Dashboard Button (in user account dropdown)
  const companyDashboardBtn = document.querySelector('[data-action="company-dashboard"]');
  if (companyDashboardBtn) {
    companyDashboardBtn.addEventListener("click", function() {
      // Check if user has a company
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showNotification('Please log in first', 'error');
        return;
      }
      
      // For now, redirect to dashboard
      // In a real app, you'd check if company exists first
      window.location.href = 'company-dashboard.html';
    });
  }

  function showEmployeeCreationModal() {
    const modalHTML = `
            <div class="profile-modal" id="employeeModal">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h3>Create Your Professional Profile</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="createEmployeeForm">
                            <div class="form-section">
                                <h4>Basic Information</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Full Name *</label>
                                        <input type="text" name="fullName" required placeholder="John Doe">
                                    </div>
                                    <div class="form-group">
                                        <label>Email *</label>
                                        <input type="email" name="email" required placeholder="john@example.com">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Phone Number *</label>
                                        <input type="tel" name="phone" required placeholder="+237 6XX XXX XXX">
                                    </div>
                                    <div class="form-group">
                                        <label>Profession *</label>
                                        <input type="text" name="profession" required placeholder="e.g. Senior Software Engineer">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Location *</label>
                                        <select name="location" required>
                                            <option value="">Select location</option>
                                            <option>Yaoundé</option>
                                            <option>Douala</option>
                                            <option>Buea</option>
                                            <option>Bafoussam</option>
                                            <option>Bamenda</option>
                                            <option>Remote</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Years of Experience *</label>
                                        <input type="number" name="experience" required placeholder="5" min="0" max="50">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Hourly Rate (USD) *</label>
                                        <input type="number" name="hourlyRate" required placeholder="50" min="1">
                                    </div>
                                    <div class="form-group">
                                        <label>Availability *</label>
                                        <select name="availability" required>
                                            <option value="">Select availability</option>
                                            <option>full-time</option>
                                            <option>part-time</option>
                                            <option>contract</option>
                                            <option>freelance</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Professional Summary</h4>
                                <div class="form-group">
                                    <label>Bio *</label>
                                    <textarea name="bio" rows="4" required placeholder="Briefly describe your professional background, skills, and what you're looking for..."></textarea>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Skills & Expertise</h4>
                                <div class="form-group">
                                    <label>Key Skills *</label>
                                    <input type="text" name="skills" placeholder="e.g. JavaScript, React, Node.js, Python (separate with commas)" required>
                                    <small>Add your top skills separated by commas</small>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn-cancel">Cancel</button>
                                <button type="submit" class="btn-submit" id="submitEmployeeBtn">
                                    <span class="btn-text">Create Profile</span>
                                    <span class="btn-loading" style="display: none;">
                                        <i class="fas fa-spinner fa-spin"></i> Creating...
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("employeeModal");
    const closeBtn = modal.querySelector(".modal-close");
    const cancelBtn = modal.querySelector(".btn-cancel");
    const form = modal.querySelector("#createEmployeeForm");
    const submitBtn = modal.querySelector("#submitEmployeeBtn");
    const btnText = modal.querySelector(".btn-text");
    const btnLoading = modal.querySelector(".btn-loading");

    // Show modal
    setTimeout(() => modal.classList.add("show"), 10);

    // Close modal function
    function closeModal() {
      modal.classList.remove("show");
      setTimeout(() => modal.remove(), 300);
    }

    // Event listeners
    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    // Form submission
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const employeeData = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        profession: formData.get("profession"),
        location: formData.get("location"),
        experience: parseInt(formData.get("experience")),
        hourlyRate: parseInt(formData.get("hourlyRate")),
        availability: formData.get("availability"),
        bio: formData.get("bio"),
        // skills: formData.get('skills').split(',').map(skill => skill.trim()).filter(skill => skill)
      };

      // Show loading state
      submitBtn.disabled = true;
      btnText.style.display = "none";
      btnLoading.style.display = "inline-flex";

      try {
        await JobsAPI.createEmployee(employeeData);
        showNotification(
          "Profile created successfully! You can now be discovered by employers.",
          "success"
        );
        closeModal();

        // Reload employees if we're in talent view
        const talentView = document.getElementById("talent-view");
        if (talentView && talentView.style.display !== "none") {
          loadEmployees();
        }
      } catch (error) {
        console.error("Error creating employee:", error);
        showNotification(
          error.message || "Failed to create profile. Please try again.",
          "error"
        );

        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = "inline";
        btnLoading.style.display = "none";
      }
    });
  }

  // Company Creation Modal (make it global)
  window.showCompanyCreationModal = function() {
    const modalHTML = `
            <div class="profile-modal" id="companyModal">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h3>Create Company Profile</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="createCompanyForm">
                            <div class="form-section">
                                <h4>Basic Information</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Company Name *</label>
                                        <input type="text" name="name" required placeholder="Your Company Name">
                                    </div>
                                    <div class="form-group">
                                        <label>Industry *</label>
                                        <input type="text" name="industry" required placeholder="e.g. Technology, Healthcare, Finance">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Website</label>
                                        <input type="url" name="website" placeholder="https://yourcompany.com">
                                    </div>
                                    <div class="form-group">
                                        <label>Location *</label>
                                        <select name="location" required>
                                            <option value="">Select location</option>
                                            <option>Yaoundé</option>
                                            <option>Douala</option>
                                            <option>Buea</option>
                                            <option>Bafoussam</option>
                                            <option>Bamenda</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Company Size *</label>
                                        <select name="size" required>
                                            <option value="">Select size</option>
                                            <option>1-10 employees</option>
                                            <option>11-50 employees</option>
                                            <option>51-200 employees</option>
                                            <option>201-500 employees</option>
                                            <option>500+ employees</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Founded Year</label>
                                        <input type="number" name="foundedYear" placeholder="2020" min="1800" max="2024">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Company Description</h4>
                                <div class="form-group">
                                    <label>About Your Company *</label>
                                    <textarea name="description" rows="4" required placeholder="Tell us about your company, mission, and what makes you unique..."></textarea>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Company Logo</h4>
                                <div class="form-group">
                                    <label>Upload Logo</label>
                                    <input type="file" name="logo" accept="image/*">
                                    <small>Recommended size: 200x200px or larger</small>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn-cancel">Cancel</button>
                                <button type="submit" class="btn-submit" id="submitCompanyBtn">
                                    <span class="btn-text">Create Company</span>
                                    <span class="btn-loading" style="display: none;">
                                        <i class="fas fa-spinner fa-spin"></i> Creating...
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("companyModal");
    const closeBtn = modal.querySelector(".modal-close");
    const cancelBtn = modal.querySelector(".btn-cancel");
    const form = modal.querySelector("#createCompanyForm");
    const submitBtn = modal.querySelector("#submitCompanyBtn");
    const btnText = modal.querySelector(".btn-text");
    const btnLoading = modal.querySelector(".btn-loading");

    // Show modal
    setTimeout(() => modal.classList.add("show"), 10);

    // Close modal function
    function closeModal() {
      modal.classList.remove("show");
      setTimeout(() => modal.remove(), 300);
    }

    // Event listeners
    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    // Form submission
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const companyData = {
        name: formData.get('name'),
        industry: formData.get('industry'),
        website: formData.get('website'),
        location: formData.get('location'),
        size: formData.get('size'),
        foundedYear: formData.get('foundedYear') ? parseInt(formData.get('foundedYear')) : null,
        description: formData.get('description'),
        userId: localStorage.getItem('userId') // Associate with current user
      };

      // Show loading state
      submitBtn.disabled = true;
      btnText.style.display = "none";
      btnLoading.style.display = "inline-flex";

      try {
        const result = await JobsAPI.createCompany(companyData);
        showNotification("Company created successfully! Redirecting to dashboard...", "success");
        closeModal();
        
        // Redirect to company dashboard
        setTimeout(() => {
          window.location.href = 'company-dashboard.html';
        }, 2000);
      } catch (error) {
        console.error("Error creating company:", error);
        showNotification(error.message || "Failed to create company. Please try again.", "error");
        
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = "inline";
        btnLoading.style.display = "none";
      }
    });
  }

  // Load More Profiles
  const loadMoreBtn = document.querySelector(
    ".talent-marketplace .load-more-btn"
  );
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      showNotification("Loading more profiles...", "info");
    });
  }
});

// ===================================
// ADDITIONAL STYLES FOR MODALS
// ===================================
const additionalStyles = `
<style>
/* Modal Styles */
.application-modal,
.contact-modal,
.profile-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 1rem;
}

.application-modal.show,
.contact-modal.show,
.profile-modal.show {
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

.application-modal.show .modal-content,
.contact-modal.show .modal-content,
.profile-modal.show .modal-content {
    transform: scale(1);
}

.modal-content.large {
    max-width: 800px;
}

.modal-header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    margin: 0 0 0.5rem;
    font-size: 1.75rem;
    color: #111827;
}

.modal-header .company-info {
    color: #6b7280;
    margin: 0;
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
.form-group textarea {
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

.form-group select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
    cursor: pointer;
}

.form-group small {
    display: block;
    margin-top: 0.25rem;
    color: #6b7280;
    font-size: 0.875rem;
}

.form-section {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.form-section h4 {
    font-size: 1.125rem;
    color: #111827;
    margin-bottom: 1rem;
    font-weight: 600;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 400;
}

.checkbox-label input[type="checkbox"] {
    width: auto;
    margin: 0;
    cursor: pointer;
}

.file-upload {
    position: relative;
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
}

.file-upload:hover {
    border-color: #1a8917;
    background: rgba(26, 137, 23, 0.02);
}

.file-upload input[type="file"] {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.file-upload label {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    cursor: pointer;
    color: #6b7280;
}

.file-upload label i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #9ca3af;
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
}

.btn-cancel {
    background: #f3f4f6;
    color: #6b7280;
}

.btn-cancel:hover {
    background: #e5e7eb;
}

.btn-submit {
    background: #1a8917;
    color: white;
}

.btn-submit:hover {
    background: #146812;
}

/* Notifications */
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

/* Animation Classes */
.animate-in {
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* File Upload Progress */
.file-upload-progress {
    margin-top: 0.5rem;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background-color: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #1a8917, #22c55e);
    width: 0%;
    transition: width 0.3s ease;
    animation: progress-pulse 1.5s ease-in-out infinite;
}

@keyframes progress-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.progress-text {
    font-size: 0.875rem;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.progress-text i {
    font-size: 0.75rem;
}

/* Loading Button States */
.btn-loading {
    display: none;
    align-items: center;
    gap: 0.5rem;
}

.btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-submit:disabled:hover {
    background: #1a8917;
}

/* Mobile Responsive */
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
    
    .form-row {
        grid-template-columns: 1fr;
    }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML("beforeend", additionalStyles);
