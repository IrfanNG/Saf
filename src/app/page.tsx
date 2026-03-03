"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, HandHeart, Users2, MoonStar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { useMosqueSettings } from "@/hooks/use-mosque-settings";
import { HeroCountdown } from "@/components/dashboard/hero-countdown";
import { QiyamTimer } from "@/components/dashboard/qiyam-timer";
import { MosqueInfo } from "@/components/dashboard/mosque-info";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export default function Home() {
  const { nextPrayer, prayerTimes, location, loading: prayerLoading } = usePrayerTimes();
  const { settings, loading: mosqueLoading } = useMosqueSettings();

  if (prayerLoading && !nextPrayer) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.main
      className="flex flex-col p-6 gap-5 overscroll-y-contain"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item}>
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Salaam<span className="text-emerald-500">☽</span>
          </h1>
          <div className="h-8 w-8 rounded-full bg-emerald-900/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MoonStar size={16} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">
            {nextPrayer ? (
              <>
                {nextPrayer.name} in{" "}
                <span className="text-emerald-500 font-medium">
                  {nextPrayer.remainingFormatted}
                </span>
              </>
            ) : (
              "Loading prayer times…"
            )}
          </p>
          {location && (
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-2 py-0.5">
              <MapPin size={10} className="text-emerald-600" />
              {location.city}
            </span>
          )}
        </div>
      </motion.div>

      {/* Hero Countdown */}
      <motion.div variants={item}>
        <HeroCountdown nextPrayer={nextPrayer} loading={prayerLoading} />
      </motion.div>

      {/* Qiyam Timer */}
      <motion.div variants={item}>
        <QiyamTimer
          qiyamTime={settings.qiyamTime}
          fajrTime={prayerTimes?.Fajr?.split(" ")[0]}
          loading={mosqueLoading}
        />
      </motion.div>

      {/* Mosque Section */}
      <motion.div variants={item}>
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-[0.2em] mb-3">
          Mosque
        </h3>
        <MosqueInfo settings={settings} loading={mosqueLoading} />
      </motion.div>

      {/* Discover */}
      <motion.div variants={item}>
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-[0.2em] mb-3">
          Discover
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Quran", icon: BookOpen, desc: "Last read Surah Al-Kahf" },
            { title: "Dua", icon: HandHeart, desc: "Daily collection" },
            { title: "Community", icon: Users2, desc: "Active discussions" },
            { title: "Progress", icon: MoonStar, desc: "12 days streak" },
          ].map((tile) => (
            <Card
              key={tile.title}
              className="h-full border-border/40 hover:border-emerald-500/30 transition-colors bg-gradient-to-br from-card to-black"
            >
              <CardHeader className="p-4 pb-2">
                <tile.icon className="h-5 w-5 text-emerald-500 mb-2" />
                <CardTitle className="text-sm">{tile.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-[10px] text-muted-foreground text-balance">
                  {tile.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.main>
  );
}
