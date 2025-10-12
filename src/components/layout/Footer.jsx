"use client";

import { Facebook, Instagram, Dribbble } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#142318] text-white pt-16 pb-6">
      {/* Top Footer Section */}
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <h1 className="text-4xl font-extrabold tracking-wide text-white">
            FoodieFrog
          </h1>
        </div>

        {/* Office Info */}
        <div>
          <h2 className="font-semibold mb-4 text-white">Office</h2>
          <p className="text-gray-300 leading-relaxed">
            United States — <br />
            245 Market Street, San <br />
            Francisco, CA 94105
          </p>
          <p className="mt-3 text-gray-300">info@foodiefrog.com</p>
          <p className="mt-2 font-bold text-white">+1 415 555 0134</p>
        </div>

        {/* Links */}
        <div>
          <h2 className="font-semibold mb-4 text-white">Links</h2>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/" className="hover:text-green-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/restaurants"
                className="hover:text-green-400 transition"
              >
                Restaurant
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-green-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contacts"
                className="hover:text-green-400 transition"
              >
                Contacts
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="font-semibold mb-4 text-white">Get in Touch</h2>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center hover:bg-green-600 transition"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center hover:bg-green-600 transition"
            >
              <Dribbble size={16} />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center hover:bg-green-600 transition"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10"></div>

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center mt-6 text-gray-400 text-sm text-center md:text-left">
        <p>© 2025. All Rights Reserved.</p>
        <p>
          Site by{" "}
          <a href="#" className="text-green-500 hover:underline">
            AxiomThemes
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
