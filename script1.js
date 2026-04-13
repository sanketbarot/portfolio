// ========================================
// NAVIGATION FUNCTIONS
// ========================================

// Toggle Mobile Menu
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close Menu
function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const navContainer = document.querySelector('.nav-container');
    
    if (!navContainer.contains(e.target) && navLinks.classList.contains('active')) {
        closeMenu();
    }
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ========================================
// ACTIVE LINK ON SCROLL (SCROLL SPY)
// ========================================

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = 'home';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========================================
// SMOOTH SCROLL POLYFILL (For older browsers)
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        if (targetId !== '#') {
            e.preventDefault();
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});


// ========================================
// HERO SECTION ANIMATIONS
// ========================================

// Counter Animation for Hero Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-card .number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                if (target >= 1000) {
                    counter.textContent = Math.floor(current / 100) / 10 + 'K';
                } else {
                    counter.textContent = Math.floor(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (target >= 1000) {
                    counter.textContent = '1K';
                } else {
                    counter.textContent = target;
                }
            }
        };
        
        updateCounter();
    });
}

// Run counter animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    heroObserver.observe(heroStats);
}

// Typing Effect (Optional)
function typeWriter() {
    const texts = [
        'QA Manual Tester',
        'Quality Assurance Engineer',
        'Software Test Analyst',
        'Bug Hunter 🐛'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById('typingText');
    
    if (!typingElement) return;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        const typeSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typeSpeed);
    }
    
    // Uncomment to enable typing effect
    // type();
}

// Initialize typing effect
// typeWriter();

// Button Ripple Effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ========================================
// ABOUT INFO CARDS - COUNTER ANIMATION
// ========================================

function animateAboutCounters() {
    const cards = document.querySelectorAll('.info-card');
    
    const counters = [
        { element: cards[0]?.querySelector('span'), target: 2, suffix: '+' },
        { element: cards[1]?.querySelector('span'), target: 500, suffix: '+' },
        { element: cards[2]?.querySelector('span'), target: 1000, suffix: '+' },
        { element: cards[3]?.querySelector('span'), target: 3, suffix: '+' }
    ];
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach((counter, index) => {
                    if (!counter.element) return;
                    
                    let current = 0;
                    const increment = counter.target / 50;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= counter.target) {
                            counter.element.textContent = counter.target + counter.suffix;
                            clearInterval(timer);
                        } else {
                            counter.element.textContent = Math.floor(current) + counter.suffix;
                        }
                    }, 30);
                });
                
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    const aboutCards = document.querySelector('.about-info-cards');
    if (aboutCards) observer.observe(aboutCards);
}

// Initialize
document.addEventListener('DOMContentLoaded', animateAboutCounters);



// ========================================
// GOOGLE ANALYTICS TRACKING
// ID: G-T43XEEP1G7
// SITE: https://sanketbarot.github.io/portfolio/
// ========================================

// Track any event
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: 1
        });
    }
}

// ========================================
// AUTO TRACK ALL CLICKS
// ========================================

function initTracking() {

    // 1. Track Resume Downloads
    document.querySelectorAll('a[download]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Resume', 'Download', 'QA_Tester_Resume.pdf');
        });
    });

    // 2. Track Email Clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'Email_Click', 'sanketbarot3901@gmail.com');
        });
    });

    // 3. Track Phone Clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'Phone_Click', '+91 7487980840');
        });
    });

    // 4. Track WhatsApp Clicks
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'WhatsApp_Click', 'WhatsApp');
        });
    });

    // 5. Track LinkedIn Clicks
    document.querySelectorAll('a[href*="linkedin"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Social', 'LinkedIn_Click', 'LinkedIn');
        });
    });

    // 6. Track GitHub Clicks
    document.querySelectorAll('a[href*="github"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Social', 'GitHub_Click', 'GitHub');
        });
    });

    // 7. Track Hire Me Button
    document.querySelectorAll('a[href="#contact"]').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('CTA', 'Hire_Me_Click', 'Hire Me Button');
        });
    });

    // 8. Track View Projects Button
    document.querySelectorAll('a[href="#projects"]').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('CTA', 'View_Projects_Click', 'View Projects Button');
        });
    });

    // 9. Track Section Views
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.getAttribute('id');
                trackEvent('Section', 'View', sectionName);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 10. Track Scroll Depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / 
            (document.body.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent > maxScroll) {
            if (scrollPercent >= 25 && maxScroll < 25) {
                trackEvent('Scroll', 'Depth_25', '25%');
            }
            if (scrollPercent >= 50 && maxScroll < 50) {
                trackEvent('Scroll', 'Depth_50', '50%');
            }
            if (scrollPercent >= 75 && maxScroll < 75) {
                trackEvent('Scroll', 'Depth_75', '75%');
            }
            if (scrollPercent >= 100 && maxScroll < 100) {
                trackEvent('Scroll', 'Depth_100', '100%');
            }
            maxScroll = scrollPercent;
        }
    });

    // 11. Track Project Filter Clicks
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            trackEvent('Project', 'Filter_Click', filter);
        });
    });

    // 12. Track View Details Buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('Project', 'View_Details', btn.closest('.project-card')
                ?.querySelector('h3')?.textContent || 'Unknown');
        });
    });
}

// ========================================
// NAVIGATION
// ========================================

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');

    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');

    document.body.style.overflow = 
        navLinks.classList.contains('active') ? 'hidden' : '';
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');

    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

// Close on outside click
document.addEventListener('click', (e) => {
    const navLinks = document.getElementById('navLinks');
    if (!e.target.closest('.nav-container') && 
        navLinks.classList.contains('active')) {
        closeMenu();
    }
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// ========================================
// SCROLL SPY - Active Link
// ========================================

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = 'home';

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('Navigation', 'Scroll_Top', 'Scroll to Top Button');
}

window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
        scrollBtn.classList.toggle('visible', window.scrollY > 300);
    }
});

// ========================================
// SKILL PROGRESS BARS
// ========================================

function initSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 300);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

// ========================================
// CONTACT FORM
// ========================================

function handleSubmit(event) {
    event.preventDefault();

    // Track form submission
    trackEvent('Form', 'Contact_Submit', 'Contact Form');

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        document.getElementById('contactForm').classList.add('hidden');
        document.getElementById('formSuccess').classList.add('show');
    }, 2000);
}

function resetForm() {
    document.getElementById('contactForm').reset();
    document.getElementById('contactForm').classList.remove('hidden');
    document.getElementById('formSuccess').classList.remove('show');
}

// ========================================
// CURRENT YEAR
// ========================================

const yearEl = document.getElementById('currentYear');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ========================================
// CHARACTER COUNT FOR MESSAGE
// ========================================

const msgField = document.getElementById('message');
const charEl = document.querySelector('.char-count');

if (msgField && charEl) {
    msgField.addEventListener('input', function () {
        const count = this.value.length;
        charEl.textContent = count + ' / 500';

        if (count > 450) {
            charEl.style.color = '#ef4444';
        } else if (count > 300) {
            charEl.style.color = '#f59e0b';
        } else {
            charEl.style.color = '#94a3b8';
        }
    });
}

// ========================================
// PROJECT FILTER
// ========================================

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        // Remove active from all
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
        });

        // Add active to clicked
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');

        // Show/Hide cards
        document.querySelectorAll('.project-card').forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category.includes(filter)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ========================================
// NEWSLETTER FORM
// ========================================

function handleNewsletterSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector('input').value;
    alert('Thank you! Updates will be sent to ' + email);
    event.target.reset();
    trackEvent('Newsletter', 'Subscribe', email);
}

// ========================================
// PROJECT MODAL
// ========================================

function openProjectModal(projectId) {
    trackEvent('Project', 'View_Details_Click', projectId);
    document.querySelector('#contact').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// ========================================
// FADE IN ANIMATION
// ========================================

function initFadeIn() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
}

// ========================================
// INITIALIZE ALL
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initTracking();
    initSkillBars();
    initFadeIn();

    console.log('✅ Portfolio Ready!');
    console.log('📊 GA: G-T43XEEP1G7');
    console.log('🌐 https://sanketbarot.github.io/portfolio/');
});