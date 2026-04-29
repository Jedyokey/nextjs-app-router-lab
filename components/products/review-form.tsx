"use client";

import { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon, SendIcon } from "lucide-react";
import { submitReviewAction } from "@/lib/products/review-actions";
import { toast } from "sonner";
import StarRating from "./star-rating";
import MentionAutocomplete from "./mention-autocomplete";
import {
    SignInButton,
    SignedIn,
    SignedOut,
} from "@clerk/nextjs";
import { encodeMentions, MentionData } from "@/lib/products/format-utils";

interface ReviewFormProps {
    productId: number;
    parentId?: number;
    isReply?: boolean;
    onCancel?: () => void;
    onSuccess?: () => void;
    replyToName?: string;
}

export default function ReviewForm({
    productId,
    parentId,
    isReply = false,
    onCancel,
    onSuccess,
    replyToName,
}: ReviewFormProps) {
    const [content, setContent] = useState(
        replyToName ? `@${replyToName} ` : ""
    );
    const [selectedMentions, setSelectedMentions] = useState<MentionData[]>([]);
    const [rating, setRating] = useState(0);
    const [isPending, startTransition] = useTransition();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const charLimit = 2000;

    const handleSubmit = () => {
        if (!content.trim()) {
            toast.error("Please write a comment");
            return;
        }

        startTransition(async () => {
            try {
                const encodedContent = encodeMentions(content.trim(), selectedMentions);
                
                const result = await submitReviewAction(
                    productId,
                    encodedContent,
                    !isReply && rating > 0 ? rating : undefined,
                    parentId
                );

                if (result.success) {
                    toast.success(result.message);
                    setContent("");
                    setSelectedMentions([]);
                    setRating(0);
                    onSuccess?.();
                } else {
                    toast.error(result.message);
                }
            } catch {
                toast.error("Something went wrong");
            }
        });
    };

    return (
        <>
            <SignedOut>
                <div className="border border-dashed border-border rounded-xl p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                        Sign in to leave a {isReply ? "reply" : "review"}
                    </p>
                    <SignInButton>
                        <Button variant="outline" size="sm" className="cursor-pointer">
                            Sign In
                        </Button>
                    </SignInButton>
                </div>
            </SignedOut>

            <SignedIn>
                <div className={`
                    border border-border rounded-xl overflow-hidden transition-all
                    focus-within:border-primary/50 focus-within:shadow-sm
                    ${isReply ? "bg-background" : "bg-card"}
                `}>
                    {/* Star rating (top-level only) */}
                    {!isReply && (
                        <div className="px-4 pt-4 pb-2 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Rating</span>
                                <StarRating
                                    value={rating}
                                    onChange={setRating}
                                    size="md"
                                />
                                {rating > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setRating(0)}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Comment input */}
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={
                                isReply
                                    ? "Write a reply... Use @ to mention someone"
                                    : "Share your thoughts about this product... Use @ to mention someone"
                            }
                            rows={isReply ? 2 : 3}
                            maxLength={charLimit}
                            disabled={isPending}
                            className="w-full px-4 py-3 bg-transparent text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none disabled:opacity-50"
                        />

                        {/* Mention autocomplete dropdown */}
                        <div className="relative px-4">
                            <MentionAutocomplete
                                inputRef={textareaRef}
                                onSelect={(user) => {
                                    const handle = user.name;
                                    setSelectedMentions(prev => {
                                        if (prev.some(m => m.id === user.userId)) return prev;
                                        return [...prev, { id: user.userId, name: user.name, handle }];
                                    });
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer with char count + submit */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-border/50">
                        <span
                            className={`text-xs transition-colors ${
                                content.length > charLimit * 0.9
                                    ? "text-destructive"
                                    : "text-muted-foreground/50"
                            }`}
                        >
                            {content.length}/{charLimit}
                        </span>

                        <div className="flex items-center gap-2">
                            {isReply && onCancel && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onCancel}
                                    disabled={isPending}
                                    className="text-xs h-7"
                                >
                                    Cancel
                                </Button>
                            )}

                            <Button
                                type="button"
                                size="sm"
                                onClick={handleSubmit}
                                disabled={isPending || !content.trim()}
                                className="h-7 gap-1.5 text-xs cursor-pointer"
                            >
                                {isPending ? (
                                    <Loader2Icon className="size-3 animate-spin" />
                                ) : (
                                    <SendIcon className="size-3" />
                                )}
                                {isReply ? "Reply" : "Post"}
                            </Button>
                        </div>
                    </div>
                </div>
            </SignedIn>
        </>
    );
}
