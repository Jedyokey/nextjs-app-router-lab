"use server";

import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUnreadNotificationCount() {
    try {
        const { userId } = await auth();
        if (!userId) return 0;

        const results = await db
            .select()
            .from(notifications)
            .where(
                and(
                    eq(notifications.userId, userId),
                    eq(notifications.isRead, false)
                )
            );

        return results.length;
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return 0;
    }
}

export async function getUserNotifications() {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        const results = await db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt))
            .limit(50);

        return results;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
}

export async function markNotificationAsRead(notificationId: number) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await db
            .update(notifications)
            .set({ isRead: true })
            .where(
                and(
                    eq(notifications.id, notificationId),
                    eq(notifications.userId, userId)
                )
            );

        revalidatePath("/notifications");
        return { success: true };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { success: false };
    }
}

export async function markAllNotificationsAsRead() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await db
            .update(notifications)
            .set({ isRead: true })
            .where(
                and(
                    eq(notifications.userId, userId),
                    eq(notifications.isRead, false)
                )
            );

        revalidatePath("/notifications");
        return { success: true };
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return { success: false };
    }
}
