'use client';

import React from "react";
import { motion } from "framer-motion";
import {
  CarTaxiFront,
  Bike,
  Truck,
  Bus,
  Car,
} from "lucide-react";

const VEHICLE_CATEGORIES = [
  {
    title: "All Vehicles",
    desc: "Browse the full fleet",
    Icon: CarTaxiFront,
    tag: "Popular",
  },
  {
    title: "Bikes",
    desc: "Quick & affordable",
    Icon: Bike,
    tag: "Fast",
  },
  {
    title: "Cars",
    desc: "Comfortable city rides",
    Icon: Car,
    tag: "Best",
  },
  {
    title: "SUVs",
    desc: "Premium & spacious travel",
    Icon: Car,
    tag: "Premium",
  },
  {
    title: "Bus",
    desc: "Group travel",
    Icon: Bus,
    tag: "Family",
  },
  {
    title: "Trucks",
    desc: "Heavy transport",
    Icon: Truck,
    tag: "Utility",
  },
];
const stats = [
  { num: "6+", label: "Categories" },
  { num: "10+", label: "Vehicle Types" },
  { num: "24/7", label: "Availability" },
];

const VehicleSlider = () => {
  return (
    <div className="w-full bg-white py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-zinc-900" />
              <span className="text-[10px] font-black tracking-[0.2em] text-zinc-400">
                Fleet
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 leading-none">
              Vehicles <br />
              <span className="relative inline-block">
                Categories
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-zinc-900 origin-left"
                />
              </span>
            </h2>

            <p className="text-zinc-500 mt-3">
              Choose the ride that fits your journey
            </p>
          </div>
        </motion.div>

        {/* Slider */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">

          {VEHICLE_CATEGORIES.map((item, index) => {
            const Icon = item.Icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="min-w-55 bg-zinc-100 rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                {/* Tag */}
                <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                  {item.tag}
                </span>

                {/* Icon */}
                <div className="mt-4 w-12 h-12 flex items-center justify-center rounded-full bg-black shadow">
                  <Icon size={22} />
                </div>

                {/* Content */}
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                  {item.title}
                </h3>

                <p className="text-sm text-zinc-500 mt-1">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}

        </div>
       <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="grid grid-cols-3 gap-6 mt-10"
>
  {stats.map((item, index) => (
    <div
      key={index}
      className="text-center bg-zinc-100 rounded-xl py-5 hover:shadow-lg transition"
    >
      <h3 className="text-2xl font-bold text-zinc-900">
        {item.num}
      </h3>
      <p className="text-sm text-zinc-500 mt-1">
        {item.label}
      </p>
    </div>
  ))}
</motion.div>
      </div>
    </div>
  );
};

export default VehicleSlider;