import { z } from "zod";

export const productSchema = z.object({
    name: z.string()
        .min(3, { message: "Product name is required and must be at least 3 characters" })
        .max(120, { message: "Product name must be less than 120 characters" }),
    slug: z.string()
        .min(3, { message: "Slug is required and must be at least 3 characters" })
        .max(150, { message: "Slug must be less than 150 characters" })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 
            { message: "Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)" }),
    tagline: z.string()
        .min(3, "Tagline is required")
        .max(200, { message: "Tagline must be less than 200 characters" }),
    description: z.string()
        .max(1000, { message: "Description must be less than 1000 characters" })
        .optional(),
    websiteUrl: z.string()
        .min(1, { message: "Website URL is required" })
        .url({ message: "Invalid URL" }),
    tags: z.string()
        .transform((val) =>
            val.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean)
        )
        .refine((arr) => arr.length > 0, {
            message: "At least one valid tag is required",
        }),
});