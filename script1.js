// ========================================
// PORTFOLIO - SCRIPT.JS
// AUTHOR: Sanket Barot - QA Engineer
// VERSION: 2.0 - Final
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
// THEME TOGGLE
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

    applyTheme(getPreferredTheme());

    themeToggle.addEventListener('click', toggleTheme);

    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// ========================================
// NAVIGATION
// ========================================

function initNavigation() {
    const hamburger  = document.getElementById('hamburger');
    const navLinks   = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    if (!hamburger || !navLinks) return;

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

    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('click', (e) => {
        if (
            navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 991) closeMenu();
    });

    window.toggleMenu = toggleMenu;
    window.closeMenu  = closeMenu;
}

// ========================================
// NAVBAR SCROLL
// ========================================

function initNavbarScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ========================================
// SCROLL SPY
// ========================================

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a');

    if (!sections.length || !links.length) return;

    // ✅ FIX: Throttle scroll event for better performance
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                let current = '';

                sections.forEach(section => {
                    if (window.scrollY >= section.offsetTop - 120) {
                        current = section.getAttribute('id');
                    }
                });

                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
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
// SCROLL TO TOP
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

    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}

// ========================================
// HERO COUNTERS
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
// TYPING EFFECT
// ========================================

function initTypingEffect() {
    const typingEl = document.getElementById('typingText');
    if (!typingEl) return;

    const mobileTexts = [
        'QA Tester',
        'Bug Hunter 🐛',
        'QA Engineer',
        'Test Analyst'
    ];

    const desktopTexts = [
        'QA Manual Tester',
        'Quality Assurance Engineer',
        'Software Test Analyst',
        'Bug Hunter 🐛'
    ];

    let textIndex  = 0;
    let charIndex  = 0;
    let isDeleting = false;
    let timeoutId  = null;

    function getTexts() {
        return window.innerWidth < 576 ? mobileTexts : desktopTexts;
    }

    function type() {
        const texts   = getTexts();
        const current = texts[textIndex % texts.length];

        typingEl.textContent = isDeleting
            ? current.substring(0, charIndex - 1)
            : current.substring(0, charIndex + 1);

        isDeleting ? charIndex-- : charIndex++;

        if (!isDeleting && charIndex === current.length) {
            timeoutId = setTimeout(() => { isDeleting = true; type(); }, 2000);
            return;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex  = (textIndex + 1) % texts.length;
        }

        timeoutId = setTimeout(type, isDeleting ? 50 : 100);
    }

    type();

    let wasMobile = window.innerWidth < 576;

    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth < 576;
        if (isMobile !== wasMobile) {
            wasMobile  = isMobile;
            textIndex  = 0;
            charIndex  = 0;
            isDeleting = false;
            clearTimeout(timeoutId);
            type();
        }
    });
}

// ========================================
// SKILL BARS
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
// SKILL CARDS ANIMATION
// ========================================

function initSkillCards() {
    const cards = document.querySelectorAll('.skill-category');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(20px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(card);
    });
}

// ========================================
// EXPERIENCE TIMELINE
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
// ABOUT COUNTERS
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
// EDUCATION TIMELINE
// ========================================

function initEducationTimeline() {
    const steps = document.querySelectorAll('.timeline-step');
    if (!steps.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.timeline-step').forEach((step, i) => {
                    setTimeout(() => {
                        step.style.opacity   = '1';
                        step.style.transform = 'translateY(0)';
                    }, i * 150);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    steps.forEach(step => {
        step.style.opacity    = '0';
        step.style.transform  = 'translateY(20px)';
        step.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    const timeline = document.querySelector('.timeline-progress');
    if (timeline) observer.observe(timeline);
}

// ========================================
// EDUCATION CARDS
// ========================================

function initEducationCards() {
    const cards = document.querySelectorAll('.education-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 120);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// ========================================
// PROJECT FILTER
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

                if (show) {
                    card.style.display = 'flex';
                    requestAnimationFrame(() => {
                        card.style.opacity   = '1';
                        card.style.transform = 'scale(1)';
                    });
                } else {
                    card.style.opacity   = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        // ✅ FIX: Check if still hidden before removing
                        if (card.style.opacity === '0') {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });

            trackEvent('Project', 'Filter_Click', filter);
        });
    });
}

// ========================================
// PROJECT CARDS ANIMATION
// ========================================

function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// ========================================
// SUMMARY CARDS
// ========================================

function initSummaryCards() {
    const cards = document.querySelectorAll('.summary-card');
    if (!cards.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity   = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    cards.forEach(card => {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(20px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    const summary = document.querySelector('.projects-summary');
    if (summary) observer.observe(summary);
}

// ========================================
// CONTACT FORM
// ========================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

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

            // ✅ ENHANCED: Use CSS variables for theme-aware colors
            if (len > 450) {
                charEl.style.color = 'var(--danger)';
            } else if (len > 300) {
                charEl.style.color = 'var(--warning)';
            } else {
                charEl.style.color = '';
            }
        });
    }
}

// Reset Form
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
// BUTTON RIPPLE
// ========================================

function initRipple() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // ✅ ENHANCED: Don't add ripple to submit button while loading
            if (this.classList.contains('loading')) return;

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
                animation: rippleAnim 0.6s ease-out forwards;
                pointer-events: none;
                z-index: 99;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 700);
        });
    });
}

// ========================================
// FADE IN
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
// NEWSLETTER
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
// ANALYTICS TRACKING
// ========================================

function initTracking() {
    // Resume Download
    document.querySelectorAll('a[download]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Resume', 'Download', link.getAttribute('download') || 'Resume');
        });
    });

    // Email
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'Email_Click', link.href.replace('mailto:', ''));
        });
    });

    // Phone
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

    // Scroll Depth
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
// FOOTER YEAR
// ========================================

function initCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
}

// ========================================
// ✅ NEW: RIPPLE ANIMATION CSS
// Adds ripple keyframe if not in CSS
// ========================================

function initRippleCSS() {
    if (document.getElementById('ripple-style')) return;

    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
        @keyframes rippleAnim {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // Core
    initTheme();
    initNavigation();
    initNavbarScroll();
    initScrollSpy();
    initSmoothScroll();
    initScrollToTop();

    // Animations
    initHeroCounters();
    initTypingEffect();
    initSkillBars();
    initSkillCards();
    initTimeline();
    initAboutCounters();
    initEducationCards();
    initEducationTimeline();
    initProjectFilter();
    initProjectCards();
    initSummaryCards();

    // Forms
    initContactForm();

    // Effects
    initRippleCSS();
    initRipple();
    initFadeIn();

    // Analytics
    initTracking();

    // Footer
    initCurrentYear();
});