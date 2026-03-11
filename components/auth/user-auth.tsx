'use client';

import { Suspense } from "react";
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
import { SparklesIcon, LoaderIcon, BuildingIcon, ShieldIcon } from "lucide-react";

export function UserAuth() {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.isAdmin === true;

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
                <Button asChild>
                    <Link href="/submit">
                        <SparklesIcon className="size-4" /> Submit Project
                    </Link>
                </Button>

                <UserButton>
                    {isAdmin && (
                        <UserButton.MenuItems>
                            <UserButton.Link
                                label="Admin Dashboard"
                                labelIcon={<ShieldIcon className="size-4" />}
                                href="/admin"
                            />
                        </UserButton.MenuItems>
                    )}
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
            </SignedIn>
        </Suspense>
    );
}
