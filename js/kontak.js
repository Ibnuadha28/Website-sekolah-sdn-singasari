// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact page loaded');
    
    // Initialize components
    initContactForm();
    initMap();
    initWhatsAppButton();
    initScrollAnimations();
});

// Initialize contact form with enhanced validation
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Phone number formatting
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 12) value = value.substring(0, 12);
            
            // Format with spaces
            if (value.length > 4) {
                value = value.substring(0, 4) + ' ' + value.substring(4);
            }
            if (value.length > 8) {
                value = value.substring(0, 8) + ' ' + value.substring(8);
            }
            
            this.value = value;
        });
        
        // Validate phone number
        phoneInput.addEventListener('blur', function() {
            const value = this.value.replace(/\s/g, '');
            const phoneRegex = /^[0-9]{10,12}$/;
            
            if (value && !phoneRegex.test(value)) {
                this.setCustomValidity('Nomor telepon harus 10-12 digit angka');
                this.classList.add('is-invalid');
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    // Email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (this.value && !emailRegex.test(this.value)) {
                this.setCustomValidity('Format email tidak valid');
                this.classList.add('is-invalid');
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    // Message character counter
    const messageTextarea = form.querySelector('textarea');
    if (messageTextarea) {
        const maxLength = 500;
        const counter = document.createElement('div');
        counter.className = 'char-counter text-end mt-2 small';
        counter.innerHTML = `<span class="char-count">0</span>/${maxLength} karakter`;
        messageTextarea.parentNode.appendChild(counter);
        
        messageTextarea.addEventListener('input', function() {
            const count = this.value.length;
            const charCount = counter.querySelector('.char-count');
            charCount.textContent = count;
            
            if (count > maxLength) {
                this.value = this.value.substring(0, maxLength);
                charCount.textContent = maxLength;
                charCount.style.color = '#dc3545';
                counter.style.color = '#dc3545';
            } else if (count > maxLength * 0.9) {
                charCount.style.color = '#ffc107';
                counter.style.color = '#ffc107';
            } else {
                charCount.style.color = '#6c757d';
                counter.style.color = '#6c757d';
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }
        
        // Collect form data
        const formData = {
            nama: form.querySelector('#nama').value,
            email: form.querySelector('#email').value,
            telepon: form.querySelector('#telepon').value.replace(/\s/g, ''),
            subject: form.querySelector('#subject').value,
            pesan: form.querySelector('#pesan').value
        };
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Mengirim...';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual fetch request)
        simulateFormSubmission(formData)
            .then(response => {
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Pesan Terkirim!',
                    html: `
                        <p>Terima kasih ${formData.nama}, pesan Anda telah kami terima.</p>
                        <p>Kami akan menghubungi Anda melalui email atau WhatsApp dalam 1x24 jam.</p>
                        <small class="text-muted">No. Tiket: #${generateTicketNumber()}</small>
                    `,
                    confirmButtonColor: '#015fc9',
                    confirmButtonText: 'OK'
                });
                
                // Reset form
                form.reset();
                form.classList.remove('was-validated');
                
                // Reset character counter if exists
                const charCounter = form.querySelector('.char-counter');
                if (charCounter) {
                    charCounter.querySelector('.char-count').textContent = '0';
                    charCounter.style.color = '#6c757d';
                }
            })
            .catch(error => {
                // Show error message
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Mengirim',
                    text: 'Terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung melalui WhatsApp.',
                    confirmButtonColor: '#dc3545',
                    confirmButtonText: 'OK'
                });
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure (90% success rate)
            if (Math.random() < 0.9) {
                resolve({
                    success: true,
                    message: 'Pesan berhasil dikirim',
                    data: formData
                });
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

// Generate random ticket number
function generateTicketNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SDN${timestamp}${random}`;
}

// Initialize map (optional)
function initMap() {
    const mapContainer = document.getElementById('mapPlaceholder');
    if (!mapContainer) return;
    
    // If Leaflet is available, initialize map
    if (typeof L !== 'undefined') {
        try {
            // Coordinates for SDN Singasari (example coordinates)
            const coordinates = [-7.4554, 109.2565];
            
            const map = L.map('mapPlaceholder').setView(coordinates, 15);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(map);
            
            // Custom marker icon
            const schoolIcon = L.divIcon({
                html: '<i class="fas fa-school fa-2x text-primary"></i>',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40],
                className: 'school-marker'
            });
            
            L.marker(coordinates, { icon: schoolIcon })
                .addTo(map)
                .bindPopup(`
                    <div class="map-popup">
                        <h5 class="mb-2">SDN Singasari</h5>
                        <p class="mb-2">Jl. Raya Syeh Quro, Talagasari</p>
                        <p class="mb-3">Kabupaten Banyumas, Jawa Tengah</p>
                        <a href="https://maps.google.com/?q=Jl.+Raya+Syeh+Quro,+Talagasari,+Kabupaten+Banyumas,+Jawa+Tengah" 
                           target="_blank" class="btn btn-sm btn-primary">
                            <i class="fas fa-directions me-1"></i> Dapatkan Arahan
                        </a>
                    </div>
                `)
                .openPopup();
            
            // Add style for marker
            const style = document.createElement('style');
            style.textContent = `
                .school-marker {
                    background: none;
                    border: none;
                }
                .map-popup .leaflet-popup-content-wrapper {
                    border-radius: 10px;
                    padding: 1rem;
                }
                .map-popup .leaflet-popup-content {
                    margin: 0;
                }
                .map-popup h5 {
                    color: var(--primary-color);
                    font-weight: 600;
                }
                .map-popup p {
                    margin: 0;
                    color: #666;
                    font-size: 0.9rem;
                }
            `;
            document.head.appendChild(style);
            
        } catch (error) {
            console.warn('Map initialization failed:', error);
        }
    }
}

// Initialize WhatsApp button functionality
function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            // Optional: Track WhatsApp clicks
            console.log('WhatsApp button clicked');
        });
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    // Add animation class to elements when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.contact-item, .faq-card, .location-info').forEach(element => {
        observer.observe(element);
    });
}

// Export functions if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initContactForm,
        simulateFormSubmission,
        generateTicketNumber
    };
}