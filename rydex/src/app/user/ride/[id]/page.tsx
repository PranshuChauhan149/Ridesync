"use client";

import LiveRideMap from "@/components/LiveRideMap";
import { BookingStatus, IBooking, PaymentStatus } from "@/models/booking.models";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import PanelContent from "@/components/PanelContent";
import { useParams } from "next/navigation";
import { getSocket } from "@/lib/socket";
import CompletedScreen from "@/components/CompletedScreen";

const MAP_STATUS: Record<BookingStatus, "arriving" | "ongoing" | "completed"> =
  {
    idle: "arriving",
    requested: "arriving",
    awaiting_payment: "arriving",
    confirmed: "arriving",
    started: "ongoing",
    completed: "completed",
    cancelled: "completed",
    rejected: "completed",
    expired: "completed",
  };

const STATUS_LABEL: Record<
  BookingStatus,
  {
    label: string;
    sublabel: string;
    dot: string;
  }
> = {
  idle: {
    label: "Awaiting Confirmation",
    sublabel: "Booking is being processed",
    dot: "bg-amber-400",
  },
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

const PAYMENT_BADGE: Record<
  PaymentStatus,
  { label: string; cls: string }
> = {
  pending: {
    label: "Pending",
    cls: "bg-amber-100 text-amber-700",
  },

  paid: {
    label: "Paid",
    cls: "bg-emerald-100 text-emerald-700",
  },

  cash: {
    label: "Cash",
    cls: "bg-zinc-100 text-zinc-700",
  },

  failed: {
    label: "Failed",
    cls: "bg-red-100 text-red-700",
  },
};

const page = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
  const [pickUpPos, setPickUpPos] = useState<[number, number] | null>(null);
  const [dropPos, setDropPos] = useState<[number, number] | null>(null);
  const [distanceToPickUp, setDistanceToPickUp] = useState(0);
  const [distanceToDrop, setDistanceToDrop] = useState(0);
  const [etaToPickUp, setEtaToPickUp] = useState(0);
  const [etaToDrop, setEtaToDrop] = useState(0);
  const [status, setStatus] = useState("");
  const [chatOpen,setChatOpen] = useState(false)
  const [expanded,setExpanded] = useState(false)
  const params = useParams();
const id = params.id as string;
console.log(id);

 useEffect(() => {
  async function fetchRide() {
    setLoading(true);

    try {
      const { data } = await axios.post("/api/user/active-ride", {
        bookingId: id,
      });

      console.log(data);

      setBooking(data);
      setStatus(data.bookingStatus);

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
    } finally {
      setLoading(false);
    }
  }

  if (id) {
    fetchRide();
  }
}, [id]);
  useEffect(() => {
    const socket = getSocket();
  socket.emit("join-ride",id)
  socket.on("driver-location",({latitude,longitude})=>{
    setDriverPos([latitude,longitude]);
  })
    
     return ()=>{socket.off("join-ride")
        socket.off("driver-location")
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


   {status == "completed" && booking}{
    return (
      <CompletedScreen booking={booking} />
    )
  }

  const onChatToggle = ()=>{
    setChatOpen(prev=>!prev);
  }

  const cfg = STATUS_LABEL[booking?.bookingStatus! ?? "confirmed"];
  const isActive = ["confirmed", "started"].includes(status);
  const canChat = booking?.bookingStatus === "confirmed"
  const displayEta = status === "confirmed" ? etaToPickUp : etaToDrop;
  const displayDistance =
    status === "confirmed" ? distanceToPickUp : distanceToDrop;
    const paymentStatus = PAYMENT_BADGE[booking?.paymentStatus!??"pending"]
   const panelProps = {isActive,displayEta,displayDistance,cfg ,status,booking,paymentStatus,canChat,chatOpen,onChatToggle,currentRole: "user"};
  return (
    <div className="h-screen w-full bg-zinc-100 flex flex-row lg:flex-col overflow-hidden">
      <div className="relative flex-1 h-full z-0">
        <LiveRideMap
          driverLocation={driverPos}
          pickUpLocation={pickUpPos}
          dropLocation={dropPos}
          mapStatus={MAP_STATUS[booking?.bookingStatus]}
          onStats={({
            distanceToPickUp,
            etaToPickUp,
            distanceToDrop,
            etaToDrop,

          }) => {
            setDistanceToPickUp(distanceToPickUp);
            setEtaToPickUp(etaToPickUp);
            setDistanceToDrop(distanceToDrop);
            setEtaToDrop(etaToDrop);
          }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] pointer-events-none"
      >
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-zinc-100">
          <span
            className={`w-3 h-3 rounded-full ${cfg.dot} animate-pulse ring-4 ring-current/10`}
          />
          <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
            {cfg.label}
          </span>{" "}
        </div>
      </motion.div>
<motion.div
  initial={{ x: 60, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
  className="
    hidden lg:flex
    w-[520px]
    xl:w-[600px]
    h-full
    flex-shrink-0
    flex-col
    bg-white
    border-l
    border-zinc-100
    overflow-hidden
  "
>
  <div className="bg-black px-6 py-5 flex-shrink-0">
    <p className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-semibold mb-3">
      User Panel
    </p>

    <div className="flex items-center justify-between">
      <h1 className="text-white text-xl font-bold">
        Active Ride
      </h1>

      {isActive && (
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
          <Zap size={12} className="text-amber-400" />

          <span className="text-white text-sm font-medium">
            {Math.round(displayEta)} min
          </span>
        </div>
      )}
    </div>
  </div>




<div className="flex-1 flex flex-col overflow-hidden">
<div className="flex-1 overflow-y-auto scrollbar-hide">
  <PanelContent {...panelProps} />

</div>
</div>

</motion.div>

<div
className="lg:hidden"
  style={{
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    zIndex: 9999,
   
  }}
>
  <motion.div
    initial={{ y: "100%" }}
    animate={{
      y: 0,
      height: expanded ? "82vh" : "140px",
    }}
    transition={{
      type: "spring",
      stiffness: 320,
      damping: 38,
    }}
    style={{
      width: "100%",
      background: "#ffffff",
      borderTopLeftRadius: "24px",
      borderTopRightRadius: "24px",
      boxShadow: "0 -10px 30px rgba(0,0,0,0.15)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      onClick={() => setExpanded((p) => !p)}
      style={{
        paddingTop: "12px",
        paddingBottom: "8px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "6px",
          background: "#a1a1aa",
          borderRadius: "999px",
          margin: "0 auto",
        }}
      />
    </div>

    <div
      style={{
        flex: 1,
        overflowY: "auto",
      }}
    >
      <PanelContent {...panelProps} />
    </div>
  </motion.div>
</div>

    </div>
  );
};

export default page;
