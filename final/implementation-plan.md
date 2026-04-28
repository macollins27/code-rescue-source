Code Rescue site — implementation plan                                                                                
                                               
  I. What this site has to be                                                                                           
   
  The public surface for a $25–40K and $80–150K service sold to PE/VC tech-DD, AI-native SaaS CTOs, and eng leaders     
  rolling out AI internally. Read as a serious operator's site (Tigerbeetle / Oxide tone), not a SaaS template. Every
  claim sourced. Every number footnoted. No client names anywhere — NDA exposure is real.                               
                                                                  
  Indexable as static HTML by AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Googlebot). Nothing       
  critical inside JavaScript. Structured data on every page so summarizers cite cleanly.
                                                                                                                        
  Lighthouse 100 across Performance, Accessibility, Best Practices, SEO on every page, mobile and desktop. Mozilla      
  Observatory A+. SSL Labs A+. Core Web Vitals green: LCP <1s, INP <50ms, CLS 0.
                                                                                                                        
  Voice locked. Numbered §1…§N sections with mono labels. Right-rail data tables for stats. Counter-example + litmus    
  pairs. Prose-with-bold-leadin for commitments. No <ul> bullets render anywhere — numbered table.data for "not
  included" lists.                                                                                                      
                                                                  
  Stack. Astro 4.x + TypeScript strict + MDX + content collections, deployed to Cloudflare Pages on code-rescue.com, no 
  other infrastructure.
                                                                                                                        
  II. Pages — full list, URLs, status                                                                                   
  
  The nav has nine items. Six exist as wireframes. Three are stubs that need to be built out.                           
                                                                  
  ┌─────┬─────────────────┬─────────────────────┬──────────────────────────┐                                            
  │  #  │       URL       │       Status        │          Source          │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤
  │ 01  │ /               │ Wireframe           │ home-v3.jsx (canonical)  │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤
  │ 02  │ /methodology    │ Wireframe           │ methodology.jsx          │                                            
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤
  │ 03  │ /rules          │ Wireframe           │ rules.jsx                │                                            
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 04  │ /rules/[id]     │ Detail in wireframe │ rules.jsx RuleDetail     │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 05  │ /incidents      │ Wireframe           │ incidents.jsx            │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 06  │ /incidents/[id] │ New                 │ needs page               │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 07  │ /audit          │ Wireframe           │ audit.jsx                │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 08  │ /install        │ Wireframe           │ install.jsx              │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 09  │ /writing        │ Stub                │ nav link only            │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 10  │ /writing/[slug] │ Stub                │ needs page               │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 11  │ /now            │ Stub                │ exists as a card on home │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 12  │ /about          │ Stub                │ nav link only            │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 13  │ /404            │ New                 │ standard                 │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 14  │ /rss.xml        │ New                 │ for /writing             │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 15  │ /llms.txt       │ New                 │ AI crawler manifest      │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 16  │ /robots.txt     │ New                 │ AI crawler policy        │
  ├─────┼─────────────────┼─────────────────────┼──────────────────────────┤                                            
  │ 17  │ /sitemap.xml    │ New                 │ Astro integration        │
  └─────┴─────────────────┴─────────────────────┴──────────────────────────┘                                            
                                                                  
  III. Repository layout                                                                                                
                                                                  
  code-rescue/
  ├── astro.config.mjs
  ├── tsconfig.json (strict, paths aliased)
  ├── package.json                                                                                                      
  ├── _headers                          ← Cloudflare Pages security headers
  ├── public/                                                                                                           
  │   ├── robots.txt                                              
  │   ├── llms.txt                                                                                                      
  │   ├── favicon.svg + .ico                                      
  │   ├── og-default.png (1200×630)                                                                                     
  │   └── docs/
  │       └── sample-audit-redacted.pdf  ← real artifact, see §X                                                        
  ├── src/                                                                                                              
  │   ├── content/
  │   │   ├── config.ts                  ← Zod schemas for every collection                                             
  │   │   ├── incidents/                 ← one .md per incident                                                         
  │   │   ├── rules-ast-grep/            ← .yml + frontmatter wrapper                                                   
  │   │   ├── rules-hookify/             ← .md                                                                          
  │   │   ├── rules-domain/              ← .md, AUTH-5, P-11, DR-89, etc.                                               
  │   │   ├── writing/                   ← .mdx                                                                         
  │   │   └── pages/now.mdx              ← single-doc, replaceable                                                      
  │   ├── components/                                                                                                   
  │   │   ├── chrome/Nav.astro                                                                                          
  │   │   ├── chrome/Footer.astro                                                                                       
  │   │   ├── chrome/FN.astro            ← footnote marker        
  │   │   ├── chrome/Footnotes.astro                                                                                    
  │   │   ├── chrome/BaseHead.astro      ← title, OG, JSON-LD                                                           
  │   │   ├── chrome/SchemaJsonLd.astro                                                                                 
  │   │   ├── ui/NumberedSection.astro                                                                                  
  │   │   ├── ui/DataTable.astro                                  
  │   │   ├── ui/RuleCard.astro                                                                                         
  │   │   ├── ui/IncidentMoment.astro                             
  │   │   ├── ui/AnatomySlot.astro                                                                                      
  │   │   ├── ui/Pill.astro                                                                                             
  │   │   ├── ui/SeverityDot.astro
  │   │   ├── ui/ThreeLayerTimeline.astro                                                                               
  │   │   └── islands/RulesBrowser.tsx   ← only React island                                                            
  │   ├── layouts/                                                                                                      
  │   │   ├── Base.astro                                                                                                
  │   │   └── Page.astro                                                                                                
  │   ├── pages/                         ← see §II                
  │   ├── lib/                                                                                                          
  │   │   ├── jsonld.ts                  ← schema.org builders
  │   │   └── og.ts                      ← per-page OG image generation                                                 
  │   └── styles/global.css              ← port of styles.css                                                           
  └── .github/workflows/ci.yml           ← build + Lighthouse CI + Pa11y + Observatory                                  
                                                                                                                        
  IV. Content collections — the data model                                                                              
                                                                                                                        
  Every list rendered today inline as a JS array becomes a folder of .md / .yml / .mdx files with frontmatter validated 
  by Zod schemas in src/content/config.ts. Adding the next incident is one new file, no code change.
                                                                                                                        
  Incidents schema. id (e.g. INC-026), date, session, severity (crit|high|med), title, caughtBy, cost, ruleKind         
  (ast-grep|hookify|agent-review|qa-harness|human), ruleId, lockedOn, cites[], plus what, how, gloss, yaml fields
  rendered from the markdown body's three sections.                                                                     
                                                                  
  ast-grep rule schema. id, area, severity, language, lockedOn, origin, verbatim (boolean — has full YAML in body),     
  gloss, cites[]. Body holds the YAML inside a fenced code block.
                                                                                                                        
  Hookify rule schema. id, area, action (block|warn), event, lockedOn, origin, verbatimFrontmatter (boolean), gloss.    
  Body holds the frontmatter and rule prose.
                                                                                                                        
  Domain rule schema. id (AUTH-5, DR-89, etc.), corpus (shared|domain), file (e.g. _shared/auth.md), tag, feature,      
  title, refs, citedBy[] (rule IDs from ast-grep + hookify), rewritten (date if rewritten), body holds the rule text.
                                                                                                                        
  Writing schema. slug, date, title, description, tags[], draft (boolean — drafts skipped at build).                    
  
  Now schema. lastEdited, building, stuckOn, lastWeek. Body is freeform.                                                
                                                                  
  This means the rules page detail view is generated at build time from the same content the listing reads — no         
  client-side data fetch, no hydration beyond the tab switcher.   
                                                                                                                        
  V. Components — what ports verbatim                             

  The wireframe components map cleanly onto Astro components with one exception. Nav, Footer, FN, Footnotes become      
  .astro components — server-rendered, no JS. DataTable, NumberedSection, RuleCard, IncidentMoment, AnatomySlot, Pill, 
  SeverityDot, ThreeLayerTimeline become .astro components — pure render, no state. RulesBrowser (the tabs + row →      
  detail view on /rules) becomes the only React island, hydrated client:load. Everything else is HTML.

  The data-theme light/dark toggle is preserved as a tiny inline <script> in BaseHead.astro that reads                  
  prefers-color-scheme and sets the attribute before paint — no FOUC. The TweaksPanel from the wireframe is a dev-only
  tool and does not ship to production.                                                                                 
                                                                  
  VI. Page-by-page build plan

  / — home                                                                                                              
  
  Source. home-v3.jsx. v2 is dropped — v3 is canonical (you confirmed this in the wireframe comment).                   
                                                                  
  Rendering. Fully static. The receipt rule card pulls from content/rules-ast-grep/po-repo-no-hard-delete.md via        
  collection query. The numbers in the right-rail table render with seven FN markers; the Footnotes component reads from
   a per-page footnote array.                                                                                           
                                                                  
  Cross-links. Receipt → /rules/AG-PO-001. Stat row "Major incidents catalogued" → /incidents. Stat row "Enforcement    
  rules in corpus" → /rules. §3 Engagements rows reference incidents and rules by ID. §5 Writing entries link to
  /writing/[slug].                                                                                                      
                                                                  
  JSON-LD. Organization (Code Rescue LLC) + Person (Maxwell A. Collins) + WebSite with SearchAction pointing at the     
  rules index.
                                                                                                                        
  Real-content fixes. The numbers are real. The receipt is real. §4 Now and §5 Writing pull from content collections.   
  Nothing on this page is fabricated.
                                                                                                                        
  /methodology                                                                                                          
  
  Source. methodology.jsx. Renders the DRDD Manifesto v2 verbatim.                                                      
                                                                  
  Rendering. Page is .astro, the manifesto body is an .mdx file at src/content/pages/methodology.mdx so the prose can be
   edited without touching the page template. The 12 rules become 12 entries in src/content/methodology-rules/ (or a
  single MDX file with <RuleCard> components — pick MDX for v1, less ceremony).                                         
                                                                  
  Cross-links. AUTH-5 anatomy specimen → /rules/AUTH-5. PER-7 anatomy specimen → /rules/PER-7. §6 Next → /rules and     
  /incidents.
                                                                                                                        
  JSON-LD. TechArticle with author, datePublished 2026-04-11, dateModified, articleSection: "Methodology", wordCount.   
  This is the page AI agents will most-frequently cite. It deserves the richest schema.
                                                                                                                        
  Real-content fixes. Manifesto verbatim is already strong. The two anatomy specimens (AUTH-5, PER-7) need to exist as  
  real domain rule entries in content/rules-domain/ — they're the cross-link targets.
                                                                                                                        
  /rules and /rules/[id]                                                                                                
  
  Source. rules.jsx. Three corpora — ast-grep, hookify, domain — three tabs.                                            
                                                                  
  Rendering. /rules renders the hero, the ThreeLayerTimeline (static SVG/HTML, not a chart library), and the            
  RulesBrowser React island that handles the tab switch and row → detail view. /rules/[id] is a static page generated at
   build time via Astro's dynamic routes from the union of all three collections — every rule has both a discoverable   
  URL and an in-page detail view.                                 

  Cross-links. Each rule's cites field becomes an inline link. Each rule's Cited by enforcement block links to          
  ast-grep/hookify rules that reference it. Each rule with an origin incident links to /incidents/[id].
                                                                                                                        
  JSON-LD. /rules gets CollectionPage. Each /rules/[id] gets TechArticle with identifier (the rule ID), keywords (area, 
  severity), isPartOf pointing at /rules.
                                                                                                                        
  Real-content fixes.                                                                                                   
  1. The "verbatim vs TBD" gap. Today the wireframe ships 4 verbatim rules out of 89 (2 ast-grep, 2 hookify). For
  launch, target 12 verbatim ast-grep + 12 verbatim hookify + all 8 domain rules already in the wireframe. That gives a 
  public corpus of 32 verbatim entries; the rest stays as table rows with origin lines but no verbatim body, marked    
  clearly. The "20 of 41 published. The remaining 21 ship with /install." caption stays — it's the right framing.       
  2. Pull verbatim YAML for the 8 most-cited ast-grep rules from your actual rule pack: no-catch-in-tests (already
  done), no-external-data-leakage, require-caller-in-tests, no-zod-any, no-silent-git-stash, no-master-bypass,    
  no-organization-id-on-properties, require-not-deleted-on-soft-deletable. These are the rules with strong              
  origin-incident stories — they read as proof.                                                           
  3. The TBD column. Rename "Source" → "Body" with values "verbatim" or "summary." "TBD" reads as unfinished; "summary" 
  reads as deliberate.                                            
                                                                                                                        
  /incidents and /incidents/[id]
                                                                                                                        
  Source. incidents.jsx. Three-beat format (What happened / How we caught it / What now blocks it).                     
  
  Rendering. /incidents renders the hero, two featured incidents in full (INC-026, INC-019), then the 9-row table.      
  /incidents/[id] renders any incident in three-beat format — the two featured become public URLs that anyone can
  deep-link.                                                                                                            
                                                                  
  Cross-links. Beat 3 rule card → /rules/[ruleId]. The "cites" line in each rule card → other domain/enforcement rules. 
  The home receipt links here. The methodology §6 Next links here.
                                                                                                                        
  JSON-LD. Each incident page is TechArticle with dateCreated (the incident date), dateModified (when the rule locked), 
  about referencing the rule entity.
                                                                                                                        
  Real-content fixes — the big one. Today the wireframe has 2 incidents in full and 7 placeholder rows in the table. To 
  launch credibly, all 9 need full bodies. The titles already in the wireframe map to real failure classes from your
  system map; the bodies need:                                                                                          
  1. A "what happened" beat — 2–3 sentences, agent or human source named, code shape that broke
  2. A "how we caught it" beat — which layer fired, which file/rule                                                     
  3. A "what now blocks it" beat — the locked rule, its YAML if ast-grep, its frontmatter if hookify
  all 9 need full bodies. The titles already in the wireframe map to real failure classes from your system map; the bodies need:
  1. A "what happened" beat — 2–3 sentences, agent or human source named, code shape that broke
  2. A "how we caught it" beat — which layer fired, which file/rule
  3. A "what now blocks it" beat — the locked rule, its YAML if ast-grep, its frontmatter if hookify
  4. A lockedOn date and cites[] field

  The 7 to write (titles already locked):
  1. INC-024 — tRPC route registered without auth middleware → AG-HUB-004
  2. INC-021 — Drizzle migration applied without snapshot → HK-DB-001
  3. INC-017 — tRPC error thrown without code → AG-ERR-002
  4. INC-014 — Pagination cursor parsed with parseInt → AG-PER-003
  5. INC-011 — Untrusted input passed to Drizzle sql template → AG-SEC-001
  6. INC-007 — Audit log write skipped on partial failure → HK-AL-001
  7. INC-003 — ID generated with Math.random() → AG-ID-001

  These should come from your actual session logs and dispatch records — do not fabricate. If the source material is thin for any of
  them, drop them from the catalog rather than invent. Nine real incidents is stronger than nine where two read as filler.

  /audit

  Source. audit.jsx. Strongest sales page in the set.

  Rendering. Fully static. The §3 Cover reproduction is an inline HTML facsimile, not an image — preserves resolution at any zoom and
  stays accessible.

  Cross-links. §1 Deliverable row "Findings" → mentions /rules cross-link in every finding. §6 Finding format R-042 no-master-bypass →
  /rules/no-master-bypass. §9 Next → /methodology and the sample audit PDF.

  JSON-LD. Service schema with provider, serviceType: "Technical Due Diligence", areaServed, offers with the price band $25,000–$40,000.

  Real-content fixes.
  1. The sample audit PDF must exist. "Sample audit (PDF, 43 pp.)" is linked four places. For launch, you need the actual redacted PDF at
   /docs/sample-audit-redacted.pdf. Take a real engagement audit, redact identifying details (audit ID, file paths to the level the path 
  stops being identifying, any client name), and ship that. Without it, four CTAs are dead.                                             
  2. #book and #sample anchors. Replace #book with mailto:max@code-rescue.com?subject=DRDD-A%20intro%20call. Replace #sample with
  /docs/sample-audit-redacted.pdf. Replace #methodology with /methodology. Replace #install with /install. Replace #rules with /rules.
  3. The "AI model" cover line says claude-sonnet-4-5-20250929. As of today the most capable model is Opus 4.7 / Sonnet 4.6. Update to
  the actual model used on the engagement, or generalize to "Claude Opus / Sonnet (versioned per audit)" — pinning a stale model in a
  sample cover reads as out of date.                                                                                                     
   
  /install                                                                                                                               
                                                                  
  Source. install.jsx. Same shape as audit.

  Rendering. Fully static.                                                                                                               
   
  Cross-links. §3 Specimen rule R-017 → /rules/no-silent-git-stash. §3 Origin I-2026-03-22-stash → /incidents/I-2026-03-22-stash (or     
  unify naming with INC-NNN — recommend INC-NNN throughout). §1 "DRDD-A" reference → /audit. §9 Next → /rules and /methodology.
                                                                                                                                         
  JSON-LD. Service with offers price band $80,000–$150,000.                                                                              
   
  Real-content fixes.                                                                                                                    
  1. Naming inconsistency. Wireframe uses I-2026-03-22-stash for the install specimen incident but INC-026 style for the incidents
  catalog. Pick one. Recommend INC-NNN everywhere — it's shorter and matches the catalog header.                                         
  2. #book, #audit, #rules, #methodology, #writing anchors. Same fix as /audit — wire to real URLs.
                                                                                                                                         
  /writing and /writing/[slug]                                                                                                           
                                                                                                                                         
  New page. Stub today (only nav link + the home /now mention).                                                                          
                                                                                                                                         
  Index page (/writing). Hero + chronological list of every published .mdx from content/writing/. Date in mono on the left, title with   
  <a> on the right. Filterable by tag in v2 — for v1, just chronological.
                                                                                                                                         
  Detail page (/writing/[slug]). MDX rendered through a typography-tuned layout. Long-form serif body. Footnotes at bottom. "Read time"  
  computed from word count. RSS-discoverable.
                                                                                                                                         
  Cross-links. Posts cross-link to rules, incidents, methodology — the same way home and methodology already do. Each post's footer      
  offers the next/previous chronological post.
                                                                                                                                         
  JSON-LD. BlogPosting per post with wordCount, author, datePublished, dateModified, keywords.                                           
  
  RSS. /rss.xml generated from the writing collection at build time. Linked from <head> and from the footer.                             
                                                                  
  Real-content fixes. The home page lists five writing entries. At least three of those must exist as real posts at launch — anything    
  less and the link rots. Recommended order for first three:      
  1. 2026-04-27 — Skill-iteration protocol, re-locked. Most recent, freshest in your head.                                               
  2. 2026-03-22 — Twenty commits, one git stash, no warning. This is INC-INC-stash; the writeup is referenced from /install already, so  
  you double-bind a CTA and a post by writing it.                                                                                      
  3. 2026-03-16 — Eight principles. Why the constitution is short. Methodology-adjacent; sets the tone for the corpus.                   
                                                                                                                      
  The other two can be marked draft: true in frontmatter and skipped at build until ready.                                               
                                                                                                                                         
  /now                                                                                                                                   
                                                                                                                                         
  New page. Today the home has a /now card with three paragraphs (Building / Stuck on / Last week) and a "full /now page →" link that    
  goes nowhere.
                                                                                                                                         
  Page format. The /now page is one MDX file at content/pages/now.mdx. Replace it whenever the state changes — usually weekly. An        
  "archive" link at the bottom shows past /now snapshots stored as content/now-archive/YYYY-MM-DD.mdx — append-only history.
                                                                                                                                         
  Cross-links. Top of page links back to home. Archive entries link forward and back chronologically.                                    
   
  JSON-LD. WebPage with dateModified set to lastEdited from frontmatter. Keep simple.                                                    
                                                                  
  Real-content fixes. The current copy on the home card is the right voice. Expand each beat from one sentence to one paragraph. Add a   
  fourth beat: "Reading." — what you're reading or rereading this week, with one-line gloss per item. /now pages with a "reading" beat
  are the ones people actually share.                                                                                                    
                                                                  
  /about

  New page. Stub today.                                                                                                                  
   
  Page format. Single page, two columns. Left: serif prose bio (3–4 short paragraphs). Right: a data table of facts (years operating,    
  hours logged, repos touched, languages primarily worked in, location, contact).
                                                                                                                                         
  Content. The wireframe footer line — "AI-augmented engineering and due-diligence audits for codebases that have to survive review.     
  Operated by Maxwell A. Collins." — is the seed. Expand to:
  1. What I do. Two sentences. Solo operator. DRDD methodology + audits + installs.                                                      
  2. How I got here. Three sentences. ~10,000 hrs AI-augmented engineering since 2023, across 30+ client repositories, all under NDA.    
  WakaTime-tracked. The methodology is what fell out of the pattern of doing this work and watching where it failed.                 
  3. What I don't do. Two sentences. No team. No staffing. No advisory retainer. The engagements I take are bounded.                     
  4. How to reach me. One sentence. max@code-rescue.com.                                                            
                                                                                                                                         
  No client names. No screenshots from client repos. No anonymized-but-clearly-identifiable detail. This page is the one a lawyer would  
  look at first if there were ever a dispute.                                                                                            
                                                                                                                                         
  JSON-LD. Person schema with jobTitle, worksFor: Organization { name: "Code Rescue LLC" }, email, url. Wire to home and footer          
  Organization schema for graph consistency.                      
                                                                                                                                         
  /404                                                            

  New page. Standard. Nav at top, "Page not found" h1, mono receipt of the bad URL, three suggested links (home, rules, incidents).      
  
  VII. Cross-page linking — the mesh                                                                                                     
                                                                  
  Every page connects to every other page through deliberate cross-links, not generic nav. Home links to all five service/artifact pages 
  plus the receipt rule. Methodology §6 Next sends to /rules and /incidents; AUTH-5 and PER-7 anatomy specimens send to /rules. Rules
  detail pages cite incidents and other rules by ID; the "cited by" list goes both directions. Incidents beat 3 always sends to a rule.  
  Audit sends to /methodology, /rules, sample audit PDF, /install. Install sends to /audit, /rules, /methodology, /incidents (origin
  incident on the specimen rule). Writing posts cross-link to rules and incidents. Now links to writing. Footer sites globally and
  reaches every section.

  The result is a graph where any AI agent or human entering on any page can reach any other page in two clicks, and every claim has a   
  same-site receipt page.
                                                                                                                                         
  VIII. SEO and AI discoverability layer                                                                                                 
  
  Per-page metadata. BaseHead.astro injects <title>, <meta name="description">, canonical URL, OG title/description/image/type, Twitter  
  card. Description is required in frontmatter — schema fails build if missing.
                                                                                                                                         
  JSON-LD. Each page emits a <script type="application/ld+json"> block from lib/jsonld.ts. Builders for Organization, Person, WebSite,   
  WebPage, Article, TechArticle, BlogPosting, Service, CollectionPage, BreadcrumbList. All graphs reference each other via @id so search
  engines and AI crawlers see one consistent entity model.                                                                               
                                                                  
  llms.txt at root. Markdown file at /llms.txt describing the site for AI agents. Format follows the emerging convention (anthropic.com, 
  vercel.com): site title, one-paragraph description, then a list of canonical URLs grouped by section with one-line descriptions of
  each. ChatGPT and Claude actively look for this; it's how you tell them which pages to prefer when summarizing.                        
                                                                  
  robots.txt. Allow all by default. Explicit allow rules for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Googlebot. Decide on     
  CCBot (Common Crawl, used as training corpus) — recommend allow, since you want your methodology in the training data of the next
  generation of models. Sitemap reference at the bottom.                                                                                 
                                                                  
  sitemap.xml. Astro's @astrojs/sitemap integration generates this automatically from your routes. Submit to Google Search Console and   
  Bing Webmaster Tools post-launch.
                                                                                                                                         
  OG images. A default 1200×630 PNG with the site mark and tagline. Per-page OG images for /methodology, /rules, /incidents, /audit,     
  /install — generated at build time via lib/og.ts using satori (Astro has an integration). Each shows the page title, the section
  number, and the Code Rescue mark.                                                                                                      
                                                                  
  Open Graph protocol + Twitter cards on every page. When a PE associate pastes a link in Slack, the preview is a typeset card, not a    
  default favicon.
                                                                                                                                         
  IX. Security hardening                                          

  _headers file at repo root drives Cloudflare Pages headers globally:                                                                   
  1. Strict-Transport-Security: max-age=63072000; includeSubDomains; preload — submit the domain to the HSTS preload list once stable
  2. Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src    
  'self'; connect-src 'self' https://cloudflareinsights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' — tighten    
  further if you self-host fonts (drop 'unsafe-inline' from style-src once all inline styles are extracted)                              
  3. X-Frame-Options: DENY                                                                                 
  4. X-Content-Type-Options: nosniff                                                                                                     
  5. Referrer-Policy: strict-origin-when-cross-origin                                                                                    
  6. Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  7. Cross-Origin-Opener-Policy: same-origin                                                                                             
                                                                                                                                         
  This combination scores Mozilla Observatory A+ without further work.                                                                   
                                                                                                                                         
  npm hygiene. npm install --save-exact always. Dependabot config in .github/ for security updates only, not version bumps. npm audit    
  --production in CI fails the build on any high or critical advisory. Pin Node version with .nvmrc.                                     
                                                                                                                                         
  Cloudflare Pages settings. Branch protection on main. Production deploy only from main. Preview deploys per PR. Build secrets stored in
   CF dashboard, never in repo. Custom domain enforced HTTPS, automatic TLS via CF.
                                                                                                                                         
  No third-party scripts in production. The wireframe uses unpkg.com for React/Babel — that's dev-only. The production build inlines or  
  self-hosts everything.
                                                                                                                                         
  X. Performance — getting and holding 100/100                                                                                           
  
  Fonts. Self-host Inter Tight, Charter (or Iowan Old Style), and Berkeley Mono (or JetBrains Mono as fallback) as .woff2 in             
  /public/fonts/. font-display: swap. <link rel="preload" as="font" type="font/woff2" crossorigin> for the two display weights actually
  used above the fold. Subset to Latin. Total font payload <80KB.                                                                        
                                                                  
  Images. Astro <Image /> for any future images — automatic AVIF/WebP, responsive srcset, lazy loading, dimensions enforced (CLS 0).     
  
  CSS. Port styles.css mostly as-is. Drop unused selectors. Inline critical above-the-fold CSS via Astro's built-in inliner; rest loaded 
  async.                                                          
                                                                                                                                         
  JavaScript. Only RulesBrowser ships JS to the client, and only on /rules. Every other page is 0 KB JS. Verify with Lighthouse          
  unminified-javascript and unused-javascript checks.
                                                                                                                                         
  View Transitions. Astro 4 supports the View Transitions API natively. Add <ViewTransitions /> to the base layout. Page-to-page         
  navigation cross-fades without a full reload. Free win, but feature-detect — it degrades gracefully where unsupported.
                                                                                                                                         
  Prefetch. Astro's <a data-astro-prefetch="hover"> on nav links prefetches the next HTML on hover; perceived latency drops to zero.     
  
  XI. Build, CI, deploy                                                                                                                  
                                                                  
  .github/workflows/ci.yml runs on every PR:                                                                                             
  1. npm ci                                                       
  2. npm run build — Astro fails on type errors, broken links via astro:check, and missing frontmatter via Zod schemas                   
  3. Lighthouse CI — treosh/lighthouse-ci-action. Assert ≥95 on every category for every URL in the sitemap (95, not 100, to absorb
  network noise; we'll target 100 actual). Fails the PR if any score regresses.                                                          
  4. Pa11y — accessibility audit against WCAG 2.1 AA on every page. Fails the PR on any error.                                           
  5. Mozilla Observatory check — via the public API against the preview URL.                                                             
  6. npm audit --production --audit-level=high — fails on high/critical.                                                                 
  7. Link checker — lychee against the built dist/. Fails on any 404 internal link.                                                      
                                                                                                                                         
  Deploy. Cloudflare Pages auto-deploys preview on every PR (URL posted as a PR comment) and production on every main push. No manual    
  step.                                                                                                                                  
                                                                                                                                         
  XII. The build sequence — actual days                                                                                                  
                                                                  
  Day 1. Astro init. TypeScript strict. Port styles.css → global.css. Build Base.astro + Page.astro layouts. Port Nav, Footer, FN,       
  Footnotes. Port methodology.jsx → /methodology end-to-end with MDX body. Cloudflare Pages wire-up. Verify Lighthouse 100 + Mozilla A+
  on this one page before doing anything else. Gate: if /methodology doesn't hit both, fix before proceeding.                            
                                                                  
  Day 2. Content collections schema in config.ts. Port the 8 ast-grep + 4 hookify + 8 domain rules from the wireframe into content/      
  files. Build /rules index and RulesBrowser island. Build /rules/[id] dynamic route. Verify cross-linking works.
                                                                                                                                         
  Day 3. Port the 2 featured incidents into content/incidents/. Build /incidents and /incidents/[id]. Write the 7 missing incident bodies
   from your session logs (or drop any that don't have real source material — better to ship 4 real than 9 with filler).
                                                                                                                                         
  Day 4. Port /audit and /install straight from JSX to .astro. Wire all #anchor links to real URLs. Generate the redacted sample audit   
  PDF and place at /docs/.
                                                                                                                                         
  Day 5. Port / from home-v3.jsx. Build /writing/index and /writing/[slug]. Write the 3 launch posts (2026-04-27 skill iteration,        
  2026-03-22 git stash, 2026-03-16 eight principles). Build /now and write the launch /now entry. Build /about. Build /404.
                                                                                                                                         
  Day 6. SEO layer: JSON-LD per page, OG images, llms.txt, robots.txt, sitemap. Security headers in _headers. Self-host fonts. Verify all
   CI gates green: Lighthouse, Pa11y, Observatory, lychee, npm audit. RSS feed for /writing.
                                                                                                                                         
  Day 7. Custom domain wired. Cloudflare Email Routing forwards max@code-rescue.com to max@mac-structures.com. Cloudflare Web Analytics  
  enabled (no cookies — preserves the "No trackers" footer claim). Submit to Google Search Console and Bing Webmaster Tools. Submit HSTS
  preload. Final pass: every link in the site, manually clicked, no 404s, no dead anchors, nothing on the wireframe survived as href="#".
                                                                  
  XIII. The placeholder-to-real punch list                                                                                               
  
  This is the list of "things on the wireframes that read as draft and must be real before launch":                                      
                                                                  
  1. href="#" anchors. Audit page has 4. Install page has 6. Home has 4. Methodology has 2. Rules has several. Every one wires to a real 
  URL or a mailto: before launch.                                 
  2. Sample audit PDF. Referenced from /audit four times. Must exist as a real redacted artifact at /docs/sample-audit-redacted.pdf.     
  3. 7 incident bodies. INC-024 through INC-003. Real or dropped.                                                                        
  4. 3 writing posts. 2026-04-27, 2026-03-22, 2026-03-16. Real, full-length.                                                             
  5. /now page body. Expand the home card content into a full page with the four beats (Building / Stuck on / Last week / Reading).      
  6. /about page body. Four-paragraph bio plus right-rail facts table.                                                                   
  7. 20+ ast-grep verbatim YAMLs. Today: 2 verbatim, 18 placeholder. Target for launch: 12+ verbatim, rest with real origin lines.       
  8. AI model line on the audit cover. Update claude-sonnet-4-5-20250929 to current.                                                     
  9. Naming consistency. INC-NNN everywhere; drop I-YYYY-MM-DD-slug form on /install.                                                    
  10. TODAY constant in chrome. Remove the hardcoded date — render from Astro.props or build time.                                       
  11. Footer "RSS" link. Currently dead — wire to /rss.xml once /writing exists.                                                         
  12. Footer "Schedule a call" link. Currently dead — mailto: for v1, Cal.com for v2.                                                    
                                                                                                                                         
  XIV. Post-launch backlog (not blocking)                                                                                                
                                                                                                                                         
  Verbatim port of the remaining 70+ rules. More incident entries as new ones happen — every incident becomes a public catalog entry     
  within the same week. A second writing post per month minimum. A /changelog page for the methodology and rule corpus (DRDD v0.5 when it
   locks). Cal.com or SavvyCal embed once volume justifies a calendar. A /colophon page explaining how the site itself is built — fits   
  the citation-density voice and tends to get linked.             

