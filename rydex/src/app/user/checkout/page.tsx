'use client'

import React, { useEffect, useState } from "react"
import { motion } from "motion/react"
import {
  Bike,
  Car,
  Truck,
  MapPin,
  ArrowLeft,
  IndianRupee,
  CreditCard,
  Banknote,
  Shield,
  Clock,
  Loader2,
  CheckCircle,
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
"confirmed" | "payment"

type PaymentMethod = "cash" | "online"

type Booking = {
  _id: string
  bookingStatus: status
}


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

  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [status, setStatus] = useState<status>("idle")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)

  const { Icon, label } = VEHICLE_META[vehicle] || {
    Icon: Car,
    label: "Vehicle",
  }


const handleRequestBooking = async () => {

  try {
    setLoading(true)

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
      setBooking(data.booking)
    }

    console.log(data)
  } catch (error) {
    setStatus("idle")
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message)
    } else {
      console.log(error)
    }
  } finally {
    setLoading(false)
  }
}





const fetchActiveBooking = async ()=>{
  try {
    const { data } = await axios.get("/api/booing/active")
    const activeBooking = data?.booking

    if (activeBooking && typeof activeBooking === "object") {
      console.log(activeBooking.bookingStatus)
      setStatus(activeBooking.bookingStatus)
      setBooking(activeBooking)
      return
    }

    setStatus("idle")
    setBooking(null)
    
  } catch (error) {
    console.log(error)
    setStatus("idle")
    setBooking(null)
    
  }
}


const handleCancelBooking = async () =>{
  try {
    if (!booking?._id) {
      return
    }

    setLoading(true)
    const { data } = await axios.get(`/api/booing/${booking._id}/cancel`)
    console.log(data)
    setStatus("cancelled")
    setBooking(null)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message)
    } else {
      console.log(error)
    }
  } finally {
    setLoading(false)
  }
}




useEffect(()=>{
fetchActiveBooking();
},[])

useEffect(()=>{
  if(status !== "awaiting_payment") return;
  const t = setTimeout(()=>{
    setStatus("payment");
  },2000)
  return ()=>{clearTimeout(t)}
},[status])



  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-12">
      <div className="relative max-w-6xl mx-auto z-10">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">
              Booking
            </p>
            <h1 className="text-5xl font-black tracking-tight text-zinc-900 mt-1">
              Checkout
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Review your ride and confirm
            </p>
          </div>
        </div>

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
                    {label}
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
           {status == "idle" && <div>
          
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
              disabled={loading}
            >
              {loading ? "Requesting..." : "Request Ride"}
            </button>

 
            
            
            </div>} 

   {status === "requested" && (
  <motion.div
    key="requested"
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
    className="flex flex-col flex-1 items-center justify-center gap-6 text-center"
  >
    <div className="relative">
      {/* Pulse Background */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="absolute inset-0 rounded-full bg-zinc-300"
      />

      {/* Main Circle */}
      <div className="relative z-10 h-24 w-24 rounded-full bg-white border-4 border-black flex items-center justify-center shadow-lg">
        <Loader2
          size={32}
          className="text-black animate-spin"
        />
      </div>
    </div>

    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-2">
        Ride Requested
      </p>

      <h2 className="text-2xl font-black text-zinc-900 mb-2">
        Finding Your Driver
      </h2>

      <p className="text-sm text-zinc-500 max-w-sm">
        Please wait while nearby drivers review your ride request.
        This usually takes less than 2 minutes.
      </p>
    </div>

    <button
      className="px-10 py-3 rounded-2xl border border-black text-black font-semibold hover:bg-black hover:text-red-500 transition"
      onClick={handleCancelBooking}
      disabled={loading || !booking?._id}
    >
      {loading ? "Cancelling..." : "Cancel Request"}
    </button>
  </motion.div>
)}  



{
  status == "awaiting_payment" && (

    <motion.div
      key="awaiting_payment"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6"
    >
      <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-lg">
        <CheckCircle size={32} className="text-white" />
      </div>

      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-2">
          Driver Response
        </p>

        <h3 className="text-2xl font-black text-zinc-900 mb-2">
          Driver Accepted
        </h3>

        <p className="text-sm text-zinc-500">
          Preparing payment options for your trip.
        </p>
      </div>

      <div className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-600">
            Loading Payment
          </span>

          <span className="text-xs font-bold text-zinc-900">
            100%
          </span>
        </div>

        <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-zinc-900 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  )
}


{
  status == "payment" && (
    <motion.div
      key="payment"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-2">
          Almost There
        </p>

        <h3 className="text-2xl font-black text-zinc-900">
          Select Payment Method
        </h3>
      </div>

      <div className="space-y-3">
        {[
          {
            id: "cash" as PaymentMethod,
            Icon: Banknote,
            title: "Cash",
            sub: "Pay driver after ride",
          },
          {
            id: "online" as PaymentMethod,
            Icon: CreditCard,
            title: "Online",
            sub: "Pay securely via card or UPI",
          },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPaymentMethod(item.id)}
            className={`w-full text-left rounded-2xl border transition p-4 ${
              paymentMethod === item.id
                ? "border-zinc-900 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                : "border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-900"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                paymentMethod === item.id ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-700"
              }`}>
                <item.Icon size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-900">{item.title}</p>
                <p className="text-xs text-zinc-500">{item.sub}</p>
              </div>

              {paymentMethod === item.id && (
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-900 bg-zinc-100 px-2 py-1 rounded-lg">
                  Active
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-semibold text-zinc-700">
        Selected method: {paymentMethod === "cash" ? "Cash" : paymentMethod === "online" ? "Online" : "Not selected"}
      </div>

      <button
        type="button"
        disabled={!paymentMethod || loading}
        className={`w-full rounded-2xl py-3.5 font-bold transition flex items-center justify-center gap-2 ${
          paymentMethod
            ? "bg-zinc-900 text-white hover:bg-zinc-800"
            : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
        }`}
      >
        {paymentMethod === "cash" ? <Banknote size={18} /> : <CreditCard size={18} />}
        {paymentMethod === "cash" ? "Confirm Cash Ride" : "Process To Payment"}
      </button>
    </motion.div>
  )
}
            
           
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default page