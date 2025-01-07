import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [authLoading, setAuthLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") {
      setAuthLoading(true);
    } else {
      setAuthLoading(false);
    }
  }, [status]);

  const isActive = (path) => pathname === path;

//   useEffect(() => {
//     console.log(session);
//   }, [session]);

  return (
    <div>
      <nav className="bg-white py-4 drop-shadow-sm">
        <div className="flex justify-between items-center mx-10">
          <h1 className="text-3xl font-bold cursor-pointer">
            Pixel<span className="text-blue-600">Tight</span>
          </h1>

          <ul className="flex items-center gap-5">
            <li
              className={`font-semibold hover:text-blue-600 hover:underline duration-100 ease-in ${
                isActive("/") && "text-blue-600"
              }`}
            >
              <Link href="/">Home</Link>
            </li>
            <li
              className={`font-semibold hover:text-blue-600 hover:underline duration-100 ease-in ${
                isActive("/contact") && "text-blue-600"
              }`}
            >
              <Link href="/contact">Contact Us</Link>
            </li>
            <li
              className={`font-semibold hover:text-blue-600 hover:underline duration-100 ease-in ${
                isActive("/report") && "text-blue-600"
              }`}
            >
              <Link href="/report">Report</Link>
            </li>
            <li
              className={`font-semibold hover:text-blue-600 hover:underline duration-100 ease-in ${
                isActive("/about") && "text-blue-600"
              }`}
            >
              <Link href="/about">About Us</Link>
            </li>
            <li>
              {session ? (
                <img
                  src={session.user.image}
                  alt="Profile Picture"
                  className="h-9 rounded-full cursor-pointer"
                  onClick={() => router.push("/profile")}
                />
              ) : (
                <Link
                  href="/auth/signup"
                  className="text-lg font-semibold text-white bg-blue-500 py-2 px-4 rounded-lg duration-200 ease-in hover:bg-blue-600"
                >
                  Join With Us
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
