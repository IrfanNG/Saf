"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Download, Copy, User, Edit, X, Upload, Loader2, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { useSedekah } from "@/hooks/use-sedekah";

export default function SedekahPage() {
    const { isAdmin } = useAdmin();
    const { settings, loading, updateSettings } = useSedekah();

    const [copied, setCopied] = useState(false);

    // Edit Form State
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ bankName: "", accountNumber: "" });
    const [qrFile, setQrFile] = useState<File | null>(null);
    const [qrPreview, setQrPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (settings) {
            setFormData({ bankName: settings.bankName, accountNumber: settings.accountNumber });
        }
    }, [settings]);

    const handleCopy = () => {
        // Fallback for local testing without HTTPS / modern clipboard
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(settings.accountNumber);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = settings.accountNumber;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error("Fallback copy failed", err);
            }
            document.body.removeChild(textArea);
        }

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadQRCode = () => {
        const urlToDownload = settings.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=SedekahAccount${settings.accountNumber}`;

        // Use direct anchor bypass instead of blob fetching to avoid strict Firebase CORS blocks
        const link = document.createElement("a");
        link.href = urlToDownload;
        link.download = `Sedekah_QR_${settings.bankName.replace(/\s+/g, "_")}.png`;
        link.target = "_blank"; // If browser blocks CORS download, at least it opens the image
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setQrFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setQrPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const saveChanges = async () => {
        setSaving(true);
        try {
            await updateSettings(formData, qrFile);
            setIsEditing(false);
            setQrFile(null);
            setQrPreview(null);
        } catch (e) {
            console.error("Failed to update settings", e);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen flex-col bg-[#F4F4F6] text-[#1A1A1A] items-center justify-center">
                <Loader2 className="animate-spin text-[#4D6250]" size={32} />
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col bg-[#F4F4F6] text-[#1A1A1A] pb-32 pt-[3.25rem]">
            {/* Header */}
            <header className="flex justify-between items-start mb-5 px-5">
                <div>
                    <p className="text-[10px] font-bold text-[#7D8F82] uppercase tracking-[0.15em] mb-1 pl-0.5">
                        Saf
                    </p>
                    <h1 className="text-[1.8rem] font-bold tracking-tight text-[#5A413A] font-serif leading-none">
                        Sedekah
                    </h1>
                </div>
                {/* Admin Actions */}
                <div className="relative mt-1 flex items-center gap-3">
                    {isAdmin && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-8 h-8 rounded-full bg-white/50 hover:bg-white flex items-center justify-center text-[#5A413A] shadow-sm transition-colors border-2 border-[#F1EDE2]"
                        >
                            <Edit size={14} strokeWidth={2.5} />
                        </button>
                    )}
                </div>
            </header>

            <div className="px-5 space-y-[1.125rem] flex-1 mt-3 max-w-lg mx-auto w-full">
                {/* Bank Detail Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#4D6250] rounded-[1.6rem] p-6 shadow-sm text-white overflow-hidden relative"
                >
                    <div className="flex items-center gap-[1.1rem] mb-9">
                        {/* Mosque Icon placeholder box */}
                        <div className="w-[4.25rem] h-[4.25rem] bg-white/10 rounded-2xl flex flex-col items-center justify-center shrink-0 mix-blend-screen overflow-hidden">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Dome */}
                                <path d="M12 4C10.5 6 9.5 8 9.5 10H14.5C14.5 8 13.5 6 12 4Z" fill="#CC9F2A" />
                                {/* Main Building */}
                                <rect x="8" y="10" width="8" height="6" fill="#CC9F2A" />
                                {/* Pillars */}
                                <rect x="5" y="11" width="2" height="5" fill="#CC9F2A" />
                                <path d="M4 11L6 9L8 11V10H4V11Z" fill="#CC9F2A" />
                                <rect x="17" y="11" width="2" height="5" fill="#CC9F2A" />
                                <path d="M16 11L18 9L20 11V10H16V11Z" fill="#CC9F2A" />
                                {/* Base */}
                                <rect x="4" y="16" width="16" height="2" fill="#CC9F2A" />
                                {/* Door cutout */}
                                <path d="M11 16V13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13V16H11Z" fill="#4D6250" />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center translate-y-[-2px]">
                            <h2 className="text-[1.35rem] font-bold font-serif leading-tight">Masjid Al-Azim</h2>
                            <p className="text-[9.5px] uppercase tracking-[0.08em] font-bold text-white/60 mt-[0.15rem]">Official Donation Account</p>
                        </div>
                    </div>

                    <div className="space-y-[1.15rem]">
                        <div className="flex justify-between items-end">
                            <span className="text-[11px] text-white/60 font-semibold tracking-wide">Bank Name</span>
                            <span className="text-[14px] font-bold tracking-wide">{settings.bankName}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-[11px] text-white/60 font-semibold tracking-wide">Account Number</span>
                            <span className="text-[15px] font-bold text-[#E3B13C] tracking-[0.1em] font-mono shadow-inner drop-shadow-sm">{settings.accountNumber}</span>
                        </div>
                    </div>
                </motion.div>

                {/* QR Code Graphic Frame */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="w-[90%] mx-auto bg-white rounded-[1.35rem] border border-[#5A413A] shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-1.5 overflow-hidden"
                >
                    <div className="aspect-[4/3] w-full bg-[#A6BEAA] rounded-[1rem] relative flex items-center justify-center overflow-hidden">
                        {/* Soft directional shadow simulating folded floor corner if needed */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent" />

                        {/* Wooden Frame */}
                        <div className="bg-[#D38B42] p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.15)] relative z-10 w-[45%] aspect-[3/4] rounded-sm transform sm:-translate-y-2">
                            <div className="w-full h-full bg-white flex flex-col items-center p-3 sm:p-4 text-center">
                                {/* Miniature Mosque Icon in frame */}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="mb-2 opacity-80" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 4C10.5 6 9.5 8 9.5 10H14.5C14.5 8 13.5 6 12 4Z" fill="#4D6250" />
                                    <rect x="8" y="10" width="8" height="6" fill="#4D6250" />
                                    <rect x="4" y="16" width="16" height="2" fill="#4D6250" />
                                </svg>
                                <img
                                    src={settings.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SedekahAccount${settings.accountNumber}`}
                                    alt="QR Code"
                                    className="w-[85%] aspect-square mix-blend-multiply opacity-90 object-contain"
                                />
                                <div className="mt-3 w-full">
                                    <h3 className="text-[6px] sm:text-[8px] font-bold text-[#1A1A1A] tracking-wider truncate mb-1.5">MOSQUE DONATION</h3>
                                    <div className="h-[1px] w-full bg-slate-200 mb-1" />
                                    <div className="h-[1px] w-[60%] bg-slate-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Instruction */}
                <p className="text-[12.5px] text-center text-[#7F8D98] font-medium leading-relaxed px-5 py-1">
                    Scan the QR code above using your preferred banking app to complete your donation safely.
                </p>

                {/* Actions */}
                <div className="space-y-[1.125rem]">
                    <button onClick={handleDownloadQRCode} className="w-full h-[4.25rem] bg-[#4D6250] hover:bg-[#3D4F40] text-white rounded-[1.2rem] font-bold text-[14px] flex items-center justify-center gap-2.5 transition-colors shadow-none active:scale-[0.98]">
                        <Download size={18} strokeWidth={2.5} />
                        Download QR Code
                    </button>
                    <button
                        onClick={handleCopy}
                        className="w-full h-[4.25rem] bg-[#E9E1D1] hover:bg-[#DCD4C4] text-[#5A413A] rounded-[1.2rem] font-bold text-[14px] flex items-center justify-center gap-2.5 transition-colors shadow-none active:scale-[0.98]"
                    >
                        {copied ? <span className="flex items-center gap-2">Copied!</span> : (
                            <>
                                <Copy size={16} strokeWidth={2.5} />
                                Copy Account Number
                            </>
                        )}
                    </button>
                </div>

                {/* Footer Verse block */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="bg-white/40 rounded-[1.5rem] p-6 text-center border border-white/60 mb-8"
                >
                    <p className="text-[12px] text-[#5A413A] italic font-serif leading-[1.8] mb-[0.85rem] px-2 font-medium">
                        "The example of those who spend their wealth in the way of Allah is like a seed [of grain] which grows seven spikes..."
                    </p>
                    <p className="text-[10px] uppercase font-bold text-[#8A958C] tracking-widest">
                        — Al-Baqarah 2:261
                    </p>
                </motion.div>
            </div>

            {/* Admin Editor Overlay */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm p-4 sm:p-6 flex flex-col items-center justify-center overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#F1EDE2] w-full max-w-sm rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden relative"
                        >
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setQrPreview(null);
                                    setQrFile(null);
                                    setFormData({ bankName: settings.bankName, accountNumber: settings.accountNumber });
                                }}
                                className="absolute top-5 right-5 p-2 bg-white rounded-full shadow-sm text-[#5A413A]"
                            >
                                <X size={16} strokeWidth={3} />
                            </button>

                            <h3 className="text-[1.4rem] font-bold text-[#5A413A] font-serif mb-6 mt-2">Edit Account Details</h3>

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-[#A68F80] tracking-[0.1em] pl-1">Bank Name</label>
                                    <input
                                        type="text"
                                        value={formData.bankName}
                                        onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                                        className="w-full h-[3.25rem] rounded-[1rem] bg-white border-none px-4 text-[14px] text-[#5A413A] font-bold placeholder:text-[#A68F80]/60 focus:ring-0 focus:outline-none shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-[#A68F80] tracking-[0.1em] pl-1">Account Number</label>
                                    <input
                                        type="text"
                                        value={formData.accountNumber}
                                        onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                        className="w-full h-[3.25rem] rounded-[1rem] bg-white border-none px-4 text-[14px] text-[#5A413A] font-bold placeholder:text-[#A68F80]/60 focus:ring-0 focus:outline-none shadow-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-[#A68F80] tracking-[0.1em] pl-1">QR Code Image</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-32 rounded-[1.25rem] border-[1.5px] border-dashed border-[#BBAA9F] bg-white flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group hover:bg-slate-50 transition-colors"
                                    >
                                        {(qrPreview || settings.qrCodeUrl) ? (
                                            <div className="w-full h-full p-2 relative">
                                                <img
                                                    src={qrPreview || settings.qrCodeUrl}
                                                    alt="QR Preview"
                                                    className="w-full h-full object-contain mix-blend-multiply"
                                                />
                                                <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="font-bold text-[11px] text-[#A68F80] uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-sm">Change Image</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-[#EBE7DF] flex items-center justify-center text-[#5A413A]">
                                                    <Upload size={18} strokeWidth={2.5} />
                                                </div>
                                                <span className="text-[11px] font-bold text-[#A68F80] uppercase tracking-wider">Upload New QR</span>
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
                                </div>

                                <button
                                    onClick={saveChanges}
                                    disabled={saving}
                                    className="w-full h-[3.5rem] bg-[#4D6250] hover:bg-[#3D4F40] mt-4 rounded-xl text-white font-bold text-[15px] shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {saving ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            Save Changes <Check size={16} strokeWidth={3} className="mt-[-1px]" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
