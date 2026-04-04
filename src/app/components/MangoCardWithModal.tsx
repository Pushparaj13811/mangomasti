"use client";

import { useState } from "react";
import Image from "next/image";
import MangoModal from "./MangoModal";
import type { Mango } from "../db/schema";

interface MangoCardWithModalProps {
  mango: Mango;
  config?: Record<string, string>;
}

export default function MangoCardWithModal({ mango, config = {} }: MangoCardWithModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format price in rupees
  const formatPrice = (paise: number) => {
    return `₹${(paise / 100).toFixed(2)}`;
  };

  // Parse config values
  const showOriginalPrice = config.show_original_price === "true";
  const showDiscountedPrice = config.show_discounted_price === "true";
  const showTags = config.show_tags === "true";

  return (
    <>
      <article className="mango-card">
        {/* Image */}
        <div
          style={{
            position: "relative",
            height: "220px",
            overflow: "hidden",
            borderRadius: "2rem 2rem 0 0",
            background: "var(--surface-container)",
          }}
        >
          <Image
            src={mango.images[0]}
            alt={mango.name}
            fill
            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {mango.featured && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "rgba(18, 13, 5, 0.72)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                borderRadius: "9999px",
                padding: "4px 12px",
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "22px 20px 24px" }}>
          {/* Name */}
          <h3
            style={{
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "var(--on-surface)",
              marginBottom: "6px",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {mango.name}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--on-surface-variant)",
              lineHeight: 1.7,
              marginBottom: "14px",
            }}
          >
            {mango.description}
          </p>

          {/* Tags */}
          {showTags && mango.tags && mango.tags.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
              {mango.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    border: "1.5px solid var(--tertiary)",
                    color: "var(--tertiary)",
                    borderRadius: "9999px",
                    padding: "3px 10px",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background: "transparent",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Pricing */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            {showOriginalPrice && mango.originalPrice && (
              <span
                style={{
                  fontSize: "1rem",
                  color: "var(--on-surface-variant)",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(mango.originalPrice)}
              </span>
            )}
            {showDiscountedPrice && (
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                }}
              >
                {formatPrice(mango.discountedPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const message = `Hi! I'd like to order *${mango.name}* mangoes.\n\nPrice: ${formatPrice(mango.discountedPrice)}/kg`;
                window.open(`https://wa.me/917977740596?text=${encodeURIComponent(message)}`, "_blank");
              }}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "12px",
                border: "none",
                background: "#25D366",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#20BA5A";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#25D366";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>💬</span>
              <span>Order on WhatsApp</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid var(--primary)",
                background: "transparent",
                color: "var(--primary)",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "var(--primary)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--primary)";
              }}
            >
              <span>Details</span>
              <span style={{ fontSize: "1.1rem" }}>→</span>
            </button>
          </div>
        </div>
      </article>

      {/* Modal */}
      <MangoModal mango={mango} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} config={config} />
    </>
  );
}
