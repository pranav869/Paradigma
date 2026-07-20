// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
const links = document.querySelectorAll('a, button');

document.addEventListener('mousemove', (e) => {
    // We use GSAP for smoother cursor movement
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
    });
});

// Entry Animation (Hero Section)
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.from('.hero-title span', {
        y: '100%',
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.1,
        opacity: 0
    })
        .from('.hero-sub', {
            opacity: 0,
            y: 20,
            duration: 1
        }, "-=1")
});

// Navbar Scroll Effect
const nav = document.querySelector('.navbar');
let lastScrollY = Math.max(window.scrollY, 0);
let pendingScrollY = lastScrollY;
let navbarTicking = false;

function updateNavbar(scrollY = pendingScrollY) {
    if (!nav) {
        navbarTicking = false;
        return;
    }

    const currentScrollY = Math.max(scrollY, 0);
    const scrollDelta = currentScrollY - lastScrollY;
    const isAtTop = currentScrollY === 0;
    const isPastThreshold = currentScrollY > 80;

    nav.classList.toggle('scrolled', isPastThreshold);

    if (isAtTop) {
        nav.classList.remove('hidden');
        lastScrollY = currentScrollY;
        navbarTicking = false;
        return;
    }

    if (Math.abs(scrollDelta) >= 5) {
        if (scrollDelta > 0 && currentScrollY > 20) {
            nav.classList.add('hidden');
        } else if (scrollDelta < 0) {
            nav.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
    }

    navbarTicking = false;
}

function scheduleNavbarUpdate(scrollY = window.scrollY) {
    pendingScrollY = scrollY;

    if (!navbarTicking) {
        requestAnimationFrame(() => updateNavbar());
        navbarTicking = true;
    }
}

window.addEventListener('scroll', () => scheduleNavbarUpdate(), { passive: true });

if (typeof lenis !== 'undefined' && lenis.on) {
    lenis.on('scroll', ({ scroll }) => scheduleNavbarUpdate(scroll));
}

updateNavbar();

// Parallax effects
gsap.utils.toArray('.parallax-bg').forEach(bg => {
    gsap.to(bg, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: bg.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// Mobile Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

function toggleMobileMenu() {
    if (!hamburger || !mobileMenu) return;

    const isActive = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);

    if (isActive) {
        lenis.stop();       // prevent background scrolling while menu is open
        document.body.style.overflow = 'hidden';
    } else {
        lenis.start();
        document.body.style.overflow = '';
    }
}

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when a link is clicked
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// --- Supabase Integration: Dynamic Content ---
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.supabaseClient) return; // Ensure Supabase is initialized

    const supabase = window.supabaseClient;

    // Load Settings
    async function loadSettings() {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 'site_settings')
            .maybeSingle();

        if (data) {
            if (data.companyName) {
                const footerName = document.getElementById('footer-company-name');
                if(footerName) footerName.textContent = data.companyName + '.';
                const navLogo = document.querySelector('.nav-logo');
                if(navLogo) navLogo.textContent = data.companyName + '.';
            }
            if (data.address) {
                const footerAddr = document.getElementById('footer-company-address');
                if(footerAddr) footerAddr.textContent = data.address;
            }
            
            // Social Links
            if (data.socialLinks) {
                updateSocialLink('link-instagram', data.socialLinks.instagram);
                updateSocialLink('link-linkedin', data.socialLinks.linkedin);
                updateSocialLink('link-pinterest', data.socialLinks.pinterest);
                updateSocialLink('link-twitter', data.socialLinks.twitter);
            }
        }
    }

    function updateSocialLink(id, url) {
        const el = document.getElementById(id);
        if (!el) return;
        if (url) {
            el.href = url;
            el.style.display = 'block';
            el.parentElement.style.display = 'block';
        } else {
            el.style.display = 'none';
            el.parentElement.style.display = 'none';
        }
    }

    // Load Projects
    async function loadProjects() {
        const projectsGrid = document.getElementById('dynamic-projects-grid');
        if (!projectsGrid) return;

        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('order', { ascending: true });
            
        projectsGrid.innerHTML = '';
        
        if (error || !projects || projects.length === 0) {
            projectsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-secondary);">No projects available.</p>';
            return;
        }

        projects.forEach((project) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <img src="${project.imageUrl || ''}" alt="${project.title || ''}">
                <div class="project-overlay">
                    <p class="project-category">${project.category || ''}</p>
                    <h3 class="project-title">${project.title || ''}</h3>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // Fetch initial data
    await loadSettings();
    await loadProjects();
});
