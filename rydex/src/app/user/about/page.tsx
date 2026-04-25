'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Bike,
  Car,
  Clock3,
  Handshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
}

const stats = [
  { label: 'Cities live', value: '28+' },
  { label: 'Partner drivers', value: '12K+' },
  { label: 'Trips completed', value: '2.4M+' },
  { label: 'Avg. pickup time', value: '4.8 min' },
]

const principles = [
  {
    title: 'Reliable in rush hours',
    desc: 'Smart dispatch balances demand and keeps your wait low even during peak traffic.',
    Icon: Clock3,
  },
  {
    title: 'Safety built in',
    desc: 'Verified partners, ride tracking, and support-first workflows designed for trust.',
    Icon: ShieldCheck,
  },
  {
    title: 'Fair for everyone',
    desc: 'Transparent pricing for riders and meaningful earnings visibility for partners.',
    Icon: Handshake,
  },
]

const journey = [
  {
    title: 'Search your route',
    detail: 'Pick a destination and compare options instantly with clear ETAs and pricing.',
    Icon: MapPin,
  },
  {
    title: 'Choose your ride',
    detail: 'Book bikes, autos, or cars based on budget, speed, and availability nearby.',
    Icon: Car,
  },
  {
    title: 'Track and go',
    detail: 'Watch your driver approach in real time and stay updated throughout the trip.',
    Icon: Bike,
  },
]

const AboutPage = () => {
  const router = useRouter()

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f4f0e8] text-[#1c1f1b]">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#f7b267]/35 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-[#8ecae6]/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#90be6d]/25 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-[#1c1f1b]/10 bg-[#f4f0e8]/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ x: -2 }}
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-[#1c1f1b]/15 bg-[#fffaf1] px-4 py-2 text-sm font-semibold text-[#1f3c34] shadow-sm transition"
          >
            <ArrowLeft size={16} />
            Back
          </motion.button>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#1f3c34]/65">Rydex</p>
            <h1 className="text-base font-black leading-none text-[#1c1f1b] sm:text-lg">About Us</h1>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-16 pt-7 sm:px-6 sm:pt-9 lg:px-8 lg:pt-10">
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[30px] border border-[#1c1f1b]/10 bg-[#1f3c34] p-7 text-[#f8f4ea] shadow-[0_18px_60px_rgba(17,24,39,0.22)] sm:p-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
            animate={{ opacity: 0.2, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="absolute -right-8 -top-10 h-44 w-44 rounded-full border border-white/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
            animate={{ opacity: 0.18, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="absolute -bottom-10 left-1/3 h-40 w-40 rounded-full border border-white/40"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full border border-[#f8f4ea]/30 bg-[#f8f4ea]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em]"
              >
                <Sparkles size={14} />
                Who We Are
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-3xl font-black leading-tight sm:text-[2.55rem] lg:text-[3.2rem]"
              >
                We are building the most human way to move across your city.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-5 max-w-2xl text-sm leading-7 text-[#f8f4ea]/85 sm:text-base"
              >
                Rydex started with one idea: urban mobility should feel calm, quick, and fair. We connect
                riders and partners through live maps, trustworthy onboarding, and dependable service built
                for everyday commutes.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="grid grid-cols-2 gap-3"
            >
              {stats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + index * 0.08 }}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur"
                >
                  <p className="text-2xl font-black text-[#f8f4ea] sm:text-3xl">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#f8f4ea]/75">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {principles.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.12, duration: 0.45 }}
              className="rounded-3xl border border-[#1c1f1b]/10 bg-[#fffaf1]/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1f3c34] text-[#f8f4ea]">
                <item.Icon size={20} />
              </div>
              <h2 className="mt-4 text-xl font-black tracking-tight">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#1c1f1b]/75">{item.desc}</p>
            </motion.article>
          ))}
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="mt-10 grid gap-6 rounded-[28px] border border-[#1c1f1b]/10 bg-[#fffdf8] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.07)] lg:grid-cols-[0.95fr_1.05fr] lg:p-8"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3c34]/70">How it works</p>
            <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">From discovery to destination</h3>
            <p className="mt-3 text-sm leading-7 text-[#1c1f1b]/75 sm:text-base">
              Every step is designed to remove friction. Real-time location updates, curated ride options,
              and transparent trip details give you confidence before your ride even begins.
            </p>
          </div>

          <div className="space-y-4">
            {journey.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.14, duration: 0.5 }}
                className="relative rounded-2xl border border-[#1c1f1b]/10 bg-[#f8f4ea] p-4"
              >
                <div className="absolute left-4 top-4 h-7 w-7 rounded-full bg-[#1f3c34] text-[11px] font-bold text-[#f8f4ea] flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="pl-10">
                  <div className="flex items-center gap-2">
                    <step.Icon size={16} className="text-[#1f3c34]" />
                    <p className="text-base font-bold">{step.title}</p>
                  </div>
                  <p className="mt-1 text-sm text-[#1c1f1b]/75">{step.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mt-10 rounded-[28px] border border-[#1c1f1b]/10 bg-[#1c1f1b] p-7 text-[#fffdf7] shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-9"
        >
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#fffdf7]/70">Community first</p>
              <h4 className="mt-3 text-2xl font-black sm:text-3xl">Trusted by riders and partners every day</h4>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#fffdf7]/80 sm:text-base">
                We obsess over consistency. The result is a platform where riders feel safe and partners feel
                respected. That balance is what keeps the Rydex network strong city after city.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 }}
                className="rounded-2xl border border-white/15 bg-white/5 p-4"
              >
                <Users size={18} className="text-[#f7b267]" />
                <p className="mt-2 text-sm font-semibold">Verified partner ecosystem</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/15 bg-white/5 p-4"
              >
                <Star size={18} className="text-[#f7b267]" />
                <p className="mt-2 text-sm font-semibold">4.8 average rider rating</p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

export default AboutPage
//dfdsf