"use client";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [showInfo, setShowInfo] = useState(true);
  const [showLogs, setShowLogs] = useState(false);
  const [home, setHome] = useState(false);
  const [contact, setContact] = useState(false);
  const [report, setReport] = useState(false);
  const [about, setAbout] = useState(false);
  const [logout, setLogout] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signup");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="h-screen">Loading...</div>;
  }

  if (!session) {
    return null; // Avoid rendering anything while unauthenticated
  }

  return (
    // Margin for Navbar and FooterBar is 8
    <div className="">
      {/* SideBar: */}
      <div className="fixed top-0 left-0 z-40 min-h-screen w-60 py-12 bg-white flex flex-col items-center shadow-[0_-20px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center mb-6">
          <img
            src={session.user.image}
            alt="Profile Picture"
            className="h-20 rounded-full select-none"
          />
          <h1 className="font-bold text-xl">{session.user.name}</h1>
        </div>

        <ul className="flex flex-col items-center font-semibold">
          <li
            onClick={() => {
              setShowInfo(false);
              setShowLogs(false);
              setHome(true);
              setContact(false);
              setReport(false);
              setAbout(false);
              setLogout(false);

              router.push("/");
            }}
            className={`w-full px-[50.81px] py-2 select-none hover:bg-gray-50 cursor-pointer ${
              home && "bg-gray-50"
            }`}
          >
            Home
          </li>

          <li
            onClick={() => {
              setShowInfo(true);
              setShowLogs(false);
              setHome(false);
              setContact(false);
              setReport(false);
              setAbout(false);
              setLogout(false);
            }}
            className={`w-full px-[50.81px] py-2 select-none hover:bg-gray-50 cursor-pointer ${
              showInfo && "bg-gray-50"
            }`}
          >
            Account Info
          </li>

          <li
            onClick={() => {
              setShowInfo(false);
              setShowLogs(true);
              setHome(false);
              setContact(false);
              setReport(false);
              setAbout(false);
              setLogout(false);
            }}
            className={`w-full px-[50.81px] py-2 hover:bg-gray-50 select-none cursor-pointer ${
              showLogs && "bg-gray-50"
            }`}
          >
            Activity Logs
          </li>

          <li
            onClick={() => {
              setShowLogs(false);
              setHome(false);
              setContact(true);
              setReport(false);
              setAbout(false);
              setLogout(false);

              router.push("/contact");
            }}
            className={`w-full px-[50.81px] py-2 select-none hover:bg-gray-50 cursor-pointer ${
              contact && "bg-gray-50"
            }`}
          >
            Contact Us
          </li>

          <li
            onClick={() => {
              setShowLogs(false);
              setHome(false);
              setContact(false);
              setReport(true);
              setAbout(false);
              setLogout(false);

              router.push("/report");
            }}
            className={`w-full px-[50.81px] py-2 select-none hover:bg-gray-50 cursor-pointer ${
              report && "bg-gray-50"
            }`}
          >
            Report
          </li>

          <li
            onClick={() => {
              setShowLogs(false);
              setHome(false);
              setContact(false);
              setReport(false);
              setAbout(true);
              setLogout(false);

              router.push("/about");
            }}
            className={`w-full px-[50.81px] py-2 select-none hover:bg-gray-50 cursor-pointer ${
              about && "bg-gray-50"
            }`}
          >
            About Us
          </li>

          <li
            onClick={() => {
              setShowLogs(false);
              setHome(false);
              setContact(false);
              setReport(false);
              setAbout(false);
              setLogout(true);

              signOut();
            }}
            className={`w-full px-[50.81px] py-2 select-none text-red-500 hover:bg-gray-50 cursor-pointer ${
              logout && "bg-gray-50"
            }`}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Content Area: */}
      <div className="ml-[240px] min-h-screen my-8">
        {/* Account Info: */}
        {showInfo && (
          <div className="">
            <div className="flex flex-col items-center">
              <img
                src={session.user.image}
                alt="Profile Picture"
                className="h-32 rounded-full select-none bg-gray-600 shadow-sm"
              />
              <h1 className="font-bold text-2xl">{session.user.name}</h1>
              <p className="font-semibold text-base text-gray-700">
                @{session.user.username}
              </p>
            </div>

            <hr className="my-8" />

            <div className="min-h-screen flex items-center justify-center">
              <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
                <h1 className="font-bold text-2xl text-center mb-6">
                  Your Profile
                </h1>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Name:</span>
                    <span>{session.user.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Username:</span>
                    <span>{session.user.username}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Email:</span>
                    <span>{session.user.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Account Created:</span>
                    <span>{session.user.createdAt}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Last Logged:</span>
                    <span>{session.user.lastLogin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Last Activity:</span>
                    <span>{session.user.lastActive}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Uploads:</span>
                    <span>
                      {session.user.userUploads
                        ? session.user.userUploads.length
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Compressions:</span>
                    <span>
                      {session.user.userCompressionData
                        ? session.user.userCompressionData.length
                        : 0}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                  <p className="text-gray-600 mt-2">
                    {
                      session.user.activityLogs[
                        session.user.activityLogs.length - 1
                      ]?.details
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Activity Logs: */}
        {showLogs && (
          <div className="">
            <div className="flex flex-col items-center">
              <img
                src={session.user.image}
                alt="Profile Picture"
                className="h-32 rounded-full select-none bg-gray-600 shadow-sm"
              />
              <h1 className="font-bold text-2xl">{session.user.name}</h1>
              <p className="font-semibold text-base text-gray-700">
                @{session.user.username}
              </p>
            </div>

            <hr className="my-8" />

            <div className="mx-8">
              <h1 className="font-bold text-2xl mb-6">Activity Logs</h1>
              <div className="ml-4 text-lg text-gray-700"></div>
            </div>

            <ol className="relative border-s border-gray-200 mx-12">
              {session &&
                session.user.activityLogs
                  .slice()
                  .reverse() // This reverses the order of logs
                  .map((log, index) => {
                    return (
                      <li
                        className={
                          index === 0 || index === 1 ? "mb-10 ms-6" : "ms-6"
                        }
                        key={index}
                      >
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-gray-50">
                          <svg
                            className="w-2.5 h-2.5 text-blue-800"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                          </svg>
                        </span>
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                          {log.action}
                          {index === 0 && (
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded ms-3">
                              Latest
                            </span>
                          )}
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                          Released on {log.timestamp}
                        </time>
                        <p className="mb-4 text-base font-normal text-gray-500">
                          {log.details}
                        </p>
                      </li>
                    );
                  })}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
