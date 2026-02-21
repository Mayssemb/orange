// import { Proposal } from "@/types/proposal";
// import { StatusBadge } from "@/components/ui/status-badge";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Calendar, Clock, Building2, User } from "lucide-react";
// import { format } from "date-fns";

// interface ProposalCardProps {
//   proposal: Proposal;
//   showTeamLead?: boolean;
//   actions?: React.ReactNode;
// }

// export const ProposalCard = ({ proposal, showTeamLead = false, actions }: ProposalCardProps) => {
//   return (
//     <Card className="card-orange animate-fade-in">
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between gap-4">
//           <div className="space-y-1">
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className="uppercase text-xs font-semibold">
//                 {proposal.type}
//               </Badge>
//               <StatusBadge status={proposal.status} />
//             </div>
//             <CardTitle className="text-lg font-semibold leading-tight">
//               {proposal.title}
//             </CardTitle>
//           </div>
//         </div>
//       </CardHeader>
      
//       <CardContent className="space-y-4">
//         <p className="text-sm text-muted-foreground line-clamp-2">
//           {proposal.description}
//         </p>
        
//         <div className="grid grid-cols-2 gap-3 text-sm">
//           <div className="flex items-center gap-2 text-muted-foreground">
//             <Building2 className="w-4 h-4" />
//             <span>{proposal.department}</span>
//           </div>
//           <div className="flex items-center gap-2 text-muted-foreground">
//             <Clock className="w-4 h-4" />
//             <span>{proposal.duration}</span>
//           </div>
//           <div className="flex items-center gap-2 text-muted-foreground">
//             <Calendar className="w-4 h-4" />
//             <span>{format(proposal.createdAt, "MMM d, yyyy")}</span>
//           </div>
//           {showTeamLead && (
//             <div className="flex items-center gap-2 text-muted-foreground">
//               <User className="w-4 h-4" />
//               <span>{proposal.teamLeadName}</span>
//             </div>
//           )}
//         </div>
        
//         <div className="flex flex-wrap gap-1.5">
//           {proposal.skills.map((skill) => (
//             <Badge 
//               key={skill} 
//               variant="secondary" 
//               className="text-xs bg-accent text-accent-foreground"
//             >
//               {skill}
//             </Badge>
//           ))}
//         </div>
        
//         {proposal.reviewerComment && (
//           <div className="pt-3 mt-3 border-t border-border">
//             <p className="text-sm">
//               <span className="font-medium">HR Comment: </span>
//               <span className="text-muted-foreground">{proposal.reviewerComment}</span>
//             </p>
//           </div>
//         )}
        
//         {actions && (
//           <div className="pt-3 mt-3 border-t border-border">
//             {actions}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };
import { Proposal } from "@/types/proposal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Building2, User } from "lucide-react";
import { format } from "date-fns";

interface ProposalCardProps {
  proposal: Proposal;
  showTeamLead?: boolean;
  actions?: React.ReactNode;
}

export const ProposalCard = ({ proposal, showTeamLead = false, actions }: ProposalCardProps) => {
  // Split technologies string into array for badges
  const techList = proposal.technologies ? proposal.technologies.map((t) => t.trim()) : [];

  return (
    <Card className="card-orange animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="uppercase text-xs font-semibold">
                {proposal.type ?? "PFE"}
              </Badge>
              <StatusBadge status={proposal.status} />
            </div>
            <CardTitle className="text-lg font-semibold leading-tight">
              {proposal.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {proposal.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>{proposal.department ?? "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{proposal.duration} months</span>
          </div>
          {showTeamLead && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{proposal.teamLead.name ?? "N/A"}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{proposal.createdAt ? format(new Date(proposal.createdAt), "MMM d, yyyy") : "N/A"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {techList.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs bg-accent text-accent-foreground">
              {tech}
            </Badge>
          ))}
        </div>

        {/* {proposal.reviewerComment && (
          <div className="pt-3 mt-3 border-t border-border">
            <p className="text-sm">
              <span className="font-medium">HR Comment: </span>
              <span className="text-muted-foreground">{proposal.reviewerComment}</span>
            </p>
          </div>
        )} */}

        {actions && (
          <div className="pt-3 mt-3 border-t border-border">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
