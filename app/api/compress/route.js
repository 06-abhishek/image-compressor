import { NextResponse } from "next/server";
import multer, { memoryStorage } from "multer"; // for file upload
import sharp from "sharp"; // for image compression
import { promisify } from "util"; // to convert callback-based functions into promises

// Disable body parsing for this API route
export const config = { api: { bodyParser: false } };

// Set up Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory for quick access
});

const uploadMiddleware = promisify(upload.single("image")); // handles single file upload with key 'image'

export async function POST(req) {
  try {
    // Process the uploaded file
    await uploadMiddleware(req);

    const file = req.file; // the uploaded file

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Get the parameters from the request
    const { quality = 70, width, height, percentage } = req.body;

    // Ensure quality is an integer between 1 and 100
    const qualityInt = Math.min(Math.max(parseInt(quality), 1), 100);

    // Set up the sharp instance for compression
    let image = sharp(file.buffer).jpeg({ quality: qualityInt });

    // Handle resizing based on width/height or percentage
    if (width && height) {
      // Resize the image to the specified width and height
      image = image.resize(parseInt(width), parseInt(height));
    } else if (percentage) {
      // Resize based on percentage
      const newWidth = Math.floor((parseInt(percentage) * file.width) / 100);
      image = image.resize(newWidth);
    }

    // Get the compressed image buffer
    const compressedBuffer = await image.toBuffer();

    // Convert the compressed image to base64 for easy display
    const compressedImage = `data:image/jpeg;base64,${compressedBuffer.toString(
      "base64"
    )}`;

    return NextResponse.json({ compressedImage }, { status: 200 });
  } catch (error) {
    console.error("Error while compressing image: ", error);
    return NextResponse.json(
      { error: "Image compression failed" },
      { status: 500 }
    );
  }
}