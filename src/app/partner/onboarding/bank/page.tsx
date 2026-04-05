'use client'

import React, { InputHTMLAttributes, useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { ArrowLeft, BadgeCheck, Hash, Landmark, LucideIcon, Phone, User, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

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
    mobileNumber: "",
    upi: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    // Account Holder validation
    if (!form.accountHolder.trim()) {
      toast.error("Account holder name is required");
      return false;
    }
    if (form.accountHolder.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(form.accountHolder)) {
      toast.error("Name should contain only letters and spaces");
      return false;
    }

    // Account Number validation
    if (!form.accountNumber.trim()) {
      toast.error("Account number is required");
      return false;
    }
    if (!/^\d{9,18}$/.test(form.accountNumber.trim())) {
      toast.error("Account number should be 9-18 digits");
      return false;
    }

    // IFSC validation
    if (!form.ifsc.trim()) {
      toast.error("IFSC code is required");
      return false;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.trim())) {
      toast.error("Invalid IFSC format (e.g. HDFC0001234)");
      return false;
    }

    // Mobile Number validation
    if (!form.mobileNumber.trim()) {
      toast.error("Mobile number is required");
      return false;
    }
    if (!/^\d{10}$/.test(form.mobileNumber.trim())) {
      toast.error("Mobile number should be 10 digits");
      return false;
    }

    // UPI validation (optional but if provided, validate)
    if (form.upi.trim() && !/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(form.upi.trim())) {
      toast.error("Invalid UPI format (e.g. name@upi)");
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const isValid =
    form.accountHolder &&
    form.accountNumber &&
    form.ifsc &&
    form.mobileNumber;

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.post("/api/partner/onboarding/bank", {
        accountHolder: form.accountHolder.trim(),
        accountNumber: form.accountNumber.trim(),
        ifsc: form.ifsc.trim().toUpperCase(),
        mobileNumber: form.mobileNumber.trim(),
        upi: form.upi.trim(),
      });

      console.log(data);
      toast.success("Bank details saved successfully");
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Unable to save bank details");
      } else {
        toast.error("Unable to save bank details");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const handleGETData = async () => {
      try {
        const { data } = await axios.get("/api/partner/onboarding/bank");

        setForm((prev) => ({
          ...prev,
          accountHolder: data?.accountHolder || "",
          accountNumber: data?.accountNumber || "",
          ifsc: data?.ifsc || "",
          upi: data?.upi || "",
          mobileNumber: data?.mobileNumber || data?.owner?.mobileNumber || "",
        }));
       
        
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return;
        }
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Unable to fetch bank details");
        } else {
          toast.error("Unable to fetch bank details");
        }
      }
    };

    handleGETData();
  }, []);

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
            className='bg-black absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition'
          >
            <ArrowLeft size={18} />
          </button>

          <p className='text-xs text-gray-500 font-medium'>
            Step 3 of 3
          </p>

          <h1 className= 'text-black text-xl font-bold mt-1'>
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

          {/* Mobile Number */}
          <Field
            label='Mobile number'
            icon={Phone}
            name='mobileNumber'
            value={form.mobileNumber}
            onChange={handleChange}
            placeholder='Enter mobile number'
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
          type='button'
          disabled={!isValid || isSubmitting}
          onClick={handleSubmit}
          className={`w-full mt-6 py-3 rounded-xl font-medium transition
            ${isValid && !isSubmitting
              ? "bg-black text-white hover:opacity-90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </button>

      </motion.div>
    </div>
  )
}

export default Page