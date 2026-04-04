"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error || "Login failed");
      }
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-container-lowest)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "var(--surface-container)",
          borderRadius: "24px",
          padding: "48px 40px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Logo/Brand */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "var(--primary)",
              marginBottom: "8px",
              letterSpacing: "-0.02em",
            }}
          >
            MangoMasti Admin
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--on-surface-variant)",
            }}
          >
            Sign in to manage your mango inventory
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "24px",
              color: "#991b1b",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--on-surface)",
                marginBottom: "8px",
              }}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={isPending}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1.5px solid var(--surface-container-highest)",
                background: "var(--surface-container-low)",
                color: "var(--on-surface)",
                fontSize: "0.95rem",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--surface-container-highest)";
              }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--on-surface)",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isPending}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1.5px solid var(--surface-container-highest)",
                background: "var(--surface-container-low)",
                color: "var(--on-surface)",
                fontSize: "0.95rem",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--surface-container-highest)";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: "12px",
              border: "none",
              background: isPending ? "var(--surface-container-high)" : "var(--primary)",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: isPending ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: isPending ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!isPending) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
