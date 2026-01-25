"use client";
import { Job } from "@/types/jobs";
import { MapPin, Clock, Briefcase, IndianRupee } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { AppData } from "@/context/AppContext";
interface JobCardProps {
  job: Job;
  isRecurter:boolean,
}

export function JobCard({ job,isRecurter }: JobCardProps) {
   const {applyBtn,applyJob} = AppData();
    const handleApply=(id:number)=>{
        applyJob(id);
    }
  
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            {job.companis?.logo ? (
              <img
                src={job.companis.logo}
                alt={job.companis.name}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <Briefcase className="h-6 w-6" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {job.companis?.name || "Confidential Company"}
            </h3>
            <p className="flex items-center text-xs text-gray-500 mt-0.5">
              <MapPin className="h-3 w-3 mr-1" />
              {job.location}
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {job.title}
        </h2>
        <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 mt-auto">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          <Clock className="w-3 h-3 mr-1" />
          {job.jobType}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
          <IndianRupee className="w-3 h-3 mr-1" />
          {job.salary}LPA
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {job.work_location}
        </span>
      </div>

      <div className="flex">

        <Link href={`/jobs/${job.job_id}`}>
          <Button variant={"outline"} className="cursor-pointer">
            View detals
          </Button>
        </Link>
         {
          !isRecurter && (
            <Button className="mx-auto" onClick={()=>handleApply(job.job_id)}>
            <Briefcase/>
             
             { applyBtn && (applyBtn==job.job_id) ? "Apllying...":"Apply"}
          </Button>
          )
         }
      </div>
    </div>
  );
}
