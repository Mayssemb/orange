import { Candidate } from "@/types/candidate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Mail, Phone, Linkedin, FileText, Star, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  showEvaluateButton?: boolean;
  onEvaluate?: (candidate: Candidate) => void;
}

const statusConfig: Record<Candidate['status'], { label: string; className: string }> = {
  new: { label: "New", className: "bg-info/10 text-info border-info/30" },
  screening: { label: "Screening", className: "bg-warning/10 text-yellow-700 border-warning/30" },
  interviewed: { label: "Interviewed", className: "bg-accent text-accent-foreground border-accent" },
  evaluated: { label: "Evaluated", className: "bg-success/10 text-green-700 border-success/30" },
  hired: { label: "Hired", className: "bg-success text-success-foreground border-success" },
  rejected: { label: "Rejected", className: "bg-error/10 text-red-700 border-error/30" },
};

export const CandidateCard = ({ candidate, showEvaluateButton, onEvaluate }: CandidateCardProps) => {
  const status = statusConfig[candidate.status];

  return (
    <Card className="card-orange animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">
              {candidate.firstName} {candidate.lastName}
            </CardTitle>
            <Badge className={cn("mt-2", status.className)} variant="outline">
              {status.label}
            </Badge>
          </div>
          {candidate.evaluation && (
            <div className="flex items-center gap-1 text-primary">
              <Star className="w-4 h-4 fill-primary" />
              <span className="font-semibold">{candidate.evaluation.overallRating}/5</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{candidate.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{candidate.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Applied {format(candidate.appliedAt, "MMM d, yyyy")}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {candidate.cvUrl && (
            <Button variant="outline" size="sm" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              View CV
            </Button>
          )}
          {candidate.linkedinUrl && (
            <Button variant="outline" size="sm" className="text-xs">
              <Linkedin className="w-3 h-3 mr-1" />
              LinkedIn
            </Button>
          )}
        </div>

        {candidate.evaluation && (
          <div className="pt-3 mt-3 border-t border-border">
            <p className="text-sm font-medium mb-1">
              Recommendation: 
              <span className={cn(
                "ml-2",
                candidate.evaluation.recommendation === "hire" && "text-success",
                candidate.evaluation.recommendation === "consider" && "text-warning",
                candidate.evaluation.recommendation === "reject" && "text-error"
              )}>
                {candidate.evaluation.recommendation === "hire" && "✅ Hire"}
                {candidate.evaluation.recommendation === "consider" && "🤔 Consider"}
                {candidate.evaluation.recommendation === "reject" && "❌ Reject"}
              </span>
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {candidate.evaluation.comments || candidate.evaluation.strengths}
            </p>
          </div>
        )}

        {showEvaluateButton && !candidate.evaluation && candidate.status !== "rejected" && (
          <Button 
            className="w-full" 
            onClick={() => onEvaluate?.(candidate)}
          >
            Evaluate Candidate
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
