"use client";

import React, { useState, useEffect } from "react";
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
import { Loader2, Briefcase, Calendar, Building } from "lucide-react";

interface IApplication {
  _id: string;
  job: {
    title: string;
    company: {
      name: string;
      logo?: string;
    };
    location: string;
  };
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "INTERVIEWING";
  createdAt: string;
}

const CandidateApplications = () => {
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_USER_URL}/application/get`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
          setApplications(data.application); // Assuming API returns { application: [] }
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Helper for Status Badge Color
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACCEPTED":
      case "OFFER":
        return <Badge className="bg-green-600 hover:bg-green-700">Accepted</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "INTERVIEWING":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Interviewing</Badge>;
      case "PENDING":
      default:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-1xl font-bold tracking-tight">My Applications</h2>
        <p className="text-muted-foreground mt-1">
          Track the status of your job applications.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-sm text-gray-500">Loading your applications...</p>
             </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
              <p className="text-sm text-gray-500 mt-2">
                You haven't applied to any jobs yet. Start browsing!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-75">Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-500 font-bold border">
                           {/* Fallback to first letter if no logo */}
                           {app.job.company.logo ? (
                               <img src={app.job.company.logo} alt="logo" className="h-full w-full object-cover rounded"/>
                           ) : (
                               <Building size={18} />
                           )}
                        </div>
                        <div>
                            <p className="font-medium">{app.job.company.name}</p>
                            <p className="text-xs text-gray-500">{app.job.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                        {app.job.title}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Calendar size={14}/>
                            {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {getStatusBadge(app.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateApplications;