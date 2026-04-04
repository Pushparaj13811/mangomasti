"use server";

import { db } from "@/app/db";
import { reviews, type NewReview } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifySession } from "./auth";

export async function getApprovedReviews() {
  try {
    const data = await db.query.reviews.findMany({
      where: eq(reviews.approved, true),
      orderBy: [desc(reviews.createdAt)],
    });
    return { data, error: null };
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return { data: [], error: "Failed to fetch reviews" };
  }
}

/**
 * Get all reviews (admin only - includes unapproved)
 */
export async function getAllReviews() {
  try {
    const data = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    return data;
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return [];
  }
}

/**
 * Approve a review
 */
export async function approveReview(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify admin session
    const { authenticated } = await verifySession();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    await db.update(reviews).set({ approved: true }).where(eq(reviews.id, id));

    // Revalidate reviews page
    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Error approving review:", error);
    return { success: false, error: "Failed to approve review" };
  }
}

/**
 * Unapprove a review
 */
export async function unapproveReview(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify admin session
    const { authenticated } = await verifySession();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    await db.update(reviews).set({ approved: false }).where(eq(reviews.id, id));

    // Revalidate reviews page
    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Error unapproving review:", error);
    return { success: false, error: "Failed to unapprove review" };
  }
}

/**
 * Delete a review
 */
export async function deleteReview(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify admin session
    const { authenticated } = await verifySession();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    await db.delete(reviews).where(eq(reviews.id, id));

    // Revalidate reviews page
    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: "Failed to delete review" };
  }
}

export async function submitReview(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const variety = formData.get("variety") as string;
  const rating = parseInt(formData.get("rating") as string);
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  if (!name || !rating || !title || !body) {
    return { success: false, error: "Please fill in all required fields" };
  }

  const newReview: NewReview = {
    name,
    address: address || null,
    variety: variety || null,
    rating,
    title,
    body,
    approved: false,
  };

  try {
    await db.insert(reviews).values(newReview);
    revalidatePath("/reviews");
    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { success: false, error: "Failed to submit review. Please try again." };
  }
}
