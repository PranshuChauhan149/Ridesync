import React from 'react'
import { motion } from "framer-motion"

const AnimatedCard = ({ title, icon, children }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/90 backdrop-blur-md border rounded-2xl shadow-lg p-5 space-y-4"
    >
      
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-800">
        <div className="p-2 bg-gray-100 rounded-lg">
          {icon}
        </div>
        <h2 className="text-sm font-semibold tracking-wide">
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {children}
      </div>

    </motion.div>
  )
}

export default AnimatedCard