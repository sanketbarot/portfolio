'use strict';

/* ============================================================
   SANKET PORTFOLIO — script.js
   Clean, bug-free, fully commented
   ============================================================ */


/* ============================================================
   UTILITIES
   ============================================================ */

/** Throttle: prevents a function from firing more than once per `limit` ms */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/** Debounce: delays calling a function until after `wait` ms of inactivity */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/** Safe querySelector — returns null instead of throwing */
function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

/** Safe querySelectorAll — always returns an array */
function qsa(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
}


/* ============================================================
   1. PAGE LOADER
   ============================================================ */
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) loader.classList.add('loaded');
    }, 1200);
});


/* ============================================================
   2. SCROLL PROGRESS BAR
   ============================================================ */
const scrollProgressBar = document.getElementById('scrollProgressBar');

if (scrollProgressBar) {
    window.addEventListener('scroll', throttle(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        scrollProgressBar.style.width = Math.min(scrolled, 100) + '%';
    }, 10), { passive: true });
}


/* ============================================================
   3. NAVBAR — scroll shadow
   ============================================================ */
const navbar = document.getElementById('navbar');

if (navbar) {
    window.addEventListener('scroll', throttle(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, 100), { passive: true });
}


/* ============================================================
   4. HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

if (hamburger && navMenu) {

    // Toggle menu open/close
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation(); // ✅ FIXED: prevent click-outside firing
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close when a nav link is clicked
    qsa('.nav-link', navMenu).forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close when clicking outside the navbar
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}


/* ============================================================
   4.1 — Close mobile menu on window resize (to desktop)
   ============================================================ */
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 1024 && navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
}, 150));


/* ============================================================
   5. SMOOTH SCROLL (for all anchor links)
   ============================================================ */
qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.length <= 1) return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        // Offset based on screen size (smaller navbar on mobile)
        const navHeight = navbar ? navbar.offsetHeight : 100;
        const offset = window.innerWidth <= 768 ? 20 : 30;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - offset;

        window.scrollTo({ top, behavior: 'smooth' });
    });
});


/* ============================================================
   6. SCROLL SPY — highlights active nav link
   ============================================================ */
const spySections = qsa('section[id]');
const navLinks    = qsa('.nav-link');
let   spyTicking  = false;

function updateScrollSpy() {
    const navHeight = navbar ? navbar.offsetHeight : 100;
    const scrollPos = window.scrollY + navHeight + 60;
    let current = '';

    spySections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
            current = section.getAttribute('id');
        }
    });

    // Default to home if at top
    if (!current && window.scrollY < 100) {
        current = 'home';
    }

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', () => {
    if (!spyTicking) {
        requestAnimationFrame(() => {
            updateScrollSpy();
            spyTicking = false;
        });
        spyTicking = true;
    }
}, { passive: true });

// Run once on page load
updateScrollSpy();


/* ============================================================
   7. ANIMATED COUNTERS
   ============================================================ */
function animateCounter(el, target, duration = 2000) {
    const startTime = performance.now();

    function update(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }
    requestAnimationFrame(update);
}

const counters = qsa('[data-count]');
const countersAnimated = new WeakSet(); // ✅ FIXED: track per-counter

if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
                countersAnimated.add(entry.target);
                const target = parseInt(entry.target.getAttribute('data-count'), 10);
                if (!isNaN(target)) {
                    animateCounter(entry.target, target);
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => counterObserver.observe(counter));
}


/* ============================================================
   8. LIVE TIME (IST)
   ============================================================ */
function updateLiveTime() {
    const el = document.getElementById('liveTime');
    if (!el) return;

    // Convert to IST (UTC+5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + istOffset);

    const h = String(ist.getHours()).padStart(2, '0');
    const m = String(ist.getMinutes()).padStart(2, '0');
    el.textContent = `${h}:${m} IST`;
}

updateLiveTime();
setInterval(updateLiveTime, 30000); // update every 30s


/* ============================================================
   9. FADE-IN ON SCROLL (Intersection Observer)
   ============================================================ */
const fadeSelectors = [
    '.hex-card', '.skill-cat-pill',
    '.exp-flip-card', '.proj-creative',
    '.cm-card', '.fact-pill', '.roadmap-node',
    '.node-card', '.skill-level-card', '.tool-master',
    '.impact-card', '.reach-tile', '.ptag', '.mj-step',
    '.ln-item', '.achievement-item'
];

const fadeElements = qsa(fadeSelectors.join(', '));

if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => {
        el.classList.add('fade-up');
        fadeObserver.observe(el);
    });
}


/* ============================================================
   10. SCROLL-TO-TOP BUTTON
   ============================================================ */
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', throttle(() => {
        scrollTopBtn.classList.toggle('show', window.scrollY > 400);
    }, 200), { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ============================================================
   11. CONTACT FORM SUBMIT (Web3Forms)
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formResult  = document.getElementById('formResult');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn      = contactForm.querySelector('[type="submit"]');
        const origHTML = btn ? btn.innerHTML : '';
        const formData = new FormData(contactForm);
        const json     = JSON.stringify(Object.fromEntries(formData));

        // Show loading state
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-spinner"></i> <span>Sending...</span>';
            btn.disabled  = true;
        }

        if (formResult) {
            formResult.className   = 'form-result show loading';
            formResult.textContent = '⏳ Sending your message...';
        }

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (response.status === 200) {
                // ✅ SUCCESS
                if (formResult) {
                    formResult.className = 'form-result show success';
                    formResult.innerHTML = '✅ Message sent successfully! I\'ll get back to you within 24 hours.';
                }
                if (btn) {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Sent!</span>';
                }
                contactForm.reset();
            } else {
                // ❌ SERVER ERROR
                console.log('Web3Forms Error:', result);
                if (formResult) {
                    formResult.className = 'form-result show error';
                    formResult.innerHTML = '❌ ' + (result.message || 'Something went wrong. Please try again.');
                }
                if (btn) btn.innerHTML = origHTML;
            }
        } catch (error) {
            // ❌ NETWORK ERROR
            console.error('Form submission failed:', error);
            if (formResult) {
                formResult.className = 'form-result show error';
                formResult.innerHTML = '❌ Network error. Please check your internet connection.';
            }
            if (btn) btn.innerHTML = origHTML;
        } finally {
            // Reset button after 3 seconds
            setTimeout(() => {
                if (btn) {
                    btn.innerHTML = origHTML;
                    btn.disabled  = false;
                }
            }, 3000);

            // Hide result message after 6 seconds
            setTimeout(() => {
                if (formResult) {
                    formResult.classList.remove('show');
                }
            }, 6000);
        }
    });
}


/* ============================================================
   12. FOOTER — CURRENT YEAR
   ============================================================ */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ============================================================
   13. CUSTOM CURSOR (desktop only)
   ============================================================ */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId  = null;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        rafId = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Enlarge ring on interactive elements
    qsa('a, button, .hex-card, .roadmap-node, .reach-tile, .pft-btn, .tool-icon, .tool-master, .ptag, .fact-pill').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });

    // Pause ring animation when window loses focus (performance)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
        } else {
            animateRing();
        }
    });
}


/* ============================================================
   14. EDUCATION TRACKER BAR ANIMATION
   ============================================================ */
const trackerFill = qs('.tracker-fill');

if (trackerFill) {
    const trackerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = trackerFill.getAttribute('data-fill') || '0';
                trackerFill.style.width = target + '%';
                trackerObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    trackerObserver.observe(trackerFill);
}


/* ============================================================
   15. SKILL LEVEL BARS ANIMATION
   ============================================================ */
const slcFills = qsa('.slc-fill');
let   slcStarted = false;

if (slcFills.length > 0) {
    const slcObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !slcStarted) {
                slcStarted = true;
                slcFills.forEach((fill, i) => {
                    setTimeout(() => {
                        const target = fill.getAttribute('data-fill') || '0';
                        fill.style.width = target + '%';
                    }, i * 150);
                });
                slcObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    slcObserver.observe(slcFills[0]);
}


/* ============================================================
   16. LEARNING NOW BARS (ln-fill)
   ============================================================ */
const lnFills   = qsa('.ln-fill');
let   lnStarted = false;

if (lnFills.length > 0) {
    const lnObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !lnStarted) {
                lnStarted = true;
                lnFills.forEach((fill, i) => {
                    // Capture original width from inline style
                    const originalWidth = fill.style.width || '0%';
                    fill.style.width = '0%';
                    setTimeout(() => { 
                        fill.style.width = originalWidth; 
                    }, i * 200 + 300);
                });
                lnObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    lnObserver.observe(lnFills[0]);
}


/* ============================================================
   17. FAQ ACCORDION (one open at a time)
   ============================================================ */
qsa('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
        if (item.open) {
            qsa('.faq-item').forEach(other => {
                if (other !== item && other.open) other.open = false;
            });
        }
    });
});


/* ============================================================
   18. PROJECT FILTER TABS
   ============================================================ */
const pftBtns   = qsa('.pft-btn');
const projCards = qsa('.proj-creative');

if (pftBtns.length > 0 && projCards.length > 0) {
    pftBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            pftBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter') || 'all';

            projCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                const show = filter === 'all' || category.includes(filter);

                if (show) {
                    card.classList.remove('hidden');
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.92)';
                    setTimeout(() => card.classList.add('hidden'), 300);
                }
            });
        });
    });
}


/* ============================================================
   19. SEARCH BUTTON (quick section jump)
   ============================================================ */
const searchBtn = document.getElementById('searchBtn');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = prompt('🔍 Jump to a section:\nhome · about · skills · experience · education · projects · contact');
        if (!query) return;

        const sectionNames = ['home', 'about', 'skills', 'experience', 'education', 'projects', 'contact'];
        const match = sectionNames.find(s => s.startsWith(query.trim().toLowerCase()));

        if (match) {
            const target = document.getElementById(match);
            if (target) {
                const navHeight = navbar ? navbar.offsetHeight : 100;
                const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        } else {
            alert('❌ No section found.\nTry: home, about, skills, experience, education, projects, contact');
        }
    });
}


/* ============================================================
   20. NEWSLETTER FORM (Web3Forms)
   ============================================================ */
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn      = newsletterForm.querySelector('button[type="submit"]');
        const origHTML = btn ? btn.innerHTML : '';
        const formData = new FormData(newsletterForm);
        const json     = JSON.stringify(Object.fromEntries(formData));

        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-spinner"></i> Sending...';
            btn.disabled  = true;
        }

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json' 
                },
                body: json
            });

            const result = await res.json();

            if (res.status === 200) {
                if (btn) btn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
                newsletterForm.reset();
            } else {
                console.log('Newsletter Error:', result);
                if (btn) btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed';
            }
        } catch (err) {
            console.error('Newsletter Error:', err);
            if (btn) btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Error';
        } finally {
            setTimeout(() => {
                if (btn) {
                    btn.innerHTML = origHTML;
                    btn.disabled  = false;
                }
            }, 3000);
        }
    });
}


/* ============================================================
   DONE
   ============================================================ */
console.log('✅ Sanket Portfolio — All scripts loaded cleanly!');