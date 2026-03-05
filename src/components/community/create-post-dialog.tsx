"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Image as ImageIcon, Loader2, Camera } from "lucide-react";

interface CreatePostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (content: string, images: File[]) => Promise<void>;
}

export function CreatePostDialog({ open, onOpenChange, onSubmit }: CreatePostDialogProps) {
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 4) {
            alert("Max 4 images allowed");
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleClose = () => {
        setContent("");
        setImages([]);
        previews.forEach(p => URL.revokeObjectURL(p));
        setPreviews([]);
        onOpenChange(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && images.length === 0) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content, images);
            handleClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#5A413A] font-serif">Create Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <Textarea
                        placeholder="What's happening in your community?"
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                        className="min-h-[120px] rounded-2xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#4D6A53] resize-none text-[14px] p-4"
                    />

                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {previews.map((preview, idx) => (
                                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group">
                                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 text-[#4D6A53] hover:bg-[#4D6A53]/10 px-3 py-2 rounded-xl transition-colors font-bold text-xs"
                        >
                            <ImageIcon size={18} />
                            Add Photo
                        </button>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleClose}
                                className="rounded-xl font-bold text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || (!content.trim() && images.length === 0)}
                                className="bg-[#4D6A53] hover:bg-[#3D5542] text-white rounded-xl px-6 font-bold text-xs h-10 shadow-lg shadow-[#4D6A53]/20"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Post"}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
