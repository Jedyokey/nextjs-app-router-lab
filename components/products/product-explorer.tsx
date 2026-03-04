"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrendingUpIcon, ClockIcon } from "lucide-react"
import ProductCard from "@/components/products/product-card"
import { SearchIcon, XIcon } from "lucide-react"
import type { ProductFetchItem } from "@/lib/products/product-select"

export default function ProductExplorer({ 
    products, 
}: { 
    products: ProductFetchItem[]; 
}) {
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<"trending" | "recent">("trending")

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
                return dateB - dateA; // Descending (newest first)
            });
        }

        return filtered;
    }, [products, searchQuery, sortBy])

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                        type="text" 
                        placeholder="Search products..." 
                        className="w-full pl-10"
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
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                    {searchQuery && ` matching "${searchQuery}"`}
                </p>
            </div>
            <div className="grid-wrapper">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">No products found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    )
}