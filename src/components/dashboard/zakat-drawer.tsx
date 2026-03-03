"use client";

import { useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Coins, ExternalLink, Users } from "lucide-react";

interface ZakatDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const RATES = [
    { label: "Standard Rate (Default)", value: 8 },
    { label: "Premium Rate (Beras Wangi)", value: 15 },
    { label: "High-End Rate (Beras Basmathi)", value: 22 },
];

export function ZakatDrawer({ open, onOpenChange }: ZakatDrawerProps) {
    const [people, setPeople] = useState<number | "">("");
    const [rate, setRate] = useState(7);

    const total = (Number(people) || 0) * rate;

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-zinc-950 border-t-emerald-500/20 max-w-md mx-auto">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-800 my-4" />

                <DrawerHeader className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                        <Coins size={24} />
                    </div>
                    <DrawerTitle className="text-xl font-semibold">Zakat Fitrah Calculator</DrawerTitle>
                    <DrawerDescription>Calculate your obligation for Ramadhan 1447H</DrawerDescription>
                </DrawerHeader>

                <div className="px-6 py-4 space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <Users size={14} className="text-emerald-500" />
                            Number of People
                        </label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={people}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === "") setPeople("");
                                else setPeople(Math.max(1, parseInt(val) || 0));
                            }}
                            className="bg-zinc-900 border-zinc-800 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <Coins size={14} className="text-emerald-500" />
                            State / Quality Rate
                        </label>
                        <Select onValueChange={(v) => setRate(parseInt(v))} defaultValue="7">
                            <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                <SelectValue placeholder="Select rate" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                {RATES.map((r) => (
                                    <SelectItem key={r.value} value={r.value.toString()}>
                                        {r.label} - RM {r.value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 text-center space-y-1">
                        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Total Amount</p>
                        <h3 className="text-4xl font-bold tracking-tighter text-emerald-500">
                            RM {total.toFixed(2)}
                        </h3>
                    </div>
                </div>

                <DrawerFooter className="pb-8">
                    <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-sm font-medium gap-2"
                        onClick={() => window.open("https://pay2.izakat.com/online_payment/fitrah", "_blank")}
                    >
                        Pay via Official Portal <ExternalLink size={16} />
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="ghost" className="text-zinc-500 text-xs">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
