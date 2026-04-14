// ========================================
// PORTFOLIO - COMPLETE SCRIPT.JS
// AUTHOR: Sanket Barot
// ========================================

'use strict';

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Google Analytics Event Tracker
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
// THEME TOGGLE
// ========================================

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    if (!themeToggle) return;

    const toggleLabel = themeToggle.querySelector('.toggle-label');

    // Get saved theme or system preference
    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    // Apply theme
    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (toggleLabel) {
            toggleLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
        }

        // Update mobile browser bar color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute(
                'content',
                theme === 'dark' ? '#06080d' : '#f1f5f9'
            );
        }
    }

    // Toggle between light and dark
    function toggleTheme() {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        trackEvent('Theme', 'Toggle', next);
    }

    // Initialize
    applyTheme(getPreferredTheme());

    // Click event
    themeToggle.addEventListener('click', toggleTheme);

    // Keyboard support
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });

    // System theme change listener
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
}

// ========================================
// NAVIGATION - MOBILE MENU
// ========================================

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navContainer = document.querySelector('.nav-container');

    if (!hamburger || !navLinks) return;

    // Open / Close Menu
    function openMenu() {
        hamburger.classList.add('active');
        navLinks.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Hamburger click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close when clicking a nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (
            navLinks.classList.contains('active') &&
            navContainer &&
            !navContainer.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Make toggleMenu globally available (for onclick in HTML)
    window.toggleMenu = toggleMenu;
    window.closeMenu = closeMenu;
}

// ========================================
// NAVBAR - SCROLL EFFECT
// ========================================

function initNavbarScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ========================================
// SCROLL SPY - Active Nav Link
// ========================================

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

// ========================================
// SMOOTH SCROLL
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollTop');
    if (!scrollBtn) return;

    // Show/hide button
    window.addEventListener('scroll', () => {
        scrollBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    // Click to scroll top
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        trackEvent('Navigation', 'Scroll_Top', 'Button');
    });

    // Global function for onclick in HTML
    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}

// ========================================
// HERO - COUNTER ANIMATION
// ========================================

function initHeroCounters() {
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(heroStats);

    function animateCounters() {
        document.querySelectorAll('.stat-card .number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function update() {
                current += step;
                if (current < target) {
                    counter.textContent = target >= 1000
                        ? (Math.floor(current / 100) / 10) + 'K'
                        : Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target >= 1000 ? '1K' : target;
                }
            }

            update();
        });
    }
}

// ========================================
// TYPING EFFECT
// ========================================

function initTypingEffect() {
    const typingEl = document.getElementById('typingText');
    if (!typingEl) return;

    const texts = [
        'QA Manual Tester',
        'Quality Assurance Engineer',
        'Software Test Analyst',
        'Bug Hunter 🐛'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = texts[textIndex];

        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === current.length) {
            setTimeout(() => { isDeleting = true; }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        setTimeout(type, isDeleting ? 50 : 100);
    }

    type();
}

// ========================================
// SKILL PROGRESS BARS
// ========================================

function initSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-progress') || '0';
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
// TIMELINE ANIMATION
// ========================================

function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}

// ========================================
// ABOUT - INFO CARD COUNTERS
// ========================================

function initAboutCounters() {
    const aboutCards = document.querySelector('.about-info-cards');
    if (!aboutCards) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounters();
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(aboutCards);

    function runCounters() {
        const cards = document.querySelectorAll('.info-card');
        const data = [
            { index: 0, target: 2,    suffix: '+' },
            { index: 1, target: 500,  suffix: '+' },
            { index: 2, target: 1000, suffix: '+' },
            { index: 3, target: 3,    suffix: '+' }
        ];

        data.forEach(item => {
            const el = cards[item.index]?.querySelector('span');
            if (!el) return;

            let current = 0;
            const increment = item.target / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= item.target) {
                    el.textContent = item.target + item.suffix;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current) + item.suffix;
                }
            }, 30);
        });
    }
}

// ========================================
// PROJECT FILTER
// ========================================

function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Show/Hide cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                const show = filter === 'all' || category.includes(filter);
                card.style.display = show ? 'flex' : 'none';
            });

            trackEvent('Project', 'Filter_Click', filter);
        });
    });
}

// ========================================
// CONTACT FORM
// ========================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Submit Form
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        if (!btn) return;

        // Show loading state
        btn.classList.add('loading');
        btn.disabled = true;

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: new FormData(form)
            });

            const result = await response.json();

            if (result.success) {
                // Show success
                form.style.display = 'none';
                const successEl = document.getElementById('formSuccess');
                if (successEl) successEl.classList.add('show');
                form.reset();

                // Track success
                trackEvent('Form', 'Contact_Submit_Success', 'Contact Form');
            } else {
                alert('Failed to send message. Please try again.');
                trackEvent('Form', 'Contact_Submit_Failed', 'Contact Form');
            }
        } catch (error) {
            alert('Network error! Please check your internet connection.');
            console.error('Form Error:', error);
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    });

    // Character Count for Message
    const msgField = document.getElementById('message');
    const charEl = document.querySelector('.char-count');

    if (msgField && charEl) {
        msgField.addEventListener('input', function() {
            const len = this.value.length;
            charEl.textContent = len + ' / 500';

            if (len > 450) {
                charEl.style.color = '#ef4444';
            } else if (len > 300) {
                charEl.style.color = '#f59e0b';
            } else {
                charEl.style.color = '#94a3b8';
            }
        });
    }
}

// Global reset form function (for onclick in HTML)
window.resetForm = function() {
    const form = document.getElementById('contactForm');
    const successEl = document.getElementById('formSuccess');

    if (form) {
        form.reset();
        form.style.display = 'block';
    }

    if (successEl) {
        successEl.classList.remove('show');
    }
};

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================

function initRipple() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: rippleAnim 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ========================================
// FADE IN ANIMATION
// ========================================

function initFadeIn() {
    const fadeEls = document.querySelectorAll('.fade-in');
    if (!fadeEls.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => observer.observe(el));
}

// ========================================
// NEWSLETTER FORM
// ========================================

window.handleNewsletterSubmit = function(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input');
    if (!emailInput) return;

    const email = emailInput.value;
    alert('Thank you! Updates will be sent to ' + email);
    event.target.reset();
    trackEvent('Newsletter', 'Subscribe', email);
};

// ========================================
// PROJECT MODAL
// ========================================

window.openProjectModal = function(projectId) {
    trackEvent('Project', 'View_Details', projectId);
    const contact = document.querySelector('#contact');
    if (contact) contact.scrollIntoView({ behavior: 'smooth' });
};

// ========================================
// ANALYTICS TRACKING
// ========================================

function initTracking() {

    // Resume Download
    document.querySelectorAll('a[download]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Resume', 'Download', 'Resume.pdf');
        });
    });

    // Email Links
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'Email_Click', link.href);
        });
    });

    // Phone Links
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'Phone_Click', link.href);
        });
    });

    // WhatsApp
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'WhatsApp_Click', 'WhatsApp');
        });
    });

    // LinkedIn
    document.querySelectorAll('a[href*="linkedin"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Social', 'LinkedIn_Click', 'LinkedIn');
        });
    });

    // GitHub
    document.querySelectorAll('a[href*="github"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Social', 'GitHub_Click', 'GitHub');
        });
    });

    // Section Views
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('Section', 'View', entry.target.id);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => sectionObserver.observe(s));

    // Scroll Depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPct = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );

        const depths = [25, 50, 75, 100];
        depths.forEach(depth => {
            if (scrollPct >= depth && maxScroll < depth) {
                trackEvent('Scroll', 'Depth_' + depth, depth + '%');
            }
        });

        maxScroll = Math.max(maxScroll, scrollPct);
    }, { passive: true });
}

// ========================================
// CURRENT YEAR IN FOOTER
// ========================================

function initCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
}

// ========================================
// INITIALIZE EVERYTHING
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    initTheme();          // Light / Dark toggle
    initNavigation();     // Mobile hamburger menu
    initNavbarScroll();   // Nav shadow on scroll
    initScrollSpy();      // Active nav link highlight
    initSmoothScroll();   // Smooth scroll on anchor links
    initScrollToTop();    // Back to top button
    initHeroCounters();   // Hero stats number animation
    initTypingEffect();   // Typing text animation
    initSkillBars();      // Skill progress bars
    initTimeline();       // Experience timeline animation
    initAboutCounters();  // About info card counters
    initProjectFilter();  // Project filter buttons
    initContactForm();    // Contact form submit
    initRipple();         // Button ripple effect
    initFadeIn();         // Fade in on scroll
    initTracking();       // Google Analytics tracking
    initCurrentYear();    // Footer year

    console.log('✅ Portfolio Loaded!');
    console.log('👤 Sanket Barot - QA Engineer');
    console.log('📊 GA: G-T43XEEP1G7');
});