import type { Metadata } from "next";
import { getApprovedReviews } from "../actions/reviews";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";

export const metadata: Metadata = {
  title: "Customer Reviews | MangoMasti — What Our Customers Say",
  description:
    "Read genuine reviews from MangoMasti customers. See why thousands of families trust us for premium, chemical-free Indian mangoes every season.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ReviewsPage() {
  const { data: dbReviews, error } = await getApprovedReviews();
  const allReviews = dbReviews || [];
  const reviewCount = allReviews.length;
  const avgRating = reviewCount > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : "—";

  return (
    <main style={{ paddingTop: "108px", background: "var(--surface-container-low)", minHeight: "100vh" }}>
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
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "var(--on-surface)",
                lineHeight: 1.6,
                fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
                marginBottom: "32px",
                borderLeft: "3px solid var(--primary-container)",
                paddingLeft: "14px",
              }}
            >
              Hear it from our happy customers.
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
                  {avgRating}
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
                  {reviewCount.toLocaleString()}
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

            {/* Reviews grid - Bento style */}
            {allReviews.length === 0 ? (
              <div
                style={{
                  background: "var(--surface-container-lowest)",
                  borderRadius: "2rem",
                  padding: "60px 32px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>💬</div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "var(--on-surface)",
                    marginBottom: "8px",
                    fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
                  }}
                >
                  No reviews yet
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--on-surface-variant)",
                    fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
                  }}
                >
                  Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div
                className="bento-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gridAutoRows: "auto",
                  gap: "20px",
                }}
              >
                {allReviews.map((review: any) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
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
