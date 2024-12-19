// img-compressor\components\compressionPreview.js
import React from "react";
import ReactCompareImage from "react-compare-image";

const ImageCompressionComponent = ({ originalSrc, compressedSrc }) => {
  return (
    <div className="w-full max-w-[450px] m-auto">
      <div className="h-auto overflow-hidden border-[1px] border-solid border-black rounded-2xl">
        <ReactCompareImage
          leftImage={originalSrc}
          rightImage={compressedSrc}
          sliderLineWidth={2}
        />
      </div>
    </div>
  );
};

export default ImageCompressionComponent;
