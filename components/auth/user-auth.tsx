'use client';

import { Suspense, useEffect, useState } from "react";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
    OrganizationSwitcher,
    useUser
} from '@clerk/nextjs';
import { Button } from "../ui/button";
import Link from "next/link";
import { SparklesIcon, LoaderIcon, BuildingIcon, ShieldIcon, BellIcon } from "lucide-react";
import { getUnreadNotificationCount } from "@/lib/notifications/actions";

export function UserAuth() {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.isAdmin === true;
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        if (!user) return;
        const fetchUnread = async () => {
            const count = await getUnreadNotificationCount();
            setUnread(count);
        };
        
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000); // 30s polling
        return () => clearInterval(interval);
    }, [user]);

    return (
        <Suspense
            fallback={
                <div>
                    <LoaderIcon className="size-4 animate-spin" />
                </div>
            }
        >
            <SignedOut>
                <SignInButton>
                    <span className="cursor-pointer">Sign In</span>
                </SignInButton>
                <SignUpButton>
                    <Button className="cursor-pointer">Sign Up</Button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                <Button asChild className="h-8 px-3 text-xs min-[400px]:h-9 min-[400px]:px-4 min-[400px]:text-sm">
                    <Link href="/submit">
                        <SparklesIcon className="size-3.5 min-[400px]:size-4" /> 
                        <span className="hidden min-[400px]:inline">Submit Project</span>
                        <span className="min-[400px]:hidden">Submit</span>
                    </Link>
                </Button>

                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Desktop Bell (Hidden on mobile) */}
                    <Link href="/notifications" className="hidden md:flex relative p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors" title="Notifications">
                        <BellIcon className="size-5" />
                        {unread > 0 && (
                            <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                        )}
                    </Link>

                    {/* Clerk Profile (With mobile red dot) */}
                    <div className="relative flex items-center">
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label={unread > 0 ? `Notifications (${unread})` : "Notifications"}
                                    labelIcon={<BellIcon className="size-4" />}
                                    href="/notifications"
                                />
                                {isAdmin && (
                                    <UserButton.Link
                                        label="Admin Dashboard"
                                        labelIcon={<ShieldIcon className="size-4" />}
                                        href="/admin"
                                    />
                                )}
                            </UserButton.MenuItems>
                            <UserButton.UserProfilePage
                                label="Organizations"
                                labelIcon={<BuildingIcon className="size-4" />}
                                url="/organizations">
                                <div className="p-4">
                                    <h2>Manage Organization</h2>
                                    <OrganizationSwitcher
                                        hidePersonal={true}
                                        afterCreateOrganizationUrl={"/submit"}
                                        afterSelectPersonalUrl={"/submit"}
                                        appearance={{
                                            elements: {
                                                rootBox: "w-full",
                                            },
                                        }} />
                                </div>
                            </UserButton.UserProfilePage>
                        </UserButton>
                        
                        {/* Mobile Red Dot over UserButton */}
                        {unread > 0 && (
                            <span className="md:hidden absolute top-0 -right-0.5 size-2.5 rounded-full bg-red-500 ring-2 ring-background animate-pulse pointer-events-none" />
                        )}
                    </div>
                </div>
            </SignedIn>
        </Suspense>
    );
}
