"use client";
import React, { useEffect, useRef, useState } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { AiOutlineUpload, AiOutlineClose } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import JSZip, { file } from "jszip";
import imageCompression from "browser-image-compression";

export default function Page() {
  const fileInputRef = useRef(null);
  const imageDownloadRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSelectedFileEmpty, setIsSelectedFileEmpty] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);
  const [compressionInPercentage, setCompressionInPercentage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
            compressedFile: compressedFile, // Compressed file
            compressionInPercentage, // Add compression percentage to the object
          };
        } catch (error) {
          console.log("Compression Failed: ", error);
          return {
            id: uuidv4(),
            originalFile: file, // Fallback to original file
            compressedFile: file, // Store original file as compressed fallback
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

  // Clear all image:
  const handleClearAll = (event) => {
    setSelectedFiles([]);
    fileInputRef.current.value = ""; // Clear the input field
  };

  // Delete a particular image:
  const handleDeleteImage = (id) => {
    let newArr = selectedFiles.filter((item) => {
      return item.id !== id;
    });
    setSelectedFiles(newArr);
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
  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent the default behavior to allow drop
    event.stopPropagation();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Get the files from the dropped data
    const files = Array.from(event.dataTransfer.files); // Convert FileList to array
    const filesWithId = files.map((file) => ({ id: uuidv4(), file })); // Add unique id to each file
    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...filesWithId,
    ]);
  };

  // Select image on click:
  const handleImageOnClick = (img) => {
    setSelectedImage(img);
  };

  // Calculate percentage of compression:
  useEffect(() => {
    if (selectedFiles.length > 0) {
      let compressed =
        selectedFiles[0].originalFile.size -
        selectedFiles[0].compressedFile.size;
      let average = compressed / selectedFiles[0].originalFile.size;
      let compressionInPercentage = average * 100;

      setCompressionInPercentage(compressionInPercentage.toFixed(2));
    }
  }, [selectedFiles]);

  useEffect(() => {
    console.log(selectedImage);
  }, [selectedImage]);
  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  return (
    <>
      <Header />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="m-8 shadow-[0px_0px_6px_rgba(0,0,0,0.1)] bg-red-30 p-6 rounded-md"
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
          <button
            onClick={handleUploadOnClick}
            className="flex items-center font-semibold text-white bg-blue-500 px-4 py-2 rounded-md border-2 border-blue-500 hover:bg-white hover:border-blue-500 hover:text-blue-500  focus:ring-4 focus:outline-none focus:ring-blue-200 transition-all duration-300 ease-in-out"
          >
            <AiOutlineUpload className="mr-2" size={27} />
            UPLOAD IMAGES
          </button>

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
          <div className="h-[174px] w-full flex justify-center items-center border-2 border-dashed border-red-800">
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
                {/* <div className="w-[297px] h-[371px]"> */}
                <div className="w-[300px] h-[300px]">
                  <a
                    href={URL.createObjectURL(d.originalFile)}
                    target="_main"
                    ref={imageDownloadRef}
                  >
                    <img
                      src={URL.createObjectURL(d.originalFile)} // Convert file to object URL
                      alt="Selected Image"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </a>
                </div>

                <div className="w-[300px] h-[300px] absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 rounded-md text-white">
                  {/* Image Name */}
                  <p className="w-[255px] absolute top-0 left-2 text-lg font-semibold">
                    {d.originalFile.name}
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

            <div className="flex justify-center relative">
              {/* original Image: */}
              <img
                className={`max-h-96 w-auto border-[1px] border-solid border-[rgba(0,0,0,0.4)] rounded-2xl`}
                src={URL.createObjectURL(selectedImage.originalFile)}
                alt="Your selected image"
              />

              {/* Compressed Image: */}
              <img
                className={`max-h-96 w-auto border-[1px] border-solid border-[rgba(0,0,0,0.4)] rounded-2xl absolute ${
                  showOriginal ? "invisible" : "visible"
                }`}
                src={URL.createObjectURL(selectedImage.compressedFile)}
                alt="Your selected image"
              />
            </div>

            {/* Toggle Button: */}
            <button
              className="text-blue-500 font-semibold text-sm"
              onClick={() => {
                setShowOriginal(!showOriginal);
              }}
            >
              {showOriginal ? "Show Compressed" : "Show Original"}
            </button>

            {/* Download selected image */}
            <div className="flex justify-center">
              <a
                href={URL.createObjectURL(selectedImage.compressedFile)}
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
