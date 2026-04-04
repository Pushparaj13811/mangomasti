import { db } from "../src/app/db";
import { adminUsers } from "../src/app/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function createAdminUser() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  console.log("Creating admin user...");
  console.log(`Username: ${username}`);

  try {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (existingUser) {
      console.log("❌ Admin user already exists!");
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const [newUser] = await db
      .insert(adminUsers)
      .values({
        username,
        passwordHash,
      })
      .returning();

    console.log("✅ Admin user created successfully!");
    console.log(`ID: ${newUser.id}`);
    console.log(`Username: ${newUser.username}`);
    console.log("\n⚠️  IMPORTANT: Please change your password after first login");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
