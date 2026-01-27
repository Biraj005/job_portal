"use client";

import { Job } from "@/types/jobs";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { AppData } from "@/context/AppContext";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {user} = AppData();

  async function fetchJobs() {
    setIsLoading(true);
    const token = Cookies.get("token");

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_JOB_URL}/job`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setJobs(data.jobs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);
  
  if(!user){
    router.push('/');
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-10">
        <span>
          <span className="text-4xl font-extrabold text-gray-900">
            Explore{" "}
          </span>
          <span className="text-4xl font-extrabold text-blue-900">Jobs</span>
        </span>

        {
        !isLoading && jobs.length>0 && (
            <p>{jobs.length} jobs</p>
        )
        }
      </div>
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.job_id} job={job} isRecurter={user?.role==="RECRUITER"} />
            ))}
          </div>
        )}

        {!isLoading && jobs.length === 0 && (
          <div className="text-center py-20 text-gray-500">No jobs found.</div>
        )}
      </div>
    </main>
  );
}

export default Page;
