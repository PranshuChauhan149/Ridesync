"use client";

import { IBooking } from "@/models/booking.models";
import axios from "axios";
import { Clock, IndianRupee, Loader2, MapPin, Navigation } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Page = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/partner/bookings/pending");

      if (data.success) {
        setBookings(data.booking || []);
      }
    } catch (error) {
      console.log(error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-gray-900">Ride Requests</h1>

          <p className="text-gray-500 mt-3 text-lg">
            Manage incoming ride requests and respond in real time.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-gray-700" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
            <p className="text-gray-500 text-lg">No pending ride requests.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-gray-700" />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Pickup Location</p>
                        <p className="text-base font-medium text-gray-800">
                          {b.pickUpAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center">
                        <Navigation className="w-5 h-5 text-gray-700" />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Drop Location</p>
                        <p className="text-base font-medium text-gray-800">
                          {b.dropAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Date & Time */}
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500" />

                        <span className="text-sm text-gray-600">
                          {new Date(b.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>

                      {/* Fare Section */}

  <div className="flex flex-col lg:items-end gap-5">
  {/* Fare Section */}
  <div className="text-left lg:text-right">
    <p className="text-xs tracking-wide text-gray-400 uppercase mb-1">
      Estimated Fare
    </p>

    <div className="flex items-center gap-2 text-2xl font-bold text-black lg:justify-end">
      <IndianRupee className="w-5 h-5 text-black" />
      <span>{b.fare}</span>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex gap-3 justify-end">
    <button className="px-6 py-2 rounded-lg border border-black bg-white text-black font-medium hover:bg-black hover:text-green-500 transition">
      Accept
    </button>

    <button className="px-6 py-2 rounded-lg border border-black bg-black text-white font-medium hover:bg-white hover:text-black transition">
      Reject
    </button>
  </div>
</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
