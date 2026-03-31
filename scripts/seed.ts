/**
 * Database seed script
 * Run with: bun scripts/seed.ts
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/app/db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool, { schema });

const seedReviews: schema.NewReview[] = [
  {
    name: "Priya Sharma",
    address: "Mumbai, Maharashtra",
    variety: "Alphonso",
    rating: 5,
    title: "Best Alphonso I've ever tasted!",
    body: "The Alphonso mangoes arrived in perfect condition. Each one was perfectly ripe, incredibly fragrant, and melted in my mouth. The sweetness is unmatched — this is what summer is all about. Will definitely order again next season.",
    approved: true,
  },
  {
    name: "Ravi Kumar",
    address: "Hyderabad, Telangana",
    variety: "Banganapalli",
    rating: 5,
    title: "Fresh from the orchard — you can taste the difference",
    body: "Ordered Banganapalli for the family and everyone loved them. The mangoes were large, fiberless, and had that authentic sweet flavor we grew up with. Delivery was fast and the packaging kept them fresh. Highly recommend Mango Masti!",
    approved: true,
  },
  {
    name: "Ananya Reddy",
    address: "Vijayawada, Andhra Pradesh",
    variety: "Imam Pasand",
    rating: 5,
    title: "Royal variety lives up to its name",
    body: "Imam Pasand truly deserves its royal reputation. The texture is so smooth and velvety, almost like eating mango ice cream. I shared these with my parents and they couldn't believe how good they were. The quality is consistently excellent.",
    approved: true,
  },
  {
    name: "Suresh Patel",
    address: "Ahmedabad, Gujarat",
    variety: "Kesar",
    rating: 5,
    title: "Queen of Mangoes — absolutely divine",
    body: "Being from Gujarat, I have high standards for Kesar mangoes. Mango Masti exceeded every expectation. The saffron-like aroma filled my entire kitchen when I cut one open. Sweet, rich, and perfectly ripe. This is the real deal.",
    approved: true,
  },
  {
    name: "Meera Iyer",
    address: "Bangalore, Karnataka",
    variety: "Dasheri",
    rating: 4,
    title: "Wonderful aroma and rich flavor",
    body: "The Dasheri mangoes had that characteristic strong aroma I love. The pulp was fiberless and sweet with a hint of tang. They ripened perfectly over two days after delivery. My kids ate them all within a day! Packaging could be slightly improved but the fruit quality is top-notch.",
    approved: true,
  },
  {
    name: "Arjun Nair",
    address: "Chennai, Tamil Nadu",
    variety: "Malgova",
    rating: 5,
    title: "The King of South Indian mangoes delivered fresh",
    body: "Malgova is my all-time favorite and Mango Masti nailed it. The mangoes were enormous — some were close to 600g each! The flesh was juicy and mildly sweet, perfect for making milkshake. Super fresh and no bruising despite shipping from far away.",
    approved: true,
  },
  {
    name: "Deepika Singh",
    address: "Delhi, NCR",
    variety: "Mallika",
    rating: 5,
    title: "Best hybrid mango, incredible shelf life",
    body: "I was skeptical about ordering mangoes online but Mango Masti changed my mind completely. The Mallika mangoes stayed fresh for almost a week! The flavor is complex — sweet with a beautiful floral aroma. This is now my go-to place for quality mangoes every season.",
    approved: true,
  },
  {
    name: "Kavitha Menon",
    address: "Kochi, Kerala",
    variety: "Sindhura",
    rating: 5,
    title: "The red mango that's as beautiful as it is delicious",
    body: "Never seen such beautiful mangoes in my life! The red color of Sindhura is stunning and the taste is lovely — mild, smooth, and sweet. My children call them 'princess mangoes'. The delivery was right on time and every single mango was perfect.",
    approved: true,
  },
];

async function seed() {
  console.log("Seeding database...");
  try {
    await db.insert(schema.reviews).values(seedReviews);
    console.log(`✓ Inserted ${seedReviews.length} reviews`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
