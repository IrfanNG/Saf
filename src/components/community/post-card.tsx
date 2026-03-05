"use client";

import { CommunityPost } from "@/hooks/use-posts";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Trash2, MoreVertical, Share2 } from "lucide-react";

interface PostCardProps {
    post: CommunityPost;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
}

export function PostCard({ post, onLike, onDelete }: PostCardProps) {
    const { user } = useAuth();
    const isLiked = post.likedBy?.includes(user?.uid || "");

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[1.8rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50 mb-4"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-100">
                        {post.authorPhoto ? (
                            <img src={post.authorPhoto} alt={post.authorName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#4D6A53] text-white font-bold text-sm">
                                {post.authorName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-[14px] font-bold text-[#1A2B22] leading-none mb-1">{post.authorName}</h4>
                        <p className="text-[10px] font-bold text-[#9AA5AB] uppercase tracking-wider">
                            {post.createdAt ? (
                                typeof post.createdAt.toDate === 'function'
                                    ? new Intl.DateTimeFormat('en-MY', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(post.createdAt.toDate())
                                    : "Just now"
                            ) : "Posting..."}
                        </p>
                    </div>
                </div>

                {user?.uid === post.authorId && (
                    <button onClick={() => onDelete(post.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            {/* Content */}
            <p className="text-[14px] text-[#5A655F] leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
            </p>

            {/* Images Grid */}
            {post.images && post.images.length > 0 && (
                <div className={`grid gap-2 mb-4 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {post.images.map((url, idx) => (
                        <div key={idx} className={`rounded-2xl overflow-hidden bg-slate-100 ${post.images.length === 3 && idx === 0 ? 'row-span-2' : ''}`}>
                            <img src={url} alt="" className="w-full h-full object-cover aspect-square" />
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-2 border-t border-slate-50">
                <button
                    onClick={() => onLike(post.id)}
                    className={`flex items-center gap-2 transition-all active:scale-95 ${isLiked ? 'text-red-500' : 'text-[#9AA5AB]'}`}
                >
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
                    <span className="text-[12px] font-bold">{post.likesCount || 0}</span>
                </button>

                <button className="flex items-center gap-2 text-[#9AA5AB] active:scale-95 transition-all">
                    <MessageSquare size={18} strokeWidth={2.5} />
                    <span className="text-[12px] font-bold">{post.commentsCount || 0}</span>
                </button>

                <button className="ml-auto text-[#9AA5AB] active:scale-95 transition-all">
                    <Share2 size={18} strokeWidth={2.5} />
                </button>
            </div>
        </motion.div>
    );
}
