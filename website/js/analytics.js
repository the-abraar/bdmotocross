/* BMCA — analytics.js
   PostHog: pageviews, every click (autocapture), scroll depth, heatmaps and session replay,
   plus named events (window.track) for the funnels that matter: academy rider codes, enquiries, sponsors. */
(() => {
  'use strict';
  // Project API key from PostHog → Project settings. It is a public, write-only key; safe in page source.
  const KEY = 'phc_sqhMuJPFTDQuWe7Qar8emyt2GLJ6dpkdgvHjqEDxQCZ6';
  const HOST = 'https://eu.i.posthog.com'; // project lives on PostHog EU cloud

  window.track = (event, props) => window.posthog?.capture?.(event, props);
  // Only count the live site, so local previews don't pollute the numbers.
  if (!KEY || !/(^|\.)bdmotocross\.com$/.test(location.hostname)) return;

  // PostHog's documented snippet contract: queue calls on a stub until array.js loads and replays them.
  const ph = window.posthog = [];
  ph._i = []; ph.__SV = 1;
  ['capture', 'register'].forEach(m => { ph[m] = (...a) => ph.push([m, ...a]); });
  ph.init = (k, c) => ph._i.push([k, c, 'posthog']);
  const s = document.createElement('script');
  s.async = true; s.crossOrigin = 'anonymous';
  s.src = HOST.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js';
  document.head.append(s);

  ph.init(KEY, {
    api_host: HOST,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,          // carries max scroll depth per page
    autocapture: true,                // every click, with the element's text and data-* attributes
    enable_heatmaps: true,
    session_recording: { maskAllInputs: true } // replays never show what people type
  });

  // What they see: one event per section that crosses the middle of the screen.
  const seen = new Set();
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    const id = en.target.id;
    if (!en.isIntersecting || seen.has(id)) return;
    seen.add(id);
    window.track('section_viewed', { section: id });
  }), { rootMargin: '-50% 0px -50% 0px' });
  const watch = () => document.querySelectorAll('main section[id]').forEach(el => io.observe(el));
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', watch) : watch();

  // What they click, by name: any element marked data-track="event" (data-from says which one).
  addEventListener('click', e => {
    const el = e.target.closest('[data-track]');
    if (el) window.track(el.dataset.track, { from: el.dataset.from, label: el.textContent.trim().slice(0, 80), href: el.getAttribute('href') });
  }, true);
})();
