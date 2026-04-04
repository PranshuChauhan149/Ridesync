'use client'

import React, { useState } from 'react'
import { motion } from "framer-motion"
import { ArrowLeft, Bike, Car, Package, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [vehicleNumber,setVehicleNumber] = useState("");
  const [vehicleModal,setVehicleModal] = useState("");

  const VEHICLES = [
    { id: "bike", label: "Bike", icon: Bike, desc: "2 wheeler" },
    { id: "auto", label: "Auto", icon: Car, desc: "3 wheeler" },
    { id: "car", label: "Car", icon: Car, desc: "4 wheeler" },
    { id: "loading", label: "Loading", icon: Package, desc: "small goods" },
    { id: "truck", label: "Truck", icon: Truck, desc: "Heavy transport" },
  ];

  return (
    <div className='min-h-screen bg-white flex items-center justify-center px-4'>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'
      >

        {/* Header */}
        <div className='relative text-center mb-8'>
          
          <button 
            onClick={() => router.back()} 
            className='absolute bg-black left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-500 transition'
          >
            <ArrowLeft size={18}/>
          </button>

          <p className='text-xs text-gray-500 font-medium'>
            Step 1 of 3
          </p>

          <h1 className='text-black text-2xl font-bold mt-1'>
            Vehicle Details
          </h1>

          <p className='text-gray-600'>
            Add your vehicle information
          </p>
        </div>

        {/* Vehicle Types */}
        <div className='space-y-4'>
          <p className='text-sm font-semibold text-gray-700'>
            Vehicle Types
          </p>

          <div className='grid grid-cols-5 gap-4'>
            {VEHICLES.map((v) => {
              const Icon = v.icon;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelected(v.id)}
                  className={`cursor-pointer text-black border rounded-xl p-2 transition 
                    ${selected === v.id 
                      ? "border-black bg-black text-white" 
                      : "border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <div className='flex flex-col items-center text-center'>
                    <Icon size={28} />
                    <p className='mt-2 font-medium'>{v.label}</p>
                    <p className='text-xs text-gray-500'>{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
  <label htmlFor="vn" className="block text-sm font-medium text-gray-700">
    Vehicle Number
  </label>

  <input
    type="text"
    id="vn"
    value={vehicleNumber}
    onChange={(e)=>setVehicleNumber(e.target.value)}
    placeholder="e.g. PB10AB1234"
    className="mt-2 w-full text-black px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-black transition"
  />
</div>
        <div className="mt-4">
  <label htmlFor="vm" className="block text-sm font-medium text-gray-700">
    Vehicle Modal
  </label>

  <input
    type="text"
    id="vm"
    value={vehicleModal}
    onChange={(e)=>setVehicleModal(e.target.value)}
    placeholder="e.g. Tata Ace"
    className="mt-2 w-full text-black px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-black transition"
  />
</div>

        {/* Next Button */}
        <button
          disabled={!selected}
          className={`w-full mt-6 py-3 rounded-xl font-medium transition
            ${selected 
              ? "bg-black text-white hover:opacity-90" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          Continue
        </button>

      </motion.div>
    </div>
  )
}

export default Page