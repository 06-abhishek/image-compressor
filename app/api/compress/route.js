import { NextResponse } from "next/server";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for binary file handling
  },
};

export async function POST(req) {
  try {
    // Extract custom settings from query parameters
    const url = new URL(req.url);
    const quality = parseInt(url.searchParams.get("quality")) || 75;
    const width = parseInt(url.searchParams.get("width")) || null;
    const height = parseInt(url.searchParams.get("height")) || null;
    const formatInput = url.searchParams.get("formatInput") || "jpeg";

    // Read binary file from the request body
    const imageBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Validate format
    const supportedFormats = ["jpeg", "png", "webp"];
    if (!supportedFormats.includes(formatInput)) {
      return NextResponse.json({
        success: false,
        message: `Unsupported format: ${formatInput}`,
      });
    }

    // Process the image using sharp
    const compressedBuffer = await sharp(buffer)
      .resize(width || undefined, height || undefined)
      .toFormat(formatInput, { quality })
      .toBuffer();

    // Respond with the compressed image
    return new NextResponse(compressedBuffer, {
      headers: {
        "Content-Type": `image/${formatInput}`,
        "Content-Disposition": `attachment; filename="Custom-Compressed.${formatInput}"`,
      },
    });
  } catch (err) {
    console.error("Error processing image:", err);
    return NextResponse.json({
      success: false,
      message: "Image compression failed",
    });
  }
}
