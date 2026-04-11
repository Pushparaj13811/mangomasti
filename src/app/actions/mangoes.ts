"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { mangoes } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { processImageToBase64 } from "../lib/image-processing";
import { verifySession } from "./auth";

/**
 * Get all mangoes (optionally filter by featured)
 */
export async function getMangoes(featuredOnly?: boolean) {
  try {
    const query = db.select().from(mangoes).orderBy(desc(mangoes.featured), desc(mangoes.createdAt));

    const results = await query;

    if (featuredOnly) {
      return results.filter((mango) => mango.featured);
    }

    return results;
  } catch (error) {
    console.error("Error fetching mangoes:", error);
    return [];
  }
}

/**
 * Get a single mango by slug
 */
export async function getMangoBySlug(slug: string) {
  try {
    const [mango] = await db.select().from(mangoes).where(eq(mangoes.slug, slug)).limit(1);

    return mango || null;
  } catch (error) {
    console.error("Error fetching mango:", error);
    return null;
  }
}

/**
 * Get a single mango by ID
 */
export async function getMangoById(id: number) {
  try {
    const [mango] = await db.select().from(mangoes).where(eq(mangoes.id, id)).limit(1);

    return mango || null;
  } catch (error) {
    console.error("Error fetching mango:", error);
    return null;
  }
}

/**
 * Generate a unique slug from name
 */
async function generateUniqueSlug(name: string, excludeId?: number): Promise<string> {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existing = await db.select().from(mangoes).where(eq(mangoes.slug, uniqueSlug)).limit(1);

    if (existing.length === 0 || (excludeId && existing[0].id === excludeId)) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

/**
 * Process image files to base64 strings
 */
export async function processImages(formData: FormData): Promise<string[]> {
  const imageFiles = formData.getAll("images") as File[];
  const base64Images: string[] = [];

  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const base64 = await processImageToBase64(file);
      base64Images.push(base64);
    }
  }

  return base64Images;
}

/**
 * Create a new mango
 */
export async function createMango(formData: FormData): Promise<{ success: boolean; error?: string; id?: number }> {
  try {
    // Verify admin session
    const { authenticated } = await verifySession();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    // Extract form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const longDescription = formData.get("longDescription") as string;
    const season = formData.get("season") as string;
    const origin = formData.get("origin") as string;
    const taste = formData.get("taste") as string;
    const featured = formData.get("featured") === "true";
    const originalPrice = parseInt(formData.get("originalPrice") as string);
    const discountedPrice = Math.round(originalPrice * 0.8); // auto 20% off
    const tags = formData.get("tags") as string;

    // Validate required fields
    if (!name || !description || !longDescription || !originalPrice) {
      return { success: false, error: "Missing required fields" };
    }

    // Process images
    const images = await processImages(formData);

    if (images.length === 0) {
      return { success: false, error: "At least one image is required" };
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(name);

    // Parse tags
    const tagsArray = tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    // Insert into database
    const [newMango] = await db
      .insert(mangoes)
      .values({
        name,
        slug,
        description,
        longDescription,
        images,
        season: season || null,
        origin: origin || null,
        taste: taste || null,
        tags: tagsArray,
        featured,
        originalPrice,
        discountedPrice,
      })
      .returning();

    // Revalidate relevant pages
    revalidatePath("/");
    revalidatePath("/varieties");
    revalidatePath("/admin/mangoes");

    return { success: true, id: newMango.id };
  } catch (error) {
    console.error("Error creating mango:", error);
    return { success: false, error: "Failed to create mango" };
  }
}

/**
 * Update an existing mango
 */
export async function updateMango(
  id: number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify admin session
    const { authenticated } = await verifySession();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if mango exists
    const existingMango = await getMangoById(id);
    if (!existingMango) {
      return { success: false, error: "Mango not found" };
    }

    // Extract form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const longDescription = formData.get("longDescription") as string;
    const season = formData.get("season") as string;
    const origin = formData.get("origin") as string;
    const taste = formData.get("taste") as string;
    const featured = formData.get("featured") === "true";
    const originalPrice = parseInt(formData.get("originalPrice") as string);
    const discountedPrice = Math.round(originalPrice * 0.8); // auto 20% off
    const tags = formData.get("tags") as string;
    const existingImagesJson = formData.get("existingImages") as string;

    // Validate required fields
    if (!name || !description || !longDescription || !originalPrice) {
      return { success: false, error: "Missing required fields" };
    }

    // Handle images - combine existing and new
    let images: string[] = [];

    // Add existing images that weren't removed
    if (existingImagesJson) {
      try {
        const existingImages = JSON.parse(existingImagesJson);
        images = [...existingImages];
      } catch (e) {
        console.error("Error parsing existing images:", e);
      }
    }

    // Add new images
    const newImages = await processImages(formData);
    images = [...images, ...newImages];

    // Validate at least one image
    if (images.length === 0) {
      return { success: false, error: "At least one image is required" };
    }

    // Generate unique slug if name changed
    let slug = existingMango.slug;
    if (name !== existingMango.name) {
      slug = await generateUniqueSlug(name, id);
    }

    // Parse tags
    const tagsArray = tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    // Update database
    await db
      .update(mangoes)
      .set({
        name,
        slug,
        description,
        longDescription,
        images,
        season: season || null,
        origin: origin || null,
        taste: taste || null,
        tags: tagsArray,
        featured,
        originalPrice,
        discountedPrice,
        updatedAt: new Date(),
      })
      .where(eq(mangoes.id, id));

    // Revalidate relevant pages
    revalidatePath("/");
    revalidatePath("/varieties");
    revalidatePath("/admin/mangoes");

    return { success: true };
  } catch (error) {
    console.error("Error updating mango:", error);
    return { success: false, error: "Failed to update mango" };
  }
}

/**
 * Delete a mango
 */
export async function deleteMango(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify admin session
    const { authenticated } = await verifySession();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    // Delete from database
    await db.delete(mangoes).where(eq(mangoes.id, id));

    // Revalidate relevant pages
    revalidatePath("/");
    revalidatePath("/varieties");
    revalidatePath("/admin/mangoes");

    return { success: true };
  } catch (error) {
    console.error("Error deleting mango:", error);
    return { success: false, error: "Failed to delete mango" };
  }
}

/**
 * Toggle featured status
 */
export async function toggleFeatured(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify admin session
    const { authenticated } = await verifySession();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    const mango = await getMangoById(id);
    if (!mango) {
      return { success: false, error: "Mango not found" };
    }

    await db
      .update(mangoes)
      .set({ featured: !mango.featured, updatedAt: new Date() })
      .where(eq(mangoes.id, id));

    // Revalidate relevant pages
    revalidatePath("/");
    revalidatePath("/varieties");
    revalidatePath("/admin/mangoes");

    return { success: true };
  } catch (error) {
    console.error("Error toggling featured:", error);
    return { success: false, error: "Failed to toggle featured status" };
  }
}
