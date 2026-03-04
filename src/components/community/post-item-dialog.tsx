"use client";

import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, X, ChevronLeft, User, Moon, MapPin, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PostItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any, file: File | null) => Promise<void>;
}

export function PostItemDialog({ open, onOpenChange, onSubmit }: PostItemDialogProps) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [type, setType] = useState<"lost" | "found">("found");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ title, description, location, type, postedBy: "Anonymous" }, image);

            // Trigger success animation
            setIsSuccess(true);

            // Wait 2 seconds, then close and reset
            setTimeout(() => {
                onOpenChange(false);
                setTimeout(() => {
                    setTitle("");
                    setDescription("");
                    setLocation("");
                    setType("found");
                    setImage(null);
                    setPreview(null);
                    setIsSuccess(false);
                }, 300); // Reset after modal close animation
            }, 2000);
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white border-none sm:max-w-md h-[100dvh] sm:h-[90dvh] overflow-y-auto w-full max-w-none p-5 flex flex-col m-0 rounded-none sm:rounded-[2rem] shadow-2xl [&>button]:hidden">
                <DialogTitle className="sr-only">Report New Item</DialogTitle>
                {/* Header */}
                <header className="flex justify-between items-center mb-6 mt-2 relative">
                    <button onClick={() => onOpenChange(false)} className="text-[#5A413A] p-2 bg-slate-50 rounded-full hover:bg-slate-100 -ml-1 flex-shrink-0 transition-colors">
                        <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>

                    <h1 className="text-[1.5rem] font-bold tracking-tight text-[#5A413A] font-serif absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max">
                        Report New Item
                    </h1>

                    {/* Simulated Avatar overlap with moon indicator */}
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border-[1.5px] border-white shadow-sm overflow-hidden flex items-center justify-center">
                            <User className="text-[#5A413A]/40" fill="currentColor" size={20} />
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onSubmit={handleFormSubmit}
                            className="flex-1 flex flex-col gap-6"
                        >
                            {/* Segmented Control */}
                            <div className="flex bg-slate-100 rounded-2xl p-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                                <button
                                    type="button"
                                    onClick={() => setType("found")}
                                    className={`flex-1 text-[13px] py-[0.7rem] rounded-xl transition-all font-bold ${type === 'found' ? 'bg-white text-[#495C48] shadow-[0_2px_8px_rgba(0,0,0,0.05)]' : 'text-[#7A8A93] hover:text-[#5A413A]'}`}
                                >
                                    I Found Something
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType("lost")}
                                    className={`flex-1 text-[13px] py-[0.7rem] rounded-xl transition-all font-bold ${type === 'lost' ? 'bg-white text-[#D26E43] shadow-[0_2px_8px_rgba(0,0,0,0.05)]' : 'text-[#7A8A93] hover:text-[#5A413A]'}`}
                                >
                                    I Lost Something
                                </button>
                            </div>

                            {/* Image Uploader */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-[2/1] rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-2.5 cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative"
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImage(null);
                                                setPreview(null);
                                            }}
                                            className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors shadow-lg"
                                        >
                                            <X size={16} strokeWidth={2.5} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-[#5A413A] shadow-sm border border-slate-50">
                                            <Camera size={26} strokeWidth={2} />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-[14px] font-bold text-[#5A413A]">Upload Photo</p>
                                            <p className="text-[11px] text-[#7A8A93] font-medium italic tracking-wide">Help others identify the item</p>
                                        </div>
                                    </>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>

                            <div className="space-y-5">
                                {/* Item Name */}
                                <div className="space-y-2">
                                    <label htmlFor="title" className="text-[11px] uppercase font-extrabold text-[#7A8A93] tracking-[0.12em] pl-1">Item Name</label>
                                    <input
                                        id="title"
                                        required
                                        placeholder="e.g. Silver Keychain, Leather Wallet"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full h-[3.5rem] rounded-2xl bg-slate-50/80 border border-slate-100 px-5 text-[14px] text-[#1A1A1A] font-bold placeholder:text-[#7A8A93]/40 focus:ring-2 focus:ring-[#495C48]/5 focus:bg-white focus:outline-none transition-all"
                                    />
                                </div>

                                {/* Location */}
                                <div className="space-y-2 relative">
                                    <label htmlFor="location" className="text-[11px] uppercase font-extrabold text-[#7A8A93] tracking-[0.12em] pl-1">Location {type === 'found' ? 'Found' : 'Lost'}</label>
                                    <div className="relative">
                                        <input
                                            id="location"
                                            required
                                            placeholder="e.g. Al-Noor Mosque Entrance"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full h-[3.5rem] rounded-2xl bg-slate-50/80 border border-slate-100 px-5 pr-12 text-[14px] text-[#1A1A1A] font-bold placeholder:text-[#7A8A93]/40 focus:ring-2 focus:ring-[#495C48]/5 focus:bg-white focus:outline-none transition-all"
                                        />
                                        <MapPin size={20} strokeWidth={2.5} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#495C48]/60 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-[11px] uppercase font-extrabold text-[#7A8A93] tracking-[0.12em] pl-1">Item Description</label>
                                    <textarea
                                        id="description"
                                        required
                                        rows={4}
                                        className="w-full rounded-[1.5rem] bg-slate-50/80 border border-slate-100 p-5 text-[14px] text-[#1A1A1A] font-bold placeholder:text-[#7A8A93]/40 focus:ring-2 focus:ring-[#495C48]/5 focus:bg-white focus:outline-none transition-all resize-none leading-relaxed"
                                        placeholder="Describe distinguishing features, markings, or contents..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-auto pt-8 pb-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#495C48] hover:bg-[#3D4F3C] h-[4rem] rounded-[1.5rem] text-white font-extrabold text-[16px] shadow-[0_8px_25px_rgba(73,92,72,0.25)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Report <Send size={18} strokeWidth={2.5} className="mt-px" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex-1 flex flex-col items-center justify-center text-center pb-20"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                                className="w-24 h-24 bg-[#495C48] rounded-[2rem] flex items-center justify-center shadow-[0_8px_30px_rgba(73,92,72,0.3)] mb-6"
                            >
                                <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-[1.6rem] font-bold text-[#5A413A] font-serif mb-2"
                            >
                                Report Submitted
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-[14px] text-[#A68F80] font-medium max-w-[250px] leading-relaxed"
                            >
                                Thank you for helping the community! Your report has been posted successfully.
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
