import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import ChartCard from "@/components/ui/ChartCard";
import DeviceListItem from "@/components/ui/DeviceListItem";
import { LocationIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Device Map - Nodara Network",
  description: "Explore the global network of smartphone compute devices. View real-time status, performance metrics, and location data of all connected nodes.",
  keywords: "device map, compute nodes, smartphone network, global compute, node status",
};

export default function DevicesPage() {
  const stats = [
    { label: "Total Devices", value: "2,847" },
    { label: "Online Now", value: "1,923" },
    { label: "Active Regions", value: "156" },
    { label: "Avg Response", value: "12ms" },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Global Device Network"
        description="Explore the worldwide network of smartphone compute devices and their real-time status"
      />

      {/* Map Placeholder */}
      <ChartCard
        title="Interactive Map"
        description="Real-time visualization of all connected devices"
        icon={<LocationIcon />}
        placeholderText="Interactive Map Coming Soon"
        placeholderSubtext="Real-time device locations and status"
        className="mb-8"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <MetricCard
            key={index}
            label={stat.label}
            value={stat.value}
            isLoading={true}
          />
        ))}
      </div>

      {/* Device List Placeholder */}
      <ChartCard
        title="Recent Devices"
        description="Latest connected smartphone compute nodes"
      >
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <DeviceListItem key={index} isLoading={true} />
          ))}
        </div>
      </ChartCard>
    </PageLayout>
  );
} 