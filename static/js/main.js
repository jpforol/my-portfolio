/* ═══════════════════════════════════════════════════
   RPA PORTFOLIO — main.js
   Consumes the Flask API and renders all content.
═══════════════════════════════════════════════════ */

let currentLang = "en";
let portfolioCache = {};
let allProjects = [];
let activeFilter = "all";

// ─────────────────────────────────────────────
//  BOOTSTRAP
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  setupNavbar();
  setupLangToggle();
  await loadPortfolio("en");
  setupFilterDelegation();
  setupActiveNavHighlight();
});

// ─────────────────────────────────────────────
//  API FETCH
// ─────────────────────────────────────────────
async function fetchPortfolio(lang) {
  if (portfolioCache[lang]) return portfolioCache[lang];
  const res = await fetch(`/api/portfolio/${lang}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  portfolioCache[lang] = data;
  return data;
}

// ─────────────────────────────────────────────
//  LOAD & RENDER EVERYTHING
// ─────────────────────────────────────────────
async function loadPortfolio(lang) {
  const data = await fetchPortfolio(lang);
  renderNav(data.nav);
  renderHero(data.hero);
  renderAbout(data.about);
  renderProjects(data.projects);
  renderFooter(data.footer);
  document.documentElement.lang = lang;
}

// ─────────────────────────────────────────────
//  NAV
// ─────────────────────────────────────────────
function renderNav(nav) {
  document.getElementById("nav-about").textContent = nav.about;
  document.getElementById("nav-projects").textContent = nav.projects;
}

// ─────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────
function renderHero(hero) {
  setText("hero-greeting", hero.greeting);
  setText("hero-name", hero.name);

  const heroImageWrap = document.querySelector(".hero-image-wrap");
  const heroImage = document.getElementById("hero-image");
  if (heroImageWrap && heroImage && hero.image) {
    heroImage.src = hero.image;
    heroImage.style.display = "block";
    heroImageWrap.style.display = "flex";
  } else if (heroImageWrap) {
    heroImageWrap.style.display = "none";
  }

  setText("hero-title", hero.title);
  setText("hero-subtitle", hero.subtitle);
  setText("hero-cta-projects", hero.cta_projects);
  setText("hero-cta-contact", hero.cta_contact);

  const cvEl = document.getElementById("hero-cta-cv");
  if (cvEl) {
    if (hero.cta_cv) {
      cvEl.textContent = hero.cta_cv;
      cvEl.href = hero.cv_link || "#";
      cvEl.style.display = "inline-flex";
    } else {
      cvEl.style.display = "none";
    }
  }

  const contactEl = document.getElementById("hero-cta-contact");
  if (contactEl) contactEl.href = `mailto:${getContactFromCache().email}`;
}

function getContactFromCache() {
  return portfolioCache[currentLang]?.about?.contact || {};
}

// ─────────────────────────────────────────────
//  ABOUT
// ─────────────────────────────────────────────
function renderAbout(about) {
  setText("about-title", about.section_title);
  setText("skills-title", about.skills_title);
  setText("contact-title", about.contact_title);

  // Bio
  const bioEl = document.getElementById("about-bio");
  bioEl.innerHTML = about.bio.map((p) => `<p>${p}</p>`).join("");

  // Stats
  const statsEl = document.getElementById("about-stats");
  statsEl.innerHTML = about.stats
    .map(
      (s) => `
    <div class="stat-card">
      <span class="stat-value">${s.value}</span>
      <span class="stat-label">${s.label}</span>
    </div>
  `,
    )
    .join("");

  // Skills
  const skillsEl = document.getElementById("skills-grid");
  skillsEl.innerHTML = about.skills
    .map(
      (s) => `
    <span class="skill-chip">${s.icon} ${s.label}</span>
  `,
    )
    .join("");

  // Contact
  const { email, linkedin, github, location } = about.contact;
  const contactEl = document.getElementById("contact-list");
  contactEl.innerHTML = `
    <li class="contact-item"><span class="contact-icon">✉️</span><a href="mailto:${email}">${email}</a></li>
    <li class="contact-item"><span class="contact-icon">💼</span><a href="https://${linkedin}" target="_blank" rel="noopener">${linkedin}</a></li>
    <li class="contact-item"><span class="contact-icon">💻</span><a href="https://${github}" target="_blank" rel="noopener">${github}</a></li>
    <li class="contact-item"><span class="contact-icon">📍</span><span>${location}</span></li>
  `;

  // Certifications
  if (about.certifications_title) {
    setText("certifications-title", about.certifications_title);
  }
  const certsEl = document.getElementById("certs-grid");
  if (certsEl && about.certifications) {
    certsEl.innerHTML = about.certifications
      .map(
        (c) => `
      <div class="cert-card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-alt); max-width: 450px;">
        <img src="${c.image}" alt="${c.name}" style="width: 60px; height: 60px; object-fit: contain;">
        <div>
          <h4 style="margin: 0; font-size: 1rem; font-family: 'Playfair Display', serif; color: var(--text-main); line-height: 1.3; margin-bottom: 0.25rem;">${c.name}</h4>
          <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">${c.issuer} &bull; ${c.date}</p>
          <a href="${c.url}" target="_blank" rel="noopener" style="font-size: 0.85rem; color: var(--accent); text-decoration: none; display: inline-block; margin-top: 0.4rem;">View Credential &rarr;</a>
        </div>
      </div>
      `,
      )
      .join("");
  }
}

// ─────────────────────────────────────────────
//  PROJECTS
// ─────────────────────────────────────────────
function renderProjects(projects) {
  setText("projects-title", projects.section_title);
  setText("projects-subtitle", projects.section_subtitle);

  allProjects = projects.items;

  buildFilterBar(projects.items);
  renderCards(projects.items);

  // Reset filter when language switches
  activeFilter = "all";
  setActiveFilter("all");
}

function buildFilterBar(items) {
  const allTechs = [...new Set(items.flatMap((p) => p.tech))].sort();
  const bar = document.getElementById("filter-bar");

  const allLabel = currentLang === "pt" ? "Todos" : "All";
  bar.innerHTML =
    `<button class="filter-btn active" data-tech="all">${allLabel}</button>` +
    allTechs
      .map((t) => `<button class="filter-btn" data-tech="${t}">${t}</button>`)
      .join("");
}

function renderCards(items) {
  const grid = document.getElementById("projects-grid");
  grid.innerHTML = items
    .map(
      (p, i) => `
    <div class="project-card" data-tech="${p.tech.join(",")}" style="animation-delay:${i * 0.06}s">
      <div class="card-header">
        <span class="card-category">${p.category}</span>
        <span class="card-status">${p.status}</span>
      </div>
      <h3 class="card-title">${p.title}</h3>
      <p class="card-description">${p.description}</p>
      <div class="card-impact">${p.impact}</div>
      <div class="card-tech">
        ${p.tech.map((t) => `<span class="tech-tag">${t}</span>`).join("")}
      </div>
    </div>
  `,
    )
    .join("");
}

// Filter delegation
function setupFilterDelegation() {
  document.getElementById("filter-bar").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    activeFilter = btn.dataset.tech;
    setActiveFilter(activeFilter);
    filterCards(activeFilter);
  });
}

function setActiveFilter(tech) {
  document.querySelectorAll(".filter-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.tech === tech);
  });
}

function filterCards(tech) {
  document.querySelectorAll(".project-card").forEach((card) => {
    const cardTechs = card.dataset.tech.split(",");
    const show = tech === "all" || cardTechs.includes(tech);
    card.classList.toggle("hidden", !show);
  });
}

// ─────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────
function renderFooter(text) {
  setText("footer-copy", text);
}

// ─────────────────────────────────────────────
//  LANGUAGE TOGGLE
// ─────────────────────────────────────────────
function setupLangToggle() {
  document.getElementById("lang-toggle").addEventListener("click", async () => {
    currentLang = currentLang === "en" ? "pt" : "en";
    updateLangUI(currentLang);
    await loadPortfolio(currentLang);
    // Re-apply active filter label
    filterCards(activeFilter);
  });
}

function updateLangUI(lang) {
  const flag = document.getElementById("lang-flag");
  const label = document.getElementById("lang-label");
  if (lang === "pt") {
    flag.textContent = "🇺🇸";
    label.textContent = "EN";
  } else {
    flag.textContent = "🇧🇷";
    label.textContent = "PT";
  }
}

// ─────────────────────────────────────────────
//  NAVBAR SCROLL + ACTIVE LINK
// ─────────────────────────────────────────────
function setupNavbar() {
  window.addEventListener(
    "scroll",
    () => {
      document
        .getElementById("navbar")
        .classList.toggle("scrolled", window.scrollY > 10);
    },
    { passive: true },
  );
}

function setupActiveNavHighlight() {
  const sections = ["about", "projects"];
  const links = {
    about: document.getElementById("nav-about"),
    projects: document.getElementById("nav-projects"),
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sections.forEach((id) => links[id]?.classList.remove("active"));
          links[entry.target.id]?.classList.add("active");
        }
      });
    },
    { threshold: 0.45 },
  );

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
