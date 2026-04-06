"use client";

import AnimatedCard from "@/components/AnimatedCard";
import DocPreview from "@/components/DocPreview";
import { IPartnerBank } from "@/models/partnerBank.modals";
import { IPartnerDocs } from "@/models/partnerDocs.modals";
import { IUser } from "@/models/user.models";
import { IVehicle } from "@/models/vehicle.modal";
import axios from "axios";
import { ArrowLeft, Car, File, FileText, Landmark, ShieldCheck } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {AnimatePresence, motion} from "motion/react"
import toast from "react-hot-toast";

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

const Page = () => {
  const { id } = useParams();
  const [data, setData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
    const[vechileDatails,setVehicleDatails] = useState<IVehicle | null>(null)
    const[partnerDocs,setPartnerDocs] = useState<IPartnerDocs | null>(null)
    const [partnerBank,setPartnerBank] = useState<IPartnerBank | null>(null)
    const [showApprove,setShowApprove] = useState(false);
    const [showReject,setShowReject] = useState(false);
    const [rejectionReason,setRejectionReason] = useState("")
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
  const handleGetPartner = async () => {
    try {
      const res = await axios.get(`/api/admin/reviews/partner/${id}`);
      setData(res.data.partner);
      setVehicleDatails(res.data.vehicle)
      setPartnerDocs(res.data.documents)
      setPartnerBank(res.data.bank)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetPartner();
  }, []);

  const normalizedPartnerStatus = (data?.partnerStatus || "").trim().toLowerCase();
  const normalizedVehicleStatus = (vechileDatails?.status || "").trim().toLowerCase();
  console.log("sdsdfsdfdsfsdf" ,normalizedVehicleStatus);
  
  const isPendingReview =
    normalizedPartnerStatus === "pending" || normalizedVehicleStatus === "pending";

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-600 text-lg font-medium">
        Loading Partner....
      </div>
    );
  }

  const handleApprove = async ()=>{
    setIsApproving(true);
    try {
        const response = await axios.get(`/api/admin/reviews/partner/${id}/approve`);
        toast.success(response.data?.message || "Partner approved successfully");
        setShowApprove(false);
        await handleGetPartner();
    } catch (error) {
        toast.error(getApiErrorMessage(error, "Unable to approve partner"));
    } finally {
      setIsApproving(false);
    }
  }


    const handleRejected = async ()=>{
    if (!rejectionReason.trim()) {
      toast.error("Please enter rejection reason");
      return;
    }

    setIsRejecting(true);
    try {
      const response = await axios.post(`/api/admin/reviews/partner/${id}/reject`,{
            rejectionReason
        });
      toast.success(response.data?.message || "Partner rejected successfully");
      setShowReject(false);
      setRejectionReason("");
      await handleGetPartner();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to reject partner"));
    } finally {
      setIsRejecting(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-gray-100 to-zinc-200 text-gray-900">
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-gray-100 p-2 shadow-sm transition hover:bg-gray-200">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>

            <div className="space-y-0.5">
              <div className="text-base font-semibold text-gray-800 sm:text-xl">
                {data?.name}
              </div>

              <div className="text-xs text-gray-500 sm:text-sm">
                {data?.email}
              </div>
            </div>
          </div>
            {/* Status */}
            {normalizedPartnerStatus === "approved" ? (
              <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-xs font-medium text-green-700">
                Approved
              </div>
            ) : normalizedPartnerStatus === "rejected" ? (
              <div className="inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-xs font-medium text-red-700">
                Rejected
              </div>
            ) : (
              <div className="inline-flex items-center rounded-full bg-yellow-100 px-4 py-2 text-xs font-medium text-yellow-700">
                Pending
              </div>
            )}

        

        </div>

      </div>
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-gray-100 to-zinc-200 p-4 sm:p-6">
  <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
  <div className="space-y-6"> 
    <AnimatedCard 
      title="Vehicle Details" 
      icon={<Car size={18} />} 
    >
      
      <div className="flex items-center justify-between border-b border-gray-200 py-2 text-sm text-gray-700">
        <span className="font-medium text-gray-500">
          Vehicle Type
        </span>
        <span className="font-semibold text-gray-900">
          {vechileDatails?.type}
        </span>
      </div>

      <div className="flex items-center justify-between border-b border-gray-200 py-2 text-sm text-gray-700">
        <span className="font-medium text-gray-500">
          Registration Number
        </span>
        <span className="font-semibold text-gray-900">
          {vechileDatails?.number}
        </span>
      </div>
      <div className="flex items-center justify-between border-b border-gray-200 py-2 text-sm text-gray-700 last:border-b-0">
        <span className="font-medium text-gray-500">
          Model 
        </span>
        <span className="font-semibold text-gray-900">
          {vechileDatails?.vehicleModel}
        </span>
      </div>

    </AnimatedCard>


        <AnimatedCard title="Docments" icon={<FileText size={18}/>} >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <DocPreview label={"Aadhaar"} url={partnerDocs?.aadharUrl} />
                <DocPreview label={"Registration Certificate"} url={partnerDocs?.rcUrl} />
                <DocPreview label={"Driving License"} url={partnerDocs?.license} />
                
            </div>
        </AnimatedCard>

  </div>

  <div className="space-y-6">

            <AnimatedCard title={"Banks Details"} icon={<Landmark size={18}/>}>
            <div className="flex items-center justify-between border-b border-gray-200 py-2 text-sm">
                <span className="text-gray-500">Account Holder</span>
                <span className="font-medium text-gray-900">{partnerBank?.accountHolder}</span>

            </div>
                  <div className="flex items-center justify-between border-b border-gray-200 py-2 text-sm">
                <span className="text-gray-500">Account Number</span>
                <span className="font-medium text-gray-900">{partnerBank?.accountNumber}</span>

            </div>
                  <div className="flex items-center justify-between border-b border-gray-200 py-2 text-sm">
                <span className="text-gray-500">IFSC Code </span>
                <span className="font-medium text-gray-900">{partnerBank?.ifsc}</span>

            </div>
                  <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-500">Upi </span>
                <span className="font-medium text-gray-900">{partnerBank?.upi}</span>

            </div>
      
            </AnimatedCard>


            {isPendingReview && 
            <motion.div
  className="bg-white border rounded-2xl shadow-lg p-5 space-y-4"
>
  <div className="flex items-center gap-2 text-gray-800 font-semibold">
    <span className="p-2 bg-green-100 rounded-lg text-green-600">
      <ShieldCheck size={18} />
    </span>
    Admin Check
  </div>

  <p className="text-sm text-gray-500">
    Verify documents carefully before approving
  </p>

  <div className="flex gap-3 pt-2">
    <button onClick={()=>setShowApprove(true)} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition">
      Approve
    </button>

    <button onClick={()=>setShowReject(true)} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition">
      Reject
    </button>
  </div>
</motion.div>}
  </div>
  </div> 
</main>


      <AnimatePresence>
  {showApprove && (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5"
      >
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">
          Approve Partner
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500">
          Confirm all the information has been verified
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={()=>setShowApprove(false)}
            className="px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button onClick={handleApprove}
            disabled={isApproving}
            className="px-4 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isApproving ? "Approving..." : "Yes, Approve"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


<AnimatePresence>
  {showReject && (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5"
      >
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">
          Reject Partner
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500">
          Please provide a reason for rejection
        </p>

        {/* Textarea */}
        <textarea value={rejectionReason} onChange={(e)=>setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full h-24 p-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={()=>setShowReject(false)}
            className="px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button  onClick={handleRejected}
            disabled={isRejecting}
            className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRejecting ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

export default Page;