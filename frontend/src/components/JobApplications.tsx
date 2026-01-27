"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  FileText,
  Mail,
  Calendar,
  User,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Loader2,

} from "lucide-react";
import { JobApplication } from "@/types/jobs";
import  Link  from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { AppData } from "@/context/AppContext";

interface JobApplicationsProps {
  jobId: string | number;
}

type STATUS = "Hired" | "Submitted" | "Rejected";

export function JobApplications({ jobId }: JobApplicationsProps) {
    const params = useParams();
    const {user} = AppData();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [newStatus, setNewStatus] = useState<string>("Submitted");
  const [isUpdating, setIsUpdating] = useState(false);

  async function fetchApplications() {
    setIsLoading(true);
    const token = Cookies.get("token");

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_JOB_URL}/job/${jobId}/application`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setApplications(data.applications);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const handleEditClick = (app: JobApplication) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = async (id:number) => {
    if (!selectedApp || !newStatus) return;

    setIsUpdating(true);
    const token = Cookies.get("token");
    const url = `${process.env.NEXT_PUBLIC_JOB_URL}/job/${params.id}/application/${id}`;

    try {
      await axios.patch(
        url,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id ? { ...app, status: newStatus } : app,
        ),
      );

      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "hired":
        return "bg-green-100 text-green-700 border-green-200";
      case "shortlisted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "rejected":
        return "bg-red-50 text-red-600 border-red-100";
      case "reviewed":
        return "bg-purple-50 text-purple-600 border-purple-100";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
    }
  };

  const ActionMenu = ({ app }: { app: JobApplication }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(app.applicant_email)}
        >
          Copy Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleEditClick(app)}>
          Edit Status
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isLoading) return <ApplicationsSkeleton />;

  if (error) {
    return (
      <div className="p-6 text-center bg-red-50 border border-red-100 rounded-xl text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white mt-10 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Applicants</h3>
          <p className="text-sm text-gray-500">
            Total Applications: {applications.length}
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          No applications received yet.
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Resume</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Link href={`/account/${app.applicant_id}`}>
                          <User className="w-4 h-4" />
                          </Link>
                        </div>
                        <div>
                          <Link href={`/account/${app.applicant_id}`} className="font-semibold text-gray-900">
                            {app.applicant_id}
                          </Link>
                          <div className="flex items-center text-xs text-gray-500">
                            <Mail className="w-3 h-3 mr-1" />
                            {app.applicant_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(app.applied_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          app.status,
                        )}`}
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {app.resume ? (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          <FileText className="w-4 h-4" />
                          View Resume
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionMenu app={app} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden divide-y divide-gray-100">
            {applications.map((app) => (
              <div key={app.id} className="p-4 bg-white space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                     <Link href={`/account/${app.applicant_id}`}>
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                     </Link>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {app.applicant_id || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.applicant_email}
                      </p>
                    </div>
                  </div>
                  <ActionMenu app={app} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(app.applied_at).toLocaleDateString()}
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      app.status,
                    )}`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>

                {app.resume && (
                  <div className="pt-2 border-t border-gray-50">
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-sm text-blue-600 font-medium p-2 bg-blue-50 rounded-lg"
                    >
                      <FileText className="w-4 h-4" />
                      View Resume
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Accept / Reject Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Change the status for{" "}
              <span className="font-semibold text-gray-900">
                {selectedApp?.applicant_email}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Status</label>
              <Select
                value={newStatus}
                onValueChange={(val) => setNewStatus(val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hired">
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Hired
                    </span>
                  </SelectItem>
                  <SelectItem value="Rejected">
                    <span className="flex items-center text-red-600">
                      <XCircle className="w-4 h-4 mr-2" /> Rejected
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={()=>handleStatusUpdate(selectedApp?.id as number)} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ApplicationsSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="h-6 w-1/4 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
