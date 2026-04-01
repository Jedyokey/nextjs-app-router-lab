"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db/index";
import { products, votes } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkRateLimit } from "@/lib/security/rate-limit";

type VoteResponse = {
    success: boolean;
    message: string;
    voteCount?: number;
};

export const toggleVoteAction = async (
  productId: number,
  action: "upvote" | "downvote"
): Promise<VoteResponse> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "You must be signed in to vote" };
    }

    // Apply rate limit: Max 10 toggles per minute (60 seconds)
    const rateLimit = checkRateLimit(`toggle_vote_${userId}`, 10, 60);
    if (!rateLimit.success) {
        return { success: false, message: rateLimit.message || "Too many requests" };
    }

    // Verify that the user has a verified email address
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const hasVerifiedEmail = user.emailAddresses.some(
        (email) => email.verification?.status === "verified"
    );

    if (!hasVerifiedEmail) {
        return { success: false, message: "Please verify your email address before voting." };
    }

    // Get current product
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product.length) {
      return { success: false, message: "Product not found" };
    }

    // Check existing vote
    const existingVote = await db
      .select()
      .from(votes)
      .where(
        and(
          eq(votes.productId, productId),
          eq(votes.userId, userId)
        )
      )
      .limit(1);

    const hasVoted = existingVote.length > 0;
    let newVoteCount = product[0].voteCount;

    // UPVOTE
    if (action === "upvote") {
      if (hasVoted) {
        // Remove vote
        await db
          .delete(votes)
          .where(
            and(
              eq(votes.productId, productId),
              eq(votes.userId, userId)
            )
          );
        
        const [updatedProduct] = await db
          .update(products)
          .set({ voteCount: sql`${products.voteCount} - 1` })
          .where(eq(products.id, productId))
          .returning({ voteCount: products.voteCount });

        newVoteCount = updatedProduct.voteCount;

        revalidatePath("/");
        revalidatePath(`/products/${productId}`);
        
        return { 
          success: true, 
          message: "Vote removed", 
          voteCount: newVoteCount 
        };
      } else {
        // Add vote
        await db.insert(votes).values({ productId, userId });
        
        const [updatedProduct] = await db
          .update(products)
          .set({ voteCount: sql`${products.voteCount} + 1` })
          .where(eq(products.id, productId))
          .returning({ voteCount: products.voteCount });

        newVoteCount = updatedProduct.voteCount;

        revalidatePath("/");
        revalidatePath(`/products/${productId}`);
        
        return { 
          success: true, 
          message: "Vote added!", 
          voteCount: newVoteCount 
        };
      }
    }

    // DOWNVOTE (remove only)
    if (action === "downvote") {
      if (!hasVoted) {
        return {
          success: false,
          message: "Can't downvote, upvote first to vote for this product",
        };
      }

      // Remove vote
      await db
        .delete(votes)
        .where(
          and(
            eq(votes.productId, productId),
            eq(votes.userId, userId)
          )
        );
      
      const [updatedProduct] = await db
        .update(products)
        .set({ voteCount: sql`${products.voteCount} - 1` })
        .where(eq(products.id, productId))
        .returning({ voteCount: products.voteCount });

      newVoteCount = updatedProduct.voteCount;

      revalidatePath("/");
      revalidatePath(`/products/${productId}`);
      
      return { 
        success: true, 
        message: "Vote removed", 
        voteCount: newVoteCount 
      };
    }

    return { success: false, message: "Invalid action" };
  } catch (error) {
    console.error("[toggleVoteAction]", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to process vote",
    };
  }
};