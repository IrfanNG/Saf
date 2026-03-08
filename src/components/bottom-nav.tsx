"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Calendar, Users, User, HandCoins } from "lucide-react";
import { SafLogo } from "@/components/saf-logo";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const tabs = [
  { name: "Home", href: "/", icon: (props: any) => <SafLogo size={props.size || 22} className={props.className} /> },
  { name: "Event", href: "/calendar", icon: Calendar },
  { name: "Sedekah", href: "/sedekah", icon: HandCoins },
  { name: "Community", href: "/community", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const [clickedTab, setClickedTab] = useState<string | null>(null);

  // Clear click state after pop animation completes
  useEffect(() => {
    if (clickedTab) {
      const timer = setTimeout(() => setClickedTab(null), 500);
      return () => clearTimeout(timer);
    }
  }, [clickedTab]);

  const isDetailsPage = pathname.startsWith("/community/") && pathname !== "/community";
  // Quran pages (/quran and /quran/[id]) are intentionally NOT hidden here to allow easy navigation back to home.
  const hiddenRoutes = ["/profile/personal-info", "/profile/theme", "/login", "/register", "/pustaka-doa", "/mosque"];

  if (hiddenRoutes.includes(pathname) || isDetailsPage) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe pointer-events-none drop-shadow-lg flex justify-center">
      <div className="flex h-[5.5rem] w-full max-w-md items-start pt-3 justify-around bg-white px-6 rounded-t-3xl border-t border-black/5 pointer-events-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const isClicked = clickedTab === tab.name;
          const Icon = tab.icon;
          const isCenter = tab.name === "Sedekah";

          if (isCenter) {
            return (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setClickedTab(tab.name)}
                className="relative flex flex-col items-center justify-center -mt-6 z-20 group"
              >
                {/* Elevated Circle Button */}
                <motion.div
                  className="w-[3.75rem] h-[3.75rem] rounded-full bg-[#415D43] flex items-center justify-center text-white shadow-[0_8px_25px_rgba(65,93,67,0.4)] border-4 border-white group-hover:bg-[#324834] transition-colors"
                  animate={isClicked ? { scale: [1, 0.85, 1.15, 1] } : { scale: 1 }}
                  transition={isClicked ? { duration: 0.4 } : { duration: 0.2 }}
                >
                  <Icon className="h-[24px] w-[24px]" strokeWidth={2.5} />
                </motion.div>

                {/* Label */}
                <span className="text-[10px] font-bold text-[#4D6A53] mt-1.5 tracking-wide">
                  {tab.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.name}
              href={tab.href}
              onClick={() => setClickedTab(tab.name)}
              className={cn(
                "relative flex flex-col items-center justify-center w-[4rem] h-14 gap-1",
                isActive ? "text-[#4D6A53]" : "text-[#9AA2B1] hover:text-[#4D6A53]/80"
              )}
            >
              <motion.div
                className="relative z-10 flex items-center justify-center mt-1"
                animate={isClicked ? { scale: [1, 0.8, 1.2, 1] } : { scale: 1 }}
                transition={isClicked ? { duration: 0.4 } : { duration: 0.2 }}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>

              <span className={cn("relative z-10 text-[10px] tracking-wide", isActive ? "font-bold" : "font-medium")}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
