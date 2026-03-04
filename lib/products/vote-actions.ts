"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/index";
import { products, votes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
        
        newVoteCount = product[0].voteCount - 1;
        
        await db
          .update(products)
          .set({ voteCount: newVoteCount })
          .where(eq(products.id, productId));

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
        
        newVoteCount = product[0].voteCount + 1;
        
        await db
          .update(products)
          .set({ voteCount: newVoteCount })
          .where(eq(products.id, productId));

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
      
      newVoteCount = product[0].voteCount - 1;
      
      await db
        .update(products)
        .set({ voteCount: newVoteCount })
        .where(eq(products.id, productId));

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