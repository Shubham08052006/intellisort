// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initFormHandling();
    initDashboard();
    initAnimations();
    initScrollEffects();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(.nav-link[href="#${sectionId}"]);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// Form handling
function initFormHandling() {
    const applicationForm = document.getElementById('applicationForm');
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleFormSubmission);
        
        // Real-time form validation
        const formInputs = applicationForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(form)) {
        showMessage('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showMessage('Application submitted successfully! You will receive a confirmation email shortly.', 'success');
        
        // Reset form
        form.reset();
        
        // Scroll to dashboard section
        setTimeout(() => {
            scrollToSection('dashboard');
        }, 2000);
        
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Clear previous error
    clearFieldError(e);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Skills validation (minimum 3 skills)
    if (fieldName === 'skills' && value) {
        const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
        if (skills.length < 3) {
            showFieldError(field, 'Please enter at least 3 skills');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = message ${type};
    messageDiv.textContent = message;
    
    // Insert message at the top of the form
    const form = document.getElementById('applicationForm');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Dashboard functionality
function initDashboard() {
    const dashboardNavItems = document.querySelectorAll('.dashboard-nav .nav-item');
    
    dashboardNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            dashboardNavItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Handle different dashboard sections
            const target = this.getAttribute('href').substring(1);
            showDashboardSection(target);
        });
    });
}

function showDashboardSection(section) {
    const dashboardContent = document.querySelector('.dashboard-content');
    
    // Remove existing content
    const existingContent = dashboardContent.querySelector('.dashboard-overview, .dashboard-applications, .dashboard-matches, .dashboard-profile');
    if (existingContent) {
        existingContent.remove();
    }
    
    // Create new content based on section
    let newContent;
    
    switch(section) {
        case 'overview':
            newContent = createOverviewContent();
            break;
        case 'applications':
            newContent = createApplicationsContent();
            break;
        case 'matches':
            newContent = createMatchesContent();
            break;
        case 'profile':
            newContent = createProfileContent();
            break;
        default:
            newContent = createOverviewContent();
    }
    
    dashboardContent.appendChild(newContent);
}

function createOverviewContent() {
    const content = document.createElement('div');
    content.className = 'dashboard-overview';
    content.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="stat-info">
                    <h4>Applications</h4>
                    <p class="stat-number">3</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-handshake"></i>
                </div>
                <div class="stat-info">
                    <h4>Matches</h4>
                    <p class="stat-number">5</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h4>Pending</h4>
                    <p class="stat-number">2</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <h4>Accepted</h4>
                    <p class="stat-number">1</p>
                </div>
            </div>
        </div>
        <div class="recent-activity">
            <h3>Recent Activity</h3>
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-handshake"></i>
                    </div>
                    <div class="activity-content">
                        <h4>New Match Found</h4>
                        <p>TechCorp - Software Development Intern</p>
                        <span class="activity-time">2 hours ago</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="activity-content">
                        <h4>Application Accepted</h4>
                        <p>DataSoft - Data Science Intern</p>
                        <span class="activity-time">1 day ago</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="activity-content">
                        <h4>Application Submitted</h4>
                        <p>InnovateTech - AI/ML Intern</p>
                        <span class="activity-time">3 days ago</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    return content;
}

function createApplicationsContent() {
    const content = document.createElement('div');
    content.className = 'dashboard-applications';
    content.innerHTML = `
        <h3>My Applications</h3>
        <div class="applications-list">
            <div class="application-card">
                <div class="application-header">
                    <h4>TechCorp - Software Development Intern</h4>
                    <span class="status status-pending">Pending</span>
                </div>
                <p class="application-details">Applied on: March 15, 2024</p>
                <p class="application-description">Full-stack development internship focusing on React and Node.js</p>
                <div class="application-actions">
                    <button class="btn btn-secondary">View Details</button>
                    <button class="btn btn-primary">Withdraw</button>
                </div>
            </div>
            <div class="application-card">
                <div class="application-header">
                    <h4>DataSoft - Data Science Intern</h4>
                    <span class="status status-accepted">Accepted</span>
                </div>
                <p class="application-details">Applied on: March 10, 2024 | Accepted on: March 18, 2024</p>
                <p class="application-description">Machine learning and data analysis internship</p>
                <div class="application-actions">
                    <button class="btn btn-secondary">View Details</button>
                    <button class="btn btn-primary">Start Internship</button>
                </div>
            </div>
        </div>
    `;
    return content;
}

function createMatchesContent() {
    const content = document.createElement('div');
    content.className = 'dashboard-matches';
    content.innerHTML = `
        <h3>Recommended Matches</h3>
        <div class="matches-grid">
            <div class="match-card">
                <div class="match-header">
                    <h4>InnovateTech - AI/ML Intern</h4>
                    <div class="match-score">95% Match</div>
                </div>
                <p class="match-description">Artificial Intelligence and Machine Learning internship with hands-on experience</p>
                <div class="match-details">
                    <span class="match-detail"><i class="fas fa-map-marker-alt"></i> Bangalore</span>
                    <span class="match-detail"><i class="fas fa-clock"></i> 3 months</span>
                    <span class="match-detail"><i class="fas fa-users"></i> 5 positions</span>
                </div>
                <div class="match-actions">
                    <button class="btn btn-primary">Apply Now</button>
                    <button class="btn btn-secondary">View Details</button>
                </div>
            </div>
            <div class="match-card">
                <div class="match-header">
                    <h4>FinanceCorp - FinTech Intern</h4>
                    <div class="match-score">88% Match</div>
                </div>
                <p class="match-description">Financial technology internship focusing on blockchain and digital payments</p>
                <div class="match-details">
                    <span class="match-detail"><i class="fas fa-map-marker-alt"></i> Mumbai</span>
                    <span class="match-detail"><i class="fas fa-clock"></i> 6 months</span>
                    <span class="match-detail"><i class="fas fa-users"></i> 3 positions</span>
                </div>
                <div class="match-actions">
                    <button class="btn btn-primary">Apply Now</button>
                    <button class="btn btn-secondary">View Details</button>
                </div>
            </div>
        </div>
    `;
    return content;
}

function createProfileContent() {
    const content = document.createElement('div');
    content.className = 'dashboard-profile';
    content.innerHTML = `
        <h3>Edit Profile</h3>
        <form class="profile-form">
            <div class="form-group">
                <label for="profileName">Full Name</label>
                <input type="text" id="profileName" value="John Doe" required>
            </div>
            <div class="form-group">
                <label for="profileEmail">Email Address</label>
                <input type="email" id="profileEmail" value="john.doe@email.com" required>
            </div>
            <div class="form-group">
                <label for="profilePhone">Phone Number</label>
                <input type="tel" id="profilePhone" value="+91 9876543210" required>
            </div>
            <div class="form-group">
                <label for="profileUniversity">University/College</label>
                <input type="text" id="profileUniversity" value="Indian Institute of Technology" required>
            </div>
            <div class="form-group">
                <label for="profileCourse">Course/Stream</label>
                <select id="profileCourse" required>
                    <option value="engineering" selected>Engineering</option>
                    <option value="management">Management</option>
                    <option value="commerce">Commerce</option>
                    <option value="arts">Arts</option>
                    <option value="science">Science</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="profileSkills">Skills</label>
                <textarea id="profileSkills" required>Python, JavaScript, React, Node.js, Data Analysis, Machine Learning</textarea>
            </div>
            <button type="submit" class="btn btn-primary">Update Profile</button>
        </form>
    `;
    return content;
}

// Animation and scroll effects
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.step, .feature-card, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function initScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroImage = document.querySelector('.ai-visualization');
        
        if (hero && heroImage) {
            const rate = scrolled * -0.5;
            heroImage.style.transform = translateY(${rate}px);
        }
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Add click handlers for scroll buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('[onclick*="scrollToSection"]')) {
        e.preventDefault();
        const onclick = e.target.getAttribute('onclick');
        const sectionId = onclick.match(/scrollToSection\('([^']+)'\)/)[1];
        scrollToSection(sectionId);
    }
});

// Simulate real-time updates
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update activity time
        const activityTimes = document.querySelectorAll('.activity-time');
        activityTimes.forEach(timeEl => {
            const currentTime = timeEl.textContent;
            // This is a simple simulation - in real app, you'd update with actual timestamps
        });
        
        // Simulate new matches (in a real app, this would come from WebSocket or API)
        if (Math.random() < 0.1) { // 10% chance every interval
            showNotification('New internship match found!', 'success');
        }
    }, 30000); // Check every 30 seconds
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = notification notification-${type};
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize real-time updates
setTimeout(simulateRealTimeUpdates, 5000);

// Add notification styles dynamically
const notificationStyles = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification-content i {
        color: #10b981;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #6b7280;
        padding: 0.25rem;
    }
    
    .notification-close:hover {
        color: #374151;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Add additional styles for dashboard sections
const dashboardStyles = `
    .application-card, .match-card {
        background: white;
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }
    
    .application-card:hover, .match-card:hover {
        transform: translateY(-2px);
    }
    
    .application-header, .match-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .status-pending {
        background: #fef3c7;
        color: #92400e;
    }
    
    .status-accepted {
        background: #d1fae5;
        color: #065f46;
    }
    
    .status-rejected {
        background: #fee2e2;
        color: #991b1b;
    }
    
    .match-score {
        background: linear-gradient(45deg, #2563eb, #7c3aed);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    .application-details, .match-description {
        color: #6b7280;
        margin-bottom: 1rem;
    }
    
    .match-details {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }
    
    .match-detail {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: #6b7280;
        font-size: 0.875rem;
    }
    
    .match-detail i {
        color: #2563eb;
    }
    
    .application-actions, .match-actions {
        display: flex;
        gap: 1rem;
    }
    
    .profile-form {
        background: #f9fafb;
        padding: 2rem;
        border-radius: 10px;
        max-width: 600px;
    }
    
    .matches-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }
`;

const dashboardStyleSheet = document.createElement('style');
dashboardStyleSheet.textContent = dashboardStyles;
document.head.appendChild(dashboardStyleSheet);
