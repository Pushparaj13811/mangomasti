"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "../db";
import { adminUsers, adminSessions } from "../db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Login action - validates credentials and creates session
 */
export async function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Find user by username
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);

    if (!user) {
      return { success: false, error: "Invalid username or password" };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, error: "Invalid username or password" };
    }

    // Generate session token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_DURATION);

    // Create session in database
    await db.insert(adminSessions).values({
      userId: user.id,
      token,
      expiresAt,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}

/**
 * Logout action - destroys session
 */
export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      // Delete session from database
      await db.delete(adminSessions).where(eq(adminSessions.token, token));
    }

    // Clear cookie
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Logout error:", error);
  }
}

/**
 * Verify session - checks if user is authenticated
 */
export async function verifySession(): Promise<{ authenticated: boolean; userId?: number }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return { authenticated: false };
    }

    // Find session in database
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.token, token))
      .limit(1);

    if (!session) {
      return { authenticated: false };
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      // Delete expired session
      await db.delete(adminSessions).where(eq(adminSessions.id, session.id));
      return { authenticated: false };
    }

    return { authenticated: true, userId: session.userId };
  } catch (error) {
    console.error("Verify session error:", error);
    return { authenticated: false };
  }
}

/**
 * Get current user - returns user data if authenticated
 */
export async function getCurrentUser() {
  const { authenticated, userId } = await verifySession();

  if (!authenticated || !userId) {
    return null;
  }

  try {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, userId)).limit(1);

    if (!user) {
      return null;
    }

    // Return user without password hash
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Update admin credentials (username and/or password)
 */
export async function updateAdminCredentials(data: {
  username: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify authentication
    const { authenticated, userId } = await verifySession();
    if (!authenticated || !userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get current user
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, userId)).limit(1);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Prepare update object
    const updateData: { username?: string; passwordHash?: string } = {};

    // Update username if changed
    if (data.username !== user.username) {
      // Check if username is already taken
      const [existing] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.username, data.username))
        .limit(1);

      if (existing && existing.id !== userId) {
        return { success: false, error: "Username already taken" };
      }

      updateData.username = data.username;
    }

    // Update password if provided
    if (data.newPassword) {
      if (!data.currentPassword) {
        return { success: false, error: "Current password is required" };
      }

      // Verify current password
      const passwordMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
      if (!passwordMatch) {
        return { success: false, error: "Current password is incorrect" };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      updateData.passwordHash = hashedPassword;
    }

    // Perform update if there are changes
    if (Object.keys(updateData).length > 0) {
      await db.update(adminUsers).set(updateData).where(eq(adminUsers.id, userId));
    }

    return { success: true };
  } catch (error) {
    console.error("Update credentials error:", error);
    return { success: false, error: "Failed to update credentials" };
  }
}
