"use client";

import { useState } from "react";
import Link from "next/link";
import { createMango, updateMango } from "../../actions/mangoes";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
}

interface MangoFormProps {
  mango?: Mango;
}

export default function MangoForm({ mango }: MangoFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: mango?.name || "",
    description: mango?.description || "",
    longDescription: mango?.longDescription || "",
    season: mango?.season || "",
    origin: mango?.origin || "",
    taste: mango?.taste || "",
    tags: mango?.tags?.join(", ") || "",
    featured: mango?.featured || false,
    discountedPrice: mango?.discountedPrice ? (mango.discountedPrice / 100).toFixed(0) : "",
  });

  // Existing images (base64 strings)
  const [existingImages, setExistingImages] = useState<string[]>(mango?.images || []);

  // New images to upload (File objects)
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  // Preview URLs for new images
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    setNewImageFiles((prev) => [...prev, ...filesArray]);

    // Create preview URLs
    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = "";
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate at least one image
    if (existingImages.length === 0 && newImageFiles.length === 0) {
      alert("Please add at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("longDescription", formData.longDescription);
      formDataToSend.append("season", formData.season);
      formDataToSend.append("origin", formData.origin);
      formDataToSend.append("taste", formData.taste);
      formDataToSend.append("tags", formData.tags);
      formDataToSend.append("featured", String(formData.featured));
      formDataToSend.append("discountedPrice", String(Math.round(parseFloat(formData.discountedPrice) * 100)));

      // Send existing images as JSON
      if (mango) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }

      // Add new image files
      newImageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      if (mango) {
        await updateMango(mango.id, formDataToSend);
        alert("Mango updated successfully!");
      } else {
        await createMango(formDataToSend);
        alert("Mango created successfully!");
      }

      router.push("/admin/mangoes");
      router.refresh();
    } catch (error) {
      console.error("Error saving mango:", error);
      alert("Failed to save mango. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalImages = existingImages.length + newImageFiles.length;

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "32px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Basic Information Section */}
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "20px",
                paddingBottom: "12px",
                borderBottom: "2px solid #f3f4f6",
              }}
            >
              Basic Information
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Alphonso, Kesar, Dasheri"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(253, 139, 0, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Short Description <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description for card view"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(253, 139, 0, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Long Description */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Long Description <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  placeholder="Detailed description for modal view"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(253, 139, 0, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "20px",
                paddingBottom: "12px",
                borderBottom: "2px solid #f3f4f6",
              }}
            >
              Images ({totalImages}) <span style={{ color: "#ef4444" }}>*</span>
            </h3>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  Current Images ({existingImages.length})
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {existingImages.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "2px solid #e5e7eb",
                      }}
                    >
                      <Image
                        src={image}
                        alt={`Existing ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "#ef4444",
                          color: "#ffffff",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          lineHeight: 1,
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        }}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {newImagePreviews.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  New Images ({newImagePreviews.length})
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {newImagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "2px solid var(--primary)",
                      }}
                    >
                      <Image
                        src={preview}
                        alt={`New ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "#ef4444",
                          color: "#ffffff",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          lineHeight: 1,
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        }}
                        title="Remove image"
                      >
                        ×
                      </button>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          left: "4px",
                          background: "var(--primary)",
                          color: "#ffffff",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        NEW
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Images Button */}
            <div>
              <label
                htmlFor="image-upload"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "2px dashed #d1d5db",
                  background: "#f9fafb",
                  color: "#374151",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.background = "#fff7ed";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.background = "#f9fafb";
                  e.currentTarget.style.color = "#374151";
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>📸</span>
                <span>Add Images</span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFileAdd}
                style={{ display: "none" }}
              />
              <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "8px" }}>
                Upload one or more images. Supports JPG, PNG, WebP
              </p>
            </div>
          </div>

          {/* Pricing Section */}
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "20px",
                paddingBottom: "12px",
                borderBottom: "2px solid #f3f4f6",
              }}
            >
              Pricing
            </h3>

            <div style={{ maxWidth: "320px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Your Price per kg (₹) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={formData.discountedPrice}
                onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                placeholder="e.g. 150"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(253, 139, 0, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {formData.discountedPrice && (
                <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "8px" }}>
                  Will show as <strong>₹{formData.discountedPrice}/kg</strong> with original <strong>₹{Math.round(parseFloat(formData.discountedPrice) / 0.8)}</strong> struck through (20% OFF)
                </p>
              )}
            </div>
          </div>

          {/* Additional Details Section */}
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "20px",
                paddingBottom: "12px",
                borderBottom: "2px solid #f3f4f6",
              }}
            >
              Additional Details
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Season and Origin */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Season
                  </label>
                  <input
                    type="text"
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    placeholder="e.g., Summer, April-June"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(253, 139, 0, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#d1d5db";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Origin
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g., Maharashtra, India"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(253, 139, 0, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#d1d5db";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Taste Profile */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Taste Profile
                </label>
                <input
                  type="text"
                  value={formData.taste}
                  onChange={(e) => setFormData({ ...formData, taste: e.target.value })}
                  placeholder="e.g., Sweet, Rich, Aromatic"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(253, 139, 0, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., Premium, Organic, Best Seller (comma separated)"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(253, 139, 0, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Featured Checkbox */}
              <div
                style={{
                  padding: "16px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111827" }}>
                      Featured on homepage
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "2px" }}>
                      Display this mango variety prominently on the homepage
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "40px",
            paddingTop: "24px",
            borderTop: "2px solid #f3f4f6",
            justifyContent: "flex-end",
          }}
        >
          <Link
            href="/admin/mangoes"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              color: "#374151",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "12px 32px",
              borderRadius: "8px",
              border: "none",
              background: isSubmitting ? "#d1d5db" : "var(--primary)",
              color: "#ffffff",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {isSubmitting ? "Saving..." : mango ? "Update Mango" : "Create Mango"}
          </button>
        </div>
      </div>
    </form>
  );
}
