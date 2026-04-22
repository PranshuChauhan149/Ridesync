'use client'

import React, { useEffect, useState } from 'react'
import SearchMap from "../../../components/SearchMap"
import { ArrowLeft, Bike, Car, CarFront, MapPin, Phone, RefreshCw, Route, Search, Truck, Zap } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from 'axios'
import {  vehicleType } from '@/models/vehicle.modal'
import VecicleCard from '@/components/VecicleCard'





const VEHICLE_META: any = {
  bike: { label: "Bike", Icon: Bike },
  auto: { label: "Auto", Icon: Car },
  car: { label: "Car", Icon: Car },
  loading: { label: "Loading", Icon: Truck },
  truck: { label: "Truck", Icon: Truck },
}

 interface IVehicle  {
  owner: string;
  type: vehicleType;
  vehicleModel: string;
  number: string;
  imageUrl?: string;
  baseFare?: number;
  waitingCharge?: number;
  pricePerKM?: number;
  status: "approved" | "pending" | "rejected";
  rejectedReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


const page = () => {
  const params = useSearchParams()
  const router = useRouter()

  const [pickUp, setPickUp] = useState(params.get("pickup") || "")
  const [drop, setDrop] = useState(params.get("drop") || "")
  const [distance, setDistance] = useState<number | null>(null)

  const mobile = params.get("mobile") || "Not provided"
  const vehicle = params.get("vehicle") || ""
  const pickUpLat = params.get("pickuplat") || "Not provided"
  const pickUpLon = params.get("pickuplon") || "Not provided"
  const dropLat = params.get("droplat") || "Not provided"
  const dropLon = params.get("droplon") || "Not provided"
  const [vehicles,setVehicle] = useState<IVehicle[]>([]);
const meta = VEHICLE_META[vehicle];
  const [loading,setLoading] = useState(false)
  const routeStats = [
    {
      label: "Distance",
      value: distance && distance > 0 ? `${distance.toFixed(2)} km` : "Waiting for route",
      icon: Route,
    },
    {
      label: "Mobile",
      value: mobile,
      icon: Phone,
    },
    {
      label: "Vehicle",
      value: vehicle,
      icon: CarFront,
    },
  ]


const getNearByVehicles = async (
  latitude: number,
  longitude: number,
  vehicleType: string | null
) => {
  try {
    setLoading(true)

    const { data } = await axios.post("/api/vehicles/near-by", {
      latitude,
      longitude,
      vehicleType,
    })

    setVehicle(data.vehicles || [])
    setLoading(false)

    console.log(data)
  } catch (error) {
    setLoading(false)
    console.log(error)
  }
}

useEffect(() => {
  if (!pickUpLat || !pickUpLon) return

  getNearByVehicles(
    Number(pickUpLat),
    Number(pickUpLon),
    vehicle
  )
}, [pickUpLat, pickUpLon, vehicle])
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 overflow-x-hidden">
      <div className="absolute left-5 top-5 z-50 sm:left-6 sm:top-6">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => router.back()}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-md transition-colors hover:bg-zinc-50"
        >
          <ArrowLeft size={17} className="text-zinc-900" />
        </motion.button>
      </div>

      <main className="flex min-h-screen flex-col">
        <section className="relative z-0 h-[48vh] w-full sm:h-[52vh] lg:h-[56vh]">
          <SearchMap
            pickUp={pickUp}
            drop={drop}
            onChange={(nextPickUp, nextDrop) => {
              setPickUp(nextPickUp)
              setDrop(nextDrop)
            }}
            onDistance={(value) => setDistance(value)}
          />
        </section>

        <motion.section
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 22,
          }}
          className="relative z-10 -mt-8 flex-1 rounded-t-[28px] border-t border-zinc-200 bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.08)] sm:-mt-10"
        >
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14 lg:px-8">
            <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-zinc-200" />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]"
            >
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                      Route details
                    </p>
                    <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-900 sm:text-2xl">
                      Pickup and drop summary
                    </h2>
                  </div>

                  <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    {distance && distance > 0 ? `${distance.toFixed(2)} km` : "Live route"}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="flex shrink-0 flex-col items-center pt-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-900" />
                        <div className="my-1 min-h-14 w-px flex-1 bg-zinc-300" />
                        <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Pickup
                          </p>
                          <p className="mt-1 wrap-break-word text-sm font-semibold leading-6 text-zinc-900 sm:text-base">
                            {pickUp || "Pickup address not available"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Drop
                          </p>
                          <p className="mt-1 wrap-break-word text-sm font-semibold leading-6 text-zinc-900 sm:text-base">
                            {drop || "Drop address not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                 <div>
  <h2>
    {loading
      ? "Finding Vehicle"
      : vehicles.length > 0
      ? "Available"
      : "No Nearby Vehicles"}
  </h2>
  {
    meta && <div className='text-zinc-500 text-xs mt-0.5'>{meta.label} rides near your pickup </div>
  }
</div>
<AnimatePresence mode="wait">
  {loading ? (
    <motion.div
      key="searching"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-full"
    >
      <div />
      <span>Searching...</span>
    </motion.div>
  ) : vehicles.length > 0 ? (
    <motion.div
      key="live"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full"
    >
      <Zap
        size={11}
        className="text-emerald-600 fill-emerald-600"
      />
      <span className="text-emerald-700 text-xs font-bold">
        Live
      </span>
    </motion.div>
  ) : null}
</AnimatePresence>
<AnimatePresence>
   {!loading && vehicles.length === 0 && (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center py-14 text-center"
  >
    <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4">
      <Search
        size={26}
        className="text-zinc-400"
      />
    </div>

    <p className="text-zinc-900 font-bold text-base mb-1">
      Vehicles Not Found
    </p>

    <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
      {meta?.label || "Vehicle"} drivers are available near your pickup right now.
    </p>
    <button
  onClick={() => getNearByVehicles(Number(pickUpLat), Number(pickUpLon), vehicle)}
  className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-sm hover:bg-zinc-50 transition"
>
  <RefreshCw size={16} />
  Refresh
</button>
  </motion.div>
)}
</AnimatePresence>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {vehicles.map((v, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: i * 0.06,
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <VecicleCard
        vehicle={v}
        distance={distance ?? undefined}
      onBook={() => {
  const url = new URLSearchParams({
    pickUp,
    drop,
    vehicle: v.type,
    driverId: String(v.owner),
    fare: String(v.baseFare + v.pricePerKM * distance),
    pickUpLat: String(pickUpLat),
    pickUpLon: String(pickUpLon),
    dropLat: String(dropLat),
    dropLon: String(dropLon),
    mobile: String(mobile),
  })

  router.push(`/user/checkout?${url.toString()}`)
}}
      />
    </motion.div>
  ))}
</div>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  Ride info
                </p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-zinc-900">
                  Trip snapshot
                </h3>

                <div className="mt-5 space-y-3">
                  {routeStats.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                    >
                      <div className="rounded-xl bg-white p-2 text-zinc-700 shadow-sm">
                        <item.icon size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                          {item.label}
                        </p>
                        <p className="mt-1 wrap-break-word text-sm font-semibold text-zinc-900">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-900 px-4 py-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-100">
                    Drag the markers on the map to refine the route and update the summary.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

type InfoCardProps = {
  label: string
  value: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const InfoCard = ({ label, value, icon: Icon }: InfoCardProps) => {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-zinc-100 p-2 text-zinc-700">
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {label}
          </p>
          <p className="mt-1 wrap-break-word text-sm font-semibold text-zinc-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

export default page
