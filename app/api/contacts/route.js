import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import ContactForm from "@/app/models/ContactForm";

export async function POST(req) {
  let data = await req.json();

  await connectToDatabase();

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
  })}-${date.getFullYear().toString().slice(2)} "${date.toLocaleTimeString()}`;

  await ContactForm.create({
    email: data.email,
    subject: data.subject,
    message: data.message,
    sharedOn: formattedDate
  });

  return NextResponse.json({ success: true });
}