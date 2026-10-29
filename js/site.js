/* ==========================================================================
   CONSTRE SOLUTIONS: site.js
   Everything that is the SAME on every page lives here, so it is edited
   in one place only. Loaded in the <head> of every page, before the page
   is shown.

   CONTENTS
    1. Settings: default language          ← edit
    2. Company details                     ← edit (phone, email, address…)
    3. Menu links                          ← edit
    4. Projects                            ← edit (add photos and projects here)
    5. Start-up (language + logo, runs before the page is shown)
    6. Shared page parts: header, footer, call-to-action band,
       company details + map, project cards

   HOW THE SHARED PARTS GET INTO A PAGE
   Each page has small lines such as
       <script>CONSTRE.render('header')</script>
   at the spot where that part belongs. The line is replaced by the
   finished HTML while the page loads, so there is no flash.

   LANGUAGES
   English text is written here (and in each page's own HTML). The
   Lithuanian text is in js/translations.js, matched by the data-i18n keys.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. SETTINGS
     ------------------------------------------------------------------------ */
  const DEFAULT_LANG = 'lt';           // language for first-time visitors: 'lt' or 'en'
  const LANG_KEY = 'constre-lang';     // where the visitor's choice is remembered


  /* ------------------------------------------------------------------------
     2. COMPANY DETAILS
     Used in the footer of every page and on the contact page (with the map).
     ------------------------------------------------------------------------ */
  const COMPANY = {
    name: 'Constre Solutions',
    street: 'F. Mieliausko g. 6',
    city: 'Vilnius',
    phone: '+37067429699',             // digits only: what the phone dials
    phoneDisplay: '+370 674 29699',    // how the number is shown
    email: 'info@constre.com',
    // Working hours (may contain <br> for a new line).
    // Lithuanian: 'details.hoursValue' in translations.js
    hours: 'Monday–Friday: 8:00–21:00<br>Saturday–Sunday: closed',
    // EDIT: replace each '#' with your profile URL. Icons: phosphoricons.com
    social: [
      { label: 'Facebook', icon: 'facebook-logo', url: '#' },
      { label: 'Instagram', icon: 'instagram-logo', url: '#' },
      { label: 'LinkedIn', icon: 'linkedin-logo', url: '#' },
      { label: 'YouTube', icon: 'youtube-logo', url: '#' }
    ]
  };


  /* ------------------------------------------------------------------------
     3. MENU LINKS
     page: the <body data-page="..."> of the page the link opens, so the
     link is marked as the current page there.
     ------------------------------------------------------------------------ */
  const NAV = [
    { page: 'index', href: 'index.html#home', key: 'nav.home', label: 'Home' },
    { href: 'index.html#services', key: 'nav.services', label: 'Services' },
    { page: 'about', href: 'about.html', key: 'nav.about', label: 'About' },
    { page: 'projects', href: 'projects.html', key: 'nav.projects', label: 'Projects' },
    { page: 'contact', href: 'contact.html', key: 'nav.contact', label: 'Contact' }
  ];

  // Footer "Quick links"
  const FOOTER_LINKS = [
    { href: 'index.html#services', key: 'nav.services', label: 'Services' },
    { page: 'about', href: 'about.html', key: 'nav.about', label: 'About' },
    { page: 'projects', href: 'projects.html', key: 'nav.projects', label: 'Projects' },
    { href: 'index.html#process', key: 'nav.process', label: 'Process' },
    { page: 'contact', href: 'contact.html', key: 'nav.contact', label: 'Contact' }
  ];


  /* ------------------------------------------------------------------------
     4. PROJECTS
     Shown on projects.html (all of them, filterable) and on the homepage
     (the first three). To add a project, copy a line.
       id:       a new number; add 'project.<id>.name' with the Lithuanian
                 name to js/translations.js
       category: 'developing', 'residential', 'commercial', 'tanks',
                 'agricultural' or 'engineering'
       city:     the location, or null to show the [City] placeholder
       image:    a photo path such as 'assets/images/projects/villa.jpg'
                 (landscape, about 1600 × 1200), or null for the placeholder
       alt:      describes the photo for screen readers
     ------------------------------------------------------------------------ */
  const PROJECTS = [
    { id: 1, name: '[Project Name] Family House', category: 'residential', city: null, image: null, alt: '' },
    { id: 2, name: '[Project Name] Warehouse', category: 'commercial', city: null, image: null, alt: '' },
    { id: 3, name: '[Project Name] Residential District', category: 'developing', city: null, image: null, alt: '' },
    { id: 4, name: '[Project Name] Biogas Tank', category: 'tanks', city: null, image: null, alt: '' },
    { id: 5, name: '[Project Name] Farm Building', category: 'agricultural', city: null, image: null, alt: '' },
    { id: 6, name: '[Project Name] Steel Structure', category: 'engineering', city: null, image: null, alt: '' },
    { id: 7, name: '[Project Name] Apartment Building', category: 'residential', city: null, image: null, alt: '' },
    { id: 8, name: '[Project Name] Production Building', category: 'commercial', city: null, image: null, alt: '' },
    { id: 9, name: '[Project Name] Private Housing District', category: 'developing', city: null, image: null, alt: '' },
    { id: 10, name: '[Project Name] Slurry Tank', category: 'tanks', city: null, image: null, alt: '' },
    { id: 11, name: '[Project Name] Silage Clamp', category: 'agricultural', city: null, image: null, alt: '' },
    { id: 12, name: '[Project Name] Reinforced Concrete Structure', category: 'engineering', city: null, image: null, alt: '' }
  ];

  const CATEGORY_LABELS = {
    developing: 'Residential District in Development',
    residential: 'Residential',
    commercial: 'Industrial / Commercial',
    tanks: 'Tank',
    agricultural: 'Agricultural',
    engineering: 'Engineering Solution'
  };


  /* ------------------------------------------------------------------------
     5. START-UP
     Runs immediately, in the <head>, before anything is drawn.
     ------------------------------------------------------------------------ */
  const root = document.documentElement;

  // Language: hide the page until js/main.js has applied the Lithuanian
  // text, so English never flashes first (with a safety timeout).
  let lang = DEFAULT_LANG;
  try { lang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG; } catch (e) { /* storage blocked */ }
  if (lang !== 'en') {
    root.lang = lang;
    root.classList.add('i18n-pending');
    setTimeout(() => root.classList.remove('i18n-pending'), 1500);
  }

  // Animated logo: hide the static logo until js/main.js starts the
  // animation, so it doesn't flash first. Skipped for reduced motion.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    root.classList.add('logo-pending');
    setTimeout(() => root.classList.remove('logo-pending'), 3000);
  }


  /* ------------------------------------------------------------------------
     6. SHARED PAGE PARTS
     ------------------------------------------------------------------------ */

  // Makes a value safe to place inside HTML
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  // The page being built, from <body data-page="...">
  const currentPage = () => document.body.dataset.page || 'index';

  // A link to the page we are already on becomes an in-page link:
  // on the homepage "index.html#services" becomes "#services".
  function localHref(href) {
    const [file, hash] = href.split('#');
    return file === currentPage() + '.html' && hash ? '#' + hash : href;
  }

  // One menu link; marked as the current page when it points here
  function navLink(item, className) {
    const current = item.page === currentPage();
    const cls = [className, current && className ? 'is-active' : ''].filter(Boolean).join(' ');
    return '<li><a' + (cls ? ' class="' + cls + '"' : '') +
      ' href="' + esc(localHref(item.href)) + '"' +
      (current ? ' aria-current="page"' : '') +
      ' data-i18n="' + item.key + '">' + esc(item.label) + '</a></li>';
  }

  const icon = (name) => '<i class="ph-light ph-' + name + '" aria-hidden="true"></i>';
  const arrowButton = (cls, href, key, label) =>
    '<a class="btn ' + cls + '" href="' + href + '"><span data-i18n="' + key + '">' + label + '</span> ' + icon('arrow-right') + '</a>';

  const logo = (cls, lazy) => {
    const loading = lazy ? ' loading="lazy"' : '';
    return '<img' + (cls ? ' class="' + cls + '__mark"' : '') + ' src="assets/images/logo-mark-light.png" alt="" width="360" height="423"' + loading + '>' +
      (cls ? '<canvas class="' + cls + '__anim" aria-hidden="true"></canvas>' : '') +
      '<img' + (cls ? ' class="' + cls + '__word"' : '') + ' src="assets/images/logo-wordmark-light.png" alt="' + esc(COMPANY.name) + '" width="844" height="146"' + loading + '>';
  };

  const mapQuery = () => encodeURIComponent(COMPANY.street + ', ' + COMPANY.city);
  const telLink = () => '<a href="tel:' + esc(COMPANY.phone) + '">' + esc(COMPANY.phoneDisplay) + '</a>';
  const mailLink = () => '<a href="mailto:' + esc(COMPANY.email) + '">' + esc(COMPANY.email) + '</a>';

  const PARTS = {

    /* Header: transparent over the hero, solid charcoal once you scroll
       (js/main.js). Hamburger menu below 1360px (see css/styles.css). */
    header() {
      return '' +
        '<header class="site-header" id="site-header">' +
          '<div class="container header__bar">' +
            '<a class="brand" href="' + localHref('index.html#home') + '" aria-label="Constre Solutions home" data-i18n-attr="aria-label:a11y.home">' + logo('brand') + '</a>' +
            '<nav class="site-nav" id="site-nav" aria-label="Main" data-i18n-attr="aria-label:a11y.mainNav">' +
              '<ul class="site-nav__list">' + NAV.map((item) => navLink(item, 'site-nav__link')).join('') + '</ul>' +
              '<a class="btn btn--primary site-nav__cta" href="' + (currentPage() === 'contact' ? '#quote' : 'contact.html') + '" data-i18n="cta.quote">Get a Quote</a>' +
            '</nav>' +
            '<div class="lang-switch" role="group" aria-label="Language" data-i18n-attr="aria-label:a11y.language">' +
              '<button class="lang-switch__btn" type="button" data-lang="en" lang="en" aria-pressed="false">EN</button>' +
              '<button class="lang-switch__btn" type="button" data-lang="lt" lang="lt" aria-pressed="false">LT</button>' +
            '</div>' +
            '<button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">' +
              '<span class="menu-toggle__icon" aria-hidden="true"><span></span></span>' +
              '<span class="visually-hidden" data-i18n="a11y.menu">Menu</span>' +
            '</button>' +
          '</div>' +
        '</header>';
    },

    /* Call-to-action band, used above the footer */
    cta() {
      return '' +
        '<section class="cta" aria-labelledby="cta-title">' +
          '<div class="cta__plane" aria-hidden="true"></div>' +
          '<div class="container cta__inner" data-reveal>' +
            '<div class="cta__copy">' +
              '<h2 class="cta__title" id="cta-title" data-i18n="cta.title">Planning a build?</h2>' +
              '<p data-i18n="cta.text">Tell us about the job and we\'ll come back with a clear, written quote.</p>' +
            '</div>' +
            arrowButton('btn--primary btn--large', 'contact.html', 'cta.contact', 'Contact Us') +
          '</div>' +
        '</section>';
    },

    /* Footer: brand, quick links and contact on one row, then a thin
       bottom bar. The short lime tick on the top rule echoes the logo. */
    footer() {
      const social = COMPANY.social.map((s) =>
        '<li><a href="' + esc(s.url) + '" aria-label="' + esc(s.label) + '">' + icon(s.icon) + '</a></li>').join('');
      return '' +
        '<footer class="site-footer">' +
          '<div class="container">' +
            '<div class="footer__main">' +
              '<div class="footer__brand">' +
                '<a class="footer__logo" href="' + localHref('index.html#home') + '">' + logo('', true) + '</a>' +
                '<p data-i18n="footer.text">General construction, building and tank construction of every kind. A team of specialists with over 20 years of experience.</p>' +
                '<ul class="social" aria-label="Follow us" data-i18n-attr="aria-label:footer.follow">' + social + '</ul>' +
              '</div>' +
              '<nav class="footer__col" aria-label="Footer" data-i18n-attr="aria-label:footer.nav">' +
                '<h2 class="footer__heading" data-i18n="footer.links">Quick links</h2>' +
                '<ul class="footer__links">' + FOOTER_LINKS.map((item) => navLink(item, '')).join('') + '</ul>' +
              '</nav>' +
              '<div class="footer__col">' +
                '<h2 class="footer__heading" data-i18n="footer.contact">Contact</h2>' +
                '<ul class="footer__contact">' +
                  '<li>' + icon('map-pin') + '<span>' + esc(COMPANY.street + ', ' + COMPANY.city) + '</span></li>' +
                  '<li>' + icon('phone') + telLink() + '</li>' +
                  '<li>' + icon('envelope-simple') + mailLink() + '</li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
            '<div class="footer__bottom">' +
              '<p>© ' + new Date().getFullYear() + ' ' + esc(COMPANY.name) + '. <span data-i18n="footer.rights">All rights reserved.</span></p>' +
              '<a href="#main"><span data-i18n="footer.top">Back to top</span> ' + icon('arrow-up') + '</a>' +
            '</div>' +
          '</div>' +
        '</footer>';
    },

    /* Contact page: company details, Google map and a link to open it.
       The map follows the address in COMPANY above. */
    details() {
      const row = (iconName, key, label, value, valueKey) =>
        '<div><dt>' + icon(iconName) + '<span data-i18n="' + key + '">' + label + '</span></dt>' +
        '<dd' + (valueKey ? ' data-i18n="' + valueKey + '"' : '') + '>' + value + '</dd></div>';
      const place = esc(COMPANY.street + ', ' + COMPANY.city);
      return '' +
        '<dl class="details">' +
          row('map-pin', 'details.address', 'Address', esc(COMPANY.street) + '<br>' + esc(COMPANY.city)) +
          row('phone', 'details.phone', 'Phone', telLink()) +
          row('envelope-simple', 'details.email', 'Email', mailLink()) +
          row('clock', 'details.hours', 'Working hours', COMPANY.hours, 'details.hoursValue') +
        '</dl>' +
        '<div class="map">' +
          '<iframe src="https://maps.google.com/maps?q=' + mapQuery() + '&amp;z=16&amp;output=embed"' +
            ' title="Google Maps: ' + place + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' +
        '</div>' +
        '<a class="map__link" href="https://www.google.com/maps/search/?api=1&amp;query=' + mapQuery() + '" target="_blank" rel="noopener">' +
          '<span data-i18n="map.open">Open in Google Maps</span> ' + icon('arrow-up-right') +
        '</a>';
    },

    /* Project cards. options.limit: show only the first N (homepage). */
    projects(options) {
      const list = options.limit ? PROJECTS.slice(0, options.limit) : PROJECTS;
      return list.map((p) => {
        const media = p.image
          ? '<img src="' + esc(p.image) + '" alt="' + esc(p.alt) + '" width="1600" height="1200" loading="lazy">'
          : '<div class="placeholder" role="img" aria-label="Project photo placeholder" data-i18n-attr="aria-label:project.photoAlt">' +
              '<span class="placeholder__label" data-i18n="project.photoLabel">Project photo · 1600 × 1200</span></div>';
        const city = p.city
          ? '<dd>' + esc(p.city) + '</dd>'
          : '<dd data-i18n="project.city">[City]</dd>';
        return '' +
          '<li class="project" data-category="' + p.category + '">' +
            '<div class="project__media">' + media + '</div>' +
            '<dl class="title-block">' +
              '<div class="title-block__name"><dt data-i18n="project.label">Project</dt><dd data-i18n="project.' + p.id + '.name">' + esc(p.name) + '</dd></div>' +
              '<div><dt data-i18n="project.location">Location</dt>' + city + '</div>' +
              '<div><dt data-i18n="project.type">Type</dt><dd data-i18n="category.' + p.category + '">' + CATEGORY_LABELS[p.category] + '</dd></div>' +
            '</dl>' +
          '</li>';
      }).join('');
    }
  };

  // Replaces the <script> that calls it with the finished part
  function render(part, options) {
    const script = document.currentScript;
    script.insertAdjacentHTML('beforebegin', PARTS[part](options || {}));
    script.remove();
  }

  // Shared with js/main.js
  window.CONSTRE = { DEFAULT_LANG, LANG_KEY, render, company: COMPANY };
})();
