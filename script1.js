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