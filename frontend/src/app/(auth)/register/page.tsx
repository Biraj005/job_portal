"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast"
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  Phone,
  Briefcase,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Errors, SignupFormValues, signupSchema } from "@/types/User";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const Routeer = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<"RECRUITER" | "CANDIDATE">(
    "CANDIDATE",
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeName, setResumeName] = useState<string>("");

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      resume: selectedFile,
    }));
    setErrors((prev) => ({
      ...prev,
      resume: "",
    }));

    setResumeName(selectedFile.name);
  };

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Errors>({});

  const [formData, setFormData] = useState<SignupFormValues>({
    name: "",
    email: "",
    password: "",
    role: "CANDIDATE",
    bio: "",
    phone_number: "",
    resume: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: "CANDIDATE" | "RECRUITER") => {
    setCurrentRole(role);
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;
  

    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validated = signupSchema.safeParse(formData);

    if (!validated.success) {
      validated.error.issues.forEach((err) => {
        setErrors((prev) => ({
          ...prev,
          [err.path as any]: err.message,
        }));
      });

      setIsLoading(false);

      return;
    }
    if (validated.data.role === "CANDIDATE" && !validated.data.resume) {
      setErrors((prev) => ({
        ...prev,
        resume: "Please select a resume",
      }));
      setIsLoading(false);
      return;
    }

    try {
      const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;

      const payload = new FormData();

      payload.append("name", validated.data.name);
      payload.append("email", validated.data.email);
      payload.append("password", validated.data.password);
      payload.append("role", validated.data.role);
      payload.append("bio", validated.data.bio || "");
      payload.append("phone_number", validated.data.phone_number || "");

      if (validated.data.resume) {
        payload.append("file", validated.data.resume);
      }

      const { data } = await axios.post(`${AUTH_URL}/auth/register`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      if(data.success){
        toast.success(data.message);
        Routeer.push("/login"); 
      }
    } catch (error: any) {
       console.log(error);
       toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-secondary overflow-hidden py-10 px-4">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl bg-background/80 backdrop-blur-lg border rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center space-y-2 mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1 mb-2"
          >
            <span className="text-3xl font-black tracking-tight flex gap-1">
              <span className="bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Career
              </span>
              <span className="text-blue-900">Grind</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Create an account
          </h1>
         
        </div>

        <form className="space-y-6" onSubmit={submit}>
          {/* ROLE */}
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => handleRoleChange("CANDIDATE")}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:bg-accent ${
                currentRole === "CANDIDATE"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                  : "opacity-70"
              }`}
            >
              <User size={24} />
              <span className="font-semibold text-sm">Job Seeker</span>
            </div>

            <div
              onClick={() => handleRoleChange("RECRUITER")}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:bg-accent ${
                currentRole === "RECRUITER"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                  : "opacity-70"
              }`}
            >
              <Briefcase size={24} />
              <span className="font-semibold text-sm">Recruiter</span>
            </div>
          </div>

          {errors.role && (
            <p className="text-xs text-red-500 text-center">{errors.role}</p>
          )}

          {/* NAME */}
          <Input
            icon={<User size={16} />}
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
          />

          {/* EMAIL */}
          <Input
            icon={<Mail size={16} />}
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />

          {/* PHONE */}
          <Input
            icon={<Phone size={16} />}
            name="phone_number"
            placeholder="+91 98765 43210"
            value={formData.phone_number}
            onChange={handleInputChange}
          />

          {/* PASSWORD */}
          <Input
            icon={<Lock size={16} />}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {/* BIO */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="flex min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {currentRole === "CANDIDATE" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Resume (PDF)</label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <UploadCloud size={22} className="text-blue-600" />
                  </div>

                  <div>
                    <p className="font-medium text-sm">
                      {resumeName || "Click to upload your resume"}
                    </p>
                    <p className="text-xs opacity-60">
                      PDF only • Max size 2MB
                    </p>
                  </div>

                  {resumeName && (
                    <div className="flex items-center gap-2 text-green-600 text-xs">
                      <CheckCircle2 size={14} />
                      Resume uploaded successfully
                    </div>
                  )}
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleResumeSelect}
                className="hidden"
              />

              {errors.resume && (
                <span className="text-xs text-red-500">{errors.resume}</span>
              )}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}

export function Input({ icon, error, rightIcon, className, ...props }: any) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute left-3 top-2.5 opacity-50">{icon}</div>
        <input
          {...props}
          className={`flex h-10 w-full rounded-md border bg-background px-9 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            props.type === "file" ? "py-2" : ""
          } ${className}`}
        />
        {rightIcon && (
          <div className="absolute right-3 top-2.5">{rightIcon}</div>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
