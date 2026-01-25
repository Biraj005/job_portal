"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link"; // FIX: Imported from next/link for navigation
import {
  Plus,
  Building2,
  Loader2,
  UploadCloud,
  X,
  Trash2,
  Globe,
} from "lucide-react"; // FIX: Removed 'Link' from here to avoid conflict
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface ICompany {
  company_id: number;
  name: string;
  description: string;
  website: string;
  logo?: string;
}

const RecruiterCompanies = () => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_JOB_URL}/job/company`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log(data);
        if (data.success) {
          setCompanies(data.companies);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch companies");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handelDelete = async (id: number) => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_JOB_URL}/job/company/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        toast.success("Companay deleted");
      }
      const updateCompanise = companies.filter(
        (item) => item.company_id !== id,
      );
      setCompanies(updateCompanise);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Compnay not deleted");
      }
      console.log(error);
    }
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setSelectedLogo(file);
    }
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLogo(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const token = Cookies.get("token");

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("website", formData.website);

      if (selectedLogo) {
        payload.append("file", selectedLogo);
      }

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_JOB_URL}/job/company/new`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        toast.success("Company registered successfully!");
        setCompanies([...companies, data.company]);
        setIsOpen(false);
        setFormData({ name: "", description: "", website: "" });
        setSelectedLogo(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add company");
      console.log(error);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mt-16 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Companies</h2>
          <p className="text-muted-foreground mt-1">
            Manage your registered companies here.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Register New Company</DialogTitle>
              <DialogDescription>
                Add details including your logo to start posting jobs.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Logo Upload Section */}
              <div className="flex justify-center">
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative"
                >
                  {selectedLogo ? (
                    <div className="relative h-full w-full flex items-center justify-center p-2">
                      <img
                        src={URL.createObjectURL(selectedLogo)}
                        alt="Preview"
                        className="h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute top-2 right-2 bg-red-100 p-1 rounded-full text-red-600 hover:bg-red-200"
                      >
                        <X size={14} />
                      </button>
                      <p className="absolute bottom-1 text-xs text-gray-500 bg-white/80 px-2 rounded">
                        {selectedLogo.name}
                      </p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 font-medium">
                        Click to upload Logo
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG (Max 2MB)
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  name="name"
                  placeholder="e.g. Acme Corp"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <div className="relative">
                  <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    name="website"
                    placeholder="https://..."
                    className="pl-9"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  placeholder="Tell us about the company..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createLoading}>
                {createLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Register Company"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Logic */}
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
          <Building2 className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No companies found</h3>
          <p className="text-sm text-gray-500">
            Register your first company to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4 mt-6" >
          {companies.map((company) => (
            <div
              key={company.company_id}
              className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/40 transition bg-white"
            >
              {/* Left side */}
              <div className="flex items-center gap-4 min-w-0">
                {/* Logo / Placeholder */}
                <div className="h-12 w-12 rounded-md overflow-hidden border bg-white shrink-0 flex items-center justify-center">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {company.name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <p  className="font-medium truncate">{company.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {company.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/company/${company.company_id}`}>View</Link>
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handelDelete(company.company_id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterCompanies;
