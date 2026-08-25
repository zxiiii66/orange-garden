// ============================================
// 橙色满园 - 主交互脚本
// ============================================

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// Page Load Animation (P0)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Add loading class
  document.body.classList.add('page-loading');

  // Trigger load animation
  requestAnimationFrame(() => {
    document.body.classList.remove('page-loading');
    document.body.classList.add('page-loaded');

    // Nav slide in
    const nav = document.querySelector('.nav');
    if (nav) {
      setTimeout(() => nav.classList.add('nav-visible'), 100);
    }

    // Hero title character animation
    animateHeroTitle();

    // Animate deco lines
    animateDecoLines();
  });
});

// Hero title character reveal
function animateHeroTitle() {
  const heroTitle = document.querySelector('.hero-title, .story-hero h1, .tech-hero h1, .company-hero h1, .products-hero h1, .honors-hero h1, .timeline-hero h1, .team-hero h1, .more-hero h1');

  if (!heroTitle || prefersReducedMotion) return;

  const text = heroTitle.textContent;
  heroTitle.innerHTML = '';
  heroTitle.classList.add('hero-title-animated');

  text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char;
    span.style.animationDelay = `${0.4 + index * 0.05}s`;
    heroTitle.appendChild(span);
  });
}

// Deco line expand animation
function animateDecoLines() {
  const decoLines = document.querySelectorAll('.deco-line');
  decoLines.forEach(line => {
    line.classList.add('deco-line-animated');
    setTimeout(() => line.classList.add('expanded'), 600);
  });
}

// ============================================
// Scroll Animations (P0)
// ============================================
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');

      // Stagger children if needed
      if (entry.target.classList.contains('stagger-parent')) {
        const children = entry.target.querySelectorAll('.reveal-stagger');
        children.forEach((child, index) => {
          setTimeout(() => child.classList.add('active'), index * 100);
        });
      }
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

// Initialize scroll animations
function initScrollAnimations() {
  // Text elements - cover all pages
  document.querySelectorAll('.story-content, .tech-content, .company-content, .overview-content, .star-product-content, .history-content').forEach(el => {
    el.classList.add('reveal-text');
    scrollObserver.observe(el);
  });

  // Image elements - cover all pages
  document.querySelectorAll('.story-image img, .tech-image img, .company-image img, .overview-image img, .star-product-image img').forEach(el => {
    el.parentElement.classList.add('reveal-image');
    scrollObserver.observe(el.parentElement);
  });

  // Cards with stagger - cover all pages
  document.querySelectorAll('.product-grid, .honors-grid, .members-grid, .advantages-grid, .scope-grid, .eco-features, .methods-grid, .achievements-grid, .project-grid').forEach(el => {
    el.classList.add('stagger-parent');
    el.querySelectorAll('.product-item, .honor-card, .member-card, .advantage-card, .scope-card, .eco-feature, .method-card, .achievement-card, .project-card').forEach(child => {
      child.classList.add('reveal-stagger');
    });
    scrollObserver.observe(el);
  });

  // Section headers - animate on scroll
  document.querySelectorAll('.section-header').forEach(el => {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          headerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    headerObserver.observe(el);
  });

  // Story grids - slide in from sides
  document.querySelectorAll('.story-grid').forEach(el => {
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    gridObserver.observe(el);
  });

  // Timeline items
  document.querySelectorAll('.timeline-item, .timeline-line, .year-marker').forEach(el => {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    timelineObserver.observe(el);
  });

  // Trigger animations for elements already in viewport on page load
  setTimeout(triggerVisibleAnimations, 100);

  // Also trigger on scroll for navigation/filter links
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(triggerVisibleAnimations, 50);
  }, { passive: true });

  // Trigger on hashchange for anchor navigation
  window.addEventListener('hashchange', () => {
    setTimeout(triggerVisibleAnimations, 100);
  });

  // CTA sections
  document.querySelectorAll('.story-cta, .tech-cta, .products-cta, .team-cta, .timeline-cta').forEach(el => {
    const btns = el.querySelectorAll('.btn');
    btns.forEach(btn => btn.classList.add('cta-animated'));
    scrollObserver.observe(el);
  });
}

function triggerVisibleAnimations() {
  // Text and image elements
  document.querySelectorAll('.reveal-text:not(.active), .reveal-image:not(.active), .reveal-stagger:not(.active)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('active');
    }
  });

  // Story grids
  document.querySelectorAll('.story-grid:not(.revealed)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('revealed');
    }
  });

  // Section headers
  document.querySelectorAll('.section-header:not(.animate-in)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('animate-in');
    }
  });

  // Stagger parents
  document.querySelectorAll('.stagger-parent:not(.active)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('active');
      el.querySelectorAll('.reveal-stagger').forEach(child => {
        child.classList.add('active');
      });
    }
  });

  // Timeline items
  document.querySelectorAll('.timeline-item:not(.active), .timeline-line:not(.active), .year-marker:not(.active)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('active');
    }
  });
  // CTA sections
  document.querySelectorAll('.story-cta, .tech-cta, .products-cta, .team-cta, .timeline-cta').forEach(el => {
    const btns = el.querySelectorAll('.btn');
    btns.forEach(btn => btn.classList.add('cta-animated'));
    scrollObserver.observe(el);
  });
}

// ============================================
// Card Hover Micro-interactions (P1)
// ============================================
function initCardInteractions() {
  // Add interactive class to cards
  document.querySelectorAll('.product-item, .honor-card, .member-card, .advantage-card, .scope-card, .quick-link-card').forEach(card => {
    card.classList.add('card-interactive', 'card-leaf');
  });

  // Button juice effect
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.classList.add('btn-juice');
  });
}

// ============================================
// Timeline Animations (P1)
// ============================================
function initTimelineAnimations() {
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  // Timeline items
  document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
  });

  // Timeline line grow
  document.querySelectorAll('.timeline-line, .timeline::before').forEach(line => {
    timelineObserver.observe(line);
  });

  // Year markers
  document.querySelectorAll('.year-marker').forEach(marker => {
    timelineObserver.observe(marker);
  });
}

// ============================================
// Counter Animation (P2)
// ============================================
function animateCounter(element, target, duration = 2000) {
  if (prefersReducedMotion) {
    element.textContent = target;
    return;
  }

  const start = 0;
  const startTime = performance.now();
  const isFloat = target % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (easeOutExpo)
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    const current = start + (target - start) * eased;
    element.textContent = isFloat ? current.toFixed(1) : Math.floor(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = isFloat ? target.toFixed(1) : target;
    }
  }

  requestAnimationFrame(update);
}

function initCounterAnimations() {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';

        const numberElements = entry.target.querySelectorAll('.stat-number, .value, h3');
        numberElements.forEach(el => {
          // Check for data-target attribute first
          const targetAttr = el.dataset.target;
          if (targetAttr) {
            const target = parseFloat(targetAttr);
            const suffix = el.textContent.replace(/[\d.]+/, '');
            animateCounter(el, target);
            setTimeout(() => {
              el.textContent = (target % 1 !== 0 ? target.toFixed(1) : target) + suffix;
            }, 2100);
            return;
          }

          // Fallback: parse from text content
          const text = el.textContent;
          const match = text.match(/[\d.]+/);

          if (match) {
            const target = parseFloat(match[0]);
            const suffix = text.replace(match[0], '');

            animateCounter(el, target);
            setTimeout(() => {
              el.textContent = (target % 1 !== 0 ? target.toFixed(1) : target) + suffix;
            }, 2100);
          }
        });
      }
    });
  }, {
    threshold: 0.3
  });

  // Observe stats sections
  document.querySelectorAll('.stats-section, .company-stats, .star-product-stats, .summary-stats, .stats-banner').forEach(section => {
    section.classList.add('counter-animated');
    counterObserver.observe(section);
  });
}

// ============================================
// Orange Cut Signature Animation (P3)
// ============================================
function initOrangeCutAnimation() {
  const cutSection = document.querySelector('.orange-cut-section');
  if (!cutSection) return;

  const cutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';

        // 1. Juice splash background
        setTimeout(() => {
          const splash = entry.target.querySelector('.juice-splash');
          if (splash) splash.classList.add('active');
        }, 100);

        // 2. Cut the orange (halves separate)
        setTimeout(() => {
          const halves = entry.target.querySelector('.orange-halves');
          if (halves) halves.classList.add('active');
        }, 200);

        // 3. Reveal center content (100% text)
        setTimeout(() => {
          const center = entry.target.querySelector('.orange-center');
          if (center) center.classList.add('active');
        }, 400);

        // 4. Fly products to corners (staggered)
        const products = entry.target.querySelectorAll('.cut-product-fly');
        products.forEach((product, index) => {
          setTimeout(() => {
            product.classList.add('active');
          }, 500 + index * 120);
        });

        // 5. Show signature text
        setTimeout(() => {
          const sig = entry.target.querySelector('.cut-signature');
          if (sig) sig.classList.add('active');
        }, 900);
      }
    });
  }, {
    threshold: 0.3
  });

  cutObserver.observe(cutSection);
}

// ============================================
// Navigation scroll effect
// ============================================
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// Active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Mobile menu toggle
const menuBtn = document.querySelector('.nav-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

// ============================================
// Image lazy loading
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
});

// ============================================
// Initialize all animations
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCardInteractions();
  initTimelineAnimations();
  initCounterAnimations();
  initOrangeCutAnimation();
  initImageRevealAnimations();
});

// Image reveal on scroll
function initImageRevealAnimations() {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        imageObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.eco-image, .tech-image-full').forEach(el => {
    el.classList.add('reveal-on-scroll');
    imageObserver.observe(el);
  });
}
