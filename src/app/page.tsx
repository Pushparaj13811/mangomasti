import Image from "next/image";
import Link from "next/link";
import { getMangoes } from "./actions/mangoes";
import { getConfig } from "./actions/config";
import { getApprovedReviews } from "./actions/reviews";
import MangoCardWithModal from "./components/MangoCardWithModal";
import ComboCard from "./components/ComboCard";
import { buildGenericWhatsAppUrl } from "./lib/mangoes";
import { imgHero1 } from "./lib/images";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" />
    </svg>
  );
}

const trustItems = [
  {
    icon: "🌿",
    iconBg: "rgba(59, 105, 52, 0.14)",
    label: "100% Natural",
    desc: "No artificial ripening agents used.",
  },
  {
    icon: "✋",
    iconBg: "rgba(255, 190, 0, 0.2)",
    label: "Hand Picked",
    desc: "Selected individually for perfection.",
  },
  {
    icon: "✅",
    iconBg: "rgba(59, 105, 52, 0.14)",
    label: "Trusted by Thousands",
    desc: "Serving happy mango lovers since 2018.",
  },
];

export default async function HomePage() {
  // Fetch featured mangoes from database
  const allMangoes = await getMangoes();
  const featuredMangoes = allMangoes.filter((m) => m.featured).slice(0, 3);

  // Fetch config
  const config = await getConfig();

  // Fetch approved reviews
  const { data: allReviews } = await getApprovedReviews();
  const reviews = allReviews.slice(0, 3).map((review) => ({
    name: review.name,
    stars: review.rating,
    text: review.body,
    initial: review.name.charAt(0).toUpperCase(),
  }));

  return (
    <main style={{ paddingTop: "108px" }}>

      {/* ===== HERO — DESKTOP ===== */}
      <section
        className="hero-desktop"
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "calc(100svh - 72px)",
          display: "flex",
          alignItems: "center",
          background: "var(--surface-container-low)",
        }}
      >
        <Image
          src={imgHero1}
          alt="Fresh mangoes hanging from tree"
          fill
          style={{ objectFit: "cover", zIndex: 0 }}
          priority
        />
        {/* Dark overlay for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.38) 60%, rgba(0,0,0,0.15) 100%)",
            zIndex: 1,
          }}
        />
        <div
          className="container"
          style={{ position: "relative", zIndex: 2, paddingTop: "60px", paddingBottom: "60px" }}
        >
          <div style={{ maxWidth: "580px" }}>
            <div className="badge" style={{ marginBottom: "28px", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.35)" }}>
              <span>🌿</span>
              <span>SEASON 2026 NOW OPEN</span>
            </div>
            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.1,
                marginBottom: "24px",
                letterSpacing: "-0.04em",
              }}
            >
              India&apos;s Finest{" "}
              <span style={{ color: "var(--primary-container)" }}>Mangoes</span>,{" "}
              Delivered Fresh
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.8,
                marginBottom: "36px",
                maxWidth: "460px",
              }}
            >
              Experience the sun-drenched sweetness of authentic Ratnagiri
              Alphonso and Junagadh Kesar, hand-picked and delivered within 48
              hours.
            </p>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <a
                href={buildGenericWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: "1rem", padding: "14px 32px" }}
              >
                <WhatsAppIcon size={18} />
                Order Now on WhatsApp
              </a>
              <Link
                href="/varieties"
                className="btn-outline"
                style={{
                  fontSize: "1rem",
                  padding: "14px 28px",
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.5)",
                }}
              >
                View Varieties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERO — MOBILE ===== */}
      <section
        className="hero-mobile"
        style={{
          position: "relative",
          minHeight: "88vw",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src={imgHero1}
          alt="Fresh mangoes hanging from tree"
          fill
          style={{ objectFit: "cover", zIndex: 0 }}
          priority
        />
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.18) 100%)",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "40px 24px 44px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div className="badge" style={{ marginBottom: "20px", justifyContent: "center", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.35)" }}>
            <span>🌿</span>
            <span>SEASON 2026 NOW OPEN</span>
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: "16px",
              letterSpacing: "-0.03em",
            }}
          >
            India&apos;s Finest <span style={{ color: "var(--primary-container)" }}>Mangoes</span>, Delivered Fresh
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.75,
              marginBottom: "28px",
            }}
          >
            Hand-picked from India&apos;s finest orchards, delivered to your doorstep within 48 hours.
          </p>
          <a
            href={buildGenericWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ fontSize: "0.95rem", padding: "13px 28px" }}
          >
            <WhatsAppIcon size={18} />
            Order Now on WhatsApp
          </a>
        </div>
      </section>

      {/* ===== TRUST SECTION ===== */}
      <section className="section" style={{ background: "var(--surface-container-lowest)" }}>
        <div className="container">

          {/* Desktop layout: heading left + badge chips right */}
          <div className="trust-desktop">
            <div style={{ flex: "1 1 280px" }}>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                  fontWeight: 800,
                  color: "var(--primary)",
                  letterSpacing: "-0.03em",
                  marginBottom: "12px",
                }}
              >
                8 Years of Delivering Freshness
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--on-surface-variant)",
                  maxWidth: "380px",
                  lineHeight: 1.75,
                }}
              >
                Our unwavering commitment to quality and authenticity has earned
                the trust of thousands of families across India.
              </p>
            </div>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {trustItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "var(--surface-container-low)",
                    borderRadius: "1.5rem",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0 2px 8px rgba(26,28,28,0.05)",
                  }}
                >
                  <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{item.icon}</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "var(--primary)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile layout: centered heading + vertical list */}
          <div className="trust-mobile">
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--on-surface)",
                letterSpacing: "-0.03em",
                textAlign: "center",
                marginBottom: "8px",
              }}
            >
              8 Years of Delivering Freshness
            </h2>
            <div
              style={{
                width: "44px",
                height: "3px",
                background: "var(--secondary-container)",
                borderRadius: "2px",
                margin: "0 auto 28px",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {trustItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    background: "var(--surface-container-low)",
                    borderRadius: "1.5rem",
                    padding: "16px 20px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      background: item.iconBg,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "var(--on-surface)",
                        marginBottom: "2px",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--on-surface-variant)",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ===== VARIETIES SECTION ===== */}
      {featuredMangoes.length > 0 && (
        <section className="section" style={{ background: "var(--surface-container-low)" }}>
          <div className="container">
            <div style={{ marginBottom: "48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "var(--primary)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  THE COLLECTION
                </div>
                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 800,
                    color: "var(--on-surface)",
                    letterSpacing: "-0.03em",
                    marginBottom: "12px",
                  }}
                >
                  Our Curated Varieties
                </h2>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "var(--on-surface-variant)",
                    maxWidth: "480px",
                    lineHeight: 1.75,
                  }}
                >
                  Fresh, Handpicked Mangoes at Prices Better Than the Market Straight from the farms to your doorstep
                </p>
              </div>
              <Link
                href="/varieties"
                className="btn-outline"
                style={{
                  fontSize: "0.9rem",
                  padding: "12px 24px",
                  color: "var(--primary)",
                  borderColor: "var(--primary)",
                  whiteSpace: "nowrap",
                }}
              >
                View All Varieties →
              </Link>
            </div>

            <div className="grid-3">
              {/* Combo Card - Always First */}
              <ComboCard allMangoes={allMangoes} />

              {/* Featured Mangoes */}
              {featuredMangoes.map((mango) => (
                <MangoCardWithModal key={mango.id} mango={mango} config={config} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== REVIEWS SECTION ===== */}
      <section className="section" style={{ background: "var(--surface-container-lowest)" }}>
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
              Voices of Satisfaction
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--on-surface-variant)", lineHeight: 1.75 }}>
              Join our community of fruit connoisseurs
            </p>
          </div>

          <div className="grid-3">
            {reviews.map((review) => (
              <div key={review.name} className="review-card">
                <div className="stars">{"★".repeat(review.stars)}</div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--on-surface-variant)",
                    lineHeight: 1.75,
                    margin: "14px 0 20px",
                  }}
                >
                  &ldquo;{review.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "var(--primary-container)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "var(--on-primary-container)",
                      flexShrink: 0,
                    }}
                  >
                    {review.initial}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "var(--on-surface)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {review.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ── Desktop defaults ───────────────────────────────────────── */
        .hero-desktop    { display: flex; }
        .hero-mobile     { display: none; }
        .trust-desktop   { display: flex; align-items: center; justify-content: space-between; gap: 48px; flex-wrap: wrap; }
        .trust-mobile    { display: none; }
        /* ── Mobile overrides (≤ 640px) ─────────────────────────────── */
        @media (max-width: 640px) {
          .hero-desktop  { display: none !important; }
          .hero-mobile   { display: flex; }

          .trust-desktop { display: none !important; }
          .trust-mobile  { display: block; }

          /* Stack the 3-col grids to 1 column */
          .grid-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
