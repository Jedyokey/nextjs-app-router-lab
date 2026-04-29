"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { 
    MessageCircleIcon, 
    Trash2Icon, 
    PencilIcon, 
    Loader2Icon,
    CornerDownRightIcon,
    CheckIcon,
    XIcon,
} from "lucide-react";
import { deleteReviewAction, editReviewAction } from "@/lib/products/review-actions";
import { toast } from "sonner";
import StarRating from "./star-rating";
import ReviewForm from "./review-form";
import type { ReviewWithAuthor } from "@/lib/products/review-queries";
import { useUser } from "@clerk/nextjs";
import { decodeMentions, encodeMentions, MentionData } from "@/lib/products/format-utils";

interface ReviewCardProps {
    review: ReviewWithAuthor;
    productId: number;
    depth?: number;
}

// Render @mentions as highlighted spans
function renderContent(content: string) {
    // Pattern: @[DisplayName](userId)
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
        // Add text before this mention
        if (match.index > lastIndex) {
            parts.push(content.slice(lastIndex, match.index));
        }

        // Add the highlighted mention
        parts.push(
            <span
                key={match.index}
                className="text-primary font-medium bg-primary/10 px-1 rounded"
            >
                @{match[1]}
            </span>
        );

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
        parts.push(content.slice(lastIndex));
    }

    return parts.length > 0 ? parts : content;
}

// Relative time display
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

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export default function ReviewCard({ review, productId, depth = 0 }: ReviewCardProps) {
    const { user } = useUser();
    const isOwner = user?.id === review.userId;
    const isAdmin = user?.publicMetadata?.isAdmin === true;
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [{ text: initialText, mentions: initialMentions }] = useState(() => decodeMentions(review.content));
    const [editContent, setEditContent] = useState(initialText);
    const [editMentions, setEditMentions] = useState<MentionData[]>(initialMentions);
    const [editRating, setEditRating] = useState(review.rating || 0);
    const [isDeleting, startDeleteTransition] = useTransition();
    const [isSavingEdit, startEditTransition] = useTransition();

    // Max depth = 1 (top-level + 1 reply level)
    const canReply = depth < 1;

    const handleDelete = () => {
        startDeleteTransition(async () => {
            try {
                const result = await deleteReviewAction(review.id);
                if (result.success) {
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            } catch {
                toast.error("Failed to delete comment");
            }
        });
    };

    const handleEditSave = () => {
        if (!editContent.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        startEditTransition(async () => {
            try {
                const encodedContent = encodeMentions(editContent.trim(), editMentions);
                const result = await editReviewAction(
                    review.id,
                    encodedContent,
                    !review.parentId && editRating > 0 ? editRating : undefined
                );

                if (result.success) {
                    toast.success(result.message);
                    setIsEditing(false);
                } else {
                    toast.error(result.message);
                }
            } catch {
                toast.error("Failed to update comment");
            }
        });
    };

    return (
        <div className={`${depth > 0 ? "ml-8 pl-4 border-l-2 border-border/50" : ""}`}>
            <div className="group py-4">
                {/* Author row */}
                <div className="flex items-center gap-2.5 mb-2">
                    {review.authorAvatar ? (
                        <img
                            src={review.authorAvatar}
                            alt={review.authorName}
                            className="size-7 rounded-full object-cover ring-1 ring-border"
                        />
                    ) : (
                        <div className="size-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary ring-1 ring-primary/20">
                            {review.authorName.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-semibold text-foreground truncate">
                            {review.authorName}
                        </span>
                        {isOwner && (
                            <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                You
                            </span>
                        )}
                        <span className="text-xs text-muted-foreground/60">
                            {timeAgo(review.createdAt)}
                        </span>
                        {review.updatedAt && review.createdAt &&
                            new Date(review.updatedAt).getTime() - new Date(review.createdAt).getTime() > 1000 && (
                            <span className="text-[10px] text-muted-foreground/40 italic">
                                (edited)
                            </span>
                        )}
                    </div>
                </div>

                {/* Star rating (top-level only) */}
                {review.rating && !review.parentId && !isEditing && (
                    <div className="mb-2">
                        <StarRating value={review.rating} readonly size="sm" />
                    </div>
                )}

                {/* Content */}
                {isEditing ? (
                    <div className="space-y-2 mb-2">
                        {/* Edit rating for top-level */}
                        {!review.parentId && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Rating</span>
                                <StarRating
                                    value={editRating}
                                    onChange={setEditRating}
                                    size="sm"
                                />
                            </div>
                        )}

                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={2}
                            maxLength={2000}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-base sm:text-sm text-foreground resize-none focus:outline-none focus:border-primary/50"
                        />

                        <div className="flex items-center gap-1.5">
                            <Button
                                size="sm"
                                onClick={handleEditSave}
                                disabled={isSavingEdit}
                                className="h-6 text-xs gap-1 cursor-pointer"
                            >
                                {isSavingEdit ? (
                                    <Loader2Icon className="size-3 animate-spin" />
                                ) : (
                                    <CheckIcon className="size-3" />
                                )}
                                Save
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsEditing(false);
                                    const { text, mentions } = decodeMentions(review.content);
                                    setEditContent(text);
                                    setEditMentions(mentions);
                                    setEditRating(review.rating || 0);
                                }}
                                disabled={isSavingEdit}
                                className="h-6 text-xs gap-1"
                            >
                                <XIcon className="size-3" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap mb-2">
                        {renderContent(review.content)}
                    </p>
                )}

                {/* Actions row */}
                {!isEditing && (
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {/* Reply button */}
                        {canReply && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="h-6 text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <MessageCircleIcon className="size-3" />
                                Reply
                            </Button>
                        )}

                        {/* Owner actions */}
                        {isOwner && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="h-6 text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <PencilIcon className="size-3" />
                                Edit
                            </Button>
                        )}
                        {(isOwner || isAdmin) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="h-6 text-xs gap-1 text-muted-foreground hover:text-destructive cursor-pointer"
                            >
                                {isDeleting ? (
                                    <Loader2Icon className="size-3 animate-spin" />
                                ) : (
                                    <Trash2Icon className="size-3" />
                                )}
                                Delete
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Reply form (inline) */}
            {showReplyForm && (
                <div className="ml-8 mb-4">
                    <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
                        <CornerDownRightIcon className="size-3" />
                        Replying to {review.authorName}
                    </div>
                    <ReviewForm
                        productId={productId}
                        parentId={review.id}
                        isReply
                        replyToName={review.authorName}
                        onCancel={() => setShowReplyForm(false)}
                        onSuccess={() => setShowReplyForm(false)}
                    />
                </div>
            )}

            {/* Nested replies */}
            {review.replies.length > 0 && (
                <div className="space-y-0">
                    {review.replies.map((reply) => (
                        <ReviewCard
                            key={reply.id}
                            review={reply}
                            productId={productId}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
