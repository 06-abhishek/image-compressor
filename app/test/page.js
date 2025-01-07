"use client";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Test = () => {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <div>
        {session.user.userUploads && (
          <img src={session.user.userUploads[0].fileURL} alt="Upload" />
        )}

        {session.user.userCompressionData ? (
          session.user.userCompressionData.map((item, index) => (
            <img
              key={index}
              src={item}
              alt="Your Compressed Image"
              className="h-20"
            />
          ))
        ) : (
          <p>You not uploaded any images...</p>
        )}
      </div>
    );
  } else {
    return <p>No User</p>;
  }
};

export default Test;
