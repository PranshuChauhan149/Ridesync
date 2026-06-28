"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone, MessageCircle } from "lucide-react";

const ContactPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <div className="rounded-4xl border border-zinc-200 bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Contact Support
              </p>
              <h1 className="mt-2 text-4xl font-black text-zinc-950">
                Get in touch
              </h1>
            </div>
            <div className="rounded-3xl bg-zinc-950 px-5 py-4 text-white shadow-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                Support Hours
              </p>
              <p className="mt-2 text-sm font-semibold">24/7 rider support</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="flex items-center gap-3 text-zinc-900">
                <Mail size={22} />
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Email
                  </p>
                  <p className="mt-2 text-lg font-semibold">support@rydex.app</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="flex items-center gap-3 text-zinc-900">
                <Phone size={22} />
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Phone
                  </p>
                  <p className="mt-2 text-lg font-semibold">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Chat with us
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">In-app chat</p>
                  <p className="text-sm text-zinc-500">Reach support directly from the app.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Visit us
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">Delhi, India</p>
                  <p className="text-sm text-zinc-500">Available for rider queries and partner support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
