"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrendingUpIcon, ClockIcon } from "lucide-react"
import ProductCard from "@/components/products/product-card"
import { SearchIcon, XIcon } from "lucide-react"
import ProductExplorerPagination from "@/components/products/product-explorer-pagination"
import type { ProductFetchItem } from "@/lib/products/product-select"

const ITEMS_PER_PAGE = 6;

export default function ProductExplorer({ 
    products, 
}: { 
    products: ProductFetchItem[]; 
}) {
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<"trending" | "recent">("trending")
    const [currentPage, setCurrentPage] = useState(1)

    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    (product.tagline ?? "").toLowerCase().includes(query) ||
                    (product.description ?? "").toLowerCase().includes(query) ||
                    (product.tags ?? []).some((tag: string) => tag.toLowerCase().includes(query))
            );
        }

        // Apply sorting based on sortBy
        if (sortBy === "trending") {
            filtered = [...filtered].sort((a, b) => (b.voteCount ?? 0) - (a.voteCount ?? 0));
        } else if (sortBy === "recent") {
            filtered = [...filtered].sort((a, b) => {
                const dateA = new Date(a.createdAt ?? 0).getTime();
                const dateB = new Date(b.createdAt ?? 0).getTime();
                return dateB - dateA;
            });
        }

        return filtered;
    }, [products, searchQuery, sortBy])

    // Reset to page 1 when search or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy]);

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, endIndex);
    }, [filteredProducts, currentPage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                        type="text" 
                        placeholder="Search products..." 
                        className="w-full pl-10 pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Clear text button */}
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            aria-label="Clear search"
                        >
                            <XIcon className="size-4" />
                        </button>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button 
                        variant={sortBy === "trending" ? "default" : "outline"} 
                        className="hidden sm:flex cursor-pointer"
                        onClick={() => setSortBy("trending")}
                    >
                        <TrendingUpIcon className="size-4" />Trending
                    </Button>
                    <Button
                        variant={sortBy === "recent" ? "default" : "outline"}
                        onClick={() => setSortBy("recent")}
                        className="hidden sm:flex cursor-pointer"
                    >
                        <ClockIcon />Recent
                    </Button>
                </div>
            </div>
            
            <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                    Showing {paginatedProducts.length} of {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                    {searchQuery && ` matching "${searchQuery}"`}
                </p>
            </div>

            <div className="grid-wrapper">
                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">No products found matching your search.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <ProductExplorerPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}