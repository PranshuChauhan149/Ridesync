'use client'

import React, { InputHTMLAttributes, useState } from 'react'
import { motion } from "framer-motion"
import { ArrowLeft, BadgeCheck, Hash, Landmark, LucideIcon, User, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon: LucideIcon
}

const Field = ({ label, icon: Icon, className = '', ...props }: FieldProps) => (
  <div>
    <label className='text-sm font-medium text-gray-700'>{label}</label>

    <div className='mt-2 flex items-center rounded-lg border border-gray-300 px-3 transition focus-within:border-black focus-within:ring-2 focus-within:ring-black'>
      <Icon size={16} className='text-gray-400' />
      <input
        {...props}
        className={`w-full bg-transparent px-3 py-2 outline-none text-black placeholder:text-gray-400 ${className}`}
      />
    </div>
  </div>
)

const Page = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    upi: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const isValid =
    form.accountHolder &&
    form.accountNumber &&
    form.ifsc;

  return (
    <div className='min-h-screen bg-white flex items-center justify-center px-4'>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'
      >

        {/* Header */}
        <div className='relative text-center mb-6'>
          <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white'>
            <Landmark size={22} />
          </div>

          <button
            onClick={() => router.back()}
            className='absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition'
          >
            <ArrowLeft size={18} />
          </button>

          <p className='text-xs text-gray-500 font-medium'>
            Step 3 of 3
          </p>

          <h1 className='text-xl font-bold mt-1'>
            Bank & Payout Setup
          </h1>

          <p className='text-gray-600 text-sm'>
            Used for partner payouts
          </p>
        </div>

        {/* Form */}
        <div className='space-y-4'>

          {/* Account Holder */}
          <Field
            label='Account holder name'
            icon={User}
            name='accountHolder'
            value={form.accountHolder}
            onChange={handleChange}
            placeholder='As per bank records'
          />

          {/* Account Number */}
          <Field
            label='Bank account number'
            icon={Wallet}
            name='accountNumber'
            value={form.accountNumber}
            onChange={handleChange}
            placeholder='Enter account number'
          />

          {/* IFSC */}
          <Field
            label='IFSC code'
            icon={Hash}
            name='ifsc'
            value={form.ifsc}
            onChange={handleChange}
            placeholder='HDFC0001234'
            className='uppercase'
          />

          {/* UPI */}
          <Field
            label='UPI ID (optional)'
            icon={BadgeCheck}
            name='upi'
            value={form.upi}
            onChange={handleChange}
            placeholder='name@upi'
          />

        </div>

        {/* Button */}
        <button
          disabled={!isValid}
          className={`w-full mt-6 py-3 rounded-xl font-medium transition
            ${isValid
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