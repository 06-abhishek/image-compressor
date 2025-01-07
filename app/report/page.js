"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Report = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    screenshot: null,
    description: "",
  });
  const [formUploaded, setFormUploaded] = useState(false);
  const { data: session, status } = useSession();

  // handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0]; // Get the first file
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData((prevState) => ({
            ...prevState,
            [name]: reader.result, // Base64 string of the file
          }));
        };
        reader.onerror = () => {
          alert("Error reading file. Please try again.");
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      let response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          email: "",
          name: "",
          screenshot: null,
          description: "",
        });

        setFormUploaded(true);
        setTimeout(() => {
          setFormUploaded(false);
        }, 5000);
      } else {
        alert("Error submitting bug report.");
      }
    } catch (err) {
      console.error("Error submitting bug report:", err);
    }
  };

  return (
    <section>
      {formUploaded && (
        <div
          id="toast-success"
          className="flex items-center w-full max-w-xs h-14 p-4 mb-4 text-gray-500 bg-white rounded-lg shadow absolute right-5 top-20"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="sr-only">Check icon</span>
          </div>
          <div className="ms-3 text-sm font-normal">
            Item moved successfully.
          </div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
            data-dismiss-target="#toast-success"
            aria-label="Close"
            onClick={() => {
              setFormUploaded(false);
            }}
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">
          Report Bug
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 sm:text-xl">
          Encountered a technical glitch? Help us improve by reporting the
          issue. Your feedback makes a difference!
        </p>
        <form onSubmit={handleOnSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder={session ? session.user.email : "name@flowbite.com"}
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              value={formData.name}
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder={session ? session.user.name : "Enter your name"}
              required
            />
          </div>
          
          {/* Screenshot: */}
          {/* <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Screenshot
            </label>
            <input
              type="file"
              id="screenshot"
              name="screenshot"
              onChange={handleChange}
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder={session ? session.user.name : "Enter your name"}
              required
            />
          </div> */}
          
          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Bug description
            </label>
            <textarea
              id="description"
              name="description"
              rows="6"
              onChange={handleChange}
              value={formData.description}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please add that much details as possible"
            ></textarea>
          </div>
          <button
            type="submit"
            className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-700 sm:w-fit hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Report;
