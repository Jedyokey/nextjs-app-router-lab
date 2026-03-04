"use client";

import { Button } from "@/components/ui/button";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOptimistic, useTransition } from "react";
import { toggleVoteAction } from "@/lib/products/vote-actions";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function VotingButtons({
    hasVoted: initialHasVoted,
    voteCount: initialVoteCount,
    productId, 
}: { 
    hasVoted: boolean;
    voteCount: number;
    productId: number;
}) {
    const [isPending, startTransition] = useTransition();
    
    const [optimisticState, setOptimisticState] = useOptimistic(
        { voteCount: initialVoteCount, hasVoted: initialHasVoted },
        (state, action: 'upvote' | 'downvote') => {
            if (action === 'upvote') {
                // Upvote toggles: add if not voted, remove if voted
                return {
                    voteCount: state.hasVoted ? state.voteCount - 1 : state.voteCount + 1,
                    hasVoted: !state.hasVoted
                };
            } else {
                // Downvote only removes if user has voted
                if (state.hasVoted) {
                    return {
                        voteCount: state.voteCount - 1,
                        hasVoted: false
                    };
                }
                return state; // No change if user hasn't voted
            }
        }
    );

    const handleUpvote = async () => {
        if (isPending) return;

        startTransition(async () => {
            // Optimistic update
            setOptimisticState('upvote');

            try {
                const result = await toggleVoteAction(productId, 'upvote');

                if (!result?.success) {
                    // Rollback on error
                    setOptimisticState('upvote');
                    toast.error(result?.message || "Failed to vote");
                } else {
                    toast.success(result.message);
                }
            } catch (error) {
                // Rollback on exception
                setOptimisticState('upvote');
                toast.error("Something went wrong");
            }
        });
    };

    const handleDownvote = async () => {
        if (isPending) return;

        // If user hasn't voted, show message and don't proceed
        if (!optimisticState.hasVoted) {
            toast.message("Can't downvote", {
                description: "Upvote first to vote for this product",
            });
            return;
        }

        // User has voted - remove their vote
        startTransition(async () => {
            // Optimistic update
            setOptimisticState('downvote');

            try {
                const result = await toggleVoteAction(productId, 'downvote');

                if (!result?.success) {
                    // Rollback on error
                    setOptimisticState('upvote');
                    toast.error(result?.message || "Failed to remove vote");
                } else {
                    toast.success(result.message);
                }
            } catch (error) {
                // Rollback on exception
                setOptimisticState('upvote');
                toast.error("Something went wrong");
            }
        });
    };

    return (
        <div 
            className="flex flex-col items-center gap-1 shrink-0" 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}>
            <Button
                onClick={handleUpvote}
                variant="ghost" 
                size="icon" 
                disabled={isPending}
                className={cn(
                    "h-8 w-8 rounded-full transition-all", 
                    optimisticState.hasVoted 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "hover:bg-primary/10 hover:text-primary"
                )} 
            >
                <ChevronUpIcon className="size-5" />
            </Button>
            
            <span className="text-sm font-semibold min-w-[20px] text-center">
                {isPending ? (
                    <Loader2Icon className="size-4 animate-spin mx-auto" />
                ) : (
                    optimisticState.voteCount
                )}
            </span>
            
            <Button
                onClick={handleDownvote} 
                variant="ghost" 
                size="icon" 
                disabled={isPending}
                className={cn(
                    "h-8 w-8 rounded-full transition-all",
                    optimisticState.hasVoted 
                        ? "text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer" 
                        : "text-muted-foreground opacity-50 cursor-not-allowed"
                )}
            >
                <ChevronDownIcon className="size-5" />
            </Button>
        </div>
    );
}