import React from "react";
import { motion } from "framer-motion";

type KpiProps = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tone?: "blue" | "green" | "amber" | "rose";
};

const toneClasses = {
  blue: "border-blue-100 bg-blue-50/80 hover:border-blue-200",
  green: "border-emerald-100 bg-emerald-50/80 hover:border-emerald-200",
  amber: "border-amber-100 bg-amber-50/80 hover:border-amber-200",
  rose: "border-rose-100 bg-rose-50/80 hover:border-rose-200",
};

const Kpi = ({ label, value, icon, tone = "blue" }: KpiProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`group rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-xl ${toneClasses[tone]}`}
    >
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-white/90 p-2.5 text-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-900 group-hover:text-white">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
    </motion.div>
  );
};

export default Kpi;
