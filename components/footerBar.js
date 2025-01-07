import React from "react";

const FooterBar = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className="bg-white text-gray-700 py-4 shadow-[0_-2px_6px_-1px_rgba(0,0,0,0.05)]">
        <p className="text-sm text-center">
          &copy; {currentYear} PixelTight. All Rights Reserved.
        </p>
      </footer>
    </>
  );
};
export default FooterBar;
