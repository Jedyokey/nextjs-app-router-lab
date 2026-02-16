"use cache";

import { ArrowUpRightIcon, StarIcon } from "lucide-react"
import SectionHeader from "@/components/common/section-header"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/products/product-card"
import Link from "next/link"
import { getFeaturedProducts } from "@/lib/products/product-select"

export default async function FeaturedProducts() {
    const featuredProducts = await getFeaturedProducts();
    
    return (
        <section className="py-20 bg-muted/20">
            <div className="wrapper">
                <div className="flex items-center justify-between mb-12">
                    <SectionHeader 
                        title="Featured Today" 
                        icon={StarIcon}
                        description="Top picks from our community this week" 
                    />
                    <Button variant="outline" asChild className="hidden sm:flex">
                        <Link href="/explore">View All <ArrowUpRightIcon className="size-4" /></Link>
                    </Button>
                </div>
                <div className="grid-wrapper">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}