// Set current year in footer
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        
        // Hide spinner when page loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                document.getElementById('spinner').classList.remove('show');
                // Show info modal after 1 second
                setTimeout(function() {
                    const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
                    infoModal.show();
                }, 1000);
            }, 500);
        });
        
        // Back to top button
        const backToTopButton = document.querySelector('.back-to-top');
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Form validation
        function validateForm() {
            const form = document.getElementById('registrationForm');
            
            // Check required fields
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            let firstInvalidField = null;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Validate date of birth
            const dobField = document.getElementById('tanggal_lahir');
            if (dobField.value) {
                const dob = new Date(dobField.value);
                const today = new Date();
                const age = today.getFullYear() - dob.getFullYear();
                
                if (age < 5 || age > 7) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Perhatian',
                        html: `Usia siswa saat mendaftar: <b>${age} tahun</b><br>Pastikan usia sesuai dengan ketentuan PPDB (5-7 tahun).`,
                        confirmButtonText: 'Lanjutkan',
                        showCancelButton: true,
                        cancelButtonText: 'Periksa Kembali'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            submitForm();
                        }
                    });
                    return false;
                }
            }
            
            if (!isValid) {
                Swal.fire({
                    icon: 'error',
                    title: 'Data Belum Lengkap',
                    text: 'Harap isi semua field yang wajib diisi (bertanda *).',
                    confirmButtonText: 'Mengerti'
                });
                
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                
                return false;
            }
            
            // If all validations pass
            submitForm();
            return false; // Prevent actual form submission for demo
        }
        
        function submitForm() {
            Swal.fire({
                title: 'Mengirim Data...',
                text: 'Sedang memproses pendaftaran Anda',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Simulate form submission
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Pendaftaran Berhasil!',
                    html: `
                        <p>Data pendaftaran Anda telah berhasil dikirim.</p>
                        <p><strong>Nomor Pendaftaran:</strong> PPDB-${Math.floor(100000 + Math.random() * 900000)}</p>
                        <p>Simpan nomor pendaftaran ini untuk mengecek status.</p>
                    `,
                    confirmButtonText: 'Cek Status Pendaftaran',
                    showCancelButton: true,
                    cancelButtonText: 'Tutup'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'cek.html';
                    } else {
                        // Reset form
                        document.getElementById('registrationForm').reset();
                    }
                });
            }, 2000);
        }
        
        // Real-time validation for NIK field
        document.getElementById('nik')?.addEventListener('input', function(e) {
            if (this.value.length > 16) {
                this.value = this.value.slice(0, 16);
            }
        });
        
        // Phone number formatting
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                // Remove non-numeric characters
                this.value = this.value.replace(/\D/g, '');
            });
        });