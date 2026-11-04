/**
 * Bangladesh Motocross Club & Academy (BMCA)
 * Main Interactive Engine - Production Version
 */

/**
 * Analytics Event Abstraction (GA4 / Meta Pixel / Console)
 */
function trackEvent(eventName, params = {}) {
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...params
  };

  // Safe console telemetry for auditing
  console.log('[BMCA Analytics]', eventName, payload);

  // Google Tag Manager / GA4 dataLayer
  if (window.dataLayer && Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, params);
  }
}

/**
 * Resilient Offline/Local Lead Vault
 * Appends inquiries and registrations to localStorage to prevent dropped leads.
 */
function saveToLeadVault(type, data) {
  try {
    const raw = localStorage.getItem('bmca_lead_vault');
    const vault = raw ? JSON.parse(raw) : [];
    const lead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      type: type,
      timestamp: new Date().toISOString(),
      data: data
    };
    vault.push(lead);
    localStorage.setItem('bmca_lead_vault', JSON.stringify(vault));
    console.log('[BMCA Lead Vault] Saved lead:', lead.id, type);
    return lead;
  } catch (err) {
    console.warn('[BMCA Lead Vault] Failed to save lead to localStorage', err);
    return null;
  }
}

// Progressive Web App: Register Service Worker
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('[BMCA SW] Registered successfully, scope:', reg.scope);
    }).catch((err) => {
      console.warn('[BMCA SW] Registration skipped/failed:', err);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initHeroVideo();
  initRaceCountdown();
  initRacerFiltersAndModal();
  initCalendarFilters();
  initGalleryAndLightbox();
  initRegistrationForm();
  initAlertBarAction();
  initFeniTrialModal();
  initPackageAnalytics();
  initCostEstimator();
  initPaddockVault();
});

/* ==========================================================================
   0. Theme Mode Toggle (Dark vs Light)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  if (!toggleBtns.length) return;

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('bmca_theme', theme);
    } catch (e) {}

    const isLight = theme === 'light';
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-checked', isLight ? 'true' : 'false');
      btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      btn.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    });

    // Theme-specific crest swap for clean navbar integration
    const navLogos = document.querySelectorAll('.nav-logo');
    navLogos.forEach(logo => {
      const src = logo.getAttribute('src');
      if (!src) return;
      const isSubpage = src.startsWith('../');
      const prefix = isSubpage ? '../images/' : 'images/';
      logo.setAttribute('src', isLight ? `${prefix}bmca-crest-logo-light.jpg` : `${prefix}logo-transparent.png`);
    });
  }

  // Determine current active theme
  const saved = (function() {
    try {
      return localStorage.getItem('bmca_theme');
    } catch (e) {
      return null;
    }
  })();

  const currentTheme = saved || (document.documentElement.getAttribute('data-theme') || 'dark');
  applyTheme(currentTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(active);
    });
  });
}

/* ==========================================================================
   1. Navigation & Scrollspy
   ========================================================================== */
function initNavigation() {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-cta a');
  const sections = document.querySelectorAll('section[id], header[id]');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    updateScrollspy();
  }, { passive: true });

  // Mobile menu toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('mobile-active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('mobile-active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scrollspy
  function updateScrollspy() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   2. Next Race Countdown Timer & Alert Bar Action
   ========================================================================== */
function initRaceCountdown() {
  // Target: Next official event (15 November 2026, 09:00 AM BD Time)
  const targetDate = new Date('2026-11-15T09:00:00+06:00').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      const titleEl = document.querySelector('.race-alert-title');
      if (titleEl) titleEl.textContent = 'RACE DAY LIVE: FENI TRACK TRIAL';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

function initAlertBarAction() {
  const alertBtn = document.querySelector('.alert-entry-btn');
  if (!alertBtn) return;

  alertBtn.addEventListener('click', (e) => {
    e.preventDefault();
    trackEvent('feni_alert_bar_click');
    openFeniTrialModal();
  });
}

/* ==========================================================================
   3. Racer Roster Filtering & Interactive Profile Modal (Focus-Trapped)
   ========================================================================== */
const racerProfiles = {
  mr99: {
    number: 'MR99',
    name: 'Md. Mahabubur Rahman Hafiz',
    role: 'Club Director & Champion Racer',
    category: 'Pro Track 250cc Champion',
    machine: 'Honda CRF250R (4-Stroke DOHC)',
    location: 'Chittagong, Bangladesh',
    photo: 'images/race-start.jpg',
    sponsor: 'DCS (Official Sponsor)',
    service: 'Moto Freak Lab (Service Partner)',
    bio: 'Md. Mahabubur Rahman Hafiz (MR99) is the Director of Bangladesh Motocross Club & Academy and an acclaimed pioneer of competitive motocross in Bangladesh. Leading from Chittagong, he spearheads rider training, national championship participation, and youth motorsport development.',
    achievements: [
      { title: 'Champion of the Curves 2025', detail: 'Category: Pro Track — Champion' },
      { title: 'Chittagong Hill Track Trial 2025', detail: 'Category: Pro Track — 1st Runner-Up' },
      { title: 'Furious Track Trial 2025', detail: 'Category: Pro Track — 2nd Runner-Up' },
      { title: 'Moto Madness 2025', detail: 'Category: Pro Track — 4th Runner-Up' }
    ]
  },
  bulbul: {
    number: '#07',
    name: 'Salauddin Ahmed Bulbul (Baundal Bulbul)',
    role: 'Official Academy Mentor & Pro Racer',
    category: 'Pro Track & Enduro 250cc',
    machine: 'Yamaha YZ250F (4-Stroke DOHC)',
    location: 'Narsingdi, Bangladesh',
    photo: 'images/baundal-bulbul.jpg',
    sponsor: 'DCS / TWM Certified',
    service: 'Moto Freak Lab',
    bio: 'Salauddin Ahmed Bulbul is the Official Mentor of Bangladesh Motocross Club & Academy, appointed for official rider instruction. He completed an intensive 6-Month Enduro and Motocross training program at the TWM Academy of Moto Adventure in Kolkata, India. He actively competes in premier off-road events across Bangladesh and South Asia.',
    achievements: [
      { title: 'TWM Academy of Moto Adventure (Kolkata, India)', detail: '6-Month Enduro & Motocross Certified Training' },
      { title: 'Moto Madness 2025 — Season 2', detail: 'Pro Track — 2nd Runner-Up' },
      { title: 'Furious Track Trial 2024 — Season 1 & 2', detail: '1st Runner-Up in both Season 1 and Season 2' },
      { title: 'SR Dirt Fest 2024 (Singur, West Bengal, India)', detail: 'International Race — 4th Runner-Up' }
    ]
  },
  sharif: {
    number: '#05',
    name: 'Sharif ON Track',
    role: 'Official Pro Racer',
    category: 'Pro Track 250cc',
    machine: 'Suzuki RM-Z250 (4-Stroke Fuel Injected)',
    location: 'Chittagong, Bangladesh',
    photo: 'images/sharif-on-track.jpg',
    sponsor: 'DCS / BMCA Racing Team',
    service: 'Moto Freak Lab',
    bio: 'Sharif ON Track (Racing Code: 05) is a high-speed circuit and off-road competitor representing Chittagong and Bangladesh Motocross Club & Academy. Known for fearless throttle discipline and technical control in treacherous mud and clay conditions.',
    achievements: [
      { title: 'Suzuki Off-Road Championship 2026', detail: 'Pro Category — 2nd Runner-Up' },
      { title: 'FBR Mega Get Together CampFest 2025', detail: 'Off-Road Racing — 1st Runner-Up (Organizer: Feni Bike Riders)' }
    ]
  },
  sultan: {
    number: '#77',
    name: 'Sultan Sheikh',
    role: 'Official Pro Racer',
    category: 'Pro Open Category (250cc–450cc)',
    machine: 'KTM 250 SX-F (4-Stroke DOHC)',
    location: 'Bangladesh',
    photo: 'images/sultan-sheikh.jpg',
    sponsor: 'DCS / BMCA Racing Team',
    service: 'Moto Freak Lab',
    bio: 'Sultan Sheikh (Racing Number #77) is an elite competitor for Bangladesh Motocross Club & Academy. With exceptional agility on technical hill climbs and high-speed tracks, he has clinched top podium positions in major national motocross tournaments.',
    achievements: [
      { title: 'Moto Madness 2025 — Season 2', detail: 'Pro Track — 1st Runner-Up' },
      { title: 'Chattogram Hill Track Champion 2025', detail: 'Pro Category — 2nd Runner-Up' }
    ]
  }
};

let lastActiveTrigger = null;
let removeFocusTrap = null;

function initRacerFiltersAndModal() {
  const filterBtns = document.querySelectorAll('.roster-filter-bar .filter-btn');
  const racerCards = document.querySelectorAll('.racers-grid .racer-card');
  const modal = document.getElementById('racer-modal');
  const modalClose = document.querySelector('.racer-modal-close');

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      racerCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open Modal with Focus Trapping
  document.querySelectorAll('[data-racer-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lastActiveTrigger = btn;

      const id = btn.getAttribute('data-racer-id');
      const data = racerProfiles[id];
      if (!data || !modal) return;

      document.getElementById('modal-racer-num').textContent = data.number;
      document.getElementById('modal-racer-name').textContent = data.name;
      document.getElementById('modal-racer-role').textContent = data.role;
      document.getElementById('modal-racer-machine').textContent = data.machine;
      document.getElementById('modal-racer-location').textContent = data.location;
      document.getElementById('modal-racer-sponsor').textContent = data.sponsor;
      document.getElementById('modal-racer-bio').textContent = data.bio;

      const imgEl = document.getElementById('modal-racer-img');
      imgEl.src = data.photo;
      imgEl.alt = data.name;

      const listEl = document.getElementById('modal-racer-achievements');
      listEl.innerHTML = '';
      data.achievements.forEach(ach => {
        const div = document.createElement('div');
        div.className = 'achievement-item';
        div.innerHTML = `<strong>${ach.title}</strong><span>${ach.detail}</span>`;
        listEl.appendChild(div);
      });

      modal.classList.add('active');
      document.body.classList.add('modal-open');

      // Trap focus
      if (removeFocusTrap) removeFocusTrap();
      removeFocusTrap = setupFocusTrap(modal, closeModal);
    });
  });

  // Close Modal
  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
      if (removeFocusTrap) {
        removeFocusTrap();
        removeFocusTrap = null;
      }
      if (lastActiveTrigger) {
        lastActiveTrigger.focus();
        lastActiveTrigger = null;
      }
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

/* Focus Trap Helper */
function setupFocusTrap(containerEl, closeFn) {
  const focusable = containerEl.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return () => {};

  const firstEl = focusable[0];
  const lastEl = focusable[focusable.length - 1];

  firstEl.focus();

  function keyHandler(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeFn();
      return;
    }
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  containerEl.addEventListener('keydown', keyHandler);
  return () => containerEl.removeEventListener('keydown', keyHandler);
}

/* ==========================================================================
   4. Racing Event Calendar Filters & Registration Prefill & Interactive Jump
   ========================================================================== */
function initCalendarFilters() {
  const tabs = document.querySelectorAll('.calendar-tab');
  const rows = document.querySelectorAll('.event-row');

  // Interactive filtering with staggered physical jump-in animation
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-year');
      let visibleIndex = 0;

      rows.forEach(row => {
        const year = row.getAttribute('data-year');
        if (filter === 'all' || year === filter) {
          row.style.display = 'grid';
          // Re-trigger bouncy jump entrance with staggered timing
          row.classList.remove('anim-jump');
          void row.offsetWidth; // Force reflow
          row.style.animationDelay = `${visibleIndex * 0.05}s`;
          row.classList.add('anim-jump');
          visibleIndex++;
        } else {
          row.style.display = 'none';
          row.classList.remove('anim-jump');
        }
      });
    });
  });

  // Interactive expandable telemetry drawer toggle
  rows.forEach(row => {
    const specsBtn = row.querySelector('.event-specs-btn');

    function toggleDrawer(e) {
      if (e) e.stopPropagation();
      const isExpanded = row.classList.toggle('is-expanded');
      row.setAttribute('data-expanded', isExpanded ? 'true' : 'false');
      row.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      if (specsBtn) {
        specsBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      }
    }

    if (specsBtn) {
      specsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDrawer(e);
      });
    }

    // Keyboard accessibility: Enter or Space on row toggles drawer
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target === row) {
          e.preventDefault();
          toggleDrawer();
        }
      }
    });

    // Clicking row header area toggles drawer (ignoring button/anchor clicks)
    row.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) {
        return;
      }
      toggleDrawer();
    });
  });

  // "Register / Inquire" links on event rows
  document.querySelectorAll('.event-inquire-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const eventName = btn.getAttribute('data-event-name');
      triggerEventRegistration(eventName);
    });
  });
}

let activeFeniCleanupTrap = null;

function openFeniTrialModal() {
  const modal = document.getElementById('feni-trial-modal');
  if (!modal) return;

  trackEvent('feni_modal_open', { trigger: 'modal_open' });

  modal.style.display = 'grid';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  activeFeniCleanupTrap = setupFocusTrap(modal, closeFeniTrialModal);

  const closeBtn = document.getElementById('feni-modal-close');
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.preventDefault();
      closeFeniTrialModal();
    };
  }

  modal.onclick = (e) => {
    if (e.target === modal) {
      closeFeniTrialModal();
    }
  };

  const nameInput = document.getElementById('feni-name');
  if (nameInput) {
    setTimeout(() => nameInput.focus(), 60);
  }
}

function closeFeniTrialModal() {
  const modal = document.getElementById('feni-trial-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.style.display = 'none';
  document.body.style.overflow = '';

  if (typeof activeFeniCleanupTrap === 'function') {
    activeFeniCleanupTrap();
    activeFeniCleanupTrap = null;
  }

  const alertBtn = document.getElementById('alert-feni-register-btn') || document.querySelector('.alert-entry-btn');
  if (alertBtn) {
    alertBtn.focus();
  }
}

function triggerEventRegistration(eventName) {
  if (eventName && eventName.toLowerCase().includes('feni')) {
    trackEvent('feni_fixture_click', { eventName });
    openFeniTrialModal();
    return;
  }

  const programSelect = document.getElementById('form-program');
  const commentsInput = document.getElementById('form-message');
  const formTitle = document.getElementById('form-card-title');
  const formSubtitle = document.getElementById('form-card-subtitle');

  if (formTitle) {
    formTitle.textContent = 'Racer Entry Application';
  }
  if (formSubtitle) {
    formSubtitle.textContent = `Official entry submission for: ${eventName}`;
  }
  if (programSelect) {
    for (let opt of programSelect.options) {
      if (opt.value.toLowerCase().includes('entry')) {
        programSelect.value = opt.value;
        break;
      }
    }
  }
  if (commentsInput) {
    commentsInput.value = `Official Entry Request for: ${eventName}`;
  }

  // Smooth scroll to contact
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const nameInput = document.getElementById('form-name');
      if (nameInput) nameInput.focus();
    }, 600);
  }
}

/* ==========================================================================
   5. Racing Gallery & Lightbox (Accessible & Focus-Trapped)
   ========================================================================== */
function initGalleryAndLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-filter-bar .filter-btn');
  const items = document.querySelectorAll('.gallery-grid .gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  let activeList = [];
  let currentIndex = 0;
  let galleryLastTrigger = null;
  let galleryFocusTrap = null;

  // Filter gallery
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  function updateActiveList() {
    activeList = Array.from(items).filter(item => item.style.display !== 'none');
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      galleryLastTrigger = item;
      updateActiveList();
      currentIndex = activeList.indexOf(item);
      showLightbox(currentIndex);
    });
  });

  function showLightbox(index) {
    if (index < 0 || index >= activeList.length) return;
    currentIndex = index;
    const targetItem = activeList[currentIndex];
    const img = targetItem.querySelector('.gallery-thumb');
    const caption = targetItem.querySelector('.gallery-caption');

    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Motocross Racing Photo';
    }
    if (lightboxCaption && caption) {
      lightboxCaption.textContent = caption.textContent;
    }

    if (lightbox) {
      lightbox.classList.add('active');
      document.body.classList.add('modal-open');

      if (galleryFocusTrap) galleryFocusTrap();
      galleryFocusTrap = setupFocusTrap(lightbox, closeLightbox);
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.classList.remove('modal-open');
      if (galleryFocusTrap) {
        galleryFocusTrap();
        galleryFocusTrap = null;
      }
      if (galleryLastTrigger) {
        galleryLastTrigger.focus();
        galleryLastTrigger = null;
      }
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + activeList.length) % activeList.length;
      showLightbox(currentIndex);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % activeList.length;
      showLightbox(currentIndex);
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

/* ==========================================================================
   6. Academy Registration & Contact Form (Synchronous Mobile Dispatch)
   ========================================================================== */
function initRegistrationForm() {
  const form = document.getElementById('academy-form');
  const statusEl = document.getElementById('form-status');

  if (!form) return;

  const nameInput = document.getElementById('form-name');
  const phoneInput = document.getElementById('form-phone');
  const cityInput = document.getElementById('form-city');
  const programInput = document.getElementById('form-program');
  const expInput = document.getElementById('form-exp');
  const messageInput = document.getElementById('form-message');

  // Restore saved form values from sessionStorage if user navigated back
  try {
    const saved = JSON.parse(sessionStorage.getItem('bmca_form_draft') || '{}');
    if (saved.name && nameInput) nameInput.value = saved.name;
    if (saved.phone && phoneInput) phoneInput.value = saved.phone;
    if (saved.city && cityInput) cityInput.value = saved.city;
    if (saved.program && programInput) programInput.value = saved.program;
    if (saved.exp && expInput) expInput.value = saved.exp;
    if (saved.message && messageInput) messageInput.value = saved.message;
    if (saved.equipment) {
      const radio = document.querySelector(`input[name="form-equipment"][value="${saved.equipment}"]`);
      if (radio) radio.checked = true;
    }
  } catch (err) {
    // Ignore storage restrictions
  }

  // Persist form values on input change
  function saveDraft() {
    try {
      const equipEl = document.querySelector('input[name="form-equipment"]:checked');
      const draft = {
        name: nameInput ? nameInput.value : '',
        phone: phoneInput ? phoneInput.value : '',
        city: cityInput ? cityInput.value : '',
        program: programInput ? programInput.value : '',
        exp: expInput ? expInput.value : '',
        message: messageInput ? messageInput.value : '',
        equipment: equipEl ? equipEl.value : ''
      };
      sessionStorage.setItem('bmca_form_draft', JSON.stringify(draft));
    } catch (err) {}
  }

  form.addEventListener('input', saveDraft);
  form.addEventListener('change', saveDraft);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const city = cityInput ? cityInput.value.trim() : '';
    const program = programInput ? programInput.value : '';
    const experience = expInput ? expInput.value : '';
    const message = messageInput ? messageInput.value.trim() : '';
    const equipEl = document.querySelector('input[name="form-equipment"]:checked');
    const equipment = equipEl ? equipEl.value : 'Need Fleet Bike & Armor';

    if (!name || !phone) {
      if (statusEl) {
        statusEl.textContent = 'Please fill in your name and phone number.';
        statusEl.style.color = '#ff3b3b';
      }
      return;
    }

    saveDraft();

    // Resilient Lead Vault Persistence & Analytics
    const leadPayload = {
      name,
      phone,
      city: city || 'Chittagong',
      program,
      equipment,
      experience,
      message: message || ''
    };
    saveToLeadVault('admission_inquiry', leadPayload);
    trackEvent('academy_inquiry_submit', {
      program,
      equipment,
      city: city || 'Chittagong'
    });

    // Build WhatsApp Message Payload
    const text = encodeURIComponent(
      `*BMCA Official Inquiry / Registration*\n` +
      `------------------------------------\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*City:* ${city || 'Chittagong'}\n` +
      `*Selected Package / Program:* ${program}\n` +
      `*Equipment Status:* ${equipment}\n` +
      `*Experience Level:* ${experience}\n` +
      `*Message:* ${message || 'I would like to connect with Bangladesh Motocross Club & Academy.'}`
    );

    const waUrl = `https://wa.me/8801975376114?text=${text}`;

    if (statusEl) {
      statusEl.innerHTML = `Connecting to WhatsApp... <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline;color:var(--green-track);margin-inline-start:6px;font-weight:700;">Click here if WhatsApp doesn't open</a>`;
      statusEl.className = 'form-status success';
    }

    // Direct synchronous dispatch for mobile Safari / Chrome compatibility
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      // Synchronous location redirect: prevents popup blocking and launches native WhatsApp app immediately
      window.location.href = waUrl;
    } else {
      // Desktop: Attempt opening in new tab, fallback immediately if popup is blocked
      const newWin = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.location.href = waUrl;
      }
    }
  });
}

/* ==========================================================================
   7. Feni Track Trial Modal Logic & Lead Vault Dispatch
   ========================================================================== */
function initFeniTrialModal() {
  const form = document.getElementById('feni-registration-form');
  const statusEl = document.getElementById('feni-form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('feni-name')?.value.trim();
    const phone = document.getElementById('feni-phone')?.value.trim();
    const entryType = document.getElementById('feni-entry-type')?.value;
    const category = document.getElementById('feni-category')?.value;
    const machine = document.getElementById('feni-machine')?.value.trim();
    const city = document.getElementById('feni-city')?.value.trim();
    const bloodGroup = document.getElementById('feni-blood')?.value || 'Not Disclosed';
    const emergency = document.getElementById('feni-emergency')?.value.trim();
    const safetyAck = document.getElementById('feni-safety-ack')?.checked;

    if (!name || !phone || !machine || !city || !emergency) {
      if (statusEl) {
        statusEl.textContent = 'Please fill out all required fields marked with * (including Emergency Contact).';
        statusEl.style.color = '#ff3b3b';
      }
      return;
    }

    // Phone format check for Bangladesh (11 digits e.g. 01XXXXXXXXX)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      if (statusEl) {
        statusEl.textContent = 'Please enter a valid 11-digit mobile/WhatsApp number.';
        statusEl.style.color = '#ff3b3b';
      }
      return;
    }

    if (!safetyAck) {
      if (statusEl) {
        statusEl.textContent = 'Please acknowledge track safety & marshal regulations.';
        statusEl.style.color = '#ff3b3b';
      }
      return;
    }

    // Generate unique scrutineering identification code for track entry
    const scrutCode = 'BMCA-SCRUT-' + Math.floor(1000 + Math.random() * 9000);

    const leadData = {
      name,
      phone,
      entryType,
      category,
      machine,
      city,
      bloodGroup,
      emergency,
      scrutCode,
      event: 'Feni Track Trial (15 Nov 2026)',
      safetyAck: true
    };

    saveToLeadVault('feni_race_entry', leadData);
    trackEvent('feni_registration_submit', leadData);

    const text = encodeURIComponent(
      `*BMCA Official Race Entry — Feni Track Trial (15 Nov 2026)*\n` +
      `-----------------------------------------------------\n` +
      `*Scrutineering Code:* ${scrutCode}\n` +
      `*Competitor / Attendee:* ${name}\n` +
      `*WhatsApp:* ${phone}\n` +
      `*Registration Type:* ${entryType}\n` +
      `*Class / Category:* ${category}\n` +
      `*Motorcycle Model:* ${machine}\n` +
      `*District / City:* ${city}\n` +
      `*Blood Group (Trauma Standby):* ${bloodGroup}\n` +
      `*Emergency Contact:* ${emergency}\n` +
      `*Track Safety Standard:* Confirmed & Acknowledged\n` +
      `*Date of Submission:* ${new Date().toLocaleDateString('en-GB')}`
    );

    const waUrl = `https://wa.me/8801975376114?text=${text}`;

    if (statusEl) {
      statusEl.innerHTML = `Entry saved to lead vault! Connecting to WhatsApp... <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline;color:var(--green-track);margin-inline-start:6px;font-weight:700;">Click here if WhatsApp doesn't open</a>`;
      statusEl.className = 'form-status success';
    }

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = waUrl;
    } else {
      const newWin = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.location.href = waUrl;
      }
    }
  });
}

function initPackageAnalytics() {
  document.querySelectorAll('.package-cta-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = btn.getAttribute('data-cta-tier') || 'admission_tier';
      trackEvent('cta_click_' + tier, {
        tier: tier,
        text: btn.textContent.trim()
      });
    });
  });
}

/* ==========================================================================
   8. Admissions & Equipment Cost Estimator
   ========================================================================== */
function initCostEstimator() {
  const container = document.getElementById('cost-estimator');
  if (!container) return;

  const pathwayRadios = container.querySelectorAll('input[name="calc-pathway"]');
  const bikeCheck = document.getElementById('addon-bike');
  const armorCheck = document.getElementById('addon-armor');
  const fuelCheck = document.getElementById('addon-fuel');
  const coachCheck = document.getElementById('addon-coach');

  const bikeNote = document.getElementById('addon-bike-note');
  const bikeCost = document.getElementById('addon-bike-cost');
  const armorNote = document.getElementById('addon-armor-note');
  const armorCost = document.getElementById('addon-armor-cost');

  const totalAmountEl = document.getElementById('calc-total-amount');
  const totalPeriodEl = document.getElementById('calc-total-period');
  const breakdownListEl = document.getElementById('calc-summary-breakdown');
  const bookBtn = document.getElementById('calc-book-btn');

  function updateEstimator() {
    let pathway = 'clinic';
    pathwayRadios.forEach(r => {
      const pill = r.closest('.pathway-pill');
      if (r.checked) {
        pathway = r.value;
        if (pill) pill.classList.add('active');
      } else {
        if (pill) pill.classList.remove('active');
      }
    });

    let basePrice = 3500;
    let periodText = '/ weekend';
    let pathwayName = 'Weekend Starter Clinic';
    const breakdown = [];

    if (pathway === 'clinic') {
      basePrice = 3500;
      periodText = '/ weekend';
      pathwayName = 'Weekend Starter Clinic';
      breakdown.push({ item: 'Weekend Starter Clinic', price: '৳3,500' });

      // In clinic, bike & armor are included
      bikeCheck.checked = true;
      bikeCheck.disabled = true;
      if (bikeNote) bikeNote.textContent = 'Included with Starter Clinic';
      if (bikeCost) bikeCost.textContent = '৳0';
      breakdown.push({ item: 'BMCA Fleet Dirt Bike', price: 'Included' });

      armorCheck.checked = true;
      armorCheck.disabled = true;
      if (armorNote) armorNote.textContent = 'Included with Starter Clinic';
      if (armorCost) armorCost.textContent = '৳0';
      breakdown.push({ item: 'DOT/ECE Helmet & Armor', price: 'Included' });
    } else if (pathway === 'cadet') {
      basePrice = 12000;
      periodText = '/ month';
      pathwayName = 'Monthly Academy Cadet';
      breakdown.push({ item: 'Monthly Academy Cadet', price: '৳12,000' });

      bikeCheck.disabled = false;
      if (bikeNote) bikeNote.textContent = 'BMCA Fleet Dirt Bike (+৳4,000/mo)';
      if (bikeCost) bikeCost.textContent = '+৳4,000';
      if (bikeCheck.checked) {
        basePrice += 4000;
        breakdown.push({ item: 'BMCA Fleet 150-250cc Bike', price: '৳4,000' });
      }

      armorCheck.disabled = false;
      if (armorNote) armorNote.textContent = 'Sanitized Helmet & Armor (+৳1,500/mo)';
      if (armorCost) armorCost.textContent = '+৳1,500';
      if (armorCheck.checked) {
        basePrice += 1500;
        breakdown.push({ item: 'Sanitized Protective Armor', price: '৳1,500' });
      }
    } else if (pathway === 'paddock') {
      basePrice = 1500;
      periodText = '/ day';
      pathwayName = 'Open Paddock Pass';
      breakdown.push({ item: 'Open Paddock Pass (Own Machine)', price: '৳1,500' });

      bikeCheck.disabled = false;
      if (bikeNote) bikeNote.textContent = 'Loaner Track Bike (+৳2,000/day)';
      if (bikeCost) bikeCost.textContent = '+৳2,000';
      if (bikeCheck.checked) {
        basePrice += 2000;
        breakdown.push({ item: 'Loaner Track Bike', price: '৳2,000' });
      }

      armorCheck.disabled = false;
      if (armorNote) armorNote.textContent = 'DOT/ECE Armor Set (+৳800/day)';
      if (armorCost) armorCost.textContent = '+৳800';
      if (armorCheck.checked) {
        basePrice += 800;
        breakdown.push({ item: 'DOT/ECE Armor Set', price: '৳800' });
      }
    }

    if (fuelCheck && fuelCheck.checked) {
      basePrice += 500;
      breakdown.push({ item: 'Track High-Octane Fuel & Premix', price: '৳500' });
    }

    if (coachCheck && coachCheck.checked) {
      basePrice += 1200;
      breakdown.push({ item: '1-on-1 Dedicated Coach Supervision', price: '৳1,200' });
    }

    if (totalAmountEl) totalAmountEl.textContent = basePrice.toLocaleString('en-US');
    if (totalPeriodEl) totalPeriodEl.textContent = periodText;

    // Render breakdown items
    if (breakdownListEl) {
      breakdownListEl.innerHTML = '';
      breakdown.forEach(b => {
        const div = document.createElement('div');
        div.className = 'breakdown-item' + (b.price === 'Included' ? ' text-muted' : '');
        div.innerHTML = `<span>${b.item}</span> <span>${b.price}</span>`;
        breakdownListEl.appendChild(div);
      });
    }

    return { pathway, pathwayName, totalPrice: basePrice, periodText, breakdown };
  }

  pathwayRadios.forEach(r => r.addEventListener('change', updateEstimator));
  [bikeCheck, armorCheck, fuelCheck, coachCheck].forEach(chk => {
    if (chk) chk.addEventListener('change', updateEstimator);
  });

  if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const config = updateEstimator();
      trackEvent('estimator_book_click', config);

      const programSelect = document.getElementById('form-program');
      const messageInput = document.getElementById('form-message');

      if (programSelect) {
        if (config.pathway === 'clinic') {
          programSelect.value = 'Weekend Starter Clinic (Turnkey Arrive & Ride)';
        } else if (config.pathway === 'cadet') {
          programSelect.value = 'Monthly Academy Cadet (Junior 12+ & Adult)';
        } else {
          programSelect.value = 'Open Paddock Practice Pass (Bring Own Machine)';
        }
      }

      if (messageInput) {
        const items = config.breakdown.map(b => `${b.item} (${b.price})`).join(', ');
        messageInput.value = `Estimated Package: ${config.pathwayName} — Total ৳${config.totalPrice.toLocaleString('en-US')} ${config.periodText}. Included Items: ${items}`;
      }

      const formSection = document.getElementById('contact');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const nameInput = document.getElementById('form-name');
          if (nameInput) nameInput.focus();
        }, 600);
      }
    });
  }

  updateEstimator();
}

/* ==========================================================================
   9. Paddock Lead Vault & CSV Manager UI
   ========================================================================== */
let activePaddockVaultTrap = null;

function openPaddockVaultModal() {
  const modal = document.getElementById('paddock-vault-modal');
  if (!modal) return;

  trackEvent('paddock_vault_open');
  modal.style.display = 'grid';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  activePaddockVaultTrap = setupFocusTrap(modal, closePaddockVaultModal);

  const closeBtn = document.getElementById('paddock-vault-close');
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.preventDefault();
      closePaddockVaultModal();
    };
  }

  modal.onclick = (e) => {
    if (e.target === modal) {
      closePaddockVaultModal();
    }
  };

  renderVaultLeads('all');
}

function closePaddockVaultModal() {
  const modal = document.getElementById('paddock-vault-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.style.display = 'none';
  document.body.style.overflow = '';

  if (typeof activePaddockVaultTrap === 'function') {
    activePaddockVaultTrap();
    activePaddockVaultTrap = null;
  }

  const trigger = document.getElementById('paddock-vault-trigger');
  if (trigger) trigger.focus();
}

function renderVaultLeads(activeFilter = 'all') {
  const listEl = document.getElementById('vault-leads-list');
  const totalCountEl = document.getElementById('vault-total-count');
  const feniCountEl = document.getElementById('vault-feni-count');
  const inquiryCountEl = document.getElementById('vault-inquiry-count');
  if (!listEl) return;

  let raw = localStorage.getItem('bmca_lead_vault');
  let leads = [];
  try {
    leads = raw ? JSON.parse(raw) : [];
  } catch (e) {
    leads = [];
  }

  const feniEntries = leads.filter(l => l.type === 'feni_race_entry');
  const inquiries = leads.filter(l => l.type === 'admission_inquiry');

  if (totalCountEl) totalCountEl.textContent = `Total: ${leads.length}`;
  if (feniCountEl) feniCountEl.textContent = `Feni Entries: ${feniEntries.length}`;
  if (inquiryCountEl) inquiryCountEl.textContent = `Inquiries: ${inquiries.length}`;

  const filtered = leads.filter(l => activeFilter === 'all' || l.type === activeFilter);

  listEl.innerHTML = '';
  if (!filtered.length) {
    listEl.innerHTML = `<div class="vault-empty-state">No submissions found in the offline vault. Submit an inquiry or Feni trial registration to see it recorded here.</div>`;
    return;
  }

  // Render leads newest first
  filtered.slice().reverse().forEach(lead => {
    const card = document.createElement('div');
    card.className = 'vault-lead-card';

    const d = lead.data || {};
    const isFeni = lead.type === 'feni_race_entry';
    const badgeText = isFeni ? '⚡ Feni Race Entry' : '🏁 Admission Inquiry';
    const badgeClass = isFeni ? 'feni' : 'academy';
    const dateFormatted = lead.timestamp ? new Date(lead.timestamp).toLocaleString('en-GB') : 'Unknown';

    const cleanPhone = (d.phone || '').replace(/\D/g, '');
    const waLink = cleanPhone ? `https://wa.me/880${cleanPhone.replace(/^0+/, '')}` : '#';

    card.innerHTML = `
      <div class="vault-lead-header">
        <span class="vault-lead-badge ${badgeClass}">${badgeText}</span>
        <span class="vault-lead-time">🕒 ${dateFormatted}</span>
      </div>
      <div class="vault-lead-main">
        <div class="lead-data-field"><strong>Name:</strong> <span>${escapeHtml(d.name || 'N/A')}</span></div>
        <div class="lead-data-field"><strong>WhatsApp:</strong> <span>${escapeHtml(d.phone || 'N/A')}</span></div>
        <div class="lead-data-field"><strong>City:</strong> <span>${escapeHtml(d.city || 'N/A')}</span></div>
        <div class="lead-data-field"><strong>${isFeni ? 'Category' : 'Program'}:</strong> <span>${escapeHtml(d.category || d.program || 'N/A')}</span></div>
        ${d.machine ? `<div class="lead-data-field"><strong>Machine:</strong> <span>${escapeHtml(d.machine)}</span></div>` : ''}
        ${d.bloodGroup ? `<div class="lead-data-field"><strong>Blood Group:</strong> <span>${escapeHtml(d.bloodGroup)}</span></div>` : ''}
        ${d.emergency ? `<div class="lead-data-field"><strong>Emergency Contact:</strong> <span>${escapeHtml(d.emergency)}</span></div>` : ''}
        ${d.scrutCode ? `<div class="lead-data-field"><strong>Scrutineering:</strong> <span>${escapeHtml(d.scrutCode)}</span></div>` : ''}
      </div>
      <div class="vault-lead-actions">
        <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">💬 WhatsApp Lead</a>
        <button type="button" class="btn btn-secondary btn-sm copy-lead-btn" data-lead-id="${lead.id}">📋 Copy Details</button>
      </div>
    `;

    card.querySelector('.copy-lead-btn')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const text = JSON.stringify(lead, null, 2);
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = '📋 Copy Details'; }, 2000);
      });
    });

    listEl.appendChild(card);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function exportVaultToCSV() {
  let raw = localStorage.getItem('bmca_lead_vault');
  let leads = [];
  try {
    leads = raw ? JSON.parse(raw) : [];
  } catch (e) {
    leads = [];
  }

  if (!leads.length) {
    alert('No leads recorded in the vault to export.');
    return;
  }

  trackEvent('paddock_vault_export_csv', { count: leads.length });

  const headers = [
    'Lead ID',
    'Timestamp (UTC)',
    'Submission Type',
    'Name',
    'WhatsApp Phone',
    'City/District',
    'Program / Category',
    'Machine Model',
    'Blood Group',
    'Emergency Contact',
    'Scrutineering Code',
    'Safety Acknowledged'
  ];

  function escapeCSV(val) {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  }

  const rows = [headers.join(',')];

  leads.forEach(l => {
    const d = l.data || {};
    const row = [
      escapeCSV(l.id),
      escapeCSV(l.timestamp),
      escapeCSV(l.type),
      escapeCSV(d.name),
      escapeCSV(d.phone),
      escapeCSV(d.city),
      escapeCSV(d.program || d.category),
      escapeCSV(d.machine || d.equipment || 'N/A'),
      escapeCSV(d.bloodGroup || 'Not Disclosed'),
      escapeCSV(d.emergency || 'N/A'),
      escapeCSV(d.scrutCode || 'N/A'),
      escapeCSV(d.safetyAck ? 'Yes' : 'No')
    ];
    rows.push(row.join(','));
  });

  const csvContent = rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const now = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  a.href = url;
  a.download = `bmca_paddock_leads_${now}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function initPaddockVault() {
  const trigger = document.getElementById('paddock-vault-trigger');
  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openPaddockVaultModal();
    });
  }

  // Keyboard shortcut: Ctrl + Shift + L or Cmd + Shift + L
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      const modal = document.getElementById('paddock-vault-modal');
      if (modal && modal.classList.contains('active')) {
        closePaddockVaultModal();
      } else {
        openPaddockVaultModal();
      }
    }
  });

  // URL query parameter check: ?admin=leads
  if (window.location.search && window.location.search.includes('admin=leads')) {
    setTimeout(openPaddockVaultModal, 300);
  }

  // Filter tabs
  const tabBtns = document.querySelectorAll('.vault-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-vault-filter') || 'all';
      renderVaultLeads(filter);
    });
  });

  // CSV Export button
  const exportBtn = document.getElementById('vault-export-csv-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportVaultToCSV);
  }

  // Clear Vault button
  const clearBtn = document.getElementById('vault-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all leads from this browser’s offline vault? This action cannot be undone.')) {
        localStorage.removeItem('bmca_lead_vault');
        renderVaultLeads('all');
      }
    });
  }
}

/* ==========================================================================
   8. Hero Video Reel & Interactive Sections
   ========================================================================== */
function initHeroVideo() {
  const video = document.getElementById('hero-reel-video');
  if (!video) return;

  const btnToggle = document.getElementById('btn-video-toggle');
  const btnSound = document.getElementById('btn-sound-toggle');
  const playIcon = document.getElementById('play-state-icon');
  const soundIcon = document.getElementById('sound-state-icon');
  const timeDisplay = document.getElementById('video-time-display');
  const progressFill = document.getElementById('video-progress-fill');
  const progressTrack = document.getElementById('video-progress-track');
  const sectionPills = Array.from(document.querySelectorAll('.video-section-pill'));

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function updatePlayState() {
    const isPaused = video.paused;
    if (playIcon) playIcon.textContent = isPaused ? '▶' : '❚❚';
    if (btnToggle) btnToggle.setAttribute('aria-label', isPaused ? 'Play video' : 'Pause video');
  }

  // Play / Pause toggle
  function togglePlay() {
    if (video.paused) {
      const p = video.play();
      if (p !== undefined) {
        p.then(updatePlayState).catch(updatePlayState);
      } else {
        updatePlayState();
      }
    } else {
      video.pause();
      updatePlayState();
    }
  }

  if (btnToggle) {
    btnToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  // Clicking video directly toggles play/pause
  video.addEventListener('click', togglePlay);

  video.addEventListener('play', updatePlayState);
  video.addEventListener('pause', updatePlayState);
  video.addEventListener('playing', updatePlayState);

  // Initial HUD synchronization & low-power / data-saver autoplay rejection handling
  updatePlayState();
  if (video.autoplay) {
    const autoPromise = video.play();
    if (autoPromise !== undefined) {
      autoPromise.then(updatePlayState).catch(() => {
        // Autoplay blocked by mobile browser data-saver or battery saving mode
        updatePlayState();
      });
    }
  }

  // Sound toggle
  if (btnSound) {
    btnSound.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (soundIcon) {
        soundIcon.textContent = video.muted ? '🔇' : '🔊';
      }
      btnSound.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
    });
  }

  // Progress and section pill synchronization
  function updateProgress() {
    const cur = video.currentTime || 0;
    const dur = video.duration || 42;

    if (timeDisplay) {
      timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
    }

    if (progressFill && dur > 0) {
      const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
      progressFill.style.inlineSize = `${pct}%`;
    }

    // Determine active section pill based on current playback timestamp
    let activePill = sectionPills[0];
    for (let i = 0; i < sectionPills.length; i++) {
      const pillTime = parseFloat(sectionPills[i].getAttribute('data-time') || '0');
      if (cur >= pillTime) {
        activePill = sectionPills[i];
      }
    }

    sectionPills.forEach(pill => {
      const isActive = pill === activePill;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('loadedmetadata', updateProgress);

  // Section click navigation
  sectionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetTime = parseFloat(pill.getAttribute('data-time') || '0');
      video.currentTime = targetTime;
      if (video.paused) {
        video.play().catch(() => {});
      }
      updateProgress();
    });
  });

  // Progress track click seeking
  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      if (width > 0 && video.duration) {
        const targetTime = (clickX / width) * video.duration;
        video.currentTime = targetTime;
        updateProgress();
      }
    });
  }
}
