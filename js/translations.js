/* ==========================================================================
   CONSTRE SOLUTIONS: translations
   --------------------------------------------------------------------------
   HOW IT WORKS
   - The ENGLISH text lives in the HTML pages, and in js/site.js for the
     parts shared by every page (header, footer, project cards).
   - The LITHUANIAN text lives here, in the "lt" list below.
   - Every translatable element has a data-i18n="key"
     attribute. The key points to the matching line here.

   TO CHANGE A LITHUANIAN TEXT: edit the value after the key below.
   TO CHANGE AN ENGLISH TEXT:   edit it in the page (or in js/site.js).
   TO ADD A NEW TEXT:           give the element data-i18n="my.new.key"
                                in the page, then add 'my.new.key': '...'
                                to the "lt" list here.

   A few values contain HTML (<br>, <em>, <span>): keep those tags.
   Texts used by the script (form errors, messages) are in "ui" further
   down, in both English and Lithuanian.
   ========================================================================== */

window.CONSTRE_TRANSLATIONS = {

  /* ------------------------------------------------------------------------
     LITHUANIAN PAGE TEXT
     ------------------------------------------------------------------------ */
  lt: {
    // Page title and search-result description
    'meta.title': 'Constre Solutions | Gyvenamųjų ir komercinių pastatų statyba',
    'meta.description': 'Constre Solutions: bendrieji statybos darbai, įvairios paskirties pastatų ir rezervuarų statyba, inžineriniai bei konstrukciniai sprendimai. Daugiau nei 20 metų patirtį turinti specialistų komanda.',

    // About page (about.html): title, description and banner
    'meta.aboutTitle': 'Apie mus | Constre Solutions',
    'meta.aboutDescription': 'Constre Solutions: įvairios paskirties statybos projektus įgyvendinanti specialistų komanda, turinti daugiau nei 20 metų patirtį statybų ir energetikos sektoriuje.',
    'aboutPage.title': 'Apie mus',
    'aboutPage.lead': 'Įvairios paskirties statybos projektus įgyvendinanti specialistų komanda, turinti daugiau nei 20 metų patirtį statybų ir energetikos sektoriuje.',
    'breadcrumb.label': 'Naršymo kelias',

    // Projects page (projects.html): title, description and banner
    'meta.projectsTitle': 'Projektai | Constre Solutions',
    'meta.projectsDescription': 'Constre Solutions gyvenamieji, pramoniniai, komerciniai, žemės ūkio ir inžineriniai projektai. Komanda, turinti daugiau nei 20 metų patirties.',
    'projectsPage.title': 'Mūsų projektai',
    'projectsPage.lead': 'Susipažinkite su mūsų atliktais statybos darbais gyvenamuosiuose, pramoniniuose, komerciniuose ir žemės ūkio paskirties objektuose, specializuotais inžineriniais sprendimais bei šiuo metu vystomais gyvenamųjų namų kvartalais.',

    // Contact page (contact.html): title, description and banner
    'meta.contactTitle': 'Kontaktai | Constre Solutions',
    'meta.contactDescription': 'Susisiekite su Constre Solutions: F. Mieliausko g. 6, Vilnius. Trumpai pristatykite savo projektą, o mes susisieksime aptarti bendradarbiavimo galimybių.',
    'contactPage.title': 'Kontaktai',

    // Privacy page (privacy.html). [Laikinas tekstas]: to be completed and checked
    'meta.privacyTitle': 'Privatumo politika | Constre Solutions',
    'meta.privacyDescription': 'Kaip Constre Solutions tvarko asmens duomenis, kuriuos atsiunčiate per užklausos formą.',
    'privacyPage.title': 'Privatumo politika',
    'privacyPage.lead': 'Kaip tvarkome jūsų atsiųstus duomenis.',
    'privacy.placeholder': '[Laikinas tekstas: reikia užbaigti ir patikrinti]',
    'privacy.who.title': 'Kas mes esame',
    'privacy.who.text': 'Constre Solutions, [įmonės kodas], F. Mieliausko g. 6, Vilnius, Lietuva. Kontaktai: <a href="mailto:info@constre.com">info@constre.com</a>.',
    'privacy.what.title': 'Kokius duomenis renkame ir kodėl',
    'privacy.what.text': 'Kai išsiunčiate užklausos formą, gauname jūsų vardą, el. pašto adresą, projekto aprašymą ir, jei nurodote, telefono numerį bei įmonę. Juos naudojame tik atsakyti į jūsų užklausą ir parengti pasiūlymą.',
    'privacy.how.title': 'Kaip jie tvarkomi',
    'privacy.how.text': 'Formą į mūsų pašto dėžutę pristato el. pašto paslauga [Brevo, veikianti ES]. Cloudflare Turnstile patikrina, kad formą siunčia žmogus, o ne robotas. Svetainė jūsų žinutės duomenų bazėje nesaugo.',
    'privacy.keep.title': 'Kiek laiko saugome',
    'privacy.keep.text': '[Tiek, kiek reikia atsakyti į jūsų užklausą, o ilgiau – tik jei tapsite mūsų klientu ir įstatymai reikalauja saugoti dokumentus.]',
    'privacy.rights.title': 'Jūsų teisės',
    'privacy.rights.text': 'Galite paprašyti susipažinti su savo duomenimis, juos ištaisyti ar ištrinti parašę <a href="mailto:info@constre.com">info@constre.com</a>. Taip pat galite pateikti skundą Valstybinei duomenų apsaugos inspekcijai (<a href="https://vdai.lrv.lt" rel="noopener">vdai.lrv.lt</a>).',

    // Header & navigation
    'a11y.skip': 'Pereiti prie turinio',
    'a11y.home': 'Constre Solutions pradžia',
    'a11y.menu': 'Meniu',
    'a11y.mainNav': 'Pagrindinis meniu',
    'a11y.language': 'Kalba',
    'nav.home': 'Pradžia',
    'nav.services': 'Paslaugos',
    'nav.about': 'Apie mus',
    'nav.projects': 'Projektai',
    'nav.process': 'Darbo eiga',
    'nav.contact': 'Kontaktai',
    'cta.quote': 'Gauti pasiūlymą',

    // Hero
    'hero.photoAlt': 'Pagrindinės nuotraukos vieta',
    'hero.photoLabel': 'Pagrindinė nuotrauka · 1600 × 1200<br>Geriausias jūsų baigtas projektas',
    'hero.title': 'Tvirtas pagrindas kiekvienam projektui.',
    'hero.lead': 'Bendrieji statybos darbai, įvairios paskirties pastatų ir rezervuarų statyba, inžineriniai bei konstrukciniai sprendimai. Daugiau nei 20 metų patirtį turinti specialistų komanda.',

    // Services
    'services.title': 'Mūsų paslaugos',
    'services.lead': 'Patikimi statybos sprendimai įvairios paskirties objektams.',
    'services.intro': 'Atliekame bendruosius statybos darbus gyvenamuosiuose, pramoniniuose, komerciniuose ir žemės ūkio objektuose. Dirbame kaip rangovas ar subrangovas – kokybiškai ir laikydamiesi terminų.',
    'services.general.title': 'Bendrieji statybos darbai',
    'services.general.text': 'Atliekame pamatų įrengimo, betonavimo, mūro, konstrukcijų montavimo ir kitus bendruosius statybos darbus.',
    'services.residential.title': 'Gyvenamoji statyba',
    'services.residential.text': 'Vykdome individualių ir daugiabučių gyvenamųjų namų bei gyvenamųjų kvartalų statybos darbus.',
    'services.commercial.title': 'Pramoninė ir komercinė statyba',
    'services.commercial.text': 'Atliekame gamybinių, sandėliavimo, logistikos ir komercinės paskirties pastatų statybos darbus.',
    'services.agricultural.title': 'Žemės ūkio statinių ir rezervuarų statyba',
    'services.agricultural.text': 'Statome skystojo mėšlo ir biodujų rezervuarus, silosines, lagūnas bei kitus žemės ūkio paskirties statinius.',
    'services.management.title': 'Statybos projektų valdymas',
    'services.management.text': 'Organizuojame ir koordinuojame statybos darbus, planuojame jų eigą, kontroliuojame terminus ir darbų kokybę.',
    'services.engineering.title': 'Inžineriniai ir konstrukciniai sprendimai',
    'services.engineering.text': 'Įgyvendiname inžinerinius ir konstrukcinius sprendimus, atliekame statybinių konstrukcijų gamybos ir montavimo darbus.',

    // About
    'about.photoAlt': 'Komandos nuotraukos vieta',
    'about.photoLabel': 'Komandos arba statybvietės nuotrauka · 1200 × 1500',
    'about.title': 'Du dešimtmečiai statybvietėje',
    'about.p1': 'Atliekame bendruosius statybos darbus gyvenamuosiuose, pramoniniuose, komerciniuose ir žemės ūkio paskirties objektuose. Statome gelžbetoninius rezervuarus, įgyvendiname inžinerinius bei konstrukcinius sprendimus ir valdome statybos projektus.',
    'about.p2': 'Greta rangos darbų vystome nuosavus gyvenamųjų kvartalų projektus, kuriuose pritaikome sukauptą statybų patirtį.',
    'about.p3': 'Mūsų veiklos pagrindas – atsakomybė, profesionalumas ir kokybė kiekviename statybos etape.',
    'about.checkTitle': 'Pagrindinės veiklos kryptys:',
    'about.check1': 'Bendrieji statybos darbai ir įvairios paskirties objektų statyba',
    'about.check2': 'Statybos projektų valdymas, inžineriniai ir konstrukciniai sprendimai',
    'about.check3': 'Gyvenamųjų kvartalų vystymas ir įgyvendinimas',

    // Stat counters
    'stats.label': 'Įmonės skaičiai',
    'stats.years': 'Metų patirtis',
    'stats.projects': 'Įgyvendintų projektų',
    'stats.team': 'Komandos narių',
    'stats.clients': 'Patenkintų klientų',

    // Projects
    'projects.title': 'Mūsų projektai',
    'projects.previewLead': 'Susipažinkite su mūsų įgyvendintais statybos projektais, inžineriniais sprendimais ir šiuo metu vystomais gyvenamųjų namų kvartalais.',
    'projects.viewAll': 'Visi projektai',
    'projects.lead': 'Pasirinkite kategoriją, kad atrinktumėte projektus.',
    'projects.filterLabel': 'Filtruoti projektus pagal kategoriją',
    'filter.all': 'Visi projektai',
    'filter.developing': 'Vystomi gyvenamųjų namų kvartalai',
    'filter.residential': 'Gyvenamieji',
    'filter.commercial': 'Pramoniniai ir komerciniai',
    'filter.tanks': 'Rezervuarai',
    'filter.agricultural': 'Žemės ūkio',
    'filter.engineering': 'Inžineriniai sprendimai',
    'project.photoAlt': 'Projekto nuotraukos vieta',
    'project.photoLabel': 'Projekto nuotrauka · 1600 × 1200',
    'project.label': 'Projektas',
    'project.location': 'Vieta',
    'project.type': 'Tipas',
    'project.city': '[Miestas]',
    'category.developing': 'Vystomas gyvenamųjų namų kvartalas',
    'category.residential': 'Gyvenamasis',
    'category.commercial': 'Pramoninis / komercinis',
    'category.tanks': 'Rezervuaras',
    'category.agricultural': 'Žemės ūkio',
    'category.engineering': 'Inžinerinis sprendimas',
    'project.1.name': '[Projekto pavadinimas] Šeimos namas',
    'project.2.name': '[Projekto pavadinimas] Sandėlis',
    'project.3.name': '[Projekto pavadinimas] Gyvenamųjų namų kvartalas',
    'project.4.name': '[Projekto pavadinimas] Biodujų rezervuaras',
    'project.5.name': '[Projekto pavadinimas] Žemės ūkio pastatas',
    'project.6.name': '[Projekto pavadinimas] Plieninės konstrukcijos',
    'project.7.name': '[Projekto pavadinimas] Daugiabutis namas',
    'project.8.name': '[Projekto pavadinimas] Gamybinis pastatas',
    'project.9.name': '[Projekto pavadinimas] Individualių namų kvartalas',
    'project.10.name': '[Projekto pavadinimas] Skystojo mėšlo rezervuaras',
    'project.11.name': '[Projekto pavadinimas] Siloso tranšėja',
    'project.12.name': '[Projekto pavadinimas] Gelžbetoninės konstrukcijos',

    // Process
    'process.title': 'Darbo eiga',
    'process.lead': 'Keturi etapai – kiekvieną suderiname su jumis prieš pradėdami kitą.',
    'process.1.title': 'Konsultacija',
    'process.1.text': 'Apžiūrime objektą, išklausome jūsų poreikius ir aptariame biudžetą, prioritetus bei terminus.',
    'process.2.title': 'Planavimas',
    'process.2.text': 'Brėžiniai, leidimai, rašytinis pasiūlymas ir statybos grafikas, kurio laikomės.',
    'process.3.title': 'Statyba',
    'process.3.text': 'Statome pagal planą, palaikome saugią ir tvarkingą statybvietę ir nuolat jus informuojame.',
    'process.4.title': 'Perdavimas',
    'process.4.text': 'Bendra apžiūra, pašalinti trūkumai, perduodami dokumentai ir raktai.',

    // Call to action band
    'cta.title': 'Planuojate statybas?',
    'cta.text': 'Papasakokite apie darbą, ir pateiksime aiškų rašytinį pasiūlymą.',
    'cta.contact': 'Susisiekite',

    // Contact form
    'contact.title': 'Gaukite pasiūlymą',
    'contact.lead': 'Planuojate statybos darbus ar ieškote patikimo rangos partnerio? Trumpai pristatykite savo projektą, o mes susisieksime aptarti bendradarbiavimo galimybių.',
    'form.name': 'Vardas ir pavardė',
    'form.email': 'El. paštas',
    'form.phone': 'Telefonas <span class="field__optional">(neprivaloma)</span>',
    'form.company': 'Įmonė <span class="field__optional">(neprivaloma)</span>',
    'form.message': 'Apie jūsų projektą',
    'form.send': 'Siųsti užklausą',
    'form.privacy': 'Siųsdami šią formą sutinkate, kad tvarkytume jūsų duomenis, norėdami atsakyti į jūsų užklausą. <a href="privacy.html">Privatumo politika</a>',

    // Company details
    'details.label': 'Įmonės duomenys',
    'details.address': 'Adresas',
    'details.phone': 'Telefonas',
    'details.email': 'El. paštas',
    'details.hours': 'Darbo laikas',
    'details.hoursValue': 'I–V: 8:00–21:00<br>VI–VII: nedirbame',
    'map.open': 'Atidaryti Google Maps',

    // Footer
    'footer.text': 'Bendrieji statybos darbai, įvairios paskirties pastatų ir rezervuarų statyba. Daugiau nei 20 metų patirtį turinti specialistų komanda.',
    'footer.nav': 'Poraštės meniu',
    'footer.links': 'Nuorodos',
    'footer.contact': 'Kontaktai',
    'footer.follow': 'Sekite mus',
    'footer.rights': 'Visos teisės saugomos.',
    'footer.top': 'Į viršų'
  },

  /* ------------------------------------------------------------------------
     TEXTS USED BY THE SCRIPT (js/main.js), in both languages
     ------------------------------------------------------------------------ */
  ui: {
    en: {
      nameEmpty: 'Enter your name so we know who to reply to.',
      nameLength: 'Your name needs 2 to 100 characters.',
      emailEmpty: 'Enter your email address.',
      emailInvalid: 'Check the email address. It should look like name@example.com.',
      phoneInvalid: 'Use digits, spaces and + ( ) - only (up to 30), e.g. +370 600 00000.',
      companyLength: 'Keep the company name to 150 characters or fewer.',
      messageEmpty: 'Tell us a little about the project.',
      messageShort: 'Add a bit more detail, such as location, size or timing.',
      messageLong: 'Please keep the message to 5000 characters or fewer.',
      sending: 'Sending…',
      // {email} and {phone} become links to the company's email and phone
      success: 'Thank you! Your request has been sent. We\'ll get back to you within 1 business day.',
      error: 'Something went wrong. Please try again, email us at {email} or call {phone}.',
      projectsShown: function (n) { return n + (n === 1 ? ' project' : ' projects') + ' shown'; }
    },
    lt: {
      nameEmpty: 'Įveskite vardą, kad žinotume, kam atsakyti.',
      nameLength: 'Vardą turi sudaryti nuo 2 iki 100 simbolių.',
      emailEmpty: 'Įveskite el. pašto adresą.',
      emailInvalid: 'Patikrinkite el. pašto adresą. Jis turėtų atrodyti taip: vardas@pavyzdys.lt.',
      phoneInvalid: 'Naudokite tik skaitmenis, tarpus ir + ( ) - (iki 30), pvz., +370 600 00000.',
      companyLength: 'Įmonės pavadinimas turi būti ne ilgesnis nei 150 simbolių.',
      messageEmpty: 'Trumpai aprašykite projektą.',
      messageShort: 'Pridėkite daugiau informacijos, pvz., vietą, dydį ar terminus.',
      messageLong: 'Žinutė turi būti ne ilgesnė nei 5000 simbolių.',
      sending: 'Siunčiama…',
      success: 'Ačiū! Jūsų užklausa išsiųsta. Susisieksime su jumis per 1 darbo dieną.',
      error: 'Įvyko klaida. Bandykite dar kartą, rašykite mums {email} arba skambinkite {phone}.',
      projectsShown: function (n) { return 'Rodoma projektų: ' + n; }
    }
  }
};
