import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "error";
  className?: string;
}

const variantStyles = {
  default: "border-l-border",
  primary: "border-l-primary",
  success: "border-l-success",
  warning: "border-l-warning",
  error: "border-l-error",
};

export const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  variant = "default",
  className 
}: StatCardProps) => (
  <div className={cn(
    "card-orange p-4 border-l-4",
    variantStyles[variant],
    className
  )}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {trend && (
          <p className={cn(
            "text-xs mt-1",
            trend.isPositive ? "text-success" : "text-error"
          )}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% from last month
          </p>
        )}
      </div>
      <div className="text-muted-foreground">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);
