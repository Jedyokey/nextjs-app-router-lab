import { Suspense } from "react"
import SectionHeader from "@/components/common/section-header"
import { CompassIcon } from "lucide-react"
import { getAllProducts } from "@/lib/products/product-select"
import ProductExplorer from "@/components/products/product-explorer"
import ProductExplorerSkeleton from "@/components/products/product-explorer-skeleton"

// Create a new async component that fetches data
async function ProductExplorerWithData() {
    const products = await getAllProducts();
    return <ProductExplorer products={products} />;
}

export default async function Explore() {
    // EDIT: Reduced mobile padding from py-20 to py-8, restored on md and up
    return (
        <div className="py-8 md:py-20">
            <div className="wrapper">
                <div className="mb-8">
                    <SectionHeader
                        title="Explore All Products"
                        icon={CompassIcon}
                        description="Browse and discover amazing projects from our community"
                    />
                </div>

                <Suspense fallback={<ProductExplorerSkeleton />}>
                    <ProductExplorerWithData />
                </Suspense>
            </div>
        </div>
    )
}