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
import { Coins, ExternalLink, Users, MapPin } from "lucide-react";

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
    const [rate, setRate] = useState(8);

    const total = (Number(people) || 0) * rate;

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-gray-50 border-none max-w-md mx-auto shadow-2xl max-h-[96dvh] flex flex-col">
                {/* Thin Gray Slide Handle */}
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-[#D1CCBF] my-4" />

                <div className="flex-1 overflow-y-auto min-h-0">
                    <DrawerHeader className="text-center pt-2">
                        <div className="mx-auto h-14 w-14 rounded-[2rem] bg-[#495C48] flex items-center justify-center text-[#EBE7DF] mb-3 shadow-[0_4px_10px_rgba(73,92,72,0.2)]">
                            <Coins size={26} strokeWidth={2} />
                        </div>
                        <DrawerTitle className="text-[1.35rem] font-bold text-[#3E5345] font-serif tracking-tight mb-0.5">
                            Heritage Zakat Fitrah
                        </DrawerTitle>
                        <DrawerDescription className="text-[#3E5345]/70 font-medium text-[12px]">
                            Calculate your obligation for Ramadhan 1447H
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="px-6 py-4 space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#7D8F82] uppercase tracking-[0.15em] flex items-center gap-1.5 ml-1">
                                <Users size={12} strokeWidth={2.5} />
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
                                className="bg-white dark:bg-white border-[#DCD6CA] focus:ring-[#495C48] text-[#3E5345] font-medium h-12 rounded-xl text-[15px] px-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#7D8F82] uppercase tracking-[0.15em] flex items-center gap-1.5 ml-1">
                                <MapPin size={12} strokeWidth={2.5} />
                                State / Quality Rate
                            </label>
                            <Select onValueChange={(v) => setRate(parseInt(v))} defaultValue="8">
                                <SelectTrigger className="bg-white dark:bg-white border-[#DCD6CA] text-[#3E5345] font-medium h-12 rounded-xl text-[14px] px-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <SelectValue placeholder="Select rate" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-white border-[#DCD6CA] text-[#3E5345] font-medium rounded-xl">
                                    {RATES.map((r) => (
                                        <SelectItem
                                            key={r.value}
                                            value={r.value.toString()}
                                            className="focus:bg-gray-100 focus:text-[#3E5345] data-[state=checked]:text-[#3E5345] text-[#3E5345]"
                                        >
                                            {r.label} - RM {r.value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-white dark:bg-white border border-white rounded-[1.75rem] p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-2">
                            <p className="text-[#7D8F82] font-semibold text-[10px] uppercase tracking-[0.2em] mb-1.5">
                                Total Amount
                            </p>
                            <h3 className="text-[2.5rem] font-bold font-serif tracking-tight text-[#C36946] flex justify-center items-baseline gap-2">
                                <span className="text-[1.25rem] font-bold tracking-tight">RM</span>
                                <span>{total.toFixed(2)}</span>
                            </h3>
                        </div>
                    </div>

                    <div className="px-6 pb-6 pt-2">
                        <Button
                            className="w-full h-[3.25rem] bg-[#495C48] hover:bg-[#364435] text-white text-[14px] rounded-xl font-bold gap-2 shadow-[0_4px_15px_rgba(73,92,72,0.3)]"
                            onClick={() => window.open("https://pay2.izakat.com/online_payment/fitrah", "_blank")}
                        >
                            Pay via Official Portal <ExternalLink size={16} strokeWidth={2.5} />
                        </Button>
                    </div>

                    {/* Bottom Handle matching iOS styling */}
                    <div className="mx-auto w-32 h-1.5 flex-shrink-0 rounded-full bg-[#D1CCBF] mb-4 mt-2" />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
