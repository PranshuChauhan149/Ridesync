'use client'
import React from 'react'
import { motion } from "motion/react"

const TabButton = ({ active, children, onClick, icon, count }: any) => {
  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all
        ${active 
          ? "bg-black text-white shadow-md" 
          : "bg-white text-gray-700 hover:bg-gray-100 border"}
      `}
    >
      <span className="text-lg">
        {icon}
      </span>

      <span className="hidden sm:inline font-medium">
        {children}
      </span>

     <span
  className={`
    text-xs px-2 py-0.5 rounded-full
    ${count > 0 
      ? "bg-red-500 text-white" 
      : "bg-gray-200 text-gray-700"}
  `}
>
  {count}
</span>
    </motion.div>
  )
}

export default TabButton