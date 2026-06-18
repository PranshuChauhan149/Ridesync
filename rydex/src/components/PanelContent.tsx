import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, IndianRupee, MapPinned, MessageCircle, Phone, User } from "lucide-react";
import RideChat from "./RideChat";

function PanelContent({
  isActive,
  displayEta,
  displayDistance,
  cfg,
  status,
  booking,
  paymentStatus,canChat,chatOpen,onChatToggle
}: any) {
  if (!isActive) return null;

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="mx-5 lg:mx-6 grid grid-cols-3 gap-3">
        {/* ETA */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <Clock size={18} className="text-zinc-600" />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-zinc-500 font-medium">
              ETA
            </p>

            <p className="text-lg font-bold text-zinc-900">
              {Math.round(displayEta || 0)}
              <span className="text-sm font-medium text-zinc-500 ml-1">
                min
              </span>
            </p>
          </div>
        </div>

        {/* Distance */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <MapPinned size={18} className="text-zinc-600" />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-zinc-500 font-medium">
              Distance
            </p>

            <p className="text-lg font-bold text-zinc-900">
              {displayDistance?.toFixed(1) || "0.0"}
              <span className="text-sm font-medium text-zinc-500 ml-1">
                km
              </span>
            </p>
          </div>
        </div>

        {/* Fare */}
        <div className="bg-zinc-950 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <IndianRupee size={18} className="text-white" />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-zinc-400 font-medium">
              Fare
            </p>

            <p className="text-lg font-bold text-black">
              ₹{booking?.fare || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Ride Status */}
      <div className="mx-5 lg:mx-6">
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${cfg?.dot} animate-pulse`}
            />
            <span className="text-sm font-semibold text-zinc-700">
              {cfg?.label}
            </span>
          </div>

          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            {status}
          </span>
        </div>
      </div>

      {/* Customer Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-5 lg:mx-6"
      >
        <div className="bg-black rounded-2xl p-5 shadow-lg border border-zinc-800">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center">
                <User size={26} className="text-zinc-300" />
              </div>

              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" />
            </div>

            {/* Customer Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-white font-bold text-lg truncate">
                    {booking?.user?.name || "Customer"}
                  </p>

                  <p className="text-zinc-400 text-sm">
                    Passenger Details
                  </p>
                </div>

                <div className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <IndianRupee
                    size={12}
                    className="text-yellow-400"
                  />
                  <span className="text-white text-xs font-semibold">
                    {booking?.fare || 0}
                  </span>
                </div>
              </div>

              {/* Payment Status */}
              {booking?.paymentStatus && (
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      booking.paymentStatus === "PAID"
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  />

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      paymentStatus?.cls ||
                      "bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {paymentStatus?.label}
                  </span>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </motion.div>
    {isActive && (
  <div className="flex gap-2 mt-2">
    {booking?.userMobileNumber && (
      <a
        href={`tel:${booking.userMobileNumber}`}
        className={`flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 active:scale-[0.97] transition-all text-zinc-900 py-3 rounded-xl text-sm font-semibold ${
          canChat ? "flex-1" : "w-full"
        }`}
      >
        <Phone size={15} />
        Call
      </a>
    )}

    {canChat && (
      <button
        onClick={onChatToggle}
        className={`flex-1 flex items-center justify-center gap-2 active:scale-[0.97] transition-all py-3 rounded-xl text-sm font-semibold ${
          chatOpen
            ? "bg-zinc-200 text-zinc-900"
            : "bg-zinc-900 hover:bg-zinc-800 text-white"
        }`}
      >
        <MessageCircle size={15} />
        {chatOpen ? "Close Chat" : "Message"}
      </button>
    )}
  </div>
)}


   <AnimatePresence>
  {chatOpen && canChat && (
    <motion.div
      key="chat"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mx-5 lg:mx-6 overflow-hidden"
    >
      <div className="rounded-2xl overflow-hidden border border-zinc-100 h-[460px]">
        <RideChat
          bookingId={booking?._id}
          currentUserId={user?._id}
          otherUserId={booking?.user?._id}
        />
      </div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}

export default PanelContent;