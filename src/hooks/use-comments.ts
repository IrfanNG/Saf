"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    increment,
    runTransaction
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";

export interface PostComment {
    id: string;
    postId: string;
    content: string;
    authorId: string;
    authorName: string;
    authorPhoto?: string;
    createdAt: any;
}

export function useComments(postId: string) {
    const { user } = useAuth();
    const [comments, setComments] = useState<PostComment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!postId || !db.app) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "post_comments"),
            where("postId", "==", postId),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PostComment[];
            setComments(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [postId]);

    const addComment = async (content: string) => {
        if (!user || !postId) return;

        try {
            await runTransaction(db, async (transaction) => {
                const commentRef = doc(collection(db, "post_comments"));
                const postRef = doc(db, "community_posts", postId);

                transaction.set(commentRef, {
                    postId,
                    content,
                    authorId: user.uid,
                    authorName: user.displayName || "Anonymous",
                    authorPhoto: user.photoURL || null,
                    createdAt: serverTimestamp()
                });

                transaction.update(postRef, {
                    commentsCount: increment(1)
                });
            });
        } catch (error) {
            console.error("Failed to add comment:", error);
            throw error;
        }
    };

    return { comments, loading, addComment };
}
