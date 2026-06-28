"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const userData = useSelector((state) => state.user.userData);
  const containerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [zegoModule, setZegoModule] = useState(null);

  useEffect(() => {
    setIsClient(true);
    import("@zegocloud/zego-uikit-prebuilt").then((mod) => {
      setZegoModule(mod.ZegoUIKitPrebuilt);
    });
  }, []);

  const startCall = () => {
    if (!containerRef.current) {
      return;
    }

    try {
      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

      // ❌ FIX 1: wrong condition
      if (!appId || !serverSecret || !userData?._id) {
        console.log("Missing required data");
        return;
      }

      if (!zegoModule) {
        return;
      }

      const kitToken = zegoModule.generateKitTokenForTest(
        appId,
        serverSecret,
        "room-1",
        userData._id.toString(),
        userData.name || "User",
      );

      const zp = zegoModule.create(kitToken);

      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (!isClient) {
    return <div className="h-screen bg-zinc-950" />;
  }

  return (
    <div className="h-screen">
      {/* ✅ FIX 2: button outside container */}
      <button onClick={startCall}>Start Call</button>

      <div ref={containerRef} className="h-full"></div>
    </div>
  );
};

export default Page;
