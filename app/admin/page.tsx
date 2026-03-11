import { Suspense } from "react";
import SectionHeader from "@/components/common/section-header";
import { ShieldIcon } from "lucide-react";
import AdminDashboard from "@/components/admin/admin-dashboard"; 
import AdminSkeleton from "@/components/admin/admin-skeleton"; 

export default async function AdminPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] py-12">
      <div className="wrapper">
        <div className="mb-8">
          <SectionHeader
            title="Product Admin"
            icon={ShieldIcon}
            description="Review and manage products, users, and site settings."
          />
        </div>

        <Suspense fallback={<AdminSkeleton />}>
          <AdminDashboard />
        </Suspense>
      </div>
    </div>
  );
}