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

const API_KEY = "IRI57XAY533YXUSDTU9J9TU6ZY9B4IWSRS";
const TESTNET_BASE_URL = "https://api-sepolia.etherscan.io/api";

const Dashboard = () => {
  const [walletId, setWalletId] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [balance, setBalance] = useState("Loading...");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const publicKey = urlParams.get("publicKey");
    const ethAddr = urlParams.get("ethAddress");
    if (publicKey) setWalletId(publicKey);
    if (ethAddr) setEthAddress(ethAddr);
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
        setTransactions(response.data.result.slice(0, 5));
      } else {
        toast.error("No transactions found");
      }
    } catch (error) {
      toast.error("Network error fetching transactions");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-blue-600 space-y-6 max-w-3xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Ethereum Address</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-800 font-mono">{ethAddress || "Not Found"}</p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Public Key Address</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-800 font-mono">{walletId || "Not Found"}</p>
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

      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUp className="text-red-500" /> Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-700">{transactions.filter((tx) => tx.from.toLowerCase() === walletId.toLowerCase()).length} Transactions</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDown className="text-green-500" /> Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-700">{transactions.filter((tx) => tx.to.toLowerCase() === walletId.toLowerCase()).length} Transactions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Previous Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hash</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="4" className="text-center">{loading ? "Loading..." : "No Transactions Found"}</TableCell>
                </TableRow>
              ) : (
                transactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell className="truncate w-[120px]">{tx.hash.slice(0, 10)}...</TableCell>
                    <TableCell className="truncate w-[120px]">{tx.from.slice(0, 10)}...</TableCell>
                    <TableCell className="truncate w-[120px]">{tx.to.slice(0, 10)}...</TableCell>
                    <TableCell>{(tx.value / 1e18).toFixed(4)} ETH</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
