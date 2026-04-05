"use client";

import Link from "next/link";

const shopLinks = [
  { href: "/", label: "Home" },
  { href: "/varieties", label: "Our Mangoes" },
];

const exploreLinks = [
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About Us" },
];

const legalLinks: { href: string; label: string }[] = [];

const allMobileLinks = [
  { href: "/varieties", label: "Our Mangoes" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About Us" },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        color: "var(--on-surface-variant)",
        textDecoration: "none",
        fontSize: "0.9rem",
        fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--primary)"; }}
      onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--on-surface-variant)"; }}
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--surface-container-low)",
        borderTop: "1px solid var(--surface-container)",
      }}
    >
      {/* ── Desktop layout ── */}
      <div className="footer-desktop">
        <div className="container" style={{ padding: "64px 0 48px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: "48px",
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "var(--primary)",
                  letterSpacing: "-0.02em",
                  marginBottom: "16px",
                }}
              >
                Mango Masti
              </div>
              <p
                style={{
                  fontSize: "0.88rem",
                  lineHeight: 1.75,
                  color: "var(--on-surface-variant)",
                  maxWidth: "280px",
                  fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
                }}
              >
                © 2026 Mango Masti. Hand-picked with love. Bringing the
                sun-drenched flavor of our orchards to your doorstep.
              </p>
            </div>

            {/* SHOP */}
            <div>
              <h4 style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans'),sans-serif", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--on-surface-variant)", marginBottom: "20px", opacity: 0.7 }}>
                Shop
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                {shopLinks.map((l) => <li key={l.href}><FooterLink {...l} /></li>)}
              </ul>
            </div>

            {/* EXPLORE */}
            <div>
              <h4 style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans'),sans-serif", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--on-surface-variant)", marginBottom: "20px", opacity: 0.7 }}>
                Explore
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                {exploreLinks.map((l) => <li key={l.href}><FooterLink {...l} /></li>)}
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h4 style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans'),sans-serif", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--on-surface-variant)", marginBottom: "20px", opacity: 0.7 }}>
                Legal
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                {legalLinks.map((l) => <li key={l.href}><FooterLink {...l} /></li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="footer-mobile">
        <div
          style={{
            padding: "40px 24px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
              fontWeight: 800,
              fontSize: "1.2rem",
              color: "var(--primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Mango Masti
          </div>

          {/* Nav links — horizontal wrap */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px 20px",
            }}
          >
            {allMobileLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: "var(--on-surface-variant)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--on-surface-variant)",
              fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
              textAlign: "center",
              opacity: 0.7,
              lineHeight: 1.6,
            }}
          >
            © 2026 Mango Masti Orchard. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        .footer-desktop { display: block; }
        .footer-mobile  { display: none;  }
        @media (max-width: 768px) {
          .footer-desktop { display: none;  }
          .footer-mobile  { display: block; }
        }
      `}</style>
    </footer>
  );
}
