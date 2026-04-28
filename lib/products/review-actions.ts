"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db/index";
import { reviews, notifications, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { reviewSchema } from "@/lib/products/review-validations";
import { getReviewsByProductId } from "@/lib/products/review-queries";
import { checkRateLimit } from "@/lib/security/rate-limit";

type ReviewResponse = {
    success: boolean;
    message: string;
};

// SUBMIT REVIEW 
export const submitReviewAction = async (
    productId: number,
    content: string,
    rating?: number,
    parentId?: number
): Promise<ReviewResponse> => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, message: "You must be signed in to comment" };
        }

        // Apply rate limit: Max 5 comments per minute (60 seconds)
        const rateLimit = checkRateLimit(`submit_comment_${userId}`, 5, 60);
        if (!rateLimit.success) {
            return { success: false, message: rateLimit.message || "Too many requests" };
        }

        // Validate input
        const parsed = reviewSchema.safeParse({ content, rating, parentId });
        if (!parsed.success) {
            const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
            return { success: false, message: firstError || "Invalid input" };
        }

        // If it's a reply, don't allow rating
        if (parentId && rating) {
            return { success: false, message: "Replies cannot have ratings" };
        }

        // If it's a reply, verify parent exists and enforce max 2 levels
        if (parentId) {
            const parent = await db
                .select({ id: reviews.id, parentId: reviews.parentId })
                .from(reviews)
                .where(eq(reviews.id, parentId))
                .limit(1);

            if (!parent[0]) {
                return { success: false, message: "Parent comment not found" };
            }

            // If parent already has a parent, this would be level 3 — block it
            if (parent[0].parentId !== null) {
                return { success: false, message: "Cannot reply deeper than 2 levels" };
            }
        }

        // Parse @mentions from content
        const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
        const rawMentions: string[] = [];
        let match;
        while ((match = mentionRegex.exec(content)) !== null) {
            rawMentions.push(match[2]); // Clerk user ID
        }

        // Verify each extracted ID is a real Clerk user before storing
        const client = await clerkClient();
        const verifiedMentions: string[] = [];
        for (const id of [...new Set(rawMentions)]) {
            try {
                await client.users.getUser(id);
                verifiedMentions.push(id);
            } catch { /* not a real user ID — discard */ }
        }

        const [newReview] = await db.insert(reviews).values({
            productId,
            userId,
            content,
            rating: parentId ? null : (rating || null),
            parentId: parentId || null,
            mentions: verifiedMentions.length > 0 ? verifiedMentions : null,
        }).returning({ id: reviews.id });

        if (verifiedMentions.length > 0) {
            // Get product slug to build link
            const product = await db.select({ slug: products.slug }).from(products).where(eq(products.id, productId)).limit(1);
            if (product.length > 0) {
                let username = "Someone";
                try {
                    const currentUser = await client.users.getUser(userId);
                    username = currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim() : "Someone";
                } catch { /* keep default */ }

                const link = `/products/${product[0].slug}#review-${newReview.id}`;

                // Map verified mentions to notification records
                const notificationValues = verifiedMentions
                    .filter(mentionId => mentionId !== userId) // don't notify self
                    .map(mentionedUser => ({
                        userId: mentionedUser,
                        type: "mention",
                        message: `${username} mentioned you in a comment.`,
                        link: link,
                    }));

                if (notificationValues.length > 0) {
                    await db.insert(notifications).values(notificationValues);
                }
            }
        }

        revalidatePath("/", "layout");
        revalidatePath("/products", "layout");

        return { success: true, message: parentId ? "Reply posted!" : "Review posted!" };
    } catch (error) {
        console.error("[submitReviewAction]", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to post comment",
        };
    }
};

// DELETE REVIEW 
export const deleteReviewAction = async (
    reviewId: number
): Promise<ReviewResponse> => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, message: "You must be signed in" };
        }

        // Check if user is admin
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const isAdmin = user.publicMetadata?.isAdmin === true;

        // Check ownership
        const review = await db
            .select({ userId: reviews.userId })
            .from(reviews)
            .where(eq(reviews.id, reviewId))
            .limit(1);

        if (!review[0]) {
            return { success: false, message: "Comment not found" };
        }

        if (review[0].userId !== userId && !isAdmin) {
            return { success: false, message: "You can only delete your own comments" };
        }

        // Delete replies then the review itself atomically
        await db.transaction(async (tx) => {
            await tx.delete(reviews).where(eq(reviews.parentId, reviewId));
            await tx.delete(reviews).where(eq(reviews.id, reviewId));
        });

        revalidatePath("/", "layout");
        revalidatePath("/products", "layout");

        return { success: true, message: "Comment deleted" };
    } catch (error) {
        console.error("[deleteReviewAction]", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete comment",
        };
    }
};

// EDIT REVIEW 
export const editReviewAction = async (
    reviewId: number,
    content: string,
    rating?: number
): Promise<ReviewResponse> => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, message: "You must be signed in" };
        }

        // Apply rate limit: Max 10 edits per minute
        const rateLimit = checkRateLimit(`edit_review_${userId}`, 10, 60);
        if (!rateLimit.success) {
            return { success: false, message: rateLimit.message || "Too many requests" };
        }

        // Validate
        const parsed = reviewSchema.safeParse({ content, rating });
        if (!parsed.success) {
            const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
            return { success: false, message: firstError || "Invalid input" };
        }

        // Check ownership and get review details
        const review = await db
            .select({ userId: reviews.userId, parentId: reviews.parentId })
            .from(reviews)
            .where(eq(reviews.id, reviewId))
            .limit(1);

        if (!review[0]) {
            return { success: false, message: "Comment not found" };
        }

        if (review[0].userId !== userId) {
            return { success: false, message: "You can only edit your own comments" };
        }

        // Re-parse @mentions
        const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
        const mentions: string[] = [];
        let match;
        while ((match = mentionRegex.exec(content)) !== null) {
            mentions.push(match[2]);
        }

        await db
            .update(reviews)
            .set({
                content,
                rating: review[0].parentId ? null : (rating || null),
                mentions: mentions.length > 0 ? mentions : null,
                updatedAt: new Date(),
            })
            .where(eq(reviews.id, reviewId));

        revalidatePath("/", "layout");
        revalidatePath("/products", "layout");

        return { success: true, message: "Comment updated" };
    } catch (error) {
        console.error("[editReviewAction]", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to update comment",
        };
    }
};

// FETCH LIVE REVIEWS 
export const fetchLiveReviewsAction = async (productId: number) => {
    try {
        const reviews = await getReviewsByProductId(productId);
        return { success: true, reviews };
    } catch (error) {
        console.error("[fetchLiveReviewsAction]", error);
        return { success: false, reviews: [] };
    }
};
