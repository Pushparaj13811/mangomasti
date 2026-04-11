"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteMango, toggleFeatured } from "../../actions/mangoes";
import { useRouter } from "next/navigation";

interface Mango {
  id: number;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  images: string[];
  season: string | null;
  origin: string | null;
  taste: string | null;
  tags: string[] | null;
  featured: boolean;
  originalPrice: number | null;
  discountedPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MangoTableProps {
  mangoes: Mango[];
}

export default function MangoTable({ mangoes }: MangoTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this mango variety?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteMango(id);
      router.refresh();
    } catch (error) {
      console.error("Error deleting mango:", error);
      alert("Failed to delete mango. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      await toggleFeatured(id);
      router.refresh();
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Failed to update featured status. Please try again.");
    }
  };

  return (
    <>
      {/* Add New Button */}
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/admin/mangoes/add"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            borderRadius: "8px",
            background: "var(--primary)",
            color: "#ffffff",
            fontSize: "0.95rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
        >
          ➕ Add New Mango
        </Link>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {mangoes.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🥭</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>
              No mangoes yet
            </h3>
            <p style={{ fontSize: "0.95rem" }}>Get started by adding your first mango variety</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Season
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Featured
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mangoes.map((mango, index) => (
                  <tr
                    key={mango.id}
                    style={{
                      borderBottom: index < mangoes.length - 1 ? "1px solid #f3f4f6" : "none",
                    }}
                  >
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ fontSize: "1.5rem" }}>🥭</div>
                        <div>
                          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111827" }}>{mango.name}</div>
                          <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>{mango.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111827" }}>
                          ₹{(mango.discountedPrice / 100).toFixed(2)}
                        </div>
                        {mango.originalPrice && (
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "#9ca3af",
                              textDecoration: "line-through",
                            }}
                          >
                            ₹{(mango.originalPrice / 100).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#6b7280",
                        }}
                      >
                        {mango.season || "N/A"}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <button
                        onClick={() => handleToggleFeatured(mango.id, mango.featured)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid #e5e7eb",
                          background: mango.featured ? "#fef3c7" : "#f9fafb",
                          color: mango.featured ? "#92400e" : "#6b7280",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {mango.featured ? "⭐ Featured" : "☆ Not Featured"}
                      </button>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <Link
                          href={`/admin/mangoes/edit/${mango.id}`}
                          style={{
                            display: "inline-block",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "1px solid #e5e7eb",
                            background: "#ffffff",
                            color: "#374151",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(mango.id)}
                          disabled={deletingId === mango.id}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "1px solid #fecaca",
                            background: "#ffffff",
                            color: "#ef4444",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            cursor: deletingId === mango.id ? "not-allowed" : "pointer",
                            opacity: deletingId === mango.id ? 0.5 : 1,
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            if (deletingId !== mango.id) {
                              e.currentTarget.style.background = "#fef2f2";
                            }
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = "#ffffff";
                          }}
                        >
                          {deletingId === mango.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
