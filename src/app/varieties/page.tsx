import { getMangoes } from "../actions/mangoes";
import { getConfig } from "../actions/config";
import MangoCardWithModal from "../components/MangoCardWithModal";
import ComboCard from "../components/ComboCard";

export default async function VarietiesPage() {
  // Fetch all mangoes from database
  const mangoes = await getMangoes();

  // Fetch config
  const config = await getConfig();

  return (
    <main style={{ paddingTop: "72px" }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface-container-low)",
          padding: "72px 0 56px",
        }}
      >
        <div className="container">
          {/* Green badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--tertiary)",
              color: "#fff",
              borderRadius: "9999px",
              padding: "5px 16px",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            SEASONAL SELECTION 2024
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
              fontWeight: 800,
              color: "var(--on-surface)",
              marginBottom: "20px",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Our{" "}
            <span style={{ color: "var(--secondary-container)" }}>
              Mango
            </span>{" "}
            Collection
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1rem",
              color: "var(--on-surface-variant)",
              maxWidth: "480px",
              lineHeight: 1.75,
            }}
          >
            From the sun-kissed orchards of Ratnagiri to the fertile plains of Uttar
            Pradesh, we bring you India&apos;s finest gold. Hand-selected at peak
            ripeness, our catalog celebrates the soul of the summer.
          </p>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "48px 0 96px",
          background: "var(--surface-container-low)",
        }}
      >
        <div className="container">
          {mangoes.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--on-surface-variant)",
              }}
            >
              <p style={{ fontSize: "1.1rem" }}>No mangoes available at the moment.</p>
              <p style={{ fontSize: "0.95rem", marginTop: "10px" }}>
                Please check back soon for our seasonal varieties!
              </p>
            </div>
          ) : (
            <div className="grid-3">
              {/* Combo Card - Always First */}
              <ComboCard allMangoes={mangoes} />

              {/* All Mangoes */}
              {mangoes.map((mango) => (
                <MangoCardWithModal key={mango.id} mango={mango} config={config} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
