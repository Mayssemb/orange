// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { toast } from "sonner";
// import { PlusCircle, X } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// const proposalSchema = z.object({
//   type: z.enum(["pfe", "internship"]),
//   title: z.string().min(5, "Title must be at least 5 characters").max(100),
//   description: z.string().min(20, "Description must be at least 20 characters").max(500),
//   department: z.string().min(2, "Department is required"),
//   duration: z.string().min(1, "Duration is required"),
//   teamLeadName: z.string().min(2, "Your name is required"),
//   teamLeadEmail: z.string().email("Valid email is required"),
// });

// type ProposalFormData = z.infer<typeof proposalSchema>;

// interface ProposalFormProps {
//   onSuccess?: () => void;

// }

// export const ProposalForm = ({ onSuccess }: ProposalFormProps) => {
//   const [skills, setSkills] = useState<string[]>([]);
//   const [skillInput, setSkillInput] = useState("");
//   const addProposal = useProposalStore((state) => state.addProposal);

//   const form = useForm<ProposalFormData>({
//     resolver: zodResolver(proposalSchema),
//     defaultValues: {
//       type: "pfe",
//       title: "",
//       description: "",
//       department: "",
//       duration: "",
//       ,
//     },
//   });

//   const handleAddSkill = () => {
//     const trimmed = skillInput.trim();
//     if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
//       setSkills([...skills, trimmed]);
//       setSkillInput("");
//     }
//   };

//   const handleRemoveSkill = (skill: string) => {
//     setSkills(skills.filter((s) => s !== skill));
//   };

//   const onSubmit = (data: ProposalFormData) => {
//     if (skills.length === 0) {
//       toast.error("Please add at least one required skill");
//       return;
//     }

//     addProposal({
//       type: data.type,
//       title: data.title,
//       description: data.description,
//       department: data.department,
//       duration: data.duration,
//       teamLeadName: data.teamLeadName,
//       teamLeadEmail: data.teamLeadEmail,
//       skills,
//     });

//     toast.success("Proposal submitted successfully!", {
//       description: "HR will review your proposal shortly.",
//     });

//     form.reset();
//     setSkills([]);
//     onSuccess?.();
//   };

//   return (
//     <Card className="card-orange">
//       <CardHeader>
//         <CardTitle className="text-xl">Create New Proposal</CardTitle>
//         <CardDescription>
//           Submit a PFE or internship opportunity for HR approval
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="type"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Proposal Type</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select type" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="pfe">PFE (End of Studies Project)</SelectItem>
//                         <SelectItem value="internship">Internship</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="duration"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Duration</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select duration" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="1 month">1 month</SelectItem>
//                         <SelectItem value="2 months">2 months</SelectItem>
//                         <SelectItem value="3 months">3 months</SelectItem>
//                         <SelectItem value="4 months">4 months</SelectItem>
//                         <SelectItem value="5 months">5 months</SelectItem>
//                         <SelectItem value="6 months">6 months</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Proposal Title</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., AI-Powered Customer Analytics Dashboard" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Describe the project objectives, expected outcomes, and what the intern/student will learn..."
//                       className="min-h-[100px] resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="department"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Department</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select department" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Digital Innovation">Digital Innovation</SelectItem>
//                       <SelectItem value="Network Operations">Network Operations</SelectItem>
//                       <SelectItem value="Connected Objects">Connected Objects</SelectItem>
//                       <SelectItem value="Customer Experience">Customer Experience</SelectItem>
//                       <SelectItem value="Data & AI">Data & AI</SelectItem>
//                       <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
//                       <SelectItem value="Cloud Infrastructure">Cloud Infrastructure</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Skills */}
//             <div className="space-y-2">
//               <FormLabel>Required Skills</FormLabel>
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Add a skill (e.g., Python, React)"
//                   value={skillInput}
//                   onChange={(e) => setSkillInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       handleAddSkill();
//                     }
//                   }}
//                 />
//                 <Button type="button" variant="outline" onClick={handleAddSkill}>
//                   <PlusCircle className="w-4 h-4" />
//                 </Button>
//               </div>
//               {skills.length > 0 && (
//                 <div className="flex flex-wrap gap-1.5 mt-2">
//                   {skills.map((skill) => (
//                     <Badge
//                       key={skill}
//                       variant="secondary"
//                       className="bg-accent text-accent-foreground pr-1"
//                     >
//                       {skill}
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveSkill(skill)}
//                         className="ml-1 p-0.5 hover:bg-primary/10 rounded"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </Badge>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="teamLeadName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Your Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Your full name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="teamLeadEmail"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Your Email</FormLabel>
//                     <FormControl>
//                       <Input type="email" placeholder="your.email@orange.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <Button type="submit" className="w-full">
//               Submit Proposal
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { PlusCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { createProposal } from "@/redux/proposalActions";
import { getIdFromToken } from "@/utils/auth";

const proposalSchema = z.object({
  type: z.enum(["pfe", "internship"]),
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(500),
  department: z.string().min(2, "Department is required"),
  duration: z.string().min(1, "Duration is required"),
  number_of_interns: z.number().min(1, "Number of interns must be at least 1"),
  diploma: z.string().min(2, "Diploma is required"),
  direction: z.string().min(2, "Direction is required"),
  
});


type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalFormProps {
  onSuccess?: () => void;
}

export const ProposalForm = ({ onSuccess }: ProposalFormProps) => {
  const dispatch = useDispatch();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      type: "pfe",
      title: "",
      description: "",
      department: "",
      duration: "",
      diploma: "",
      number_of_interns: 1,
      direction: "",
     
    },
  });

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const onSubmit = async (data: ProposalFormData) => {
    const submissionData = {
    ...data,
    duration: parseInt(data.duration, 10),
    };
    if (skills.length === 0) {
      toast.error("Please add at least one required skill");
      return;
    }
    const userInfo = localStorage.getItem("userInfo");
    const token = userInfo.access_token;
    const teamLeadId = getIdFromToken(token);

    try {
      await dispatch(
        createProposal({ ...data, technologies: skills })
      );
      toast.success("Proposal submitted successfully!", {
        description: "HR will review your proposal shortly.",
      });

      form.reset();
      setSkills([]);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit proposal");
    }
  };

  return (
    <Card className="card-orange">
      <CardHeader>
        <CardTitle className="text-xl">Create New Proposal</CardTitle>
        <CardDescription>
          Submit a PFE or internship opportunity for HR approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposal Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pfe">PFE (End of Studies Project)</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 month</SelectItem>
                        <SelectItem value="2">2 months</SelectItem>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="4">4 months</SelectItem>
                        <SelectItem value="5">5 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AI-Powered Customer Analytics Dashboard" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the project objectives, expected outcomes, and what the intern/student will learn..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Digital Innovation">Digital Innovation</SelectItem>
                      <SelectItem value="Network Operations">Network Operations</SelectItem>
                      <SelectItem value="Connected Objects">Connected Objects</SelectItem>
                      <SelectItem value="Customer Experience">Customer Experience</SelectItem>
                      <SelectItem value="Data & AI">Data & AI</SelectItem>
                      <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="Cloud Infrastructure">Cloud Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number_of_interns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Interns</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diploma"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diploma</FormLabel>
                  <FormControl>
                  <Input type="string" placeholder="e.g., Bachelor's Degree in Computer Science" {...field} />
                   </FormControl>  
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direction</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skills */}
            <div className="space-y-2">
              <FormLabel>Required Skills</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g., Python, React)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddSkill}>
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-accent text-accent-foreground pr-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 p-0.5 hover:bg-primary/10 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full">
              Submit Proposal
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};