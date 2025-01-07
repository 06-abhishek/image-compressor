// File Path: img-compressor\components\compressionSetting.js -
"use client";
import React, { useState, useEffect } from "react";

const CompressionSetting = ({
  selectedImageToCustomize,
  onCustomDataChange,
  onDownloadImage,
}) => {
  const [customData, setCustomData] = useState({});
  const [CustomizedImageURL, setCustomizedImageURL] = useState(null);
  const [seePreview, setSeePreview] = useState(false);

  const handleQualityChange = (e) => {
    const { name, value } = e.target;

    // Update state and immediately notify the parent of the latest changes
    setCustomData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      return updatedData; // Return the new state
    });
  };

  // Notify the parent component whenever customData changes
  useEffect(() => {
    onCustomDataChange(customData);
  }, [customData, onCustomDataChange]);

  // Function out when customize image form get submit:
  const handleSubmit = async (e) => {
    setSeePreview(true);

    e.preventDefault();

    // Ensure `selectedImageToCustomize` is available
    if (!selectedImageToCustomize) {
      console.error("No image selected");
      return;
    }

    try {
      // Fetch binary data directly
      const response = await fetch(
        `/api/compress?quality=${customData.quality || 75}&width=${
          customData.width || ""
        }&height=${customData.height || ""}&formatInput=${
          customData.formatInput || "jpeg"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": selectedImageToCustomize.type, // e.g., image/jpeg
          },
          body: selectedImageToCustomize, // Send the binary file directly
        }
      );

      if (!response.ok) {
        throw new Error("Compression failed");
      }

      // Process response: Get compressed image as a Blob
      const compressedBlob = await response.blob();
      const compressedUrl = URL.createObjectURL(compressedBlob);

      // Set customized image URL in a state, to display its preview
      setCustomizedImageURL(compressedUrl);

      setSeePreview(false);
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  // Trigger file download
  const handleDownload = () => {
    onDownloadImage((preDownloadFiles) => [
      ...preDownloadFiles,
      CustomizedImageURL,
    ]);

    const link = document.createElement("a");
    link.href = CustomizedImageURL;
    link.download = `compressed.${customData.formatInput || "jpeg"}`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center">
      <form className="w-1/2 flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="font-bold text-2xl text-center">Customize Image</h2>

        <div>
          <label
            htmlFor="quality"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Quality: {customData.quality}
          </label>
          <input
            id="quality"
            name="quality"
            type="range"
            min={1}
            max={100}
            value={customData.quality ? customData.quality : ""}
            onChange={handleQualityChange}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
          />
        </div>

        <div>
          <label
            htmlFor="width"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Width
          </label>
          <input
            type="number"
            id="width"
            name="width"
            min={50}
            max={5000}
            value={customData.width ? customData.width : ""}
            onChange={handleQualityChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Width (in __px)"
          />
        </div>

        <div>
          <label
            htmlFor="height"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Height
          </label>
          <input
            type="number"
            id="height"
            name="height"
            min={50}
            max={5000}
            value={customData.height ? customData.height : ""}
            onChange={handleQualityChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Height (in __px)"
          />
        </div>

        <div>
          <label
            htmlFor="formatInput"
            className="block text-sm font-medium text-gray-900"
          >
            Output Format
          </label>
          <select
            name="formatInput"
            id="formatInput"
            value={customData.formatInput ? customData.formatInput : ""}
            onChange={handleQualityChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
          >
            <option value="" disabled hidden>
              Choose a format
            </option>
            <option value={selectedImageToCustomize.type.split("/")[1]}>
              Original Format
            </option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
        {seePreview ? (
          <button
            type="submit"
            className="bg-blue-600 text-xl font-semibold px-5 py-2 rounded-lg text-white"
            disabled
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-5 h-5 me-3 mb-1 text-white animate-spin"
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
            Customizing
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 text-xl font-semibold px-5 py-2 rounded-lg text-white hover:bg-blue-600 transition-all duration-300 ease-in-out"
          >
            See Preview
          </button>
        )}

        <hr />
      </form>

      {CustomizedImageURL !== null && (
        <div className="w-[400px] h-[400px] mt-4">
          <img
            src={CustomizedImageURL}
            alt="Selected Image"
            className="w-full h-full object-cover rounded-md cursor-pointer"
            onClick={handleDownload}
          />
          <p className="text-xs italic font-semibold text-center text-gray-500 cursor-default">
            Note: Click on Image to Download
          </p>
        </div>
      )}
    </div>
  );
};

export default CompressionSetting;
