import { ArrowUpRightIcon, StarIcon } from "lucide-react"
import SectionHeader from "@/components/common/section-header"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/products/product-card"
import Link from "next/link"
import { getFeaturedProducts } from "@/lib/products/product-select"

// const featuredProducts = [
//     {
//         id: 1,
//         name: "ParityKit",
//         description: "A toolkit for creating parity products",
//         tags: ["Saas", "Pricing", "Global"],
//         votes: 615,
//         isFeatured: true,
//     },
//     {
//         id: 2,
//         name: "Modern Fullstack Next.js Course",
//         description: "Learn to build production-ready fullstack apps with Next.js",
//         tags: ["Next.js", "Fullstack", "Course"],
//         votes: 124,
//         isFeatured: false,
//     },
//     {
//         id: 3,
//         name: "PromptForge AI",
//         description: "An AI-powered tool for crafting, testing, and sharing high-performing prompts",
//         tags: ["AI", "Productivity", "Tools"],
//         votes: 342,
//         isFeatured: false,
//     },
//     {
//         id: 4,
//         name: "ShipFast Boilerplate",
//         description: "A production-ready starter kit to launch SaaS products faster",
//         tags: ["SaaS", "Starter", "Next.js"],
//         votes: 489,
//         isFeatured: true,
//     },
// ]

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