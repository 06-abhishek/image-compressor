import React from "react";
import Link from "next/link";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-4xl rounded-lg p-6">
        <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">
          About Us
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Welcome to the <strong>Image Compression App</strong> – your ultimate
          solution for effortless, high-quality image optimization. Designed
          with both casual users and professionals in mind, our app is here to
          make image compression simple, efficient, and accessible to everyone.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Our Purpose
        </h2>
        <p className="text-gray-700 mb-4">
          In a world where visuals drive communication, managing large image
          files can be a challenge. Whether you're a photographer looking to
          optimize your portfolio or a business needing to enhance website
          performance, our app solves the problem of bulky images without
          compromising quality.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            High-Quality Compression: Reduce file sizes significantly while
            maintaining stunning image quality.
          </li>
          <li>
            Custom Compression Profiles: Tailor the compression level to meet
            your specific needs.
          </li>
          <li>Multi-Format Support: Work with JPEG, PNG, GIF, and more.</li>
          <li>
            Drag-and-Drop Functionality: Simplify your workflow with easy file
            uploads.
          </li>
          <li>
            Real-Time Preview: See the results before downloading your
            compressed images.
          </li>
          <li>Dark Mode: Enjoy a user-friendly experience, day or night.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Built for Everyone
        </h2>
        <p className="text-gray-700 mb-4">
          Our app is perfect for photographers, designers, developers, and
          businesses alike. Whether you're optimizing images for web
          performance, sharing on social media, or saving storage space, our
          tool is here to help.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Powered by Innovation
        </h2>
        <p className="text-gray-700 mb-4">
          Built using the latest web technologies like <strong>React</strong>{" "}
          and <strong>Node.js</strong>, our app delivers a seamless user
          experience with lightning-fast processing and robust backend
          performance. We also integrate advanced image optimization algorithms
          to ensure top-notch results.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Our Vision
        </h2>
        <p className="text-gray-700 mb-4">
          We aim to create a world where image compression is no longer a
          hassle. By combining innovation and user-centric design, we’re
          continuously improving our app to meet evolving needs, providing you
          with an indispensable tool for the digital age.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Join Our Community
        </h2>
        <p className="text-gray-700">
          Your feedback matters! We’re committed to making this app the best it
          can be. If you encounter a bug or have ideas for new features, let us
          know through our{" "}
          <Link href="/report" className="text-blue-500 hover:underline">
            Bug Reporting Form
          </Link>
          . Together, we can create a tool that serves your needs even better.
        </p>
      </div>
    </div>
  );
};

export default About;
