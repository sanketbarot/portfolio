 // Mobile menu toggle
        function toggleMenu() {
            const navLinks = document.getElementById('navLinks');
            navLinks.classList.toggle('active');
        }

        function closeMenu() {
            const navLinks = document.getElementById('navLinks');
            navLinks.classList.remove('active');
        }

        // Form submission handler
        function handleSubmit(event) {
            event.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            event.target.reset();
        }

        // Scroll to top button
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Show/hide scroll to top button
        window.addEventListener('scroll', function() {
            const scrollTopBtn = document.getElementById('scrollTop');
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        // Intersection Observer for scroll animations
        function initScrollAnimations() {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe all fade-in elements
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach(function(element) {
                observer.observe(element);
            });
        }

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navHeight = 70;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            initScrollAnimations();

            // Animate skill bars on scroll
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach(function(bar) {
                const width = bar.style.width;
                bar.style.width = '0%';
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            setTimeout(function() {
                                bar.style.width = width;
                            }, 200);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                observer.observe(bar);
            });
        });
        

            // Animate skill progress bars on scroll
            function animateSkillBars() {
                const skillBars = document.querySelectorAll('.skill-progress');
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const progressBar = entry.target;
                            const width = progressBar.getAttribute('data-width');
                            progressBar.style.width = width + '%';
                            observer.unobserve(progressBar);
                        }
                    });
                }, {
                    threshold: 0.5,
                    rootMargin: '0px 0px -50px 0px'
                });
                
                skillBars.forEach(bar => {
                    observer.observe(bar);
                });
            }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', animateSkillBars);

        // Counter animation for percentages (optional)
        function animatePercentages() {
            const percentages = document.querySelectorAll('.skill-percent');
            
            percentages.forEach(el => {
                const target = parseInt(el.textContent);
                let current = 0;
                const duration = 1500;
                const step = target / (duration / 16);
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        el.textContent = Math.floor(current) + '%';
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target + '%';
                    }
                };
                
                // Start when visible
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        updateCounter();
                        observer.disconnect();
                    }
                });
                
                observer.observe(el);
            });
        }

                function animateTimeline() {
            const timelineItems = document.querySelectorAll('.timeline-item');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Add delay based on index
                        setTimeout(() => {
                            entry.target.classList.add('animate');
                        }, index * 200);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px'
            });
            
            timelineItems.forEach(item => {
                observer.observe(item);
            });
        }

        document.addEventListener('DOMContentLoaded', animateTimeline);


                // Education Card Hover Effect
        document.querySelectorAll('.education-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.setProperty('--hover-scale', '1.02');
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.setProperty('--hover-scale', '1');
            });
        });

        // Timeline Step Click to Highlight
        document.querySelectorAll('.timeline-step').forEach((step, index) => {
            step.addEventListener('click', function() {
                document.querySelectorAll('.timeline-step').forEach(s => s.classList.remove('active'));
                this.classList.add('active');
            });
        });

                // Project Filter Functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                const cards = document.querySelectorAll('.project-card');
                
                cards.forEach(card => {
                    const categories = card.getAttribute('data-category');
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'flex';
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Fade In Up Animation
        const style = document.createElement('style');
        style.textContent = `
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
        `;
        document.head.appendChild(style);

        // Project Modal (Optional)
        function openProjectModal(projectId) {
            // You can implement a modal to show more details
            console.log('Opening modal for:', projectId);
            
            // Example: scroll to contact section
            document.querySelector('#contact').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }

        // Counter Animation for Summary Stats
        function animateSummaryCounters() {
            const counters = document.querySelectorAll('.summary-value');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.textContent);
                        let current = 0;
                        const duration = 2000;
                        const step = target / (duration / 16);
                        
                        const updateCounter = () => {
                            current += step;
                            if (current < target) {
                                counter.textContent = Math.floor(current) + '+';
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target + '+';
                            }
                        };
                        
                        updateCounter();
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            
            counters.forEach(counter => observer.observe(counter));
        }

        document.addEventListener('DOMContentLoaded', animateSummaryCounters);


        // Form Submission Handler
        function handleSubmit(event) {
            event.preventDefault();
            
            const form = document.getElementById('contactForm');
            const submitBtn = document.getElementById('submitBtn');
            const formSuccess = document.getElementById('formSuccess');
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                projectType: document.getElementById('projectType').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate form submission (Replace with actual API call)
            setTimeout(() => {
                // Hide loading
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Show success message
                form.classList.add('hidden');
                formSuccess.classList.add('show');
                
                // Optional: Send to email service
                // sendToEmailService(formData);
                
            }, 2000);
        }

        // Form Validation
        function validateForm(data) {
            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            
            // Validate name
            if (!data.name.trim()) {
                document.getElementById('name').closest('.form-group').classList.add('error');
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                document.getElementById('email').closest('.form-group').classList.add('error');
                isValid = false;
            }
            
            // Validate message
            if (!data.message.trim()) {
                document.getElementById('message').closest('.form-group').classList.add('error');
                isValid = false;
            }
            
            return isValid;
        }

        // Reset Form
        function resetForm() {
            const form = document.getElementById('contactForm');
            const formSuccess = document.getElementById('formSuccess');
            
            form.reset();
            form.classList.remove('hidden');
            formSuccess.classList.remove('show');
        }

        // Character Count for Textarea
        const messageTextarea = document.getElementById('message');
        const charCount = document.querySelector('.char-count');

        if (messageTextarea && charCount) {
            messageTextarea.addEventListener('input', function() {
                const count = this.value.length;
                charCount.textContent = `${count} / 500`;
                
                if (count > 450) {
                    charCount.style.color = '#ef4444';
                } else if (count > 300) {
                    charCount.style.color = '#f59e0b';
                } else {
                    charCount.style.color = 'var(--gray)';
                }
            });
        }

        // Real-time Input Validation
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
            input.addEventListener('blur', function() {
                const group = this.closest('.form-group');
                
                if (this.required && !this.value.trim()) {
                    group.classList.add('error');
                } else {
                    group.classList.remove('error');
                }
                
                // Email validation
                if (this.type === 'email' && this.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value)) {
                        group.classList.add('error');
                    }
                }
            });
            
            input.addEventListener('input', function() {
                this.closest('.form-group').classList.remove('error');
            });
        });

        // Optional: EmailJS Integration
        /*
        function sendToEmailService(formData) {
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                project_type: formData.projectType,
                message: formData.message
            })
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function(error) {
                console.log('FAILED...', error);
            });
        }
        */

        // WhatsApp Link Generator
        function openWhatsApp() {
            const phone = '917487980840';
            const message = encodeURIComponent('Hi Sanket! I found your portfolio and would like to discuss an opportunity.');
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        }


        // Current Year
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // Scroll to Top Button
        const scrollTopBtn = document.getElementById('scrollTop');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Newsletter Submit
        function handleNewsletterSubmit(event) {
            event.preventDefault();
            const email = event.target.querySelector('input[name="newsletter-email"]').value;
            
            // Show success message
            alert(`Thank you! We'll send updates to ${email}`);
            event.target.reset();
            
            // Implement actual newsletter logic here
        }

        // Fade-in Animation on Scroll
        const fadeElements = document.querySelectorAll('.fade-in');

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(el => fadeObserver.observe(el));