/* ──────────────────────────────────────────────────────────────
   SERENE SPACE DESIGNS — script.js
   Motion philosophy:
     · One major motion idea per section
     · Heavy, slow, intentional easing
     · Scrolling quality > effects
     · Reduced motion is fully respected
   ────────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_TOUCH = matchMedia('(pointer: coarse)').matches;
  const IS_MOBILE = window.innerWidth < 900;

  /* ── Wait for libs (GSAP/Lenis loaded with defer) ────────── */
  const ready = () => new Promise((resolve) => {
    const tick = () => {
      if (window.gsap && window.ScrollTrigger && window.Lenis) return resolve();
      requestAnimationFrame(tick);
    };
    tick();
  });

  /* ── Bootstrap once DOM & libs are ready ─────────────────── */
  const start = async () => {
    await ready();

    const { gsap } = window;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    /* ──────────────────────────────────────────────────────
       1) LENIS — smooth, buttery, never traps the scroll
       ────────────────────────────────────────────────────── */
    let lenis = null;
    if (!REDUCE) {
      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false, // never on touch — preserves native momentum
        wheelMultiplier: 0.95,
        touchMultiplier: 1.2,
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    /* ──────────────────────────────────────────────────────
       2) LOADER — slow count, single line draw
       ────────────────────────────────────────────────────── */
    const loader     = document.querySelector('[data-loader]');
    const loaderNum  = document.querySelector('[data-loader-count]');
    const loaderLine = document.querySelector('[data-loader-line]');

    const finishLoader = () => {
      document.body.classList.add('is-loaded');
      ScrollTrigger.refresh();
      // kick off hero entrance after the curtain lifts
      requestAnimationFrame(playHero);
    };

    if (REDUCE) {
      finishLoader();
    } else {
      const tl = gsap.timeline({ onComplete: finishLoader });
      const o = { v: 0 };
      tl.to(o, {
        v: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => { if (loaderNum) loaderNum.textContent = Math.round(o.v); }
      }, 0);
      tl.fromTo(loaderLine, { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: 'power2.inOut' }, 0);
      tl.to(loader, { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '+=0.2');
    }

    /* ──────────────────────────────────────────────────────
       3) SPLIT helpers — words / lines
          (No external SplitText dep — minimal, accessible)
       ────────────────────────────────────────────────────── */
    const splitWords = (el) => {
      if (el.dataset.split === 'done') return [...el.querySelectorAll('.w')];
      const html = el.innerHTML;
      // Tokenise by whitespace while preserving tags (em, br)
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const out = [];
      const walk = (node, parent) => {
        node.childNodes.forEach((c) => {
          if (c.nodeType === 3) {
            const frag = document.createDocumentFragment();
            c.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/\s+/.test(part)) {
                frag.appendChild(document.createTextNode(part));
              } else {
                const w = document.createElement('span');
                w.className = 'w';
                w.style.display = 'inline-block';
                w.style.willChange = 'transform, opacity';
                w.textContent = part;
                frag.appendChild(w);
                out.push(w);
              }
            });
            parent.replaceChild(frag, c);
          } else if (c.nodeType === 1) {
            if (c.tagName === 'BR') return;
            walk(c, c);
          }
        });
      };
      walk(tmp, tmp);
      el.innerHTML = tmp.innerHTML;
      el.dataset.split = 'done';
      return [...el.querySelectorAll('.w')];
    };

    const splitLines = (el) => {
      // Lines = wrap each <br>-separated chunk in a clip mask
      if (el.dataset.split === 'done') return [...el.querySelectorAll('.l-inner')];
      const html = el.innerHTML;
      const lines = html.split(/<br\s*\/?>/i);
      el.innerHTML = lines.map((line) => (
        `<span class=\"l\" style=\"display:block;overflow:hidden;padding-bottom:0.06em;\">
           <span class=\"l-inner\" style=\"display:block;will-change:transform,opacity;\">${line.trim()}</span>
         </span>`
      )).join('');
      el.dataset.split = 'done';
      return [...el.querySelectorAll('.l-inner')];
    };

    /* ──────────────────────────────────────────────────────
       4) HERO entrance — single coordinated breath
       ────────────────────────────────────────────────────── */
    function playHero() {
      if (REDUCE) return;
      const hero = document.querySelector('.hero');
      if (!hero) return;

      const headline = hero.querySelector('[data-split]');
      const lines = headline ? splitLines(headline) : [];
      const eyebrow = hero.querySelector('.eyebrow');
      const sub = hero.querySelector('.hero__sub');
      const meta = hero.querySelector('.hero__meta');
      const scrl = hero.querySelector('.hero__scroll');
      const img  = hero.querySelector('[data-hero-image]');

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.fromTo(img, { scale: 1.3, opacity: 0 }, { scale: 1.18, opacity: 1, duration: 2.0, ease: 'expo.out' }, 0);

      if (eyebrow) tl.fromTo(eyebrow, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, 0.35);

      if (lines.length) tl.fromTo(lines,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.6, stagger: 0.12, ease: 'expo.out' },
        0.45
      );

      if (sub)  tl.fromTo(sub,  { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 0.95);
      if (meta) tl.fromTo(meta, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, 1.10);
      if (scrl) tl.fromTo(scrl, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, 1.20);
    }

    /* ──────────────────────────────────────────────────────
       5) HERO image — gentle parallax & zoom-out on scroll
       ────────────────────────────────────────────────────── */
    if (!REDUCE) {
      const heroImg = document.querySelector('[data-hero-image]');
      if (heroImg) {
        gsap.to(heroImg, {
          yPercent: 14,
          scale: 1.04,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }
    }

    /* ──────────────────────────────────────────────────────
       6) Generic reveals — lines, words, [data-reveal]
       ────────────────────────────────────────────────────── */
    if (!REDUCE) {
      // Headlines: split + line reveal on entry
      document.querySelectorAll('[data-split]').forEach((el) => {
        if (el.closest('.hero')) return; // hero is bespoke
        const mode = el.dataset.splitMode || 'lines';
        const targets = mode === 'words' ? splitWords(el) : splitLines(el);
        gsap.set(targets, { yPercent: 110, opacity: 0 });

        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(targets, {
              yPercent: 0,
              opacity: 1,
              duration: 1.4,
              ease: 'expo.out',
              stagger: mode === 'words' ? 0.025 : 0.10,
            });
          },
        });
      });

      // [data-reveal] — quiet fade/translate
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay || 0);
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(el, {
              y: 0, opacity: 1,
              duration: 1.2, ease: 'expo.out', delay,
            });
          },
        });
      });
    } else {
      // Reduced motion: just make sure things are visible
      gsap.set('[data-reveal]', { clearProps: 'all' });
    }

    /* ──────────────────────────────────────────────────────
       7) Marquee — slow, single horizontal whisper
       ────────────────────────────────────────────────────── */
    const marquee = document.querySelector('[data-marquee]');
    if (marquee && !REDUCE) {
      // Duplicate content for seamless loop (already duplicated in HTML)
      const w = marquee.scrollWidth / 2;
      gsap.to(marquee, {
        x: -w,
        duration: 60,           // slow & cinematic
        ease: 'none',
        repeat: -1,
      });
    }

    /* ──────────────────────────────────────────────────────
       8) Philosophy rule — line draws across as the section enters
       ────────────────────────────────────────────────────── */
    const rule = document.querySelector('[data-rule]');
    if (rule && !REDUCE) {
      gsap.fromTo(rule, { width: '0%' }, {
        width: '100%',
        ease: 'expo.out',
        duration: 1.8,
        scrollTrigger: { trigger: '.philosophy', start: 'top 80%', once: true },
      });
    }

    /* ──────────────────────────────────────────────────────
       9) Image parallax — quiet, per element [data-parallax]
       ────────────────────────────────────────────────────── */
    if (!REDUCE) {
      document.querySelectorAll('[data-parallax]').forEach((fig) => {
        const img = fig.querySelector('img');
        if (!img) return;
        const strength = parseFloat(fig.dataset.parallax) || 0.1;
        gsap.fromTo(img,
          { yPercent: -strength * 60 },
          {
            yPercent: strength * 60,
            ease: 'none',
            scrollTrigger: {
              trigger: fig,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        );
      });
    }

    /* ──────────────────────────────────────────────────────
       10) Works rail — the single horizontal sequence.
           Light, native scroll inside the rail + sync drag.
       ────────────────────────────────────────────────────── */
    const rail = document.querySelector('[data-rail]');
    const track = document.querySelector('[data-rail-track]');
    const prog = document.querySelector('[data-rail-progress]');
    const idx  = document.querySelector('[data-rail-index]');

    if (rail && track) {
      // Native horizontal wheel + drag — no pinning, no scroll trapping
      let x = 0;
      let targetX = 0;
      let max = 0;
      const measure = () => { max = Math.max(0, track.scrollWidth - rail.clientWidth); };
      measure();
      window.addEventListener('resize', measure);

      const update = () => {
        x += (targetX - x) * 0.12;
        track.style.transform = `translate3d(${-x}px, 0, 0)`;
        if (prog) prog.style.right = `${100 - (x / (max || 1)) * 100}%`;
        if (idx) {
          const items = track.children.length;
          const i = Math.min(items, Math.floor((x / (max || 1)) * items) + 1);
          idx.textContent = String(i).padStart(2, '0');
        }
        requestAnimationFrame(update);
      };
      requestAnimationFrame(update);

      // Wheel — only convert vertical to horizontal when within the rail
      rail.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        // only intercept if the rail is fully on-screen
        const rect = rail.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.6;
        if (!inView) return;
        // and only if not at the edges in the direction of travel — prevents trapping
        const canScrollRight = targetX < max - 2;
        const canScrollLeft  = targetX > 2;
        if ((e.deltaY > 0 && !canScrollRight) || (e.deltaY < 0 && !canScrollLeft)) return;
        e.preventDefault();
        targetX = Math.min(max, Math.max(0, targetX + e.deltaY));
      }, { passive: false });

      // Drag (pointer)
      let dragging = false, sx = 0, sTarget = 0;
      rail.addEventListener('pointerdown', (e) => {
        dragging = true; sx = e.clientX; sTarget = targetX;
        rail.classList.add('is-dragging');
        rail.setPointerCapture(e.pointerId);
      });
      rail.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        targetX = Math.min(max, Math.max(0, sTarget + (sx - e.clientX)));
      });
      const endDrag = () => { dragging = false; rail.classList.remove('is-dragging'); };
      rail.addEventListener('pointerup', endDrag);
      rail.addEventListener('pointercancel', endDrag);

      // Touch — let native scroll handle most, but disable transform interference
      if (IS_TOUCH) {
        rail.style.overflowX = 'auto';
        rail.style.scrollSnapType = 'x mandatory';
        track.style.transform = 'none';
        [...track.children].forEach((c) => { c.style.scrollSnapAlign = 'start'; });
        const syncProgress = () => {
          const t = rail.scrollLeft;
          const m = track.scrollWidth - rail.clientWidth;
          if (prog) prog.style.right = `${100 - (t / (m || 1)) * 100}%`;
          if (idx) {
            const items = track.children.length;
            const i = Math.min(items, Math.floor((t / (m || 1)) * items) + 1);
            idx.textContent = String(i).padStart(2, '0');
          }
        };
        rail.addEventListener('scroll', syncProgress, { passive: true });
      }
    }

    /* ──────────────────────────────────────────────────────
       11) Process acts — restrained stagger on enter
       ────────────────────────────────────────────────────── */
    if (!REDUCE) {
      document.querySelectorAll('[data-act]').forEach((act) => {
        gsap.fromTo(act,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1.3, ease: 'expo.out',
            scrollTrigger: { trigger: act, start: 'top 85%', once: true },
          }
        );
      });
    }

    /* ──────────────────────────────────────────────────────
       12) Material plates — quiet stagger
       ────────────────────────────────────────────────────── */
    if (!REDUCE) {
      const materials = gsap.utils.toArray('[data-material]');
      if (materials.length) {
        gsap.fromTo(materials,
          { y: 32, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1.1, ease: 'expo.out', stagger: 0.08,
            scrollTrigger: { trigger: '.materials__list', start: 'top 80%', once: true },
          }
        );
      }
    }

    /* ──────────────────────────────────────────────────────
       13) Nav state — collapses & adds backdrop on scroll
       ────────────────────────────────────────────────────── */
    const nav = document.querySelector('[data-nav]');
    if (nav) {
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onUpdate: (self) => {
          nav.classList.toggle('is-stuck', self.scroll() > 80);
        },
      });
    }

    /* ──────────────────────────────────────────────────────
       14) Mobile menu
       ────────────────────────────────────────────────────── */
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-menu]');
    if (menuToggle && menu) {
      const setOpen = (open) => {
        menuToggle.classList.toggle('is-open', open);
        menu.classList.toggle('is-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-hidden', String(!open));
        if (lenis) open ? lenis.stop() : lenis.start();
        document.body.style.overflow = open ? 'hidden' : '';
      };
      menuToggle.addEventListener('click', () => {
        setOpen(!menu.classList.contains('is-open'));
      });
      document.querySelectorAll('[data-menu-link]').forEach((a) => {
        a.addEventListener('click', () => setOpen(false));
      });
    }

    /* ──────────────────────────────────────────────────────
       15) Custom cursor (desktop, fine pointer only)
       ────────────────────────────────────────────────────── */
    if (!IS_TOUCH && !REDUCE && matchMedia('(pointer: fine)').matches) {
      document.documentElement.classList.add('has-cursor');
      const cursor = document.querySelector('[data-cursor]');
      let cx = 0, cy = 0, tx = 0, ty = 0;
      window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
      const loop = () => {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        if (cursor) cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);

      const hoverables = 'a, button, [data-cursor-hover], .work, .practice__media, .ending__mail';
      document.querySelectorAll(hoverables).forEach((el) => {
        el.addEventListener('mouseenter', () => document.documentElement.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.documentElement.classList.remove('cursor-hover'));
      });
    }

    /* ──────────────────────────────────────────────────────
       16) Smooth anchor jumps via Lenis
       ────────────────────────────────────────────────────── */
    document.querySelectorAll('a[href^=\"#\"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -20, duration: 1.6 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    /* ──────────────────────────────────────────────────────
       17) Year stamp
       ────────────────────────────────────────────────────── */
    const y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();

    /* ──────────────────────────────────────────────────────
       18) Final refresh
       ────────────────────────────────────────────────────── */
    requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})()
