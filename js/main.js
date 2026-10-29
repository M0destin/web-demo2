/* ==========================================================================
   CONSTRE SOLUTIONS: main.js
   Plain JavaScript, no libraries. Runs at the end of every page, after
   js/site.js has built the header, footer and project cards.

   CONTENTS
    1. Helpers
    2. Sticky header (turns solid after the hero)
    3. Mobile menu
    4. Active nav link highlighting
    5. Scroll reveal animations
    6. Stat counters
    7. Project filtering
    8. Contact form (checks + sending)
    9. Animated logo
   10. Language switch (EN / LT)
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. HELPERS
     ------------------------------------------------------------------------ */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasObserver = 'IntersectionObserver' in window;
  const SITE = window.CONSTRE || { DEFAULT_LANG: 'en', LANG_KEY: 'constre-lang' };

  const header = $('#site-header');
  const menuToggle = $('#menu-toggle');
  const hero = $('.hero, .page-hero');      // homepage hero or an inner page's banner

  // Texts used by the script come from js/translations.js ("ui" section).
  // A missing text falls back to English, then to the key itself.
  const TRANSLATIONS = window.CONSTRE_TRANSLATIONS || { ui: { en: {} } };
  let currentLang = 'en';
  const t = (key) => {
    const ui = TRANSLATIONS.ui;
    const own = (ui[currentLang] || {})[key];
    if (own !== undefined) return own;
    return ui.en[key] !== undefined ? ui.en[key] : key;
  };


  /* ------------------------------------------------------------------------
     2. STICKY HEADER
     The header is transparent over the hero and turns charcoal once the
     top 40px of the hero have scrolled past it.
     ------------------------------------------------------------------------ */
  if (hasObserver && hero) {
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:40px;pointer-events:none;';
    hero.prepend(sentinel);

    new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-solid', !entry.isIntersecting);
    }).observe(sentinel);
  } else {
    // No hero on the page, or a very old browser
    const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ------------------------------------------------------------------------
     3. MOBILE MENU
     Smooth scrolling for in-page links is done by CSS (scroll-behavior),
     including the offset for the fixed header (scroll-padding-top).
     ------------------------------------------------------------------------ */
  const desktopQuery = window.matchMedia('(min-width: 1360px)');   // same width as the desktop nav in styles.css

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  }

  menuToggle.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  // Choosing a link closes the menu (needed for links within the same page)
  $$('#site-nav a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  // Escape closes the menu and returns focus to the button
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('is-open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  // Growing the window to desktop size closes the mobile menu
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });


  /* ------------------------------------------------------------------------
     4. ACTIVE NAV LINK HIGHLIGHTING
     On the homepage, the in-page link (#home, #services) for the section
     crossing the middle of the screen is marked active. Sections without
     a menu link (e.g. Projects) clear the mark. Links to other pages are
     marked in js/site.js and are left alone here.
     ------------------------------------------------------------------------ */
  const hashLinks = $$('.site-nav__link[href^="#"]');

  function setActive(id) {
    hashLinks.forEach((link) => {
      const active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  if (hasObserver && hashLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    $$('main section[id]').forEach((section) => sectionObserver.observe(section));
  }


  /* ------------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS
     Elements with the data-reveal attribute (and project cards) fade and
     rise into place the first time they scroll into view. Neighbouring
     items are staggered slightly. Skipped for reduced-motion users.
     ------------------------------------------------------------------------ */
  const revealItems = $$('[data-reveal], .project');

  if (hasObserver && !reduceMotion) {
    document.documentElement.classList.add('reveal-on');

    // Stagger siblings: 70ms apart, max 4 steps
    const revealSet = new Set(revealItems);
    revealItems.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((child) => revealSet.has(child));
      if (siblings.length > 1) el.style.setProperty('--delay', (siblings.indexOf(el) % 4) * 70 + 'ms');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach((el) => revealObserver.observe(el));
  }


  /* ------------------------------------------------------------------------
     6. STAT COUNTERS
     Counts from 0 up to data-target when the number comes into view.
     Without animation the final numbers written in the HTML are shown.
     ------------------------------------------------------------------------ */
  const COUNT_DURATION = 1600; // milliseconds

  function countUp(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / COUNT_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 4);           // fast start, gentle stop
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (hasObserver && !reduceMotion) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    $$('.stat__num[data-target]').forEach((el) => {
      el.textContent = '0' + (el.dataset.suffix || '');   // start from 0, not flash the final number first
      counterObserver.observe(el);
    });
  }


  /* ------------------------------------------------------------------------
     7. PROJECT FILTERING (projects.html)
     Each button's data-filter is matched against the cards' data-category.
     Where the browser supports View Transitions, the cards glide into
     their new positions; elsewhere they simply update.
     ------------------------------------------------------------------------ */
  const grid = $('#projects-grid');
  const statusEl = $('#projects-status');
  let shownCount = null;               // last count announced, re-announced on language change
  let filterLabelSync = null;          // updates the phone dropdown's label on language change

  function announceCount() {
    if (statusEl && shownCount !== null) statusEl.textContent = t('projectsShown')(shownCount);
  }

  if (grid) {
    const filterButtons = $$('.filter');
    const cards = $$('.project', grid);

    // Each card needs a unique name for the transition to track it
    cards.forEach((card, i) => { card.style.viewTransitionName = 'project-' + (i + 1); });

    const dropdown = filterDropdown(filterButtons);   // the phone dropdown, kept in step with the buttons

    const applyFilter = (button) => {
      const filter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn === button)));
      if (dropdown) dropdown.select(filter);
      grid.dataset.filter = filter;

      shownCount = 0;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.hidden = !match;
        if (match) {
          shownCount++;
          card.classList.add('is-in');   // never leave a filtered-in card waiting for its reveal
        }
      });
      announceCount();
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.getAttribute('aria-pressed') === 'true') return;
        if (document.startViewTransition && !reduceMotion) {
          document.startViewTransition(() => applyFilter(button));
        } else {
          applyFilter(button);
        }
      });
    });

    // Choosing in the dropdown presses the matching button
    if (dropdown) {
      filterLabelSync = dropdown.syncLabel;
      dropdown.onChoose = (value) => {
        const button = filterButtons.find((btn) => btn.dataset.filter === value);
        if (button) button.click();
      };
    }
  }

  /* Phone dropdown for the project filter (projects.html).
     A "select-only combobox": focus stays on the button, the arrow keys move
     through the options (aria-activedescendant), Enter or Space chooses,
     Escape or a click outside closes. Its options are copied from the
     filter buttons, so categories are listed once, in projects.html.
     Returns null if the page has none. */
  function filterDropdown(filterButtons) {
    const root = $('#filter-select');
    if (!root) return null;
    const button = $('.filter-select__button', root);
    const valueEl = $('.filter-select__value', root);
    const list = $('.filter-select__list', root);

    filterButtons.forEach((btn) => {
      const option = document.createElement('li');
      option.className = 'filter-select__option';
      option.id = 'filter-opt-' + btn.dataset.filter;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', btn.getAttribute('aria-pressed'));
      option.dataset.value = btn.dataset.filter;
      option.dataset.i18n = btn.dataset.i18n;      // follows the language switch (section 10)
      option.innerHTML = btn.innerHTML;
      list.append(option);
    });
    const options = $$('[role="option"]', list);
    let active = 0;                    // option highlighted with the arrow keys
    const api = { onChoose: null };

    const selectedIndex = () => Math.max(0, options.findIndex((o) => o.getAttribute('aria-selected') === 'true'));
    const isOpen = () => root.classList.contains('is-open');

    // Button label = the chosen option's text (in the current language)
    api.syncLabel = () => { valueEl.textContent = options[selectedIndex()].textContent; };

    // Mark an option as chosen (called by the filter, so buttons and dropdown agree)
    api.select = (value) => {
      options.forEach((o) => o.setAttribute('aria-selected', String(o.dataset.value === value)));
      api.syncLabel();
    };

    function setActive(i) {
      active = (i + options.length) % options.length;
      options.forEach((o, n) => o.classList.toggle('is-active', n === active));
      button.setAttribute('aria-activedescendant', options[active].id);
      options[active].scrollIntoView({ block: 'nearest' });
    }

    function open() {
      root.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      setActive(selectedIndex());
    }

    function close() {
      root.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      button.removeAttribute('aria-activedescendant');
      options.forEach((o) => o.classList.remove('is-active'));
    }

    function choose(i) {
      close();
      button.focus();
      if (i !== selectedIndex() && api.onChoose) api.onChoose(options[i].dataset.value);
    }

    button.addEventListener('click', () => (isOpen() ? close() : open()));

    button.addEventListener('keydown', (event) => {
      const key = event.key;
      if (!isOpen()) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
          event.preventDefault();
          open();
        }
        return;
      }
      const moves = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: options.length - 1 };
      if (key in moves) {
        event.preventDefault();
        setActive(moves[key]);
      } else if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        choose(active);
      } else if (key === 'Escape') {
        event.preventDefault();
        close();
      } else if (key === 'Tab') {
        close();
      }
    });

    options.forEach((option, i) => {
      option.addEventListener('mousedown', (event) => event.preventDefault());   // keep focus on the button
      option.addEventListener('mousemove', () => { if (active !== i) setActive(i); });
      option.addEventListener('click', () => choose(i));
    });

    // A tap or click anywhere else closes the list
    document.addEventListener('pointerdown', (event) => {
      if (isOpen() && !root.contains(event.target)) close();
    });

    api.syncLabel();
    return api;
  }


  /* ------------------------------------------------------------------------
     8. CONTACT FORM
     Checks the fields here, then sends them to api/contact.php, which
     checks everything again and emails the request to info@constre.com.
     Spam protection (see api/contact.php): a hidden honeypot field, a
     signed timestamp from the server, and Cloudflare Turnstile.
     ------------------------------------------------------------------------ */
  const form = $('#contact-form');
  const formStatus = $('#form-status');
  const API_URL = 'api/contact.php';
  const MIN_WAIT = 3500;                   // the server ignores forms sent within 3 s of loading
  const TOKEN_REFRESH = 60 * 60 * 1000;    // the server refuses timestamps older than 2 hours

  // Length in characters, counted like the server does (ą and emoji = 1)
  const chars = (value) => [...value].length;

  // Each rule returns an error message, or '' when the value is fine. The
  // limits match api/lib/validate.php. Texts: js/translations.js → ui.
  const rules = {
    name(value) {
      if (!value) return t('nameEmpty');
      if (chars(value) < 2 || chars(value) > 100) return t('nameLength');
      return '';
    },
    email(value) {
      if (!value) return t('emailEmpty');
      if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return t('emailInvalid');
      return '';
    },
    phone(value) {
      if (value && !/^[0-9 +()-]{1,30}$/.test(value)) return t('phoneInvalid');
      return '';
    },
    company(value) {
      return chars(value) > 150 ? t('companyLength') : '';
    },
    message(value) {
      if (!value) return t('messageEmpty');
      if (chars(value) < 10) return t('messageShort');
      if (chars(value) > 5000) return t('messageLong');
      return '';
    }
  };

  // Puts a message (or nothing) in an element, after an icon.
  // {email} and {phone} in the message become links to the company's.
  function setMessage(el, iconName, message) {
    el.textContent = '';
    if (!message) return;
    const icon = document.createElement('i');
    icon.className = 'ph-light ph-' + iconName;
    icon.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    const company = SITE.company || {};
    message.split(/(\{email\}|\{phone\})/).forEach((part) => {
      if (part !== '{email}' && part !== '{phone}') { text.append(part); return; }
      const link = document.createElement('a');
      link.href = part === '{email}' ? 'mailto:' + company.email : 'tel:' + company.phone;
      link.textContent = part === '{email}' ? company.email : company.phoneDisplay;
      text.append(link);
    });
    el.append(icon, text);
  }

  // Shows (or clears) the error under a field
  function setFieldError(field, message) {
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    const errorEl = document.getElementById(field.id + '-error');
    if (errorEl) setMessage(errorEl, 'warning-circle', message);
  }

  function validate(field) {
    const rule = rules[field.name];
    if (!rule) return true;
    const message = rule(field.value.trim());
    setFieldError(field, message);
    return !message;
  }

  // The server's error codes (api/lib/validate.php) → the same texts as above.
  // Used when the server rejects a value the browser accepted, e.g. an
  // email address with Lithuanian letters.
  function serverFieldError(field, code) {
    const length = chars(field.value.trim());
    const keys = {
      name: { empty: 'nameEmpty', length: 'nameLength' },
      email: { empty: 'emailEmpty', invalid: 'emailInvalid' },
      phone: { invalid: 'phoneInvalid' },
      company: { length: 'companyLength' },
      message: { empty: 'messageEmpty', length: length < 10 ? 'messageShort' : 'messageLong' }
    };
    const key = (keys[field.name] || {})[code];
    return key ? t(key) : '';
  }

  // Success or error under the button, announced to screen readers
  function showStatus(kind) {
    formStatus.classList.toggle('is-error', kind === 'error');
    setMessage(formStatus, kind === 'error' ? 'warning-circle' : 'check', t(kind));
    formStatus.hidden = false;
    formStatus.focus();
  }

  if (form) {
    const fields = $$('.field input, .field textarea', form);   // not the hidden honeypot
    const honeypot = $('#website', form);
    const turnstileEl = $('#turnstile', form);
    const submitBtn = $('button[type="submit"]', form);
    const submitLabel = $('.btn__label', submitBtn);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // ---- From the server: Turnstile key + signed timestamp --------------
    let siteKey = '';
    let formToken = '';
    let tokenTime = 0;
    let widget = null;

    async function loadFormToken() {
      try {
        const response = await fetch(API_URL, { headers: { Accept: 'application/json' }, cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.formToken) throw new Error('form unavailable');
        siteKey = data.siteKey;
        formToken = data.formToken;
        tokenTime = Date.now();
        renderTurnstile();
      } catch (e) {
        formToken = '';                   // the visitor sees the error (with email/phone) on sending
      }
    }

    function renderTurnstile() {
      if (widget !== null || !siteKey || !window.turnstile) return;
      widget = window.turnstile.render(turnstileEl, {
        sitekey: siteKey,
        action: 'quote',
        appearance: 'interaction-only',  // invisible unless Cloudflare needs the visitor to click
        language: currentLang
      });
    }
    // Called by the Turnstile script (contact.html) once it has loaded
    window.constreTurnstileReady = renderTurnstile;

    // Turnstile usually has its answer within a second or two; wait up to 10 s
    async function turnstileToken() {
      for (let i = 0; i < 40; i++) {
        const token = widget !== null && window.turnstile ? window.turnstile.getResponse(widget) : '';
        if (token) return token;
        await sleep(250);
      }
      return '';
    }

    loadFormToken();
    // Keep the timestamp fresh when the page stays open for a long time
    setInterval(loadFormToken, TOKEN_REFRESH);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && Date.now() - tokenTime > TOKEN_REFRESH) loadFormToken();
    });

    // ---- Field checks ---------------------------------------------------
    // Check a field when the visitor leaves it; once it shows an error, re-check as they type
    fields.forEach((field) => {
      field.addEventListener('blur', () => { if (field.value.trim()) validate(field); });
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validate(field);
      });
    });

    function setSending(sending, label) {
      submitBtn.disabled = sending;
      submitBtn.toggleAttribute('aria-busy', sending);
      if (sending) submitLabel.textContent = t('sending');
      else submitLabel.innerHTML = label;
    }

    // ---- Send -----------------------------------------------------------
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submitBtn.disabled) return;                 // already sending
      formStatus.hidden = true;

      const invalid = fields.filter((field) => !validate(field));
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      const label = submitLabel.innerHTML;           // the label in the current language
      setSending(true);
      let outcome = 'error';
      try {
        if (!formToken) await loadFormToken();
        if (!formToken) throw new Error('form unavailable');
        // A very quick visitor (or a just-refreshed timestamp) would look like a bot
        await sleep(Math.max(0, MIN_WAIT - (Date.now() - tokenTime)));

        const payload = { lang: currentLang, website: honeypot.value, formToken, turnstileToken: await turnstileToken() };
        fields.forEach((field) => { payload[field.name] = field.value.trim(); });

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));

        if (response.ok && result.ok) {
          outcome = 'success';
          form.reset();
          fields.forEach((field) => field.removeAttribute('aria-invalid'));
        } else if (result.fields) {
          // The server disagreed about a field: show the error next to it
          const flagged = Object.keys(result.fields)
            .map((name) => form.elements[name])
            .filter((field) => field && rules[field.name]);
          flagged.forEach((field) => {
            if (validate(field)) setFieldError(field, serverFieldError(field, result.fields[field.name]));
          });
          const shown = flagged.filter((field) => field.getAttribute('aria-invalid') === 'true');
          if (shown.length) {
            outcome = null;                           // the field errors say it all
            shown[0].focus();
          }
        }
      } catch (e) {
        outcome = 'error';                            // offline, or the server can't be reached
      }

      // Each Turnstile answer works once: get a fresh one for the next try
      if (widget !== null && window.turnstile) window.turnstile.reset(widget);
      setSending(false, label);
      if (outcome) showStatus(outcome);
    });
  }


  /* ------------------------------------------------------------------------
     9. ANIMATED LOGO
     The header's "C" mark builds itself from assets/logo-animation.mp4 each
     time a page opens, then the wordmark slides in. The video has a white
     background, so each frame is redrawn on a small canvas: the white turns
     transparent, the dark planes turn light (keeping their shading) and the
     lime stays lime. Each frame is processed at twice the display size and
     then scaled down smoothly, so the edges stay crisp. If the
     video can't play (blocked, missing, or the page opened as a file), the
     static logo is shown. Skipped for reduced-motion visitors.
     ------------------------------------------------------------------------ */
  (function animatedLogo() {
    const root = document.documentElement;
    const brand = $('.brand');
    const canvas = brand && brand.querySelector('.brand__anim');
    const showStatic = () => {
      if (brand) brand.classList.remove('brand--anim', 'brand--done');
      root.classList.remove('logo-pending');
    };
    if (!canvas || reduceMotion || !canvas.getContext) { showStatic(); return; }

    // EDIT: where the "C" sits in the 1920 x 1080 video frame, and the second
    // at which it is fully built (the video then goes on to draw the text,
    // which the header already shows as an image).
    const CROP = { x: 770, y: 222, w: 372, h: 436 };
    const STOP_AT = 2.4;
    const BG = 253;      // the video's background (near white)
    const SOLID = 80;    // planes darker than this are fully solid (the logo's greys are 44–72)
    // Dark planes become light on the dark header, keeping their shading:
    // the darkest grey (DARK) becomes LIGHT_MAX, lighter greys a little darker
    const DARK = 48;
    const LIGHT_MAX = 245;
    const SHADE = 0.55;
    const LIGHT_MIN = 225;

    const video = document.createElement('video');
    video.muted = true;
    video.setAttribute('muted', '');
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.preload = 'auto';
    video.src = 'assets/logo-animation.mp4';
    video.setAttribute('aria-hidden', 'true');
    video.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;';
    document.body.appendChild(video);

    // Canvas at the logo's height in styles.css times the screen's pixel
    // density, same proportions as the crop
    const cssHeight = parseFloat(getComputedStyle(canvas).height) || 46;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.width = Math.round(canvas.height * CROP.w / CROP.h);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';

    // Off-screen working canvas at twice that size (at most the crop's own size)
    const work = document.createElement('canvas');
    work.height = Math.min(CROP.h, canvas.height * 2);
    work.width = Math.round(work.height * CROP.w / CROP.h);
    const workCtx = work.getContext('2d', { willReadFrequently: true });
    workCtx.imageSmoothingQuality = 'high';
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    let started = false;
    let finished = false;
    const timers = [];

    function drawFrame() {
      workCtx.drawImage(video, CROP.x, CROP.y, CROP.w, CROP.h, 0, 0, work.width, work.height);
      const img = workCtx.getImageData(0, 0, work.width, work.height);   // throws on file:// pages
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const alpha = clamp((BG - Math.min(r, g, b)) / (BG - SOLID), 0, 1);   // how far from white
        if (alpha < 0.02) { d[i + 3] = 0; continue; }
        // The pixel's own colour, without the white it is blended with at the edges
        const fr = clamp((r - BG * (1 - alpha)) / alpha, 0, 255);
        const fg = clamp((g - BG * (1 - alpha)) / alpha, 0, 255);
        const fb = clamp((b - BG * (1 - alpha)) / alpha, 0, 255);
        const fMin = Math.min(fr, fg, fb);
        const lime = clamp((Math.max(fr, fg, fb) - fMin) / 80, 0, 1);         // how colourful
        const light = clamp(LIGHT_MAX - (fMin - DARK) * SHADE, LIGHT_MIN, LIGHT_MAX);
        // Lime keeps its colour; grey becomes light
        d[i] = lime * fr + (1 - lime) * light;
        d[i + 1] = lime * fg + (1 - lime) * light;
        d[i + 2] = lime * fb + (1 - lime) * light;
        d[i + 3] = alpha * 255;
      }
      workCtx.putImageData(img, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(work, 0, 0, canvas.width, canvas.height);              // smooth scale-down
    }

    // Ends the animation once: success keeps the drawn logo, failure shows the static one
    function end(ok) {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      video.pause();
      video.remove();
      if (ok) brand.classList.add('brand--done');
      else showStatic();
    }

    const nextFrame = (cb) => (video.requestVideoFrameCallback
      ? video.requestVideoFrameCallback(cb)
      : requestAnimationFrame(cb));

    function tick() {
      if (finished) return;
      try { drawFrame(); } catch (e) { end(false); return; }
      if (!started) {
        started = true;
        brand.classList.add('brand--anim');
        root.classList.remove('logo-pending');
      }
      if (video.currentTime >= STOP_AT || video.ended) { end(true); return; }
      nextFrame(tick);
    }

    video.addEventListener('error', () => end(false));
    video.addEventListener('playing', () => nextFrame(tick), { once: true });
    const playing = video.play();
    if (playing && playing.catch) playing.catch(() => end(false));
    // Slow connection: don't hold the logo back for long
    timers.push(setTimeout(() => { if (!started) end(false); }, 1500));
    // Playback stalled part-way: fall back to the static logo
    timers.push(setTimeout(() => end(false), 6000));
  })();


  /* ------------------------------------------------------------------------
     10. LANGUAGE SWITCH (EN / LT)
     English is what's written in the pages. When Lithuanian is chosen,
     every element with data-i18n="key" gets the matching text from
     js/translations.js; switching back restores the original English.
     The choice is remembered in the browser. The default language for
     first-time visitors is set in js/site.js (section 1).
     ------------------------------------------------------------------------ */
  const langButtons = $$('.lang-switch__btn');
  const textEls = $$('[data-i18n]');
  const attrEls = $$('[data-i18n-attr]');

  // "aria-label:key;title:key2" → [['aria-label', 'key'], ['title', 'key2']]
  const attrPairs = (el) => el.dataset.i18nAttr.split(';').map((pair) => pair.split(':').map((s) => s.trim()));

  // Remember the English that's in the page so we can switch back
  textEls.forEach((el) => { el._en = el.innerHTML; });
  attrEls.forEach((el) => {
    el._enAttrs = {};
    attrPairs(el).forEach(([attr]) => { el._enAttrs[attr] = el.getAttribute(attr); });
  });

  function setLanguage(lang, save) {
    if (lang !== 'en' && !TRANSLATIONS[lang]) lang = 'en';
    currentLang = lang;
    const dict = TRANSLATIONS[lang] || {};

    textEls.forEach((el) => {
      const value = lang === 'en' ? el._en : dict[el.dataset.i18n];
      if (value !== undefined) el.innerHTML = value;   // missing LT keys keep the English
    });

    attrEls.forEach((el) => {
      attrPairs(el).forEach(([attr, key]) => {
        const value = lang === 'en' ? el._enAttrs[attr] : dict[key];
        if (value !== undefined && value !== null) el.setAttribute(attr, value);
      });
    });

    document.documentElement.lang = lang;
    langButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));

    // Texts written by this script follow the new language
    if (form) $$('[aria-invalid="true"]', form).forEach((field) => validate(field));
    if (formStatus) formStatus.hidden = true;
    announceCount();
    if (filterLabelSync) filterLabelSync();

    if (save) {
      try { localStorage.setItem(SITE.LANG_KEY, lang); } catch (e) { /* storage blocked: still works for this visit */ }
    }
  }

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang, true));
  });

  // Starting language: the visitor's saved choice, otherwise the default
  let startLang = SITE.DEFAULT_LANG;
  try { startLang = localStorage.getItem(SITE.LANG_KEY) || SITE.DEFAULT_LANG; } catch (e) { /* storage blocked */ }
  setLanguage(startLang, false);

  // Show the page (js/site.js hides it until the language is applied)
  document.documentElement.classList.remove('i18n-pending');
})();
