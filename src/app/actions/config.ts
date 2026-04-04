"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { siteConfig } from "../db/schema";
import { eq } from "drizzle-orm";
import { verifySession } from "./auth";
import { DEFAULT_CONFIG, type ConfigKey } from "../lib/config-defaults";

/**
 * Get site configuration
 * Returns all config values as an object
 */
export async function getConfig(): Promise<Record<string, string>> {
  try {
    const configs = await db.select().from(siteConfig);

    const configObject: Record<string, string> = { ...DEFAULT_CONFIG };

    configs.forEach((config) => {
      configObject[config.key] = config.value;
    });

    return configObject;
  } catch (error) {
    console.error("Error fetching config:", error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Get a single config value by key
 */
export async function getConfigValue(key: string): Promise<string | null> {
  try {
    const [config] = await db.select().from(siteConfig).where(eq(siteConfig.key, key)).limit(1);

    return config ? config.value : DEFAULT_CONFIG[key as ConfigKey] || null;
  } catch (error) {
    console.error("Error fetching config value:", error);
    return DEFAULT_CONFIG[key as ConfigKey] || null;
  }
}

/**
 * Update site configuration
 */
export async function updateConfig(updates: Record<string, string>): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify admin session
    const { authenticated } = await verifySession();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    // Update each config key
    for (const [key, value] of Object.entries(updates)) {
      // Check if config exists
      const [existing] = await db.select().from(siteConfig).where(eq(siteConfig.key, key)).limit(1);

      if (existing) {
        // Update existing config
        await db
          .update(siteConfig)
          .set({
            value,
            updatedAt: new Date(),
          })
          .where(eq(siteConfig.key, key));
      } else {
        // Insert new config
        await db.insert(siteConfig).values({
          key,
          value,
        });
      }
    }

    // Revalidate pages that depend on config
    revalidatePath("/");
    revalidatePath("/varieties");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error) {
    console.error("Error updating config:", error);
    return { success: false, error: "Failed to update configuration" };
  }
}

/**
 * Update a single config value
 */
export async function updateConfigValue(key: string, value: string): Promise<{ success: boolean; error?: string }> {
  return updateConfig({ [key]: value });
}

/**
 * Reset configuration to defaults
 */
export async function resetConfig(): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify admin session
    const { authenticated } = await verifySession();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    // Delete all config entries (will fall back to defaults)
    await db.delete(siteConfig);

    // Revalidate pages
    revalidatePath("/");
    revalidatePath("/varieties");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error) {
    console.error("Error resetting config:", error);
    return { success: false, error: "Failed to reset configuration" };
  }
}
