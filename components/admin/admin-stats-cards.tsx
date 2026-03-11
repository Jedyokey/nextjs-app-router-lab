import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    bg: string;
    iconColor: string;
    change: string;
}

export default function AdminStatsCards({ stats }: { stats: StatCardProps[] }) {
    const firstRow = stats.slice(0, 3);
    const secondRow = stats.slice(3, 6);

    return (
        <div className="space-y-6">
            {/* First row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {firstRow.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="p-6 border border-border bg-card hover:shadow-md transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground/60 mt-2">{stat.change}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`size-6 ${stat.iconColor}`} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Second row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {secondRow.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index + 3} className="p-6 border border-border bg-card hover:shadow-md transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground/60 mt-2">{stat.change}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`size-6 ${stat.iconColor}`} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}