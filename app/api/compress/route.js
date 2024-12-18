import { NextResponse } from "next/server";
import multer, { memoryStorage } from "multer"; // to file upload
import sharp from "sharp"; // to image compression
import { promisify } from "util"; // converts callback based function into promises

// Disable body parsing for this API route
export const config = { api: { bodyParser: false } };

// configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory for quick access
});

const uploadMiddleware = promisify(upload.single("image")); // handles the file upload for the key image

export async function POST(req) {
  try {
    // process the upload file
    await uploadMiddleware(req);

    const file = req.file; // uploaded file

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const compressedBuffer = await sharp(file.buffer)
      .jpeg({ quality: 70 }) // Set JPEG quality to 70%
      .toBuffer();

    // converts compressed image to base64 for returning to the client
    const compressedImage = `data:image/jpeg;base64,${compressedBuffer.toString(
      "base64"
    )}`;

    return NextResponse.json({ compressedImage }, { status: 200 });
  } catch (error) {
    console.error("Error while compressing image : ", error);
    return NextResponse.json(
      { error: "Image compression failed" },
      { status: 500 }
    );
  }
}
