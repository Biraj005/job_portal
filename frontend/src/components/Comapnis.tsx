"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  Plus,
  Building2,
  Loader2,
  UploadCloud,
  X,
  Trash2,
  Globe,
  MoreVertical,
} from "lucide-react";
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

  const handleDelete = async (id: number) => {
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
        toast.success("Company deleted successfully");
        const updatedCompanies = companies.filter(
          (item) => item.company_id !== id,
        );
        setCompanies(updatedCompanies);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Company not deleted");
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
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            My Companies
          </h2>
          <p className="mt-1 text-sm">
            Manage the companies you are hiring for.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className=" text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="">
                Register New Company
              </DialogTitle>
              <DialogDescription>
                Add details including your logo to start posting jobs.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="flex justify-center">
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointertransition-colors relative bg-slate-50"
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
                        className="absolute top-2 right-2 bg-red-100 p-1 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <X size={14} />
                      </button>
                      <p className="absolute bottom-1 text-xs text-gray-500 bg-white/80 px-2 rounded">
                        {selectedLogo.name}
                      </p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-8 w-8 text-blue-400 mb-2" />
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
                <label className="text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <Input
                  name="name"
                  placeholder="e.g. Acme Corp"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    name="website"
                    placeholder="https://..."
                    className="pl-9 border-gray-200 focus:border-blue-400"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  name="description"
                  placeholder="Tell us about the company..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="border-gray-200 focus:border-blue-400 resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={createLoading}
              >
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

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/50">
          <Building2 className="mx-auto h-12 w-12 text-blue-300" />
          <h3 className="mt-2 text-lg font-medium text-blue-900">
            No companies found
          </h3>
          <p className="text-sm text-blue-600/70">
            Register your first company to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 mt-2">
          {companies.map((company) => (
            <div
              key={company.company_id}
              className="flex items-center justify-between border border-blue-100 rounded-xl p-4 hover:bg-blue-50/80 transition-all bg-white/60 shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 rounded-lg overflow-hidden border border-blue-100 bg-white shrink-0 flex items-center justify-center shadow-sm">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <div className="h-full w-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-lg">
                      {company.name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-blue-900 truncate text-lg">
                    {company.name}
                  </p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <Globe size={12} /> {company.website || "No website"}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                >
                  <Link href={`/company/${company.company_id}`}>Details</Link>
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-400 hover:bg-red-50 hover:text-red-600 h-8 w-8"
                  onClick={() => handleDelete(company.company_id)}
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