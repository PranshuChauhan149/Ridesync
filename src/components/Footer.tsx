'use client';

import Link from "next/link";
import { Mail, Phone } from "lucide-react";

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Bookings", href: "/bookings" },
  { label: "Contact", href: "/contact" },
];

const serviceItems = [
  "Car Rentals",
  "Bike Rentals",
  "Truck Booking",
  "Corporate Travel",
];

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-zinc-800 bg-[#00000B] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">RYDEX</p>
            <h2 className="text-2xl font-bold leading-tight">Book Smart, Ride Better.</h2>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Premium vehicle booking platform for city rides, weekend trips,
              and business travel.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-300">Company</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-yellow-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-300">Services</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              {serviceItems.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-300">Contact</h3>
            <div className="space-y-3 text-sm text-zinc-400">
              <p className="flex items-center gap-2">
                <Mail size={16} /> support@rydex.com
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} /> +91 98765 43210
              </p>
            </div>

            <div className="mt-5 flex items-center gap-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="transition hover:text-yellow-400">
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="transition hover:text-yellow-400">
                Instagram
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="transition hover:text-yellow-400">
                X
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-zinc-800 pt-6 text-sm text-zinc-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} RYDEX. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition hover:text-yellow-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-yellow-400">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;