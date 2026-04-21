"use client";

import { IVehicle } from "../../../../../models/vehicle.modal";
import axios from "axios";
import {
  ArrowLeft,
  BadgeCheck,
  Car,
  CircleDollarSign,
  Clock,
  FileText,
  Hash,
  ImageOff,
  Mail,
  Timer,
  User,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type VehicleOwner = {
  _id?: string;
  name?: string;
  email?: string;
};

type ReviewVehicle = IVehicle & {
  owner?: VehicleOwner;
};

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [vehicle, setVehicle] = useState<ReviewVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const vehicleId = useMemo(() => (typeof id === "string" ? id : ""), [id]);

  const handleGetVehicle = async () => {
    if (!vehicleId) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`/api/admin/reviews/vehicles/${vehicleId}`);
      setVehicle(data?.vehicle || null);
    } catch (error) {
      toast.error("Unable to fetch vehicle review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetVehicle();
  }, [vehicleId]);

  const handleApprove = async () => {
    if (!vehicleId) {
      return;
    }

    setIsApproving(true);
    try {
      const { data } = await axios.get(`/api/admin/reviews/vehicles/${vehicleId}/approve`);
      toast.success(data?.message || "Vehicle approved successfully");
      await handleGetVehicle();
    } catch (error) {
      toast.error("Unable to approve vehicle");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!vehicleId) {
      return;
    }

    if (!rejectionReason.trim()) {
      toast.error("Please enter rejection reason");
      return;
    }

    setIsRejecting(true);
    try {
      const { data } = await axios.post(`/api/admin/reviews/vehicles/${vehicleId}/reject`, {
        rejectionReason,
      });
      toast.success(data?.message || "Vehicle rejected successfully");
      setRejectionReason("");
      await handleGetVehicle();
    } catch (error) {
      toast.error("Unable to reject vehicle");
    } finally {
      setIsRejecting(false);
    }
  };

  const normalizedVehicleStatus = (vehicle?.status || "").toLowerCase();
  const canReview = normalizedVehicleStatus === "pending";

  const statusUI =
    normalizedVehicleStatus === "approved"
      ? {
          label: "Approved",
          className: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: <BadgeCheck size={14} />,
        }
      : normalizedVehicleStatus === "rejected"
        ? {
            label: "Rejected",
            className: "bg-rose-100 text-rose-700 border-rose-200",
            icon: <XCircle size={14} />,
          }
        : {
            label: "Pending",
            className: "bg-amber-100 text-amber-700 border-amber-200",
            icon: <Clock size={14} />,
          };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-lg font-medium text-gray-600">
        Loading Vehicle Review...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-100 via-slate-100 to-gray-200 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-white/60 bg-white/75 p-4 shadow-xl backdrop-blur-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Vehicle Review</p>
                <p className="text-sm font-semibold text-gray-800">Admin Panel</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusUI.className}`}
              >
                {statusUI.icon}
                {statusUI.label}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6 rounded-3xl border border-white/60 bg-white/85 p-5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Car size={18} /> Vehicle Details
            </div>

            {vehicle?.imageUrl ? (
              <img
                src={vehicle.imageUrl}
                alt="Vehicle"
                className="h-56 w-full rounded-2xl border border-gray-200 object-cover"
              />
            ) : (
              <div className="grid h-56 place-items-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <ImageOff size={16} />
                  No Vehicle Image
                </div>
              </div>
            )}

            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                <p className="text-xs text-gray-500">Type</p>
                <p className="mt-1 font-semibold text-gray-900 capitalize">{vehicle?.type || "-"}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                <p className="text-xs text-gray-500">Number</p>
                <p className="mt-1 flex items-center gap-1 font-semibold text-gray-900">
                  <Hash size={13} className="text-gray-500" /> {vehicle?.number || "-"}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                <p className="text-xs text-gray-500">Model</p>
                <p className="mt-1 font-semibold text-gray-900">{vehicle?.vehicleModel || "-"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/60 bg-white/85 p-5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <User size={18} /> Owner & Pricing
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                <p className="text-xs text-gray-500">Owner</p>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-gray-900">
                  <User size={13} className="text-gray-500" /> {vehicle?.owner?.name || "-"}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                <p className="text-xs text-gray-500">Email</p>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-gray-900">
                  <Mail size={13} className="text-gray-500" /> {vehicle?.owner?.email || "-"}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <CircleDollarSign size={16} /> Pricing
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-white px-3 py-2">
                  <p className="text-xs text-gray-500">Base Fare</p>
                  <p className="font-semibold text-gray-900">Rs. {vehicle?.baseFare ?? 0}</p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2">
                  <p className="text-xs text-gray-500">Price / KM</p>
                  <p className="font-semibold text-gray-900">Rs. {vehicle?.pricePerKM ?? 0}</p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2">
                  <p className="text-xs text-gray-500">Waiting</p>
                  <p className="font-semibold text-gray-900">Rs. {vehicle?.waitingCharge ?? 0}</p>
                </div>
              </div>
            </div>

            {vehicle?.rejectedReason ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  <FileText size={14} /> Rejection Reason
                </div>
                {vehicle.rejectedReason}
              </div>
            ) : null}

            {canReview ? (
              <>
                <textarea
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Rejection reason"
                  className="h-24 w-full resize-none rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={isApproving || isRejecting}
                    className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isRejecting ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                <Timer size={16} /> This vehicle review is already completed.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
