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
            <DialogContent className="bg-[#F1EDE2] border-none sm:max-w-md h-[100dvh] sm:h-[90dvh] overflow-y-auto w-full max-w-none p-5 flex flex-col m-0 rounded-none sm:rounded-[1.75rem] shadow-2xl [&>button]:hidden">
                <DialogTitle className="sr-only">Report New Item</DialogTitle>
                {/* Header */}
                <header className="flex justify-between items-center mb-6 mt-2 relative">
                    <button onClick={() => onOpenChange(false)} className="text-[#5A413A] p-1 -ml-1 flex-shrink-0">
                        <ChevronLeft size={28} strokeWidth={2.5} />
                    </button>

                    <h1 className="text-[1.4rem] font-bold tracking-tight text-[#5A413A] font-serif absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max">
                        Report New Item
                    </h1>

                    {/* Simulated Avatar overlap with moon indicator */}
                    <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#F3BA8E] border-[1.5px] border-[#F1EDE2] shadow-sm overflow-hidden flex items-center justify-center">
                            <User className="text-white/80" fill="currentColor" size={16} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-[16px] h-[16px] bg-[#E1DBD0] rounded-full border-[1.5px] border-[#F1EDE2] flex items-center justify-center shadow-sm">
                            <Moon size={8} className="text-[#415D43] fill-current" />
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
                            <div className="flex bg-[#EBE7DF] rounded-[1.1rem] p-1.5 shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)]">
                                <button
                                    type="button"
                                    onClick={() => setType("found")}
                                    className={`flex-1 text-[13px] py-[0.65rem] rounded-[0.85rem] transition-all font-bold ${type === 'found' ? 'bg-white text-[#5A413A] shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'text-[#8B9699] hover:text-[#5A413A]'}`}
                                >
                                    I Found Something
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType("lost")}
                                    className={`flex-1 text-[13px] py-[0.65rem] rounded-[0.85rem] transition-all font-bold ${type === 'lost' ? 'bg-white text-[#5A413A] shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'text-[#8B9699] hover:text-[#5A413A]'}`}
                                >
                                    I Lost Something
                                </button>
                            </div>

                            {/* Image Uploader */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-[2/1] rounded-[2rem] border-[1.5px] border-dashed border-[#BBAA9F] bg-transparent flex flex-col items-center justify-center gap-2.5 cursor-pointer hover:bg-[#EBE7DF]/50 transition-all overflow-hidden relative"
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
                                            className="absolute top-3 right-3 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-colors"
                                        >
                                            <X size={16} strokeWidth={2.5} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-12 w-12 rounded-full bg-[#E4DFD2] flex items-center justify-center text-[#5A413A] shadow-sm">
                                            <Camera size={22} strokeWidth={2.5} />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-[13px] font-bold text-[#A68F80]">Upload Photo</p>
                                            <p className="text-[10px] text-[#A68F80]/70 italic tracking-wide">Clear photo of the item helps identification</p>
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

                            <div className="space-y-4">
                                {/* Item Name */}
                                <div className="space-y-1.5 px-0.5">
                                    <label htmlFor="title" className="text-[10px] uppercase font-bold text-[#A68F80] tracking-[0.1em] pl-1">Item Name</label>
                                    <input
                                        id="title"
                                        required
                                        placeholder="e.g. Silver Keychain, Leather Wallet"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full h-[3.25rem] rounded-[1rem] bg-[#EBE7DF] border-none px-4 text-[14px] text-[#5A413A] font-medium placeholder:text-[#A68F80]/60 focus:ring-0 focus:outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.01)]"
                                    />
                                </div>

                                {/* Location */}
                                <div className="space-y-1.5 px-0.5 relative">
                                    <label htmlFor="location" className="text-[10px] uppercase font-bold text-[#A68F80] tracking-[0.1em] pl-1">Location {type === 'found' ? 'Found' : 'Lost'}</label>
                                    <div className="relative">
                                        <input
                                            id="location"
                                            required
                                            placeholder="e.g. Al-Noor Mosque Entrance"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full h-[3.25rem] rounded-[1rem] bg-[#EBE7DF] border-none pl-4 pr-11 text-[14px] text-[#5A413A] font-medium placeholder:text-[#A68F80]/60 focus:ring-0 focus:outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.01)]"
                                        />
                                        <MapPin size={18} strokeWidth={2.5} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A68F80]/70 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5 px-0.5">
                                    <label htmlFor="description" className="text-[10px] uppercase font-bold text-[#A68F80] tracking-[0.1em] pl-1">Item Description</label>
                                    <textarea
                                        id="description"
                                        required
                                        rows={4}
                                        className="w-full rounded-[1.25rem] bg-[#EBE7DF] border-none p-4 text-[14px] text-[#5A413A] font-medium placeholder:text-[#A68F80]/60 focus:ring-0 focus:outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.01)] resize-none leading-relaxed"
                                        placeholder="Describe distinguishing features, markings, or contents..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-auto pt-6 pb-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#D26E43] hover:bg-[#B35238] h-[3.5rem] rounded-2xl text-white font-bold text-[15px] shadow-[0_4px_15px_rgba(210,110,67,0.3)] transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Report <Send size={16} strokeWidth={2.5} className="mt-0.5" />
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
