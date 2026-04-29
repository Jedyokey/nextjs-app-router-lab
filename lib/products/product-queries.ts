import { db } from "@/db";
import { products, votes } from "@/db/schema";
import { desc, eq, and, sql } from "drizzle-orm";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { formatUsername } from "@/lib/products/format-utils";

interface UserMetadata {
    isAdmin?: boolean;
}

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
            featured: products.featured,
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

export async function getProductBySlug(slug: string, adminPreview: boolean = false) {
    const { userId } = await auth();
    
    // Check if user is admin when adminPreview is enabled
    let isAdmin = false;
    if (adminPreview && userId) {
        try {
            const client = await clerkClient();
            const user = await client.users.getUser(userId);
            const metadata = user.publicMetadata as UserMetadata;
            isAdmin = metadata?.isAdmin ?? false;
        } catch (error) {
            console.error("Error fetching admin status:", error);
        }
    }
    
    // Get the product data
    const whereCondition = adminPreview && isAdmin 
        ? eq(products.slug, slug)
        : and(
            eq(products.slug, slug),
            eq(products.status, "approved")
        );
    
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
            featured: products.featured,
            status: products.status,
            createdAt: products.createdAt,
            approvedAt: products.approvedAt,
            submittedBy: products.submittedBy,
            userId: products.userId,
            organizationId: products.organizationId,
        })
        .from(products)
        .where(whereCondition)
        .limit(1);

    if (!product[0]) {
        return null;
    }

    // Await clerkClient() first, then access users
    let submitterDisplayName = null;
    if (product[0].userId) {
        try {
            const client = await clerkClient();
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
        submitterDisplayName: submitterDisplayName || formatUsername(product[0].submittedBy),
    };
}