"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Plus, Building2, MapPin, Globe, Loader2, UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
            console.log(data)
          setCompanies(data.companies);
        }
        console.log(data)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      
      // Convert to FormData to handle Image Upload
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("website", formData.website);
      
      if (selectedLogo) {
        payload.append("file", selectedLogo); // Assuming backend expects 'file' or 'logo'
      }

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_JOB_URL}/job/company/new`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Changed for File Upload
          },
        }
      );

      if (data.success) {
        toast.success("Company registered successfully!");
        setCompanies([...companies, data.company]);
        setIsOpen(false);
        // Reset Form
        setFormData({ name: "", description: "", website: ""});
        setSelectedLogo(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Failed to add company");
      }
      console.log(error);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mt-16 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-1xl font-bold tracking-tight">Companies</h2>
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
                            <p className="text-sm text-gray-500 font-medium">Click to upload Logo</p>
                            <p className="text-xs text-gray-400">PNG, JPG (Max 2MB)</p>
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

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Building2 className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium">No companies found</h3>
            <p className="text-sm text-gray-500">Register your first company to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.company_id} className="hover:shadow-lg transition-shadow">
                <CardTitle className="mx-auto">{company.name}</CardTitle>
              <CardHeader className="flex flex-row items-center gap-4">
                {/* Logo Display Logic */}
                <div className="h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden border bg-white shrink-0">
                  {company.logo ? (
                    <img 
                        src={company.logo} 
                        alt={`${company.name} logo`} 
                        className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                         {company.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
               
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {company.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Globe size={14} /> Visit Website
                  </a>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterCompanies;