"use client";

import { Job } from "@/types/jobs";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Banknote,
  Clock,
  Calendar,
  ArrowLeft,
  Globe,
  CheckCircle2,
  Send,
} from "lucide-react";
import { AppData } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { JobApplications } from "@/components/JobApplications";

function SingleJobPage() {
  const params = useParams();
  const { user, applyJob, applyBtn } = AppData();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchJobDetails() {
    if (!params?.id) return;

    setIsLoading(true);
    const token = Cookies.get("token");

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_JOB_URL}/job/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setJob(data.job || data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchJobDetails();
  }, [params?.id]);

  const handleApply = () => {
    applyJob(Number(params.id));
  };

  if (isLoading) return <LoadingSkeleton />;
  if (!job) return <div className="text-center py-20">Job not found.</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="h-16 w-16 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                {job.companis?.logo ? (
                  <img
                    src={job.companis.logo}
                    alt={job.companis.name}
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-blue-600" />
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {job.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    {job.companis?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />{" "}
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            {user?.role === "CANDIDATE" && job.is_active === true && (
              <div className="hidden md:block">
                <Button onClick={handleApply}>
                  <Send />
                  {applyBtn == Number(params.id) ? "Applying" : "Apply"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About the Job
              </h2>
              <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {job.description}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About {job.companis?.name}
              </h2>
              <p className="text-gray-600 mb-4">{job.description}</p>
              {job.companis?.website && (
                <a
                  href={job.companis.website}
                  target="_blank"
                  className="inline-flex items-center text-blue-600 hover:underline font-medium"
                >
                  Visit Website <Globe className="w-4 h-4 ml-2" />
                </a>
              )}
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="font-bold text-gray-900 text-lg mb-6">
                Job Overview
              </h3>

              <div className="space-y-5">
                <OverviewItem
                  icon={<Banknote className="w-5 h-5 text-gray-400" />}
                  label="Salary"
                  value={job.salary}
                />
                <OverviewItem
                  icon={<MapPin className="w-5 h-5 text-gray-400" />}
                  label="Job Type"
                  value={job.jobType}
                />
                <OverviewItem
                  icon={<Building2 className="w-5 h-5 text-gray-400" />}
                  label="Workplace"
                  value={job.work_location}
                />
                <OverviewItem
                  icon={<Calendar className="w-5 h-5 text-gray-400" />}
                  label="Posted On"
                  value={new Date(job.createdAt).toDateString()}
                />
                <OverviewItem
                  icon={<CheckCircle2 className="w-5 h-5 text-gray-400" />}
                  label="Status"
                  value={job.is_active ? "Active & Hiring" : "Closed"}
                  valueClass={
                    job.is_active
                      ? "text-green-600 font-medium"
                      : "text-red-500 font-bold"
                  }
                />
              </div>

              {user?.role === "CANDIDATE" && job.is_active === true && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Button onClick={handleApply}>
                    <Send />
                    {applyBtn == Number(params.id) ? "Applying" : "Apply"}
                  </Button>
                </div>
              )}
            </div>
          </div>
          {user?.role === "RECRUITER" && job.recuiter_id == user.id && (
            <JobApplications jobId={params.id as string} />
          )}
        </div>
      </div>
    </main>
  );
}

function OverviewItem({
  icon,
  label,
  value,
  valueClass = "text-gray-900 font-medium",
}: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
          {label}
        </p>
        <p className={`text-sm ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
        <div className="lg:col-span-1 h-96 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

export default SingleJobPage;
