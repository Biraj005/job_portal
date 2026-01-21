"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const router = useRouter();
  
  const {token} = useParams();
  console.log(token);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (error) setError("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!token) {
        setError("Invalid or missing reset token.");
        setIsLoading(false);
        return;
    }

    if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long.");
        setIsLoading(false);
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
    }

    try {
      console.log("Submitting:", { token, password: formData.password });
  
      setTimeout(() => {
        setIsSuccess(true);
        setIsLoading(false);
        setTimeout(() => router.push("/login"), 3000);
      }, 1500);

    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };
  if (!token) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
            <div className="max-w-md w-full bg-background border rounded-2xl p-8 text-center shadow-xl">
                <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
                <p className="text-muted-foreground mb-6">This password reset link is invalid or has expired.</p>
                <Link href="/forgot-password">
                    <Button variant="outline">Request new link</Button>
                </Link>
            </div>
        </div>
    )
  }

  if (isSuccess) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
             <div className="max-w-md w-full bg-background border rounded-2xl p-8 text-center shadow-xl">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">Password Reset!</h2>
                <p className="text-muted-foreground mb-6">Your password has been successfully updated. You can now log in.</p>
                <Link href="/login">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Login</Button>
                </Link>
            </div>
        </div>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-secondary overflow-hidden py-10 px-4">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md bg-background/80 backdrop-blur-lg border rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center space-y-2 mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-1 mb-2">
            <span className="text-2xl font-black tracking-tight flex gap-1">
              <span className="bg-linear-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">Career</span>
              <span className="text-blue-800">Grind</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Please enter your new password below.
          </p>
        </div>
        {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
            </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">New Password</label>
            <Input
                icon={<Lock size={16} />}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                }
            />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium ml-1">Confirm Password</label>
             <Input
                icon={<Lock size={16} />}
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                rightIcon={
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="hover:text-foreground transition-colors">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                }
            />
          </div>

          <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 animate-spin" /> Resetting...
              </>
            ) : (
              <>
                Reset Password <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <div className="text-center pt-2">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                Back to Login
            </Link>
          </div>

        </form>
      </div>
    </section>
  );
}
function Input({ icon, rightIcon, className, ...props }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-2.5 opacity-50 pointer-events-none">{icon}</div>
      <input
        {...props}
        className={`flex h-10 w-full rounded-md border bg-background px-9 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
      />
      {rightIcon && (
        <div className="absolute right-3 top-2.5 opacity-50 hover:opacity-100">{rightIcon}</div>
      )}
    </div>
  );
}