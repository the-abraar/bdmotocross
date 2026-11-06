/* BMCA — site.js (no dependencies) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WA = '8801975376114';
  const RACE_START = new Date('2026-11-15T09:00:00+06:00').getTime();

  /* ---------- hero entrance: next frame so the headline transition runs ---------- */
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('ready')));

  /* ---------- nav, progress, menu ---------- */
  const nav = $('#nav'), bar = $('.progress');
  let lastY = scrollY;
  const onScrollNav = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('solid', y > 40);
    nav.classList.toggle('hide', y > 500 && y > lastY && !menuOpen());
    lastY = y;
    bar.style.setProperty('--p', max > 0 ? y / max : 0);
  };

  const burger = $('.nav-burger'), menu = $('#menu');
  const menuOpen = () => !menu.hidden;
  const setMenu = (open) => {
    menu.hidden = !open; burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!menuOpen()));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen()) setMenu(false); });

  // highlight the section in view
  const links = $$('.nav-links a');
  const navIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section[id]').forEach(s => navIO.observe(s));

  /* ---------- reveal on scroll ---------- */
  const revealIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  $$('[data-reveal]').forEach(el => {
    const sibs = $$(':scope > [data-reveal]', el.parentElement);
    el.style.setProperty('--d', (sibs.indexOf(el) * 0.08).toFixed(2) + 's');
    revealIO.observe(el);
  });

  /* ---------- scroll-scrubbed statements: words light up as you read ---------- */
  const scrubs = $$('[data-scrub]').map(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span> `).join('');
    return { el, words: $$('.w', el) };
  });
  const runScrub = () => scrubs.forEach(({ el, words }) => {
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.4)));
    const lit = p * words.length;
    words.forEach((w, i) => w.style.setProperty('--o', Math.min(1, Math.max(0.14, lit - i))));
  });

  /* ---------- parallax ---------- */
  const para = $$('[data-speed]');
  const runPara = () => para.forEach(el => {
    const r = el.getBoundingClientRect();
    const off = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.speed);
    el.style.translate = `0 ${off.toFixed(1)}px`;
  });

  let ticking = false;
  const frame = () => {
    onScrollNav();
    if (!reduce) { runScrub(); runPara(); }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame);
  if (reduce) scrubs.forEach(({ words }) => words.forEach(w => w.style.setProperty('--o', 1)));
  frame();

  /* ---------- hero phone: tilt + sound ---------- */
  const phone = $('.phone');
  if (phone && !reduce && matchMedia('(pointer: fine)').matches) {
    $('.hero').addEventListener('pointermove', e => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      phone.style.setProperty('--ry', (-8 + x * 14).toFixed(2) + 'deg');
      phone.style.setProperty('--rx', (4 - y * 10).toFixed(2) + 'deg');
    });
  }
  // Autoplay only when it won't eat a visitor's data: no Data Saver, no reduced motion, not 2g/3g.
  const reel = phone && $('video', phone), conn = navigator.connection;
  const cheap = !conn || (!conn.saveData && !/(^|-)(2g|3g)$/.test(conn.effectiveType || ''));
  if (reel && cheap && !reduce) addEventListener('load', () => reel.play().catch(() => {}), { once: true });
  const snd = $('.phone-sound');
  snd?.addEventListener('click', () => {
    reel.muted = !reel.muted; reel.play().catch(() => {});
    snd.setAttribute('aria-pressed', !reel.muted);
    snd.setAttribute('aria-label', reel.muted ? 'Play reel with sound' : 'Mute reel');
  });

  /* ---------- count-up stats ---------- */
  const countIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    countIO.unobserve(en.target);
    const el = en.target, to = +el.dataset.count, t0 = performance.now();
    const tick = t => { const p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(tick); };
    reduce ? (el.textContent = to) : requestAnimationFrame(tick);
  }));
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- race countdown ---------- */
  const cds = $$('[data-countdown]');
  const pad = n => String(n).padStart(2, '0');
  const runCountdown = () => {
    let ms = Math.max(0, RACE_START - Date.now());
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    cds.forEach(c => { $('[data-d]', c).textContent = pad(d); $('[data-h]', c).textContent = pad(h); $('[data-m]', c).textContent = pad(m); $('[data-s]', c).textContent = pad(s); });
  };
  runCountdown(); setInterval(runCountdown, 1000);

  /* ---------- rider track arrows ---------- */
  const track = $('.rider-track');
  $$('[data-scroll]').forEach(b => b.addEventListener('click', () => {
    const card = $('.rider', track);
    track.scrollBy({ left: +b.dataset.scroll * (card.offsetWidth + 20), behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* ---------- academy stage stepper ---------- */
  const stageNum = $('#stage-num'), stageFill = $('#stage-fill');
  const stageIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    $$('.stage').forEach(s => s.classList.toggle('on', s === en.target));
    const n = en.target.dataset.stage;
    if (stageNum.textContent !== n) {
      stageNum.classList.add('flip');
      setTimeout(() => { stageNum.textContent = n; stageNum.classList.remove('flip'); }, reduce ? 0 : 180);
    }
    stageFill.style.width = (+n / 4 * 100) + '%';
  }), { rootMargin: '-45% 0px -45% 0px' });
  $$('.stage').forEach(s => stageIO.observe(s));

  /* ---------- fixtures season tabs ---------- */
  const tabs = $$('.season-tabs button');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-pressed', x === t));
    $$('.event').forEach(ev => { ev.hidden = t.dataset.year !== 'all' && ev.dataset.year !== t.dataset.year; });
  }));

  /* ---------- gallery filter + lightbox ---------- */
  const chips = $$('.chips button'), shots = $$('.shot');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.setAttribute('aria-pressed', x === c));
    shots.forEach(s => { s.hidden = c.dataset.filter !== 'all' && s.dataset.cat !== c.dataset.filter; });
  }));

  const lb = $('#lightbox'), stage = $('.lb-stage', lb), cap = $('figcaption', lb);
  let lbList = [], lbIdx = 0;
  const lbShow = i => {
    lbIdx = (i + lbList.length) % lbList.length;
    const s = lbList[lbIdx];
    stage.innerHTML = s.video
      ? `<video src="${s.video}" controls autoplay playsinline></video>`
      : `<img src="${s.src}" alt="">`;
    $('img', stage)?.setAttribute('alt', s.alt);
    cap.textContent = `${String(lbIdx + 1).padStart(2, '0')} / ${String(lbList.length).padStart(2, '0')} — ${s.cap}`;
  };
  const lbOpen = (list, i) => { lbList = list; lbShow(i); lb.showModal(); };
  shots.forEach(s => s.addEventListener('click', () => {
    const vis = shots.filter(x => !x.hidden);
    lbOpen(vis.map(x => ({ src: $('img', x).src, alt: $('img', x).alt, cap: $('.cap', x).textContent, video: x.dataset.video })), vis.indexOf(s));
  }));
  $('.prev', lb).addEventListener('click', () => lbShow(lbIdx - 1));
  $('.next', lb).addEventListener('click', () => lbShow(lbIdx + 1));
  $('.x', lb).addEventListener('click', () => lb.close());
  lb.addEventListener('close', () => { stage.innerHTML = ''; });
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') lbShow(lbIdx - 1);
    if (e.key === 'ArrowRight') lbShow(lbIdx + 1);
  });

  /* ---------- rider dossiers ---------- */
  const RIDERS = {
    mr99: {
      num: '99', role: 'Director · Pro track champion', name: 'Md. Mahabubur Rahman Hafiz', img: 'images/race-start.jpg',
      bio: 'Widely known across Bangladeshi motorsport as MR99, he is the founding Director of Bangladesh Motocross Club & Academy and a pro track champion. Based in Chittagong, he has dedicated his career to building competitive tracks, organising safety protocols and coaching the next generation of riders. As Director and lead tactician he oversees racer contracts and track inspections, and leads expedition trials across Bangladesh.',
      specs: [['Racing ID', 'MR99'], ['Club role', 'Director & lead tactician'], ['Class', 'Pro Track 250cc'], ['Machine', 'Honda CRF250R (4-stroke DOHC)'], ['Base', 'Chittagong, Bangladesh'], ['Partners', 'DCS · Moto Freak Lab']],
      results: [['Champion', 'Champion of the Curves 2025', 'Pro Track', 'gold'], ['P2', 'Chittagong Hill Track Trial 2025', 'Pro Track · 1st runner-up'], ['P3', 'Furious Track Trial 2025', 'Pro Track · 2nd runner-up'], ['P5', 'Moto Madness 2025', 'Pro Track · 4th runner-up']],
      docs: [['images/club-delegation-handover-ceremony.jpg', 'Racer induction ceremony'], ['images/team-trail-srimongol-sylhet.jpg', 'Srimongol trail expedition']]
    },
    bulbul: {
      num: '07', role: 'Official academy mentor · Lead track coach', name: 'Salauddin Ahmed Bulbul', img: 'images/baundal-bulbul.jpg',
      bio: 'Known on the track as Baundal Bulbul (#07). Appointed Official Mentor of the academy, he leads student rider development, track discipline and technical instruction. After formal international training in India, he actively competes in premier off-road events across Bangladesh and South Asia.',
      quote: '“Motocross demands complete synchrony between the machine and the rider’s mind. We train students to understand friction, suspension compression and track topography before chasing top-end speed. Safety gear and mental composure are our foundation.”',
      specs: [['Designation', 'Official academy mentor (1-yr term)'], ['Racing code', 'Baundal Bulbul #07'], ['Class', 'Pro Track & Enduro 250cc'], ['Machine', 'Yamaha YZ250F (4-stroke DOHC)'], ['Hometown', 'Narsingdi, Bangladesh'], ['Certified by', 'TWM Academy of Moto Adventure, Kolkata']],
      results: [['P3', 'Moto Madness 2025 — Season 2', 'Pro Track · 2nd runner-up'], ['P2', 'Furious Track Trial 2024 — Season 1', 'Track trial · 1st runner-up'], ['P2', 'Furious Track Trial 2024 — Season 2', 'Track trial · 1st runner-up'], ['P5', 'SR Dirt Fest 2024 (International)', 'Singur, Hooghly, West Bengal · 4th runner-up']],
      note: '<b>Enduro & Motocross — 6-month intensive course.</b> TWM Academy of Moto Adventure, Kolkata: competitive dirt dynamics, centre-of-gravity balance, rut navigation, high-speed berm cornering, obstacle clearance and track marshaling standards.'
    },
    sharif: {
      num: '05', role: 'Pro track racer · Racing code 05', name: 'Sharif ON Track', img: 'images/sharif-on-track.jpg',
      bio: 'Mohammad Sharif Hossain is one of the club’s premier high-speed circuit competitors, representing Chittagong. Known for aggressive lines, unflinching corner entry and fearless throttle discipline in mud and clay, he has represented BMCA with distinction across national off-road meets.',
      specs: [['Racing code', '05'], ['Class', 'Pro Track 250cc'], ['Machine', 'Suzuki RM-Z250 (4-stroke)'], ['Base', 'Chittagong & Cumilla, BD'], ['Contract', '2-year pro track tenure'], ['Partners', 'DCS · Moto Freak Lab']],
      results: [['P2', 'FBR Mega Get Together CampFest 2025', 'Off-road track trail S1 · Feni Bike Riders · ৳12,000 & CFMoto medal'], ['P3', 'Suzuki Off-Road Championship 2026', 'Pro Category · 2nd runner-up']],
      docs: [['images/appointment-letter-sharif-on-track.jpg', 'Appointment letter (নিয়োগপত্র)'], ['images/sharif-signing-contract.jpg', 'Contract signing'], ['images/sharif-fbr-podium-trophy.jpg', 'FBR CampFest podium']]
    },
    sultan: {
      num: '77', role: 'Pro category racer · #77', name: 'Sultan Sheikh', img: 'images/sultan-sheikh.jpg',
      bio: 'Md. Sultan Ahmed — Sultan Sheikh #77 — is an elite Pro Category competitor from Sylhet. His fearless style on technical dirt slopes and steep hill trails has made him a front-runner in national off-road trials, with podiums in major national motocross tournaments.',
      specs: [['Racing number', '#77'], ['Class', 'Pro Open Category'], ['Machine', 'KTM 250 SX-F (4-stroke)'], ['Base', 'Sylhet & Chittagong, BD'], ['Contract', '2-year pro category tenure'], ['Partners', 'DCS · Moto Freak Lab']],
      results: [['P2', 'Moto Madness 2025 — Season 2', 'Pro Category · 1st runner-up'], ['P3', 'Chattogram Hill Track Champion 2025', 'Pro Category · 2nd runner-up']],
      docs: [['images/appointment-letter-sultan-sheikh.jpg', 'Appointment letter (নিয়োগপত্র)'], ['images/club-delegation-handover-ceremony.jpg', 'Club handover ceremony']]
    }
  };
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const dlg = $('#dossier');
  const openDossier = id => {
    const r = RIDERS[id];
    $('#d-img').src = r.img; $('#d-img').alt = r.name;
    $('#d-num').textContent = r.num; $('#d-role').textContent = r.role;
    $('#d-name').textContent = r.name; $('#d-bio').textContent = r.bio;
    $('#d-specs').innerHTML = r.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    $('#d-results').innerHTML = r.results.map(([p, t, d, cls]) => `<li><b class="${cls || ''}">${esc(p)}</b><span>${esc(t)}<small>${esc(d)}</small></span></li>`).join('');
    $('#d-extra').innerHTML =
      (r.quote ? `<blockquote class="d-note">${esc(r.quote)}</blockquote>` : '') +
      (r.note ? `<p class="d-note" style="margin-top:12px">${r.note}</p>` : '') +
      (r.docs ? `<h3 class="mono" style="margin:20px 0 12px;color:var(--mute)">On file</h3><div class="d-docs">${r.docs.map(([src, label], i) => `<button type="button" data-doc="${i}"><img src="${src}" alt="" loading="lazy">${esc(label)}</button>`).join('')}</div>` : '');
    $$('[data-doc]', dlg).forEach(b => b.addEventListener('click', () =>
      lbOpen(r.docs.map(([src, label]) => ({ src, alt: label, cap: label })), +b.dataset.doc)));
    $('#d-wa').href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hello BMCA, I'd like to connect about ${r.name}.`)}`;
    dlg.showModal(); dlg.scrollTop = 0;
  };
  $$('[data-dossier]').forEach(b => b.addEventListener('click', () => openDossier(b.dataset.dossier)));
  $('.x', dlg).addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

  /* ---------- mobile action bar: hide while the contact form is on screen ---------- */
  const mbar = $('#mbar');
  new IntersectionObserver(([en]) => mbar.classList.toggle('off', en.isIntersecting)).observe($('#contact'));

  /* ---------- enquiry form → WhatsApp ---------- */
  const form = $('#enquiry'), interest = $('#f-interest'), raceBox = $('.race-fields', form), status = $('.form-status', form);
  const isRace = () => interest.value.startsWith('Race entry');
  const syncRace = () => {
    raceBox.hidden = !isRace();
    ['#f-machine', '#f-emergency', '#f-ack'].forEach(s => { $(s).required = isRace(); });
  };
  interest.addEventListener('change', syncRace);
  syncRace();

  $$('[data-enquire]').forEach(b => b.addEventListener('click', () => {
    const want = b.dataset.enquire;
    const opt = [...interest.options].find(o => o.value === want || o.value.startsWith(want));
    if (opt) interest.value = opt.value;
    syncRace();
    $('#contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => $('#f-name').focus({ preventScroll: true }), reduce ? 0 : 700);
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
    const phone = $('#f-phone');
    phone.value = phone.value.replace(/[\s-]/g, '');
    const bad = $$('input, select, textarea', form).filter(el => !el.checkValidity());
    if (bad.length) {
      bad.forEach(el => el.setAttribute('aria-invalid', 'true'));
      status.className = 'form-status mono err';
      status.textContent = bad.includes(phone) && phone.value ? 'Please enter a valid Bangladeshi mobile number (01XXXXXXXXX).' : 'Please fill in the required fields.';
      bad[0].focus();
      return;
    }
    const f = new FormData(form), g = k => (f.get(k) || '').toString().trim();
    const lines = [
      `*BMCA ${isRace() ? 'race entry' : 'enquiry'}*`,
      `Name: ${g('name')}`, `WhatsApp: ${g('phone')}`, g('city') && `City: ${g('city')}`,
      `Interest: ${g('interest')}`, `Bike & gear: ${g('equipment')}`, `Experience: ${g('experience')}`,
      ...(isRace() ? [`Class: ${g('class')}`, `Machine: ${g('machine')}`, `Blood group: ${g('blood')}`, `Emergency contact: ${g('emergency')}`, 'Safety rules: agreed'] : []),
      g('message') && `Message: ${g('message')}`
    ].filter(Boolean);
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    status.className = 'form-status mono ok';
    status.textContent = 'Opening WhatsApp — hit send there and the paddock desk will reply.';
  });
})();
