"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function searchUsersForMention(query: string): Promise<
    { userId: string; name: string; avatar: string | null }[]
> {
    if (!query || query.length < 2) return [];

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
