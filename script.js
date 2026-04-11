const canvas = document.getElementById('constellation-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 120;
const connectionDistance = 180;
const mouseConnectionDistance = 250;

let mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
        
        // Subtle mouse interaction - slow attraction/repulsion
        if (mouse.x !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                this.x -= dx * 0.005;
                this.y -= dy * 0.005;
            }
        }
    }

    draw() {
        ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(0, 229, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connections between particles
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                let opacity = 1 - (distance / connectionDistance);
                ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.15})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // Connection to mouse
        if (mouse.x !== null) {
            let dx = particles[i].x - mouse.x;
            let dy = particles[i].y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouseConnectionDistance) {
                let opacity = 1 - (distance / mouseConnectionDistance);
                ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.3})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
    const toggleMenu = (forceClose = false) => {
        const isOpen = forceClose ? false : !mobileMenu.classList.contains('open');
        menuToggle.classList.toggle('open', isOpen);
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    // Auto-close menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });
}
// Scroll Indicator Animation
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        // Fade out as we scroll down (fully gone by 300px)
        const opacity = Math.max(0, 1 - scrollPos / 300);
        scrollIndicator.style.opacity = opacity;
        
        // Also add a subtle parallax lift
        scrollIndicator.style.transform = `translateY(${scrollPos * 0.15}px)`;
        
        // Disable pointer events when near-invisible
        scrollIndicator.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
    });
}
// Custom Left Scrollbar Logic
const scrollThumb = document.getElementById('scrollbar-thumb');
const scrollTrack = document.querySelector('.scrollbar-track');

const updateScrollbar = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollPos = window.scrollY;

    const thumbHeight = Math.max(40, (clientHeight / scrollHeight) * clientHeight);
    const maxScroll = scrollHeight - clientHeight;
    const maxThumbMove = clientHeight - thumbHeight;
    
    // Calculate position accurately
    const scrollFraction = scrollPos / maxScroll;
    const thumbTop = scrollFraction * maxThumbMove;

    if (scrollThumb) {
        scrollThumb.style.height = `${thumbHeight}px`;
        scrollThumb.style.top = `${thumbTop}px`;
    }
};

window.addEventListener('scroll', updateScrollbar);
window.addEventListener('resize', updateScrollbar);
updateScrollbar();

// Click on track to scroll
if (scrollTrack && scrollThumb) {
    scrollTrack.addEventListener('click', (e) => {
        if (e.target === scrollThumb) return;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const thumbHeight = scrollThumb.offsetHeight;
        const clickY = e.clientY;
        
        // Calculate where to scroll to center the thumb on the click
        const scrollFraction = (clickY - thumbHeight / 2) / (clientHeight - thumbHeight);
        const targetScroll = scrollFraction * (scrollHeight - clientHeight);
        
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    });
}

// Draggable scrollbar functionality
let isDragging = false;
let startY, startScrollTop;

if (scrollThumb) {
    scrollThumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.pageY;
        startScrollTop = window.scrollY;
        document.body.style.userSelect = 'none';
        scrollThumb.style.background = '#fff';
    });
}

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const deltaY = e.pageY - startY;
    const scrollFactor = (scrollHeight - clientHeight) / (clientHeight - scrollThumb.offsetHeight);
    window.scrollTo(0, startScrollTop + deltaY * scrollFactor);
});

window.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = '';
        if (scrollThumb) scrollThumb.style.background = '';
    }
});

// ============================================================
// CONTACT FORM: Validation & Protocol
// ============================================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('email-input');
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Visual feedback reset
        formStatus.style.opacity = '1';
        formStatus.className = 'mt-4 font-mono text-[10px] uppercase tracking-widest text-center min-h-[1.5rem]';
        
        if (!email) {
            formStatus.innerText = 'ERROR: NULL_INPUT_DETECTED';
            formStatus.classList.add('text-red-500');
        } else if (!emailRegex.test(email)) {
            formStatus.innerText = 'ERROR: INVALID_FREQUENCY_PATTERN';
            formStatus.classList.add('text-red-500');
            emailInput.classList.add('border-red-500');
            setTimeout(() => emailInput.classList.remove('border-red-500'), 2000);
        } else {
            // Simulated encryption/sending
            formStatus.innerText = 'ENCRYPTING_PACKET...';
            formStatus.classList.add('text-primary');
            
            setTimeout(() => {
                formStatus.innerText = 'TRANSMISSION_SUCCESSFUL // SIGNAL_LOCKED';
                formStatus.classList.remove('text-primary');
                formStatus.classList.add('text-green-400');
                contactForm.reset();
                
                // Clear success message after delay
                setTimeout(() => {
                    formStatus.style.opacity = '0';
                }, 5000);
            }, 1200);
        }
    });
}

// ============================================================
// NAVIGATION: Scroll Spy (Active State Tracking)
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links .nav-link, .mobile-nav-links .nav-link');

const observerOptions = {
    // Threshold and rootMargin determine when a section is considered "active"
    // We focus on the upper section of the viewport for a natural transition
    threshold: [0.1, 0.5],
    rootMargin: '-20% 0px -40% 0px' 
};

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const activeId = entry.target.getAttribute('id');
            
            navLinks.forEach(link => {
                // Update active state based on section ID
                const isAnchorMatch = link.getAttribute('href') === `#${activeId}`;
                link.classList.toggle('active', isAnchorMatch);
            });
        }
    });
}, observerOptions);

sections.forEach(section => navObserver.observe(section));


