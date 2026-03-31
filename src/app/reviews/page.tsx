import type { Metadata } from "next";
import { getApprovedReviews } from "../actions/reviews";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = {
  title: "Customer Reviews | MangoMasti — What Our Customers Say",
  description:
    "Read genuine reviews from MangoMasti customers. See why thousands of families trust us for premium, chemical-free Indian mangoes every season.",
};

// ─── Static seed reviews ──────────────────────────────────────────────────────

const staticReviews = [
  {
    id: "s1",
    name: "Priya Sharma",
    location: "Hyderabad, Telangana",
    createdAt: new Date("2024-06-15"),
    variety: "Alphonso",
    rating: 5,
    title: "Life-Changing Mangoes!",
    body: "I've been eating mangoes my entire life, but MangoMasti's Alphonso variety completely changed my understanding of what a mango can taste like. The aroma when I opened the box was incredible. This is now a non-negotiable part of every summer for my family.",
  },
  {
    id: "s2",
    name: "Rajesh Kumar",
    location: "Bangalore, Karnataka",
    createdAt: new Date("2024-05-20"),
    variety: "Imam Pasand",
    rating: 5,
    title: "Tried Imam Pasand for the First Time — Mind Blown",
    body: "I had never heard of Imam Pasand before a friend recommended MangoMasti. Ordered a box on WhatsApp and it arrived next day — fresh, perfectly packed. The flavor is unlike anything I've had. Velvety smooth, no fiber.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ReviewsPage() {
  const { data: dbReviews, error } = await getApprovedReviews();
  const allReviews = [...(dbReviews || []), ...staticReviews];

  return (
    <main style={{ paddingTop: "72px", background: "var(--surface-container-low)", minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: "64px", paddingBottom: "96px" }}>
        <div
          className="reviews-layout"
          style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "64px", alignItems: "flex-start" }}
        >
          {/* LEFT COLUMN */}
          <div style={{ position: "sticky", top: "120px" }}>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(59,105,52,0.1)",
                color: "var(--tertiary)",
                borderRadius: "9999px",
                padding: "5px 14px",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
                marginBottom: "20px",
              }}
            >
              The Pulse of Trust
            </div>

            {/* Heading */}
            <h1
              style={{
                fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                fontWeight: 800,
                color: "var(--primary)",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
                marginBottom: "16px",
              }}
            >
              Loved by Mango Lovers
            </h1>

            {/* Body text */}
            <p
              style={{
                fontSize: "1rem",
                color: "var(--on-surface-variant)",
                lineHeight: 1.75,
                fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
                marginBottom: "32px",
              }}
            >
              From the sun-drenched orchards of Ratnagiri to your doorstep, our mangoes tell a story of sweetness, quality, and legacy.
            </p>

            {/* Review Form */}
            <ReviewForm />
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Rating card */}
            <div
              style={{
                background: "var(--surface-container-lowest)",
                borderRadius: "2rem",
                padding: "28px 32px",
                display: "flex",
                alignItems: "center",
                gap: "24px",
                marginBottom: "40px",
                boxShadow: "0 4px 24px rgba(26,28,28,0.06)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "4rem",
                    fontWeight: 800,
                    color: "var(--primary)",
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                    fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
                  }}
                >
                  4.9
                </div>
                <div
                  style={{
                    color: "var(--primary-container)",
                    fontSize: "1.3rem",
                    letterSpacing: "3px",
                    marginTop: "4px",
                  }}
                >
                  ★★★★★
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--on-surface-variant)",
                    fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
                  }}
                >
                  Total Reviews
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "var(--on-surface)",
                    letterSpacing: "-0.03em",
                    fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
                  }}
                >
                  2,840+
                </div>
              </div>
            </div>

            {/* Community Voices label */}
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--primary)",
                fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
                marginBottom: "20px",
              }}
            >
              Community Voices
            </div>

            {/* DB error banner */}
            {error && (
              <div
                style={{
                  marginBottom: "28px",
                  padding: "14px 20px",
                  background: "#fff3cd",
                  color: "#7a5900",
                  borderRadius: "1rem",
                  fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
                  fontSize: "0.9rem",
                }}
              >
                Note: Database connection failed. Showing verified featured reviews.
              </div>
            )}

            {/* Reviews grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {allReviews.map((review: any) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .reviews-layout {
            grid-template-columns: 1fr !important;
          }
          .reviews-layout > div:first-child {
            position: static !important;
          }
        }
      `}</style>
    </main>
  );
}

// ─── Review card sub-component ────────────────────────────────────────────────

function ReviewCard({ review }: { review: any }) {
  const initial = review.name?.charAt(0)?.toUpperCase() || "U";
  const dateStr = new Date(review.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <article className="review-card">
      {/* Top row: stars + variety badge */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <div
          className="stars"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {"★".repeat(review.rating)}
          {"☆".repeat(Math.max(0, 5 - review.rating))}
        </div>
        {review.variety && (
          <span
            style={{
              background: "rgba(122, 89, 0, 0.08)",
              color: "var(--primary)",
              borderRadius: "9999px",
              padding: "3px 10px",
              fontSize: "0.68rem",
              fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
          >
            🥭 {review.variety}
          </span>
        )}
      </div>

      {/* Review title */}
      <h3
        style={{
          fontSize: "1.05rem",
          fontWeight: 700,
          marginBottom: "10px",
          color: "var(--on-surface)",
          letterSpacing: "-0.02em",
          fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
        }}
      >
        {review.title}
      </h3>

      {/* Review body */}
      <p
        style={{
          fontSize: "0.88rem",
          color: "var(--on-surface-variant)",
          lineHeight: 1.75,
          marginBottom: "20px",
          fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
        }}
      >
        &ldquo;{review.body}&rdquo;
      </p>

      {/* Author row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "16px",
          borderTop: "1px solid var(--surface-container)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Avatar */}
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "var(--primary-container)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              fontWeight: 800,
              color: "var(--on-primary-container)",
              flexShrink: 0,
              fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
            }}
            aria-hidden="true"
          >
            {initial}
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.88rem",
                fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
                color: "var(--on-surface)",
              }}
            >
              {review.name}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--on-surface-variant)",
                fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
              }}
            >
              {review.location}
            </div>
          </div>
        </div>

        {/* Date */}
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--on-surface-variant)",
            fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
          }}
        >
          {dateStr}
        </div>
      </div>
    </article>
  );
}
