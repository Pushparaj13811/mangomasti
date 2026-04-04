"use client";

import { useState } from "react";
import type { Mango } from "../db/schema";

interface ComboCardProps {
  allMangoes: Mango[];
}

interface ComboSelection {
  mangoId: number;
  mangoName: string;
  quantity: number;
}

export default function ComboCard({ allMangoes }: ComboCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selections, setSelections] = useState<ComboSelection[]>([]);

  const handleQuantityChange = (mango: Mango, quantity: number) => {
    const existing = selections.find((s) => s.mangoId === mango.id);

    if (quantity <= 0) {
      // Remove from selections
      setSelections(selections.filter((s) => s.mangoId !== mango.id));
    } else if (existing) {
      // Update quantity
      setSelections(
        selections.map((s) =>
          s.mangoId === mango.id ? { ...s, quantity } : s
        )
      );
    } else {
      // Add new selection
      setSelections([
        ...selections,
        { mangoId: mango.id, mangoName: mango.name, quantity },
      ]);
    }
  };

  const getQuantity = (mangoId: number) => {
    return selections.find((s) => s.mangoId === mangoId)?.quantity || 0;
  };

  const totalKgs = selections.reduce((sum, s) => sum + s.quantity, 0);

  const handleOrderCombo = () => {
    if (selections.length === 0) {
      alert("Please select at least one mango variety");
      return;
    }

    const orderDetails = selections
      .map((s) => `• ${s.mangoName}: ${s.quantity}kg`)
      .join("\n");

    const message = `Hi! I'd like to order a *Mango Combo*:\n\n${orderDetails}\n\n*Total: ${totalKgs}kg*`;
    window.open(
      `https://wa.me/917977740596?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      {/* Combo Card */}
      <article
        onClick={() => setIsModalOpen(true)}
        style={{
          cursor: "pointer",
          background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
          borderRadius: "2rem",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(255, 107, 53, 0.3)",
          position: "relative",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(255, 107, 53, 0.4)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 107, 53, 0.3)";
        }}
      >
        {/* Decorative pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          }}
        />

        <div style={{ padding: "32px 24px", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(10px)",
              color: "#ffffff",
              borderRadius: "9999px",
              padding: "6px 14px",
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "16px",
            }}
          >
            ✨ SPECIAL OFFER
          </div>

          {/* Icon */}
          <div style={{ fontSize: "4rem", marginBottom: "12px", lineHeight: 1 }}>
            🥭🎁
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: "1.8rem",
              fontWeight: 900,
              color: "#ffffff",
              marginBottom: "8px",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            Create Your Combo
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: "0.95rem",
              color: "rgba(255, 255, 255, 0.95)",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            Mix and match your favorite mango varieties! Choose multiple types and customize the quantity of each.
          </p>

          {/* Features */}
          <div style={{ marginBottom: "24px" }}>
            {[
              "Choose any combination",
              "Customize quantities",
              "Best value for variety lovers",
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "1rem" }}>✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
              color: "#FF6B35",
              borderRadius: "12px",
              padding: "14px 24px",
              fontSize: "1rem",
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <span>Build Your Combo</span>
            <span style={{ fontSize: "1.3rem" }}>→</span>
          </div>
        </div>
      </article>

      {/* Combo Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              maxWidth: "700px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
                padding: "32px 28px",
                color: "#ffffff",
                position: "relative",
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 300,
                }}
              >
                ×
              </button>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🥭🎁</div>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 900,
                  marginBottom: "8px",
                  letterSpacing: "-0.02em",
                }}
              >
                Create Your Mango Combo
              </h2>
              <p style={{ fontSize: "1rem", opacity: 0.95 }}>
                Select your favorite varieties and quantities
              </p>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "28px" }}>
              {/* Mango Selection List */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                {allMangoes.map((mango) => {
                  const quantity = getQuantity(mango.id);
                  return (
                    <div
                      key={mango.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px",
                        background: quantity > 0 ? "#fff7ed" : "#f9fafb",
                        borderRadius: "12px",
                        border: quantity > 0 ? "2px solid #FF6B35" : "1px solid #e5e7eb",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "#111827",
                            marginBottom: "4px",
                          }}
                        >
                          {mango.name}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          ₹{(mango.discountedPrice / 100).toFixed(2)}/kg
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <button
                          onClick={() => handleQuantityChange(mango, quantity - 1)}
                          disabled={quantity === 0}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            background: "#ffffff",
                            color: "#374151",
                            fontSize: "1.2rem",
                            cursor: quantity === 0 ? "not-allowed" : "pointer",
                            opacity: quantity === 0 ? 0.5 : 1,
                            fontWeight: 700,
                          }}
                        >
                          −
                        </button>
                        <div
                          style={{
                            width: "60px",
                            textAlign: "center",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "#111827",
                          }}
                        >
                          {quantity} kg
                        </div>
                        <button
                          onClick={() => handleQuantityChange(mango, quantity + 1)}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            border: "1px solid #FF6B35",
                            background: "#FF6B35",
                            color: "#ffffff",
                            fontSize: "1.2rem",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              {selections.length > 0 && (
                <div
                  style={{
                    background: "#f9fafb",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      marginBottom: "12px",
                    }}
                  >
                    YOUR SELECTION
                  </div>
                  {selections.map((s) => (
                    <div
                      key={s.mangoId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.95rem",
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      <span>{s.mangoName}</span>
                      <span style={{ fontWeight: 600 }}>{s.quantity} kg</span>
                    </div>
                  ))}
                  <div
                    style={{
                      borderTop: "2px solid #e5e7eb",
                      marginTop: "12px",
                      paddingTop: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    <span>Total</span>
                    <span>{totalKgs} kg</span>
                  </div>
                </div>
              )}

              {/* Order Button */}
              <button
                onClick={handleOrderCombo}
                disabled={selections.length === 0}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  background: selections.length === 0 ? "#d1d5db" : "#25D366",
                  color: "#ffffff",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  cursor: selections.length === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  if (selections.length > 0) {
                    e.currentTarget.style.background = "#20BA5A";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (selections.length > 0) {
                    e.currentTarget.style.background = "#25D366";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>💬</span>
                <span>Order Combo on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
