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

        // 1. Generate ID first
        const newDocRef = doc(collection(db, "lost_items"));
        const itemId = newDocRef.id;
        console.log("Firebase: Starting post creation for ID:", itemId);

        // 2. Upload image if exists
        if (imageFile) {
            try {
                // Generate a more unique name just in case
                const extension = imageFile.name.split('.').pop();
                const fileName = `item_${Date.now()}.${extension}`;
                const storageRef = ref(storage, `lost_items/${itemId}/${fileName}`);

                console.log("Firebase: Uploading image to storage:", fileName);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
                console.log("Firebase: Image upload success. URL:", imageUrl);
            } catch (error) {
                console.error("Firebase Storage Error:", error);
            }
        }

        // 3. Create document
        const finalData = {
            ...data,
            imageUrl,
            status: "active",
            postedAt: serverTimestamp(),
            postedBy: user?.uid || "anonymous"
        };

        console.log("Firebase: Saving doc to Firestore:", finalData);
        await setDoc(newDocRef, finalData);
        console.log("Firebase: Post created successfully!");
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
