// ============================================================
//  main.js — boots the scene, injects content, wires interactions
// ============================================================
// initScene, DATA, CAT_COLOR, AREA_COLOR are provided as globals by
// scene.js and data.js (loaded before this file in index.html).
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------------- 1. content injection ---------------- */
function renderProjects() {
  const wrap = $("#projectCards");
  wrap.innerHTML = DATA.projects.map((p, i) => `
    <article class="card" data-cat="${p.cat.join(" ")}" style="--accent:${p.accent}">
      <svg class="card__mol" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="12" r="5" fill="${p.accent}"/>
        <circle cx="12" cy="30" r="4" fill="${p.accent}" opacity=".7"/>
        <circle cx="32" cy="30" r="4" fill="${p.accent}" opacity=".7"/>
        <line x1="22" y1="12" x2="12" y2="30" stroke="${p.accent}" stroke-width="1.5" opacity=".5"/>
        <line x1="22" y1="12" x2="32" y2="30" stroke="${p.accent}" stroke-width="1.5" opacity=".5"/>
        <line x1="12" y1="30" x2="32" y2="30" stroke="${p.accent}" stroke-width="1.5" opacity=".5"/>
      </svg>
      <h3>${p.name}</h3>
      <p class="card__desc">${p.desc}</p>
      <div class="card__tech">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
      <div class="card__links">${Object.entries(p.links).map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener">${k} ↗</a>`).join("")}</div>
    </article>`).join("");

  // spotlight follow
  $$(".card", wrap).forEach(c => {
    c.addEventListener("pointermove", e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

function renderFilters() {
  $$("#filters .chip").forEach(chip => chip.addEventListener("click", () => {
    $$("#filters .chip").forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    const f = chip.dataset.filter;
    $$(".card").forEach(card => {
      const show = f === "all" || card.dataset.cat.split(" ").includes(f);
      card.classList.toggle("hide", !show);
    });
  }));
}

function renderPublications() {
  const list = $("#pubList");
  list.innerHTML = DATA.publications.map((p, i) => `
    <li class="pub" data-i="${i}" style="--accent:${AREA_COLOR[p.area]}">
      <h4>${p.title}</h4>
      <div class="pub__meta">${p.journal ? `<b>${p.journal}</b>` : ""}<span>${p.year}</span>${p.cites ? `<span>${p.cites} citations</span>` : ""}</div>
      <div class="pub__abs">${p.abs}${p.doi ? `<br><a class="pub__doi" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">DOI: ${p.doi} ↗</a>` : (p.link ? `<br><a class="pub__doi" href="${p.link}" target="_blank" rel="noopener">View publication ↗</a>` : "")}</div>
    </li>`).join("");

  // citation network svg
  const svg = $("#citationNet");
  const W = 360, H = 300;
  const nodes = DATA.publications;
  // edges: connect each node to the next-most-cited (simple citation chain)
  let edges = "";
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++)
      if (Math.abs(nodes[i].year - nodes[j].year) <= 2)
        edges += `<line class="edge" x1="${nodes[i].x*W}" y1="${nodes[i].y*H}" x2="${nodes[j].x*W}" y2="${nodes[j].y*H}"/>`;
  const nodeEls = nodes.map((p, i) => {
    const r = 6 + Math.sqrt(p.cites) * 1.1;
    return `<g class="node" data-i="${i}">
      <circle cx="${p.x*W}" cy="${p.y*H}" r="${r}" fill="${AREA_COLOR[p.area]}" fill-opacity=".85" stroke="${AREA_COLOR[p.area]}" stroke-opacity=".4"/>
      <text x="${p.x*W}" y="${p.y*H+3}" text-anchor="middle" font-size="8" fill="#0a0e17" font-family="JetBrains Mono">${p.year.toString().slice(2)}</text>
    </g>`;
  }).join("");
  svg.innerHTML = edges + nodeEls;

  // interlink list <-> network
  const setActive = (i) => {
    $$(".pub").forEach(el => el.classList.toggle("active", el.dataset.i == i));
    $$("#citationNet .node").forEach(el => el.classList.toggle("active", el.dataset.i == i));
  };
  $$(".pub").forEach(el => el.addEventListener("click", () => setActive(el.dataset.i)));
  $$("#citationNet .node").forEach(el => el.addEventListener("click", () => {
    setActive(el.dataset.i);
    $(`.pub[data-i="${el.dataset.i}"]`).scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }));
}

function renderCertifications() {
  const wrap = $("#certGrid");
  if (!wrap || !DATA.certifications) return;
  wrap.innerHTML = DATA.certifications.map(c => `
    <figure class="cert">
      <a href="${c.img}" target="_blank" rel="noopener"><img src="${c.img}" alt="${c.title}" loading="lazy" /></a>
      <figcaption>
        <h4>${c.title}</h4>
        <p>${c.org}</p>
        <span>${c.date}</span>
      </figcaption>
    </figure>`).join("");

  const wshop = $("#workshopList");
  if (wshop && DATA.workshops) {
    wshop.innerHTML = DATA.workshops.map(w => `
      <li><b>${w.title}</b>${w.org ? ` — ${w.org}` : ""}<span>${w.date}</span></li>`).join("");
  }
}

function renderSkills() {
  $("#periodic").innerHTML = DATA.skills.map(s => `
    <div class="el" style="--c:${CAT_COLOR[s.cat]}">
      <span class="el__num">${s.num}</span>
      <span class="el__sym">${s.sym}</span>
      <span class="el__name">${s.name}</span>
      <div class="el__meta"><b>${s.level}</b><span>${s.years} yrs</span></div>
    </div>`).join("");
}

/* ---------------- 2. custom cursor ---------------- */
function initCursor() {
  if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  document.body.classList.add("custom-cursor");
  const dot = $("#cursor"), ring = $("#cursorRing");
  let rx = 0, ry = 0, x = 0, y = 0;
  window.addEventListener("pointermove", e => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
  });
  const loop = () => {
    rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  };
  loop();
  const hot = "a,button,.card,.el,.receptor,.chip,.pub,.node";
  document.addEventListener("pointerover", e => {
    if (e.target.closest(hot)) ring.classList.add("hot");
  });
  document.addEventListener("pointerout", e => {
    if (e.target.closest(hot)) ring.classList.remove("hot");
  });
}

/* ---------------- 3. reveal-on-scroll ---------------- */
function initReveals() {
  if (reduce) { $$(".reveal").forEach(el => el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  $$(".reveal").forEach(el => io.observe(el));
  $(".about__viz") && io.observe($(".about__viz"));
}

/* ---------------- 4. stat counters ---------------- */
function initCounters() {
  const els = $$("[data-count]");
  const run = (el) => {
    const target = +el.dataset.count; const dur = 1400; const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (reduce) { els.forEach(el => el.textContent = el.dataset.count); return; }
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
  }), { threshold: 0.6 });
  els.forEach(el => io.observe(el));
}

/* ---------------- 5. nav / misc ---------------- */
function initMisc() {
  $("#year").textContent = new Date().getFullYear();
  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  // copy email
  $$(".receptor[data-copy]").forEach(el => el.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(el.dataset.copy);
      const em = el.querySelector("em"); const old = em.textContent;
      em.textContent = "copied ✓"; setTimeout(() => em.textContent = old, 1600);
    } catch { location.href = "mailto:" + el.dataset.copy; }
  }));

  // contact form (front-end only)
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, s = $("#formStatus");
    if (!f.checkValidity()) { s.textContent = "Please complete all fields."; s.style.color = "var(--magenta)"; return; }
    s.textContent = "Message docked with the membrane ✓ — I'll reply soon.";
    s.style.color = "var(--teal)"; f.reset();
  });
}

/* ---------------- 6. Konami easter egg ---------------- */
function initKonami() {
  const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let idx = 0;
  window.addEventListener("keydown", (e) => {
    idx = (e.key.toLowerCase() === seq[idx].toLowerCase()) ? idx + 1 : 0;
    if (idx === seq.length) { idx = 0; foldEgg(); }
  });
  function foldEgg() {
    const n = document.createElement("div");
    n.textContent = "🧬 Protein folding unlocked — keep decoding!";
    Object.assign(n.style, {
      position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
      background: "var(--teal)", color: "var(--bg)", padding: "12px 22px", borderRadius: "30px",
      fontFamily: "var(--font-mono)", zIndex: 200, boxShadow: "0 12px 40px rgba(0,212,170,.4)",
    });
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3200);
  }
}

/* ---------------- 7. boot ---------------- */
function boot() {
  renderProjects(); renderFilters(); renderPublications(); renderSkills(); renderCertifications();
  initCursor(); initReveals(); initCounters(); initMisc(); initKonami();

  // ---- 3D scene ----
  let api = null;
  try {
    api = initScene($("#scene"));
  } catch (err) {
    console.warn("WebGL unavailable, running 2D fallback:", err);
    $("#scene").style.display = "none";
  }

  // motion toggle
  const toggle = $("#motionToggle");
  toggle.addEventListener("click", () => {
    if (!api) return;
    const paused = !api.isPaused();
    api.setPaused(paused);
    toggle.setAttribute("aria-pressed", String(paused));
  });
  if (reduce && api) { api.setPaused(true); toggle.setAttribute("aria-pressed", "true"); }

  // ---- scroll-driven helix (GSAP if present, else rAF fallback) ----
  const hero = $("#hero");
  function heroProgress() {
    const h = hero.offsetHeight;
    return Math.min(Math.max(window.scrollY / h, 0), 1);
  }
  function onScrollHelix() {
    if (!api) return;
    const p = heroProgress();
    api.setHeroProgress(p);
    // unzip pulses as you scroll through hero, then settles open
    api.setUnzip(Math.sin(p * Math.PI) * 0.9);
  }
  onScrollHelix();
  window.addEventListener("scroll", onScrollHelix, { passive: true });

  // ---- loader out ----
  const loader = $("#loader"), bar = $(".loader__bar i");
  let pct = 0;
  const tick = setInterval(() => {
    pct = Math.min(pct + Math.random() * 22, 100);
    bar.style.width = pct + "%";
    if (pct >= 100) {
      clearInterval(tick);
      setTimeout(() => { loader.classList.add("done"); }, 350);
    }
  }, 180);
  // safety: never trap the user behind the loader
  setTimeout(() => loader.classList.add("done"), 4000);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
