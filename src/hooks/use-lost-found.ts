"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";


export interface LostFoundItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    type: "lost" | "found";
    status: "active" | "returned";
    postedAt: any;
    postedBy: string;
    location?: string;
}

export function useLostAndFound() {
    const { user } = useAuth();
    const [items, setItems] = useState<LostFoundItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db.app) {
            setLoading(false);
            return;
        }

        const q = query(collection(db, "lost_items"), orderBy("postedAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as LostFoundItem[];
            setItems(data);
            setLoading(false);
        }, (error: any) => {
            if (error.code === "permission-denied") {
                console.warn("Firestore: Permission denied for 'lost_items'. Ensure you have updated your Firestore Rules.");
            } else {
                console.error("LostFound hook error:", error);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addItem = async (
        data: Omit<LostFoundItem, "id" | "postedAt" | "imageUrl" | "status">,
        imageFile: File | null
    ) => {
        let imageUrl = "";

        // 1. Generate document reference first to get ID
        const itemsCollection = collection(db, "lost_items");
        const newDocRef = doc(itemsCollection);
        const itemId = newDocRef.id;

        // 2. Upload image if exists
        if (imageFile) {
            const uploadToast = toast.loading("Saving your report with image...");
            try {
                // Simplified more reliable storage path
                const timestamp = Date.now();
                const extension = imageFile.name.includes('.') ? imageFile.name.split('.').pop() : 'jpg';
                const fileName = `${itemId}_${timestamp}.${extension}`;
                const storageRef = ref(storage, `lost_items/${fileName}`);

                console.log("Firebase: Uploading to", `lost_items/${fileName}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);

                if (!imageUrl) throw new Error("Could not get download URL");

                console.log("Firebase: Upload success:", imageUrl);
                toast.success("Image uploaded", { id: uploadToast });
            } catch (error: any) {
                console.error("Firebase Storage Error:", error);
                toast.error(`Image failed: ${error.message || 'Unknown error'}`, { id: uploadToast });
                // We'll continue without the image if it fails, as per current design
            }
        }

        // 3. Create document
        const finalData = {
            ...data,
            imageUrl: imageUrl || "", // Ensure it's at least an empty string
            status: "active",
            postedAt: serverTimestamp(),
            postedBy: user?.uid || "anonymous"
        };

        try {
            await setDoc(newDocRef, finalData);
            toast.success("Item reported successfully!");
        } catch (error: any) {
            console.error("Firestore Save Error:", error);
            toast.error("Failed to save report: " + (error.message || "Storage issue"));
            throw error;
        }
    };

    const markReturned = async (id: string, isReturned: boolean = true) => {
        try {
            const docRef = doc(db, "lost_items", id);
            await updateDoc(docRef, { status: isReturned ? "returned" : "active" });
            console.log(`Firebase: Item ${id} marked as ${isReturned ? "returned" : "active"}`);
        } catch (error) {
            console.error("Firebase: Failed to update item status:", error);
            toast.error("Error: You might not have permission to modify this item.");
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const docRef = doc(db, "lost_items", id);
            await deleteDoc(docRef);
            toast.success("Item deleted");
        } catch (error) {
            console.error("Firebase: Failed to delete item:", error);
            toast.error("Error: You might not have permission to delete this item.");
        }
    };

    return { items, loading, addItem, markReturned, deleteItem };
}
