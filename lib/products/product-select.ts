import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getFeaturedProducts() {
    const productsData = await db
        .select()
        .from(products)
        .orderBy(desc(products.voteCount))
        .where(eq(products.status, "approved")); // Only fetch approved products

    console.log(productsData);

    return productsData;
}

export async function getRecentlyLaunchedProducts() {
    const productsData = await getFeaturedProducts();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return productsData.filter(
        (products) => products.createdAt && 
        new Date(products.createdAt.toISOString()) >= oneWeekAgo
    );
}