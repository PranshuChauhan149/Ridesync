"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  MapPin,
  IndianRupee,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { IBooking } from "@/models/booking.models";

const CompletedScreen = ({ booking ,role}: { booking: IBooking }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4 py-10">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[120px] -top-40 -left-40"
        />

        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[120px] bottom-0 right-0"
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.15)]">

          {/* Header */}
          <div className="relative py-12 px-6 flex flex-col items-center">

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 220,
              }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-green-500 blur-2xl opacity-40" />

              <CheckCircle2
                size={90}
                className="relative text-green-400"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/30 px-4 py-2 rounded-full mb-4">
                <Sparkles size={14} className="text-green-400" />
                <span className="text-green-300 text-sm font-semibold">
                  TRIP SUCCESSFUL
                </span>
              </div>

              <h1 className="text-4xl font-black text-white">
                Ride Completed
              </h1>

              <p className="text-zinc-400 mt-3">
                The trip has been completed successfully.
              </p>
            </motion.div>
          </div>

          {/* Details */}
          <div className="px-6 pb-6 space-y-4">

            {/* Pickup */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <div className="flex gap-3">
                <MapPin className="text-green-400 mt-1" size={18} />

                <div>
                  <p className="text-zinc-500 text-xs uppercase">
                    Pickup
                  </p>

                  <p className="text-white font-medium">
                    {booking?.pickUpAddress || "Pickup Location"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Drop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <div className="flex gap-3">
                <MapPin className="text-red-400 mt-1" size={18} />

                <div>
                  <p className="text-zinc-500 text-xs uppercase">
                    Drop
                  </p>

                  <p className="text-white font-medium">
                    {booking?.dropAddress || "Drop Location"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Fare */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/20 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-zinc-300 font-medium">
                  Total Fare
                </span>

                <div className="flex items-center gap-1 text-green-400 text-3xl font-black">
                  <IndianRupee size={26} />
                  {booking?.fare || 0}
                </div>
              </div>
            </motion.div>

            {/* Booking ID */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center text-zinc-500 text-xs"
            >
              Booking ID: {String(booking?._id)}
            </motion.div>

            {/* Button */}
            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="w-full mt-4 bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              Back To Dashboard
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompletedScreen;