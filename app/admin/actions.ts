"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function approveProduct(productId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const isAdmin = user.publicMetadata?.isAdmin ?? false;

    if (!isAdmin) throw new Error("Unauthorized");

    await db
        .update(products)
        .set({
            status: "approved",
            approvedAt: new Date(),
            updatedAt: new Date()
        })
        .where(eq(products.id, productId));

    revalidatePath("/admin");
}

export async function rejectProduct(productId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const isAdmin = user.publicMetadata?.isAdmin ?? false;

    if (!isAdmin) throw new Error("Unauthorized");

    await db
        .update(products)
        .set({
            status: "rejected",
            updatedAt: new Date()
        })
        .where(eq(products.id, productId));

    revalidatePath("/admin");
}

export async function deleteProduct(productId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const isAdmin = user.publicMetadata?.isAdmin ?? false;

    if (!isAdmin) throw new Error("Unauthorized");

    await db
        .delete(products)
        .where(eq(products.id, productId));

    // Revalidate to force fresh data fetch
    revalidatePath("/admin");
}

export async function toggleFeatured(productId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const isAdmin = user.publicMetadata?.isAdmin ?? false;

    if (!isAdmin) throw new Error("Unauthorized");

    const product = await db
        .select({ featured: products.featured })
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

    if (!product.length) throw new Error("Product not found");

    await db
        .update(products)
        .set({
            featured: !product[0].featured,
            updatedAt: new Date()
        })
        .where(eq(products.id, productId));

    revalidatePath("/admin");
}

export async function approveRejectedProduct(productId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const isAdmin = user.publicMetadata?.isAdmin ?? false;

    if (!isAdmin) throw new Error("Unauthorized");

    await db
        .update(products)
        .set({
            status: "approved",
            approvedAt: new Date(),
            updatedAt: new Date()
        })
        .where(eq(products.id, productId));

    revalidatePath("/admin");
}

export async function rejectApprovedProduct(productId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const isAdmin = user.publicMetadata?.isAdmin ?? false;

    if (!isAdmin) throw new Error("Unauthorized");

    await db
        .update(products)
        .set({
            status: "rejected",
            updatedAt: new Date()
        })
        .where(eq(products.id, productId));

    revalidatePath("/admin");
}