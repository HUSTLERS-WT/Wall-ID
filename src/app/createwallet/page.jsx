"use client";
import React from "react";
import CreateWallet from "./../components/CreateWallet.jsx"; // Correct import path

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <CreateWallet />
    </div>
  );
};

export default Page;
