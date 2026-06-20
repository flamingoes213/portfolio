/**
 * Aria Emira Portfolio - Core Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize functions
    initNetworkBackground();
    initTheme();
    initMobileNav();
    initTypingAnimation();
    initScrollObserver();
    initTabs();
    initProjectFilter();
    initProjectModal();
    initContactForm();
});

/* ==========================================================================
   THEME TOGGLER (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    let currentTheme = 'dark';
    if (savedTheme) {
        currentTheme = savedTheme;
    } else if (systemPrefersLight) {
        currentTheme = 'light';
    }
    
    htmlElement.setAttribute('data-theme', currentTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const theme = htmlElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ==========================================================================
   MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    
    // Hamburger trigger toggle
    mobileToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isActive);
    });
    
    // Close nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close nav when clicking outside the menu
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Header scroll background behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   SELF-TYPING TEXT ANIMATION
   ========================================================================== */
function initTypingAnimation() {
    const typingTextEl = document.getElementById('typing-text');
    if (!typingTextEl) return;

    const phrases = [
        'Cybersecurity Solutions.',
        'Python Network Scripts.',
        'Linux Security Systems.',
        'Secure Networks.'
    ];
    
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;
    let delay = 100; // Type speed base

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingTextEl.textContent = currentPhrase.substring(0, characterIndex - 1);
            characterIndex--;
            delay = 50; // Deleting speed is faster
        } else {
            typingTextEl.textContent = currentPhrase.substring(0, characterIndex + 1);
            characterIndex++;
            delay = 100; // Typings speed
        }
        
        // Pause at completion
        if (!isDeleting && characterIndex === currentPhrase.length) {
            isDeleting = true;
            delay = 2000; // Hold full sentence for 2s
        } else if (isDeleting && characterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 500; // Pause before typing next phrase
        }
        
        setTimeout(type, delay);
    }
    
    setTimeout(type, 1000);
}

/* ==========================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollObserver() {
    const revealElements = document.querySelectorAll('.reveal');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    // Observer for reveal fade-in layout elements
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => observer.observe(el));

    // Active Navigation Highlighting on Scroll
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* ==========================================================================
   BIOGRAPHY SECTION TABS
   ========================================================================== */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active status to selected tab btn
            btn.classList.add('active');
            
            // Get target pane ID
            const targetId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   PROJECTS FILTER GRID
   ========================================================================== */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Change active button style
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add temporary fading transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 200);
            });
        });
    });
}

/* ==========================================================================
   PROJECT MODALS (CASE STUDY DETAILS)
   ========================================================================== */
const projectData = {
    "1": {
        title: "TCP Port Scanner",
        category: "Python Script",
        gradient: "prj-grad-1",
        description: "A fast, multi-threaded port scanner built in Python using raw sockets. Renders socket-based scanning protocols to map active port connection states on target machines, providing clean terminal logs.",
        technologies: ["Python", "Socket Module", "Threading Library", "CLI Output"],
        features: [
            "Initiates connections using standard TCP handshake protocols.",
            "Implements multi-threading capabilities to scan up to 1024 ports in under 3 seconds.",
            "Validates user inputs (IP ranges / Hostnames) with regex structures.",
            "Supports scanning speed adjustments to dodge basic IDPS rate-limiting."
        ],
        github: "https://github.com",
        demo: "https://github.com"
    },
    "2": {
        title: "Basic Network Scanner",
        category: "Python Script",
        gradient: "prj-grad-2",
        description: "An ARP request reconnaissance utility that scans local subnets to discover active hosts. Renders hostnames, active IP ranges, and MAC address profiles to help analyze subnet node densities.",
        technologies: ["Python", "Scapy / Sockets", "Subnetting Basics", "ARP Protocols"],
        features: [
            "Broadcasts ARP requests across targets to identify active hardware addresses.",
            "Formats network interface reports in readable CLI tables.",
            "Resolves local hostnames from IP nodes.",
            "Optimized scanning loops designed to conserve network bandwidth."
        ],
        github: "https://github.com",
        demo: "https://github.com"
    },
    "3": {
        title: "Linux Security Hardening Lab",
        category: "Security Lab",
        gradient: "prj-grad-3",
        description: "A secure virtual baseline configuration mapping security policies, firewall constraints, and system audits on Ubuntu nodes. Configures services filters and log analysis triggers to mitigate host vulnerabilities.",
        technologies: ["Linux CLI", "UFW Firewalls", "SSH Key Pair Auth", "Syslog Systems"],
        features: [
            "Restructures SSH services filters (disabling root login, enforcing key pairs).",
            "Configures UFW state rules (limiting access parameters, closing unused ports).",
            "Sets up automatic updates (unattended-upgrades) and system audits rules.",
            "Drafts custom syslog alerts to trace brute force attempt occurrences."
        ],
        github: "https://github.com",
        demo: "https://github.com"
    },
    "4": {
        title: "Active Directory Lab",
        category: "Upcoming Lab Focus",
        gradient: "prj-grad-4",
        description: "A planned local forest simulation to study Windows domain controllers administration, group policies setup, privilege escalation paths, and Active Directory threat analysis.",
        technologies: ["Windows Server", "Active Directory DS", "Group Policy Object", "Virtualization"],
        features: [
            "Construct a local Domain Controller node in VirtualBox host networks.",
            "Apply Group Policy constraints mapping access roles permissions.",
            "Configure logs collection via Event Viewer to identify lateral movement logs.",
            "Study privilege abuse vector mechanisms (Kerberoasting, Pass-the-Hash)."
        ],
        github: "https://github.com",
        demo: "https://github.com"
    }
};

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-body-content');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Open modal click handler
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-project-id');
            const data = projectData[id];
            
            if (data) {
                // Populate modal content
                const techTagsHTML = data.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
                const featuresHTML = data.features.map(feat => `<li>${feat}</li>`).join('');
                
                modalContent.innerHTML = `
                    <div class="modal-prj-img ${data.gradient}"></div>
                    <span class="modal-tag">${data.category}</span>
                    <h3 class="modal-title">${data.title}</h3>
                    <p class="modal-desc">${data.description}</p>
                    
                    <h4 class="modal-subtitle">Technologies Utilized</h4>
                    <div class="modal-tech-list">${techTagsHTML}</div>
                    
                    <h4 class="modal-subtitle">Key Features Built</h4>
                    <ul class="modal-features-list">${featuresHTML}</ul>
                    
                    <div class="modal-links">
                        <a href="${data.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                            <span>Visit Live Demo</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                            <span>Source Code</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        </a>
                    </div>
                `;
                
                // Show modal overlay
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // lock background scrolling
                
                // Set focus to close button for accessibility
                setTimeout(() => modalCloseBtn.focus(), 100);
            }
        });
    });
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // restore scrolling
    }
    
    modalCloseBtn.addEventListener('click', closeModal);
    
    // Close when clicking outside of modal content window
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    });
    
    // Keyboard accessibility ESC closer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   CONTACT FORM & UTILITY ACTIONS
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successAlert = document.getElementById('form-success-alert');
    const submitBtn = document.getElementById('submit-btn');
    
    // Elements Copy Email utility
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailValue = document.getElementById('contact-email').textContent;
    const tooltipText = copyEmailBtn.querySelector('.tooltip');
    
    copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(emailValue).then(() => {
            // Update tooltip feedback
            tooltipText.textContent = "Copied!";
            
            setTimeout(() => {
                tooltipText.textContent = "Copy";
            }, 2000);
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    });

    if (!form) return;

    // Email address simple regex validator helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            const formGroup = input.parentElement;
            
            // Check empty cases
            if (!input.value.trim()) {
                formGroup.classList.add('invalid');
                isValid = false;
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                // Email format check
                formGroup.classList.add('invalid');
                isValid = false;
            } else {
                formGroup.classList.remove('invalid');
            }
            
            // Remove error styling on keydown input typing
            input.addEventListener('input', () => {
                formGroup.classList.remove('invalid');
            });
        });

        if (isValid) {
            // Change submit button status visually to simulate loading state
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span>`;
            
            setTimeout(() => {
                // Hide Form and reveal success panel card
                form.classList.add('hidden');
                successAlert.classList.remove('hidden');
                
                // Reset form inputs
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }, 1200);
        }
    });
}

/* ==========================================================================
   LIVE NETWORK BACKGROUND CANVAS — Red Nodes / Interactive Mouse
   ========================================================================== */
function initNetworkBackground() {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // ── Config ──────────────────────────────────────────────────────────────
    const CFG = {
        count:     72,       // number of nodes
        maxDist:   155,      // max distance for node-to-node line
        mouseDist: 230,      // max distance for node-to-mouse line
        speed:     0.38,     // base movement speed
        minR:      1.5,      // min node radius
        maxR:      3.5,      // max node radius
        r: 210, g: 20, b: 20,      // node / line color (deep crimson red)
        mr: 255, mg: 60, mb: 60,   // mouse-interactive line color (bright red)
    };

    let W = 0, H = 0, nodes = [], tick = 0;
    const mouse = { x: -9999, y: -9999 };

    // ── Resize ───────────────────────────────────────────────────────────────
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    // ── Node class ───────────────────────────────────────────────────────────
    class Node {
        constructor() {
            this.x         = Math.random() * W;
            this.y         = Math.random() * H;
            this.vx        = (Math.random() - 0.5) * CFG.speed * 2;
            this.vy        = (Math.random() - 0.5) * CFG.speed * 2;
            this.r         = CFG.minR + Math.random() * (CFG.maxR - CFG.minR);
            this.baseAlpha = 0.2 + Math.random() * 0.35;
            this.phase     = Math.random() * Math.PI * 2;
            this.pulse     = 0.006 + Math.random() * 0.02;
            this.alpha     = this.baseAlpha;
        }

        update(t) {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx = -this.vx;
            if (this.y < 0 || this.y > H) this.vy = -this.vy;
            this.alpha = this.baseAlpha + Math.sin(t * this.pulse + this.phase) * 0.1;
        }

        draw() {
            const { r, g, b } = CFG;
            const a = this.alpha;

            // Outer soft glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r * 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${(a * 0.06).toFixed(3)})`;
            ctx.fill();

            // Mid glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r * 2.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${(a * 0.2).toFixed(3)})`;
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(a + 0.35, 0.92).toFixed(3)})`;
            ctx.fill();
        }
    }

    // ── Init nodes ───────────────────────────────────────────────────────────
    function init() {
        nodes = [];
        for (let i = 0; i < CFG.count; i++) nodes.push(new Node());
    }

    // ── Draw connection lines ─────────────────────────────────────────────────
    function drawLines() {
        const { r, g, b, mr, mg, mb, maxDist, mouseDist } = CFG;

        for (let i = 0; i < nodes.length; i++) {
            const ni = nodes[i];

            // Node ↔ node lines
            for (let j = i + 1; j < nodes.length; j++) {
                const nj   = nodes[j];
                const dist = Math.hypot(ni.x - nj.x, ni.y - nj.y);
                if (dist < maxDist) {
                    const t = 1 - dist / maxDist;
                    ctx.beginPath();
                    ctx.moveTo(ni.x, ni.y);
                    ctx.lineTo(nj.x, nj.y);
                    ctx.strokeStyle = `rgba(${r},${g},${b},${(t * t * 0.55).toFixed(3)})`;
                    ctx.lineWidth   = t * 1.4;
                    ctx.stroke();
                }
            }

            // Node ↔ mouse lines (interactive)
            const md = Math.hypot(ni.x - mouse.x, ni.y - mouse.y);
            if (md < mouseDist) {
                const mt = 1 - md / mouseDist;
                ctx.beginPath();
                ctx.moveTo(ni.x, ni.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(${mr},${mg},${mb},${(mt * 0.85).toFixed(3)})`;
                ctx.lineWidth   = mt * 2;
                ctx.stroke();
            }
        }
    }

    // ── Animation loop ────────────────────────────────────────────────────────
    function animate() {
        ctx.clearRect(0, 0, W, H);
        tick++;
        drawLines();
        nodes.forEach(n => { n.update(tick); n.draw(); });
        requestAnimationFrame(animate);
    }

    // ── Mouse / touch tracking (on document since canvas has pointer-events: none)
    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // Touch support for mobile
    document.addEventListener('touchmove', e => {
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
    }, { passive: true });
    document.addEventListener('touchend', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // ── Start ─────────────────────────────────────────────────────────────────
    resize();
    init();
    animate();

    window.addEventListener('resize', () => { resize(); init(); });
}
