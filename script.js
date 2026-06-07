// ============================================
// SERENE SPACE DESIGNS - EXPERIENCE ENGINE
// ============================================

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: true,
    touchMultiplier: 1.5,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ---- HERO SECTION ANIMATION ----
function heroAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroImage = document.querySelector('.hero-image');

    // Title entrance
    gsap.from(heroTitle, {
        duration: 1.2,
        y: 50,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.2,
    });

    // Subtitle entrance
    gsap.from(heroSubtitle, {
        duration: 1.2,
        y: 30,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.4,
    });

    // Image entrance
    gsap.from(heroImage, {
        duration: 1.8,
        scale: 1.05,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.1,
    });
}

// ---- SERVICE BLOCKS ANIMATION ----
function serviceAnimation() {
    const serviceBlocks = document.querySelectorAll('.service-block');

    serviceBlocks.forEach((block, index) => {
        ScrollTrigger.create({
            trigger: block,
            onEnter: () => {
                gsap.to(block, {
                    duration: 0.8,
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out',
                });
            },
        });

        gsap.set(block, { opacity: 0, y: 30 });
    });
}

// ---- PROJECT REVEALS ANIMATION ----
function projectAnimation() {
    const projects = document.querySelectorAll('.project');

    projects.forEach((project, index) => {
        const projectImage = project.querySelector('.project-image img');

        ScrollTrigger.create({
            trigger: project,
            onEnter: () => {
                // Reveal project container
                gsap.to(project, {
                    duration: 0.8,
                    opacity: 1,
                    ease: 'power2.out',
                });

                // Image scale effect
                gsap.to(projectImage, {
                    duration: 1.4,
                    scale: 1,
                    ease: 'power2.out',
                });
            },
        });

        gsap.set(project, { opacity: 0 });
        gsap.set(projectImage, { scale: 1.08 });
    });
}

// ---- PROCESS STAGES ANIMATION ----
function processAnimation() {
    const stages = document.querySelectorAll('.process-stage');

    stages.forEach((stage, index) => {
        ScrollTrigger.create({
            trigger: stage,
            onEnter: () => {
                gsap.to(stage, {
                    duration: 0.8,
                    opacity: 1,
                    ease: 'power2.out',
                });
            },
        });

        gsap.set(stage, { opacity: 0 });
    });
}

// ---- MATERIAL ITEMS ANIMATION ----
function materialAnimation() {
    const materialItems = document.querySelectorAll('.material-item');

    materialItems.forEach((item, index) => {
        ScrollTrigger.create({
            trigger: item,
            onEnter: () => {
                gsap.to(item, {
                    duration: 0.7,
                    opacity: 1,
                    ease: 'power2.out',
                    delay: index * 0.1,
                });
            },
        });

        gsap.set(item, { opacity: 0 });
    });
}

// ---- TESTIMONIALS ANIMATION ----
function testimonialAnimation() {
    const testimonials = document.querySelectorAll('.testimonial');

    testimonials.forEach((testimonial, index) => {
        ScrollTrigger.create({
            trigger: testimonial,
            onEnter: () => {
                gsap.to(testimonial, {
                    duration: 0.8,
                    opacity: 1,
                    ease: 'power2.out',
                    delay: index * 0.15,
                });
            },
        });

        gsap.set(testimonial, { opacity: 0 });
    });
}

// ---- SCROLL INDICATOR ANIMATION ----
function scrollIndicatorAnimation() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');

    // Fade out scroll indicator as user scrolls
    ScrollTrigger.create({
        trigger: '.philosophy',
        onEnter: () => {
            gsap.to(scrollIndicator, {
                duration: 0.6,
                opacity: 0,
                pointerEvents: 'none',
                ease: 'power2.out',
            });
        },
        onLeaveBack: () => {
            gsap.to(scrollIndicator, {
                duration: 0.6,
                opacity: 1,
                pointerEvents: 'auto',
                ease: 'power2.out',
            });
        },
    });
}

// ---- CLOSING SECTION ENTRANCE ----
function closingAnimation() {
    const closingTitle = document.querySelector('.closing-title');
    const closingSubtitle = document.querySelector('.closing-subtitle');
    const ctaButton = document.querySelector('.cta-button');

    ScrollTrigger.create({
        trigger: '.closing',
        onEnter: () => {
            gsap.fromTo(
                closingTitle,
                { y: 30, opacity: 0 },
                { duration: 1, y: 0, opacity: 1, ease: 'power2.out' }
            );

            gsap.fromTo(
                closingSubtitle,
                { y: 20, opacity: 0 },
                { duration: 1, y: 0, opacity: 1, ease: 'power2.out', delay: 0.2 }
            );

            gsap.fromTo(
                ctaButton,
                { y: 20, opacity: 0 },
                { duration: 1, y: 0, opacity: 1, ease: 'power2.out', delay: 0.4 }
            );
        },
    });
}

// ---- CTA BUTTON HOVER EFFECT ----
function ctaHoverEffect() {
    const ctaButton = document.querySelector('.cta-button');

    ctaButton.addEventListener('mouseenter', function () {
        gsap.to(this, {
            duration: 0.4,
            scale: 1.05,
            ease: 'power2.out',
        });
    });

    ctaButton.addEventListener('mouseleave', function () {
        gsap.to(this, {
            duration: 0.4,
            scale: 1,
            ease: 'power2.out',
        });
    });
}

// ---- MATERIAL HOVER EFFECT ----
function materialHoverEffect() {
    const materialItems = document.querySelectorAll('.material-item');

    materialItems.forEach((item) => {
        item.addEventListener('mouseenter', function () {
            gsap.to(this, {
                duration: 0.4,
                y: -8,
                ease: 'power2.out',
            });
        });

        item.addEventListener('mouseleave', function () {
            gsap.to(this, {
                duration: 0.4,
                y: 0,
                ease: 'power2.out',
            });
        });
    });
}

// ---- SMOOTH SCROLL RESTORATION ----
function scrollRestoration() {
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
}

// ---- INTERSECTION OBSERVER FOR LAZY LOADING ----
function lazyLoadImages() {
    const imageElements = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                observer.unobserve(img);
            }
        });
    });

    imageElements.forEach((img) => imageObserver.observe(img));
}

// ---- MOBILE OPTIMIZATION ----
function mobileOptimization() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
        // Reduce animation complexity on mobile
        document.documentElement.style.setProperty('--transition-smooth', '0.4s');
        document.documentElement.style.setProperty('--transition-slow', '0.8s');

        // Reduce parallax and complex motion
        const projectImages = document.querySelectorAll('.project-image img');
        projectImages.forEach((img) => {
            gsap.set(img, { scale: 1 });
        });
    }
}

// ---- PERFORMANCE OPTIMIZATION ----
function performanceOptimization() {
    // Disable animations if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        gsap.globalTimeline.timeScale(0);
    }

    // Use requestIdleCallback for non-critical animations
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            ScrollTrigger.refresh();
        });
    }
}

// ---- INITIALIZE ALL ANIMATIONS ----
function initializeAnimations() {
    heroAnimation();
    serviceAnimation();
    projectAnimation();
    processAnimation();
    materialAnimation();
    testimonialAnimation();
    scrollIndicatorAnimation();
    closingAnimation();
    ctaHoverEffect();
    materialHoverEffect();
    lazyLoadImages();
    mobileOptimization();
    performanceOptimization();

    // Refresh ScrollTrigger after all elements are loaded
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
}

// ---- DOM READY ----
document.addEventListener('DOMContentLoaded', () => {
    scrollRestoration();
    initializeAnimations();
});

// ---- HANDLE WINDOW RESIZE ----
window.addEventListener('resize', () => {
    lenis.resize();
    ScrollTrigger.refresh();
});

// ---- SMOOTH ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                lenis.scrollTo(target);
            }
        }
    });
});
