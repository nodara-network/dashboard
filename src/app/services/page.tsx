import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import ServiceCard from "@/components/ui/ServiceCard";

export const metadata: Metadata = {
  title: "Services - Nodara Network",
  description: "Browse and book compute services from smartphone providers near you. Find the best deals on serverless functions and compute power.",
  keywords: "compute services, serverless functions, smartphone compute, blockchain compute",
};

export default function ServicesPage() {
  const features = [
    "Real-time Pricing",
    "Instant Booking", 
    "Trust Scores",
    "Performance Metrics"
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Service Marketplace"
        description="Discover and book compute services from smartphone providers in your area"
      />

      {/* Service Cards Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 6 }).map((_, index) => (
          <ServiceCard key={index} isLoading={true} />
        ))}
      </div>

      {/* Coming Soon Message */}
      <div className="mt-12 text-center">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Service Marketplace Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're building a comprehensive marketplace where you can browse, compare, and book compute services from smartphone providers worldwide.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {features.map((feature, index) => (
              <div key={index} className="bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-700 rounded-lg px-4 py-2">
                <span className="text-cyan-600 dark:text-cyan-400 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 