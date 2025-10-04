import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  description?: string;
  gradient?: boolean;
}

export const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
  gradient,
}: StatCardProps) => {
  return (
    <Card
      className={`group hover:scale-105 transition-all duration-300 ${
        gradient
          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
          : ""
      }`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-lg ${
              gradient ? "bg-white/20" : "bg-accent"
            } group-hover:scale-110 transition-transform`}>
            <Icon
              className={`h-6 w-6 ${
                gradient ? "text-white" : "text-accent-foreground"
              }`}
            />
          </div>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                gradient ? "text-white/80" : "text-muted-foreground"
              }`}>
              {label}
            </p>
            <p
              className={`text-3xl font-bold mt-1 ${
                gradient ? "text-white" : "text-foreground"
              }`}>
              {value}
            </p>
            {description && (
              <p
                className={`text-sm mt-2 ${
                  gradient ? "text-white/70" : "text-muted-foreground"
                }`}>
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
