import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useCandidateStore } from "@/store/candidateStore";
import { useSessionStore } from "@/store/sessionStore";
import { Candidate } from "@/types/candidate";
import { toast } from "sonner";
import { Star } from "lucide-react";

const evaluationSchema = z.object({
  technicalSkills: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  problemSolving: z.number().min(1).max(5),
  teamwork: z.number().min(1).max(5),
  motivation: z.number().min(1).max(5),
  overallRating: z.number().min(1).max(5),
  strengths: z.string().min(10, "Please provide at least 10 characters"),
  weaknesses: z.string().min(10, "Please provide at least 10 characters"),
  recommendation: z.enum(["hire", "consider", "reject"]),
  comments: z.string().optional(),
});

type EvaluationFormData = z.infer<typeof evaluationSchema>;

interface EvaluationFormProps {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RatingField = ({ 
  value, 
  onChange, 
  label 
}: { 
  value: number; 
  onChange: (value: number) => void; 
  label: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                star <= value
                  ? "fill-primary text-primary"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  </div>
);

export const EvaluationForm = ({ candidate, open, onOpenChange }: EvaluationFormProps) => {
  const addEvaluation = useCandidateStore((state) => state.addEvaluation);
  const session = useSessionStore((state) => state.session);

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      technicalSkills: 3,
      communication: 3,
      problemSolving: 3,
      teamwork: 3,
      motivation: 3,
      overallRating: 3,
      strengths: "",
      weaknesses: "",
      recommendation: "consider",
      comments: "",
    },
  });

  const onSubmit = (data: EvaluationFormData) => {
    addEvaluation(candidate.id, {
      evaluatorName: session?.name || "Team Lead",
      evaluatorEmail: session?.email || "",
      technicalSkills: data.technicalSkills,
      communication: data.communication,
      problemSolving: data.problemSolving,
      teamwork: data.teamwork,
      motivation: data.motivation,
      overallRating: data.overallRating,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      recommendation: data.recommendation,
      comments: data.comments || "",
    });

    toast.success("Evaluation submitted!", {
      description: `Evaluation for ${candidate.firstName} ${candidate.lastName} has been recorded.`,
    });

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Evaluate Candidate</DialogTitle>
          <DialogDescription>
            {candidate.firstName} {candidate.lastName} - {candidate.email}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Ratings Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-sm">
              <FormField
                control={form.control}
                name="technicalSkills"
                render={({ field }) => (
                  <RatingField
                    label="Technical Skills"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="communication"
                render={({ field }) => (
                  <RatingField
                    label="Communication"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="problemSolving"
                render={({ field }) => (
                  <RatingField
                    label="Problem Solving"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="teamwork"
                render={({ field }) => (
                  <RatingField
                    label="Teamwork"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <RatingField
                    label="Motivation"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="overallRating"
                render={({ field }) => (
                  <RatingField
                    label="Overall Rating"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Text Feedback */}
            <FormField
              control={form.control}
              name="strengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strengths</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What are the candidate's key strengths?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weaknesses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Areas for Improvement</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What areas could the candidate improve?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommendation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommendation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recommendation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hire">✅ Hire - Strongly recommended</SelectItem>
                      <SelectItem value="consider">🤔 Consider - May be suitable</SelectItem>
                      <SelectItem value="reject">❌ Reject - Not suitable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes or observations..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Evaluation</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
