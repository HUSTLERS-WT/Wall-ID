"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { USBDevice } from "@/utils/usb";
import { AlertCircle, CheckCircle, Circle } from "lucide-react";

const UsbStats = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    connected: false,
    lastPing: null,
    bytesTransferred: 0,
    status: 'disconnected'
  });

  useEffect(() => {
    const usbDevice = new USBDevice();
    let interval;

    const connectAndMonitor = async () => {
      const connected = await usbDevice.connect();
      if (connected) {
        setDeviceInfo(prev => ({ 
          ...prev, 
          connected: true,
          status: 'connected'
        }));

        // Start monitoring
        interval = setInterval(async () => {
          try {
            const response = await usbDevice.readFromDevice();
            if (response) {
              setDeviceInfo(prev => ({
                ...prev,
                lastPing: new Date(),
                bytesTransferred: prev.bytesTransferred + response.length,
                status: 'active'
              }));
            }
          } catch (error) {
            setDeviceInfo(prev => ({
              ...prev,
              status: 'error'
            }));
          }
        }, 1000);
      }
    };

    connectAndMonitor();

    return () => {
      if (interval) clearInterval(interval);
      usbDevice.disconnect();
    };
  }, []);

  const getStatusIcon = () => {
    switch (deviceInfo.status) {
      case 'connected':
        return <CheckCircle className="text-green-500" />;
      case 'error':
        return <AlertCircle className="text-red-500" />;
      case 'active':
        return <Circle className="text-blue-500 animate-pulse" />;
      default:
        return <Circle className="text-gray-500" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          USB Device Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Connection Status:</span>
            <span className="font-mono">{deviceInfo.status}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Activity:</span>
            <span className="font-mono">
              {deviceInfo.lastPing ? new Date(deviceInfo.lastPing).toLocaleTimeString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Bytes Transferred:</span>
            <span className="font-mono">{deviceInfo.bytesTransferred}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsbStats;
