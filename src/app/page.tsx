"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, HandHeart, Users2, MoonStar } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-col p-6 gap-6 overscroll-y-contain">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-semibold tracking-tight">Salaam</h1>
          <div className="h-8 w-8 rounded-full bg-emerald-900/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MoonStar size={16} />
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Fajr is in <span className="text-emerald-500 font-medium">3h 42m</span>
        </p>
      </motion.div>

      {/* Hero: Next Prayer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
      >
        <Card className="border-border/50 bg-card overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <CardContent className="p-8 flex flex-col items-center justify-center text-center relative z-10">
            <p className="text-sm font-medium text-emerald-500 mb-2 uppercase tracking-widest">Next Prayer</p>
            <h2 className="text-5xl font-light tracking-tighter mb-1">05:42</h2>
            <p className="text-muted-foreground">Fajr</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bento Grid */}
      <h3 className="font-medium text-muted-foreground mt-4 text-sm uppercase tracking-wider">Discover</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { title: "Quran", icon: BookOpen, desc: "Last read Surah Al-Kahf", delay: 0.3 },
          { title: "Dua", icon: HandHeart, desc: "Daily collection", delay: 0.4 },
          { title: "Community", icon: Users2, desc: "Active discussions", delay: 0.5 },
          { title: "Progress", icon: MoonStar, desc: "12 days streak", delay: 0.6 },
        ].map((item) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.delay, type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="h-full border-border/40 hover:border-emerald-500/30 transition-colors bg-gradient-to-br from-card to-black backdrop-blur-sm">
              <CardHeader className="p-4 pb-2">
                <item.icon className="h-5 w-5 text-emerald-500 mb-2" />
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground text-balance">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
