"use client";

import { useState } from "react";
import { useComments } from "@/hooks/use-comments";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommentsDialogProps {
    postId: string;
    postAuthor: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CommentsDialog({ postId, postAuthor, open, onOpenChange }: CommentsDialogProps) {
    const { comments, loading, addComment } = useComments(postId);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment(newComment);
            setNewComment("");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full h-[85dvh] sm:h-[70dvh] rounded-t-[2.5rem] sm:rounded-[2.5rem] bg-white border-none p-0 flex flex-col m-0 overflow-hidden shadow-2xl [&>button]:hidden">
                <DialogTitle className="sr-only">Comments on post by {postAuthor}</DialogTitle>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="text-[#4D6A53] w-5 h-5" />
                        <h2 className="text-xl font-bold text-[#1A2B22]">Comments</h2>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-[#5A413A]" />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 text-[#4D6A53] animate-spin" />
                            <p className="text-[12px] font-bold text-[#9AA5AB] uppercase tracking-wider">Memuatkan Komen...</p>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center pb-12">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                                <MessageSquare className="text-slate-200" size={32} />
                            </div>
                            <h3 className="text-[15px] font-bold text-[#5A413A] mb-1">Belum Ada Komen</h3>
                            <p className="text-[12px] text-[#9AA5AB] font-medium max-w-[180px]">Mulakan perbualan dan jadi yang pertama memberi komen.</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={comment.id}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#E5ECE7] overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
                                    {comment.authorPhoto ? (
                                        <img src={comment.authorPhoto} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#4D6A53] font-bold text-xs uppercase">
                                            {comment.authorName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[12px] font-bold text-[#1A2B22]">{comment.authorName}</span>
                                        <span className="text-[9px] font-bold text-[#9AA5AB] uppercase tracking-wider">
                                            {comment.createdAt ? "Just now" : "Posting..."}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-[#5A655F] leading-relaxed bg-[#F8F8FA] p-3 rounded-[1rem] rounded-tl-none border border-black/[0.02]">
                                        {comment.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 pt-4 border-t border-slate-100 bg-white shrink-0">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Tulis komen..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 h-11 bg-slate-50 rounded-xl px-5 text-[14px] font-medium focus:ring-2 focus:ring-[#4D6A53]/10 focus:bg-white focus:outline-none transition-all border border-transparent focus:border-[#4D6A53]/20"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="w-11 h-11 rounded-xl bg-[#4D6A53] text-white flex items-center justify-center shadow-lg shadow-[#4D6A53]/20 active:scale-90 transition-all disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={2.5} />}
                        </button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
