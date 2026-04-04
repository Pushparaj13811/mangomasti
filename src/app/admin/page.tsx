import { getMangoes } from "../actions/mangoes";
import { getCurrentUser } from "../actions/auth";
import { redirect } from "next/navigation";
import InteractiveLink from "./components/InteractiveLink";

export default async function AdminDashboard() {
  // Verify authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  // Fetch stats
  const mangoes = await getMangoes();
  const totalMangoes = mangoes.length;
  const featuredMangoes = mangoes.filter((m) => m.featured).length;
  const activeMangoes = mangoes.filter((m) => m.discountedPrice > 0).length;

  const stats = [
    {
      label: "Total Varieties",
      value: totalMangoes,
      icon: "🥭",
      color: "var(--primary)",
      bgColor: "rgba(253, 139, 0, 0.1)",
    },
    {
      label: "Featured",
      value: featuredMangoes,
      icon: "⭐",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Active Listings",
      value: activeMangoes,
      icon: "✅",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
  ];

  return (
    <div style={{ maxWidth: "1400px" }}>
      {/* Welcome header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#111827",
            marginBottom: "8px",
            letterSpacing: "-0.02em",
          }}
        >
          Welcome back, {user.username}!
        </h1>
        <p style={{ fontSize: "1rem", color: "#6b7280" }}>
          Here&apos;s an overview of your mango inventory
        </p>
      </div>

      {/* Stats cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  background: stat.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.75rem",
                }}
              >
                {stat.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    marginBottom: "4px",
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: 800,
                    color: stat.color,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          Quick Actions
        </h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <InteractiveLink
            href="/admin/mangoes/add"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "8px",
              background: "var(--primary)",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              transition: "all 0.2s ease",
              border: "none",
            }}
            hoverStyle={{
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(253, 139, 0, 0.3)",
            }}
          >
            <span>➕</span>
            <span>Add New Mango</span>
          </InteractiveLink>
          <InteractiveLink
            href="/admin/reviews"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#374151",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              border: "1px solid #e5e7eb",
              transition: "all 0.2s ease",
            }}
            hoverStyle={{
              background: "#f9fafb",
              borderColor: "#d1d5db",
            }}
          >
            <span>💬</span>
            <span>Manage Reviews</span>
          </InteractiveLink>
          <InteractiveLink
            href="/"
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#374151",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              border: "1px solid #e5e7eb",
              transition: "all 0.2s ease",
            }}
            hoverStyle={{
              background: "#f9fafb",
              borderColor: "#d1d5db",
            }}
          >
            <span>🌐</span>
            <span>View Live Site</span>
          </InteractiveLink>
        </div>
      </div>

      {/* Recent mangoes */}
      {totalMangoes > 0 && (
        <div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            Recent Mangoes
          </h2>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #e5e7eb",
            }}
          >
            {mangoes.slice(0, 5).map((mango, index) => (
              <div
                key={mango.id}
                style={{
                  padding: "16px 20px",
                  borderBottom: index < 4 && mangoes.length > 1 ? "1px solid #f3f4f6" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      fontSize: "1.5rem",
                    }}
                  >
                    🥭
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {mango.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#6b7280",
                      }}
                    >
                      ₹{(mango.discountedPrice / 100).toFixed(2)}
                      {mango.featured && " • Featured"}
                    </div>
                  </div>
                </div>
                <InteractiveLink
                  href={`/admin/mangoes/edit/${mango.id}`}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    background: "transparent",
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    border: "1px solid var(--primary)",
                    transition: "all 0.2s ease",
                  }}
                  hoverStyle={{
                    background: "var(--primary)",
                    color: "#ffffff",
                  }}
                >
                  Edit
                </InteractiveLink>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
