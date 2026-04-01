import { z } from "zod";

export const reviewSchema = z.object({
    content: z
        .string()
        .min(1, "Comment cannot be empty")
        .max(2000, "Comment must be under 2000 characters"),
    rating: z
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5")
        .optional(),
    parentId: z.number().optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
