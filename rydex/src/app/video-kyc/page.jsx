"use client";

import React, { useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";

const Page = () => {
  const userData = useSelector((state) => state.user.userData);
  const containerRef = useRef(null);

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

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        "room-1",
        userData._id.toString(),
        userData.name || "User",
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

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

  return (
    <div className="h-screen">
      {/* ✅ FIX 2: button outside container */}
      <button onClick={startCall}>Start Call</button>

      <div ref={containerRef} className="h-full"></div>
    </div>
  );
};

export default Page;
