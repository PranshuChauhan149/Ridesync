import React from "react"
import { motion } from "motion/react"
import {
  Star,
  Circle,
  MapPin,
  IndianRupee,
  Gauge,
} from "lucide-react"
import { vehicleType } from "@/models/vehicle.modal"



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

function VehicleCard({
  vehicle,
  distance,
  onBook
}: {
  vehicle: IVehicle
  distance: number | undefined
  onBook:()=>void
}) {
  const label = vehicle?.type || "Vehicle"
  const fare =
    typeof distance === "number"
      ? Math.round((vehicle.baseFare || 0) + distance * (vehicle.pricePerKM || 0))
      : vehicle.baseFare || 199
  const waitingCharge = vehicle.waitingCharge || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative mx-auto flex h-full w-full min-w-65 max-w-85 flex-col overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-md transition-all hover:shadow-xl"
    >
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-zinc-50 sm:h-64">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <motion.img
          src={vehicle.imageUrl || "/logo.png"}
          alt={vehicle.vehicleModel || "Vehicle"}
          className="relative z-10 h-44 w-full object-contain px-5"
          style={{
            filter: "drop-shadow(0 14px 30px rgba(0,0,0,0.14))",
          }}
          whileHover={{
            scale: 1.08,
          }}
          transition={{ duration: 0.35 }}
        />

        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
          <Circle size={10} />
          {label}
        </div>

        <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-white border border-zinc-200 text-zinc-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
          <Star
            size={10}
            className="fill-zinc-900 text-zinc-900"
          />
          4.8
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-zinc-900 sm:text-xl">
              {vehicle.vehicleModel || "Premium Ride"}
            </h2>

            <div className="mt-1 inline-flex items-center bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-lg">
              <span className="truncate text-zinc-500 text-[10px] font-black tracking-[0.14em] uppercase sm:text-xs">
                {vehicle.number || "Vehicle Number"}
              </span>
            </div>
          </div>

          <div className="h-11 w-11 shrink-0 rounded-2xl border border-zinc-200 bg-zinc-100 flex items-center justify-center">
            <Gauge size={17} className="text-zinc-700" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Distance
            </p>

            <div className="flex items-center gap-2 mt-2">
              <MapPin size={15} className="text-zinc-700" />
              <span className="text-sm font-bold text-zinc-900">
                {typeof distance === "number" ? `${distance.toFixed(1)} km` : "Nearby"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Price
            </p>

            <div className="flex items-center gap-1 mt-2">
              <IndianRupee size={15} className="text-zinc-700" />
              <span className="text-sm font-bold text-zinc-900">
                {fare}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Waiting
          </p>
          <div className="flex items-center gap-1 text-sm font-bold text-zinc-900">
            <IndianRupee size={14} className="text-zinc-700" />
            <span>{waitingCharge}</span>
            <span className="text-xs font-semibold text-zinc-500">/ min</span>
          </div>
        </div>

        <button onClick={onBook} className="mt-6 w-full rounded-2xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
          Book Ride
        </button>
      </div>
    </motion.div>
  )
}

export default VehicleCard