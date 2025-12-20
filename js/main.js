// Main JavaScript file for SDN Singasari Website

document.addEventListener('DOMContentLoaded', function() {
    console.log('SDN Singasari Website loaded successfully');
    
    // Initialize components
    initCarousel();
    initSmoothScroll();
    initFormValidation();
    initScrollAnimations();
});

// Carousel initialization
function initCarousel() {
    const carousel = document.getElementById('header-carousel');
    if (carousel) {
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true,
            pause: 'hover'
        });
    }
}

// Smooth scrolling for internal links
function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
}

// Form validation and submission
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Real-time validation
    contactForm.querySelectorAll('.form-control, .form-select').forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = {};
        
        // Validate all fields
        this.querySelectorAll('.form-control, .form-select').forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
            
            // Collect form data
            formData[input.id] = input.value;
        });
        
        if (isValid) {
            // Simulate form submission
            simulateFormSubmission(formData);
        }
    });
}

// Validate individual form field
function validateField(field) {
    const value = field.value.trim();
    const isValid = field.checkValidity();
    
    if (field.type === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            return false;
        }
    }
    
    if (field.required && value === '') {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        return false;
    }
    
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    return true;
}

// Simulate form submission
function simulateFormSubmission(formData) {
    console.log('Form submitted:', formData);
    
    // Show loading state
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Mengirim...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        document.getElementById('contactForm').reset();
        document.getElementById('contactForm').querySelectorAll('.form-control, .form-select').forEach(input => {
            input.classList.remove('is-valid');
        });
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Pesan Terkirim!',
            text: 'Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.',
            confirmButtonColor: '#015fc9',
            confirmButtonText: 'OK'
        });
    }, 1500);
}

// Scroll animations
function initScrollAnimations() {
    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        // Back to top button visibility
        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
        
        // Navbar shadow on scroll
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // Animate elements on scroll
        animateOnScroll();
    });
    
    // Initial animation check
    animateOnScroll();
}

// Animate elements when they come into view
function animateOnScroll() {
    const elements = document.querySelectorAll('.facility-card, .contact-item, .school-image, .cta-image');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        // Check if element is in viewport
        if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
            element.classList.add('animate-in');
        }
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
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
    
    .navbar-scrolled {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);