"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function ProductExplorerPagination({ 
    currentPage, 
    totalPages, 
    onPageChange 
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Generate page numbers to display
    const getPageNumbers = (): (number | string)[] => {
        const delta = 2; // Number of pages to show on each side of current page
        const range: number[] = [];
        const rangeWithDots: (number | string)[] = [];
        let l: number | undefined;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push("...");
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            {/* Previous button */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer h-9 w-9"
                aria-label="Previous page"
            >
                <ChevronLeftIcon className="size-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => (
                    page === "..." ? (
                        <span key={`dots-${index}`} className="px-3 py-2 text-sm text-muted-foreground">
                            ...
                        </span>
                    ) : (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => onPageChange(page as number)}
                            className={`cursor-pointer min-w-9 h-9 px-3 ${
                                currentPage === page 
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                    : "hover:bg-muted"
                            }`}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? "page" : undefined}
                        >
                            {page}
                        </Button>
                    )
                ))}
            </div>

            {/* Next button */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="cursor-pointer h-9 w-9"
                aria-label="Next page"
            >
                <ChevronRightIcon className="size-4" />
            </Button>
        </div>
    );
}