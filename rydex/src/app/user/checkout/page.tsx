'use client'

import React, { useState } from "react"
import { motion } from "motion/react"
import {
  Bike,
  Car,
  Truck,
  MapPin,
  Phone,
  IndianRupee,
  CreditCard,
  Shield,
  Clock,
  MoveRightIcon,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"

const VEHICLE_META: any = {
  bike: { label: "Bike", Icon: Bike },
  auto: { label: "Auto", Icon: Car },
  car: { label: "Car", Icon: Car },
  loading: { label: "Loading", Icon: Truck },
  truck: { label: "Truck", Icon: Truck },
};


type status = "idle" | "requested" | "awaiting_payment" | "rejected" | "expired" | "cancelled" | 
"payment" | "confirmed"


function page() {
  const router = useRouter()
  const params = useSearchParams()

  const [pickUp] = useState(params.get("pickup") || params.get("pickUp") || "")
  const [drop] = useState(params.get("drop") || "")

  const mobile = params.get("mobile") || ""
  const pickUpLat = Number(params.get("pickuplat") || params.get("pickUpLat"))
  const pickUpLon = Number(params.get("pickuplon") || params.get("pickUpLon"))
  const dropLat = Number(params.get("droplat") || params.get("dropLat"))
  const dropLon = Number(params.get("droplon") || params.get("dropLon"))
  const vehicle = params.get("vehicle") || ""
  const fare = params.get("fare") || ""
  const driverId = params.get("driverId") || ""
  const vehicleId = params.get("vehicleId") || ""

  const [status,setStatus] = useState<status>("idle");

  const { Icon, label } = VEHICLE_META[vehicle] || {
    Icon: Car,
    label: "Vehicle",
  }


const handleRequestBooking = async () => {
  try {
    if (!driverId || !vehicleId) {
      console.log("Missing driverId or vehicleId in checkout URL params")
      return
    }

    if (
      Number.isNaN(pickUpLat) ||
      Number.isNaN(pickUpLon) ||
      Number.isNaN(dropLat) ||
      Number.isNaN(dropLon)
    ) {
      console.log("Invalid pickup/drop coordinates in checkout URL params")
      return
    }

    const numericFare = Number(fare)
    if (!Number.isFinite(numericFare) || numericFare < 0) {
      console.log("Invalid fare in checkout URL params")
      return
    }

    setStatus("requested")

    const { data } = await axios.post("/api/booing/create", {
      driverId,
      vehicleId,

      pickUpAddress: pickUp,
      dropAddress: drop,

      pickUpLocation: {
        type: "Point",
        coordinates: [pickUpLon, pickUpLat],
      },

      dropLocation: {
        type: "Point",
        coordinates: [dropLon, dropLat],
      },

      fare: numericFare,
      mobileNumber: mobile,
    })

    if (data?.booking?.bookingStatus) {
      setStatus(data.booking.bookingStatus)
    }

    console.log(data)
  } catch (error) {
    setStatus("idle")
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message)
    } else {
      console.log(error)
    }
  }
}

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-12">
      <div className="relative max-w-6xl mx-auto z-10">
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.08,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
          >
            <div className="h-1 bg-zinc-900" />

            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1">
                    Selected Vehicle
                  </div>

                  <div className="text-3xl font-black tracking-tight text-zinc-900">
                    {vehicle}
                  </div>
                </div>

                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <Icon size={28} className="text-white" />
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-100 rounded-3xl">
                <div className="flex gap-4 px-5 py-4 border-b border-zinc-200">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-zinc-900 ring-4 ring-zinc-300" />
                    <div className="w-px flex-1 bg-zinc-300 my-1" />
                    <div className="w-3 h-3 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-0.5">
                      Pickup
                    </div>
                    <div className="font-semibold text-zinc-900 text-sm wrap-break-word">
                      {pickUp}
                    </div>
                  </div>

                  <MapPin className="text-zinc-500" size={18} />
                </div>

                <div className="flex gap-4 px-5 py-4">
                  <div className="w-3 h-3 rounded-full bg-orange-500 ring-4 ring-orange-100 mt-1" />

                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-0.5">
                      Drop
                    </div>
                    <div className="font-semibold text-zinc-900 text-sm wrap-break-word">
                      {drop}
                    </div>
                  </div>

                  <MapPin className="text-zinc-500" size={18} />
                </div>
              </div> <div className="mt-10 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">
                Total Fare
              </p>

              <p className="text-xs text-zinc-400 mt-1">
                Includes base + distance charges
              </p>
            </div>

            <div className="flex items-center text-zinc-900">
              <IndianRupee size={20} />
              <span className="text-3xl font-black leading-none">
                {fare}
              </span>
            </div>
          </div>
            </div>
           
        
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.5,
            }}
            className="bg-white rounded-3xl border border-zinc-200 shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-8"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-2">
            Ready to go
            </div>

            <h2 className="text-2xl font-black text-zinc-900 mb-6">
              Confirm Your Ride 
            </h2>
<div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 space-y-3">
  {[
    {
      icon: <Clock size={14} />,
      text: "Driver will respond within 2 minutes",
    },
    {
      icon: <Shield size={14} />,
      text: "Verified & insured drivers only",
    },
    {
      icon: <CreditCard size={14} />,
      text: "Pay after driver accepts",
    },
  ].map((item, i) => (
    <div key={i} className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-xl bg-zinc-200 flex items-center justify-center text-zinc-600 shrink-0">
        {item.icon}
      </div>

      <p className="text-zinc-500 text-xs font-medium">
        {item.text}
      </p>
    </div>
  ))}
</div>

<button 
              className="w-full mt-10 py-4 rounded-2xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition"
              onClick={handleRequestBooking}
            >
              Request Ride
            </button>

 
            
           
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default page