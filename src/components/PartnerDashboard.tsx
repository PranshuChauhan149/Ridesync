"use client";

import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {motion} from "motion/react"
import { Lock } from "lucide-react";
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
  { id: 7, title: "Final Review" },
];

const TOTAl_STEPS = STEPS.length;

const PartnerDashboard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setActiveStep((userData?.partnerOnboardingSteps ?? 0) + 1);
  }, [userData]);

  const progressPercentage = ((activeStep-1)/(TOTAl_STEPS-1))* 100;

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
            <motion.div animate={{width:`${progressPercentage}%`}}
            transition={{duration:0.6}}
            className="absolute top-7 left-0 h-[3px] bg-black rounded-full"
            />
            <div className="relative flex justify-between">
                {
                    STEPS.map((s) => {
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
                    })
                }

            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
