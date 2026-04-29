import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
    PackageIcon,
    UsersIcon,
    ThumbsUpIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "lucide-react";
import { db } from "@/db";
import { products, votes } from "@/db/schema";
import { count, eq, sql, desc } from "drizzle-orm";
import AdminStatsCards from "@/components/admin/admin-stats-cards";
import PendingApprovals from "@/components/admin/pending-approvals";
import RecentActivity from "@/components/admin/recent-activity";
import AllProductsTable from "@/components/admin/all-products-table";

export default async function AdminDashboard() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Verify admin status
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const isAdmin = user.publicMetadata?.isAdmin ?? false;

    if (!isAdmin) {
        redirect("/");
    }

    // Fetch stats
    const [totalProducts] = await db
        .select({ count: count() })
        .from(products);

    const [pendingApprovals] = await db
        .select({ count: count() })
        .from(products)
        .where(eq(products.status, "pending"));

    const [approvedProducts] = await db
        .select({ count: count() })
        .from(products)
        .where(eq(products.status, "approved"));

    const [rejectedProducts] = await db
        .select({ count: count() })
        .from(products)
        .where(eq(products.status, "rejected"));

    const [totalVotes] = await db
        .select({ count: count() })
        .from(votes);

    // Fetch pending products
    const pendingProducts = await db
        .select({
            id: products.id,
            slug: products.slug,
            name: products.name,
            tagline: products.tagline,
            description: products.description,
            submittedBy: products.submittedBy,
            createdAt: products.createdAt,
            voteCount: products.voteCount,
        })
        .from(products)
        .where(eq(products.status, "pending"))
        .orderBy(desc(products.createdAt))
        .limit(10);

    // Fetch all products for the table
    const allProducts = await db
        .select({
            id: products.id,
            slug: products.slug,
            name: products.name,
            tagline: products.tagline,
            description: products.description,
            submittedBy: products.submittedBy,
            createdAt: products.createdAt,
            voteCount: products.voteCount,
            featured: products.featured,
            status: products.status,
        })
        .from(products)
        .orderBy(desc(products.createdAt))
        .limit(50);

    // Fetch recent activity
    const recentProducts = await db
        .select({
            id: products.id,
            name: products.name,
            submittedBy: products.submittedBy,
            createdAt: products.createdAt,
            updatedAt: products.updatedAt,
            status: products.status,
        })
        .from(products)
        .orderBy(desc(products.updatedAt))
        .limit(10);

    // Fetch user counts from Clerk
    let totalUsers = 0;
    try {
        const usersList = await client.users.getUserList();
        totalUsers = usersList.totalCount;
    } catch (error) {
        console.error("Error fetching users:", error);
    }

    const stats = [
        {
            title: "Total Products",
            value: totalProducts?.count ?? 0,
            icon: PackageIcon,
            bg: "bg-chart-1/10",
            iconColor: "text-chart-1",
            change: `${totalProducts?.count ?? 0} products in database`,
        },
        {
            title: "Active Users",
            value: totalUsers,
            icon: UsersIcon,
            bg: "bg-chart-2/10",
            iconColor: "text-chart-2",
            change: `${totalUsers} registered users`,
        },
        {
            title: "Total Votes",
            value: totalVotes?.count ?? 0,
            icon: ThumbsUpIcon,
            bg: "bg-chart-1/10",
            iconColor: "text-chart-1",
            change: `${totalVotes?.count ?? 0} votes cast`,
        },
        {
            title: "Approved Products",
            value: approvedProducts?.count ?? 0,
            icon: CheckCircleIcon,
            bg: "bg-chart-2/10",
            iconColor: "text-chart-2",
            change: `${approvedProducts?.count ?? 0} approved`,
        },
        {
            title: "Pending Approvals",
            value: pendingApprovals?.count ?? 0,
            icon: ClockIcon,
            bg: "bg-yellow-500/10",
            iconColor: "text-yellow-600 dark:text-yellow-500",
            change: pendingApprovals?.count ?? 0 > 0
                ? `${pendingApprovals?.count} products need review`
                : "All clear",
        },
        {
            title: "Rejected Products",
            value: rejectedProducts?.count ?? 0,
            icon: XCircleIcon,
            bg: "bg-destructive/10",
            iconColor: "text-destructive",
            change: `${rejectedProducts?.count ?? 0} rejected`,
        },
    ];

    return (
        <div className="space-y-8">
            <AdminStatsCards stats={stats} />

            <PendingApprovals products={pendingProducts} />

            <AllProductsTable products={allProducts} />

            <RecentActivity products={recentProducts} />
        </div>
    );
}