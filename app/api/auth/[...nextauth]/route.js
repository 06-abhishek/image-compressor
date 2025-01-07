// Note: This configures Google and GitHub as sign-in providers:
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";
import { useCallback } from "react";

const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Note: In NextAuth, callbacks are functions that allow you to modify or update certain pieces of data during various stages of the authentication process -
  callbacks: {
    // Note: signIn callback is triggered when a user is signing in. You can use it to modify or update the user's data before the sign-in process is completed -
    async signIn({ user }) {
      await connectToDatabase();

      const userExists = await User.findOne({ email: user.email });

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
        const newLog = {
          action: "Logged In",
          timestamp: formattedDate,
          details: `You logged into your account on ${formattedDate}`,
        };

        userExists.lastLogin = formattedDate; // Update lastLogin directly
        userExists.lastActive = formattedDate; // Update lastActive directly
        userExists.activityLogs.push(newLog);

        userExists.markModified("lastLogin");
        userExists.markModified("lastActive");
        userExists.markModified("activityLogs");

        await userExists.save();
      } else {
        const newLog = {
          action: "Sign Up",
          timestamp: formattedDate,
          details: `Congratulations! Your account get created successfully on ${formattedDate}`,
        };

        await User.create({
          name: user.name,
          email: user.email,
          username: user.email.split("@")[0],
          profilePic: user.image,
          createdAt: formattedDate,
          lastLogin: formattedDate,
          lastActive: formattedDate,
          activityLogs: [newLog],
        });
      }

      return true;
      // Note: "return true" tells NextAuth that the sign-in process was completed successfully and that the authentication flow can proceed without any issues.
    },

    // Note: The session callback is triggered whenever a session is being created or accessed. It allows you to customize the session data that is returned to the client -
    async session({ session, user }) {
      await connectToDatabase();

      // Find the current user in the database
      const currentUser = await User.findOne({ email: session.user.email });

      if (currentUser) {
        // Attach createdAt and lastLogin to the session object
        session.user.username = currentUser.username;
        session.user.createdAt = currentUser.createdAt;
        session.user.lastLogin = currentUser.lastLogin;
        session.user.userUploads = currentUser.userUploads;
        session.user.userCompressionData = currentUser.userCompressionData;
        session.user.lastActive = currentUser.lastActive;
        session.user.activityLogs = currentUser.activityLogs;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Export authOptions explicitly for server-side usage
export { authOptions };
