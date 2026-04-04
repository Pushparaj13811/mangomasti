import sharp from "sharp";

const MAX_WIDTH = 1200; // Increased for better quality
const QUALITY = 95; // High quality
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates that the file is an image and within size limits
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }

  return { valid: true };
}

/**
 * Process image file to base64:
 * 1. Resize to max width while maintaining aspect ratio
 * 2. Convert to WebP format
 * 3. Compress with quality setting
 * 4. Convert to base64 string with data URI prefix
 */
export async function processImageToBase64(file: File): Promise<string> {
  try {
    // Validate first
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process with Sharp - using lossless WebP for high quality
    const processedBuffer = await sharp(buffer)
      .resize(MAX_WIDTH, null, {
        // Maintain aspect ratio
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

    // Convert to base64 with data URI prefix
    const base64 = processedBuffer.toString("base64");
    return `data:image/webp;base64,${base64}`;
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image");
  }
}

/**
 * Get image dimensions from base64 string
 */
export async function getImageDimensions(base64String: string): Promise<{ width: number; height: number }> {
  try {
    // Remove data URI prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  } catch (error) {
    console.error("Error getting image dimensions:", error);
    throw new Error("Failed to get image dimensions");
  }
}
