---
name: CONSTRE SOLUTIONS
description: A construction company's site drawn like its own drawing set, with charcoal planes, one lime plane and hairline rules.
colors:
  charcoal: "#2B2B2B"
  charcoal-2: "#3A3A3A"
  lime: "#8DC63F"
  lime-press: "#7AB12F"
  grey: "#6E6E6E"
  grey-light: "#F2F2F2"
  grey-line: "#DADADA"
  white: "#FFFFFF"
  on-dark-soft: "#C4C4C4"
  line-on-dark: "rgba(255, 255, 255, 0.14)"
  field-line: "#BDBDBD"
  error: "#B42318"
typography:
  display:
    fontFamily: "Michroma, Eurostile, Arial, sans-serif"
    fontSize: "clamp(1.6rem, 0.6rem + 4.6vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "0.03em"
  headline:
    fontFamily: "Michroma, Eurostile, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 1rem + 2vw, 2.6rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.04em"
  stat:
    fontFamily: "Michroma, Eurostile, Arial, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 2.6vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "tnum"
  title:
    fontFamily: "Michroma, Eurostile, Arial, sans-serif"
    fontSize: "clamp(0.95rem, 0.85rem + 0.3vw, 1.05rem)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.04em"
  lead:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.16em"
    fontVariation: "'wdth' 118"
  button:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.1em"
    fontVariation: "'wdth' 118"
rounded:
  none: "0"
spacing:
  space-1: "0.25rem"
  space-2: "0.5rem"
  space-3: "0.75rem"
  space-4: "1rem"
  space-5: "1.5rem"
  space-6: "2rem"
  space-7: "3rem"
  space-8: "4rem"
  space-9: "6rem"
  section: "clamp(4.5rem, 3rem + 5vw, 8.5rem)"
  gutter: "clamp(1rem, 0.4rem + 3vw, 2.5rem)"
  container: "1240px"
  angle: "clamp(32px, 6vw, 96px)"
  cut: "12px"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.charcoal}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1.6rem"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.lime-press}"
    textColor: "{colors.charcoal}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1.6rem"
    height: "50px"
  button-outline-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.charcoal}"
  filter:
    backgroundColor: "{colors.white}"
    textColor: "{colors.charcoal}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.55rem 1.1rem"
    height: "44px"
  filter-active:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.white}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.none}"
    padding: "0.75rem 0.9rem"
    height: "52px"
  select-on-dark:
    backgroundColor: "{colors.charcoal-2}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "0.7rem 2.75rem 0.7rem 0.9rem"
    height: "50px"
  lang-switch:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 0.6rem"
    height: "44px"
    width: "44px"
  lang-switch-active:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
  lang-switch-hover:
    backgroundColor: "{colors.charcoal-2}"
    textColor: "{colors.white}"
  details-panel:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.white}"
    padding: "2rem"
---

# Design System: CONSTRE SOLUTIONS

> **For the owner.** Every value in this file lives in the `:root` block at the top of `css/styles.css` (section "0. DESIGN TOKENS"). The token names below match the CSS variable names there, so `lime` here is `--lime` in the stylesheet. Change it in `:root` and it changes everywhere.

> **Two languages.** The site is in English and Lithuanian. English text is written directly in `index.html`; Lithuanian text is in `js/translations.js`. Each piece of text has a `data-i18n` key in `index.html` and the same key in `translations.js`, so when you change a sentence, change it in both files. New text needs a new key in both. Both fonts include Lithuanian letters (Google Fonts serves the latin-ext set automatically), so no font change is needed for either language.

## Overview

**Creative North Star: "The Company's Own Drawing Set"**

The site reads like a set of construction drawings issued by the company itself. The logo's angled charcoal planes become the structure of the page: dark bands for the home hero and the inner-page banners, dark bands for the process, the call-to-action band and the footer, white and pale grey for the sections people read. One lime plane, borrowed from the logo, appears once per dark band and crosses an edge. The details are drawing conventions rather than web decoration: a faint sheet grid on charcoal, dimension lines with end ticks under figures, title-block strips under project photos, ruled compartments instead of floating cards.

It is solid, flat and precise. Corners are square, edges are cut on the logo's slope, and there are no soft shadows, gradients or rounded cards. Headings are wide, uppercase and evenly spaced like the "SOLUTIONS" wordmark; body text is a plain, readable sans. Motion is short and mechanical: things rise into a mask, rules draw in from the left, photos are revealed upwards.

**Key Characteristics:**
- Charcoal and white bands, one lime plane per dark band, lime never used as text on light backgrounds.
- Zero radius everywhere; angles come from `clip-path` cuts on the logo's slope.
- Hairline compartments (1px gaps showing a line colour) instead of cards with shadows.
- Drawing conventions as detail: sheet grid, dimension lines, title blocks.
- Michroma uppercase headings at weight 400; Archivo for everything else, with a wider cut for labels.
- Unconfirmed content is shown in [square brackets] on the page until it is replaced.

## Colors

A near-monochrome charcoal-and-white palette taken from the logo, with one saturated lime accent kept rare on purpose.

### Primary
- **Logo Lime** (`lime`): the accent. Fills the primary button, the angled planes (home hero photo corner, inner-page banners, About photo, CTA band), thin rules (active nav underline, active language underline, service hover rule, start of the process line, active filter underline), the check squares' ticks, focus rings on dark surfaces and text selection. On charcoal it may also colour short text: the process step numbers.
- **Pressed Lime** (`lime-press`): the primary button's hover and pressed state only.

### Neutral
- **Logo Charcoal** (`charcoal`): body text on light backgrounds, and the ground of the home hero, inner-page banners, process, CTA band, footer, contact details panel and mobile menu.
- **Surface Charcoal** (`charcoal-2`): a second dark layer on charcoal: dark image placeholders.
- **Site Grey** (`grey`): secondary text on light backgrounds (section leads, service descriptions, stat labels, hints) and the dimension-line rules.
- **Paper Grey** (`grey-light`): background of alternating reading sections (About, Testimonials) and the form success message.
- **Rule Grey** (`grey-line`): hairlines on light backgrounds: compartment gaps, project card borders, title-block rules, filter borders, light placeholders.
- **White** (`white`, also `--on-dark`): reading-section background and all primary text on charcoal.
- **Soft Light** (`on-dark-soft`): secondary text on charcoal (about 8:1 contrast).
- **Line on Dark** (`line-on-dark`): hairlines on charcoal: footer compartments, menu dividers, icon-button borders, the rest of the process line.
- **Field Line** (`field-line`): the 1px border of contact-form fields, chosen for a 3:1 edge against white.
- **Error Red** (`error`): form error text and invalid-field borders only. Not a brand colour.

### Named Rules
**The Focus Contrast Rule.** Keyboard focus is a 2px outline in `--focus`: charcoal on white and grey sections, lime on charcoal (the header, home hero, inner-page banners, dark sections, CTA band, contact details panel and footer switch `--focus` to `--lime`). A new dark area must set `--focus: var(--lime)` too.

**The Lime Plane Rule.** Lime appears as a plane, a line, a button fill, or a focus ring on dark surfaces. It is never used for text on white or grey (too faint to read). On charcoal it may mark one word or a number, nothing longer.

**The One Plane Rule.** Each dark band carries at most one lime plane (home hero: the triangle in the photo box's bottom-left corner; inner-page banners: the parallelogram cut by the angled bottom edge; CTA band: the slab on the right). Light sections get one at most too (About photo). Its rarity is what makes it read as the logo.

## Typography

**Display Font:** Michroma (with Eurostile, Arial), set by `--font-display`
**Body Font:** Archivo (with Helvetica Neue, Arial), set by `--font-body`; loaded from Google Fonts with its width axis (62 to 125)

**Character:** A wide, squared technical display face for every heading, always uppercase and lightly tracked, paired with a sturdy grotesque that widens (`--label-stretch: 118%`) for small labels so they echo the display face without its weight.

### Hierarchy
- **Display** (400, `--text-hero`, line-height 1.12, tracking 0.03em, uppercase): reserved for large display headlines. The home hero headline is a longer sentence set smaller (clamp 1.6rem to 3rem, line-height 1.25 to leave room for Lithuanian accents).
- **Headline** (400, `--text-h2`, 1.2, tracking `--tracking-display`, uppercase): section titles and the CTA title.
- **Stat** (400, `--text-stat`, 1, tabular figures): the About figures.
- **Title** (400, `--text-h3`, 1.45, uppercase): service names and project names in title blocks. Process step titles use the larger `--text-lg` (22px).
- **Lead** (400, `--text-md` 19px): the sentence under a section title and the hero subhead; capped at 46 to 62 characters per line.
- **Body** (400, `--text-base` 17px, line-height 1.65): reading text; descriptions capped at 34 to 38ch, paragraphs at 62ch. Quotes use `--text-lg` at 1.5.
- **Label** (600, `--text-xs` 12px, tracking `--tracking-label` 0.16em, uppercase, 118% width): form labels, title-block headings, stat labels, footer headings, filter buttons, the EN / LT switch (at 700). Desktop nav links use the same label type but tighter tracking (0.1em) and never wrap, so the longer Lithuanian labels fit.
- **Button** (700, `--text-sm` 14px, tracking 0.1em, uppercase, 118% width): all buttons.

### Named Rules
**The Wordmark Rule.** Every Michroma heading is uppercase, weight 400, with positive tracking (`--tracking-display`, 0.04em). Michroma has one weight; never fake bold.

**The Two Faces Rule.** Michroma is for headings, the mobile menu links, big numbers and project names. Everything else is Archivo.

## Layout

Mobile-first: the base CSS is the phone layout and `@media (min-width: ...)` blocks add columns at 640px, 720px, 900px, 960px and 1024px. The header grows from 72px to 80px (`--header-h`) at 1024px, but the inline desktop navigation only starts at 1360px so the Lithuanian labels fit on one line; below 1360px the hamburger menu is used. The 1360px value is written in two places: `css/styles.css` (section 3) and `js/main.js` (section 3). Change both together.

Every layout must hold in both languages. Lithuanian words run longer than English, so leave room in buttons, labels and headings rather than sizing them to the English text.

Content sits in one centred column, `--container` (1240px) wide plus `--gutter` on each side (16px minimum). Sections are separated by bands of colour rather than dividers, each with `--section-space` top and bottom padding. Spacing uses the `--space-1` to `--space-9` scale (4px to 96px); section heads sit `--space-8` above their content.

Grids step up by count: services 1 then 2 columns (four cards, 2 × 2); projects 1, 2, 3 with the first project spanning two columns and two rows when "All" is selected; process steps stack vertically on phones with the line on the left and run in four columns from 900px with the line across the top; testimonials 1 then 3; contact form and details side by side from 1024px (7:5).

A quote is reachable from every section: the header button, the hero "Get a Quote" button, the CTA band and the contact form.

### Named Rules
**The Sheet Grid Rule.** Dark bands (home hero, inner-page banners, process, CTA band, footer) carry the faint 64px drawing grid `--sheet-grid`. Light sections never do.

## Elevation & Depth

The system is flat. Depth comes from bands of charcoal against white, from one lime plane overlapping an edge (the inner-page banner planes are cut by the angled edge, the home hero triangle sits in the photo box corner, the About plane sits behind the photo like a second layer of the logo), and from 1px rules. There is no shadow on cards or buttons.

### Shadow Vocabulary
- **Fixed-header lift** (`box-shadow: 0 1px 0 var(--line-on-dark), 0 10px 30px rgba(20, 20, 20, 0.22)`): once the page is scrolled, so it separates from the page beneath.
- **Active underline** (`box-shadow: inset 0 -3px 0 var(--lime)`, 2px on the language switch): the selected project filter and the active language. A line, not a lift.
- **Focus ring** (`box-shadow: 0 0 0 3px var(--lime)` with a charcoal border): contact form fields in focus.

### Named Rules
**The Flat Drawing Rule.** Surfaces never float. If something needs separating, give it a 1px rule or a different band colour, not a shadow.

## Shapes

Square corners everywhere (`--radius: 0`). The form language is the logo's: straight planes cut on a diagonal.

- **Angled section edges:** the home hero's and inner-page banners' bottom edge and the Process band's top edge are cut on a slope `--angle` high (32 to 96px), rising from left to right, using `clip-path`.
- **Cut corner:** the primary button loses its bottom-right corner (`--cut`, 12px).
- **Logo planes:** lime polygons, never rectangles: the inner-page banner parallelogram, the home hero corner triangle, the About plane with a sloped top, the CTA slab with a sloped left side.
- **Hairline compartments:** services and the footer are grids with a 1px gap over a line-coloured background, so the gaps draw the rules.
- **Dimension line:** a 1px horizontal rule with 11px end ticks under each stat, drawn in from the left; the first one is charcoal, the rest grey.
- **Title block:** under each project photo, a ruled strip (name across the top, two labelled cells below) like the corner box of a drawing.
- **Icons:** Phosphor Light (the thin outline set) from unpkg, at text size or larger. Ticks sit in 26 to 32px charcoal squares with a lime icon.

### Named Rules
**The Logo Slope Rule.** New angles reuse `--angle` or `--cut` and slope the same way as the existing ones. No rounded corners, no circles, no pill shapes.

## Components

### Buttons
Solid and blunt, uppercase, never rounded.
- **Shape:** square corners (`--radius`, 0); minimum height 50px (56px for `.btn--large`); 1.5px border slot.
- **Primary (lime):** lime fill, charcoal text, bottom-right corner cut by `--cut`. Used for every "Get a Quote" and form submit.
- **Hover / Press:** fill shifts to `lime-press`; an arrow icon slides 4px right; the whole button presses to 97% scale. Hovers only apply on mouse/trackpad devices. Keyboard focus is a charcoal outline drawn inside the cut shape (offset -5px) so the cut does not clip it.
- **Focus (all other controls):** a 2px outline in `--focus`, 3px outside the element (see The Focus Contrast Rule).
- **Outline (on dark only):** transparent with a 70% white border and white text; on hover it fills white with charcoal text.
- **Busy:** 75% opacity with a progress cursor while the form is "sending".

### Filter chips (project filters)
- **Style:** white with a `grey-line` border, label type, 44px minimum height, square.
- **State:** hover darkens the border to charcoal; selected (`aria-pressed="true"`) turns charcoal with white text and a 3px lime underline. Switching filters animates the grid with View Transitions where supported.

### Cards / Containers
- **Service compartment:** white cell in a hairline grid, large Phosphor Light icon, Michroma title, grey description. Hover draws a 3px lime rule across the top and lifts the icon 3px.
- **Project card:** white with a 1px `grey-line` border, a 4:3 photo, then the title block. Hover zooms the photo to 103% and darkens the title block's top rule. The photo is revealed upwards the first time it scrolls into view.
- **Testimonial:** no box; a 2px charcoal rule on top, a Phosphor quote mark, the quote at 22px, the name and role below.
- **Home hero:** charcoal band with the sheet grid and an angled bottom edge; white headline, soft-light lead and one large primary button on the left; a 4:3 photo box on the right (`charcoal-2` with a `line-on-dark` hairline frame until the photo goes in) (16:9 on tablets, stacked below the text on phones) with a lime triangle in its bottom-left corner. On load the text settles in, the photo box is revealed upwards and the triangle slides in from its corner.
- **Details panel (contact):** solid charcoal block with rows split by `line-on-dark` rules; each label carries a lime Phosphor icon.
- **Internal padding:** `--space-5` to `--space-7` depending on width.

### Inputs / Fields
- **Style:** white, square, 52px minimum height, 1px `field-line` border, 16px text (stops phones zooming). Labels above in label type; "(optional)" in grey mixed case.
- **Focus:** border goes charcoal and a 3px lime ring appears outside it.
- **Error:** `error` red border and a red message with an icon below the field; focused invalid fields get a faint red ring.

### Navigation
- **Desktop (1360px+):** transparent over the hero or banner, solid charcoal once scrolled. Logo lock-up left; a single line of label-type links (0.1em tracking, no wrapping); a lime "Get a Quote" button; then the EN / LT switch. The current or hovered link gets a 2px lime rule that grows from the left.
- **Below 1360px:** a 48px square menu button with a hairline border; the three bars turn into a cross. The menu is a full-screen charcoal panel with large Michroma links separated by hairlines, sliding up one after another, and a full-width quote button at the bottom. The current link is lime. The EN / LT switch sits beside the menu button and stays clickable while the menu is open.

### Language switch (EN / LT)
- **Style:** a segmented pair of square buttons inside one `line-on-dark` hairline border, with a hairline between them; each at least 44 × 44px. Label type at 118% width, weight 700. Inactive text is `on-dark-soft`.
- **State:** the active language (`aria-pressed="true"`) has white text and a 2px lime underline drawn inside the button. Hover (mouse and trackpad only) fills the button with `charcoal-2` and turns the text white. Focus is the lime ring drawn just inside the button.

### Image placeholders
Grey (`grey-line`) or charcoal (`charcoal-2`) boxes hatched with faint 45-degree lines, carrying an uppercase label that states what goes there and its size (for example "Project photo · 1600 × 1200"). Any image dropped inside a media box fills it.

### Placeholder content convention
Every piece of text or data not yet confirmed by the owner is written inside [square brackets] right on the page: [Project Name], [City], [Client Name], [Street Address], [email@yourdomain.com], [Your opening hours], and "[Placeholder]" at the start of draft paragraphs. Sample figures and draft quotes carry a small grey tag, "[Sample figure]" or "[Placeholder quote]", below them. The same convention applies in Lithuanian in `js/translations.js`: [Laikinas tekstas], [Pavyzdinis skaičius], [Pavyzdinis atsiliepimas], [Projekto pavadinimas], [Miestas], [Kliento vardas], [Gatvės adresas], [Jūsų darbo laikas]. Replace the content and delete the bracketed tag together, in both languages.

## Do's and Don'ts

### Do:
- **Do** change colours, fonts, spacing and angles in the `:root` block of `css/styles.css`, not in individual rules.
- **Do** keep lime as a plane, a line, the primary button or a focus ring, and keep it to one plane per band (The Lime Plane Rule, The One Plane Rule).
- **Do** set every heading in Michroma, uppercase, weight 400, with `--tracking-display`.
- **Do** separate things with 1px rules (`grey-line` on light, `line-on-dark` on charcoal) or hairline-gap grids.
- **Do** cut new angles with `--angle` or `--cut` on the logo's slope.
- **Do** use Phosphor Light icons (`ph-light ph-...`) at the existing sizes.
- **Do** mark anything unconfirmed with [square brackets] until the real content replaces it, in both English and Lithuanian.
- **Do** add every new piece of text in both languages: English in `index.html` and Lithuanian in `js/translations.js`, using the same `data-i18n` key.
- **Do** set `--focus: var(--lime)` on any new dark area so keyboard focus stays visible.
- **Do** keep hover effects inside the `(hover: hover) and (pointer: fine)` block and keep the reduced-motion block working.

### Don't:
- **Don't** set lime text on white or grey backgrounds, and don't use a lime focus ring there.
- **Don't** round corners, or use pills or circles.
- **Don't** add drop shadows to cards, buttons or images; the header's lift when solid is the only shadow.
- **Don't** add small uppercase tag lines above section titles; section heads are a title and, at most, a lead sentence.
- **Don't** bold Michroma or set it in mixed case.
- **Don't** present a placeholder figure, client, quote or address as real by removing its brackets before the real content exists.
