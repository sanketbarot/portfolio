// ========================================
// PORTFOLIO - SCRIPT.JS
// AUTHOR: Sanket Barot - QA Engineer
// ========================================

'use strict';

// ========================================
// GOOGLE ANALYTICS TRACKER
// ========================================

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
// THEME TOGGLE - Light / Dark
// ========================================

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    if (!themeToggle) return;

    const toggleLabel = themeToggle.querySelector('.toggle-label');

    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (toggleLabel) {
            toggleLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
        }

        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#06080d' : '#f1f5f9');
        }
    }

    function toggleTheme() {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        trackEvent('Theme', 'Toggle', next);
    }

    // Set theme on load
    applyTheme(getPreferredTheme());

    // Click
    themeToggle.addEventListener('click', toggleTheme);

    // Keyboard (Enter / Space)
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });

    // Auto change if system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// ========================================
// NAVIGATION - Mobile Hamburger Menu
// ========================================

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    // ✅ Safety check
    if (!hamburger) { console.error('❌ #hamburger not found'); return; }
    if (!navLinks)  { console.error('❌ #navLinks not found');  return; }

    console.log('✅ Navigation Ready');

    function openMenu() {
        hamburger.classList.add('active');
        navLinks.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (navOverlay) navOverlay.classList.add('active');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        if (navOverlay) navOverlay.classList.remove('active');
    }

    function toggleMenu() {
        navLinks.classList.contains('active') ? closeMenu() : openMenu();
    }

    // Hamburger button click
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Close when any nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close when overlay is clicked
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close when clicking outside the menu
    document.addEventListener('click', (e) => {
        if (
            navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Close when resizing to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });

    // Make available globally (if used in HTML onclick)
    window.toggleMenu = toggleMenu;
    window.closeMenu  = closeMenu;
}

// ========================================
// NAVBAR - Shadow on Scroll
// ========================================

function initNavbarScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ========================================
// SCROLL SPY - Highlight Active Nav Link
// ========================================

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
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
// SMOOTH SCROLL - Anchor Links
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

    window.addEventListener('scroll', () => {
        scrollBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        trackEvent('Navigation', 'Scroll_Top', 'Button');
    });

    // Global (if onclick used in HTML)
    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}

// ========================================
// HERO - Stats Counter Animation
// ========================================

function initHeroCounters() {
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(heroStats);

    function animateCounters() {
        document.querySelectorAll('.stat-card .number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            const step   = target / (2000 / 16);
            let current  = 0;

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
// TYPING EFFECT - Hero Subtitle
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

    let textIndex  = 0;
    let charIndex  = 0;
    let isDeleting = false;

    function type() {
        const current = texts[textIndex];

        typingEl.textContent = isDeleting
            ? current.substring(0, charIndex - 1)
            : current.substring(0, charIndex + 1);

        isDeleting ? charIndex-- : charIndex++;

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
// TYPING EFFECT - Mobile Friendly
// ========================================

function initTypingEffect() {
    const typingEl = document.getElementById('typingText');
    if (!typingEl) return;

    // ✅ Different texts for mobile vs desktop
    const isMobile = window.innerWidth < 576;

    const texts = isMobile
        ? [
            'QA Tester',
            'Bug Hunter 🐛',
            'QA Engineer',
            'Test Analyst'
        ]
        : [
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

        typingEl.textContent = isDeleting
            ? current.substring(0, charIndex - 1)
            : current.substring(0, charIndex + 1);

        isDeleting ? charIndex-- : charIndex++;

        if (!isDeleting && charIndex === current.length) {
            setTimeout(() => { isDeleting = true; }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        setTimeout(type, isDeleting ? 50 : 100);
    }

    type();

    // ✅ Update texts when screen resizes
    let currentMobile = isMobile;
    window.addEventListener('resize', () => {
        const nowMobile = window.innerWidth < 576;
        if (nowMobile !== currentMobile) {
            currentMobile = nowMobile;
            // Reset typing with new text set
            textIndex = 0;
            charIndex = 0;
            isDeleting = false;
        }
    });
}
// ========================================
// SKILL PROGRESS BARS - Animate on View
// ========================================

function initSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar   = entry.target;
                const width = bar.getAttribute('data-progress') || '0';
                setTimeout(() => { bar.style.width = width + '%'; }, 300);
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
// TIMELINE - Slide in Animation
// ========================================

function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => {
        item.style.opacity    = '0';
        item.style.transform  = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}

// ========================================
// ABOUT - Info Card Counter Animation
// ========================================

function initAboutCounters() {
    const aboutCards = document.querySelector('.about-info-cards');
    if (!aboutCards) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                runCounters();
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(aboutCards);

    function runCounters() {
        const cards = document.querySelectorAll('.info-card');
        const data  = [
            { index: 0, target: 2,    suffix: '+' },
            { index: 1, target: 500,  suffix: '+' },
            { index: 2, target: 1000, suffix: '+' },
            { index: 3, target: 3,    suffix: '+' }
        ];

        data.forEach(item => {
            const el = cards[item.index]?.querySelector('span');
            if (!el) return;

            let current = 0;
            const inc   = item.target / 50;

            const timer = setInterval(() => {
                current += inc;
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
// PROJECT FILTER - Show/Hide Cards
// ========================================

function initProjectFilter() {
    const filterBtns   = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

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
// CONTACT FORM - Web3Forms Submit
// ========================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Form Submit
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        if (!btn) return;

        btn.classList.add('loading');
        btn.disabled = true;

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: new FormData(form)
            });

            const result = await response.json();

            if (result.success) {
                form.style.display = 'none';
                const successEl = document.getElementById('formSuccess');
                if (successEl) successEl.classList.add('show');
                form.reset();
                trackEvent('Form', 'Contact_Submit_Success', 'Contact Form');
            } else {
                alert('Failed to send. Please try again.');
                trackEvent('Form', 'Contact_Submit_Failed', 'Contact Form');
            }
        } catch (error) {
            alert('Network error! Check your internet connection.');
            console.error('Form Error:', error);
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    });

    // Character Count
    const msgField = document.getElementById('message');
    const charEl   = document.querySelector('.char-count');

    if (msgField && charEl) {
        msgField.addEventListener('input', function() {
            const len = this.value.length;
            charEl.textContent = len + ' / 500';
            charEl.style.color = len > 450 ? '#ef4444' : len > 300 ? '#f59e0b' : '#94a3b8';
        });
    }
}

// Reset Form (called from HTML button onclick)
window.resetForm = function() {
    const form      = document.getElementById('contactForm');
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
            const rect   = this.getBoundingClientRect();
            const size   = Math.max(rect.width, rect.height);

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
                z-index: 99;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ========================================
// FADE IN - Elements on Scroll
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
    const emailInput = event.target.querySelector('input[type="email"]');
    if (!emailInput || !emailInput.value) return;

    const email = emailInput.value.trim();
    alert('Thank you! Updates will be sent to ' + email);
    event.target.reset();
    trackEvent('Newsletter', 'Subscribe', email);
};

// ========================================
// PROJECT VIEW DETAILS
// ========================================

window.openProjectModal = function(projectId) {
    trackEvent('Project', 'View_Details', projectId);
    const contact = document.querySelector('#contact');
    if (contact) contact.scrollIntoView({ behavior: 'smooth' });
};

// ========================================
// ANALYTICS - Track User Actions
// ========================================

function initTracking() {

    // Resume Download
    document.querySelectorAll('a[download]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Resume', 'Download', link.getAttribute('download') || 'Resume');
        });
    });

    // Email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'Email_Click', link.href.replace('mailto:', ''));
        });
    });

    // Phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'Phone_Click', link.href.replace('tel:', ''));
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
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('Section', 'View', entry.target.id);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

    // Scroll Depth (25%, 50%, 75%, 100%)
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const total = document.body.scrollHeight - window.innerHeight;
        if (total <= 0) return;

        const pct = Math.round((window.scrollY / total) * 100);
        [25, 50, 75, 100].forEach(depth => {
            if (pct >= depth && maxScroll < depth) {
                trackEvent('Scroll', 'Depth_' + depth, depth + '%');
            }
        });
        maxScroll = Math.max(maxScroll, pct);
    }, { passive: true });
}

// ========================================
// FOOTER - Current Year
// ========================================

function initCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
}

// ========================================
// INITIALIZE ALL FUNCTIONS
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    initTheme();          // ✅ Light / Dark theme
    initNavigation();     // ✅ Mobile hamburger menu
    initNavbarScroll();   // ✅ Nav scroll shadow
    initScrollSpy();      // ✅ Active link highlight
    initSmoothScroll();   // ✅ Smooth anchor scroll
    initScrollToTop();    // ✅ Back to top button
    initHeroCounters();   // ✅ Hero stats animation
    initTypingEffect();   // ✅ Typing text effect
    initSkillBars();      // ✅ Skill bar animation
    initTimeline();       // ✅ Timeline slide animation
    initAboutCounters();  // ✅ About card counters
    initProjectFilter();  // ✅ Project filter
    initContactForm();    // ✅ Contact form + Web3Forms
    initRipple();         // ✅ Button click ripple
    initFadeIn();         // ✅ Scroll fade animation
    initTracking();       // ✅ Google Analytics
    initCurrentYear();    // ✅ Footer year

    console.log('✅ Portfolio Loaded!');
    console.log('👤 Sanket Barot - QA Engineer');
    console.log('📊 GA: G-T43XEEP1G7');
    console.log('🌐 https://sanketbarot.github.io/portfolio/');
});