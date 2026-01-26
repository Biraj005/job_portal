"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Briefcase, Calendar, MapPin } from "lucide-react";
import { JobApplication } from "@/types/jobs";

const CandidateApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        console.log(token);
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_JOB_URL}/job/user-application`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (data.success) {
          setApplications(data.applications);
        }
        console.log(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACCEPTED":
      case "OFFER":
        return (
          <Badge className="bg-green-600 hover:bg-green-700 text-white">
            Accepted
          </Badge>
        );
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "INTERVIEWING":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
            Interviewing
          </Badge>
        );
      case "PENDING":
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
          >
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="w-full  p-1">
      <div className="mb-3">
        <h2 className="text-2xl font-bold ">
          My Applications
        </h2>
        <p className=" mt-2">
          Track the status of your job applications
        </p>
      </div>

      <Card className="border-blue-200 shadow-xl bg-blue-50/90 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-sm text-blue-600/80 font-medium">
                Loading your applications...
              </p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 px-2">
              <div className="mx-auto h-15 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Briefcase className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semiboldmb-2">
                No applications yet
              </h3>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-blue-100/50 border-blue-200">
                    <TableRow className="hover:bg-transparent border-blue-200">
                      <TableHead className="font-semibold text-blue-900">
                        Company
                      </TableHead>
                      <TableHead className="font-semibold text-blue-900">
                        Role
                      </TableHead>
                      <TableHead className="font-semibold text-blue-900">
                        Applied Date
                      </TableHead>
                      <TableHead className="text-right font-semibold text-blue-900">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app, index) => (
                      <TableRow
                        key={app.id}
                        className="hover:bg-blue-100/50 transition-colors border-blue-200"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                              {app.job.companis.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-blue-900">
                                {app.job.companis.name}
                              </p>
                              {app.job.location && (
                                <p className="text-xs text-blue-600/70 flex items-center gap-1 mt-0.5">
                                  <MapPin size={12} />
                                  {app.job.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-700">
                            {app.job.title}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Calendar size={16} className="text-blue-500" />
                            {new Date(app.applied_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusBadge(app.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-blue-200">
                {applications.map((app, index) => (
                  <div
                    key={app.id}
                    className="p-4 hover:bg-blue-100/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                          {app.job.companis.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-blue-900 truncate">
                            {app.job.companis.name}
                          </p>
                          <p className="text-sm text-blue-800/70 truncate">
                            {app.job.title}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 shrink-0">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-blue-500" />
                        <span>
                          {new Date(app.applied_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      {app.job.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-blue-500" />
                          <span className="truncate">{app.job.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateApplications;