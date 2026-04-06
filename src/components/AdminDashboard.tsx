"use client";
import axios from "axios";
import { CheckCircle2, Clock3, ShieldX, Truck, User, Users, Video } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Kpi from "./Kpi";
import TabButton from "./TabButton";
import { motion,AnimatePresence } from "motion/react";
import ContentList from "./ContentList";


type Stats ={
  totalPartner: number;
  totalApprovedPartners: number;
  totalPendingPartners: number;
  totalRejectedPartners: number;
};

type Tab = "kyc" | "partner" | "vehicle"

const AdminDashboard = () => {
  const [partnerReviews,setPartnerReviews] = useState<any[]>([])
  const [pendinfkyc,setPendingKyc] = useState<any[]>([])
  const [vehicleReviews,setVehicleReviews] = useState<any[]>([])
  
    const [activeTab,setActiveTab] = useState<Tab>("partner");
    const [stats,setStats] = useState<Stats | null>(null)
  useEffect(() => {
    const handleGetData = async () => {
      try {
        const { data } = await axios.get("/api/admin/dashboard");
        console.log(data);
        setStats({
          totalPartner: data?.stats?.totalPartner ?? 0,
          totalApprovedPartners: data?.stats?.totalApprovedPartners ?? 0,
          totalPendingPartners: data?.stats?.totalPendingPartners ?? 0,
          totalRejectedPartners: data?.stats?.totalRejectedPartners ?? 0,
        });
        setPartnerReviews(data?.pendingPartnerReviews ?? [])
      } catch (error) {
        console.log(error);
      }
    };
    const handleGrtKyc = async () => {
      try {
        const { data } =  await axios.get("/api/admin/video-kyc/pending");
        console.log(data);
       setPendingKyc(data ?? [])
      } catch (error) {
        console.log(error);
      }
    };

     

    handleGetData();
    handleGrtKyc();
  }, []);




  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-gray-100 to-zinc-200 text-gray-900">
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={44}
              height={44}
              priority
            />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm">
            <Users size={16} />
            <span>Admin Dashboard</span>
          </div>
        </div>

      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-8 shadow-sm backdrop-blur-sm">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Monitor partner onboarding, approvals, and platform activity.
          </p>
        </div>

      </div>
      <main className="max-w-7xl mx-auto px-6 py-6 space-t-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Kpi
              label="Total Partners"
              value={stats?.totalPartner ?? 0}
              icon={<Users size={18} />}
              tone="blue"
            />
            <Kpi
              label="Approved"
              value={stats?.totalApprovedPartners ?? 0}
              icon={<CheckCircle2 size={18} />}
              tone="green"
            />
            <Kpi
              label="Pending"
              value={stats?.totalPendingPartners ?? 0}
              icon={<Clock3 size={18} />}
              tone="amber"
            />
            <Kpi
              label="Rejected"
              value={stats?.totalRejectedPartners ?? 0}
              icon={<ShieldX size={18} />}
              tone="rose"
            />

        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <TabButton 
            active={activeTab === "partner"} 
            count={partnerReviews.length}
            icon={<User size={15}/>}
              onClick={()=>setActiveTab("partner")}
            >
             Pending Partner Reviews
              </TabButton>


            <TabButton 
            active={activeTab == "kyc"} 
            count={pendinfkyc.length}
            icon={<Video size={15}/>}
              onClick={()=>setActiveTab("kyc")}
            >
              Pending Video KYC
              </TabButton>


            <TabButton 
            active={activeTab == "vehicle"} 
            count={vehicleReviews?.length ?? 0}
            icon={<Truck size={15}/>}
              onClick={()=>setActiveTab("vehicle")}
            >
              Pending Vehicle Reviews
              </TabButton>
              
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab == "partner" && <ContentList data={partnerReviews ?? []} type={"partner"} />}
            {activeTab == "kyc" && <ContentList data={pendinfkyc ?? []} type={"kyc"} />}
            {activeTab == "vehicle" && <ContentList data={vehicleReviews ?? []} type={"vehicle"} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
