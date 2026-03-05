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
    serverTimestamp,
    increment,
    runTransaction
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";

export interface CommunityPost {
    id: string;
    content: string;
    images: string[];
    authorId: string;
    authorName: string;
    authorPhoto?: string;
    createdAt: any;
    likesCount: number;
    commentsCount: number;
    likedBy: string[]; // List of user IDs who liked
}

export function usePosts() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db.app) {
            setLoading(false);
            return;
        }

        const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CommunityPost[];
            setPosts(data);
            setLoading(false);
        }, (error) => {
            console.error("Posts hook error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addPost = async (content: string, imageFiles: File[]) => {
        if (!user) throw new Error("Must be logged in");

        const newDocRef = doc(collection(db, "community_posts"));
        const postId = newDocRef.id;
        const imageUrls: string[] = [];

        // Upload images
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const storageRef = ref(storage, `community_posts/${postId}/img_${i}_${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            imageUrls.push(url);
        }

        const postData = {
            content,
            images: imageUrls,
            authorId: user.uid,
            authorName: user.displayName || "Anonymous",
            authorPhoto: user.photoURL || null,
            createdAt: serverTimestamp(),
            likesCount: 0,
            commentsCount: 0,
            likedBy: []
        };

        await setDoc(newDocRef, postData);
    };

    const toggleLike = async (postId: string) => {
        if (!user) return;
        const postRef = doc(db, "community_posts", postId);

        try {
            await runTransaction(db, async (transaction) => {
                const postSnap = await transaction.get(postRef);
                if (!postSnap.exists()) return;

                const data = postSnap.data() as CommunityPost;
                const likedBy = data.likedBy || [];
                const isLiked = likedBy.includes(user.uid);

                if (isLiked) {
                    transaction.update(postRef, {
                        likedBy: likedBy.filter(uid => uid !== user.uid),
                        likesCount: increment(-1)
                    });
                } else {
                    transaction.update(postRef, {
                        likedBy: [...likedBy, user.uid],
                        likesCount: increment(1)
                    });
                }
            });
        } catch (error) {
            console.error("Like toggle failed:", error);
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm("Delete this post?")) return;
        try {
            await deleteDoc(doc(db, "community_posts", id));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return { posts, loading, addPost, toggleLike, deletePost };
}
