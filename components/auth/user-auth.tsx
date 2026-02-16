'use client';

import { Suspense } from "react";
import { 
    SignInButton, 
    SignUpButton, 
    SignedIn, 
    SignedOut, 
    UserButton 
} from '@clerk/nextjs';
import { Button } from "../ui/button";
import Link from "next/link";
import { SparklesIcon, LoaderIcon } from "lucide-react";

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
                <SignInButton />
                <SignUpButton>
                    <Button>Sign Up</Button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                <Button asChild>
                    <Link href="/submit">
                        <SparklesIcon className="size-4" /> Submit Project
                    </Link>
                </Button>
                <UserButton />
            </SignedIn>
        </Suspense>
    );
}
