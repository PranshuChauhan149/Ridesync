"use client";

import LiveRideMap from "@/components/LiveRideMap";
import { IBooking } from "@/models/booking.models";
import axios from "axios";
import { error } from "console";
import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "motion/react";

const STATUS_LABEL: Record<
  BookingStatus,
  {
    label: string;
    sublabel: string;
    dot: string;
  }
> = {
  requested: {
    label: "Awaiting Confirmation",
    sublabel: "Booking is being processed",
    dot: "bg-amber-400",
  },

  awaiting_payment: {
    label: "Payment Pending",
    sublabel: "Customer payment is pending",
    dot: "bg-purple-400",
  },

  confirmed: {
    label: "Heading to Pickup",
    sublabel: "Drive to the pickup location",
    dot: "bg-amber-400",
  },

  started: {
    label: "Ride in Progress",
    sublabel: "Heading to drop location",
    dot: "bg-emerald-400",
  },

  completed: {
    label: "Ride Completed",
    sublabel: "Trip has ended successfully",
    dot: "bg-zinc-400",
  },

  cancelled: {
    label: "Ride Cancelled",
    sublabel: "This ride was cancelled",
    dot: "bg-red-400",
  },

  rejected: {
    label: "Ride Rejected",
    sublabel: "Ride was rejected",
    dot: "bg-red-400",
  },

  expired: {
    label: "Request Expired",
    sublabel: "Booking timed out",
    dot: "bg-orange-400",
  },
};



const Page = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);

  const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
  const [pickUpPos, setPickUpPos] = useState<[number, number] | null>(null);
  const [dropUpPos, setDropUpPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get("/api/partner/my-active");

        setBooking(data);
        console.debug("/api/partner/my-active ->", data);

        // Use coordinates from API when available
        if (data?.pickUpLocation?.coordinates?.length) {
          setPickUpPos([data.pickUpLocation.coordinates[1], data.pickUpLocation.coordinates[0]]);
        }

        if (data?.dropLocation?.coordinates?.length) {
          setDropUpPos([data.dropLocation.coordinates[1], data.dropLocation.coordinates[0]]);
        }

        // Fallback: geocode textual addresses if coordinates are missing
        const geocode = async (address?: string) => {
          if (!address) return null;
          try {
            const resp = await axios.get("https://api.geoapify.com/v1/geocode/search", {
              params: {
                text: address,
                apiKey: process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
                limit: 1,
              },
            });

            const r = resp.data?.results?.[0];
            if (!r) return null;
            return [r.lat, r.lon] as [number, number];
          } catch (err) {
            console.error("geocode failed", err);
            return null;
          }
        };

        if (!data?.pickUpLocation?.coordinates?.length && data?.pickUpAddress) {
          const gp = await geocode(data.pickUpAddress);
          if (gp) setPickUpPos(gp);
        }

        if (!data?.dropLocation?.coordinates?.length && data?.dropAddress) {
          const gd = await geocode(data.dropAddress);
          if (gd) setDropUpPos(gd);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

useEffect(() => {
  if (!navigator.geolocation) return;

  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setDriverPos([lat, lng]);
    },

    (error) => {
      console.log(error);
    },

    {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 5000,
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}, []);
    

  if (loading) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />

          <p className="text-white/40 text-sm tracking-widest uppercase font-medium">
            Loading Ride...
          </p>
        </div>
      </div>
    );
  }
  
  const cfg = STATUS_LABEL[booking?.bookingStatus! ?? "confirmed"]
  return (
  <div className="relative h-screen w-full overflow-hidden bg-zinc-100">
    
    {/* MAP */}
    <div className="absolute inset-0 z-0">
      <LiveRideMap
        driverLocation={driverPos}
        pickUpLocation={pickUpPos}
        dropLocation={dropUpPos}
      />
    </div>

    {/* STATUS BADGE */}
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-[99999]"
    >
      <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white/95 backdrop-blur-md px-4 py-2 shadow-2xl">
        
        <div
          className={`h-2.5 w-2.5 rounded-full animate-pulse ${cfg.dot}`}
        />

        <span className="whitespace-nowrap text-sm font-semibold text-zinc-900">
          {cfg.label}
        </span>
      </div>
    </motion.div>
  </div>
);
};

export default Page;