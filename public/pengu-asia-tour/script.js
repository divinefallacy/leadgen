// ---------- Data: 2025 flagship city case studies ----------
const CITIES = [
  {
    id: "tokyo",
    flag: "🇯🇵",
    city: "Tokyo",
    country: "Japan",
    conference: "WebX 2025",
    photo: "assets/tokyo-shibuya.jpg",
    photo2: "assets/tokyo-abcmart.jpg",
    summary:
      "Bridging Web3 and mainstream culture during WebX with a 9-screen Shibuya billboard takeover, co-hosted with MEXC and headlined by Apple CM alumni PeterParker69.",
    stat: { n: "3.5M+", d: "OOH daily impressions, Shibuya takeover" },
    stats: [
      { n: "600+", d: "Event signups" },
      { n: "3.5M+", d: "OOH daily impressions" },
      { n: "50,000", d: "Retail stores nationwide (7-Eleven, Lawson, FamilyMart)" },
      { n: "360°", d: "Sponsor visibility across main stage & VIP" },
    ],
  },
  {
    id: "ho-chi-minh",
    flag: "🇻🇳",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    conference: "Conviction 2025",
    photo: "assets/hcm-rooftop.jpg",
    photo2: "assets/hcm-group.jpg",
    summary:
      "High-impact brand activations and exclusive networking at Conviction 2025, capped by a co-branded Coin98 Boba activation on the main conference floor.",
    stat: { n: "20,000+", d: "Digital attendees, 30+ artists live" },
    stats: [
      { n: "323", d: "VIP signups, rooftop mixer" },
      { n: "20,000+", d: "Digital attendees, 30+ artists live" },
      { n: "Tier-1", d: "Main stage panels & community huddles" },
      { n: "1", d: "Centerpiece Coin98 Boba product launch" },
    ],
  },
  {
    id: "kuala-lumpur",
    flag: "🇲🇾",
    city: "Kuala Lumpur",
    country: "Malaysia",
    conference: "Malaysia Blockchain Week",
    photo: "assets/kl-pengu-tower.jpg",
    photo2: "assets/kl-jup-tower.jpg",
    summary:
      "City-wide takeovers and tier-1 institutional networking during Malaysia Blockchain Week, anchored by a Michelin VIP dinner with founders, bank CEOs and the Malaysia SC.",
    stat: { n: "3.5M+", d: "OOH impressions, 7-day TSLAW Tower takeover" },
    stats: [
      { n: "1,350+", d: "Event signups" },
      { n: "50+", d: "CEOs & founders at Michelin dinner" },
      { n: "3.5M+", d: "OOH impressions — 7-day TSLAW Tower takeover" },
      { n: "1M+", d: "Social impressions, 200K+ organic UGC" },
    ],
  },
  {
    id: "bali",
    flag: "🇮🇩",
    city: "Bali",
    country: "Indonesia",
    conference: "Coinfest Asia",
    photo: "assets/bali-atlas-beachclub.jpg",
    photo2: "assets/bali-villa.jpg",
    summary:
      "Premier satellite activations and exclusive networking during Coinfest Asia — a flagship pool party at the world's largest beach club, co-hosted with MEXC and Triv.",
    stat: { n: "1,985+", d: "Total signups across 4 satellite events" },
    stats: [
      { n: "1,985+", d: "Total signups across 4 satellite events" },
      { n: "500+", d: "Pax villa takeover" },
      { n: "30+", d: "Top Indonesian KOLs" },
      { n: "1", d: "Gaming IP collab launch, Atlas Beach Club" },
    ],
  },
  {
    id: "seoul",
    flag: "🇰🇷",
    city: "Seoul",
    country: "South Korea",
    conference: "Korea Blockchain Week",
    photo: "assets/seoul-triple-s.jpg",
    photo2: "assets/seoul-street.jpg",
    summary:
      "Premier brand takeovers and cultural activations during Korea Blockchain Week, headlined by a Pengu Winter Wonderland and an exclusive K-pop concert with tripleS.",
    stat: { n: "6M+", d: "K-pop fanbase reach via tripleS" },
    stats: [
      { n: "5,000+", d: "Event signups" },
      { n: "6M+", d: "K-pop fanbase reach via tripleS" },
      { n: "3.6M+", d: "OOH impressions — Gangnam, Incheon, fleet buses" },
      { n: "2M+", d: "Social impressions, 200K+ organic UGC" },
    ],
  },
  {
    id: "singapore",
    flag: "🇸🇬",
    city: "Singapore",
    country: "Singapore",
    conference: "Token2049 & F1 Race Week",
    photo: "assets/singapore-williamsf1.jpg",
    photo2: "assets/singapore-missuniverse.jpg",
    summary:
      "Unprecedented visibility during Token2049 and F1 race week — a Williams Racing rear-wing takeover, Amber Lounge with Saweetie, and the Token of Love Festival with HyunA.",
    stat: { n: "2.5M+", d: "Social impressions, viral celebrity shares" },
    stats: [
      { n: "8,500+", d: "Total signups" },
      { n: "2.5M+", d: "Social impressions, viral celebrity shares" },
      { n: "40", d: "Top-tier VIPs, Mandarin Oriental penthouse" },
      { n: "100", d: "Pax Michelin VIP × Bibendum crossover" },
    ],
  },
];

// ---------- Data: full 2026 event calendar ----------
// live clock — events flip from "open" to "completed" automatically as real time passes
const TODAY = new Date();

const CALENDAR = [
  { month: "Jan", conf: "Black Mountain", loc: "Chiang Mai, Thailand", dates: "Jan 22", start: "2026-01-22", end: "2026-01-22" },
  { month: "Jan", conf: "Jupiter Summit KL", loc: "Kuala Lumpur, Malaysia", dates: "Jan 31 – Feb 2", start: "2026-01-31", end: "2026-02-02" },
  { month: "Feb", conf: "Consensus Hong Kong", loc: "Hong Kong", dates: "Feb 10 – 12", start: "2026-02-10", end: "2026-02-12" },
  { month: "Apr", conf: "Web3 Festival", loc: "Hong Kong", dates: "Apr 20 – 23", start: "2026-04-20", end: "2026-04-23" },
  { month: "Apr", conf: "Token2049", loc: "Dubai, UAE", dates: "Apr 29 – 30", start: "2026-04-29", end: "2026-04-30" },
  { month: "May", conf: "SEABW", loc: "Bangkok, Thailand", dates: "May 19 – 21", start: "2026-05-19", end: "2026-05-21" },
  { month: "Jul", conf: "WebX", loc: "Tokyo, Japan", dates: "Jul 13 – 14", start: "2026-07-13", end: "2026-07-14" },
  { month: "Jul", conf: "MYBW", loc: "Kuala Lumpur, Malaysia", dates: "Jul 29 – 30", start: "2026-07-29", end: "2026-07-30" },
  { month: "Aug", conf: "Conviction", loc: "Ho Chi Minh, Vietnam", dates: "Aug 14 – 16", start: "2026-08-14", end: "2026-08-16" },
  { month: "Aug", conf: "Coinfest Asia", loc: "Bali, Indonesia", dates: "Aug 20 – 21", start: "2026-08-20", end: "2026-08-21" },
  { month: "Sep", conf: "KBW", loc: "Seoul, South Korea", dates: "Sep 29 – Oct 1", start: "2026-09-29", end: "2026-10-01" },
  { month: "Oct", conf: "Token2049", loc: "Singapore", dates: "Oct 7 – 8", start: "2026-10-07", end: "2026-10-08" },
  { month: "Nov", conf: "TBW", loc: "Taipei, Taiwan", dates: "November", start: "2026-11-01", end: "2026-11-30" },
  { month: "Nov", conf: "Devcon 8", loc: "Mumbai, India", dates: "Nov 3 – 6", start: "2026-11-03", end: "2026-11-06" },
].map((e) => ({ ...e, open: new Date(`${e.end}T23:59:59`) >= TODAY }));

// ---------- Partner ticker ----------
const PARTNERS = ["MEXC", "Coin98", "Jupiter", "Triv", "Williams Racing", "Amber Lounge", "Malaysia SC", "Mandarin Oriental"];
function tickerGroup() {
  return (
    `<span class="item label">2025 Collaborators</span>` +
    PARTNERS.map((p) => `<span class="dot">·</span><span class="item">${p}</span>`).join("")
  );
}
document.getElementById("ticker-track").innerHTML = tickerGroup() + tickerGroup();

// ---------- Render city cards ----------
const cityGrid = document.getElementById("city-grid");
cityGrid.innerHTML = CITIES.map(
  (c) => `
  <article class="city-card reveal" data-id="${c.id}">
    <div class="frame">
      <img src="${c.photo}" alt="${c.city}, ${c.country} — ${c.conference}" loading="lazy" />
      <div class="tag-row">
        <span class="conf-badge">${c.conference}</span>
        <span class="flag">${c.flag}</span>
      </div>
      <div class="hero-stat">
        <div class="n">${c.stat.n}</div>
        <div class="d">${c.stat.d}</div>
      </div>
    </div>
    <div class="caption">
      <h3>${c.city}</h3>
      <div class="country">${c.country}</div>
      <div class="stat-hint">
        <div class="n">${c.stat.n}</div>
        <div class="d">${c.stat.d}</div>
      </div>
      <span class="arrow">→</span>
    </div>
  </article>`
).join("");

// ---------- Modal ----------
const backdrop = document.getElementById("modal-backdrop");
const modalContent = document.getElementById("modal-content");

function openModal(id) {
  const c = CITIES.find((x) => x.id === id);
  if (!c) return;
  modalContent.innerHTML = `
    <div class="modal-photos">
      <img src="${c.photo}" alt="${c.city} activation photo" />
      <img src="${c.photo2}" alt="${c.city} activation photo secondary" />
    </div>
    <div class="modal-body">
      <span class="conf-badge">${c.conference}</span>
      <h3>${c.flag} ${c.city}, ${c.country}</h3>
      <div class="country">Pengu Asia Tour 2025</div>
      <p class="summary">${c.summary}</p>
      <div class="stat-list">
        ${c.stats
          .map((s) => `<div class="item"><div class="n">${s.n}</div><div class="d">${s.d}</div></div>`)
          .join("")}
      </div>
      <a href="#apply" class="btn btn-primary btn-block js-tier" style="margin-top:22px;" data-tier="Main Event" data-city="${c.city}">Apply for a slot in ${c.city}</a>
    </div>
  `;
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  backdrop.classList.remove("open");
  document.body.style.overflow = "";
}

cityGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".city-card");
  if (card) openModal(card.dataset.id);
});
document.getElementById("modal-close").addEventListener("click", closeModal);
backdrop.addEventListener("click", (e) => {
  if (e.target === backdrop) closeModal();
});
modalContent.addEventListener("click", (e) => {
  if (e.target.closest("a")) closeModal();
});

// ---------- Gallery lightbox ----------
const galleryGrid = document.getElementById("gallery-grid");
const lightboxBackdrop = document.getElementById("lightbox-backdrop");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");

function openLightbox(item) {
  const img = item.querySelector("img");
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = item.dataset.caption || "";
  lightboxBackdrop.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightboxBackdrop.classList.remove("is-open");
  document.body.style.overflow = "";
}

if (galleryGrid) {
  galleryGrid.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (item) openLightbox(item);
  });
}
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
lightboxBackdrop.addEventListener("click", (e) => {
  if (e.target === lightboxBackdrop) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeLightbox();
  }
});

// ---------- Render calendar ----------
const calList = document.getElementById("cal-list");
function renderCalendar(filter = "all") {
  calList.innerHTML = CALENDAR.map((e) => {
    const statusClass = e.open ? "status-open" : "status-done";
    const statusLabel = e.open ? "Open for partnership" : "Completed";
    const rowClass = e.open ? "is-open" : "";
    const visible = filter === "all" || (filter === "open" && e.open) || (filter === "done" && !e.open);
    return `
    <div class="cal-row ${rowClass} ${visible ? "" : "is-hidden"}">
      <div class="month">${e.month}</div>
      <div class="info">
        <div class="conf">${e.conf}</div>
        <div class="loc">${e.loc}</div>
      </div>
      <div class="dates">${e.dates}</div>
      <div class="status ${statusClass}">${statusLabel}</div>
    </div>`;
  }).join("");
}
renderCalendar();

document.getElementById("cal-filters").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-filter]");
  if (!btn) return;
  document.querySelectorAll("#cal-filters button").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderCalendar(btn.dataset.filter);
});

// ---------- Nav scroll state ----------
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 8);
});

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));
document.querySelectorAll(".city-card").forEach((el) => {
  el.classList.add("reveal");
  io.observe(el);
});

// ---------- Tier pre-fill ----------
document.addEventListener("click", (e) => {
  const link = e.target.closest(".js-tier");
  if (!link) return;
  const tierSelect = document.getElementById("f-tier");
  const eventSelect = document.getElementById("f-event");
  if (link.dataset.tier) {
    const match = [...tierSelect.options].find((o) => o.value === link.dataset.tier);
    if (match) tierSelect.value = link.dataset.tier;
  }
  if (link.dataset.city) {
    const opt = [...eventSelect.options].find((o) => o.textContent.includes(link.dataset.city));
    if (opt) eventSelect.value = opt.value;
  }
});

// ---------- Tier quadrant selection ----------
const tierCta = document.getElementById("tier-cta");
document.querySelectorAll(".tier-quad").forEach((quad) => {
  quad.addEventListener("click", () => {
    document.querySelectorAll(".tier-quad").forEach((q) => q.classList.remove("active"));
    quad.classList.add("active");
    if (tierCta) tierCta.dataset.tier = quad.dataset.tier;
  });
});

document.querySelectorAll(".js-book-2027").forEach((btn) => {
  btn.addEventListener("click", () => {
    const eventSelect = document.getElementById("f-event");
    const opt = [...eventSelect.options].find((o) => o.textContent.includes("2027"));
    if (opt) eventSelect.value = opt.value;
  });
});

// ---------- Interactive world map ----------
const MAP_CITY_META = {
  tokyo: { hasCaseStudy: true, conf: "WebX 2025", calConf: "WebX" },
  "ho-chi-minh": { hasCaseStudy: true, conf: "Conviction 2025", calConf: "Conviction" },
  "kuala-lumpur": { hasCaseStudy: true, conf: "Malaysia Blockchain Week", calConf: "MYBW" },
  bali: { hasCaseStudy: true, conf: "Coinfest Asia", calConf: "Coinfest Asia" },
  seoul: { hasCaseStudy: true, conf: "Korea Blockchain Week", calConf: "KBW" },
  singapore: { hasCaseStudy: true, conf: "Token2049 & F1 Race Week", calConf: "Token2049", calLoc: "Singapore" },
  taipei: { hasCaseStudy: false, conf: "Taiwan Blockchain Week", calConf: "TBW" },
  mumbai: { hasCaseStudy: false, conf: "Devcon 8", calConf: "Devcon 8" },
};

const TOUR_ROUTE_ORDER = ["tokyo", "kuala-lumpur", "ho-chi-minh", "bali", "seoul", "singapore", "taipei", "mumbai"];

function initMap() {
  const svg = document.getElementById("map-svg");
  if (!svg || typeof MAP_DOTS === "undefined") return;

  const dotsGroup = document.getElementById("map-dots");
  const markersGroup = document.getElementById("map-markers");
  const banner = document.querySelector(".map-banner");
  const svgNS = "http://www.w3.org/2000/svg";

  // dots: batched into one path for a single DOM node instead of ~3,500 circles
  const r = 1.5;
  let dotsPath = "";
  MAP_DOTS.forEach(([x, y]) => {
    dotsPath += `M${x - r},${y}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0`;
  });
  const dotsEl = document.createElementNS(svgNS, "path");
  dotsEl.setAttribute("class", "map-dot");
  dotsEl.setAttribute("d", dotsPath);
  dotsGroup.appendChild(dotsEl);

  const labelLayer = document.createElement("div");
  labelLayer.className = "map-label-layer";
  banner.appendChild(labelLayer);

  const markerEls = {};
  const labelEls = {};

  MAP_POINTS.forEach((p) => {
    const meta = MAP_CITY_META[p.id] || {};

    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("class", `map-marker ${meta.hasCaseStudy ? "is-flagship" : "is-open"}`);
    g.setAttribute("data-id", p.id);
    g.innerHTML = `
      <circle cx="${p.x}" cy="${p.y}" r="6" class="map-marker-ring">
        <animate attributeName="r" values="6;15;6" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.65;0;0.65" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="${p.x}" cy="${p.y}" r="4.5" class="map-marker-dot"></circle>
    `;
    markersGroup.appendChild(g);
    markerEls[p.id] = g;

    const label = document.createElement("div");
    label.className = "map-label";
    label.textContent = p.name;
    label.style.left = (p.x / MAP_WIDTH) * 100 + "%";
    label.style.top = (p.y / MAP_HEIGHT) * 100 + "%";
    labelLayer.appendChild(label);
    labelEls[p.id] = label;

    g.addEventListener("click", () => goTo(p.id, true));
  });

  const poster = document.getElementById("map-poster");
  const currentCity = document.getElementById("map-current-city");
  const currentMeta = document.getElementById("map-current-meta");
  const currentLink = document.getElementById("map-current");

  let activeIndex = 0;
  let timer = null;
  let playing = true;

  function calendarFor(meta) {
    return CALENDAR.find((e) => e.conf === meta.calConf && (!meta.calLoc || e.loc.includes(meta.calLoc)));
  }

  function render() {
    const id = TOUR_ROUTE_ORDER[activeIndex];
    const p = MAP_POINTS.find((m) => m.id === id);
    const meta = MAP_CITY_META[id] || {};
    const city = CITIES.find((c) => c.id === id);
    const cal = calendarFor(meta);

    Object.entries(markerEls).forEach(([mid, el]) => el.classList.toggle("is-active", mid === id));
    Object.entries(labelEls).forEach(([mid, el]) => el.classList.toggle("is-active", mid === id));

    poster.style.left = (p.x / MAP_WIDTH) * 100 + "%";
    poster.style.top = (p.y / MAP_HEIGHT) * 100 + "%";
    poster.classList.toggle("below", p.y < MAP_HEIGHT * 0.42);
    const dateStr = cal ? `${cal.dates}, 2026` : "2026";
    poster.innerHTML = `
      <a href="#" id="map-poster-link">
        ${city ? `<img class="poster-photo" src="${city.photo}" alt="${p.name}" />` : `<div class="poster-photo" style="display:grid;place-items:center;background:linear-gradient(135deg,var(--bg-elev-2),var(--bg-elev));font-size:28px;">${p.name === "Taipei" ? "🀄" : "🕌"}</div>`}
        <div class="poster-bar">
          <div>
            <div class="poster-city">${p.name}</div>
            <div class="poster-date">${meta.conf} · ${dateStr}</div>
          </div>
          <span class="arrow">→</span>
        </div>
      </a>`;
    poster.classList.add("show");
    document.getElementById("map-poster-link").addEventListener("click", (e) => {
      e.preventDefault();
      goTo(id, true);
    });

    currentCity.textContent = p.name;
    currentMeta.textContent = `${meta.conf} · ${dateStr}`;
    currentLink.onclick = (e) => {
      e.preventDefault();
      goTo(id, true);
    };
  }

  function goTo(id, jumpToPage) {
    const idx = TOUR_ROUTE_ORDER.indexOf(id);
    if (idx >= 0) activeIndex = idx;
    render();
    if (jumpToPage) {
      const meta = MAP_CITY_META[id] || {};
      if (meta.hasCaseStudy) {
        document.getElementById("tour-2025").scrollIntoView({ behavior: "smooth" });
        setTimeout(() => openModal(id), 450);
      } else {
        document.getElementById("calendar").scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  function step(dir) {
    activeIndex = (activeIndex + dir + TOUR_ROUTE_ORDER.length) % TOUR_ROUTE_ORDER.length;
    render();
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => step(1), 3800);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  const playBtn = document.getElementById("map-playpause");
  document.getElementById("map-prev").addEventListener("click", () => { step(-1); if (playing) startAutoplay(); });
  document.getElementById("map-next").addEventListener("click", () => { step(1); if (playing) startAutoplay(); });
  playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.textContent = playing ? "❚❚" : "▶";
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
    if (playing) startAutoplay();
    else stopAutoplay();
  });

  // zoom
  let zoom = 1;
  const zoomGroup = document.getElementById("map-zoom-group");
  function applyZoom() { zoomGroup.style.transform = `scale(${zoom})`; }
  document.getElementById("map-zoom-in").addEventListener("click", () => { zoom = Math.min(2.2, zoom + 0.3); applyZoom(); });
  document.getElementById("map-zoom-out").addEventListener("click", () => { zoom = Math.max(1, zoom - 0.3); applyZoom(); });

  render();
  startAutoplay();
}
initMap();

// ---------- Countdown banner: live countdown to the next open event ----------
function updateCountdown() {
  const now = new Date();
  const upcoming = [...CALENDAR]
    .map((e) => ({ ...e, startDate: new Date(`${e.start}T00:00:00`), endDate: new Date(`${e.end}T23:59:59`) }))
    .filter((e) => e.endDate >= now)
    .sort((a, b) => a.startDate - b.startDate);

  const nameEl = document.getElementById("cd-name");
  const eyebrowEl = document.getElementById("cd-eyebrow");
  const timerEl = document.getElementById("cd-timer");
  if (!nameEl || upcoming.length === 0) {
    if (nameEl) nameEl.textContent = "2026 tour complete — 2027 booking is open";
    if (timerEl) timerEl.style.display = "none";
    return;
  }

  const next = upcoming[0];
  nameEl.textContent = `${next.conf} — ${next.loc}`;

  const isLive = next.startDate <= now && now <= next.endDate;
  if (isLive) {
    eyebrowEl.textContent = "Happening now";
    timerEl.style.display = "none";
    return;
  }

  eyebrowEl.textContent = "Next up";
  timerEl.style.display = "flex";
  const diff = Math.max(0, next.startDate - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById("cd-d").textContent = d;
  document.getElementById("cd-h").textContent = String(h).padStart(2, "0");
  document.getElementById("cd-m").textContent = String(m).padStart(2, "0");
  document.getElementById("cd-s").textContent = String(s).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- FAQ accordion ----------
document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".faq-item").classList.toggle("open");
  });
});

// ---------- Apply form ----------
// TODO: wire this up to a real CRM/email endpoint (e.g. HubSpot form API, Formspree)
// before going live. Currently opens a prefilled mailto: as a functional fallback.
const PARTNERSHIPS_EMAIL = "partnerships@pudgypenguins.com";

document.getElementById("apply-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const subject = encodeURIComponent(`Pengu Asia Tour 2026 Partnership Inquiry — ${data.company}`);
  const body = encodeURIComponent(
    `Name: ${data.name}\nCompany: ${data.company}\nEmail: ${data.email}\nEvent of interest: ${data.event}\nPartnership tier: ${data.tier}\n\nMessage:\n${data.message || "(none)"}`
  );
  window.location.href = `mailto:${PARTNERSHIPS_EMAIL}?subject=${subject}&body=${body}`;

  form.style.display = "none";
  document.getElementById("form-success").classList.add("show");
});
