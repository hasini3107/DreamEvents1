document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu functionality
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Add aria-expanded for accessibility
    const isExpanded = navLinks.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  });

  // Close mobile menu when clicking on a link
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Fade-in animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe elements for fade-in animation
  document.querySelectorAll('.service-card, .about-content, .cta, .value-card, .team-member, .testimonial-card, .stat-item, .story-content, .service-item, .package-card, .step, .benefit-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Header background change on scroll (optimized)
  const header = document.querySelector('header');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastScrollTop = 0;
  let ticking = false;

  function updateHeaderOnScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      header.style.backdropFilter = 'blur(10px)';
      header.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
    } else {
      header.style.backdropFilter = 'none';
      header.style.backgroundColor = '#2c3e50';
    }

    if (!prefersReducedMotion) {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }

    lastScrollTop = scrollTop;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeaderOnScroll);
    }
  }, { passive: true });

  // Initialize header state
  updateHeaderOnScroll();

  // Add loading animation
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // Form validation (global, keep for other pages)
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });

      if (!isValid) {
        e.preventDefault();
        const status = form.querySelector('.form-status');
        if (status) status.textContent = 'Please fill in all required fields.';
      }
    });
  });

  // Contact form enhanced handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const status = contactForm.querySelector('.form-status');
    const submitBtn = document.getElementById('submit-btn');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const hp = contactForm.querySelector('#hp');
      if (hp && hp.value) return; // bot trap

      // simple client validation
      const requiredFields = contactForm.querySelectorAll('[required]');
      let isValid = true;
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      if (!isValid) {
        status.textContent = 'Please complete all required fields.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      status.textContent = '';

      // Simulate async request (replace with real endpoint later)
      try {
        await new Promise(res => setTimeout(res, 1200));
        status.textContent = 'Thank you! Your message has been sent.';
        status.style.color = '#2ecc71';
        contactForm.reset();
      } catch (err) {
        status.textContent = 'Something went wrong. Please try again later.';
        status.style.color = '#e74c3c';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  // Add hover effects for interactive elements (skip if reduced motion)
  const interactiveCards = document.querySelectorAll('.service-card, .value-card, .team-member, .testimonial-card, .service-item, .package-card, .benefit-item');
  if (!prefersReducedMotion) {
    interactiveCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // Animate stats numbers on scroll
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateStats = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = target.textContent;
        const isPercentage = finalValue.includes('%');
        const isPlus = finalValue.includes('+');
        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        
        let currentValue = 0;
        const increment = numericValue / 50;
        
        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
          }
          
          let displayValue = Math.floor(currentValue);
          if (isPlus) displayValue += '+';
          if (isPercentage) displayValue += '%';
          
          target.textContent = displayValue;
        }, 30);
        
        // Stop observing after animation
        statsObserver.unobserve(target);
      }
    });
  };

  const statsObserver = new IntersectionObserver(animateStats, {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  });

  statNumbers.forEach(stat => {
    statsObserver.observe(stat);
  });

  // Performance optimization: Debounce scroll events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Apply debouncing to scroll events
  const debouncedScrollHandler = debounce(() => {
    // Any additional scroll-based functionality can go here
  }, 10);

  window.addEventListener('scroll', debouncedScrollHandler, { passive: true });

  // =====================
  // Gallery Interactions
  // =====================
  const filterChips = document.querySelectorAll('.filter-chip');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const loadMoreBtn = document.getElementById('load-more');
  const noResultsEl = document.querySelector('.no-results');
  let visibleCount = 8;
  function updateVisibleItems() {
    const activeChip = document.querySelector('.filter-chip.active');
    const filter = activeChip ? activeChip.getAttribute('data-filter') : 'all';
    let shown = 0;
    galleryItems.forEach(item => {
      const matches = filter === 'all' || item.getAttribute('data-category') === filter;
      if (matches && shown < visibleCount) {
        item.classList.remove('hidden');
        shown += 1;
      } else if (matches) {
        item.classList.add('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
    if (loadMoreBtn) {
      const remaining = Array.from(galleryItems).filter(i => !i.classList.contains('hidden')).length;
      const totalMatches = Array.from(galleryItems).filter(i => (filter === 'all' || i.getAttribute('data-category') === filter)).length;
      loadMoreBtn.style.display = remaining < totalMatches ? 'inline-block' : 'none';
    }
    if (noResultsEl) {
      const anyVisible = Array.from(galleryItems).some(i => !i.classList.contains('hidden'));
      noResultsEl.style.display = anyVisible ? 'none' : 'block';
    }
  }

  if (filterChips.length && galleryItems.length) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const active = document.querySelector('.filter-chip.active');
        if (active) active.classList.remove('active');
        chip.classList.add('active');
        visibleCount = 8;
        updateVisibleItems();
      });
    });
    updateVisibleItems();
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += 8;
      updateVisibleItems();
    });
  }

  // Lazy load images with fade-in effect
  const lazyImages = document.querySelectorAll('.gallery-item img');
  if ('IntersectionObserver' in window && lazyImages.length) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // If using data-src in future, swap here
          img.addEventListener('load', () => {
            img.classList.add('img-loaded');
            img.closest('.gallery-item')?.classList.add('loaded');
          }, { once: true });
          img.addEventListener('error', () => {
            const item = img.closest('.gallery-item');
            if (item && !item.classList.contains('broken')) {
              item.classList.add('broken');
              const fallback = document.createElement('div');
              fallback.className = 'fallback';
              fallback.textContent = 'Image unavailable';
              item.appendChild(fallback);
            }
          }, { once: true });
          img.classList.add('img-loaded'); // in case it's cached
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '100px 0px', threshold: 0.01 });

    lazyImages.forEach(img => imgObserver.observe(img));
  }

  // Lightbox
  function createLightbox() {
    const backdrop = document.createElement('div');
    backdrop.className = 'lightbox-backdrop';
    backdrop.innerHTML = `
      <div class="lightbox-content">
        <div class="lightbox-img-wrap">
          <img alt="Lightbox image" />
          <div class="lightbox-caption"></div>
          <button class="lightbox-btn lightbox-close" aria-label="Close">✕</button>
        </div>
        <div class="lightbox-nav">
          <button class="lightbox-btn prev" aria-label="Previous">◀</button>
          <button class="lightbox-btn next" aria-label="Next">▶</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    return backdrop;
  }

  const backdrop = createLightbox();
  const lbImg = backdrop.querySelector('img');
  const lbCaption = backdrop.querySelector('.lightbox-caption');
  const btnClose = backdrop.querySelector('.lightbox-close');
  const btnPrev = backdrop.querySelector('.prev');
  const btnNext = backdrop.querySelector('.next');

  let currentIndex = -1;
  const visibleItems = () => Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));

  function openLightbox(index) {
    const items = visibleItems();
    if (!items.length) return;
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    currentIndex = index;

    const fig = items[currentIndex];
    const img = fig.querySelector('img');
    const caption = fig.querySelector('figcaption')?.innerText || '';
    lbImg.src = img.src;
    lbImg.alt = img.alt || 'Gallery image';
    lbCaption.textContent = caption;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function nextImage(step = 1) {
    openLightbox(currentIndex + step);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(visibleItems().indexOf(item)));
    item.style.cursor = 'zoom-in';
  });

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', () => nextImage(-1));
  btnNext.addEventListener('click', () => nextImage(1));
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (!backdrop.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage(1);
    if (e.key === 'ArrowLeft') nextImage(-1);
  });
});