import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getFeaturedProducts() {
    "use cache";

    const productsData = await db
        .select()
        .from(products)
        .orderBy(desc(products.voteCount))
        .where(eq(products.status, "approved")); // Only fetch approved products

    console.log(productsData);

    return productsData;
}

export async function getAllProducts() {
    const productsData = await db
        .select()
        .from(products)
        .orderBy(desc(products.voteCount))
        .where(eq(products.status, "approved")); // Only fetch approved products
    return productsData;
}

export async function getRecentlyLaunchedProducts() {
    const productsData = await getAllProducts();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return productsData.filter(
        (product) => product.createdAt && 
        new Date(product.createdAt) >= oneWeekAgo
    );
}