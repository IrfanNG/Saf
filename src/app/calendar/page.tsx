"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, MapPin, Edit, Trash2, User, Moon, CalendarDays, Loader2, CheckCircle2 } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { useActivities, Activity } from "@/hooks/use-activities";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { DeleteConfirmDialog } from "@/components/ui/custom-delete-dialog";


export default function CalendarPage() {
    // Current "local real-time" date processing
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isShowingAll, setIsShowingAll] = useState(true);
    const [typeFilter, setTypeFilter] = useState("all");
    const { isAdmin } = useAdmin();
    const { user } = useAuth();
    const router = useRouter();

    const selectedDateISO = [
        selectedDate.getFullYear(),
        String(selectedDate.getMonth() + 1).padStart(2, "0"),
        String(selectedDate.getDate()).padStart(2, "0"),
    ].join("-");
    const displaySelectedDate = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const { activities, loading, addActivity, updateActivity, deleteActivity, joinActivity } = useActivities(isShowingAll ? null : selectedDateISO);

    const [joiningId, setJoiningId] = useState<string | null>(null);
    const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

    // Deletion states
    const [deleteConfig, setDeleteConfig] = useState<{ open: boolean, id: string }>({ open: false, id: "" });

    const handleJoin = async (act: Activity) => {
        if (!user) {
            router.push("/login");
            return;
        }

        setJoiningId(act.id);
        try {
            await joinActivity(act.id, user.uid, {
                name: user.displayName || "Unknown User",
                email: user.email || "No Email",
                photoURL: user.photoURL || null
            });
            setJoinedIds(prev => new Set(prev).add(act.id));
        } catch (err) {
            console.error(err);
        } finally {
            setJoiningId(null);
        }
    };

    const handleViewParticipants = (actId: string) => {
        router.push(`/calendar/activity/${actId}/participants`);
    };

    const handleDateSelect = (day: Date) => {
        setSelectedDate(day);
        setIsShowingAll(false);
    };

    // Form stuff for Admin
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "Quran Tajweed Class",
        timeSlot: "AFTER MAGHRIB",
        location: "Al-Noor Mosque",
        image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=200&h=200&fit=crop",
        description: "",
        type: "event",
        dateISO: selectedDateISO
    });

    const getDaysInWeek = (date: Date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay()); // Start on Sunday
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    };

    const days = getDaysInWeek(currentDate);

    const prevWeek = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() - 7);
        setCurrentDate(next);
    };

    const nextWeek = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 7);
        setCurrentDate(next);
    };

    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await updateActivity(editingId, formData);
        } else {
            await addActivity(formData);
        }
        setIsFormOpen(false);
        setEditingId(null);
    };

    const handleEdit = (act: Activity) => {
        setFormData({
            title: act.title,
            timeSlot: act.timeSlot,
            location: act.location,
            image: act.image,
            description: act.description || "",
            type: act.type || "event",
            dateISO: act.dateISO
        });
        setEditingId(act.id);
        setIsFormOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteConfig.id) {
            await deleteActivity(deleteConfig.id);
        }
        setDeleteConfig({ open: false, id: "" });
    };

    return (
        <main className="flex min-h-screen flex-col bg-[#F4F4F6] text-[#1A1A1A] pb-32">
            {/* Top White Container covering Title and Calendar */}
            <div className="bg-white pt-12 pb-8 rounded-b-[2.5rem] shadow-sm mb-2">
                {/* Header */}
                <header className="flex justify-between items-start mb-2 px-5">
                    <div>
                        <p className="text-[10px] font-bold text-[#7D8F82] uppercase tracking-[0.15em] mb-1 pl-0.5">
                            Saf
                        </p>
                        <h1 className="text-[1.8rem] font-bold tracking-tight text-[#5A413A] font-sans leading-none">
                            Event
                        </h1>
                    </div>
                </header>

                {/* Header / Week Picker */}
                <div className="bg-[#415D43] rounded-[1.8rem] mt-4 mx-5 p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-6 px-1">
                        <button onClick={prevWeek} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition text-white/70 hover:text-white">
                            <ChevronLeft size={16} />
                        </button>
                        <h2 className="text-[17px] font-semibold tracking-[0.15em] font-sans text-white uppercase">
                            {monthName}
                        </h2>
                        <button onClick={nextWeek} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition text-white/70 hover:text-white">
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="flex justify-between w-full px-2">
                        {days.map((day, idx) => {
                            const isSelected = day.toDateString() === selectedDate.toDateString();
                            const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(day).toUpperCase();

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleDateSelect(day)}
                                    className="flex flex-col items-center gap-2 relative w-[2.8rem]"
                                >
                                    <span className={`text-[9px] font-semibold tracking-wider ${isSelected && !isShowingAll ? 'text-[#D0A453]' : 'text-white/60'}`}>
                                        {dayName}
                                    </span>

                                    <div className={`relative flex items-center justify-center w-[2.1rem] h-[2.1rem] rounded-full transition-all duration-300 ${isSelected && !isShowingAll ? 'bg-[#D0A453] text-[#5A413A] font-bold shadow-md' : 'text-white/90 hover:bg-white/10 font-medium'}`}>
                                        {day.getDate()}
                                        {isSelected && !isShowingAll && (
                                            <motion.div
                                                layoutId="activeDay"
                                                className="absolute inset-0 bg-[#D0A453] rounded-full -z-10 shadow-[0_4px_12px_rgba(208,164,83,0.3)]"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Activities Title */}
            <div className="flex justify-between items-end px-6 mt-8 mb-5">
                <div className="flex flex-col">
                    <h3 className="text-[16px] font-bold tracking-widest text-[#415D43] font-sans uppercase">
                        {isShowingAll ? "Mosque Activities" : "Daily Activities"}
                    </h3>
                    {!isShowingAll && (
                        <p className="text-[10px] font-bold text-[#A68F80] uppercase tracking-wider mt-0.5">
                            {displaySelectedDate}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {isAdmin && (
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({
                                    title: "",
                                    timeSlot: "",
                                    location: "",
                                    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=200&h=200&fit=crop",
                                    description: "",
                                    type: "event",
                                    dateISO: selectedDateISO
                                });
                                setIsFormOpen(true);
                            }}
                            className="text-xs font-bold bg-[#415D43] text-white p-1 rounded-md hover:bg-[#415D43]/80 transition"
                        >
                            <Plus size={14} />
                        </button>
                    )}

                </div>
            </div>
            {/* Type Filters */}
            <div className="px-5 mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {["all", "event", "class", "talk", "community"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setTypeFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 border ${typeFilter === filter
                                ? "bg-[#415D43] text-white border-[#415D43] shadow-md shadow-[#415D43]/20"
                                : "bg-white text-[#7D8F82] border-slate-200 hover:border-[#415D43]/30"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* List of Activities */}
            <div className="px-5 space-y-4">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-[#F6F3EB] animate-pulse rounded-2xl mx-1" />
                    ))
                ) : activities.filter(act => typeFilter === 'all' || act.type === typeFilter).length === 0 ? (
                    <div className="text-center text-[#A68F80] py-10 font-medium text-sm">
                        {typeFilter === 'all'
                            ? (isShowingAll ? "No activities found in the scheduled list" : "No activities scheduled for this day")
                            : `No ${typeFilter}s scheduled for this ${isShowingAll ? 'period' : 'day'}`
                        }
                    </div>
                ) : (
                    <AnimatePresence>
                        {activities
                            .filter(act => typeFilter === 'all' || act.type === typeFilter)
                            .map((act) => (
                                <motion.div
                                    key={act.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white border border-white/50 rounded-[1.2rem] p-3 flex gap-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)] relative overflow-hidden group"
                                >
                                    <div className="relative w-24 h-[6.5rem] shrink-0 rounded-xl overflow-hidden shadow-sm bg-slate-200">
                                        {act.image ? (
                                            <img
                                                src={act.image}
                                                alt={act.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="flex-1 min-w-0 py-1 flex flex-col items-start pr-1">
                                        <div className="flex items-center gap-2 mb-1 w-full flex-wrap">
                                            <p className="text-[9px] font-bold text-[#CDA066] uppercase tracking-[0.15em]">
                                                {act.timeSlot}
                                            </p>
                                            <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tight ${act.type === 'class' ? 'bg-blue-100 text-blue-700' :
                                                act.type === 'event' ? 'bg-emerald-100 text-emerald-700' :
                                                    act.type === 'community' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {act.type || 'Event'}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-[#415D43]/10 px-2 py-0.5 rounded-full mb-1">
                                            <CalendarDays size={8} className="text-[#415D43]" />
                                            <span className="text-[8px] font-bold text-[#415D43] uppercase">{act.dateISO}</span>
                                        </div>
                                        <h4 className="font-semibold text-[1.05rem] leading-tight text-[#5A413A] font-sans tracking-tight mb-[0.15rem]">
                                            {act.title}
                                        </h4>
                                        <div className="flex items-center gap-1.5 text-[#A68F80] mb-3">
                                            <MapPin size={10} strokeWidth={2.5} className="text-[#5C7154]" />
                                            <span className="text-[11px] font-medium truncate">{act.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-auto">
                                            <button
                                                onClick={() => handleJoin(act)}
                                                disabled={joiningId === act.id || joinedIds.has(act.id)}
                                                className="bg-[#415D43] hover:bg-[#324834] disabled:bg-[#415D43]/60 text-white font-bold text-[11px] px-[1.1rem] py-[0.35rem] rounded-md shadow-sm transition active:scale-95 flex items-center gap-1.5"
                                            >
                                                {joiningId === act.id ? (
                                                    <Loader2 size={12} className="animate-spin" />
                                                ) : joinedIds.has(act.id) ? (
                                                    <CheckCircle2 size={12} />
                                                ) : null}
                                                {joinedIds.has(act.id) ? "Joined" : "Join"}
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleViewParticipants(act.id)}
                                                    className="bg-white hover:bg-slate-50 text-[#415D43] border border-[#415D43]/20 font-bold text-[11px] px-[1.1rem] py-[0.35rem] rounded-md shadow-sm transition active:scale-95"
                                                >
                                                    View
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Admin specific actions hover */}
                                    {isAdmin && (
                                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-slate-100 shadow-sm">
                                            <button onClick={() => handleEdit(act)} className="p-1.5 text-[#A68F80] hover:text-[#415D43] hover:bg-slate-50 rounded-md transition">
                                                <Edit size={14} />
                                            </button>
                                            <button onClick={() => setDeleteConfig({ open: true, id: act.id })} className="p-1.5 text-[#A68F80] hover:text-red-500 hover:bg-slate-50 rounded-md transition">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Admin Add/Edit Form Overlay */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm p-6 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
                    >
                        <h3 className="text-xl font-bold mb-4">{editingId ? "Edit" : "New"} Activity</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">Title</label>
                                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border rounded-xl px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#415D43]/20 focus:border-[#415D43]" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">Activity Type</label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full border rounded-xl px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#415D43]/20 focus:border-[#415D43] bg-white"
                                >
                                    <option value="event">Event</option>
                                    <option value="class">Class</option>
                                    <option value="talk">Talk / Lecture</option>
                                    <option value="community">Community Service</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-500 mb-1 block">Date (YYYY-MM-DD)</label>
                                    <input required type="date" value={formData.dateISO} onChange={e => setFormData({ ...formData, dateISO: e.target.value })} className="w-full border rounded-xl px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#415D43]/20 focus:border-[#415D43]" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-500 mb-1 block">Time Slot</label>
                                    <input required value={formData.timeSlot} onChange={e => setFormData({ ...formData, timeSlot: e.target.value })} className="w-full border rounded-xl px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#415D43]/20 focus:border-[#415D43]" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">Location / Mosque</label>
                                <input required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full border rounded-xl px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#415D43]/20 focus:border-[#415D43]" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">Description</label>
                                <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border rounded-xl px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#415D43]/20 focus:border-[#415D43] resize-none" placeholder="Activity details..." />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">Image URL (Optional)</label>
                                <input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full border rounded-xl px-4 py-2 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#415D43]/20 focus:border-[#415D43]" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 border text-slate-500 font-bold p-3 rounded-xl hover:bg-slate-50 transition">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-[#415D43] text-white font-bold p-3 rounded-xl hover:bg-[#324834] shadow-[0_4px_10px_rgba(65,93,67,0.3)] transition active:scale-95">
                                    Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <DeleteConfirmDialog
                open={deleteConfig.open}
                onOpenChange={(open) => setDeleteConfig({ ...deleteConfig, open })}
                onConfirm={confirmDelete}
                title="Delete Activity?"
                description="Are you sure you want to delete this activity? This will remove it from the calendar."
            />
        </main >
    );
}
