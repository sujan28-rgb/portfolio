/* ============================================
   SUJAN'S PORTFOLIO — JAVASCRIPT
   Premium Mouse Interactions Edition
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. CUSTOM CURSOR SYSTEM
    // ============================================
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    const cursorRing = document.createElement('div');
    cursorRing.classList.add('cursor-ring');
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let glowX = 0, glowY = 0;
    let isMouseMoving = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;

        // Dot follows instantly
        cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    // Smooth ring & glow follow using RAF
    function animateCursor() {
        // Lerp for smooth trailing
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;

        const ringWidth = cursorRing.offsetWidth;
        cursorRing.style.transform = `translate(${ringX - ringWidth / 2}px, ${ringY - ringWidth / 2}px)`;
        cursorGlow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover states
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .tag, .social-link');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover-active'));
    });

    // Cursor click animation
    document.addEventListener('mousedown', () => cursorRing.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursorRing.classList.remove('clicking'));


    // ============================================
    // 2. MOUSE TRAIL PARTICLES
    // ============================================
    const trailCount = 12;
    const trailDots = [];

    for (let i = 0; i < trailCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('trail-dot');
        dot.style.width = `${Math.max(2, 6 - i * 0.4)}px`;
        dot.style.height = `${Math.max(2, 6 - i * 0.4)}px`;
        dot.style.opacity = `${0.4 - (i * 0.03)}`;
        document.body.appendChild(dot);
        trailDots.push({ el: dot, x: 0, y: 0 });
    }

    let trailTimer = null;
    function animateTrail() {
        let prevX = mouseX, prevY = mouseY;
        trailDots.forEach((dot, i) => {
            const speed = 0.3 - (i * 0.015);
            dot.x += (prevX - dot.x) * speed;
            dot.y += (prevY - dot.y) * speed;
            dot.el.style.transform = `translate(${dot.x - 3}px, ${dot.y - 3}px)`;
            prevX = dot.x;
            prevY = dot.y;
        });
        trailTimer = requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Show/hide trail on mouse enter/leave
    document.addEventListener('mouseenter', () => {
        trailDots.forEach((dot, i) => {
            dot.el.style.opacity = `${0.4 - (i * 0.03)}`;
        });
    });
    document.addEventListener('mouseleave', () => {
        trailDots.forEach(dot => {
            dot.el.style.opacity = '0';
        });
    });


    // ============================================
    // 3. 3D TILT EFFECT ON PROJECT CARDS
    // ============================================
    const projectCards = document.querySelectorAll('.project-card');

    // Add shine overlay element to each card
    projectCards.forEach(card => {
        const shine = document.createElement('div');
        shine.classList.add('project-card__shine');
        card.appendChild(shine);
    });

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Tilt calculation (max ±8 degrees)
            const tiltX = ((y - centerY) / centerY) * -8;
            const tiltY = ((x - centerX) / centerX) * 8;

            // Apply 3D transform
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Update CSS custom properties for gradient spotlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            card.classList.add('tilt-active');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.classList.remove('tilt-active');
        });
    });


    // ============================================
    // 4. SKILL ITEMS — MOUSE SPOTLIGHT
    // ============================================
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    // ============================================
    // 5. MAGNETIC BUTTONS
    // ============================================
    const magneticElements = document.querySelectorAll('.btn, .social-link, .theme-toggle, .logo-letter');
    const magnetStrength = 0.35;

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * magnetStrength}px, ${y * magnetStrength}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s ease-out';
        });
    });


    // ============================================
    // 6. BUTTON RIPPLE ON CLICK
    // ============================================
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });


    // ============================================
    // 7. HERO PARALLAX ON MOUSE MOVE
    // ============================================
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero__content');
    const heroCodeWindow = document.querySelector('.hero__code-window');
    const heroBlob = document.querySelector('.hero__blob');

    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            // Text moves subtly opposite to mouse
            if (heroContent) {
                heroContent.style.transform = `translate(${x * -15}px, ${y * -10}px)`;
            }

            // Code window tilts toward mouse
            if (heroCodeWindow) {
                heroCodeWindow.style.transform = `translate(${x * 25}px, ${y * 20}px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
            }

            // Blob follows mouse smoothly
            if (heroBlob) {
                heroBlob.style.transform = `translate(${x * 60}px, ${y * 60}px)`;
            }
        });

        hero.addEventListener('mouseleave', () => {
            if (heroContent) heroContent.style.transform = '';
            if (heroCodeWindow) heroCodeWindow.style.transform = '';
            if (heroBlob) heroBlob.style.transform = '';
        });
    }


    // ============================================
    // 8. INTERACTIVE FLOATING PARTICLES (Canvas)
    // ============================================
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 50;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.3 + 0.05;
            this.maxOpacity = this.opacity;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction — particles gently repel from cursor
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x += (dx / dist) * force * 1.5;
                this.y += (dy / dist) * force * 1.5;
                this.opacity = Math.min(this.maxOpacity + 0.15, 0.5);
            } else {
                this.opacity += (this.maxOpacity - this.opacity) * 0.02;
            }

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(13, 211, 168, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw connecting lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(13, 211, 168, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw lines from cursor to nearby particles
        particles.forEach(p => {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200) {
                const opacity = (1 - dist / 200) * 0.2;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(13, 211, 168, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // ============================================
    // 9. CLICK BURST EFFECT
    // ============================================
    document.addEventListener('click', (e) => {
        createClickBurst(e.clientX, e.clientY);
    });

    function createClickBurst(x, y) {
        const burstCount = 8;
        for (let i = 0; i < burstCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: var(--clr-accent);
                pointer-events: none;
                z-index: 10002;
                left: ${x}px;
                top: ${y}px;
            `;
            document.body.appendChild(particle);

            const angle = (i / burstCount) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const targetX = Math.cos(angle) * velocity;
            const targetY = Math.sin(angle) * velocity;

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${targetX}px, ${targetY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 500 + Math.random() * 300,
                easing: 'cubic-bezier(0, 0.55, 0.45, 1)',
                fill: 'forwards'
            }).onfinish = () => particle.remove();
        }
    }


    // ============================================
    // 10. FLOATING HERO DOTS (mouse reactive)
    // ============================================
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('hero__floating-dots');
        heroSection.appendChild(dotsContainer);

        for (let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            dot.classList.add('floating-dot');
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.top = `${Math.random() * 100}%`;
            dot.style.setProperty('--dx', `${(Math.random() - 0.5) * 200}px`);
            dot.style.setProperty('--dy', `${(Math.random() - 0.5) * 200}px`);
            dot.style.animationDelay = `${Math.random() * 15}s`;
            dot.style.animationDuration = `${10 + Math.random() * 10}s`;
            dotsContainer.appendChild(dot);
        }
    }


    // ============================================
    // ORIGINAL FEATURES (kept)
    // ============================================

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
    });

    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));

    // ===== MOBILE NAV =====
    const hamburger = document.getElementById('navHamburger');
    const navList = document.querySelector('.nav__list');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navList.classList.toggle('open');
        document.body.style.overflow = navList.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navList.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ===== SCROLL ANIMATIONS =====
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .about__text p');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== PLACEHOLDER IMAGES =====
    const projectImages = document.querySelectorAll('.project-card__image img');
    const placeholderColors = [
        { bg: '#1a2332', accent: '#0dd3a8' },
        { bg: '#2a1a2e', accent: '#c792ea' },
        { bg: '#1a2a1e', accent: '#c3e88d' },
        { bg: '#2a2218', accent: '#ffcb6b' }
    ];

    projectImages.forEach((img, index) => {
        const colors = placeholderColors[index % placeholderColors.length];
        const projectNum = index + 1;

        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
            <defs>
                <linearGradient id="grad${projectNum}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${colors.accent}22;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="800" height="500" fill="url(#grad${projectNum})" rx="0"/>
            <rect x="60" y="40" width="680" height="420" rx="12" fill="${colors.bg}" stroke="${colors.accent}33" stroke-width="1.5"/>
            <rect x="60" y="40" width="680" height="40" rx="12" fill="${colors.accent}15"/>
            <rect x="60" y="68" width="680" height="12" rx="0" fill="${colors.accent}15"/>
            <circle cx="85" cy="60" r="6" fill="#ff5f57"/>
            <circle cx="105" cy="60" r="6" fill="#febc2e"/>
            <circle cx="125" cy="60" r="6" fill="#28c840"/>
            <rect x="200" y="50" width="400" height="20" rx="10" fill="${colors.accent}10" stroke="${colors.accent}20" stroke-width="1"/>
            <rect x="90" y="110" width="300" height="24" rx="4" fill="${colors.accent}30"/>
            <rect x="90" y="148" width="220" height="12" rx="3" fill="${colors.accent}15"/>
            <rect x="90" y="168" width="260" height="12" rx="3" fill="${colors.accent}15"/>
            <rect x="90" y="188" width="180" height="12" rx="3" fill="${colors.accent}15"/>
            <rect x="90" y="224" width="120" height="36" rx="18" fill="${colors.accent}" opacity="0.8"/>
            <rect x="225" y="224" width="100" height="36" rx="18" fill="none" stroke="${colors.accent}66" stroke-width="1.5"/>
            <rect x="440" y="110" width="270" height="180" rx="8" fill="${colors.accent}12" stroke="${colors.accent}20" stroke-width="1"/>
            <rect x="90" y="300" width="190" height="130" rx="8" fill="${colors.accent}10" stroke="${colors.accent}15" stroke-width="1"/>
            <rect x="305" y="300" width="190" height="130" rx="8" fill="${colors.accent}10" stroke="${colors.accent}15" stroke-width="1"/>
            <rect x="520" y="300" width="190" height="130" rx="8" fill="${colors.accent}10" stroke="${colors.accent}15" stroke-width="1"/>
            <rect x="105" y="320" width="100" height="10" rx="3" fill="${colors.accent}25"/>
            <rect x="105" y="340" width="160" height="8" rx="2" fill="${colors.accent}12"/>
            <rect x="105" y="354" width="140" height="8" rx="2" fill="${colors.accent}12"/>
            <rect x="320" y="320" width="100" height="10" rx="3" fill="${colors.accent}25"/>
            <rect x="320" y="340" width="160" height="8" rx="2" fill="${colors.accent}12"/>
            <rect x="320" y="354" width="140" height="8" rx="2" fill="${colors.accent}12"/>
            <rect x="535" y="320" width="100" height="10" rx="3" fill="${colors.accent}25"/>
            <rect x="535" y="340" width="160" height="8" rx="2" fill="${colors.accent}12"/>
            <rect x="535" y="354" width="140" height="8" rx="2" fill="${colors.accent}12"/>
        </svg>`;

        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        img.src = url;
        img.style.display = 'block';
    });

});
