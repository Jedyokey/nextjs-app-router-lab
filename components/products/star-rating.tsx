"use client";

import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
    showAverage?: boolean;
    count?: number;
}

const sizeMap = {
    sm: "size-3.5",
    md: "size-5",
    lg: "size-6",
};

export default function StarRating({
    value,
    onChange,
    readonly = false,
    size = "md",
    showAverage = false,
    count,
}: StarRatingProps) {
    const [hoverValue, setHoverValue] = useState(0);
    const displayValue = hoverValue || value;

    return (
        <div className="flex items-center gap-1.5">
            <div
                className="flex items-center gap-0.5"
                onMouseLeave={() => !readonly && setHoverValue(0)}
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={readonly}
                        onClick={() => {
                            if (!readonly && onChange) {
                                // Toggle off if clicking the same star
                                onChange(value === star ? 0 : star);
                            }
                        }}
                        onMouseEnter={() => !readonly && setHoverValue(star)}
                        className={cn(
                            "transition-all duration-150",
                            readonly
                                ? "cursor-default"
                                : "cursor-pointer hover:scale-125 active:scale-95"
                        )}
                    >
                        <StarIcon
                            className={cn(
                                sizeMap[size],
                                "transition-colors duration-150",
                                star <= displayValue
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-muted-foreground/30"
                            )}
                        />
                    </button>
                ))}
            </div>

            {showAverage && value > 0 && (
                <span className="text-sm font-medium text-muted-foreground ml-1">
                    {value.toFixed(1)}
                    {count !== undefined && (
                        <span className="text-muted-foreground/60"> ({count})</span>
                    )}
                </span>
            )}
        </div>
    );
}
