"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  MapPin,
  Phone,
  User,
  Bike,
  Car,
  Truck,
} from "lucide-react";

type BookingStatus =
  | "idle"
  | "requested"
  | "awaiting_payment"
  | "confirmed"
  | "started"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";

type Booking = {
  _id: string;
  bookingStatus?: BookingStatus;
  paymentStatus?: string;
  pickUpAddress?: string;
  dropAddress?: string;
  fare?: number;
  createdAt?: string | Date;
  paymentDeadline?: string | Date;
  driver?: {
    name?: string;
    email?: string;
    mobileNumber?: string;
  };
  vehicle?: {
    vehicleModel?: string;
    number?: string;
    type?: "bike" | "car" | "loading" | "truck" | "auto";
  };
};

const statusStyles: Record<string, string> = {
  awaiting_payment: "bg-sky-50 text-sky-700",
  requested: "bg-yellow-50 text-yellow-800",
  confirmed: "bg-emerald-50 text-emerald-800",
  started: "bg-indigo-50 text-indigo-800",
  completed: "bg-blue-50 text-blue-800",
  cancelled: "bg-red-50 text-red-800",
  rejected: "bg-red-50 text-red-800",
  expired: "bg-zinc-100 text-zinc-700",
  idle: "bg-zinc-100 text-zinc-700",
};

const paymentStyles: Record<string, string> = {
  cash: "bg-yellow-100 text-yellow-700",
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

const vehicleIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  bike: Bike,
  car: Car,
  auto: Car,
  loading: Truck,
  truck: Truck,
};

const Page = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user/bookings");
      setBookings(Array.isArray(data?.bookings) ? data.bookings : []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (value?: string | Date) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    const datePart = date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timePart = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${datePart} at ${timePart}`;
  };

  const formatAmount = (value?: number) => {
    if (value == null) return "—";
    try {
      return `₹${value.toLocaleString()}`;
    } catch {
      return `₹${value}`;
    }
  };

  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((booking) => (booking.bookingStatus || "") === filter);
  }, [bookings, filter]);

  const shownCount = filteredBookings.length;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-4 pt-8 pb-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition"
          >
            <ArrowLeft size={22} className="text-zinc-700" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900">
              My Bookings
            </h1>
            <p className="text-zinc-500 text-sm md:text-base">
              Track your ride requests and payment status
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-600">Showing {shownCount} bookings</div>
            <div className="text-xs text-zinc-400">
              {shownCount} ride{shownCount !== 1 ? "s" : ""} in your history
            </div>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm outline-none"
          >
            <option value="all">All</option>
            <option value="awaiting_payment">Awaiting Payment</option>
            <option value="requested">Requested</option>
            <option value="confirmed">Confirmed</option>
            <option value="started">Started</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-zinc-500 shadow-sm">
              Loading bookings...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
              <Calendar size={42} className="mx-auto mb-4 text-zinc-300" />
              <h3 className="text-xl font-bold text-zinc-800 mb-1">No bookings yet</h3>
              <p className="text-sm text-zinc-500">
                Once you request a ride, it will appear here.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const isExpanded = expandedId === booking._id;
              const vehicleType = booking.vehicle?.type || "car";
              const VehicleIcon = vehicleIcons[vehicleType] || Car;

              return (
                <div key={booking._id} className="overflow-hidden rounded-[22px] border bg-white shadow-sm">
                  <div className="flex items-center justify-between bg-linear-to-r from-sky-50 to-white px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border bg-sky-100 text-sky-600 shadow-sm">
                        <User size={22} />
                      </div>
                      <div>
                        <div className="text-base font-extrabold uppercase tracking-tight text-zinc-900">
                          {booking.driver?.name || "Driver"}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                          <Phone size={14} className="text-zinc-400" />
                          <span>{booking.driver?.mobileNumber || booking.driver?.email || "—"}</span>
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-md px-3 py-1 text-sm font-semibold capitalize ${statusStyles[booking.bookingStatus || "idle"] || statusStyles.idle}`}>
                      {booking.bookingStatus || "idle"}
                    </div>
                  </div>

                  <div className="border-t bg-zinc-50 px-5 py-3 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                      <VehicleIcon size={16} className="text-zinc-400" />
                      <span className="uppercase tracking-wide">
                        {booking.vehicle?.vehicleModel || "Vehicle"}
                        {booking.vehicle?.number ? ` • ${booking.vehicle.number}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white px-5 py-5">
                    <div className="mb-5 flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                          Pick Up
                        </div>
                        <div className="text-base text-zinc-800">
                          {booking.pickUpAddress || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-600">
                          Drop
                        </div>
                        <div className="text-base text-zinc-800">
                          {booking.dropAddress || "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t bg-white px-5 py-4">
                    <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-zinc-400" />
                        <span>{formatDateTime(booking.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Payment:</span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${paymentStyles[(booking.paymentStatus || "pending").toLowerCase()] || paymentStyles.pending}`}
                        >
                          {(booking.paymentStatus || "pending").toLowerCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-extrabold text-zinc-900">
                        {formatAmount(booking.fare)}
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : booking._id)}
                        className="flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-100"
                      >
                        Details
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={()=>router.push(`/user/ride/${booking._id}`)}
                        className="flex items-center gap-2 rounded-md border border-blue-100  px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-blue-100" style={{"background":"lightgreen"}}
                      >
                        View Ride
                       
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t bg-zinc-50 px-5 py-4 text-sm text-zinc-600">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                            Booking ID
                          </div>
                          <div className="mt-1 font-medium text-zinc-800">{booking._id}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                            Payment Deadline
                          </div>
                          <div className="mt-1 font-medium text-zinc-800">
                            {formatDateTime(booking.paymentDeadline)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                            Driver Contact
                          </div>
                          <div className="mt-1 font-medium text-zinc-800">
                            {booking.driver?.mobileNumber || "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
