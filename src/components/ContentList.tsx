'use client'
import React from 'react'
import { motion } from "motion/react"
import { CheckCircle2, Mail, Truck, User, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

type ContentListProps = {
  data: any[]
  type: 'partner' | 'kyc' | 'vehicle'
}

const ContentList = ({ data, type }: ContentListProps) => {
    const router = useRouter();
  if (data?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mt-6 rounded-xl sm:rounded-2xl border border-gray-200 bg-linear-to-br from-green-50 to-emerald-50 p-6 sm:p-12 text-center"
      >
        <div className="flex justify-center mb-3 sm:mb-4">
          <CheckCircle2 size={40} className="sm:w-12 sm:h-12 text-green-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">All Clear!</h3>
        <p className="text-xs sm:text-sm text-gray-600">
          No pending {type === 'partner' ? 'partner reviews' : type === 'kyc' ? 'KYC verifications' : 'vehicle reviews'} at the moment.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-6 rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
          {type === 'partner' ? 'Pending Partner Reviews' : type === 'kyc' ? 'Pending KYC Verifications' : 'Pending Vehicle Reviews'}
        </h3>
        <p className="text-xs text-gray-600 mt-1">{data.length} item{data.length !== 1 ? 's' : ''} awaiting review</p>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-200">
        {type === 'partner' && (
          data.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 shrink-0">
                    <User size={16} className="sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <div className="flex items-center gap-1 mt-0.5 sm:mt-1 min-w-0">
                      <Mail size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
                      <p className="text-xs text-gray-600 truncate">{item.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 ml-11 sm:ml-0">
                  {item.vehicleTpye && (
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-amber-100 shrink-0">
                      <Truck size={12} className="sm:w-3.5 sm:h-3.5 text-amber-700" />
                      <span className="text-xs font-medium text-amber-700 capitalize">{item.vehicleTpye}</span>
                    </div>
                  )}
                  <button onClick={()=>{type=="partner" ? router.push(`/admin/reviews/partner/${item._id}`) : router.push(`/admin/reviews/vehicles${item._id}`)} } className="px-2.5 sm:px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shrink-0">
                    Review
                  </button>
                </div>
              </div>
              {item.vehicleTpye && (
                <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 w-fit mt-2">
                  <Truck size={12} className="text-amber-700" />
                  <span className="text-xs font-medium text-amber-700 capitalize">{item.vehicleTpye}</span>
                </div>
              )}
            </motion.div>
          ))
        )}

        {type === 'kyc' && (
          data.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-purple-50/30 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 shrink-0">
                    <AlertCircle size={16} className="sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name || 'KYC Submission'}</p>
                    <p className="text-xs text-gray-600 mt-0.5 sm:mt-1 truncate">{item.email || 'Pending verification'}</p>
                  </div>
                </div>
                <button className="px-2.5 sm:px-3 py-1 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shrink-0 sm:ml-0 ml-11">
                  Verify
                </button>
              </div>
            </motion.div>
          ))
        )}

        {type === 'vehicle' && (
          data.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-orange-50/30 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 shrink-0">
                    <Truck size={16} className="sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.type || 'Vehicle'} - {item.registrationNumber || 'N/A'}</p>
                    <p className="text-xs text-gray-600 mt-0.5 sm:mt-1 truncate">{item.ownerName || 'Owner'} | {item.model || 'Model info'}</p>
                  </div>
                </div>
                <button className="px-2.5 sm:px-3 py-1 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shrink-0 sm:ml-0 ml-11">
                  Review
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default ContentList
