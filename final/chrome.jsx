// Shared chrome for Code Rescue pages.
// Exposes Nav, Footer, Footnote, FN (footnote marker) on window.

const TODAY = "2026-04-27";

function Nav({ current = "home" }) {
  const items = [
    { id: "home", label: "Home", href: "#" },
    { id: "methodology", label: "Methodology", href: "#" },
    { id: "rules", label: "Rules", href: "#" },
    { id: "incidents", label: "Incidents", href: "#" },
    { id: "audit", label: "Audit", href: "#" },
    { id: "install", label: "Install", href: "#" },
    { id: "writing", label: "Writing", href: "#" },
    { id: "now", label: "Now", href: "#" },
    { id: "about", label: "About", href: "#" },
  ];
  return (
    <nav className="nav">
      <div className="brand">
        <span className="mark">▍</span>Code Rescue
      </div>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <a href={it.href} style={{ color: it.id === current ? "var(--accent)" : undefined, fontWeight: it.id === current ? 500 : 400 }}>
              {it.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="meta">max@code-rescue.com</div>
    </nav>
  );
}

function Footer({ updated = TODAY, page = "/" }) {
  return (
    <footer className="footer">
      <div>
        <h5>Code Rescue</h5>
        <div style={{ fontSize: 13, color: "var(--ink-3)", maxWidth: "32ch", lineHeight: 1.5 }}>
          AI-augmented engineering and due-diligence audits for codebases that have to survive review. Operated by Maxwell A. Collins.
        </div>
      </div>
      <div>
        <h5>Services</h5>
        <ul>
          <li><a href="#">DRDD Audit</a></li>
          <li><a href="#">DRDD Install</a></li>
          <li><a href="#">Engagements</a></li>
        </ul>
      </div>
      <div>
        <h5>Artifacts</h5>
        <ul>
          <li><a href="#">Methodology</a></li>
          <li><a href="#">Rule corpus</a></li>
          <li><a href="#">Incident catalog</a></li>
          <li><a href="#">Sample audit (PDF)</a></li>
        </ul>
      </div>
      <div>
        <h5>Reach</h5>
        <ul>
          <li><a href="mailto:max@code-rescue.com">max@code-rescue.com</a></li>
          <li><a href="#">Schedule a call</a></li>
          <li><a href="#">github.com/macollins27</a></li>
          <li><a href="#">RSS</a></li>
        </ul>
      </div>
      <div className="stamp">
        <span>Code Rescue LLC · Last updated {updated} · {page}</span>
        <span>v0.4.1 · Built solo · No trackers</span>
      </div>
    </footer>
  );
}

// Footnote system: numbered superscripts at point-of-use, full notes at bottom.
function FN({ n, title }) {
  return (
    <sup className="fn" title={title}>
      [{n}]
    </sup>
  );
}

function Footnotes({ items = [] }) {
  return (
    <section className="section tight" style={{ background: "var(--paper-2)" }}>
      <div className="label">Footnotes</div>
      <ol style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, columns: 2, columnGap: 48 }}>
        {items.map((it, i) => (
          <li key={i} style={{ breakInside: "avoid", marginBottom: 10, display: "flex", gap: 8 }}>
            <span className="mono" style={{ color: "var(--accent)", flex: "0 0 24px" }}>[{i + 1}]</span>
            <span>{it}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

Object.assign(window, { Nav, Footer, FN, Footnotes, TODAY });
