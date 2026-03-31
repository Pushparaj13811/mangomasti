"use client";

import { useState, useTransition } from "react";
import { submitReview } from "../actions/reviews";

export default function ReviewForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [rating, setRating] = useState(5);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await submitReview(formData);
      if (result.success) {
        setMessage({ type: "success", text: "Thank you! Your review has been submitted and is pending approval." });
        (document.getElementById("review-form") as HTMLFormElement).reset();
        setRating(5);
      } else {
        setMessage({ type: "error", text: result.error || "Something went wrong." });
      }
    });
  }

  const labelStyle = {
    fontSize: "0.72rem",
    fontWeight: 800,
    color: "var(--on-surface-variant)",
    fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "8px",
    display: "block",
  };

  const inputStyle = {
    padding: "12px 18px",
    borderRadius: "9999px",
    border: "none",
    fontSize: "0.9rem",
    outline: "none",
    background: "var(--surface-container-lowest)",
    color: "var(--on-surface)",
    width: "100%",
    fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
    transition: "box-shadow 0.2s",
    boxSizing: "border-box" as const,
  } as React.CSSProperties;

  const focusStyle = "0 0 0 3px rgba(122,89,0,0.15)";

  return (
    <div
      style={{
        background: "var(--surface-container-low)",
        borderRadius: "2rem",
        padding: "28px 32px",
        boxShadow: "0 4px 24px rgba(26,28,28,0.06)",
      }}
    >
      <form
        id="review-form"
        action={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {/* Hidden field */}
        <input type="hidden" name="variety" value="" />

        {/* Customer Name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="review-name" style={labelStyle}>Customer Name *</label>
          <input
            type="text"
            id="review-name"
            name="name"
            required
            placeholder="Your name"
            style={inputStyle}
            onFocus={(e) => { (e.target as HTMLInputElement).style.boxShadow = focusStyle; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.boxShadow = "none"; }}
          />
        </div>

        {/* Review Title */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="review-title" style={labelStyle}>Review Title *</label>
          <input
            type="text"
            id="review-title"
            name="title"
            required
            placeholder="e.g. Best Alphonso I've ever tasted!"
            style={inputStyle}
            onFocus={(e) => { (e.target as HTMLInputElement).style.boxShadow = focusStyle; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.boxShadow = "none"; }}
          />
        </div>

        {/* Address */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="review-address" style={labelStyle}>Your City / Address</label>
          <input
            type="text"
            id="review-address"
            name="address"
            placeholder="e.g. Mumbai, Maharashtra"
            style={inputStyle}
            onFocus={(e) => { (e.target as HTMLInputElement).style.boxShadow = focusStyle; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.boxShadow = "none"; }}
          />
        </div>

        {/* Star Rating */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={labelStyle}># of Stars *</span>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  fontSize: "1.6rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: star <= rating ? "var(--primary-container)" : "var(--surface-container)",
                  padding: "0 2px",
                  transition: "color 0.15s",
                }}
                aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
            <input type="hidden" name="rating" value={rating} />
          </div>
        </div>

        {/* Your Experience */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="review-body" style={labelStyle}>Your Experience *</label>
          <textarea
            id="review-body"
            name="body"
            required
            rows={4}
            placeholder="Tell us about the taste, delivery, or your overall experience..."
            style={{
              ...inputStyle,
              borderRadius: "1.5rem",
              resize: "vertical",
              padding: "14px 18px",
            }}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.boxShadow = focusStyle; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.boxShadow = "none"; }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--inverse-surface)",
            color: "#ffffff",
            borderRadius: "9999px",
            padding: "14px 24px",
            fontSize: "0.9rem",
            fontWeight: 700,
            width: "100%",
            border: "none",
            cursor: isPending ? "not-allowed" : "pointer",
            fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif",
            letterSpacing: "0.02em",
            marginTop: "4px",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? "Submitting..." : "Share My Feedback"}
        </button>

        {/* Message */}
        {message && (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: "1rem",
              fontSize: "0.9rem",
              background: message.type === "success" ? "var(--tertiary-fixed)" : "#FFEBEE",
              color: message.type === "success" ? "var(--on-tertiary-container)" : "#C62828",
              fontFamily: "var(--font-vietnam, 'Be Vietnam Pro'), sans-serif",
            }}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
