"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Mango } from "../db/schema";

interface MangoModalProps {
  mango: Mango;
  isOpen: boolean;
  onClose: () => void;
  config?: Record<string, string>;
}

export default function MangoModal({ mango, isOpen, onClose, config = {} }: MangoModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset image index when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mango.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mango.images.length) % mango.images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Format price in rupees (no decimals)
  const formatPrice = (paise: number) => `₹${Math.round(paise / 100)}`;

  // originalPrice = MRP (admin-entered), discountedPrice = MRP * 0.8 (auto-computed)
  const discountedPaise = mango.discountedPrice;
  const originalPaise = mango.originalPrice ?? Math.round(discountedPaise / 0.8);

  // Parse config values
  const showSeason = config.show_season === "true";
  const showOrigin = config.show_origin === "true";
  const showTaste = config.show_taste === "true";
  const showTags = config.show_tags === "true";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Modal content */}
      <div
        style={{
          position: "relative",
          background: "var(--surface-container)",
          borderRadius: "24px",
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(18, 13, 5, 0.72)",
            backdropFilter: "blur(6px)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "24px",
            zIndex: 10,
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(18, 13, 5, 0.9)";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(18, 13, 5, 0.72)";
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Image carousel */}
        <div
          style={{
            position: "relative",
            height: "400px",
            background: "var(--surface-container-low)",
            borderRadius: "24px 24px 0 0",
            overflow: "hidden",
          }}
        >
          {/* Current image */}
          <Image
            src={mango.images[currentImageIndex]}
            alt={`${mango.name} - Image ${currentImageIndex + 1}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="900px"
            priority
          />

          {/* Navigation arrows */}
          {mango.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(18, 13, 5, 0.72)",
                  backdropFilter: "blur(6px)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "24px",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(18, 13, 5, 0.9)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(18, 13, 5, 0.72)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(18, 13, 5, 0.72)",
                  backdropFilter: "blur(6px)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "24px",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(18, 13, 5, 0.9)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(18, 13, 5, 0.72)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Dot indicators */}
          {mango.images.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
              }}
            >
              {mango.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    border: "none",
                    background: index === currentImageIndex ? "#fff" : "rgba(255, 255, 255, 0.4)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details section */}
        <div style={{ padding: "32px" }}>
          {/* Name */}
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--on-surface)",
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            {mango.name}
          </h2>

          {/* Metadata row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "20px",
              fontSize: "0.9rem",
              color: "var(--on-surface-variant)",
            }}
          >
            {showOrigin && mango.origin && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>📍</span>
                <span>{mango.origin}</span>
              </div>
            )}
            {showSeason && mango.season && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🌤️</span>
                <span>{mango.season}</span>
              </div>
            )}
          </div>

          {/* Long description */}
          <p
            style={{
              fontSize: "1rem",
              color: "var(--on-surface-variant)",
              lineHeight: 1.75,
              marginBottom: "20px",
            }}
          >
            {mango.longDescription}
          </p>

          {/* Taste tags */}
          {showTaste && mango.taste && (
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--on-surface)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "10px",
                }}
              >
                Taste Profile
              </h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {mango.taste.split(/[,/]/).map((taste) => (
                  <span
                    key={taste.trim()}
                    style={{
                      border: "1.5px solid var(--tertiary)",
                      color: "var(--tertiary)",
                      borderRadius: "9999px",
                      padding: "4px 12px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {taste.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {showTags && mango.tags && mango.tags.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {mango.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "var(--tertiary-container)",
                      color: "var(--on-tertiary-container)",
                      borderRadius: "9999px",
                      padding: "5px 14px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pricing — always shown, 20% OFF auto-calculated */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1.1 }}>
                {formatPrice(discountedPaise)}
              </span>
              <span style={{ fontSize: "0.9rem", color: "var(--on-surface-variant)", fontWeight: 600 }}>/kg</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
              <span style={{ fontSize: "1rem", color: "var(--on-surface-variant)", textDecoration: "line-through" }}>
                {formatPrice(originalPaise)}
              </span>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#fff", background: "var(--secondary)", borderRadius: "9999px", padding: "3px 10px", letterSpacing: "0.04em" }}>
                20% OFF
              </span>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/919391956095?text=Hi,%20I%20would%20like%20to%20order%20${encodeURIComponent(mango.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "var(--inverse-surface)",
              color: "#ffffff",
              borderRadius: "9999px",
              padding: "14px 28px",
              fontSize: "1rem",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" />
            </svg>
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
