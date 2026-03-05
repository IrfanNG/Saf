"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone. This will permanently delete the item.",
}: DeleteConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-[#F4F4F6] rounded-[2.5rem] p-6 max-w-[85vw] sm:max-w-[380px] border-none shadow-2xl">
                <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle className="text-xl font-bold text-[#1A2B22] text-center font-sans tracking-tight">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 font-medium text-center text-[13px] leading-relaxed font-sans">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-8 flex flex-row gap-3 sm:flex-row sm:justify-center sm:space-x-0">
                    <AlertDialogCancel className="bg-white hover:bg-slate-50 border border-slate-200/60 rounded-2xl font-bold text-slate-500 h-10 flex-1 mt-0 shadow-sm">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white border-none rounded-2xl font-bold h-10 flex-1 shadow-lg shadow-red-500/10 !bg-[#EF4444] !hover:bg-[#DC2626] transition-colors"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
