"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Navbar hide হবে যদি path /restaurant/dashboard দিয়ে শুরু হয়
  if (pathname.startsWith("/restaurant/dashboard")) {
    return null;
  }

  return <Navbar />;
}
