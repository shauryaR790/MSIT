(function () {
  if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const EASE = 'power3.out';
  const EASE_SNAP = 'power4.out';
  const DUR = 0.9;

  function reveal(targets, vars, triggerOpts) {
    const els = gsap.utils.toArray(targets);
    if (!els.length) return;

    gsap.from(els, {
      opacity: 0,
      y: 48,
      duration: DUR,
      ease: EASE,
      stagger: 0.12,
      ...vars,
      scrollTrigger: {
        trigger: els[0],
        start: 'top 88%',
        toggleActions: 'play none none reverse',
        ...triggerOpts,
      },
    });
  }

  function initHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const headlineLines = hero.querySelectorAll('.headline > span');
    const navCols = hero.querySelectorAll('.nav-col, .brand, .contact-btn');
    const infoBlocks = hero.querySelectorAll('.info > div, .info .dot');
    const divider = hero.querySelector('.divider');
    const laptop = hero.querySelector('.laptop');
    const cta = hero.querySelector('.cta');

    gsap.set([headlineLines, navCols, infoBlocks, laptop, cta], { opacity: 0 });
    gsap.set(headlineLines, { y: 72 });
    gsap.set(navCols, { y: -24 });
    gsap.set(infoBlocks, { y: 32 });
    gsap.set(laptop, { x: -60, y: 40 });
    gsap.set(cta, { y: 28 });
    if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: 'left center' });

    const tl = gsap.timeline({ defaults: { ease: EASE_SNAP } });

    tl.to(navCols, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.1)
      .to(infoBlocks, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.25)
      .to(divider, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.45)
      .to(headlineLines, { opacity: 1, y: 0, duration: 1, stagger: 0.14 }, 0.55)
      .to(laptop, { opacity: 1, x: 0, y: 0, duration: 1.1, ease: EASE }, 0.65)
      .to(cta, { opacity: 1, y: 0, duration: 0.7 }, 0.95);
  }

  function initFigmint() {
    const section = document.querySelector('.figmint');
    if (!section) return;

    const copy = section.querySelectorAll('.figmint-title span, .lead, .cta-group > *, .spec-item');

    reveal(copy, { y: 56, stagger: 0.1 }, { trigger: section, start: 'top 80%' });
  }

  function initWeaverine() {
    const root = document.querySelector('.weaverine');
    if (!root) return;

    const heroTitle = root.querySelector('.hero-title');
    const heroCols = root.querySelectorAll('.hero-col, .venn-container');
    const listItems = root.querySelectorAll('.list-item');
    const carousel = root.querySelector('.carousel-section');
    if (heroTitle) {
      gsap.from(heroTitle, {
        y: 120,
        opacity: 0,
        duration: 1.1,
        ease: EASE_SNAP,
        scrollTrigger: {
          trigger: heroTitle,
          start: 'top 92%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (heroCols.length) {
      gsap.from(heroCols, {
        y: 60,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: EASE,
        scrollTrigger: {
          trigger: root.querySelector('.hero-split'),
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    listItems.forEach((item) => {
      const title = item.querySelector('.list-title');
      const meta = item.querySelector('.list-meta');
      const indicator = item.querySelector('.list-indicator');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });

      if (title) tl.from(title, { x: -100, opacity: 0, duration: 0.9, ease: EASE_SNAP }, 0);
      if (meta) tl.from(meta, { x: 40, opacity: 0, duration: 0.7, ease: EASE }, 0.15);
      if (indicator) tl.from(indicator, { scale: 0, duration: 0.5, ease: 'back.out(2)' }, 0.3);
    });

    if (carousel) {
      gsap.from(carousel, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: EASE,
        scrollTrigger: {
          trigger: carousel,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    }

  }

  function initSonoscan() {
    const roots = document.querySelectorAll('.sonoscan');
    if (!roots.length) return;

    const projectsRoot = document.querySelector('.sonoscan#projects') || roots[0];
    const heroBits = projectsRoot.querySelectorAll('.signal-widget, .hero-visual, .hero-content > *');

    if (heroBits.length) {
      gsap.from(heroBits, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: EASE_SNAP,
        scrollTrigger: {
          trigger: projectsRoot.querySelector('.sc-hero'),
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    const ticket = projectsRoot.querySelector('.ticket-lift');
    if (ticket) {
      gsap.to(ticket, {
        y: -24,
        ease: 'none',
        scrollTrigger: {
          trigger: projectsRoot.querySelector('.sc-hero'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    const features = document.querySelectorAll('.sonoscan .feature-card');
    features.forEach((card, i) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.75,
        delay: i * 0.05,
        ease: EASE,
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }

  function initKernel() {
    const grid = document.querySelector('.kernel .bento-grid');
    if (!grid) return;

    gsap.set('.kernel .card', { opacity: 1, visibility: 'visible' });

    ScrollTrigger.batch('.kernel .card', {
      start: 'top 92%',
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 36,
          scale: 0.97,
          duration: 0.65,
          stagger: 0.06,
          ease: EASE,
          overwrite: true,
        });
      },
    });

    gsap.utils.toArray('.kernel .card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -4, duration: 0.35, ease: EASE });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.45, ease: EASE });
      });
    });
  }

  function initVault() {
    const section = document.querySelector('.vault');
    if (!section) return;

    const heroTitle = section.querySelector('.vault-hero__title h2');
    const cards = section.querySelectorAll('.vault-card');
    const stats = section.querySelector('.vault-hero__stat');

    if (heroTitle) {
      gsap.from(heroTitle, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: EASE_SNAP,
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (stats) {
      gsap.from(stats.children, {
        y: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: EASE,
        scrollTrigger: {
          trigger: stats,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (cards.length) {
      ScrollTrigger.batch(cards, {
        start: 'top 92%',
        onEnter: (batch) => {
          gsap.from(batch, {
            y: 40,
            duration: 0.6,
            stagger: 0.05,
            ease: EASE,
            overwrite: true,
          });
        },
      });
    }
  }

  function initSubpages() {
    const page = document.querySelector('.page');
    if (!page) return;

    const titleLines = page.querySelectorAll('.page-title span');
    const intro = page.querySelector('.page-intro');
    const cards = page.querySelectorAll('.service-card');
    const contactCols = page.querySelectorAll('.contact-details p, .contact-form label, .submit-btn');
    const divider = page.querySelector('.divider');
    const team = page.querySelector('.section-spaced');

    const tl = gsap.timeline({ defaults: { ease: EASE_SNAP } });

    if (titleLines.length) {
      gsap.set(titleLines, { y: 56, opacity: 0 });
      tl.to(titleLines, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.15);
    }

    if (intro) {
      gsap.set(intro, { y: 24, opacity: 0 });
      tl.to(intro, { y: 0, opacity: 1, duration: 0.7 }, 0.45);
    }

    if (cards.length) {
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: EASE,
        scrollTrigger: {
          trigger: cards[0].parentElement,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (contactCols.length) {
      gsap.from(contactCols, {
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: EASE,
        scrollTrigger: {
          trigger: page.querySelector('.contact-layout'),
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (divider) {
      gsap.from(divider, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.9,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: divider,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (team) {
      gsap.from(team.querySelectorAll('.info > div'), {
        y: 36,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: EASE,
        scrollTrigger: {
          trigger: team,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });
    }
  }

  initHero();
  initFigmint();
  initWeaverine();
  initSonoscan();
  initKernel();
  initVault();
  initSubpages();

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
