"use client";

import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { Check, Clock, Lock, Video, Zap } from "lucide-react";
import RejectionCard from "./RejectionCard";
import StatusCard from "./StatusCard";
import ActionCard from "./ActionCard";
import axios from "axios";
import toast from "react-hot-toast";
import PricingModal from "./PricingModal";
import { IVehicle } from "@/models/vehicle.modal";
type Step = {
  id: number;
  title: string;
  route?: string;
};

const STEPS: Step[] = [
  { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
  { id: 2, title: "Documents", route: "/partner/onboarding/documents" },
  { id: 3, title: "Bank", route: "/partner/onboarding/bank" },
  { id: 4, title: "Review" },
  { id: 5, title: "Video KYC" },
  { id: 6, title: "Pricing" },
  { id: 7, title: "Live" },
];

const TOTAl_STEPS = STEPS.length;

const PartnerDashboard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { userData } = useSelector((state: RootState) => state.user);
  const [requestLoading,setRequestLoading] = useState(false);
  const [showPricing,setShowPricing] = useState(false);
  const [vehicleData,setVehicleData] = useState<IVehicle | null>(null)

  const handleGetVehicle = async () => {
    try {
      const { data } = await axios.get("/api/partner/onboarding/vehicle");
      setVehicleData(data);
    } catch (error) {
      setVehicleData(null);
    }
  };

  useEffect(() => {
    setActiveStep((userData?.partnerOnboardingSteps ?? 0) + 1);
  }, [userData]);

  useEffect(() => {
    handleGetVehicle();
  }, []);

  useEffect(() => {
    if (!showPricing) {
      handleGetVehicle();
    }
  }, [showPricing]);

  const progressPercentage = ((activeStep - 1) / (TOTAl_STEPS - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 pt-28 pb-20">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Partner Onboarding
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Complete all steps to activate your account
          </p>
        </div>
        <div
          className="bg-white rounded-3xl p-10 shadow-xl border
        overflow-x-auto scrollbar-hide"
        >
          <div className="relative min-w-[800px]">
            <div className="absolute top-7  left-0 w-full h-[3px] bg-gray-200 rounded-full" />
            <motion.div
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6 }}
              className="absolute top-7 left-0 h-[3px] bg-black rounded-full"
            />
            <div className="relative flex justify-between">
              {STEPS.map((s) => {
                const completed = s.id < activeStep;
                const active = s.id === activeStep;
                const locked = s.id > activeStep;
                const isRoutable = Boolean(s.route) && s.id <= 3;
                const isCurrentPath = Boolean(s.route) && pathname === s.route;

                return (
                  <motion.div
                    key={s.id}
                    whileHover={isRoutable ? { scale: 1.04 } : undefined}
                    whileTap={isRoutable ? { scale: 0.98 } : undefined}
                    onClick={() => {

                      if(s.id == 6 && userData?.partnerStatus=="approved" && userData.videoKycStatus=="approved"){
                        setShowPricing(true)
                        return;
                      }

                      if (isRoutable && s.route) {
                        router.push(s.route);
                      }
                    }}
                    className={`flex w-24 flex-col items-center text-center ${
                      isRoutable ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 text-sm font-semibold transition ${
                        completed
                          ? "border-black bg-black text-white"
                          : active || isCurrentPath
                            ? "border-black bg-white text-black"
                            : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {completed ? "✓" : locked ? <Lock size={16} /> : s.id}
                    </div>

                    <p
                      className={`mt-3 text-xs font-medium ${
                        active || isCurrentPath
                          ? "text-black"
                          : locked
                            ? "text-gray-400"
                            : "text-gray-600"
                      }`}
                    >
                      {s.title}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {activeStep == 4 && userData?.partnerStatus == "rejected" && (
          <div>
            <RejectionCard
              title="Partner Rejected"
              reason={userData.rejectionReason}
              actionLabel={`Review and Update`}
              onAction={() => {
                router.push("/partner/onboarding/vehicle");
              }}
            />
          </div>
        )}

        {activeStep == 4 && userData?.partnerStatus == "pending" && (
          <StatusCard
            icon={<Clock size={18} />}
            title={"Documents under review"}
            desc={"Admin is verifying your documents."}
          />
        )}

        {activeStep == 5 &&
          (userData?.videoKycStatus === "approved" ? (
            <StatusCard
              icon={<Check size={18} />}
              title={"video kyc approved"}
              desc={"you can now proceed to pricing"}
            />
          ) : userData?.videoKycStatus === "rejected" ? (
            <RejectionCard
              title="Video KYC Rejected"
              reason={userData?.videoKycRejectionReason}
              actionLabel={requestLoading ? "Requesting..." : "Request Again"}
              onAction={async()=>{
                setRequestLoading(true);
                try {
                  await axios.get("/api/partner/video-kyc/request");
                  toast.success("request send successfully")
                } catch (error) {
                  console.error("Unable to request Video KYC again", error);
                } finally {
                  setRequestLoading(false);
                }
              }}

            />
          ) : userData?.videoKycStatus === "inprogess" &&
            userData?.videoKycRoomId ? (
            <ActionCard
              icon={<Video size={18} />}
              title={"Admin Started Video KYC"}
              button={"Join Call"}
              onClick={() =>
                router.push(`/video-kyc/${userData?.videoKycRoomId}`)
              }
            />
          ) : (
            <StatusCard
              icon={<Clock size={18} />}
              title="waiting for Admin"
              desc="Admin will initiate Video KYC shortly"
            />
          ))}
          {activeStep >= 6 && vehicleData?.status=="pending" && (
            <StatusCard  icon={<Clock size={18} />}
              title="Pricing Under Review"
              desc="Admin is reviewing your pricing" />
          )}
          {activeStep >= 6 && vehicleData?.status=="rejected" && (
            <RejectionCard title="Pricing Rejected"
              reason={vehicleData.rejectedReason}
              actionLabel="Edit & Resubmit" onAction={()=>setShowPricing(true)} />
          )}

          {
            activeStep == 7 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                <ActionCard
                  icon={<Zap size={18} />}
                  title="You are Live!"
                  desc="Ready to accept bookings"
                  button="Go to Bookings"
                  onClick={() => router.push("/partner/bookings")}
                />
              </motion.div>
            )
          }
      </div>




      <PricingModal open={showPricing} onClose={()=>setShowPricing(false)} data={vehicleData} />
    </div>
  );
};

export default PartnerDashboard;


// sdfsdsddsfdfg