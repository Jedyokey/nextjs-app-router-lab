import { db } from "@/db";
import { products, votes } from "@/db/schema";
import { desc, eq, and, sql } from "drizzle-orm";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getProductsWithVoteStatus() {
    const { userId } = await auth();
    
    const productsData = await db
        .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            tagline: products.tagline,
            description: products.description,
            websiteUrl: products.websiteUrl,
            tags: products.tags,
            voteCount: products.voteCount,
            status: products.status,
            createdAt: products.createdAt,
            hasVoted: userId 
                ? sql<boolean>`EXISTS(
                    SELECT 1 FROM ${votes} 
                    WHERE ${votes.productId} = ${products.id} 
                    AND ${votes.userId} = ${userId}
                )`
                : sql<boolean>`false`
        })
        .from(products)
        .where(eq(products.status, "approved"))
        .orderBy(desc(products.voteCount));

    return productsData;
}

// Helper function to format email as fallback
function formatUsername(email: string | null) {
    if (!email) return "Community";
    const username = email.split('@')[0].replace(/[0-9]/g, '');
    // Try to split camelCase or common separators
    return username
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(/[._-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();
}

export async function getProductBySlug(slug: string) {
    const { userId } = await auth();
    
    // Get the product data
    const product = await db
        .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            tagline: products.tagline,
            description: products.description,
            websiteUrl: products.websiteUrl,
            tags: products.tags,
            voteCount: products.voteCount,
            status: products.status,
            createdAt: products.createdAt,
            approvedAt: products.approvedAt,
            submittedBy: products.submittedBy,
            userId: products.userId,
            organizationId: products.organizationId,
        })
        .from(products)
        .where(
            and(
                eq(products.slug, slug),
                eq(products.status, "approved")
            )
        )
        .limit(1);

    if (!product[0]) {
        return null;
    }

    // Await clerkClient() first, then access users
    let submitterDisplayName = null;
    if (product[0].userId) {
        try {
            const client = await clerkClient(); // Await the function call
            const clerkUser = await client.users.getUser(product[0].userId); 
            
            // Combine first and last name if available
            const firstName = clerkUser.firstName || "";
            const lastName = clerkUser.lastName || "";
            submitterDisplayName = `${firstName} ${lastName}`.trim() || null;
        } catch (error) {
            console.error("Error fetching Clerk user:", error);
        }
    }

    // Check if user has voted
    let hasVoted = false;
    if (userId) {
        const vote = await db
            .select()
            .from(votes)
            .where(
                and(
                    eq(votes.productId, product[0].id),
                    eq(votes.userId, userId)
                )
            )
            .limit(1);
        
        hasVoted = vote.length > 0;
    }

    // Return product with vote status and formatted display name
    return {
        ...product[0],
        hasVoted,
        // Use Clerk name if available, otherwise fallback to formatted email
        submitterDisplayName: submitterDisplayName || formatUsername(product[0].submittedBy),
    };
}