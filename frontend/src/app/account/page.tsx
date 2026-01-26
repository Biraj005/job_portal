"use client";

import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  FileText,
  Upload,
  User,
  ArrowRight,
  X,
  Edit,
  Contact,
  ArrowBigUpDash,
  UploadCloud,
  CheckCircle2,
  Camera,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AppData } from "@/context/AppContext";
import { SpinnerButton } from "@/components/Spinner";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import RecruiterCompanies from "@/components/Comapnis";
import CandidateApplications from "@/components/Applications";

interface IUpdateForm {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

const AccountPage = () => {
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoading, setUser } = AppData();

  const [btnLoading, setBtnLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [addSkillLoading, setAddskillLoading] = useState(false);

  const [formUser, setFormUser] = useState<IUpdateForm>({});
  const [skillInput, setSkillInput] = useState("");
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setFormUser({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({
      ...prev,
      [name as keyof IUpdateForm]: value,
    }));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF resumes are allowed");
      return;
    }

    setSelectedResume(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only Image files are allowed");
      return;
    }

    setSelectedImage(file);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_USER_URL}/user/profile`,
        formUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Profile updated successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleResumeUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResume) return;

    setResumeLoading(true);
    const payload = new FormData();
    payload.append("file", selectedResume);
    const token = Cookies.get("token");
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_USER_URL}/user/resume`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multpart/form-data",
          },
        }
      );
      if (data.success) {
        toast.success(data.message || "Profile updated successfully");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error(error);
    } finally {
      setResumeLoading(false);
      setSelectedResume(null);
    }
  };

  const handleImageUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    setImageLoading(true);
    const payload = new FormData();
    payload.append("file", selectedImage);
    const token = Cookies.get("token");
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_USER_URL}/user/profilepic`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multpart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Profile picture updated successfully");

        if (user) {
          setUser({ ...user, profilePicture: data.user.profilePicture });
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error(error);
    } finally {
      setImageLoading(false);
      setSelectedImage(null);
    }
  };

  const handleAddSkill = async () => {
    if (!skillInput.trim()) return;
    const token = Cookies.get("token");
    setAddskillLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_USER_URL}/user/skill`,
        {
          skill: skillInput.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.success) {
        toast.success(data.message || "Skill added successfully");
      }
      const updateUser = user;
      if (updateUser) {
        updateUser!.skills = data.skills;
        setUser(updateUser);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        console.log(error);
      }
    } finally {
      setAddskillLoading(false);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = async (skill: string) => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_USER_URL}/user/skill`,
        {
          data: { skill: skill },

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.success) {
        toast.success(data.message || "Skill deleted successfully");
      }
      const updateUser = user;
      if (updateUser) {
        const newUser = { ...user };
        newUser.skills = newUser.skills.filter((item) => item.id !== skill);
        setUser(newUser);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        console.log(error);
      }
    } finally {
      setAddskillLoading(false);
    }
    setSkillInput("");
  };

  return isLoading ? (
    <SpinnerButton />
  ) : (
    <>
      <div className="relative overflow-hidden bg-blue-50/50 min-h-screen w-full flex flex-col items-center justify-center p-4">
        {/* Background Blobs for the Light Blue Theme */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        {/* Profile Card */}
        <Card className="md:w-[50%] w-full relative z-10 shadow-xl border-blue-200 bg-white/70 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-black">
              <User size={20} className="text-black" />
              My Account
            </CardTitle>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"default"} className="bg-black text-white hover:bg-gray-800">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit profile
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogDescription>
                    <p className="mb-4 text-black">
                      Make changes to your profile here. Click update when
                      you're done.
                    </p>
                    <form onSubmit={handleProfileUpdate} className="text-base text-black">
                      <div className="flex items-center mb-2">
                        <User className="mr-2 h-4 w-4 text-black" />
                        <Input
                          placeholder="Enter name"
                          name="name"
                          value={formUser.name || ""}
                          onChange={handleUpdateChange}
                          className="text-black border-gray-400"
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <Mail className="mr-2 h-4 w-4 text-black" />
                        <Input
                          placeholder="Enter email"
                          name="email"
                          value={formUser.email || ""}
                          onChange={handleUpdateChange}
                          className="text-black border-gray-400"
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <Contact className="mr-2 h-4 w-4 text-black" />
                        <Input
                          placeholder="Enter phone"
                          name="phoneNumber"
                          value={formUser.phoneNumber || ""}
                          onChange={handleUpdateChange}
                          className="text-black border-gray-400"
                        />
                      </div>
                      <Button className="mt-2 w-full bg-black text-white hover:bg-gray-800" disabled={btnLoading}>
                        <ArrowBigUpDash className="mr-2 h-4 w-4" />
                        {btnLoading ? "Updating..." : "Update"}
                      </Button>
                    </form>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative h-32 w-32 rounded-full overflow-hidden border border-gray-300 cursor-pointer group hover:opacity-90 transition-opacity">
                    <img
                      src={user?.profilePicture || "/vercel.svg"}
                      alt="Profile Picture"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white h-8 w-8" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogDescription>
                      <p className="mb-4 text-black">
                        Upload your new profile picture (Image only).
                      </p>
                      <form onSubmit={handleImageUploadSubmit}>
                        <div className="space-y-4">
                          <div
                            onClick={() => imageInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-black transition-colors bg-slate-50"
                          >
                            <div className="flex flex-col items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <UploadCloud
                                  size={22}
                                  className="text-black"
                                />
                              </div>

                              <div>
                                <p className="font-medium text-sm text-black">
                                  {selectedImage
                                    ? selectedImage.name
                                    : "Click to upload image"}
                                </p>
                                <p className="text-xs text-black">
                                  JPEG, PNG • Max size 2MB
                                </p>
                              </div>

                              {selectedImage && (
                                <div className="flex items-center gap-2 text-green-700 text-xs font-bold">
                                  <CheckCircle2 size={14} />
                                  Selected ready to upload
                                </div>
                              )}
                            </div>
                          </div>

                          <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />

                          <Button
                            className="w-full bg-black text-white hover:bg-gray-800"
                            disabled={imageLoading || !selectedImage}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {imageLoading ? "Uploading..." : "Save Picture"}
                          </Button>
                        </div>
                      </form>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-semibold text-black">{user?.name}</h2>

                <div className="flex flex-col gap-2 mt-2 text-sm text-black">
                  <span className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail size={14} className="text-black" /> {user?.email}
                  </span>
                  <span className="flex items-center gap-2 justify-center md:justify-start">
                    <Phone size={14} className="text-black" /> {user?.phoneNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-blue-200 bg-white/60 rounded-lg p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
              {user?.role === "CANDIDATE" && (
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="text-black shrink-0" />

                  <div className="min-w-0">
                    <Link href={user?.resume || "#"}>
                      <p className="text-sm text-black truncate hover:underline font-medium">
                        {user?.resume ?? "No resume uploaded"}
                      </p>
                    </Link>
                  </div>
                </div>
              )}

              {user?.role !== "RECRUITER" && (
                <div className="w-full md:w-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"outline"} className="border-black text-black hover:bg-gray-100">
                        <Upload className="mr-2 h-4 w-4" />
                        Update Resume
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogDescription>
                          <p className="mb-4 text-black">
                            Upload your latest resume (PDF only).
                          </p>
                          <form onSubmit={handleResumeUploadSubmit}>
                            <div className="space-y-4">
                              <div
                                onClick={() => resumeInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-black transition-colors bg-slate-50"
                              >
                                <div className="flex flex-col items-center gap-3">
                                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <UploadCloud
                                      size={22}
                                      className="text-black"
                                    />
                                  </div>

                                  <div>
                                    <p className="font-medium text-sm text-black">
                                      {selectedResume
                                        ? selectedResume.name
                                        : "Click to upload your resume"}
                                    </p>
                                    <p className="text-xs text-black">
                                      PDF only • Max size 2MB
                                    </p>
                                  </div>

                                  {selectedResume && (
                                    <div className="flex items-center gap-2 text-green-700 text-xs font-bold">
                                      <CheckCircle2 size={14} />
                                      Selected ready to upload
                                    </div>
                                  )}
                                </div>
                              </div>

                              <input
                                ref={resumeInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handleResumeChange}
                                className="hidden"
                              />

                              <Button
                                className="w-full bg-black text-white hover:bg-gray-800"
                                disabled={resumeLoading || !selectedResume}
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                {resumeLoading ? "Uploading..." : "Save Resume"}
                              </Button>
                            </div>
                          </form>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-black">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.map((Skill) => (
                  <div key={Skill.id} className="flex items-center">
                    <Badge
                      variant="secondary"
                      className="mr-1 border border-black text-black bg-white hover:bg-gray-100"
                    >
                      {Skill.name}
                    </Badge>
                    <X
                      size={14}
                      className="text-black cursor-pointer hover:scale-110"
                      onClick={() => handleRemoveSkill(Skill.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full m-auto h-10 flex gap-2 mt-4">
              <Input
                className="border border-b-2 font-semibold w-[80%] bg-white/50 text-black border-gray-400 placeholder:text-gray-600"
                placeholder="Skill e.g React"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
              />
              <Button className="mx-2 bg-black text-white hover:bg-gray-800" onClick={handleAddSkill}>
                <ArrowRight className="mr-2 h-4 w-4" />
                {addSkillLoading ? "Adding...." : "Add skill"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* List Card */}
        <Card className="md:w-[50%] w-full relative z-10 shadow-xl border-blue-200 bg-white/70 backdrop-blur-md mt-6">
          <CardContent className="pt-6">
            {user?.role === "RECRUITER" ? (
              <RecruiterCompanies />
            ) : (
              <CandidateApplications />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AccountPage;