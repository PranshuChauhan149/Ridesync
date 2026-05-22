"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ArrowLeft, Calendar, User, MapPin, DollarSign, Phone, Bike } from "lucide-react";
import axios from "axios";

type Booking = {
  _id: string;
  userId?: string;
  vehicleId?: string;
  // align with booking model fields
  pickUpAddress?: string;
  dropAddress?: string;
  fare?: number;
  bookingStatus?:
    | "idle"
    | "requested"
    | "awaiting_payment"
    | "confirmed"
    | "started"
    | "completed"
    | "cancelled"
    | "rejected"
    | "expired";
  createdAt?: string | Date;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
};

const PartnerBookings = () => {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // TODO: Create API endpoint to fetch partner's bookings
      const { data } = await axios.get("/api/partner/bookings");
      setBookings(data.bookings);
      console.log(data);
      
      console.log("Fetching bookings for partner:", userData?._id);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "awaiting_payment":
        return "bg-sky-50 text-sky-700";
      case "requested":
        return "bg-yellow-50 text-yellow-800";
      case "confirmed":
        return "bg-emerald-50 text-emerald-800";
      case "started":
        return "bg-indigo-50 text-indigo-800";
      case "completed":
        return "bg-blue-50 text-blue-800";
      case "cancelled":
      case "rejected":
        return "bg-red-50 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (d?: string | Date) => {
    if (!d) return "—";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
  };

  const formatAmount = (a?: number) => {
    if (a == null) return "—";
    try {
      return `₹${a.toLocaleString()}`;
    } catch (e) {
      return `₹${a}`;
    }
  };

  const formatDateTime = (d?: string | Date) => {
    if (!d) return "—";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "—";
    const datePart = date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
    const timePart = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return `${datePart} at ${timePart}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-4 pt-28 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Your Bookings
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Manage your vehicle bookings</p>
          </div>
        </div>

        {/* Bookings List */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-600">Showing {bookings.length} bookings</div>
            <div className="text-xs text-zinc-400">{bookings.length} ride{bookings.length !== 1 ? "s" : ""} assigned to you</div>
          </div>
          <div>
            <select className="border rounded px-3 py-1 text-sm">
              <option>All</option>
              <option>Awaiting Payment</option>
              <option>Confirmed</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
              <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-600">
                Once customers book your vehicle, they will appear here.
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-5 py-4 bg-linear-to-r from-sky-50 to-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-xl font-bold text-sky-600 border">
                      {(booking.user?.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold uppercase text-zinc-900">{(booking.user?.name || "User")}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-2"><Phone size={14} className="text-zinc-400" />{(booking.user as any)?.mobileNumber || booking.user?.phone || booking.user?.email || ""}</div>
                    </div>
                  </div>

                    <div>
                      <span className="px-3 py-1 rounded-md bg-black text-sky-600 text-sm font-semibold">{((booking.bookingStatus as string) || "-")}</span>
                    </div>
                </div>

                {/* vehicle row */}
                <div className="px-5 py-3 border-b bg-zinc-50 text-sm text-zinc-500">
                  {(booking as any).vehicle?.vehicleModel ? `${(booking as any).vehicle.vehicleModel} • ${(booking as any).vehicle.number || ""}` : ""}
                </div>

                {/* pickup/drop */}
                <div className="p-5 bg-white">
                  <div className="mb-4">
                    <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-emerald-600">Pick Up</div>
                      <div className="text-sm text-zinc-800">{(booking as any).pickUpAddress || "-"}</div>
                    </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-zinc-400">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-zinc-400">Drop</div>
                        <div className="text-sm text-zinc-800">{(booking as any).dropAddress || "-"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* bottom row */}
                <div className="flex items-center justify-between px-5 py-3 bg-white border-t">
                  <div className="flex items-center gap-4 text-sm text-zinc-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <div>{formatDateTime(booking.createdAt)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-xs text-zinc-500">Payment:</div>
                        <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">{((booking as any).paymentStatus || "pending").toString().toLowerCase()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-zinc-900">{formatAmount((booking as any).fare || (booking as any).totalAmount)}</div>
                    <button onClick={() => router.push(`/partner/bookings/${booking._id}`)} className="px-3 py-2 rounded-md bg-blue-50 text-blue-600 border border-blue-100 text-sm font-semibold hover:bg-blue-100">Details</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerBookings;
