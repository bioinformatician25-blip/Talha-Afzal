# Talha Afzal — 3D Zoology & Bioinformatics Portfolio

An immersive single-page portfolio: a real-time DNA double helix, a floating
molecular network, a citation graph, and a periodic-table skills grid.
Built with **Three.js** (WebGL) + **GSAP**, no build step required.

## Run it

Just **double-click `index.html`** — it opens straight in your browser, no
server needed. (An internet connection is required the first time, because the
3D library and fonts load from a CDN.)

Prefer a local server? That works too:

```bash
cd "Hassan ke bhai ka portfolio"
python3 -m http.server 8899
# then open http://localhost:8899
```

## Deploy

Drag the whole folder onto **Netlify Drop** or run `vercel` — it's fully static.

## File map

```
index.html        markup + section structure
css/styles.css    all styling, palette, responsive + reduced-motion
js/scene.js       the Three.js scene (helix, network, particles)
js/main.js        content injection, cursor, scroll, interactions
js/data.js        ← EDIT THIS to change name, projects, papers, skills
assets/CV.pdf     drop your CV here (the "Download CV" button links to it)
```

## Customise

Everything text-based lives in **`js/data.js`** — name, projects, publications,
and skills are plain arrays. Colours are CSS variables at the top of
`css/styles.css` (`--teal`, `--magenta`, `--amber`).

## Features

- Scroll-driven DNA helix that unzips and drifts aside as you enter the page
- Mouse-reactive helix + camera parallax
- Citation network linked to the publication list (click either side)
- Filterable project "molecules", animated stat counters
- Custom cursor, DNA-replication loader, Konami-code easter egg (↑↑↓↓←→←→ B A)
- `prefers-reduced-motion` support + a **Motion** toggle in the nav
- Responsive down to mobile; graceful 2D fallback if WebGL is unavailable

## Notes

- `assets/CV.pdf` is included (Talha Afzal's CV/EP).
- `assets/certs/` holds the real certificate images shown in the Certifications section.
- Certifications, workshops, publications, projects, and skills are all editable in `js/data.js`.
