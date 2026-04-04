import { db } from "../src/app/db";
import { mangoes } from "../src/app/db/schema";

async function clearMangoes() {
  console.log("Clearing mango data...");

  try {
    await db.delete(mangoes);
    console.log("✅ All mango data cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing mango data:", error);
    process.exit(1);
  }
}

clearMangoes();
