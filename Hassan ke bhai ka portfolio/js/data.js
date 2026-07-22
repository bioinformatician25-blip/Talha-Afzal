// ============================================================
//  Portfolio content — edit here to update the site
// ============================================================
const DATA = {
  name: "Talha Afzal",
  title: "Lecturer in Zoology · Bioinformatics & Fisheries Researcher",
  institution: "Higher Education Department, AJK — Dept. of Zoology, Rawalakot",
  email: "bioinformatician25227@gmail.com",
  phone: "+92 332 7777263",
  instagram: "https://www.instagram.com/talha_afzal001",
  linkedin: "https://www.linkedin.com/in/talha-afzal-61207033b",

  stats: [
    { num: 3, label: "Publications" },
    { num: 4, label: "Certifications" },
    { num: 4, label: "Workshops" },
    { num: 5, label: "Years teaching" },
  ],

  projects: [
    {
      name: "Diversification of Mating Behaviour in Animals",
      desc: "Study of the ecological and physiological factors driving variation in animal mating strategies across species.",
      tags: ["Ethology", "Behavioural Biology", "Zoology"],
      cat: ["behaviour", "research"],
      accent: "var(--teal)",
      links: { Publication: "https://medwinpublishers.com/IZAB/IZAB16000145.pdf" },
    },
    {
      name: "Carbamate & Carbaryl Toxicity in Chicken",
      desc: "Morphological and histopathological assessment of carbamate and carbaryl pesticide exposure in poultry.",
      tags: ["Toxicology", "Histopathology", "Zoology"],
      cat: ["toxicology", "research"],
      accent: "var(--magenta)",
      links: {},
    },
    {
      name: "Rainbow Trout Incubator Efficacy",
      desc: "Evaluating steel vs. mesh incubator design to enhance fertility and fry survival of Rainbow Trout (Oncorhynchus mykiss) in captivity.",
      tags: ["Aquaculture", "Fisheries Biology", "Fry Rearing"],
      cat: ["fisheries", "aquaculture"],
      accent: "var(--amber)",
      links: {},
    },
    {
      name: "Temperature & pH Effects on Trout Fertility",
      desc: "Assessing how environmental temperature and pH influence fertility rates of Rainbow Trout in captive breeding programs.",
      tags: ["Environmental Biology", "Water Chemistry", "Fisheries"],
      cat: ["fisheries", "ecology"],
      accent: "var(--violet)",
      links: {},
    },
  ],

  // x,y are 0..1 layout coords in the citation-network SVG
  publications: [
    {
      title: "Reproductive success, fecundity and survival of fry of Rainbow Trout in captivity",
      journal: "Presented at the 42nd Pakistan Congress of Zoology (International)",
      year: 2025, cites: 0, area: "amber", x: .30, y: .30,
      abs: "Examines reproductive output, fecundity and fry survival of Rainbow Trout (Oncorhynchus mykiss) reared in captivity, with findings presented at the 42nd Pakistan Congress of Zoology, University of Azad Jammu & Kashmir, Muzaffarabad (2024).",
      doi: null, link: null,
    },
    {
      title: "Effects of carbamates and carbaryl on morphological and histopathological changes in chicken",
      journal: "Research paper",
      year: 2025, cites: 0, area: "magenta", x: .62, y: .45,
      abs: "Co-authored with Shah SS, Afzal S, Salamat S and Raza A — investigates structural and tissue-level effects of carbamate and carbaryl pesticide exposure in poultry.",
      doi: null, link: null,
    },
    {
      title: "Factors influencing the diversification of mating behavior of animals",
      journal: "International Journal of Zoology and Animal Biology",
      year: 2019, cites: 0, area: "teal", x: .45, y: .68,
      abs: "Co-authored with Afzal S, Shah SS, Javed RZ, Batool F, Salamat S and Raza A — a review of ecological and physiological drivers behind variation in animal mating strategies.",
      doi: null, link: "https://medwinpublishers.com/IZAB/IZAB16000145.pdf",
    },
  ],

  skills: [
    { sym: "Py", name: "Python", num: 1, cat: "lang", years: 3, level: "Intermediate" },
    { sym: "R", name: "R", num: 2, cat: "lang", years: 3, level: "Intermediate" },
    { sym: "Mb", name: "MATLAB", num: 3, cat: "lang", years: 2, level: "Intermediate" },
    { sym: "Bs", name: "Bash / Linux", num: 4, cat: "lang", years: 3, level: "Intermediate" },
    { sym: "Pc", name: "DNA/RNA Extraction & PCR", num: 5, cat: "lib", years: 7, level: "Advanced" },
    { sym: "Gf", name: "Genomic & Functional Analysis", num: 6, cat: "lib", years: 4, level: "Advanced" },
    { sym: "Hi", name: "Histopathology", num: 7, cat: "lib", years: 4, level: "Advanced" },
    { sym: "Bl", name: "BLAST / GenBank (NCBI)", num: 8, cat: "tool", years: 3, level: "Intermediate" },
    { sym: "Rs", name: "RNA-Seq", num: 9, cat: "tool", years: 2, level: "Intermediate" },
    { sym: "Ng", name: "NGS Transcriptomics", num: 10, cat: "tool", years: 2, level: "Intermediate" },
    { sym: "Pb", name: "Proteomics Bioinformatics", num: 11, cat: "tool", years: 2, level: "Intermediate" },
    { sym: "Fs", name: "Fisheries & Aquaculture", num: 12, cat: "infra", years: 7, level: "Advanced" },
    { sym: "Ec", name: "Ecology", num: 13, cat: "infra", years: 9, level: "Advanced" },
    { sym: "Mg", name: "Metagenomics", num: 14, cat: "infra", years: 2, level: "Intermediate" },
    { sym: "Bt", name: "Biostatistics", num: 15, cat: "infra", years: 5, level: "Advanced" },
    { sym: "Ap", name: "Apiculture & Sericulture", num: 16, cat: "infra", years: 3, level: "Intermediate" },
  ],

  certifications: [
    {
      title: "Bioinformatics Summer Program (8 Weeks)",
      org: "KAUST Academy — King Abdullah University of Science & Technology",
      date: "June – August 2024",
      img: "assets/certs/kaust_bioinformatics_2024.jpg",
    },
    {
      title: "42nd Pakistan Congress of Zoology (International) — Oral Presentation",
      org: "Zoological Society of Pakistan · University of Azad Jammu & Kashmir, Muzaffarabad",
      date: "April 2024",
      img: "assets/certs/pakistan_congress_zoology_2024.jpg",
    },
    {
      title: "Certificate of Acknowledgement — Vice President, Zoological Society",
      org: "Department of Zoology, University of Narowal",
      date: "2016 – 2018",
      img: "assets/certs/zoological_society_2018.jpg",
    },
    {
      title: "Science Fair 2017 — Best Presented (Certificate of Participation)",
      org: "Zoological Society, University of Gujrat, Sub-Campus Narowal",
      date: "September 2017",
      img: "assets/certs/science_fair_2017.jpg",
    },
  ],

  workshops: [
    { title: "Basics of Large Language Models", date: "Feb 2025 – ongoing" },
    { title: "Omics Logic Biomedical Data Science Research Program", date: "Feb 2025" },
    { title: "RNA-Seq Data Analysis", date: "Feb 2025" },
    { title: "Advances in Protein Function and Design", org: "COMSATS University Islamabad", date: "Mar 2025" },
  ],
};

const CAT_COLOR = {
  lang: "var(--teal)", lib: "var(--magenta)", tool: "var(--amber)", infra: "#8b5cf6",
};
const AREA_COLOR = {
  teal: "#00d4aa", magenta: "#ff6b9d", amber: "#f4a261", violet: "#8b5cf6",
};
