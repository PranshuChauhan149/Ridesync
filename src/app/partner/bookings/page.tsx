"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ArrowLeft, Calendar, User, MapPin, DollarSign } from "lucide-react";

type Booking = {
  _id: string;
  userId: string;
  vehicleId: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
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
      // const { data } = await axios.get("/api/partner/bookings");
      // setBookings(data.bookings);
      console.log("Fetching bookings for partner:", userData?._id);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 pt-28 pb-20">
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
              <div
                key={booking._id}
                className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {booking.user?.name || "Customer"}
                    </h3>
                    <p className="text-sm text-gray-600">{booking.user?.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={18} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="font-medium">{booking.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={18} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">To</p>
                      <p className="font-medium">{booking.dropoffLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="font-medium text-sm">
                        {new Date(booking.pickupDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Dropoff</p>
                      <p className="font-medium text-sm">
                        {new Date(booking.dropoffDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-medium text-sm text-green-600">
                        ₹{booking.totalAmount.toLocaleString()}
                      </p>
                    </div>
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
