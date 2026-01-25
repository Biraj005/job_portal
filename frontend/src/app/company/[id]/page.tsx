"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import {
  ArrowLeft,
  Globe,
  MapPin,
  Building,
  Loader2,
  Briefcase,
  CheckCircle2,
  Calendar,
  Plus,
  DollarSign,
  Laptop,
  Trash2,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { SpinnerButton } from "@/components/Spinner";
import { AppData } from "@/context/AppContext";

enum JobTypeEnum {
  Fulltime = "Fulltime",
  Parttime = "Parttime",
  Contract = "Contract",
  Internship = "Internship",
}

interface ICompany {
  company_id: number;
  name: string;
  description: string;
  website: string;
  location?: string;
  logo?: string;
  createdAt?: string;
}

interface IJob {
  job_id: number;
  title: string;
  description: string;
  salary: string;
  location: string;
  work_location: string;
  jobType: JobTypeEnum; 
  openings: number;
  role: string;
  createdAt: string;
  is_active: boolean;
}

const CompanyDetails = () => {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id;

  const { user } = AppData();

  const [company, setCompany] = useState<ICompany | null>(null);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [jobLoading, setJobLoading] = useState(false);
  
  const [jobFormData, setJobFormData] = useState({
    title: "",
    description: "",
    salary: "",
    location: "", 
    work_location: "Onsite", 
    jobType: "Fulltime",
    openings: 1,
    role: "",
    is_active: true, 
  });

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_JOB_URL}/job/company/${companyId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (data.success) {
          setCompany(data.company);
          if (data.company.jobs) setJobs(data.company.jobs);
        }
      } catch (error) {
        console.error(error);
        toast.error("Company not found");
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchCompanyDetails();
  }, [companyId, router]);

  const handleJobInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    setJobFormData({ ...jobFormData, [e.target.name]: value });
  };

  const handleEditClick = (e: React.MouseEvent, job: IJob) => {
    e.stopPropagation();
    setEditingJobId(job.job_id);
    
    console.log(job);
    setJobFormData({
        title: job.title,
        description: job.description || "",
        salary: job.salary || "",
        location: job.location,
        work_location: job.work_location || "Onsite",
        jobType: job.jobType as JobTypeEnum,
        openings: job.openings || 1,
        role: job.role || "",
        is_active: job.is_active, 
    });
    setIsJobDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsJobDialogOpen(open);
    if (!open) {
        setEditingJobId(null);
        setJobFormData({
            title: "",
            description: "",
            salary: "",
            location: "", 
            work_location:"Onsite", 
            jobType: "Fulltime",
            openings: 1,
            role: "",
            is_active: true, 
        });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobLoading(true);

    try {
      const token = Cookies.get("token");
      const payload = {
        ...jobFormData,
        company_id: Number(companyId),
        openings: Number(jobFormData.openings), 
      };

      let response;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (editingJobId) {
        console.log('hiii',editingJobId)
        
        response = await axios.put(
            `${process.env.NEXT_PUBLIC_JOB_URL}/job/${editingJobId}`, 
            payload,
            { headers }
        );
      } else {
        console.log(payload,editingJobId)
        
        response = await axios.post(
            `${process.env.NEXT_PUBLIC_JOB_URL}/job/new`, 
            payload,
            { headers }
        );
      }

      const data = response.data;

      if (data.success || data.newJob || data.job || data.updatedJob) {
        toast.success(editingJobId ? "Job updated successfully!" : "Job posted successfully!");
        const returnedJob = data.newJob || data.job || data.updatedJob;
        
        if (editingJobId) {
            setJobs(prev => prev.map(j => 
              j.job_id === editingJobId ? { ...j, ...returnedJob } : j
            ));
        } else {
    
            setJobs(prev => [returnedJob, ...prev]);
        }
        
        handleDialogChange(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setJobLoading(false);
    }
  };

  const handleDeleteJob = async (e: React.MouseEvent, jobId: number) => {
    e.stopPropagation();
    if(!confirm("Are you sure you want to delete this job?")) return;

    try {
        const token = Cookies.get("token");
        await axios.delete(`${process.env.NEXT_PUBLIC_JOB_URL}/job/${jobId}`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Job deleted successfully");
        setJobs(jobs.filter(job => job.job_id !== jobId));
    } catch (error) {
        console.error(error);
        toast.error("Failed to delete job");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <SpinnerButton />
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="bg-white border-b sticky top-0 z-10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2 pl-0 hover:bg-transparent"
            onClick={() => router.push('/account')}
          >
            <ArrowLeft size={18} /> Back to Companies
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="h-32 w-32 shrink-0 rounded-2xl border bg-white shadow-sm flex items-center justify-center p-2">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <Building className="h-12 w-12 text-blue-200" />
            )}
          </div>

          <div className="space-y-2 pt-2 flex-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {company.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {company.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {company.location}
                </span>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Globe size={14} />{" "}
                  {company.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium border border-green-100">
                <CheckCircle2 size={12} /> Verified Company
              </span>
            </div>
          </div>

          {user?.role === "RECRUITER" && (
            <div className="flex gap-3">
                <Dialog open={isJobDialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Plus size={16} /> Create New Job
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                    <DialogTitle>{editingJobId ? "Update Job" : "Post a New Job"}</DialogTitle>
                    <DialogDescription>
                        {editingJobId ? "Update details for this position." : `Create a job listing for ${company.name}.`}
                    </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                        id="title"
                        name="title"
                        placeholder="e.g. Senior Frontend Developer"
                        value={jobFormData.title}
                        onChange={handleJobInputChange}
                        required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="role">Role Category</Label>
                        <Input
                            id="role"
                            name="role"
                            placeholder="e.g. Engineering"
                            value={jobFormData.role}
                            onChange={handleJobInputChange}
                            required
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="openings">Openings</Label>
                        <Input
                            id="openings"
                            name="openings"
                            type="number"
                            min="1"
                            value={jobFormData.openings}
                            onChange={handleJobInputChange}
                            required
                        />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="salary">Salary Range</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                            id="salary"
                            name="salary"
                            className="pl-9"
                            placeholder="e.g. 12LPA - 18LPA"
                            value={jobFormData.salary}
                            onChange={handleJobInputChange}
                            required
                            />
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="jobType">Job Type</Label>
                        <select
                            id="jobType"
                            name="jobType"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={jobFormData.jobType}
                            onChange={handleJobInputChange}
                        >
                            <option value="Fulltime">Full-time</option>
                            <option value="Parttime">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="location">Job Location (City)</Label>
                        <div className="relative">
                            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                            id="location"
                            name="location"
                            className="pl-9"
                            placeholder="e.g. Bangalore"
                            value={jobFormData.location}
                            onChange={handleJobInputChange}
                            required
                            />
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="work_location">Work Mode</Label>
                        <div className="relative">
                            <Laptop className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <select
                            id="work_location"
                            name="work_location"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background"
                            value={jobFormData.work_location}
                            onChange={handleJobInputChange}
                            >
                            <option value="Onsite">On-site</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Job Description</Label>
                        <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe responsibilities..."
                        value={jobFormData.description}
                        onChange={handleJobInputChange}
                        rows={6}
                        required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={jobFormData.is_active}
                        onChange={handleJobInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                        Job is active and accepting applications
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={jobLoading}
                    >
                        {jobLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            {editingJobId ? "Updating..." : "Posting..."}
                        </>
                        ) : (
                            editingJobId ? "Update Job" : "Post Job"
                        )}
                    </Button>
                    </form>
                </DialogContent>
                </Dialog>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6 md:col-start-3 order-first md:order-none">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Company Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Globe size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Website
                    </p>
                    <a
                      href={company.website}
                      target="_blank"
                      className="text-sm font-medium hover:underline truncate block text-blue-700"
                    >
                      {company.website || "Not set"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Location
                    </p>
                    <p className="text-sm font-medium">
                      {company.location || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Joined
                    </p>
                    <p className="text-sm font-medium">
                      {company.createdAt
                        ? new Date(company.createdAt).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "long" },
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <Separator className="my-2" />

                {user?.role === "RECRUITER" && (
                    <div className="pt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                            Admin Actions
                        </p>
                        <Button
                            variant="outline"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                            onClick={() => {
                                if(confirm("Delete this company? This cannot be undone.")) {
                                    toast("Company deletion functionality pending");
                                }
                            }}
                        >
                            Delete Company
                        </Button>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 md:row-start-1 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>About Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {company.description ||
                    "No description provided yet. Add a description to help candidates understand your company culture and mission."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Jobs</CardTitle>
                  <CardDescription className="mt-1">
                    Open positions currently live on the platform.
                  </CardDescription>
                </div>
                <Badge variant="secondary">{jobs.length} Active</Badge>
              </CardHeader>
              <CardContent>
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div
                      onClick={()=>{
                        router.push(`/jobs/${job.job_id}`)
                      }}
                        key={job.job_id}
                        className="group flex items-center justify-between p-4 border rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer"
                      >
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin size={10} /> {job.location || "Remote"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase size={10} />{" "}
                              {job.jobType || "Full-time"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                           <Badge
                            variant={
                              job.is_active ? "default" : "outline"
                            }
                            className={
                              job.is_active ? "bg-blue-600 mb-1" : "mb-1"
                            }
                          >
                            {job.is_active ? "Active" : "Closed"}
                          </Badge>
                          
                          {user?.role === "RECRUITER" ? (
                            <div className="flex items-center gap-1">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 p-0"
                                    onClick={(e) => handleEditClick(e, job)}
                                >
                                    <Pencil size={16} />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 p-0"
                                    onClick={(e) => handleDeleteJob(e, job.job_id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                          ) : (
                             job.is_active ? (
                                <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                                    Apply Now
                                </Button>
                             ) : (
                                <span className="text-xs text-muted-foreground">Closed</span>
                             )
                          )}
                          
                          <p className="text-[10px] text-muted-foreground hidden sm:block">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-xl bg-slate-50">
                    <Briefcase className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <h3 className="text-sm font-medium text-gray-900">
                      No active jobs
                    </h3>
                    {user?.role === "RECRUITER" ? (
                        <>
                            <p className="text-xs text-muted-foreground mt-1">
                                Start hiring by creating a new job post.
                            </p>
                            <Button
                                variant="link"
                                className="text-blue-600 mt-2"
                                onClick={() => setIsJobDialogOpen(true)}
                            >
                                Post a Job
                            </Button>
                        </>
                    ) : (
                        <p className="text-xs text-muted-foreground mt-1">
                             This company hasn't posted any jobs yet.
                        </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;