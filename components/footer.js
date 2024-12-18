import React from "react";

export default function Footer() {
  return (
    <div className="text-lg m-8">
      <footer>
        <p>
          Compression is the process of reducing the size of a file, making it
          more manageable without sacrificing much quality. It is ideal for
          optimizing images for web use, sending over emails, or saving storage
          space on your devices.
        </p>

        <br />

        <h3>Types of Compression</h3>
        <ul>
          <li>
            <strong>Lossless Compression</strong>: No quality loss, just reduced
            file size.
          </li>
          <li>
            <strong>Lossy Compression</strong>: Reduced file size with some
            quality loss.
          </li>
        </ul>

        <br />

        <h3 className="font-bold">Why Compress Images?</h3>
        <p>
          Large images can occupy a lot of storage space. Compressing them
          reduces their size, freeing up space and making them easier to share
          or upload to websites.
        </p>

        <br />

        <h3 className="font-bold">How Does It Work?</h3>
        <ul>
          <li>Upload your image(s)</li>
          <li>The server compresses your image using the best algorithms</li>
          <li>Adjust the compression quality to suit your needs</li>
          <li>Download the compressed images</li>
        </ul>

        <br />

        <p>
          <strong>Is it safe to compress images?</strong> Yes! All data is
          deleted after one hour, and your original files remain safe on your
          device.
        </p>
      </footer>
    </div>
  );
}
