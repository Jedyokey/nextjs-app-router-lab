"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { searchUsersForMention } from "@/lib/products/mention-actions";

interface MentionUser {
    userId: string;
    name: string;
    avatar: string | null;
}

interface MentionAutocompleteProps {
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    onSelect: (user: MentionUser) => void;
}

export default function MentionAutocomplete({
    inputRef,
    onSelect,
}: MentionAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<MentionUser[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Watch for @ being typed in the textarea
    const handleInputChange = useCallback(() => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const value = textarea.value;
        const cursorPos = textarea.selectionStart;
        const textBeforeCursor = value.slice(0, cursorPos);

        // Find the last @ that isn't part of an existing mention
        const lastAtIndex = textBeforeCursor.lastIndexOf("@");

        if (lastAtIndex === -1) {
            setIsOpen(false);
            return;
        }

        const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);

        // If there's a space or newline right before the @, or @ is at the start, it's a mention trigger
        const charBeforeAt = lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : " ";

        if (
            (charBeforeAt === " " || charBeforeAt === "\n" || lastAtIndex === 0) &&
            !textAfterAt.includes(" ") &&
            !textAfterAt.includes("\n") &&
            textAfterAt.length <= 30
        ) {
            setQuery(textAfterAt);
            setIsOpen(true);
            setSelectedIndex(0);
        } else {
            setIsOpen(false);
        }
    }, [inputRef]);

    // Debounced search
    useEffect(() => {
        if (!isOpen || query.length < 2) {
            setResults([]);
            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const users = await searchUsersForMention(query);
                setResults(users);
            } catch {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, isOpen]);

    // Attach input listener
    useEffect(() => {
        const textarea = inputRef.current;
        if (!textarea) return;

        textarea.addEventListener("input", handleInputChange);
        textarea.addEventListener("click", handleInputChange);

        return () => {
            textarea.removeEventListener("input", handleInputChange);
            textarea.removeEventListener("click", handleInputChange);
        };
    }, [inputRef, handleInputChange]);

    // Keyboard navigation
    useEffect(() => {
        const textarea = inputRef.current;
        if (!textarea || !isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen || results.length === 0) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % results.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
            } else if (e.key === "Enter" && results[selectedIndex]) {
                e.preventDefault();
                handleSelect(results[selectedIndex]);
            } else if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        textarea.addEventListener("keydown", handleKeyDown);
        return () => textarea.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, results, selectedIndex, inputRef]);

    const handleSelect = (user: MentionUser) => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const value = textarea.value;
        const cursorPos = textarea.selectionStart;
        const textBeforeCursor = value.slice(0, cursorPos);
        const lastAtIndex = textBeforeCursor.lastIndexOf("@");

        // Insert @Handle instead of @[DisplayName](userId)
        const handle = user.name;
        const mention = `@${handle} `;
        const newValue = value.slice(0, lastAtIndex) + mention + value.slice(cursorPos);

        // Update textarea value and cursor position
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value"
        )?.set;

        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(textarea, newValue);
            const event = new Event("input", { bubbles: true });
            textarea.dispatchEvent(event);
        }

        // Set cursor after the mention
        const newCursorPos = lastAtIndex + mention.length;
        setTimeout(() => {
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.focus();
        }, 0);

        setIsOpen(false);
        onSelect(user);
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                e.target !== inputRef.current
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [inputRef]);

    if (!isOpen || (results.length === 0 && !isLoading && query.length >= 2)) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute bottom-full mb-1 left-0 w-64 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
        >
            {isLoading && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                    Searching...
                </div>
            )}

            {!isLoading && query.length < 2 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                    Keep typing to search...
                </div>
            )}

            {!isLoading && results.length > 0 && (
                <ul className="py-1">
                    {results.map((user, index) => (
                        <li key={user.userId}>
                            <button
                                type="button"
                                className={cn(
                                    "w-full px-3 py-2 flex items-center gap-2 text-left text-sm transition-colors",
                                    index === selectedIndex
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-muted/50"
                                )}
                                onMouseEnter={() => setSelectedIndex(index)}
                                onClick={() => handleSelect(user)}
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="size-6 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="truncate">{user.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
