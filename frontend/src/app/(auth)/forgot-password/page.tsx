"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { AppData } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { SpinnerButton } from "@/components/Spinner";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isAuth, isLoading } = AppData();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${AUTH_URL}/auth/forgot-password`, { email });

      toast.success("Password reset link sent to your email");
      setEmail("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isAuth) {
      router.push("/");
    }
  }, [isAuth]);

  return isLoading ? (
    <SpinnerButton />
  ) : (
    !isAuth && (
      <>
        <div className="min-h-screen flex items-center justify-center bg-secondary">
          <form
            onSubmit={submitHandler}
            className="bg-background p-6 rounded-xl shadow w-full max-w-md space-y-4"
          >
            <h1 className="text-2xl font-bold text-center">Forgot Password</h1>

            <p className="text-sm text-muted-foreground text-center">
              Enter your email to receive a reset link
            </p>

            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </div>
      </>
    )
  );
}
