"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Video } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const { roomId } = useParams();
  const userData = useSelector((state) => state.user.userData);
  const containerRef = useRef(null);
  const zpRef = useRef(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [adminDecision, setAdminDecision] = useState("");

  const normalizedRoomId = useMemo(() => {
    return typeof roomId === "string" ? roomId : "";
  }, [roomId]);

  const isAdmin = (userData?.role || "").toLowerCase() === "admin";

  const joinCall = () => {
    if (!containerRef.current) {
      return;
    }

    try {
      setIsJoining(true);
      setJoinError("");

      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

      if (!appId || !serverSecret || !normalizedRoomId || !userData?._id) {
        setJoinError("Missing app config, room ID, or user profile data.");
        setIsJoining(false);
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        normalizedRoomId,
        userData._id.toString(),
        userData.name || "User",
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;

      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
      setJoined(true);
    } catch (error) {
      setJoinError(error instanceof Error ? error.message : "Unable to start call.");
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    if (!joined) {
      joinCall();
    }

    return () => {
      if (zpRef.current && typeof zpRef.current.destroy === "function") {
        zpRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-950 text-white">
      <div className="absolute left-0 right-0 top-0 z-20 border-b border-white/10 bg-black/55 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/90 transition hover:bg-white/10"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="text-right">
            <p className="text-xs text-white/60">Video KYC Room</p>
            <p className="max-w-[220px] truncate text-sm font-medium text-white/90 sm:max-w-[380px]">
              {normalizedRoomId || "Missing Room ID"}
            </p>
          </div>
        </div>
      </div>

      {!joined && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black/65 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Video size={18} /> Join Video KYC
            </div>

            <p className="text-sm text-white/70">
              We are connecting your secure one-on-one verification room.
            </p>

            {joinError ? (
              <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                <div className="mb-1 flex items-center gap-2 font-medium">
                  <AlertTriangle size={14} /> Unable to join
                </div>
                {joinError}
              </div>
            ) : null}

            <button
              type="button"
              disabled={isJoining}
              onClick={joinCall}
              className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isJoining ? "Joining..." : "Join Now"}
            </button>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="absolute bottom-5 right-5 z-30 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-white/15 bg-black/65 p-4 shadow-2xl backdrop-blur-xl">
          <p className="text-xs font-medium uppercase tracking-wide text-white/60">Admin Controls</p>
          <p className="mt-1 text-sm text-white/80">Video KYC decision actions (UI only)</p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setAdminDecision("approved")}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Approve
            </button>

            <button
              type="button"
              onClick={() => setAdminDecision("rejected")}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              Reject
            </button>
          </div>

          {adminDecision ? (
            <p className="mt-3 text-xs text-white/70">
              Selected: <span className="font-semibold capitalize text-white">{adminDecision}</span>
            </p>
          ) : null}
        </div>
      )}

      <div ref={containerRef} className="h-full w-full pt-16" />
    </div>
  );
};

export default Page;
