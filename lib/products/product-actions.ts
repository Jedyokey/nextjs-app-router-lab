"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db/index";
import { products } from "@/db/schema";
import { productSchema } from "./product-validations";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type FormState = {
    success: boolean;
    error?: Record<string, string[]>;
    message: string;
}

export const addProductAction = async (
    prevState: FormState, 
    formData: FormData
) => {
    console.log(formData);
    // auth

    try {
        const { userId, orgId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to submit a product",
            };
        };

        if (!orgId) {
            return {
                success: false,
                message: "You must be a member of an organization to submit a product",
            };
        };

        // data
        const user = await currentUser();
        const userEmail = user?.primaryEmailAddress?.emailAddress || "anonymous";

        const rawFormData = Object.fromEntries(formData.entries());

        // validate the data
        const validatedData = productSchema.safeParse(rawFormData);

        if (!validatedData.success) {
            console.log(validatedData.error.flatten().fieldErrors);
            return {
                success: false,
                error: validatedData.error.flatten().fieldErrors,
                message: "Invalid data",
            };
        }
        const { name, slug, tagline, description, websiteUrl, tags } = validatedData.data;

        const tagsArray = tags ? tags.filter((tag) => typeof tag === "string") : [];

        // Transform the data
        await db.insert(products).values({
            name,
            slug,
            tagline,
            description,
            websiteUrl,
            tags: tagsArray,
            status: "pending",
            submittedBy: userEmail,
            organizationId: orgId,
            userId,
        });
        revalidatePath("/"); // Revalidate cache to show new product
        return {
            success: true,
            message: "Product submitted successfully! It will be reviewed shortly.",
        }

    } catch (error) {
        return {
            success: false,
            // error: error,
            message: "Failed to submit product",
        };
    }
}

export const upvoteProductAction = async (productId: number) => {
    try {
        const { userId, orgId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to upvote a product",
            };
        };
        if (!orgId) {
            return {
                success: false,
                message: "You must be a member of an organization to submit a product",
            };
        };

        await db.update(products)
            .set({ voteCount: sql`GREATEST(0, vote_count + 1)`,})
            .where(eq(products.id, productId));

        revalidatePath("/"); // Revalidate the product page
        
        return {
            success: true,
            message: "Product upvoted successfully!",
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to upvote product",
            voteCount: 0,
        }
    }
}

export const downvoteProductAction = async (productId: number) => {
    try {
        const { userId, orgId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to upvote a product",
            };
        };
        if (!orgId) {
            return {
                success: false,
                message: "You must be a member of an organization to submit a product",
            };
        };

        await db.update(products)
            .set({ voteCount: sql`GREATEST(0, vote_count - 1)`,})
            .where(eq(products.id, productId));

        revalidatePath("/");
        
        return {
            success: true,
            message: "Product downvoted successfully!",
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to upvote product",
            voteCount: 0,
        }
    }
}