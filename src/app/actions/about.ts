"use server";

import { db } from "../db";
import { siteConfig } from "../db/schema";
import { eq } from "drizzle-orm";
import { verifySession } from "./auth";
import { revalidatePath } from "next/cache";

export interface AboutContent {
  heroBadge: string;
  heroHeading: string;
  heroDescription: string;
  whoHeading: string;
  whoDescription: string;
  pillars: Array<{
    icon: string;
    bg: string;
    title: string;
    desc: string;
  }>;
  ctaHeading: string;
  ctaDescription: string;
}

const defaultContent: AboutContent = {
  heroBadge: "Est. 2016 — 8 Years of Excellence",
  heroHeading: "The Soul of India's Golden Orchards.",
  heroDescription:
    "We aren't just selling fruit; we're delivering a sun-drenched heritage. For nearly a decade, we have scoured the heart of India to source the most exquisite mangoes for the global palate.",
  whoHeading: "Who We Are",
  whoDescription:
    "Mango Masti was born from a singular obsession: the perfect mango. Unlike typical growers who focus on a single plot of land, we act as curators and master retailers. We spend our seasons traveling through Ratnagiri, Devgad, and the lush groves of Andhra Pradesh. We don't grow mangoes; we source them from the most respected farmers who share our uncompromising standards for ripeness, texture, and fragrance.",
  pillars: [
    {
      icon: "🏆",
      bg: "rgba(255, 190, 0, 0.22)",
      title: "Quality",
      desc: "Hand-inspected for blemishes, size, and Brix levels to ensure only the elite fruits reach you.",
    },
    {
      icon: "🌿",
      bg: "rgba(59, 105, 52, 0.18)",
      title: "Freshness",
      desc: "Our logistics chain is optimized for speed, preserving the orchard-fresh scent in every delivery.",
    },
    {
      icon: "✅",
      bg: "rgba(144, 77, 0, 0.18)",
      title: "Trust",
      desc: "Transparent sourcing and ethical practices with local Indian farmer communities.",
    },
    {
      icon: "🤝",
      bg: "rgba(122, 89, 0, 0.10)",
      title: "Customer First",
      desc: "We don't just sell mangoes; we build relationships. Your satisfaction is our heritage.",
    },
  ],
  ctaHeading: "Have questions? Chat with us.",
  ctaDescription:
    "Whether it's about bulk orders or variety selection, we're here to help.",
};

/**
 * Get About page content from database
 */
export async function getAboutContent(): Promise<AboutContent> {
  try {
    const [config] = await db
      .select()
      .from(siteConfig)
      .where(eq(siteConfig.key, "about_content"))
      .limit(1);

    if (!config) {
      return defaultContent;
    }

    return JSON.parse(config.value) as AboutContent;
  } catch (error) {
    console.error("Error fetching about content:", error);
    return defaultContent;
  }
}

/**
 * Update About page content (admin only)
 */
export async function updateAboutContent(
  content: AboutContent
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify authentication
    const { authenticated } = await verifySession();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    const value = JSON.stringify(content);

    // Check if config exists
    const [existing] = await db
      .select()
      .from(siteConfig)
      .where(eq(siteConfig.key, "about_content"))
      .limit(1);

    if (existing) {
      // Update existing
      await db
        .update(siteConfig)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteConfig.key, "about_content"));
    } else {
      // Insert new
      await db.insert(siteConfig).values({
        key: "about_content",
        value,
      });
    }

    revalidatePath("/about");
    return { success: true };
  } catch (error) {
    console.error("Error updating about content:", error);
    return { success: false, error: "Failed to update content" };
  }
}
