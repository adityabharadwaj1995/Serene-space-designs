// script.js
gsap.registerPlugin(ScrollTrigger);

// Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Hero entrance
gsap.from(".hero-title", {
    y: 120,
    opacity: 0,
    duration: 1.8,
    ease: "power4.out",
    delay: 0.4
});

gsap.from(".hero-subtitle", {
    y: 60,
    opacity: 0,
    duration: 1.4,
    ease: "power3.out",
    delay: 0.9
});

// Section reveals
document.querySelectorAll('.section').forEach((section, i) => {
    gsap.from(section, {
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });
});

// Project hover interactions already in CSS but enhanced with JS if needed
console.log("%cSerene Space Designs — Premium Spatial Experience Loaded", "color:#8c7a5f; font-family:monospace; font-size:10px");

// Mobile optimizations
if (window.innerWidth < 768) {
    // Reduce animation intensity if needed
    console.log("Mobile view optimized");
}
