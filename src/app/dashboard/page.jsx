"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, ArrowUp, ArrowDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UsbStats from '../components/UsbStats';

const API_KEY = "IRI57XAY533YXUSDTU9J9TU6ZY9B4IWSRS";
const TESTNET_BASE_URL = "https://api-sepolia.etherscan.io/api";

const Dashboard = () => {
  const [walletId, setWalletId] = useState("Loading...");
  const [ethAddress, setEthAddress] = useState("Loading...");
  const [usbStatus, setusbStatus] = useState("");
  const [balance, setBalance] = useState("Loading...");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSent, setTotalSent] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const publicKey = urlParams.get("publicKey");
    const ethAddr = urlParams.get("ethAddress");
    const usbStatus = urlParams.get("usbStatus");
    if (publicKey) setWalletId(publicKey);
    if (ethAddr) setEthAddress(ethAddr);
    if (usbStatus) setusbStatus(usbStatus);
  }, []);

  useEffect(() => {
    if (walletId) {
      fetchBalance();
      fetchTransactions();
    }
  }, [walletId]);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${TESTNET_BASE_URL}?module=account&action=balance&address=${ethAddress}&tag=latest&apikey=${API_KEY}`
      );
      if (response.data.status === "1") {
        setBalance((response.data.result / 1e18).toFixed(4));
        console.log(response.data.result);
      } else {
        toast.error("Failed to fetch balance");
      }
    } catch (error) {
      toast.error("Network error fetching balance");
    }
    setLoading(false);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${TESTNET_BASE_URL}?module=account&action=txlist&address=${ethAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY}`
      );
      if (response.data.status === "1") {
        const allTxs = response.data.result;
        setRecentTransactions(allTxs.slice(0, 5)); // Keep recent 5 for display
        
        // Calculate totals
        const sent = allTxs.filter(tx => tx.from.toLowerCase() === ethAddress.toLowerCase()).length;
        const received = allTxs.filter(tx => tx.to.toLowerCase() === ethAddress.toLowerCase()).length;
        
        setTotalSent(sent);
        setTotalReceived(received);
        setTransactions(allTxs);
      } else {
        toast.error("No transactions found");
      }
    } catch (error) {
      toast.error("Network error fetching transactions");
    }
    setLoading(false);
  };

  const initiateTransaction = async () => {
    // if (usbStatus !== "USB_STORED") {
    //   toast.error("USB device not properly initialized");
    //   return;
    // }

    const recipientAddress = prompt("Enter recipient address:");
    const amountEth = prompt("Enter amount of Ethereum to send:");

    if (recipientAddress && amountEth) {
      try {
        const device = new USBDevice();
        const connected = await device.connect();
        if (!connected) {
          toast.error("Failed to connect to USB device");
          return;
        }

        // Send transaction details to USB device for signing
        await device.writeToDevice(JSON.stringify({
          to: recipientAddress,
          value: ethers.utils.parseEther(amountEth)
        }));

        // Wait for signature from device
        const signature = await device.readFromDevice();
        if (!signature) {
          toast.error("Failed to get signature from USB device");
          return;
        }

        // Send signed transaction to backend
        const response = await fetch("http://localhost:5000/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature,
            recipientAddress,
            amountEth,
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Transaction successful!");
        } else {
          toast.error("Transaction failed!");
        }

        await device.disconnect();
      } catch (error) {
        toast.error("Error during transaction");
        console.error(error);
      }
    } else {
      toast.error("Recipient address and amount are required");
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 bg-blue-600">
      <div className="space-y-6 container mx-auto">
        <div className="flex justify-end">
          <Button onClick={initiateTransaction} className="mb-4">
            Initiate Transaction
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Ethereum Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 font-mono break-all">{ethAddress || "Not Found"}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Public Key Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 font-mono break-all">{walletId || "Not Found"}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Account Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{loading ? "Loading..." : `${balance} ETH`}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUp className="text-red-500" /> Total Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-gray-700">{loading ? "Loading..." : `${totalSent} Transactions`}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDown className="text-green-500" /> Total Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-gray-700">{loading ? "Loading..." : `${totalReceived} Transactions`}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Previous Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Hash</TableHead>
                    <TableHead className="w-1/4">From</TableHead>
                    <TableHead className="w-1/4">To</TableHead>
                    <TableHead className="w-1/4">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="4" className="text-center">{loading ? "Loading..." : "No Transactions Found"}</TableCell>
                    </TableRow>
                  ) : (
                    recentTransactions.map((tx, index) => (
                      <TableRow key={index}>
                        <TableCell className="truncate max-w-[200px]">{tx.hash.slice(0, 10)}...</TableCell>
                        <TableCell className="truncate max-w-[200px]">{tx.from.slice(0, 10)}...</TableCell>
                        <TableCell className="truncate max-w-[200px]">{tx.to.slice(0, 10)}...</TableCell>
                        <TableCell>{(tx.value / 1e18).toFixed(4)} ETH</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <UsbStats />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
