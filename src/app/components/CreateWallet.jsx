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
import { USBDevice } from "@/utils/usb";

const CreateWallet = () => {
  const [usbStatus, setusbStatus] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [usbDevice, setUsbDevice] = useState(null);
  const router = useRouter();

  const connectUSB = async () => {
    const device = new USBDevice();
    const connected = await device.connect();
    if (connected) {
      setUsbDevice(device);
      toast.success("USB device connected!");
    } else {
      toast.error("Failed to connect USB device");
    }
  };

  const generateWallet = async () => {
    if (!usbDevice) {
      toast.error("Please connect USB device first");
      return;
    }

    const newWallet = ethers.Wallet.createRandom();

    // Send private key to USB device
    const success = await usbDevice.writeToDevice(newWallet.privateKey);
    if (!success) {
      toast.error("Failed to write to USB device");
      return;
    }

    // Store values in state variables
    setusbStatus("USB_STORED");
    setPublicKey(newWallet.publicKey);
    setEthAddress(newWallet.address);

    toast.success("Wallet created and stored in USB device!");

    // Redirect to dashboard
    setTimeout(() => {
      router.push(`/dashboard?publicKey=${newWallet.publicKey}&ethAddress=${newWallet.address}&usbStatus=USB_STORED`);
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
          <Button onClick={connectUSB} className="bg-green-500 text-white mb-4">
            Connect USB Device
          </Button>
          <Button 
            onClick={generateWallet} 
            className="bg-blue-500 text-white"
            disabled={!usbDevice}
          >
            Generate Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateWallet;
