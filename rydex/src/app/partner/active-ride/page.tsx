"use client";

import LiveRideMap from "@/components/LiveRideMap";
import { BookingStatus, IBooking } from "@/models/booking.models";
import axios from "axios";
import React, { useEffect, useState } from "react";

import {motion} from "motion/react";




const MAP_STATUS: Record<
  BookingStatus,
  "arriving" | "ongoing" | "completed"
> = {
idle:"arriving",
  requested: "arriving",
  awaiting_payment: "arriving",
  confirmed: "arriving",
  started: "ongoing",
  completed: "completed",
  cancelled: "completed",
  rejected: "completed",
  expired: "completed",
};


const page = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [driverPos, setDriverPos] = useState<[Number, Number] | null>(null);
  const [pickUpPos, setPickUpPos] = useState<[Number, Number] | null>(null);
  const [dropPos, setDropPos] = useState<[Number, Number] | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/partner/my-active");
        setBooking(data);
        setLoading(false);
        setPickUpPos([
          data.pickUpLocation.coordinates[1],
          data.pickUpLocation.coordinates[0],
        ]);
        setDropPos([
          data.dropLocation.coordinates[1],
          data.dropLocation.coordinates[0],
        ]);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    fetch();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setDriverPos([lat, lon]);
      },
      (error) => {
        console.log("gps error", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 100000,
      },
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

  return (
    <div className="h-screen w-full bg-zinc-100 flex flex-col lg:flex-row overflow-hidden">
      <div className="relative flex-1 h-full z-0">
        <LiveRideMap
          driverLocation={driverPos}
          pickUpLocation={pickUpPos}
          dropLocation={dropPos}
          mapStatus={MAP_STATUS[booking?.bookingStatus]}
        />


        

      </div>
    </div>
  );
};

export default page;
