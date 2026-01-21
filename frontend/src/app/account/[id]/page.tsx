"use client";

import React, { useEffect, useState } from "react";
import { 
  User, 
  MapPin, 
  Briefcase, 
  Mail, 
  Phone, 
  Link as LinkIcon, 
  Linkedin, 
  Edit3, 
  MessageSquare, 
  UserPlus, 
  FileText,
  Download,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

const MOCK_DB = {
  "123": {
    id: "123",
    name: "Biraj Roy",
    role: "Full Stack Developer",
    location: "Kolkata, India",
    bio: "Passionate developer specializing in the MERN stack. I love building scalable web applications and solving complex algorithmic problems.",
    email: "biraj@example.com", // Private info
    phone: "+91 98765 43210",     // Private info
    skills: ["React", "Next.js", "Node.js", "C++", "Tailwind"],
    experience: [
      { company: "Tech Solutions", role: "Junior Dev", year: "2024 - Present" },
      { company: "Freelance", role: "Web Developer", year: "2023 - 2024" }
    ],
    isRecruiter: false,
  },
  "456": {
    id: "456",
    name: "Sarah Smith",
    role: "Senior Recruiter",
    location: "Bangalore, India",
    bio: "Helping tech talent find their dream jobs. 5+ years of experience in technical hiring.",
    email: "sarah@hiring.com",
    phone: "Hidden",
    skills: ["Talent Acquisition", "HR", "Management"],
    experience: [
      { company: "Google", role: "HR Manager", year: "2020 - Present" }
    ],
    isRecruiter: true,
  }
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  
  // Logic to determine if this is the logged-in user's profile
  // For demo purposes, we assume "123" is the logged-in user
  const isOwnProfile = true; 

  useEffect(() => {
    // Forcing ID 123 for demo based on your previous code
    setProfile(MOCK_DB["123"]);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-32 w-32 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="p-10 text-center">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="h-48 w-full bg-linear-to-r from-blue-600 to-blue-900 relative">
      </div>

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="bg-background rounded-2xl shadow-xl border overflow-hidden">
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
              
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background bg-gray-100 flex items-center justify-center overflow-hidden">
                     <User size={64} className="text-gray-400" />
                  </div>
                  {isOwnProfile && (
                    <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition">
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>

                <div className="text-center md:text-left mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
                  <p className="text-lg text-blue-600 font-medium flex items-center justify-center md:justify-start gap-1">
                    {profile.role} 
                    {profile.isRecruiter && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">Recruiter</span>}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 justify-center md:justify-start">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> Joined 2025</span>
                  </div>
                </div>
              </div>

              {/* --- ACTION BUTTONS (LOGIC SWITCH) --- */}
              <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                {isOwnProfile ? (
                  <>
                    <Button variant="outline" className="flex-1 md:flex-none">
                      <FileText size={16} className="mr-2" />
                      My Resume
                    </Button>
                    <Button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700">
                      <Edit3 size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1 md:flex-none">
                      <MessageSquare size={16} className="mr-2" />
                      Message
                    </Button>
                    <Button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700">
                      <UserPlus size={16} className="mr-2" />
                      Connect
                    </Button>
                  </>
                )}
              </div>
            </div>

            <hr className="my-8" />

            {/* --- MAIN CONTENT GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* LEFT COLUMN (Details) */}
              <div className="space-y-6">
                
                {/* Contact Info */}
                <div className="space-y-4">
                  {/* CHANGED: Header from About to Bio */}
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    Bio
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {profile.bio}
                  </p>
                  
                  <div className="space-y-3 pt-2">
                    {/* Only show sensitive info if it's MY profile */}
                    {isOwnProfile ? (
                      <>
                        <div className="flex items-center gap-3 text-sm">
                          <Mail size={16} className="text-blue-500" />
                          <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone size={16} className="text-blue-500" />
                          <span>{profile.phone}</span>
                        </div>
                      </>
                    ) : (
                      // Public View doesn't see Phone/Email directly
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-center text-blue-600">
                        Contact details are hidden to protect privacy.
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-sm">
                      <Linkedin size={16} className="text-blue-700" />
                      <a href="#" className="hover:underline">linkedin.com/in/{profile.name.toLowerCase().replace(" ", "")}</a>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="md:col-span-2 space-y-6">
                
                {/* REMOVED: Experience Section Block */}

                {isOwnProfile && (
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-2">Your Resume</h3>
                      <div className="flex items-center justify-between bg-background p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                           <FileText className="text-red-500" size={24} />
                           <div>
                              <p className="text-sm font-medium">Resume_Biraj_Roy.pdf</p>
                              <p className="text-xs text-muted-foreground">Uploaded 2 days ago</p>
                           </div>
                        </div>
                        <Button size="sm" variant="ghost">
                           <Download size={16} />
                        </Button>
                      </div>
                    </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}