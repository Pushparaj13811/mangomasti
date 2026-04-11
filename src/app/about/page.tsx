import type { Metadata } from "next";
import Image from "next/image";
import { buildGenericWhatsAppUrl } from "../lib/mangoes";
import {
  imgAlphonso1,
  imgSunDrenchedOrchard,
  imgAbout1,
  imgAbout2,
  imgFarmerCheckingFruit,
  imgBoxesOfMangoes,
  imgNewAbout1,
  imgNewAbout2,
  imgNewAbout3,
} from "../lib/images";
import { getAboutContent } from "../actions/about";

export const metadata: Metadata = {
  title: "About Us | MangoMasti — Our Story & Heritage",
  description:
    "Learn the story behind MangoMasti — nearly a decade of sourcing India's finest mangoes from Ratnagiri, Devgad, and Andhra Pradesh, delivered fresh to your door.",
};

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" />
    </svg>
  );
}

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <main style={{ paddingTop: "108px" }}>

      {/* ===== HERO SECTION ===== */}
      <section style={{ background: "var(--surface-container-low)", padding: "72px 0 56px" }}>
        <div className="container">
          <div className="about-hero-grid">
            {/* Left: text */}
            <div>
              <p
                style={{
                  color: "var(--tertiary)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                {content.heroBadge}
              </p>
              <h1
                style={{
                  fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
                  fontWeight: 800,
                  color: "var(--on-surface)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  marginBottom: "24px",
                }}
              >
                {content.heroHeading}
              </h1>
              <div style={{ maxWidth: "460px" }}>
                {(() => {
                  const lines = content.heroDescription.split("\n");
                  const groups: { type: "paragraph" | "checklist"; lines: string[] }[] = [];
                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;
                    const isBullet = /^[✔✓☑•\-–—]/.test(trimmed);
                    if (isBullet) {
                      const last = groups[groups.length - 1];
                      if (last?.type === "checklist") {
                        last.lines.push(trimmed.replace(/^[✔✓☑•\-–—]\s*/, ""));
                      } else {
                        groups.push({ type: "checklist", lines: [trimmed.replace(/^[✔✓☑•\-–—]\s*/, "")] });
                      }
                    } else {
                      groups.push({ type: "paragraph", lines: [trimmed] });
                    }
                  }
                  return groups.map((group, i) =>
                    group.type === "checklist" ? (
                      <ul
                        key={i}
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: "16px 0",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {group.lines.map((item, j) => (
                          <li
                            key={j}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "10px",
                              fontSize: "0.95rem",
                              color: "var(--on-surface)",
                              lineHeight: 1.6,
                            }}
                          >
                            <span
                              style={{
                                color: "var(--primary)",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                lineHeight: 1.4,
                                flexShrink: 0,
                              }}
                            >
                              ✔
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        key={i}
                        style={{
                          fontSize: "1rem",
                          color: "var(--on-surface-variant)",
                          lineHeight: 1.8,
                          marginBottom: "8px",
                        }}
                      >
                        {group.lines[0]}
                      </p>
                    )
                  );
                })()}
              </div>
            </div>

            {/* Right: dark card with vertical mango image */}
            <div
              style={{
                background: "var(--inverse-surface)",
                borderRadius: "2.5rem",
                overflow: "hidden",
                position: "relative",
                height: "520px",
              }}
            >
              {/* Desktop image */}
              <Image
                src={imgAlphonso1}
                alt="Premium mangoes from India's orchards"
                fill
                style={{ objectFit: "cover", opacity: 0.9 }}
                sizes="45vw"
                priority
                className="about-hero-img-desktop"
              />
              {/* Mobile image */}
              <Image
                src={imgNewAbout1}
                alt="Sun-drenched mango orchard in India"
                fill
                style={{ objectFit: "cover", opacity: 0.9 }}
                sizes="100vw"
                priority
                className="about-hero-img-mobile"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHO WE ARE ===== */}
      <section style={{ background: "var(--surface-container-lowest)", padding: "80px 0" }}>
        <div className="container">
          <div className="about-who-grid">
            {/* Left: text */}
            <div>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                  fontWeight: 800,
                  color: "var(--on-surface)",
                  letterSpacing: "-0.03em",
                  marginBottom: "8px",
                }}
              >
                {content.whoHeading}
              </h2>
              <div
                style={{
                  width: "40px",
                  height: "3px",
                  background: "var(--tertiary)",
                  borderRadius: "2px",
                  marginBottom: "28px",
                }}
              />
              <div>
                {content.whoDescription.split(/\n\n|\n/).filter(Boolean).map((para, i, arr) => (
                  <p
                    key={i}
                    style={{
                      fontSize: "0.97rem",
                      color: "var(--on-surface-variant)",
                      lineHeight: 1.8,
                      marginBottom: i < arr.length - 1 ? "16px" : 0,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Right: 2×2 image + stat grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "auto auto",
                gap: "16px",
              }}
            >
              {/* Top-left: basket image (desktop) / farmer image (mobile) */}
              <div
                className="who-grid-item-img1"
                style={{
                  position: "relative",
                  height: "220px",
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  background: "var(--surface-container-low)",
                }}
              >
                <Image
                  src={imgAbout2}
                  alt="Fresh mangoes in a basket"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="25vw"
                  className="who-img1-desktop"
                />
                <Image
                  src={imgNewAbout2}
                  alt="Mangoes ripening on the tree at golden hour"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="100vw"
                  className="who-img1-mobile"
                />
              </div>

              {/* Top-right: 100% stat card */}
              <div
                className="who-grid-item-stat1"
                style={{
                  background: "var(--surface-container-lowest)",
                  borderRadius: "1.5rem",
                  padding: "24px 20px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 24px rgba(26,28,28,0.08)",
                  border: "1px solid var(--surface-container)",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "var(--tertiary)",
                    lineHeight: 1,
                    marginBottom: "6px",
                  }}
                >
                  100%
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "var(--on-surface-variant)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Authentic Sourcing
                </div>
              </div>

              {/* Bottom-left: 8+ stat card */}
              <div
                className="who-grid-item-stat2"
                style={{
                  background: "var(--surface-container-lowest)",
                  borderRadius: "1.5rem",
                  padding: "24px 20px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 24px rgba(26,28,28,0.08)",
                  border: "1px solid var(--surface-container)",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "var(--primary)",
                    lineHeight: 1,
                    marginBottom: "6px",
                  }}
                >
                  8+
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "var(--on-surface-variant)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Years Active
                </div>
              </div>

              {/* Bottom-right: crates image (desktop) / boxes image (mobile) */}
              <div
                className="who-grid-item-img2"
                style={{
                  position: "relative",
                  height: "160px",
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  background: "var(--surface-container-low)",
                }}
              >
                <Image
                  src={imgAbout1}
                  alt="Mango crates ready for delivery"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="25vw"
                  className="who-img2-desktop"
                />
                <Image
                  src={imgNewAbout3}
                  alt="Lush mango orchard with healthy trees"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="100vw"
                  className="who-img2-mobile"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PILLARS SECTION ===== */}
      <section style={{ background: "var(--surface-container-low)", padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 800,
                color: "var(--on-surface)",
                letterSpacing: "-0.03em",
                marginBottom: "12px",
              }}
            >
              The Pillars of Masti
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--on-surface-variant)",
                maxWidth: "400px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              Our commitment to excellence in every crate.
            </p>
          </div>

          <div className="grid-4">
            {content.pillars.map((pillar) => (
              <div
                key={pillar.title}
                style={{
                  background: "var(--surface-container-lowest)",
                  borderRadius: "2rem",
                  padding: "32px 28px",
                  boxShadow: "0 2px 16px rgba(26,28,28,0.06)",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    background: pillar.bg,
                    borderRadius: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    marginBottom: "18px",
                  }}
                >
                  {pillar.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    marginBottom: "10px",
                    color: "var(--on-surface)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.87rem",
                    color: "var(--on-surface-variant)",
                    lineHeight: 1.7,
                  }}
                >
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section style={{ background: "var(--surface-container-low)", padding: "0 0 80px" }}>
        <div className="container">
          <div
            style={{
              background: "var(--surface-container-lowest)",
              borderRadius: "3rem",
              padding: "64px 48px 100px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 2px 24px rgba(26,28,28,0.06)",
            }}
          >
            {/* Golden wave at bottom */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: "-10%",
                right: "-10%",
                height: "48%",
                background: "var(--primary-container)",
                borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
                pointerEvents: "none",
              }}
            />

            {/* Content above wave */}
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 800,
                  color: "var(--on-surface)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  marginBottom: "14px",
                }}
              >
                {content.ctaHeading}
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--on-surface-variant)",
                  maxWidth: "420px",
                  margin: "0 auto 36px",
                  lineHeight: 1.75,
                }}
              >
                {content.ctaDescription}
              </p>
              <a
                href={buildGenericWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--inverse-surface)",
                  color: "#ffffff",
                  borderRadius: "9999px",
                  padding: "14px 32px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                }}
              >
                <WhatsAppIcon />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-hero-img-mobile { display: none; }
        .who-img1-mobile { display: none; }
        .who-img2-mobile { display: none; }
        .about-hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 64px;
          align-items: center;
        }
        .about-who-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: flex-start;
        }
        @media (max-width: 768px) {
          .about-hero-img-desktop { display: none; }
          .about-hero-img-mobile { display: block; }
          .who-img1-desktop { display: none; }
          .who-img1-mobile { display: block; }
          .who-img2-desktop { display: none; }
          .who-img2-mobile { display: block; }
          .about-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .about-hero-grid > div:last-child {
            height: 380px !important;
          }
          .about-who-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          /* Mobile: stat cards side-by-side on top, images full-width below */
          .who-grid-item-stat1 {
            grid-column: 1;
            grid-row: 1;
          }
          .who-grid-item-stat2 {
            grid-column: 2;
            grid-row: 1;
          }
          .who-grid-item-img1 {
            grid-column: 1 / -1;
            grid-row: 2;
            height: 210px !important;
          }
          .who-grid-item-img2 {
            grid-column: 1 / -1;
            grid-row: 3;
            height: 175px !important;
          }
        }
      `}</style>
    </main>
  );
}
