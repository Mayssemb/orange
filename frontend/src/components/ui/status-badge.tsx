import { cn } from "@/lib/utils";
import { ProposalStatus } from "@/types/proposal";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: ProposalStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    className: "PENDING",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "APPROVED",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "REJECTED",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <span className={cn("status-badge", config.className, className)}>
      <Icon className="w-4 h-4 mr-1.5" />
      {config.label}
    </span>
  );
};
