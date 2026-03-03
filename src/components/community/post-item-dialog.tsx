"use client";

import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Camera, ImagePlus, Loader2, X } from "lucide-react";

interface PostItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any, file: File | null) => Promise<void>;
}

export function PostItemDialog({ open, onOpenChange, onSubmit }: PostItemDialogProps) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<"lost" | "found">("lost");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
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
            await onSubmit({ title, description, type, postedBy: "Anonymous" }, image);
            onOpenChange(false);
            // Reset form
            setTitle("");
            setDescription("");
            setType("lost");
            setImage(null);
            setPreview(null);
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-zinc-100">Post Item</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Share details about a lost or found item.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-video rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all overflow-hidden relative"
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
                                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                        <ImagePlus size={20} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-medium text-zinc-300">Click to upload photo</p>
                                        <p className="text-[10px] text-zinc-500 mt-1">PNG, JPG up to 5MB</p>
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-xs uppercase tracking-wider text-zinc-500">I found / I lost</Label>
                                <Select onValueChange={(v: any) => setType(v)} defaultValue="lost">
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                        <SelectItem value="lost">LOST</SelectItem>
                                        <SelectItem value="found">FOUND</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs uppercase tracking-wider text-zinc-500">Item Name</Label>
                            <Input
                                id="title"
                                required
                                placeholder="e.g. Black Wallet, Car Key"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs uppercase tracking-wider text-zinc-500">Description</Label>
                            <textarea
                                id="description"
                                required
                                className="flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Where was it last seen? Any distinguishing marks?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 h-11"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post to Board"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
