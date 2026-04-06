"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Video } from "lucide-react";
import axios from "axios";
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
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [actionError, setActionError] = useState("");
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

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
      try {
        if (zpRef.current) {
          if (typeof zpRef.current.destroy === "function") {
            zpRef.current.destroy();
          } else if (typeof zpRef.current.leaveRoom === "function") {
            zpRef.current.leaveRoom();
          }
        }
      } catch (error) {
        console.warn("Error cleaning up Zego call:", error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleAction = async (action) => {
    if (!normalizedRoomId) {
      setActionError("Room ID is missing.");
      return;
    }

    if (action === "rejected" && !showRejectReason) {
      setActionError("");
      setShowRejectReason(true);
      return;
    }

    if (action === "rejected" && !rejectionReason.trim()) {
      setActionError("Please enter a rejection reason.");
      return;
    }

    setActionLoading(action);
    setActionError("");

    try {
      const { data } = await axios.post("/api/admin/video-kyc/compelete", {
        roomId: normalizedRoomId,
        action,
        reason: action === "rejected" ? rejectionReason.trim() : undefined,
      });

      setAdminDecision(data?.status || action);
      if (action === "approved") {
        setShowApproveConfirm(false);
      }
      if (action === "rejected") {
        setRejectionReason("");
        setShowRejectReason(false);
      }

      try {
        if (zpRef.current) {
          if (typeof zpRef.current.destroy === "function") {
            zpRef.current.destroy();
          } else if (typeof zpRef.current.leaveRoom === "function") {
            zpRef.current.leaveRoom();
          }
        }
      } catch (error) {
        console.warn("Error cleaning up Zego call:", error);
      }
      setJoined(false);

      router.push("/");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message || error.message)
        : error instanceof Error
          ? error.message
          : "Unable to update video KYC status.";
      setActionError(message);
    } finally {
      setActionLoading("");
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-950 text-white">
      <div className="absolute left-0 right-0 top-0 z-30 border-b border-white/10 bg-black/55 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/90 transition hover:bg-white/10"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="text-right">
              <p className="text-xs text-white/60">Video KYC Room</p>
              <p className="max-w-55 truncate text-sm font-medium text-white/90 sm:max-w-95">
                {normalizedRoomId || "Missing Room ID"}
              </p>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!!actionLoading}
                  onClick={() => {
                    setActionError("");
                    setShowApproveConfirm(true);
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {actionLoading === "approved" ? "Approving..." : "Approve"}
                </button>

                <button
                  type="button"
                  disabled={!!actionLoading}
                  onClick={() => handleAction("rejected")}
                  className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {actionLoading === "rejected" ? "Rejecting..." : "Reject"}
                </button>
              </div>
            )}
          </div>
        </div>

        {isAdmin && showRejectReason ? (
          <div className="border-t border-white/10 bg-black/70 px-4 py-3 backdrop-blur-md sm:px-6">
            <div className="mx-auto flex max-w-7xl justify-end">
              <div className="w-full max-w-sm space-y-3 rounded-2xl border border-white/15 bg-white/5 p-3 shadow-2xl">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason for rejection"
                  className="h-24 w-full resize-none rounded-lg border border-white/15 bg-black/30 p-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
                />

                <button
                  type="button"
                  disabled={!!actionLoading}
                  onClick={() => handleAction("rejected")}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {actionLoading === "rejected" ? "Rejecting..." : "Confirm Reject"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
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

      {isAdmin && actionError ? (
        <div className="absolute right-4 top-18 z-20 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 shadow-lg sm:right-6">
          {actionError}
        </div>
      ) : null}

      {showApproveConfirm ? (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-black/90 p-6 shadow-2xl">
            <p className="text-lg font-semibold text-white">Confirm approval</p>
            <p className="mt-2 text-sm text-white/70">
              Are you sure you want to approve this video KYC request?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={!!actionLoading}
                onClick={() => setShowApproveConfirm(false)}
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!!actionLoading}
                onClick={() => handleAction("approved")}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {actionLoading === "approved" ? "Approving..." : "Yes, Approve"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div ref={containerRef} className="h-full w-full pt-16" />
    </div>
  );
};

export default Page;
