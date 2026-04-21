import React from 'react'
import { motion } from "framer-motion"

const StatusCard = ({ icon, title, desc }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-md border rounded-2xl shadow-md p-5 space-y-3"
    >
      
      {/* Icon */}
      <div className="w-fit p-2 rounded-lg bg-gray-100 text-gray-700">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-gray-800">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed">
        {desc}
      </p>

    </motion.div>
  )
}

export default StatusCard