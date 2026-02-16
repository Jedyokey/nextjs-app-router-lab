"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
// import { z } from "zod";
import { db } from "@/db/index";
import { products } from "@/db/schema";
import { productSchema } from "./product-validations";

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
        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to submit a product",
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
            submittedBy: "",
            userId,
        });

        return {
            success: true,
            message: "Product submitted successfully! It will be reviewed shortly.",
        }

    } catch (error) {
        console.error(error);

        // if (error instanceof z.ZodError) {
        //     return {
        //         success: false,
        //         error: error.flatten().fieldErrors,
        //         message: "Validation failed. Please check your input and try again",
        //     };
        // }

        return {
            success: false,
            // error: error,
            message: "Failed to submit product",
        };
    }
}