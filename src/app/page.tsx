"use client";

import { BookOpen, MapPin, Compass, Banknote, CalendarDays, Bell, Clock, Sun, ChevronRight, MoonStar, Sunrise, CloudSun, Sunset, Moon, ChevronDown, BookMarked, Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { useMosqueSettings } from "@/hooks/use-mosque-settings";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { ZakatDrawer } from "@/components/dashboard/zakat-drawer";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailyHadiths } from "@/hooks/use-daily-hadiths";
import { useUpcomingActivities } from "@/hooks/use-activities";
import { toast } from "sonner";


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 },
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

const formatDateLabel = (dateISO: string) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  if (dateISO === today) return "TODAY";
  if (dateISO === tomorrow) return "TOMORROW";

  const d = new Date(dateISO);
  return d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
};

export default function Home() {
  const router = useRouter();
  const { nextPrayer, prayerTimes, loading: prayerLoading } = usePrayerTimes();
  const { settings } = useMosqueSettings();
  const { user } = useAuth();
  const [zakatOpen, setZakatOpen] = useState(false);
  const [qiyamRemaining, setQiyamRemaining] = useState<string>("...");
  const [prayersExpanded, setPrayersExpanded] = useState(false);
  const { hadiths, loading: hadithsLoading, error: hadithsError } = useDailyHadiths();
  const { activities: upcomingEvents, loading: eventsLoading } = useUpcomingActivities(2);
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    const updateQiyam = () => {
      const now = new Date();
      const nextQiyam = new Date(now);

      // Use time from admin settings, fallback to 03:30
      const [qH, qM] = (settings?.qiyamTime || "03:30").split(":").map(Number);
      nextQiyam.setHours(qH, qM, 0, 0);

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
  }, [settings?.qiyamTime]);

  const copyReferral = () => {
    navigator.clipboard.writeText("kd.dev/join?ref=https://krackeddevs.com/");
    setCopied(true);
    toast.success("Referral Link Copied!", {
      icon: <Check size={18} className="text-emerald-500" />
    });
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };


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
    { title: "Quran", icon: BookOpen, color: "#4D6A53", href: "/quran", action: () => router.push("/quran") },
    { title: "Mosque", icon: MoonStar, color: "#4D6A53", href: "/mosque", action: () => router.push("/mosque") },
    { title: "Zakat", icon: Banknote, color: "#4D6A53", href: undefined, action: () => setZakatOpen(true) },
    { title: "Doa", icon: BookMarked, color: "#4D6A53", href: "/pustaka-doa", action: () => router.push("/pustaka-doa") },
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
      <motion.div variants={item} className="relative w-full h-[280px] overflow-hidden">
        {/* Mosque background image */}
        <img
          src="/masjid4.jpeg"
          alt="Mosque"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlay - more sophisticated dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#F4F4F6]" />

        {/* Top subtle glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-900/20 to-transparent" />

        {/* Header content */}
        <div className="relative z-10 flex justify-between items-start px-5 pt-12">
          <div>
            <p className="text-white/75 text-[12px] font-semibold tracking-wide">
              Assalamu'alaikum
            </p>
            <h1 className="text-white text-[1.75rem] font-bold font-serif leading-tight tracking-tight">
              {user?.displayName?.split(" ")[0] ?? "Ahmad Ibrahim"}
            </h1>
            <div className="flex items-center gap-1 mt-1 text-white/75">
              <MapPin size={10} strokeWidth={2.5} className="fill-white/10" />
              <span className="text-[9px] font-bold tracking-[0.08em] uppercase">Masjid Al-Azim, Melaka</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── NEXT PRAYER & QIYAMULLAIL CARDS ── */}
      <motion.div variants={item} className="-mt-14 z-20 relative w-full">
        <div className="flex gap-4 overflow-x-auto px-5 pb-4 pt-1 scrollbar-none snap-x snap-mandatory items-start">
          {/* Next Prayer Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-[0_12px_48px_rgba(0,0,0,0.08)] shrink-0 snap-center w-[calc(100vw-3rem)] overflow-hidden transition-all duration-300 border border-white/50">
            <div
              className="p-5 flex items-center gap-5 cursor-pointer active:bg-black/5 transition-colors"
              onClick={() => setPrayersExpanded(!prayersExpanded)}
            >
              {/* Prayer icon bubble with modern gradient */}
              <div className="h-16 w-16 rounded-[1.25rem] bg-gradient-to-br from-[#4D6A53] to-[#3A503F] flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <PrayerIcon size={30} className="text-white relative z-10" strokeWidth={1.5} />
              </div>

              {/* Prayer info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-bold text-[#9AA5AB] uppercase tracking-[0.2em]">
                    Next Prayer
                  </p>
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h2 className="text-[2rem] font-bold text-[#1A2B22] font-sans leading-none flex items-center gap-2 tracking-tight">
                  {prayerDisplayName}
                  <ChevronDown
                    size={22}
                    className={`text-[#9AA5AB]/50 transition-transform duration-500 ${prayersExpanded ? "rotate-180" : ""}`}
                  />
                </h2>
                <div className="flex items-center gap-2 mt-1.5 opacity-60">
                  <Clock size={12} className="text-[#475569]" />
                  <p className="text-[14px] text-[#475569] font-medium font-sans">
                    {prayerTime}
                  </p>
                </div>
              </div>

              {/* Countdown pill - more refined */}
              <div className="flex flex-col items-end gap-1">
                {remainingShort && (
                  <div className="bg-[#4D6A53]/10 rounded-[1rem] px-4 py-2 text-center shrink-0 border border-[#4D6A53]/10">
                    <p className="text-[#4D6A53] font-bold text-[15px] leading-none mb-0.5 font-sans">
                      {remainingShort.replace("In ", "").split(" ")[0]}
                    </p>
                    <p className="text-[#4D6A53]/40 text-[7px] font-medium uppercase tracking-widest font-sans">
                      {remainingShort.replace("In ", "").split(" ")[1] ?? "mins"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Prayer Times List */}
            <motion.div
              initial={false}
              animate={{ height: prayersExpanded ? "auto" : 0, opacity: prayersExpanded ? 1 : 0 }}
              className="overflow-hidden bg-[#FBF9F4]"
            >
              <div className="px-6 pt-2 pb-6 space-y-4 border-t border-[#E8E3D8]">
                {allPrayers.map((prayer, i) => {
                  const Icon = getPrayerIcon(prayer.name);
                  const isNext = prayer.name === prayerDisplayName;
                  return (
                    <div key={i} className={`flex items-center justify-between p-2 rounded-xl transition-colors ${isNext ? 'bg-emerald-50' : 'transparent'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${isNext ? 'bg-[#4D6A53] text-white' : 'bg-[#F0EDE7] text-[#9AA5AB]'}`}>
                          <Icon size={16} strokeWidth={isNext ? 2.5 : 2} />
                        </div>
                        <span className={`text-[15px] font-semibold ${isNext ? 'text-[#1A2B22]' : 'text-[#8A8471]'}`}>
                          {prayer.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isNext && <span className="text-[10px] font-bold text-[#4D6A53] uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-emerald-100 shadow-sm">NOW</span>}
                        <span className={`text-[15px] ${isNext ? 'text-[#4D6A53] font-bold font-sans' : 'text-slate-400 font-medium font-sans'}`}>
                          {prayer.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Qiyamullail Card */}
          <div className="bg-[#1A2B22] rounded-[2rem] shadow-[0_12px_48px_rgba(0,0,0,0.15)] shrink-0 snap-center w-[calc(100vw-3rem)] overflow-hidden transition-all duration-300 border border-white/5 h-[fit-content]">
            <div className="p-5 flex items-center gap-5">
              {/* Moon icon bubble with dark glow */}
              <div className="h-16 w-16 rounded-[1.25rem] bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/5 opacity-50 group-hover:opacity-100 transition-opacity" />
                <MoonStar size={30} className="text-white relative z-10" strokeWidth={1.5} />
              </div>

              {/* Event info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-[0.2em]">
                    Ramadhan Special
                  </p>
                </div>
                <h2 className="text-[2rem] font-bold text-white font-sans leading-none tracking-tight">
                  Qiyamullail
                </h2>
                <div className="flex items-center gap-2 mt-1.5 opacity-40">
                  <Clock size={12} className="text-white" />
                  <p className="text-[14px] text-white font-medium font-sans">
                    {settings?.qiyamTime ? (() => {
                      const [h, m] = settings.qiyamTime.split(":");
                      const hr = parseInt(h);
                      const ampm = hr >= 12 ? "PM" : "AM";
                      const displayHr = hr % 12 || 12;
                      return `${displayHr}:${m} ${ampm}`;
                    })() : "3:30 AM"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="bg-white/5 rounded-[1rem] px-4 py-2 text-center shrink-0 border border-white/5">
                  <p className="text-white/70 font-bold text-[15px] leading-none mb-0.5 font-sans">
                    {qiyamRemaining.split(" ")[0]}
                  </p>
                  <p className="text-white/20 text-[7px] font-medium uppercase tracking-widest font-sans">
                    {qiyamRemaining.split(" ")[1] ?? "hrs"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── QUICK TILES ROW ── */}
      <motion.div variants={item} className="mx-6 mt-6">
        <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm p-5 rounded-[2rem] border border-white/80 shadow-sm">
          {quickTiles.map((tile) => (
            <button
              key={tile.title}
              onClick={tile.action}
              className="flex flex-col items-center gap-2.5 active:scale-90 transition-transform group"
            >
              <div className="h-14 w-14 rounded-2xl bg-[#F0EDE7] flex items-center justify-center shadow-sm group-hover:bg-[#E8E3D8] transition-colors border border-white/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent opacity-50" />
                <tile.icon size={24} className="text-[#4D6A53] relative z-10" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-[0.05em] uppercase">
                {tile.title}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── DAILY INSPIRATION ── */}
      <motion.div variants={item} className="mt-8">
        <div className="flex items-center justify-between mb-0 px-5">
          <h2 className="text-[1.25rem] font-bold text-[#1A2420] font-serif">
            Daily Inspiration
          </h2>
          <button className="text-[12px] font-bold text-[#9AA5AB] uppercase tracking-wide">
          </button>
        </div>

        {/* Hadith card row - horizontally scrollable */}
        <div className="flex gap-4 overflow-x-auto py-2 px-5 scroll-px-5 scrollbar-none snap-x snap-mandatory">
          {hadithsLoading ? (
            // Skeleton loading state
            Array.from({ length: 3 }).map((_, i) => (
              <div key={`skel-${i}`} className="shrink-0 snap-center w-[280px]">
                <Skeleton
                  className="w-full h-[240px]"
                  style={{
                    borderRadius: "140px 140px 2rem 2rem",
                  }}
                />
              </div>
            ))
          ) : hadithsError || !hadiths ? (
            // Error state
            <div className="w-full bg-red-50 text-red-800 p-6 rounded-[2rem] text-sm border border-red-100 flex items-center justify-center min-h-[150px]">
              Failed to load Daily Inspiration.
            </div>
          ) : (
            // Data state
            hadiths.map((quote) => (
              <div
                key={quote.id}
                className="shrink-0 snap-center w-[280px]"
              >
                {/* Arch-shaped card: Mihrab-inspired design */}
                <div
                  className="relative flex flex-col items-center px-6 pt-10 pb-8 shadow-xl"
                  style={{
                    backgroundColor: quote.color,
                    borderRadius: "140px 140px 2.5rem 2.5rem / 120px 120px 2.5rem 2.5rem",
                    minHeight: "260px",
                    boxShadow: `0 20px 40px -15px ${quote.color}40`,
                  }}
                >

                  {/* Quotation bubble */}
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shadow-lg mb-4 backdrop-blur-sm">
                    <span className="text-white text-[28px] font-sans font-bold leading-none mt-1">"</span>
                  </div>

                  {/* Quote text */}
                  <p className="text-white text-[15px] font-medium font-sans italic leading-relaxed text-center px-1 flex-1 line-clamp-5 opacity-90">
                    {quote.text}
                  </p>

                  {/* Source label */}
                  <div className="mt-6 flex flex-col items-center gap-1">
                    <div className="h-[1px] w-8 bg-white/30" />
                    <p className="text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase text-center mt-1 font-sans">
                      {quote.source}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <motion.div variants={item} className="mt-12 px-6">
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-1">
            <h2 className="text-[0.75rem] font-medium text-slate-500 font-sans tracking-[0.15em] uppercase">
              Mosque Events
            </h2>
            <p className="text-[10px] text-slate-400/60 font-sans italic uppercase tracking-[0.05em]">
              Community Gatherings
            </p>
          </div>
          <Link href="/calendar" className="text-[9px] font-medium text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors">
            VIEW ALL
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {eventsLoading ? (
            [1, 2].map(i => (
              <div key={i} className="h-24 bg-white/60 animate-pulse rounded-[1.25rem] px-4" />
            ))
          ) : upcomingEvents.length === 0 ? (
            <div className="bg-white/40 border border-dashed border-slate-200 rounded-[1.25rem] p-8 text-center">
              <p className="text-[13px] text-slate-400 font-medium">No upcoming events scheduled.</p>
            </div>
          ) : (
            upcomingEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => router.push(`/calendar?date=${event.dateISO}`)}
                className="bg-white rounded-[1.25rem] p-4 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)] cursor-pointer active:scale-[0.98] transition-all"
              >
                {/* Thumbnail */}
                <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-[#E8E3DB] bg-slate-100">
                  {event.image ? (
                    <img src={event.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F0EDE7]">
                      <BookOpen size={20} className="text-[#9AA5AB]" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Event info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-[#CDA066] uppercase tracking-[0.1em] mb-0.5">
                    {formatDateLabel(event.dateISO)}
                  </p>
                  <h3 className="text-[14px] font-bold text-[#1A2420] leading-snug line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Clock size={11} className="text-[#9AA5AB]" strokeWidth={2} />
                    <span className="text-[11px] text-[#9AA5AB] font-semibold">
                      {event.timeSlot}
                    </span>
                  </div>
                </div>

                <ChevronRight size={16} className="text-[#C8C4BE] shrink-0" strokeWidth={2.5} />
              </div>
            ))
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 25 }}
        className="mx-5 mb-8 mt-12 overflow-hidden bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] border-t-[3px] border-[#22C55E]/40"
      >
        <div className="p-6 flex flex-col gap-6">
          {/* Header Row: Partner & Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-100/50 flex items-center justify-center">
                <img src="/krackeddevs.png" alt="KrackedDevs" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[17px] font-bold text-[#1A2420] font-sans">KrackedDevs</h3>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100/50 w-fit">
                  <ShieldCheck size={11} strokeWidth={2.5} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Verified Partner</span>
                </div>
              </div>
            </div>
          </div>

          {/* Join Content Row */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest px-1">Support the Devs</p>
              <h4 className="text-[20px] font-bold text-[#1A2420] font-sans leading-tight">Join our tech ecosystem & support the community.</h4>
            </div>

            {/* Referral Link UI Card */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-3 group/ref overflow-hidden relative">
              <div className="flex flex-col truncate">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Your Referral Link</p>
                <code className="text-[13px] font-mono text-[#22C55E] font-bold truncate">kd.dev/join?ref=https://krackeddevs.com/</code>
              </div>
              <button
                onClick={copyReferral}
                className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${copied ? "bg-emerald-500 text-white" : "bg-white border border-slate-100 text-slate-500 hover:text-[#22C55E] shadow-sm"} shrink-0`}
              >
                {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} strokeWidth={2.5} />}
              </button>
            </div>

            <Link
              href="https://krackeddevs.com/"
              target="_blank"
              className="relative w-full overflow-hidden"
            >
              <motion.button
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 10 }}
                className="w-full bg-[#1A2420] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-[#1A2420]/10 hover:bg-[#25352c] transition-colors active:scale-95"
              >
                Join Now <ExternalLink size={16} strokeWidth={2.5} />
              </motion.button>
            </Link>
          </div>
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
