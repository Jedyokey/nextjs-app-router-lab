"use client";

import { useEffect, useState } from "react";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/notifications/actions";
import { BellIcon, CheckIcon, CheckCircle2Icon, ExternalLinkIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define local matching type for component usage since original type isn't exported directly from schema queries
type NotificationData = {
    id: number;
    userId: string;
    type: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: Date | null;
};

function timeAgo(date: Date | null): string {
    if (!date) return "";
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchNotifs = async () => {
            const data = await getUserNotifications();
            // Need to safely cast dates if they cross server boundary as strings (typical in some Next setups)
            const typedData = data.map(n => ({
                ...n,
                createdAt: n.createdAt ? new Date(n.createdAt) : null
            }));
            setNotifications(typedData);
            setLoading(false);
        };
        fetchNotifs();
    }, []);

    const handleMarkAllRead = async () => {
        const res = await markAllNotificationsAsRead();
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success("All notifications marked as read");
        }
    };

    const handleNotificationClick = async (notif: NotificationData) => {
        if (!notif.isRead) {
            await markNotificationAsRead(notif.id);
            // Optimistically update local state so if they return to page, it reflects
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
        }

        if (notif.link) {
            router.push(notif.link);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="container max-w-3xl mx-auto py-12 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/10 flex items-center justify-center rounded-xl shrink-0">
                        <BellIcon className="size-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            You have {unreadCount} unread message{unreadCount !== 1 && "s"}.
                        </p>
                    </div>
                </div>

                {notifications.length > 0 && unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors"
                    >
                        <CheckCircle2Icon className="size-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2Icon className="size-8 animate-spin mb-4" />
                    <p>Loading notifications...</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="py-24 text-center rounded-2xl border border-dashed border-border bg-muted/10 relative overflow-hidden">
                    <div className="size-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4 relative z-10">
                        <BellIcon className="size-10 text-muted-foreground opacity-50" />
                        <div className="absolute top-0 right-0 size-6 bg-background rounded-full flex items-center justify-center">
                            <CheckIcon className="size-4 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground relative z-10">You're all caught up!</h2>
                    <p className="text-muted-foreground mt-1 max-w-sm mx-auto relative z-10">
                        There are no new notifications waiting for you at the moment.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                                notif.isRead 
                                    ? "bg-card border-border hover:bg-muted/30" 
                                    : "bg-primary/5 border-primary/20 hover:bg-primary/10 shadow-sm"
                            }`}
                        >
                            <div className="shrink-0 mt-0.5 relative">
                                <div className={`size-10 rounded-full flex items-center justify-center ${notif.isRead ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
                                    <BellIcon className="size-5" />
                                </div>
                                {!notif.isRead && (
                                    <div className="absolute -top-1 -right-1 size-3.5 bg-red-500 rounded-full border-2 border-background" />
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-sm sm:text-base pr-4 ${notif.isRead ? "text-foreground font-medium" : "text-foreground font-semibold"}`}>
                                    {notif.message}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-2">
                                    {timeAgo(notif.createdAt)}
                                    {notif.link && (
                                        <span className="flex items-center gap-1 text-primary/80">
                                            <span className="shrink-0 size-1 bg-primary/30 rounded-full" />
                                            <span className="hover:underline">View link</span>
                                            <ExternalLinkIcon className="size-2.5" />
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
