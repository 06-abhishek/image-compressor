// File Path: img-compressor\app\page.js -
"use client";
import React, { useEffect, useRef, useState } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { AiOutlineUpload, AiOutlineClose } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import JSZip, { file } from "jszip";
import imageCompression from "browser-image-compression";
import ImageCompressionComponent from "@/components/compressionPreview";
import CompressionSetting from "@/components/compressionSetting";

export default function Page() {
  const fileInputRef = useRef(null);
  const imageDownloadRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSelectedFileEmpty, setIsSelectedFileEmpty] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [imageQuality, setImageQuality] = useState(70);

  // Is Selected files are empty:
  useEffect(() => {
    if (selectedFiles.length > 0) {
      setIsSelectedFileEmpty(false);
    } else {
      setIsSelectedFileEmpty(true);
    }
  }, [selectedFiles]);

  // Reference to perform input by clicking on a button:
  const handleUploadOnClick = () => {
    fileInputRef.current.click();
  };

  // file change function (to make input work):
  const handleFileChange = async (event) => {
    let files = Array.from(event.target.files); // Converts FileList to an array

    const filesWithCompression = await Promise.all(
      files.map(async (file) => {
        // conditions for Image Compression:
        const options = {
          maxSizeMB: undefined, // User can upload any size image
          maxWidthOrHeight: undefined, // Any height-width image
          useWebWorker: true, // Enable multi-threading for faster compression
          maxInteraction: 10, // Optimize compression interaction
          initialQuality: 70, // Start with 70% quality for compression
          onProgress: (progress) => {
            setCompressionProgress(progress); // set Compression-Progress by Image Compression
          },
        };

        try {
          const compressedFile = await imageCompression(file, options); // Image Compression fulfilled

          // Calculate compression percentage
          const compressionInPercentage = (
            ((file.size - compressedFile.size) / file.size) *
            100
          ).toFixed(2);

          return {
            id: uuidv4(),
            originalFile: file, // Original file
            fileURL: URL.createObjectURL(file), // Generate image url, from original file
            compressedFile: compressedFile, // Compressed file
            compressedFileURL: URL.createObjectURL(compressedFile), // Generate compressed image url, from compressed file
            compressionInPercentage, // Add compression percentage to the object
          };
        } catch (error) {
          console.log("Compression Failed: ", error);
          return {
            id: uuidv4(),
            originalFile: file, // Fallback to original file
            fileURL: URL.createObjectURL(file), // Generate image url, from original file
            compressedFile: file, // Store original file as compressed fallback
            compressedFileURLFallback: URL.createObjectURL(file), // Generate original image url
            compressionInPercentage: 0, // Compression percentage fallback
          };
        }
      })
    );

    setCompressionProgress(0); // Set Compression-Progress to 0

    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...filesWithCompression,
    ]);
  };

  // Clear all image:
  const handleClearAll = (event) => {
    setSelectedFiles([]);
    fileInputRef.current.value = ""; // Clear the input field
  };

  // Delete a particular image:
  const handleDeleteImage = (id) => {
    let imageToDelete = selectedFiles.find((item) => {
      return item.id === id;
    });
    if (imageToDelete) {
      URL.revokeObjectURL(imageToDelete.fileURL);
    }
    setSelectedFiles(
      selectedFiles.filter((item) => {
        return item.id !== id;
      })
    );
  };

  // Download a particular image:
  const handleDownloadImage = (file) => {
    const fileURL = URL.createObjectURL(file);

    // Create a temporary <a> tag for the specific image
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = file.name || "downloaded-image"; // Set filename
    a.click();

    // Clean up the object URL to free memory
    URL.revokeObjectURL(fileURL);
  };

  // Download all images in zip file:
  const handleDownloadAllImages = () => {
    const zip = new JSZip(); // Initialize JSZip instance

    // Add all images to the ZIP
    selectedFiles.forEach((d, index) => {
      zip.file(
        d.compressedFile.name || `image-${index + 1}.jpg`,
        d.compressedFile
      ); // Add each file
    });

    // Generate the ZIP and trigger the download
    zip.generateAsync({ type: "blob" }).then((content) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = "images.zip"; // ZIP file name
      a.click();

      // Clean up
      URL.revokeObjectURL(a.href);
    });
  };

  // Drag and Drop file:
  // User dragging image
  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent the default behavior to allow drop
    event.stopPropagation();
    setIsDragging(true);
  };
  // User leaved their drag
  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };
  // User's image get dropped
  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Get the files from the dropped data
    const files = Array.from(event.dataTransfer.files); // Convert FileList to array

    const filesWithCompression = await Promise.all(
      files.map(async (file) => {
        // conditions for Image Compression:
        const options = {
          maxSizeMB: undefined, // User can upload any size image
          maxWidthOrHeight: undefined, // Any height-width image
          useWebWorker: true, // Enable multi-threading for faster compression
          maxInteraction: 10, // Optimize compression interaction
          initialQuality: 0.8, // Start with 80% quality for compression
        };

        try {
          const compressedFile = await imageCompression(file, options); // Image Compression fulfilled

          // Calculate compression percentage
          const compressionInPercentage = (
            ((file.size - compressedFile.size) / file.size) *
            100
          ).toFixed(2);

          return {
            id: uuidv4(),
            originalFile: file, // Original file
            fileURL: URL.createObjectURL(file), // Generate image url, from original file
            compressedFile: compressedFile, // Compressed file
            compressedFileURL: URL.createObjectURL(compressedFile), // Generate compressed image url, from compressed file
            compressionInPercentage, // Add compression percentage to the object
          };
        } catch (error) {
          console.log("Compression Failed: ", error);
          return {
            id: uuidv4(),
            originalFile: file, // Fallback to original file
            fileURL: URL.createObjectURL(file), // Generate image url, from original file
            compressedFile: file, // Store original file as compressed fallback
            compressedFileURLFallback: URL.createObjectURL(file), // Generate original image url
            compressionInPercentage: 0, // Compression percentage fallback
          };
        }
      })
    );

    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...filesWithCompression,
    ]);
  };

  // Select image on click:
  const handleImageOnClick = (img) => {
    setSelectedImage(img);
  };

  useEffect(() => {
    console.log({
      selectedFiles,
      selectedImage,
      compressionProgress,
      imageQuality,
    });
  }, [selectedImage, selectedFiles, compressionProgress, imageQuality]);

  return (
    <>
      <Header />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`m-8 shadow-[0px_0px_6px_rgba(0,0,0,0.1)] bg-red-30 p-6 rounded-md`}
      >
        <div className="flex justify-center gap-10 mb-5">
          {/* Hidden input to select images */}
          <input
            ref={fileInputRef}
            style={{ display: "none" }}
            type="file"
            name="upload"
            id="upload"
            accept="image/*"
            title="hh"
            multiple
            onChange={handleFileChange}
          />

          {/* Select images */}
          {compressionProgress > 0 && (
            <button
              disabled
              aria-label="Compressing..."
              onClick={handleUploadOnClick}
              className="flex items-center font-semibold text-white bg-blue-500 px-4 py-2 rounded-md border-2 border-blue-500"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-5 h-5 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              {`Compressing Done ${compressionProgress}%`}
            </button>
          )}

          {compressionProgress === 0 && (
            <button
              aria-label="UPLOAD IMAGES"
              onClick={handleUploadOnClick}
              className="flex items-center font-semibold text-white bg-blue-500 px-4 py-2 rounded-md border-2 border-blue-500 hover:bg-white hover:border-blue-500 hover:text-blue-500  focus:ring-4 focus:outline-none focus:ring-blue-200 transition-all duration-300 ease-in-out"
            >
              <AiOutlineUpload className="mr-2" size={27} />
              {compressionProgress > 0 ? "Compressing" : `UPLOAD IMAGES`}
            </button>
          )}

          {/* Delete all selected images */}
          <button
            onClick={handleClearAll}
            className={`flex items-center font-semibold px-4 py-2 rounded-md border-2 ${
              isSelectedFileEmpty
                ? `text-white bg-red-500 border-red-500 opacity-45`
                : `text-white bg-red-500 border-red-500 hover:bg-white hover:border-red-500 hover:text-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 transition-all duration-200 ease-in-out`
            }`}
            disabled={isSelectedFileEmpty}
          >
            <AiOutlineClose className="mr-2" size={27} />
            CLEAR ALL
          </button>
        </div>

        {selectedFiles.length <= 0 && (
          <div
            className={`h-[174px] w-full flex justify-center items-center border-2 border-dashed ${
              isDragging ? "border-red-600" : "border-green-800"
            }`}
          >
            <p className="text-xl font-bold text-[rgba(59,130,246,0.7)]">
              Drag Your File Here
            </p>
          </div>
        )}

        {/* Display selected images */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {selectedFiles.map((d) => (
              <div
                key={d.id}
                className="relative cursor-pointer"
                onClick={() => {
                  handleImageOnClick(d);
                }}
              >
                <div className="w-[300px] h-[300px]">
                  <a href={d.fileURL} target="_main" ref={imageDownloadRef}>
                    <img
                      src={d.fileURL}
                      alt="Selected Image"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </a>
                </div>

                <div className="w-[300px] h-[300px] absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 rounded-md text-white">
                  {/* Image Name */}
                  <p className="w-[255px] absolute top-0 left-2 text-lg font-semibold">
                    {d.originalFile?.name}
                  </p>

                  {/* Delete that particular image */}
                  <button
                    onClick={() => {
                      handleDeleteImage(d.id); // Passed id here
                    }}
                    className="absolute top-0 right-2 mt-2 bg-red-500 px-2 py-1 rounded-md text-white font-semibold hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-300 ease-in-out"
                  >
                    <AiOutlineClose size={10} />
                  </button>

                  <p className="text-6xl font-semibold">
                    {d.compressionInPercentage}%
                  </p>

                  {/* Download that particular image */}
                  <button
                    onClick={() => {
                      handleDownloadImage(d.compressedFile);
                    }}
                    className="absolute bottom-2 mt-2 bg-blue-500 px-3 text-base font-semibold py-1 rounded-md text-white hover:bg-blue-600 transition-all duration-300 ease-in-out"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Download All "button */}
        <div className="flex justify-center mt-5">
          <button
            onClick={handleDownloadAllImages}
            type="button"
            className={`inline-flex items-center px-5 py-2 text-xl font-medium text-center rounded-lg ${
              isSelectedFileEmpty
                ? `text-white bg-gray-500 opacity-45`
                : ` text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 transition-all duration-200 ease-in-out`
            }`}
            disabled={isSelectedFileEmpty}
          >
            Download All
            <span className="inline-flex items-center justify-center w-5 h-5 ms-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
              {selectedFiles.length}
            </span>
          </button>
        </div>
      </div>

      {selectedImage && (
        <div className="m-8 shadow-[0px_0px_6px_rgba(0,0,0,0.1)] bg-red-30 p-6 rounded-md">
          <div className="flex flex-col gap-6">
            <h2 className="font-bold text-lg text-center">
              {selectedImage.originalFile.name}
            </h2>

            <hr />

            <div className="flex justify-evenly">
              <div>
                Original :{" "}
                <span className="font-bold">
                  {Math.floor(selectedImage.originalFile.size / 1024)}KB
                </span>
              </div>
              <div>
                Compressed :{" "}
                <span className="font-bold">
                  {Math.floor(selectedImage.compressedFile.size / 1024)}KB{" "}
                  {`(${selectedImage.compressionInPercentage}%)`}
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <ImageCompressionComponent
                originalSrc={selectedImage.fileURL}
                compressedSrc={selectedImage.compressedFileURL}
              />
            </div>

            <div>
              <CompressionSetting onQualityChange={setImageQuality} />
            </div>

            {/* Download selected image */}
            <div className="flex justify-center">
              <a
                href={selectedImage.fileURL}
                download={
                  selectedImage.compressedFile.name || "downloaded-image"
                }
                className="bg-blue-500 text-xl font-semibold px-5 py-2 rounded-lg text-white hover:bg-blue-600 transition-all duration-300 ease-in-out"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
