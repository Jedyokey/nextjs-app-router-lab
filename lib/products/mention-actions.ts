"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function searchUsersForMention(query: string): Promise<
    { userId: string; name: string; avatar: string | null }[]
> {
    if (!query || query.length < 2) return [];

    const { userId } = await auth();
    if (!userId) return [];

    const rateLimit = checkRateLimit(`mention_search_${userId}`, 30, 60);
    if (!rateLimit.success) return [];

    try {
        const client = await clerkClient();
        const users = await client.users.getUserList({
            query,
            limit: 5,
        });

        return users.data.map((user) => ({
            userId: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown",
            avatar: user.imageUrl || null,
        }));
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
    }
}
