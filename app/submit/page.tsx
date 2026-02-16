import SectionHeader from "@/components/common/section-header";
import { SparklesIcon } from "lucide-react";
import ProductSubmitForm from "@/components/products/product-submit-form";

export default function SubmitPage() {
    return (
        <section className="py-20">
            <div className="wrapper">
                <div className="mb-12">
                    <SectionHeader
                        title="Submit Your Product"
                        icon={SparklesIcon}
                        description="Share your innovative product with our community. Your submission will be reviewed by our team and, if approved, featured on our platform for everyone to see."
                    />
                </div>

                <div className="max-w-2xl mx-auto">
                    <ProductSubmitForm />
                </div>
            </div>
        </section>
    );
}