"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react"; 
import LinkComponent from './Link';  
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { ToastContainer, toast } from 'react-toastify'; // Ensure toast is imported
import 'react-toastify/dist/ReactToastify.css';

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

  const handleClick = () => {
    setIsSignedUp(true);
    toast.success('Fingerprint Registered!');
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
              <Link  href="/dashboard" className="text-white hover:no-underline">
              Research
              </Link>
              </span>
              <span className="cursor-pointer hover:text-gray-300">
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
          <DialogTitle>Register Your Finger Print</DialogTitle>
         
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 justify-center">
            <img src="fingerprint.gif" className="col-span-4" alt="" />
          
          </div>
        
        </div>
        <DialogDescription className={isSignedUp ? 'text-green-500' : 'text-red-500'}>
          
        {isSignedUp ? 'Fingerprint Registered' : 'Awaiting Your Finger Print......'}
      </DialogDescription>
      <DialogFooter>
        {isSignedUp ? (
          <Link href="/login"> {/* Link to the login page */}
            <a className="btn btn-active btn-ghost">Log In</a>
          </Link>
        ) : (
          <button
            onClick={handleClick}
            className="btn btn-active btn-ghost"
          >
            Sign Up
          </button>
        )}
      </DialogFooter>

      {/* Conditionally render "Already have an account?" text */}
      {!isSignedUp && (
        <div className="text-blue-500">
          <Link href="/login" className="hover:no-underline">
             <button>Already have an account? Login!</button> 
          </Link>
        </div>
      )}

      <ToastContainer />
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
                  <DialogTitle>Register Your Finger Print</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4 justify-center">
                    <img src="fingerprint.gif" className="col-span-4" alt="" />
                  </div>
                </div>
                <DialogDescription className={isSignedUp ? 'text-green-500' : 'text-red-500'}>
                  {isSignedUp ? 'Fingerprint Registered' : 'Awaiting Your Finger Print......'}
                </DialogDescription>
                <DialogFooter>
                  {isSignedUp ? (
                    <Link href="/login"> {/* Link to the login page */}
                      <a className="btn btn-active btn-ghost">Log In</a>
                    </Link>
                  ) : (
                    <button
                      onClick={handleClick}
                      className="btn btn-active btn-ghost"
                    >
                      Sign Up
                    </button>
                  )}
                </DialogFooter>

                {/* Conditionally render "Already have an account?" text */}
                {!isSignedUp && (
                  <div className="text-blue-500">
                    <Link href="/login" className="hover:no-underline">
                       <button>Already have an account? Login!</button> 
                    </Link>
                  </div>
                )}

                <ToastContainer />
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
