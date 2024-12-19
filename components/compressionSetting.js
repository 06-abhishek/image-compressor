// img-compressor\components\compressionSetting.js
"use client";
import React, { useEffect, useState } from "react";

const CompressionSetting = ({ onQualityChange }) => {
  const [quality, setQuality] = useState(70);

  const handleQualityChange = (e) => {
    setQuality(e.target.value);
    onQualityChange(parseInt(e.target.value)); // Notify parent component of the new quality value
  };

  return (
    <div>
      <label htmlFor="quality">Quality: {quality}</label>
      <input
        type="range"
        name="quality"
        id="quality"
        min={1}
        max={100}
        value={quality}
        onChange={handleQualityChange}
      />
    </div>
  );
};

export default CompressionSetting;
