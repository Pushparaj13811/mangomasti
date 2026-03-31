"use server";

import { db } from "@/app/db";
import { reviews, type NewReview } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
