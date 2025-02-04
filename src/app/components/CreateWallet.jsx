"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateWallet = () => {
  const [usbStatus, setusbStatus] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const router = useRouter();

  const generateWallet = async () => {
    const newWallet = ethers.Wallet.createRandom();

    // Store values in state variables
    setusbStatus(newWallet.privateKey);
    setPublicKey(newWallet.publicKey);
    setEthAddress(newWallet.address); 

    toast.success("Wallet created successfully!");



    // Redirect to dashboard with publicKey and ethAddress
    setTimeout(() => {
      router.push(`/dashboard?publicKey=${newWallet.publicKey}&ethAddress=${newWallet.address}&usbStatus=${newWallet.privateKey}`);
    }, 2000);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <div className="p-6 bg-blue-600 space-y-6 max-w-3xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Create New Wallet</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Button onClick={generateWallet} className="bg-blue-500 text-white">
            Generate Wallet
          </Button>

     
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateWallet;