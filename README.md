# Image Compressor

A scalable and feature-rich Full-Stack Image Compressor website that enables users to compress, convert, and manage images in a highly optimized way. Built with the aim of showcasing technical expertise, problem-solving skills, and creativity, this project integrates modern technologies like React.js, Next.js, Tailwind CSS, and Node.js.

---

## Features

### Core Features:
- **Image Compression**:
  - Lossless and lossy compression options.
  - Adjustable quality sliders for custom compression levels.
  - Supports JPEG, PNG, and WebP formats.
  
- **Upload Functionality**:
  - Drag-and-drop file upload.
  - Batch upload and compression (minimum 5 images).
  - Supports folder uploads for compressing directories.

- **Output Features**:
  - Real-time preview of compressed images with a side-by-side comparison.
  - Displays the percentage reduction in file size.
  - Options for batch and individual downloads.

- **User Authentication**:
  - Google/GitHub login using JWT or NextAuth.
  - User-specific compression history with metadata (e.g., original file size, compressed file size, date).

- **Dashboard**:
  - Analytics: Total images compressed, total space saved.
  - User settings: Light/Dark mode, theme options.

### Advanced Features:
- **AI-based Compression**: Uses AI to suggest optimal compression levels for each image.
- **Image Format Conversion**: Convert images from one format to another (e.g., PNG to JPEG, JPEG to WebP).
- **Real-time Collaboration**: Share compressed images instantly with others.
- **Progressive Web App (PWA)**: Allows users to install the website as a mobile app.
- **Search & Recommendations**:
  - Search for previously compressed images.
  - Recommendations based on user preferences and settings.

---

## Tech Stack

- **Frontend**: React.js (or Next.js) with Tailwind CSS for modern, responsive UI.
- **Backend**: Node.js with Express.js for API handling.
- **Image Compression**: Sharp or Imagemin for image compression.
- **Cloud Storage**: AWS S3 or Firebase for storing compressed images.
- **Authentication**: NextAuth or JWT for user authentication.
- **Database**: MongoDB Atlas for storing user data and compression history.
- **Deployment**: Vercel/Netlify for frontend, AWS/Render for backend.
- **Caching & Performance**: Redis caching for fast image compression and storage.

---

## Installation

To get started with this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/06-abhishek/image-compressor.git
