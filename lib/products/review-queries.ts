import { db } from "@/db";
import { reviews } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

// Type for a review with author info and nested replies
export type ReviewWithAuthor = {
    id: number;
    productId: number;
    userId: string;
    content: string;
    rating: number | null;
    parentId: number | null;
    mentions: string[] | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    authorName: string;
    authorAvatar: string | null;
    replies: ReviewWithAuthor[];
};

// Cache for resolved user info within a single request
type UserInfo = { name: string; avatar: string | null };

async function resolveUserInfoBatch(userIds: string[]): Promise<Map<string, UserInfo>> {
    const userMap = new Map<string, UserInfo>();
    if (userIds.length === 0) return userMap;

    const uniqueIds = [...new Set(userIds)];

    try {
        const client = await clerkClient();

        // Fetch users in parallel (batches of 10 to avoid rate limits)
        const batchSize = 10;
        for (let i = 0; i < uniqueIds.length; i += batchSize) {
            const batch = uniqueIds.slice(i, i + batchSize);
            const users = await Promise.all(
                batch.map(async (id) => {
                    try {
                        const user = await client.users.getUser(id);
                        return {
                            id,
                            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous",
                            avatar: user.imageUrl || null,
                        };
                    } catch {
                        return { id, name: "Anonymous", avatar: null };
                    }
                })
            );

            for (const user of users) {
                userMap.set(user.id, { name: user.name, avatar: user.avatar });
            }
        }
    } catch (error) {
        console.error("Error resolving user info:", error);
    }

    return userMap;
}

// GET REVIEWS FOR PRODUCT 
export async function getReviewsByProductId(productId: number): Promise<ReviewWithAuthor[]> {
    // Fetch all reviews for this product (both top-level and replies)
    const allReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, productId))
        .orderBy(desc(reviews.createdAt))
        .limit(50);

    if (allReviews.length === 0) return [];

    // Collect all unique user IDs and resolve in batch
    const userIds = allReviews.map((r) => r.userId);
    const userMap = await resolveUserInfoBatch(userIds);

    // Build the threaded structure
    const reviewMap = new Map<number, ReviewWithAuthor>();
    const topLevel: ReviewWithAuthor[] = [];

    // First pass: create ReviewWithAuthor objects
    for (const review of allReviews) {
        const userInfo = userMap.get(review.userId) || { name: "Anonymous", avatar: null };

        const reviewWithAuthor: ReviewWithAuthor = {
            ...review,
            authorName: userInfo.name,
            authorAvatar: userInfo.avatar,
            replies: [],
        };

        reviewMap.set(review.id, reviewWithAuthor);
    }

    // Second pass: build tree structure
    for (const review of allReviews) {
        const reviewWithAuthor = reviewMap.get(review.id)!;

        if (review.parentId === null) {
            topLevel.push(reviewWithAuthor);
        } else {
            const parent = reviewMap.get(review.parentId);
            if (parent) {
                parent.replies.push(reviewWithAuthor);
            }
        }
    }

    // Sort replies within each top-level comment (oldest first for conversation flow)
    for (const review of topLevel) {
        review.replies.sort((a, b) => {
            const aTime = a.createdAt?.getTime() || 0;
            const bTime = b.createdAt?.getTime() || 0;
            return aTime - bTime;
        });
    }

    return topLevel;
}

// GET REVIEW COUNT 
export async function getReviewCountForProduct(productId: number): Promise<number> {
    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(reviews)
        .where(eq(reviews.productId, productId));

    return Number(result[0]?.count || 0);
}
