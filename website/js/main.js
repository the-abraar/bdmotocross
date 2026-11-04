/**
 * Bangladesh Motocross Club & Academy (BMCA)
 * Main Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRaceCountdown();
  initRacerFiltersAndModal();
  initCalendarFilters();
  initGalleryAndLightbox();
  initRegistrationForm();
});

/* ==========================================================================
   1. Navigation & Scrollspy
   ========================================================================== */
function initNavigation() {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
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

    // Close menu when clicking outside or on a link
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
        navLinks.forEach(link => {
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
   2. Next Race Countdown Timer
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

/* ==========================================================================
   3. Racer Roster Filtering & Interactive Profile Modal
   ========================================================================== */
const racerProfiles = {
  mr99: {
    number: 'MR99',
    name: 'Md. Mahabubur Rahman Hafiz',
    role: 'Director & Champion Racer',
    category: 'Pro Track Champion',
    location: 'Chittagong, Bangladesh',
    photo: 'images/race-start.jpg',
    sponsor: 'DCS (Official Sponsor)',
    service: 'Moto Freak Lab (Service Partner)',
    bio: 'Md. Mahabubur Rahman Hafiz (MR99) is the Director of Bangladesh Motocross Club & Academy and an acclaimed pioneer of competitive motocross in Bangladesh. Leading from Chittagong, he spearheads rider training, national championship participation, and youth motorsport development.',
    achievements: [
      { title: 'Champion of the Curves 2025', detail: 'Category: Pro Track — Champion 🏆' },
      { title: 'Chittagong Hill Track Trial 2025', detail: 'Category: Pro Track — 1st Runner-Up 🥈' },
      { title: 'Furious Track Trial 2025', detail: 'Category: Pro Track — 2nd Runner-Up 🥉' },
      { title: 'Moto Madness 2025', detail: 'Category: Pro Track — 4th Runner-Up' }
    ]
  },
  bulbul: {
    number: '#07',
    name: 'Salauddin Ahmed Bulbul (Baundal Bulbul)',
    role: 'Official Mentor & Pro Category Racer',
    category: 'Pro Category Racer / Official Academy Mentor',
    location: 'Narsingdi, Bangladesh',
    photo: 'images/baundal-bulbul.jpg',
    sponsor: 'DCS / TWM Certified',
    service: 'Moto Freak Lab',
    bio: 'Salauddin Ahmed Bulbul is the Official Mentor of Bangladesh Motocross Club & Academy, appointed for official rider instruction. He completed an intensive 6-Month Enduro and Motocross training program at the TWM Academy of Moto Adventure in Kolkata, India. He also competes actively in premier off-road events across Bangladesh and India.',
    achievements: [
      { title: 'TWM Academy of Moto Adventure (Kolkata, India)', detail: '6-Month Enduro & Motocross Certified Training' },
      { title: 'Moto Madness 2025 — Season 2', detail: 'Pro Track — 2nd Runner-Up 🥉' },
      { title: 'Furious Track Trial 2024 — Season 1 & 2', detail: '1st Runner-Up in both Season 1 and Season 2 🥈' },
      { title: 'SR Dirt Fest 2024 (Singur, West Bengal, India)', detail: 'International Race — 4th Runner-Up' }
    ]
  },
  sharif: {
    number: '#05',
    name: 'Sharif ON Track',
    role: 'Official Pro Racer',
    category: 'Pro Track Racer',
    location: 'Chittagong, Bangladesh',
    photo: 'images/sharif-on-track.jpg',
    sponsor: 'DCS / BMCA Racing Team',
    service: 'Moto Freak Lab',
    bio: 'Sharif ON Track (Racing Code: 05) is a high-speed off-road and circuit competitor representing Chittagong and Bangladesh Motocross Club & Academy. Known for his fearless throttle discipline and technical control in treacherous mud and dirt conditions.',
    achievements: [
      { title: 'Suzuki Off-Road Championship 2026', detail: 'Pro Category — 2nd Runner-Up 🥉' },
      { title: 'FBR Mega Get Together CampFest 2025', detail: 'Off-Road Racing — 1st Runner-Up 🥈 (Organizer: Feni Bike Riders)' }
    ]
  },
  sultan: {
    number: '#77',
    name: 'Sultan Sheikh',
    role: 'Official Pro Racer',
    category: 'Pro Category Racer',
    location: 'Bangladesh',
    photo: 'images/sultan-sheikh.jpg',
    sponsor: 'DCS / BMCA Racing Team',
    service: 'Moto Freak Lab',
    bio: 'Sultan Sheikh (Racing Number #77) is an elite competitor for Bangladesh Motocross Club & Academy. With exceptional agility on technical hill climbs and high-speed tracks, he has clinched top podium positions in major national motocross tournaments.',
    achievements: [
      { title: 'Moto Madness 2025 — Season 2', detail: 'Pro Track — 1st Runner-Up 🥈' },
      { title: 'Chattogram Hill Track Champion 2025', detail: 'Pro Category — 2nd Runner-Up 🥉' }
    ]
  }
};

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

  // Open Modal
  document.querySelectorAll('[data-racer-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-racer-id');
      const data = racerProfiles[id];
      if (!data || !modal) return;

      document.getElementById('modal-racer-num').textContent = data.number;
      document.getElementById('modal-racer-name').textContent = data.name;
      document.getElementById('modal-racer-role').textContent = data.role;
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
        div.innerHTML = `<strong>🏆 ${ach.title}</strong><span>${ach.detail}</span>`;
        listEl.appendChild(div);
      });

      modal.classList.add('active');
      document.body.classList.add('modal-open');
    });
  });

  // Close Modal
  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
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

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ==========================================================================
   4. Racing Event Calendar Filters & Registration Prefill
   ========================================================================== */
function initCalendarFilters() {
  const tabs = document.querySelectorAll('.calendar-tab');
  const rows = document.querySelectorAll('.event-row');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-year');
      rows.forEach(row => {
        const year = row.getAttribute('data-year');
        if (filter === 'all' || year === filter) {
          row.style.display = 'grid';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // "Register / Inquire" links on event rows
  document.querySelectorAll('.event-inquire-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventName = btn.getAttribute('data-event-name');
      const programSelect = document.getElementById('form-program');
      const commentsInput = document.getElementById('form-message');

      if (programSelect) {
        programSelect.value = 'race_event';
      }
      if (commentsInput) {
        commentsInput.value = `Inquiry regarding participation in: ${eventName}`;
      }

      // Smooth scroll to contact
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (commentsInput) commentsInput.focus();
        }, 600);
      }
    });
  });
}

/* ==========================================================================
   5. Racing Gallery & Lightbox
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

  // Open Lightbox
  function updateActiveList() {
    activeList = Array.from(items).filter(item => item.style.display !== 'none');
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
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
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.classList.remove('modal-open');
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
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

/* ==========================================================================
   6. Academy Registration & Contact Form
   ========================================================================== */
function initRegistrationForm() {
  const form = document.getElementById('academy-form');
  const statusEl = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const city = document.getElementById('form-city').value.trim();
    const program = document.getElementById('form-program').value;
    const experience = document.getElementById('form-exp').value;
    const message = document.getElementById('form-message').value.trim();

    if (!name || !phone) {
      if (statusEl) {
        statusEl.textContent = 'Please fill in your name and phone number.';
        statusEl.style.color = '#ff3b3b';
      }
      return;
    }

    // Build WhatsApp Message Payload
    const text = encodeURIComponent(
      `🏍️ *BMCA Official Inquiry / Registration*\n` +
      `------------------------------------\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone / WhatsApp:* ${phone}\n` +
      `📍 *City:* ${city || 'Chittagong'}\n` +
      `🎯 *Program / Subject:* ${program}\n` +
      `🏁 *Riding Experience:* ${experience}\n` +
      `💬 *Message:* ${message || 'I would like to join Bangladesh Motocross Club & Academy.'}`
    );

    const waUrl = `https://wa.me/8801975376114?text=${text}`;

    if (statusEl) {
      statusEl.textContent = 'Redirecting to BMCA WhatsApp...';
      statusEl.className = 'form-status success';
    }

    // Open WhatsApp in new tab
    setTimeout(() => {
      window.open(waUrl, '_blank');
      form.reset();
      if (statusEl) {
        statusEl.textContent = 'Thank you! Your message was prepared on WhatsApp.';
      }
    }, 600);
  });
}
