"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bike,
  Car,
  CheckCircle,
  LocateFixed,
  Navigation,
  Phone,
  Truck,
} from "lucide-react";
import { vehicleType } from "../../../models/vehicle.modal";
import axios from "axios";

type VehicleOption = {
  id: vehicleType;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  desc: string;
};

const VEHICLES: VehicleOption[] = [
  { id: "bike", label: "Bike", Icon: Bike, desc: "Quick & affordable" },
  { id: "auto", label: "Auto", Icon: Car, desc: "Everyday rides" },
  { id: "car", label: "Car", Icon: Car, desc: "Comfort rides" },
  { id: "loading", label: "Loading", Icon: Truck, desc: "small cargo" },
  { id: "truck", label: "Truck", Icon: Truck, desc: "Heavy transport" },
];

type Place = {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  lat: number;
  lng: number;
};

const Page = () => {
  const router = useRouter();

  const [vehicle, setVehicle] = useState<vehicleType | null>(null);
  const [mobile, setMobile] = useState("");
  const [pickUp, setPickUp] = useState("");
  const [drop, setDrop] = useState("");
  const [pickUpCountry, setPickUpCountry] = useState("");
  const [pickUpLat, setPickUpLat] = useState<number | null>(null);
  const [pickUpLon, setPickUpLon] = useState<number | null>(null);
  const [dropLat, setDropLat] = useState<number | null>(null);
  const [dropLon, setDropLon] = useState<number | null>(null);
  const [pickUpSuggestion, setPickUpSugesstion] = useState<Place[]>();
  const [dropSuggestion, setDropSuggestion] = useState<Place[]>();
  const [locating, setLocating] = useState(false);

  const stepVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  const progress = [!!vehicle, mobile.length === 10, !!pickUp, !!drop].filter(
    Boolean,
  ).length;
  const canContinue = !!vehicle && mobile.length === 10 && !!pickUp && !!drop;

  const searchAddress = async (
    q: string,
    setResults: (r: Place[]) => void,
    countryFilter?: string,
  ) => {
    try {
      if (!q || q.trim().length < 3) {
        setResults([]);
        return;
      }

      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q.trim())}&limit=8&lang=en`,
      );

      const results: Place[] = (data.features ?? []).map((f: any) => {
        const p = f.properties;

        const fullAddress = [
          p.name,
          p.housenumber,
          p.street,
          p.suburb,
          p.district,
          p.city,
          p.state,
          p.postcode,
          p.country,
        ]
          .filter(Boolean)
          .join(", ");

        return {
          id: p.osm_id || Math.random().toString(),
          name: fullAddress,
          city: p.city || "",
          state: p.state || "",
          country: p.country || "",
          countrycode: p.countrycode || "",
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        };
      });

      if (countryFilter && countryFilter.trim()) {
        const normalizedCountry = countryFilter.trim().toLowerCase();
        setResults(
          results.filter(
            (place) => (place.country || "").trim().toLowerCase() === normalizedCountry,
          ),
        );
        return;
      }

      setResults(results);
    } catch (error) {
      console.log(error);
      setResults([]);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const { data } = await axios.get(
            `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`,
          );

          if (data?.features?.length > 0) {
            const p = data.features[0].properties;

            const fullAddress = [
              p.name,
              p.housenumber,
              p.street,
              p.suburb,
              p.district,
              p.city,
              p.state,
              p.postcode,
              p.country,
            ]
              .filter(Boolean)
              .join(", ");

            setPickUpCountry(p.country);
            setPickUpLat(latitude);
            setPickUpLon(longitude);

            console.log(fullAddress);

            setPickUp(fullAddress);
            setLocating(false);
          }
        } catch (error) {
          setLocating(false);

          console.log(error);
        }
      },
      (error) => {
        setLocating(false);

        console.log(error);
      },
    );
  };

  const handleContinue = () => {
    if (!canContinue || !vehicle) return;

    const params = new URLSearchParams({
      pickup: pickUp,
      drop,
      vehicle,
      mobile,
      pickuplat: String(pickUpLat ?? ""),
      pickuplon: String(pickUpLon ?? ""),
      droplat: String(dropLat ?? ""),
      droplon: String(dropLon ?? ""),
    });

    router.push(`/user/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-4 mb-6 px-1">
          <motion.div
            whileTap={{ scale: 0.88 }}
            onClick={() => router.push("/")}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 shadow-md cursor-pointer transition-all duration-300"
          >
            <ArrowLeft className="text-gray-700 text-xl" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h1 className="text-zinc-900 text-xl font-black tracking-tight">
              Book a Ride
            </h1>
            <p className="text-zinc-400 text-xs mt-0.5">
              Fill in the details below
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {[0, 1, 2, 3].map((_, i) => (
              <motion.div
                key={i}
                initial={{ width: 8, backgroundColor: "#d1d5db" }}
                animate={{
                  width: i < progress ? 20 : 8,
                  backgroundColor: i < progress ? "#000" : "#d1d5db",
                  scale: i < progress ? 1.1 : 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="h-2 rounded-full"
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-lg overflow-visible">
          <div className="h-1 bg-zinc-900 w-full" />

          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
            className="p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                1
              </span>

              <p className="text-sm font-medium uppercase text-zinc-500 tracking-widest">
                Choose Vehicle
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {VEHICLES.map((v, i) => {
                const active = vehicle === v.id;

                return (
                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setVehicle(v.id)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300
    ${
      active
        ? "border-black bg-zinc-100 shadow-md"
        : "border-zinc-200 bg-white hover:border-zinc-400"
    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <div
                        className={`w-10 h-10 rounded-xl text-black flex items-center justify-center
        ${active ? "bg-black text-white" : "bg-zinc-100 text-zinc-700"}`}
                      >
                        <v.Icon size={20} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900">
                          {v.label}
                        </h3>
                        <p className="text-xs text-zinc-500">{v.desc}</p>
                      </div>
                    </div>

                    {active && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute top-3 right-3"
                      >
                        <CheckCircle className="w-5 h-5  text-black" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <div className="h-px bg-zinc-300" />

          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
            className="p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                2
              </span>

              <p className="text-sm font-medium uppercase text-zinc-500 tracking-widest">
                Mobile Number
              </p>
            </div>

            <div className="relative flex items-center">
              <Phone
                size={18}
                className="absolute  left-4 text-zinc-400 pointer-events-none"
              />

              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter mobile number"
                maxLength={10}
                className={`w-full px-6 h-14 pl-12 pr-12 rounded-2xl border bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-300
        ${
          mobile.length === 10
            ? "border-black bg-white"
            : "border-zinc-200 focus:border-black focus:bg-white"
        }`}
              />

              {mobile.length === 10 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-4"
                >
                  <CheckCircle
                    size={20}
                    className="text-black
          "
                  />
                </motion.div>
              )}
            </div>

            <p className="text-xs text-zinc-400 mt-2 ml-1">
              Enter a valid 10-digit mobile number
            </p>
          </motion.div>

          <div className="h-px bg-zinc-300" />

          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
            className="p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                3
              </span>

              <p className="text-sm font-medium uppercase text-zinc-500 tracking-widest">
                Route
              </p>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-visible">
              <div className="relative flex items-center gap-3 px-4 py-3.5 focus:focus-within:bg-white rounded-t-2xl transition-colors">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow" />
                  <div className="w-px h-5 bg-zinc-300 mt-1" />
                </div>
                <input 
                  onChange={(e) => {
                    setPickUp(e.target.value);
                    searchAddress(e.target.value, setPickUpSugesstion);
                  }}
                  value={pickUp}
                  type="text"
                  placeholder="Pickup locatioin"
                  className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none"
                />
                <motion.button
                  onClick={useCurrentLocation}
                  whileTap={{ scale: 0.8 }}
                  disabled={locating}
                  className="w-8 h-8 rounded-xl bg-zinc-300 transition-colors flex items-center justify-center shrink-0"
                >
                  <LocateFixed
                    size={14}
                    className={`text-zinc-700 ${locating ? "animate-spin " : ""} `}
                  />
                </motion.button>
              </div>

              <AnimatePresence>
                {pickUpSuggestion && pickUpSuggestion.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 bg-white border border-zinc-200 rounded-2xl shadow-lg z-50 overflow-hidden max-h-56 overflow-y-auto"
                  >
                    {pickUpSuggestion.map((place, index) => (
                      <motion.div
                        key={place.id || index}
                        whileHover={{ backgroundColor: "#f4f4f5" }}
                        onClick={() => {
                          setPickUp(place.name);
                          setPickUpLat(place.lat);
                          setPickUpLon(place.lng);
                          setPickUpCountry(place.country || "");
                          setPickUpSugesstion([]);
                        }}
                        className="px-4 py-3 cursor-pointer border-b last:border-b-0 border-zinc-100"
                      >
                        <p className="text-sm font-medium text-zinc-900">
                          {place.name}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-px bg-zinc-200 mx-4" />

              <div className="flex items-center gap-3 px-4 py-3.5 focus:focus-within:bg-white rounded-b-2xl transition-colors">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-zinc-400 border-2 border-white shadow" />
                </div>
                <input disabled={!pickUpCountry}
                  onChange={(e) => {
                    setDrop(e.target.value);
                    searchAddress(e.target.value, setDropSuggestion, pickUpCountry);
                  }}
                  value={drop}
                  type="text"
                  placeholder={pickUpCountry ? "Drop Location" : "select PickUp Location First"}
                  className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none"
                />
                <Navigation
                    size={14}
                    className={`text-zinc-700`}
                  />
              </div>

              <AnimatePresence>
                {dropSuggestion && dropSuggestion.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 bg-white border border-zinc-200 rounded-2xl shadow-lg z-50 overflow-hidden max-h-56 overflow-y-auto"
                  >
                    {dropSuggestion.map((place, index) => (
                      <motion.div
                        key={place.id || index}
                        whileHover={{ backgroundColor: "#f4f4f5" }}
                        onClick={() => {
                          setDrop(place.name);
                          setDropLat(place.lat);
                          setDropLon(place.lng);
                          setDropSuggestion([]);
                        }}
                        className="px-4 py-3 cursor-pointer border-b last:border-b-0 border-zinc-100"
                      >
                        <p className="text-sm font-medium text-zinc-900">
                          {place.name}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>


             
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="border-t border-zinc-200 p-4 pt-4 pb-6 bg-[radial-gradient(120%_150%_at_0%_0%,#f4f4f5_0%,transparent_55%),linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]"
          >
            <motion.button
              onClick={handleContinue}
              type="button"
              whileTap={canContinue ? { scale: 0.98 } : undefined}
              disabled={!canContinue}
              className={`h-12 w-full rounded-2xl border-0 text-[0.95rem] font-bold uppercase tracking-[0.03em] text-white transition-all duration-200 ${
                canContinue
                  ? "cursor-pointer bg-[linear-gradient(135deg,#111111_0%,#2f2f2f_100%)] shadow-[0_10px_26px_rgba(0,0,0,0.18)] hover:-translate-y-px hover:shadow-[0_14px_30px_rgba(0,0,0,0.24)]"
                  : "cursor-not-allowed bg-[linear-gradient(135deg,#111111_0%,#2f2f2f_100%)] opacity-45 shadow-none"
              }`}
            >
              Continue
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
