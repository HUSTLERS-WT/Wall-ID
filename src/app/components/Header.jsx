"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react"; 
import LinkComponent from './Link';  
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { ToastContainer, toast } from 'react-toastify'; // Ensure toast is imported
import 'react-toastify/dist/ReactToastify.css';
import { USBDevice } from "@/utils/usb";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLinkPage, setShowLinkPage] = useState(false);

  const handleWallIdClick = () => {
    setShowLinkPage(true); 
  };

  const [isSignedUp, setIsSignedUp] = useState(false);
  const [usbDevice, setUsbDevice] = useState(null);
  const router = useRouter();

  const handleClick = async () => {
    try {
      // Connect USB device first
      const device = new USBDevice();
      const connected = await device.connect();
      if (!connected) {
        toast.error("Failed to connect USB device");
        return;
      }
      setUsbDevice(device);

      // Generate new wallet
      const newWallet = ethers.Wallet.createRandom();
      const success = await device.writeToDevice(newWallet.privateKey);
      if (!success) {
        toast.error("Failed to write to USB device");
        return;
      }

      setIsSignedUp(true);
      toast.success('Fingerprint and Wallet Registered!');

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push(`/dashboard?publicKey=${newWallet.publicKey}&ethAddress=${newWallet.address}&usbStatus=USB_STORED`);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Error during registration");
    }
  };

  return (
    <>
      <nav className="bg-[#4285f4]">
        {/* Desktop Navbar */}
        <div className="navbar ubuntu-bold text-neutral-content bg-[#4285f4] px-4 sm:px-8 py-3 flex justify-between items-center">

          <button className="btn btn-ghost text-xl text-white">
            <img className="w-34 h-14" src="/logonav.svg" alt="Logo" />
          </button>

          {/* Desktop Menu */}
          <div className="hidden sm:flex justify-evenly navbar ubuntu-bold text-white items-center space-x-6">
            <span
              className="cursor-pointer hover:text-gray-300"
            >
              Wall-ID W1
            </span>
            <span className="cursor-pointer hover:text-gray-300">
              Research
              </span>
              <span className="cursor-pointer hover:text-gray-300">
            <Link  href="/newsroom" className="text-white hover:no-underline hover:text-gray-300">
            Newsroom
              </Link>
              </span>

              

            <span className="cursor-pointer hover:text-gray-300">
            
            <Dialog>
      <DialogTrigger asChild>
      <button className="btn btn-active btn-ghost">SignUp</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Your Wall-ID</DialogTitle>
          <DialogDescription>
            Complete these steps to create your secure digital identity
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Connect USB Device</h4>
                <p className="text-sm text-gray-500">Insert your Wall-ID USB device</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Register Fingerprint</h4>
                <p className="text-sm text-gray-500">Place your finger on the sensor</p>
              </div>
            </div>

            <div className="flex justify-center py-4">
              <img src="fingerprint.gif" className="w-32 h-32" alt="Fingerprint Scanner" />
            </div>
          </div>

          <div className="mt-4">
            <DialogDescription className={isSignedUp ? 'text-green-500' : 'text-gray-500'}>
              {isSignedUp 
                ? '✓ Registration Complete!' 
                : 'Follow the steps above to complete registration'}
            </DialogDescription>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2">
          {isSignedUp ? (
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button onClick={handleClick} className="w-full">
                Register Now
              </Button>
              <div className="text-sm text-center text-gray-500">
                <Link href="/login" className="hover:text-blue-500">
                  Already have an account? Log in
                </Link>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
            
            </span>

            
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden flex flex-col items-center bg-[#4285f4] py-4 space-y-2">
            <span className="py-2 cursor-pointer hover:text-gray-300">Wall-ID W1</span>
            <span className="py-2 cursor-pointer hover:text-gray-300">
            <Link  href="/dashboard" className="text-white hover:no-underline">
              Research
              </Link>
            </span>
            <span className="py-2 cursor-pointer hover:text-gray-300">
            <Link  href="/newsroom" className="text-white hover:no-underline">
            Newsroom
              </Link>
            </span>
            <span className="cursor-pointer hover:text-gray-300">
            <Dialog>
              <DialogTrigger asChild>
                <button className="btn btn-active btn-ghost">SignUp</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Your Wall-ID</DialogTitle>
                  <DialogDescription>
                    Complete these steps to create your secure digital identity
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Connect USB Device</h4>
                        <p className="text-sm text-gray-500">Insert your Wall-ID USB device</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        2
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Register Fingerprint</h4>
                        <p className="text-sm text-gray-500">Place your finger on the sensor</p>
                      </div>
                    </div>

                    <div className="flex justify-center py-4">
                      <img src="fingerprint.gif" className="w-32 h-32" alt="Fingerprint Scanner" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <DialogDescription className={isSignedUp ? 'text-green-500' : 'text-gray-500'}>
                      {isSignedUp 
                        ? '✓ Registration Complete!' 
                        : 'Follow the steps above to complete registration'}
                    </DialogDescription>
                  </div>
                </div>

                <DialogFooter className="flex flex-col gap-2">
                  {isSignedUp ? (
                    <Button onClick={() => router.push('/dashboard')} className="w-full">
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleClick} className="w-full">
                        Register Now
                      </Button>
                      <div className="text-sm text-center text-gray-500">
                        <Link href="/login" className="hover:text-blue-500">
                          Already have an account? Log in
                        </Link>
                      </div>
                    </>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </span>
          </div>
        )}
      </nav>

      {showLinkPage && <LinkComponent />}
    </>
  );
};

export default Header;
