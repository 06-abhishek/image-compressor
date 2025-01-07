import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import formidable from "formidable";
import fs from "fs";

export async function POST(req) {
  const dataOfFiles = await req.json(); // get selectedFiles from client
  const session = await getServerSession(authOptions); // getServerSession provides session to backend

  if (!session) {
    return NextResponse.json({ success: false, message: "Session not found" }); // return if session not found (user not logged in)
  }

  await connectToDatabase(); // Connect to DataBase, MongoDB

  if (session) {
    const userExists = await User.findOne({ email: session.user.email });

    // Getting date in this format: "Monday, 23-Dec-24 11:57:06 AM"
    const date = new Date();
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const formattedDate = `${weekdays[date.getDay()]}, ${date
      .getDate()
      .toString()
      .padStart(2, "0")}-${date.toLocaleString("en-US", {
      month: "short",
    })}-${date
      .getFullYear()
      .toString()
      .slice(2)} "${date.toLocaleTimeString()}`;

    if (userExists) {
      try {
        if (dataOfFiles.selectedFiles.length > 0) {
          const newUploadedLog = {
            action: "Image Uploaded",
            timestamp: formattedDate,
            details: `You uploaded your image to compress on ${formattedDate}`,
          };

          // Filter unique `selectedFiles` data to add to the database
          const uniqueUploadData = dataOfFiles.selectedFiles.filter((item) => {
            return !userExists.userUploads.some(
              (itemInDB) => itemInDB.id === item.id
            );
          });
          userExists.userUploads.push(...uniqueUploadData); // Add unique files to UploadData
          userExists.lastActive = formattedDate; // Update lastActive directly
          userExists.activityLogs.push(newUploadedLog);

          userExists.markModified("userUploads");
          userExists.markModified("lastActive");
          userExists.markModified("activityLogs");
          await userExists.save(); // Save the updated user document
        }

        if (dataOfFiles.downloadedImages.length > 0) {
          const newCompressedLog = {
            action: "Image Compressed",
            timestamp: formattedDate,
            details: `Your image get compressed and downloaded on ${formattedDate}`,
          };

          // Filter unique `downloadedImages` data to add to the database
          const uniqueCompressionData = dataOfFiles.downloadedImages.filter(
            (item) => {
              return (
                typeof item === "string" &&
                !userExists.userCompressionData.includes(item)
              );
            }
          );
          userExists.userCompressionData.push(...uniqueCompressionData);
          userExists.lastActive = formattedDate; // Update lastActive directly
          userExists.activityLogs.push(newCompressedLog);

          userExists.markModified("userCompressionData");
          userExists.markModified("lastActive");
          userExists.markModified("activityLogs");
          await userExists.save(); // Save the updated user document
        }
      } catch (err) {
        console.log("Error while updating DB user/files: ", err);
      }
    }
  }

  return NextResponse.json({ success: true, dataOfFiles });
}
