'use client';

import { setUserData } from "../redux/userSlice";
import { motion } from "motion/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bike, Car, ChevronRight, Menu, Truck, X } from "lucide-react";
import type { AppDispatch, RootState } from "../redux/store";
import AuthModal from "./AuthModal";
import axios from "axios";

const navItems = ["Home", "Bookings", "About", "Contact"];

const Nav = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();
  const [pendingCount,setPendingCount] = useState(0);
  
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const handleLogOut = async () => {
    await signOut({ redirect: false });
    dispatch(setUserData(null));
    setIsOpen(false);
    setOpenProfile(false);
  };

  const initial = userData?.name?.charAt(0)?.toUpperCase() ?? "U";

  const fetchCount = async () => {
  try {
    const { data } = await axios.post(
      "/api/partner/bookings/pending-requests-count"
    );
console.log(data);

    if (data.success) {
      setPendingCount(data.count);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  if (userData?.role === "partner") {
    fetchCount();
  }
}, [userData]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-3 left-1/2 z-50 w-[95%] max-w-6xl -translate-x-1/2 bg-[#00000B]/90 text-white backdrop-blur-lg shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-300 ${
          isOpen ? "rounded-3xl" : "rounded-full"
        }`}
      >
        <div className="relative flex items-center justify-between px-4 py-3 md:px-8">
          <Link href="/" className="shrink-0" aria-label="Go to homepage">
            <Image src="/logo.jpeg" alt="logo" width={44} height={44} priority />
          </Link>

         <div className="hidden items-center gap-6 lg:flex">
  {userData?.role === "partner" ? (
    <>
      <Link
        href="/"
        className={`text-sm transition ${
          pathname === "/" ? "text-yellow-400" : "text-white hover:text-yellow-300"
        }`}
      >
        Home
      </Link>

      <Link
        href="/partner/pending-requests"
        className={`inline-flex items-center gap-1 text-sm transition ${
          pathname === "/partner/pending-requests"
            ? "text-yellow-400"
            : "text-white hover:text-yellow-300"
        }`}
      >
        <span>Pending Requests</span>
        <span className="inline-flex min-w-5.5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold leading-5 text-white">
          {pendingCount}
        </span>
      </Link>
      <Link
        href="/partner/bookings"
        className={`text-sm transition ${
          pathname === "/partner/bookings"
            ? "text-yellow-400"
            : "text-white hover:text-yellow-300"
        }`}
      >
        Bookings
      </Link>

      <Link
        href="/partner/active-ride"
        className={`text-sm transition ${
          pathname === "/partner/active-ride"
            ? "text-yellow-400"
            : "text-white hover:text-yellow-300"
        }`}
      >
        Active Ride
      </Link>
    </>
  ) : (
    navItems.map((item) => {
      const href = item === "Home" ? "/" : `/user/${item.toLowerCase()}`;
      const isActive = pathname === href;

      return (
        <Link
          key={item}
          href={href}
          className={`text-sm transition ${
            isActive
              ? "text-yellow-400"
              : "text-white hover:text-yellow-300"
          }`}
        >
          {item}
        </Link>
      );
    })
  )}
</div>
          <div className="flex items-center gap-3">
            {!userData && (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="hidden rounded-full bg-white px-4 py-1.5 text-sm text-black transition hover:bg-yellow-400 lg:block"
              >
                Login
              </button>
            )}

            {userData && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenProfile((prev) => !prev)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black"
                >
                  <span className="font-semibold">{initial}</span>
                </button>

                {openProfile && (
                  <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-gray-200 bg-white py-2 text-black shadow-xl">
                    <div className="border-b px-4 py-2">
                      <p className="text-sm font-semibold text-gray-800">{userData.name}</p>
                      <p className="text-xs capitalize text-gray-500">{userData.role}</p>
                    </div>

                    {userData.role !== "partner" && (
                      <button onClick={()=>router.push("/partner/onboarding/vehicle")}
                        type="button"
                        className="mx-2 my-2 flex w-[calc(100%-1rem)] items-center justify-between rounded-lg px-2 py-2 text-left transition hover:bg-gray-100"
                      >
                        <span className="flex items-center gap-2 text-gray-700">
                          <Truck size={16} />
                          <Bike size={16} />
                          <Car size={16} />
                          <span className="text-sm font-medium">Become a Partner</span>
                        </span>
                        <ChevronRight size={16} className="text-gray-500" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleLogOut}
                      className="mx-2 flex w-[calc(100%-1rem)] items-center rounded-md px-3 py-2 text-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md p-1 lg:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="cursor-pointer" /> : <Menu className="cursor-pointer" />}
            </button>
          </div>

          {isOpen && (
            <div className="absolute left-0 top-16 flex w-full flex-col gap-5 rounded-b-3xl bg-[#00000B]/95 p-5 shadow-2xl lg:hidden">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => {
                  const href = item === "Home" ? "/user" : `/${item.toLowerCase()}`;
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={item}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`rounded-xl py-2 text-center text-base font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-yellow-400 text-black"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>

              {!userData ? (
                <div className="flex w-full gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full rounded-full border border-white px-5 py-2 text-white transition-all duration-200 hover:bg-white hover:text-black"
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full rounded-full bg-white px-5 py-2 font-medium text-black transition-all duration-200 hover:bg-yellow-400"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogOut}
                  className="w-full rounded-full border border-red-400 px-5 py-2 font-medium text-red-300 transition-all duration-200 hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </motion.nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Nav;