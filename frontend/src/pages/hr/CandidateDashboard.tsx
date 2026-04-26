import React from 'react';
import { 
  FileText, Briefcase, GraduationCap, Award, 
  CheckCircle, AlertTriangle, BarChart3, ChevronRight, Download
} from 'lucide-react';

// --- TypeScript Interfaces ---

interface Experience {
  role: string;
  company: string;
  period: string;
  desc: string;
}

interface Education {
  degree: string;
  school: string;
  year: string;
}

interface Candidate {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

interface KeyFactor {
  trait: string;
  impact: 'positive' | 'negative';
  weight: number;
  reason: string;
}

interface AIAnalysis {
  score: number;
  matchLevel: string;
  decision: string;
  keyFactors: KeyFactor[];
}

// --- Component ---

const CandidateDashboard: React.FC = () => {
  // Mock Data for the Candidate
  const candidate: Candidate = {
    name: "Ahmed Ben Ali",
    role: "Senior Full-Stack Developer",
    email: "ahmed.benali@example.tn",
    phone: "+216 55 123 456",
    location: "Tunis, Tunisia",
    summary: "Passionate Full-Stack Developer with 5+ years of experience building scalable web applications. Strong background in React, Node.js, and cloud architectures. Looking to leverage my skills at Orange Tunisia to build next-generation telecom solutions.",
    experience: [
      { role: "Software Engineer", company: "TechCorp", period: "2021 - Present", desc: "Led the frontend migration to React. Improved load times by 40%." },
      { role: "Web Developer", company: "Digital Agency", period: "2018 - 2021", desc: "Developed over 20 responsive websites and internal dashboards." }
    ],
    education: [
      { degree: "Engineering Degree in Computer Science", school: "INSAT", year: "2018" }
    ],
    skills: ["React", "Node.js", "MongoDB", "Docker", "Agile", "French", "English"]
  };

  // Mock Data for the Explainable AI (XAI) Output
  const aiAnalysis: AIAnalysis = {
    score: 88,
    matchLevel: "High Match",
    decision: "Recommended for Interview",
    keyFactors: [
      { trait: "Frontend Skills (React)", impact: "positive", weight: 95, reason: "Candidate has 5+ years of direct experience matching the job requirement perfectly." },
      { trait: "Backend Skills (Node.js)", impact: "positive", weight: 85, reason: "Strong backend knowledge, though lacking experience in the specific microservices framework we use." },
      { trait: "Telecom Industry Exp", impact: "negative", weight: 30, reason: "No prior experience in the telecommunications sector (Orange's primary domain)." },
      { trait: "Language Proficiency", impact: "positive", weight: 90, reason: "Fluent in French and English, crucial for Orange's international team collaboration." }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Orange Brand Header */}
      <header className="bg-black text-white px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          {/* Orange Logo Mockup */}
          <div className="bg-[#FF7900] text-white font-bold text-xl px-3 py-1 pb-2 rounded-sm tracking-tighter">
            orange
          </div>
          <span className="text-xl font-light border-l border-gray-600 pl-3 ml-2">
            HR AI Recruitment Platform
          </span>
        </div>
        <button className="flex items-center space-x-2 bg-[#FF7900] hover:bg-[#e66d00] transition px-4 py-2 rounded-md font-medium text-white">
          <span>Export Report</span>
          <Download size={18} />
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Candidate CV View (Spans 7 columns) */}
        <section className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center space-x-2">
            <FileText className="text-gray-500" size={20} />
            <h2 className="font-semibold text-lg">Curriculum Vitae</h2>
          </div>
          
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-black">{candidate.name}</h1>
              <p className="text-[#FF7900] font-medium text-lg mt-1">{candidate.role}</p>
              <div className="flex space-x-4 mt-3 text-sm text-gray-500">
                <span>{candidate.email}</span>
                <span>•</span>
                <span>{candidate.phone}</span>
                <span>•</span>
                <span>{candidate.location}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Summary</h3>
              <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
            </div>

            <div className="mb-8">
              <h3 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                <Briefcase size={16} className="mr-2" /> Professional Experience
              </h3>
              <div className="space-y-6">
                {candidate.experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900">{exp.role}</h4>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{exp.period}</span>
                    </div>
                    <p className="text-[#FF7900] text-sm mb-2">{exp.company}</p>
                    <p className="text-gray-600 text-sm">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                <GraduationCap size={16} className="mr-2" /> Education
              </h3>
              {candidate.education.map((edu, idx) => (
                <div key={idx} className="mb-4">
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-600 text-sm">{edu.school} — {edu.year}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                <Award size={16} className="mr-2" /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, idx) => (
                  <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: AI Score & Explainability (Spans 5 columns) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* AI Score Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-lg mb-6 flex items-center">
              <BarChart3 className="mr-2 text-[#FF7900]" size={20} />
              AI Candidate Evaluation
            </h2>
            
            <div className="flex items-center justify-between bg-black text-white p-6 rounded-lg mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Overall Match Score</p>
                <p className="text-3xl font-bold text-[#FF7900]">{aiAnalysis.score}<span className="text-xl text-gray-500">/100</span></p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-[#FF7900] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                  {aiAnalysis.matchLevel}
                </span>
                <p className="text-sm font-medium">{aiAnalysis.decision}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 text-center">
              Score generated via Orange HR-AI Model v2.4 based on job description matching.
            </p>
          </div>

          {/* Explainable AI (XAI) Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1">
            <h2 className="font-semibold text-lg border-b border-gray-100 pb-4 mb-4 flex justify-between items-center">
              <span>Why this score? (Explainable AI)</span>
            </h2>

            <div className="space-y-5">
              {aiAnalysis.keyFactors.map((factor, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-gray-50 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      {factor.impact === 'positive' ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : (
                        <AlertTriangle size={18} className="text-amber-500" />
                      )}
                      <span className="font-semibold text-gray-800">{factor.trait}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      Weight: {factor.weight}%
                    </span>
                  </div>
                  
                  {/* Visual Impact Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                    <div 
                      className={`h-1.5 rounded-full ${factor.impact === 'positive' ? 'bg-[#FF7900]' : 'bg-amber-400'}`} 
                      style={{ width: `${factor.weight}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-gray-600 pl-6 border-l-2 border-gray-200 ml-2">
                    <span className="font-medium text-black">AI Reasoning:</span> {factor.reason}
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition font-semibold rounded-md flex items-center justify-center">
              View Detailed Technical Breakdown <ChevronRight size={18} className="ml-1" />
            </button>

          </div>
        </section>
      </main>
    </div>
  );
};

export default CandidateDashboard;