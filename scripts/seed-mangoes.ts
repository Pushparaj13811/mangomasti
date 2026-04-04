import { db } from "../src/app/db";
import { mangoes } from "../src/app/db/schema";
import sharp from "sharp";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const PUBLIC_DIR = join(process.cwd(), "public");
const MAX_WIDTH = 1200; // Higher resolution for better quality
const QUALITY = 95; // High quality

async function processImageToBase64(imagePath: string): Promise<string> {
  try {
    const buffer = await readFile(imagePath);
    const processedBuffer = await sharp(buffer)
      .resize(MAX_WIDTH, null, {
        fit: "inside",
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3, // Best quality resampling
      })
      .webp({
        quality: QUALITY,
        lossless: false, // Use lossy but high quality
        nearLossless: true, // Near-lossless mode for better compression
        smartSubsample: true, // Better chroma subsampling
      })
      .toBuffer();

    const base64 = processedBuffer.toString("base64");
    return `data:image/webp;base64,${base64}`;
  } catch (error) {
    console.error(`Error processing image ${imagePath}:`, error);
    throw error;
  }
}

async function getMangoImages(mangoFolderName: string): Promise<string[]> {
  try {
    const mangoDir = join(PUBLIC_DIR, mangoFolderName);
    const files = await readdir(mangoDir);
    const imageFiles = files.filter(
      (file) => file.endsWith(".webp") || file.endsWith(".jpg") || file.endsWith(".png")
    );

    const base64Images: string[] = [];
    for (const file of imageFiles) {
      const imagePath = join(mangoDir, file);
      console.log(`  Processing: ${file}`);
      const base64 = await processImageToBase64(imagePath);
      base64Images.push(base64);
    }

    return base64Images;
  } catch (error) {
    console.error(`Error reading images from ${mangoFolderName}:`, error);
    return [];
  }
}

const seedData = [
  {
    name: "Alphonso",
    slug: "alphonso",
    folderName: "Alphonso",
    description: "Known as the king of mangoes, Alphonso is rich, creamy, and highly aromatic with a sweet taste.",
    longDescription: "Alphonso, the undisputed King of Mangoes, is celebrated worldwide for its rich, creamy texture and intoxicatingly sweet aroma. Grown predominantly in the Ratnagiri and Sindhudurg districts of Maharashtra, each Alphonso carries a GI tag certifying its heritage. The deep saffron-colored pulp is fiberless, non-stringy, and melts in your mouth with an extraordinary sweetness that lingers. Season: April to June.",
    season: "April – June",
    origin: "Maharashtra, India",
    taste: "Sweet, Rich & Creamy",
    tags: ["Premium", "King of Mangoes", "GI Tagged"],
    featured: true,
    originalPrice: 25000, // ₹250.00
    discountedPrice: 19900, // ₹199.00
  },
  {
    name: "Banganapalli",
    slug: "banganapalli",
    folderName: "Banganapalli",
    description: "Large, sweet mango with smooth texture and minimal fiber, popular for fresh consumption.",
    longDescription: "Banganapalli, also known as 'Benishan', is one of the most popular mango varieties in South India. Named after the town of Banganapalle in Andhra Pradesh, this GI-tagged mango is large, oblong-shaped with thin skin and bright yellow pulp. It has a smooth, fiberless texture with a mild sweetness that makes it perfect for fresh eating, juices, and desserts.",
    season: "March – June",
    origin: "Andhra Pradesh, India",
    taste: "Mild Sweet & Fiberless",
    tags: ["GI Tagged", "South Indian", "Popular"],
    featured: true,
    originalPrice: 18000,
    discountedPrice: 14900,
  },
  {
    name: "Cheruku Rasam",
    slug: "cheruku-rasam",
    folderName: "Cheruku rasam",
    description: "Extremely juicy and sweet mango, often used for juices and traditional drinks.",
    longDescription: "Cheruku Rasam means 'sugarcane juice' in Telugu, a testament to its extraordinary juiciness and sweetness. This traditional Andhra variety is prized for making fresh mango juice and traditional drinks during summer festivals. The pulp is intensely sweet with a distinct aroma that evokes nostalgia and is a seasonal favorite in Andhra Pradesh.",
    season: "May – July",
    origin: "Andhra Pradesh, India",
    taste: "Extremely Juicy & Sweet",
    tags: ["Juice Mango", "Traditional", "Summer Special"],
    featured: false,
    originalPrice: 15000,
    discountedPrice: 11900,
  },
  {
    name: "Chinna Rasalu",
    slug: "chinna-rasalu",
    folderName: "Chinna rasalu",
    description: "Small-sized mango with intense sweetness and high juice content.",
    longDescription: "Chinna Rasalu (meaning 'small juice mango') is a beloved small-sized variety from Andhra Pradesh. Despite its compact size, it packs an intense burst of sweetness and is loaded with juice. Traditional households in Andhra treat this mango as a seasonal delicacy, often sucking the sweet pulp right from the skin. It's perfect for making fresh juices and summer coolers.",
    season: "May – June",
    origin: "Andhra Pradesh, India",
    taste: "Intensely Sweet & Juicy",
    tags: ["Small Variety", "High Juice", "Traditional"],
    featured: false,
    originalPrice: 12000,
    discountedPrice: 9900,
  },
  {
    name: "Dasheri",
    slug: "dasheri",
    folderName: "Dasheri",
    description: "Famous North Indian mango with a strong aroma, fiberless pulp, and rich sweetness.",
    longDescription: "Dasheri is the pride of North India, originating from the village of Dasheri near Lucknow in Uttar Pradesh. With its distinctive elongated shape and thin skin, Dasheri boasts a fiberless, rich orange pulp with an intoxicating aroma that can fill an entire room. It's one of the first mangoes to arrive in the season and is prized for its perfect balance of sweetness and tang.",
    season: "June – August",
    origin: "Uttar Pradesh, India",
    taste: "Rich, Aromatic & Sweet",
    tags: ["North Indian", "Fiberless", "Popular"],
    featured: false,
    originalPrice: 20000,
    discountedPrice: 15900,
  },
  {
    name: "Imam Pasand",
    slug: "imam-pasand",
    folderName: "Imam Pasand",
    description: "Delicate, sweet mango with a unique flavor and soft flesh, highly prized.",
    longDescription: "Imam Pasand, which translates to 'Imam's favorite', lives up to its royal name with its delicately sweet flavor and velvety soft flesh. This premium variety from the Nellore district of Andhra Pradesh is known for its large size, thin skin, and extraordinarily smooth, fiberless pulp. Its subtle sweetness and fragrance make it one of the most prized mangoes in South India.",
    season: "May – July",
    origin: "Andhra Pradesh, India",
    taste: "Delicate, Sweet & Velvety",
    tags: ["Premium", "Royal Variety", "Fiberless"],
    featured: false,
    originalPrice: 19000,
    discountedPrice: 15900,
  },
  {
    name: "Kalepad",
    slug: "kalepad",
    folderName: "Kalepad",
    description: "Traditional variety known for its balanced sweetness and regional popularity.",
    longDescription: "Kalepad is a traditional mango variety cherished in local communities for generations. Its name reflects its distinctive appearance and it offers a beautifully balanced flavor profile — not too sweet, not too tangy. The pulp is soft and smooth with a pleasant aroma. It's a variety that connects people to their roots and the authentic taste of regional mangoes.",
    season: "May – June",
    origin: "South India",
    taste: "Balanced Sweet & Tangy",
    tags: ["Traditional", "Regional", "Heritage"],
    featured: false,
    originalPrice: 14000,
    discountedPrice: 11900,
  },
  {
    name: "Kesar",
    slug: "kesar",
    folderName: "Kesar",
    description: "Bright orange pulp with a saffron-like aroma, very sweet and flavorful.",
    longDescription: "Kesar, aptly named after the golden spice saffron, is the 'Queen of Mangoes' from Gujarat. Primarily grown in the Gir region — famous for its lions — Kesar is celebrated for its distinctive bright orange pulp that resembles the precious saffron. The aroma is intoxicatingly floral, and the taste is exceptionally sweet with no fiber, making it a prized GI-tagged variety.",
    season: "May – July",
    origin: "Gujarat, India",
    taste: "Saffron-like Aroma & Sweet",
    tags: ["GI Tagged", "Queen of Mangoes", "Gujarat"],
    featured: true,
    originalPrice: 22000,
    discountedPrice: 17900,
  },
  {
    name: "Malgova",
    slug: "malgova",
    folderName: "Malgova",
    description: "Round, large mango with thick skin and juicy, mildly sweet pulp.",
    longDescription: "Malgova is known as the 'King of South Indian Mangoes'. This large, round mango has a distinctive thick skin with a deep golden-yellow flesh that is juicy and mildly sweet. Grown primarily in Tamil Nadu and Karnataka, Malgova is popular for its impressive size (often weighing 500g or more) and its refreshing mildness that makes it perfect for eating fresh or making milkshakes.",
    season: "May – July",
    origin: "Tamil Nadu, India",
    taste: "Mildly Sweet & Juicy",
    tags: ["Large Variety", "South Indian", "Popular"],
    featured: false,
    originalPrice: 16000,
    discountedPrice: 12900,
  },
  {
    name: "Mallika",
    slug: "mallika",
    folderName: "Mallika",
    description: "Hybrid mango with strong aroma, low fiber, and rich sweetness.",
    longDescription: "Mallika is a prized hybrid variety developed by crossing the Neelum and Dasheri varieties at IARI, New Delhi. The result is a mango that combines the best of both parents — the intense sweetness and low fiber of Dasheri with the strong aroma and extended shelf life of Neelum. Mallika has a rich, complex flavor profile and is increasingly popular among mango connoisseurs.",
    season: "June – August",
    origin: "Pan-India",
    taste: "Rich, Sweet & Aromatic",
    tags: ["Hybrid", "High Quality", "Low Fiber"],
    featured: false,
    originalPrice: 17000,
    discountedPrice: 13900,
  },
  {
    name: "Neelam",
    slug: "neelam",
    folderName: "neelam",
    description: "Small, aromatic mango that ripens late in the season with a sweet taste.",
    longDescription: "Neelam is the late-season sweetheart of mango lovers. While most varieties bow out by July, Neelam extends the mango season right through August, bringing relief to those who can't get enough. Named for its blue-green hue before ripening, the fully ripe Neelam turns a beautiful golden yellow with a distinctive intense aroma and rich sweetness that is uniquely its own.",
    season: "July – September",
    origin: "South India",
    taste: "Sweet & Intensely Aromatic",
    tags: ["Late Season", "Aromatic", "Popular"],
    featured: false,
    originalPrice: 15000,
    discountedPrice: 12900,
  },
  {
    name: "Panduri",
    slug: "panduri",
    folderName: "Panduri",
    description: "Popular regional mango known for its distinct flavor and juicy texture.",
    longDescription: "Panduri is a beloved regional mango variety that holds a special place in the hearts of locals. Known for its distinctive flavor that sets it apart from commercial varieties, Panduri offers a perfect balance of sweetness and acidity with a wonderfully juicy texture. It's a testament to India's incredible biodiversity of mango cultivars and a favorite among those who seek authentic, traditional tastes.",
    season: "May – June",
    origin: "South India",
    taste: "Distinct & Juicy",
    tags: ["Regional", "Traditional", "Flavorful"],
    featured: false,
    originalPrice: 14000,
    discountedPrice: 11900,
  },
  {
    name: "Pedda Rasalu",
    slug: "pedda-rasalu",
    folderName: "Pedda rasalu",
    description: "Larger version of Rasalu mango, extremely juicy and ideal for pulp extraction.",
    longDescription: "Pedda Rasalu (meaning 'Big Juice Mango') is the larger, more robust cousin of Chinna Rasalu. This Andhra Pradesh specialty is prized for its extraordinary juice content — one mango can yield an impressive amount of sweet, golden nectar. The pulp is smooth, fiberless, and intensely flavored, making it ideal for fresh juices, aamras (mango pulp dessert), and traditional summer preparations.",
    season: "May – July",
    origin: "Andhra Pradesh, India",
    taste: "Sweet, Juicy & Rich",
    tags: ["Juice Mango", "Traditional", "Andhra"],
    featured: false,
    originalPrice: 16000,
    discountedPrice: 12900,
  },
  {
    name: "Sindhura",
    slug: "sindhura",
    folderName: "Sindhura",
    description: "Bright red-skinned mango with mildly sweet pulp and attractive appearance.",
    longDescription: "Sindhura is one of India's most visually striking mangoes, named after the vermillion-red (sindoor) color of its skin. One of the few Indian mango varieties with a naturally red blush, Sindhura stands out at any market stall. Despite its dramatic exterior, the pulp is a gentle orange-yellow with a mild, pleasant sweetness and smooth texture free of fiber. It's as beautiful to look at as it is delicious to eat.",
    season: "May – July",
    origin: "Andhra Pradesh, India",
    taste: "Mildly Sweet & Attractive",
    tags: ["Red Mango", "Unique Variety", "Visual"],
    featured: false,
    originalPrice: 15000,
    discountedPrice: 12900,
  },
  {
    name: "Suwarna Rekha",
    slug: "suwarna-rekha",
    folderName: "Suwarna Rekha",
    description: "Golden-yellow mango with red streaks, known for its sweet and tangy flavor.",
    longDescription: "Suwarna Rekha, meaning 'golden line' in Sanskrit, is named for the distinctive red or golden lines that streak across its beautiful yellow skin. This traditional variety from Andhra Pradesh and Odisha offers a complex flavor profile — a perfect harmony of sweetness and mild tanginess that makes it uniquely memorable. The pulp is firm yet juicy with a pleasant floral aroma.",
    season: "June – July",
    origin: "Andhra Pradesh, India",
    taste: "Sweet & Tangy Balance",
    tags: ["Heritage Variety", "Golden", "Traditional"],
    featured: false,
    originalPrice: 15000,
    discountedPrice: 12900,
  },
];

async function seedMangoes() {
  console.log("🥭 Starting mango database seeding...\n");

  try {
    // Check if data already exists
    const existing = await db.select().from(mangoes).limit(1);
    if (existing.length > 0) {
      console.log("⚠️  Database already contains mangoes. Skipping seed.");
      console.log("   If you want to reseed, delete existing mangoes first.");
      process.exit(0);
    }

    // Process and insert each mango
    for (const mango of seedData) {
      console.log(`\n📦 Processing: ${mango.name}`);

      // Get images from public directory
      const images = await getMangoImages(mango.folderName);

      if (images.length === 0) {
        console.log(`  ⚠️  No images found for ${mango.name}, skipping...`);
        continue;
      }

      console.log(`  ✅ Processed ${images.length} image(s)`);

      // Insert into database
      const { folderName, ...mangoData } = mango;
      await db.insert(mangoes).values({
        ...mangoData,
        images,
      });

      console.log(`  💾 Saved to database`);
    }

    console.log("\n\n🎉 Seeding completed successfully!");
    console.log(`   ${seedData.length} mango varieties have been added to the database.`);
    console.log("\n✨ All images have been processed and optimized.");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding mangoes:", error);
    process.exit(1);
  }
}

seedMangoes();
