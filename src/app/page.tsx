"use client";

import { BookOpen, Compass, Coins, CalendarDays, Bell, Clock, Sun, ChevronRight, MoonStar, Sunrise, CloudSun, Sunset, Moon, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { useMosqueSettings } from "@/hooks/use-mosque-settings";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { ZakatDrawer } from "@/components/dashboard/zakat-drawer";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 26 },
  },
};

const hadithQuotes = [
  {
    text: "\"The best among you are those who have the best manners and character.\"",
    source: "HADITH OF THE DAY",
    color: "#7A4A3A",
  },
  {
    text: "\"Kindness is a mark of faith, and whoever has not kindness has not faith.\"",
    source: "HADITH OF THE DAY",
    color: "#4D6A53",
  },
  {
    text: "\"Speak good or remain silent.\"",
    source: "HADITH OF THE DAY",
    color: "#5A4070",
  },
];

const mosqueEvents = [
  {
    id: 1,
    day: "THIS SATURDAY",
    title: "Weekend Tafsir Circle: Surah Al-Kahf",
    time: "10:00 AM – 12:00 PM",
  },
  {
    id: 2,
    day: "THIS SUNDAY",
    title: "Fiqh of Prayer – Special Session",
    time: "08:30 AM – 10:00 AM",
  },
];

const getPrayerIcon = (name: string) => {
  switch (name) {
    case "Fajr": return Sunrise;
    case "Dhuhr": return Sun;
    case "Asr": return CloudSun;
    case "Maghrib": return Sunset;
    case "Isha": return Moon;
    default: return Sun;
  }
};

export default function Home() {
  const { nextPrayer, prayerTimes, loading: prayerLoading } = usePrayerTimes();
  const { settings } = useMosqueSettings();
  const { user } = useAuth();
  const [zakatOpen, setZakatOpen] = useState(false);
  const [qiyamRemaining, setQiyamRemaining] = useState<string>("...");
  const [prayersExpanded, setPrayersExpanded] = useState(false);

  useEffect(() => {
    const updateQiyam = () => {
      const now = new Date();
      const nextQiyam = new Date(now);
      nextQiyam.setHours(3, 30, 0, 0);

      if (now.getTime() > nextQiyam.getTime()) {
        nextQiyam.setDate(nextQiyam.getDate() + 1);
      }

      const diffMs = nextQiyam.getTime() - now.getTime();
      const mins = Math.floor(diffMs / 60000);
      const hrs = Math.floor(mins / 60);
      const rem = mins % 60;

      setQiyamRemaining(rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`);
    };

    updateQiyam();
    const interval = setInterval(updateQiyam, 10000);
    return () => clearInterval(interval);
  }, []);

  if (prayerLoading && !nextPrayer) {
    return <DashboardSkeleton />;
  }

  const prayerDisplayName = nextPrayer?.name === "Subuh"
    ? "Fajr"
    : nextPrayer?.name === "Zohor"
      ? "Dhuhr"
      : nextPrayer?.name ?? "Dhuhr";

  const PrayerIcon = getPrayerIcon(prayerDisplayName);

  const prayerTime = prayerTimes
    ? (prayerTime_lookup(prayerDisplayName, prayerTimes))
    : "1:15 PM";

  const remainingFormatted = nextPrayer?.remainingFormatted
    ? "In " + nextPrayer.remainingFormatted.replace(/^0h\s*/, "").replace("h", "h ").replace("m", "m")
    : "";

  // Short "In X mins" label
  const remainingShort = nextPrayer?.remainingMs
    ? (() => {
      const mins = Math.floor(nextPrayer.remainingMs / 60000);
      if (mins < 60) return `In ${mins} mins`;
      const hrs = Math.floor(mins / 60);
      const rem = mins % 60;
      return rem > 0 ? `In ${hrs}h ${rem}m` : `In ${hrs}h`;
    })()
    : null;

  const quickTiles = [
    { title: "Quran", icon: BookOpen, color: "#4D6A53", href: undefined, action: () => { } },
    { title: "Mosque", icon: MoonStar, color: "#4D6A53", href: undefined, action: () => { } },
    { title: "Zakat", icon: Coins, color: "#4D6A53", href: undefined, action: () => setZakatOpen(true) },
  ];

  const allPrayers = [
    { name: "Fajr", time: prayerTimes ? prayerTime_lookup("Fajr", prayerTimes) : "5:12 AM" },
    { name: "Sunrise", time: prayerTimes ? prayerTime_lookup("Sunrise", prayerTimes) : "6:30 AM" },
    { name: "Dhuhr", time: prayerTimes ? prayerTime_lookup("Dhuhr", prayerTimes) : "1:15 PM" },
    { name: "Asr", time: prayerTimes ? prayerTime_lookup("Asr", prayerTimes) : "4:30 PM" },
    { name: "Maghrib", time: prayerTimes ? prayerTime_lookup("Maghrib", prayerTimes) : "7:30 PM" },
    { name: "Isha", time: prayerTimes ? prayerTime_lookup("Isha", prayerTimes) : "8:45 PM" },
  ];

  return (
    <motion.main
      className="flex flex-col pb-28 overflow-x-hidden bg-[#F4F4F6] min-h-screen"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* ── HERO HEADER ── */}
      <motion.div variants={item} className="relative w-full h-[260px] overflow-hidden">
        {/* Mosque background image */}
        <img
          src="/masjid4.jpeg"
          alt="Mosque"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/10" />

        {/* Header content */}
        <div className="relative z-10 flex justify-between items-start px-5 pt-12">
          <div>
            <p className="text-white/75 text-[12px] font-semibold tracking-wide">
              Assalamu'alaikum
            </p>
            <h1 className="text-white text-[1.75rem] font-bold font-serif leading-tight tracking-tight">
              {user?.displayName?.split(" ")[0] ?? "Ahmad Ibrahim"}
            </h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mt-1">
            <Bell size={18} className="text-white" strokeWidth={2} />
          </button>
        </div>
      </motion.div>

      {/* ── NEXT PRAYER & QIYAMULLAIL CARDS ── */}
      <motion.div variants={item} className="-mt-14 z-20 relative w-full">
        <div className="flex gap-4 overflow-x-auto px-5 pb-4 pt-1 scrollbar-none snap-x snap-mandatory items-start">
          {/* Next Prayer Card */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.1)] shrink-0 snap-center w-[calc(100vw-2.5rem)] overflow-hidden transition-all duration-300">
            <div
              className="p-4 flex items-center gap-4 cursor-pointer"
              onClick={() => setPrayersExpanded(!prayersExpanded)}
            >
              {/* Prayer icon bubble */}
              <div className="h-14 w-14 rounded-2xl bg-[#4D6A53] flex items-center justify-center shrink-0 shadow-md">
                <PrayerIcon size={26} className="text-white" strokeWidth={2} />
              </div>

              {/* Prayer info */}
              <div className="flex-1">
                <p className="text-[10px] font-bold text-[#9AA5AB] uppercase tracking-[0.12em] mb-0.5">
                  Next Prayer
                </p>
                <h2 className="text-[1.8rem] font-bold text-[#1A2B22] font-serif leading-none flex items-center gap-2">
                  {prayerDisplayName}
                  <ChevronDown
                    size={20}
                    className={`text-[#9AA5AB] transition-transform duration-300 ${prayersExpanded ? "rotate-180" : ""}`}
                  />
                </h2>
                <p className="text-[13px] text-[#9AA5AB] font-semibold mt-0.5">
                  {prayerTime}
                </p>
              </div>

              {/* Countdown pill */}
              <div className="flex flex-col items-end justify-between h-14">
                {/* Online indicator dot */}
                <div className="w-2 h-2 rounded-full bg-[#4D6A53] mb-1 mr-1" />

                {remainingShort && (
                  <div className="bg-[#F0F5F1] rounded-xl px-3 py-1.5 text-center shrink-0">
                    <p className="text-[#4D6A53] font-bold text-[13px] leading-tight">
                      {remainingShort.replace("In ", "")}
                    </p>
                    <p className="text-[#4D6A53]/60 text-[9px] font-bold uppercase tracking-wide">
                      mins
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Prayer Times List */}
            <motion.div
              initial={false}
              animate={{ height: prayersExpanded ? "auto" : 0, opacity: prayersExpanded ? 1 : 0 }}
              className="overflow-hidden bg-[#F8F9F8]"
            >
              <div className="px-5 pt-2 pb-5 space-y-3 border-t border-[#E8ECE9]">
                {allPrayers.map((prayer, i) => {
                  const Icon = getPrayerIcon(prayer.name);
                  const isNext = prayer.name === prayerDisplayName;
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isNext ? 'bg-[#4D6A53] text-white' : 'bg-[#E8ECE9] text-[#9AA5AB]'}`}>
                          <Icon size={14} strokeWidth={isNext ? 2.5 : 2} />
                        </div>
                        <span className={`text-[15px] font-semibold ${isNext ? 'text-[#1A2B22]' : 'text-[#5A655F]'}`}>
                          {prayer.name}
                        </span>
                      </div>
                      <span className={`text-[15px] ${isNext ? 'text-[#4D6A53] font-bold' : 'text-[#9AA5AB] font-semibold'}`}>
                        {prayer.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Qiyamullail Card */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.1)] shrink-0 snap-center w-[calc(100vw-2.5rem)] h-[fit-content]">
            <div className="p-4 flex items-center gap-4">
              {/* Moon icon bubble */}
              <div className="h-14 w-14 rounded-2xl bg-[#1A2B22] flex items-center justify-center shrink-0 shadow-md">
                <MoonStar size={26} className="text-white" strokeWidth={2} />
              </div>

              {/* Event info */}
              <div className="flex-1">
                <p className="text-[10px] font-bold text-[#9AA5AB] uppercase tracking-[0.12em] mb-0.5">
                  Ramadhan Special
                </p>
                <h2 className="text-[1.8rem] font-bold text-[#1A2B22] font-serif leading-none">
                  Qiyamullail
                </h2>
                <p className="text-[13px] text-[#9AA5AB] font-semibold mt-0.5">
                  3:30 AM
                </p>
              </div>

              {/* Countdown pill */}
              <div className="flex flex-col items-end justify-between h-14">
                {/* Dark indicator dot */}
                <div className="w-2 h-2 rounded-full bg-[#1A2B22] mb-1 mr-1" />

                <div className="bg-[#F0F5F1] rounded-xl px-3 py-1.5 text-center shrink-0">
                  <p className="text-[#1A2B22] font-bold text-[13px] leading-tight">
                    {qiyamRemaining}
                  </p>
                  <p className="text-[#1A2B22]/60 text-[9px] font-bold uppercase tracking-wide">
                    mins
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── QUICK TILES ROW ── */}
      <motion.div variants={item} className="mx-5 mt-2">
        <div className="flex justify-center gap-8">
          {quickTiles.map((tile) => (
            <button
              key={tile.title}
              onClick={tile.action}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="h-[3.75rem] w-[3.75rem] rounded-2xl bg-[#EEE9DF] flex items-center justify-center shadow-sm group-hover:bg-[#E4DDD0] transition-colors border border-white/60">
                <tile.icon size={26} className="text-[#4D6A53]" strokeWidth={2} />
              </div>
              <span className="text-[11px] font-bold text-[#5A413A] tracking-wide">
                {tile.title}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── DAILY INSPIRATION ── */}
      <motion.div variants={item} className="mx-5 mt-8">
        <div className="flex items-center justify-between mb-0">
          <h2 className="text-[1.25rem] font-bold text-[#1A2420] font-serif">
            Daily Inspiration
          </h2>
          <button className="text-[12px] font-bold text-[#9AA5AB] uppercase tracking-wide">
            VIEW ALL
          </button>
        </div>

        {/* Hadith card row - horizontally scrollable */}
        <div className="flex gap-4 overflow-x-auto py-2 scrollbar-none snap-x snap-mandatory">
          {hadithQuotes.map((quote, i) => (
            <div
              key={i}
              className="shrink-0 snap-start w-[75%]"
              style={{ color: quote.color }}
            >
              {/* Arch-shaped card: large top radius for the arch look */}
              <div
                className="relative flex flex-col items-center px-5 pt-6 pb-6"
                style={{
                  backgroundColor: quote.color,
                  borderRadius: "50% 50% 1.5rem 1.5rem / 30% 30% 1.5rem 1.5rem",
                  minHeight: "210px",
                }}
              >
                {/* Quotation bubble */}
                <div className="w-10 h-10 shrink-0 rounded-full bg-[rgba(255,255,255,0.18)] border border-white/20 flex items-center justify-center shadow-sm mb-2">
                  <span className="text-white text-[22px] font-serif font-bold leading-none mt-1">"</span>
                </div>

                {/* Quote text */}
                <p className="text-white text-[14px] italic font-semibold leading-relaxed text-center mt-2 flex-1">
                  {quote.text}
                </p>

                {/* Source label */}
                <p className="text-white/50 text-[10px] font-bold tracking-[0.18em] uppercase mt-5 text-center">
                  {quote.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── MOSQUE EVENTS ── */}
      <motion.div variants={item} className="mx-5 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[1.25rem] font-bold text-[#1A2420] font-serif">
            Mosque Events
          </h2>
          <Link href="/calendar" className="text-[12px] font-bold text-[#9AA5AB] uppercase tracking-wide">
            VIEW ALL
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {mosqueEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-[1.25rem] p-4 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
            >
              {/* Thumbnail placeholder */}
              <div className="h-14 w-14 rounded-xl bg-[#F0EDE7] flex items-center justify-center shrink-0 border border-[#E8E3DB]">
                <BookOpen size={20} className="text-[#9AA5AB]" strokeWidth={1.5} />
              </div>

              {/* Event info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#9AA5AB] uppercase tracking-[0.1em] mb-0.5">
                  {event.day}
                </p>
                <h3 className="text-[14px] font-bold text-[#1A2420] leading-snug line-clamp-2">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1 mt-1.5">
                  <Clock size={11} className="text-[#9AA5AB]" strokeWidth={2} />
                  <span className="text-[11px] text-[#9AA5AB] font-semibold">
                    {event.time}
                  </span>
                </div>
              </div>

              <ChevronRight size={16} className="text-[#C8C4BE] shrink-0" strokeWidth={2.5} />
            </div>
          ))}
        </div>
      </motion.div>

      <ZakatDrawer open={zakatOpen} onOpenChange={setZakatOpen} />
    </motion.main>
  );
}

// Helper to look up prayer time from timings object
function prayerTime_lookup(prayerName: string, prayerTimes: any): string {
  const map: Record<string, string> = {
    Fajr: prayerTimes.Fajr ?? "5:12 AM",
    Sunrise: prayerTimes.Sunrise ?? "6:30 AM",
    Dhuhr: prayerTimes.Dhuhr ?? "1:15 PM",
    Asr: prayerTimes.Asr ?? "4:30 PM",
    Maghrib: prayerTimes.Maghrib ?? "7:30 PM",
    Isha: prayerTimes.Isha ?? "8:45 PM",
  };
  const raw = map[prayerName] ?? "";
  return raw.split(" ")[0] + " " + (raw.split(" ")[1] ?? "");
}
