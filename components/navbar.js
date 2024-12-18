import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <nav className="py-4 bg-white drop-shadow-md">
        <ul className="flex justify-between mx-10">
          <Link href="/">
            <li className="text-3xl font-bold">
              Pixel<span className="text-blue-600">Tight</span>
            </li>
          </Link>
          <Link
            href="/"
            className="text-lg text-white bg-blue-500 py-1 px-4 rounded-lg duration-200 ease-in hover:bg-blue-600"
          >
            <li>Login</li>
          </Link>
        </ul>
      </nav>
    </>
  );
}
