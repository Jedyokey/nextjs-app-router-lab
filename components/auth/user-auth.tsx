'use client';

import { Suspense } from "react";
import { 
    SignInButton, 
    SignUpButton, 
    SignedIn, 
    SignedOut, 
    UserButton,
    OrganizationSwitcher
} from '@clerk/nextjs';
import { Button } from "../ui/button";
import Link from "next/link";
import { SparklesIcon, LoaderIcon, BuildingIcon } from "lucide-react";

export function UserAuth() {
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
