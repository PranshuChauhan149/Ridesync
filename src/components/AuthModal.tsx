"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleDashed, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type propType = {
  open: boolean;
  onClose: () => void;
};

type stepType = "login" | "signup" | "otp";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

const AuthModal = ({ open, onClose }: propType) => {
  const [step, setStep] = useState<stepType>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const isOtpComplete = otp.every((digit) => digit !== "");

  useEffect(() => {
    if (!open) {
      setStep("login");
      setName("");
      setEmail("");
      setPassword("");
      setOtp(Array(6).fill(""));
      setLoading(false);
      setResendLoading(false);
    }
  }, [open]);

  const handleSign = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setOtp(Array(6).fill(""));
      setStep("otp");
      toast.success("OTP sent to your email");
    } catch (e: unknown) {
      toast.error(getErrorMessage(e, "Something went wrong"));
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!isOtpComplete) {
      toast.error("Please enter 6 digit OTP");
      return;
    }

    setLoading(true);
    try {
      const normalizedOtp = otp.join("").replace(/\D/g, "").trim();

      await axios.post("/api/auth/verify-email", {
        email,
        otp: normalizedOtp,
      });

      toast.success("Email verified successfully");
      setStep("login");
    } catch (e: unknown) {
      toast.error(getErrorMessage(e, "Something went wrong"));
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please enter email first");
      setStep("signup");
      return;
    }

    setResendLoading(true);
    try {
      await axios.post("/api/auth/resend-otp", { email });
      setOtp(Array(6).fill(""));
      toast.success("New OTP sent");
      document.getElementById("otp-0")?.focus();
    } catch (e: unknown) {
      toast.error(getErrorMessage(e, "Unable to resend OTP"));
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogin = async ()=>{
    setLoading(true)
  const res =  await signIn("credentials",{
        email,password,redirect:false
    })
    setLoading(false)
    console.log(res);
    
  }


const handleLoginGoogle = async () => {
  await signIn("google");
};


const handleChangeOpt = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < otp.length - 1) {
    document.getElementById(`otp-${index + 1}`)?.focus();
    }
  if (!value && index > 0) {
    document.getElementById(`otp-${index - 1}`)?.focus();
    }
};

  return (
    <div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-black w-[90%] max-w-md rounded-2xl p-8 relative shadow-2xl border border-gray-200"
            >
              {/* Close Button */}
              <div
                onClick={onClose}
                className="absolute top-4 right-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <X size={20} />
              </div>

              {/* Logo */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  RYDEX
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Premium Vehicle Booking
                </p>
              </div>

              {/* Google Button */}
              <motion.button onClick={handleLoginGoogle}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-black py-3 rounded-lg mb-6 font-medium transition shadow-sm"
              >
                <Image
                  src={"/google.png"}
                  alt="google"
                  width={20}
                  height={20}
                />
                Continue with Google
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <div className="text-xs text-gray-400 font-medium">OR</div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* LOGIN */}
              {step === "login" && (
                <div className="flex flex-col gap-4">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    className="p-3 rounded-lg bg-gray-100 border border-gray-200 focus:border-blue-500 outline-none transition"
                  />
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    className="p-3 rounded-lg bg-gray-100 border border-gray-200 focus:border-blue-500 outline-none transition"
                  />

                  <motion.button  onClick={handleLogin}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg mt-2 shadow-md"
                  >
                    { !loading ?  "login" : <CircleDashed size={18}  color="white" className="animate-spin" /> }
                  </motion.button>

                  <p className="text-sm text-center text-gray-500">
                    Don&apos;t have an account?{" "}
                    <span
                      className="text-blue-500 cursor-pointer font-semibold"
                      onClick={() => setStep("signup")}
                    >
                      Signup
                    </span>
                  </p>
                </div>
              )}

              {/* SIGNUP */}
              {step === "signup" && (
                <div className="flex flex-col gap-4">
                  <input
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Full Name"
                    className="p-3 rounded-lg bg-gray-100 border border-gray-200 focus:border-blue-500 outline-none"
                  />
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    className="p-3 rounded-lg bg-gray-100 border border-gray-200 focus:border-blue-500 outline-none"
                  />
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    className="p-3 rounded-lg bg-gray-100 border border-gray-200 focus:border-blue-500 outline-none"
                  />

                  <motion.button
                    onClick={handleSign}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg mt-2 shadow-md flex justify-center items-center"
                  >
                    {!loading ? "Create Account" : <CircleDashed size={18} color="white" className="animate-spin" />}
                  </motion.button>

                  <p className="text-sm text-center text-gray-500">
                    Already have an account?{" "}
                    <span
                      className="text-blue-500 cursor-pointer font-semibold"
                      onClick={() => setStep("login")}
                    >
                      Login
                    </span>
                  </p>
                </div>
              )}

              {/* OTP */}
              {step === "otp" && (
                <motion.div initial={{opacity:0 , x:20}}
                animate={{opacity:1, x:0}}
                exit={{opacity:0,x:-20}} className="flex flex-col items-center" >
                 <h2 className="text-xl font-semibold">Verify Email</h2>
                 <div className="mt-6 flex justify-between gap-2">
                    {otp.map((digit,index)=>(
                        <input key={index} id={`otp-${index}`} value={digit} maxLength={1} className="w-10 h-12 sm:w-12 text-center text-lg font-semibold rounded-xl bg-white border border-black/20 outline-none" onChange={(e)=>handleChangeOpt(index,e.target.value)} />
                    ))}

                 </div>
                 <motion.button onClick={handleVerifyEmail}
                    disabled={loading || !isOtpComplete}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-linear-to-r from-gray-600 to-gray-700 text-white font-semibold py-3 px-6 rounded-lg mt-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {!loading ? "Verify OTP" : <CircleDashed size={18} color="white" className="animate-spin" />}
                  </motion.button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="mt-3 text-sm text-blue-600 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {resendLoading ? "Sending..." : "Resend OTP"}
                  </button>

                  
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthModal;
