import { getProductsWithVoteStatus } from "./product-queries";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getFeaturedProducts() {
    const products = await getProductsWithVoteStatus();
    return products; // Already ordered by voteCount from the query
}

export async function getAllProducts() {
    const products = await getProductsWithVoteStatus();
    return products;
}

// helper types
export type ProductFetchItem = Awaited<ReturnType<typeof getAllProducts>> extends
    Array<infer T>
    ? T
    : never;

export async function getRecentlyLaunchedProducts() {
    const products = await getProductsWithVoteStatus();
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return products.filter(
        (product) => product.createdAt && 
        new Date(product.createdAt) >= oneWeekAgo
    );
}

// This does NOT call Clerk's auth() and returns only the product ids.
export async function getProductIdsForParams() {
    "use cache";
    const rows = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.status, "approved"))
        .orderBy(desc(products.voteCount));

    return rows.map((r) => r.id);
}