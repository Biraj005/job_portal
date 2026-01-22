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
  Camera, // Added Camera icon
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
  const imageInputRef = useRef<HTMLInputElement>(null); // Added Ref for image
  const { user, isLoading, setUser } = AppData();

  const [btnLoading, setBtnLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false); // Added loading state for image
  const [addSkillLoading, setAddskillLoading] = useState(false);

  const [formUser, setFormUser] = useState<IUpdateForm>({});
  const [skillInput, setSkillInput] = useState("");
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // Added state for selected image

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

  // Added: Handle Image Selection
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
    console.log("Updating Profile:", formUser);

    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_USER_URL}/user/profile`, // Your API endpoint URL
        formUser, // The data to send (user object/form data)
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add your token here!
            "Content-Type": "application/json", // Often needed for PUT requests
          },
        },
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
        },
      );
      console.log(data);
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

  // Added: Handle Image Upload
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
        },
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
        },
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
    console.log(skill);
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_USER_URL}/user/skill`,
        {
          data: { skill: skill },

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
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
      <div className="bg-linear-to-r from-blue-400 to-blue-100 min-h-screen w-full flex items-center justify-center p-4">
        <Card className="md:w-[50%] w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              My Account
            </CardTitle>

            {/* Edit Profile Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"default"}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit profile
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogDescription>
                    <p className="mb-4">
                      Make changes to your profile here. Click update when
                      you're done.
                    </p>
                    <form onSubmit={handleProfileUpdate} className="text-base">
                      <div className="flex items-center mb-2">
                        <User className="mr-2 h-4 w-4" />
                        <Input
                          placeholder="Enter name"
                          name="name"
                          value={formUser.name || ""}
                          onChange={handleUpdateChange}
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <Mail className="mr-2 h-4 w-4" />
                        <Input
                          placeholder="Enter email"
                          name="email"
                          value={formUser.email || ""}
                          onChange={handleUpdateChange}
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <Contact className="mr-2 h-4 w-4" />
                        <Input
                          placeholder="Enter phone"
                          name="phoneNumber"
                          value={formUser.phoneNumber || ""}
                          onChange={handleUpdateChange}
                        />
                      </div>
                      <Button className="mt-2 w-full" disabled={btnLoading}>
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
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image Update Section (Same to Same as Resume) */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative h-32 w-32 rounded-full overflow-hidden border cursor-pointer group hover:opacity-90 transition-opacity">
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
                      <p className="mb-4">
                        Upload your new profile picture (Image only).
                      </p>
                      <form onSubmit={handleImageUploadSubmit}>
                        <div className="space-y-4">
                          <div
                            onClick={() => imageInputRef.current?.click()}
                            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50"
                          >
                            <div className="flex flex-col items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <UploadCloud
                                  size={22}
                                  className="text-blue-600"
                                />
                              </div>

                              <div>
                                <p className="font-medium text-sm">
                                  {selectedImage
                                    ? selectedImage.name
                                    : "Click to upload image"}
                                </p>
                                <p className="text-xs opacity-60">
                                  JPEG, PNG • Max size 2MB
                                </p>
                              </div>

                              {selectedImage && (
                                <div className="flex items-center gap-2 text-green-600 text-xs">
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
                            className="w-full"
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
                <h2 className="text-2xl font-semibold">{user?.name}</h2>

                <div className="flex flex-col gap-2 mt-2 text-sm opacity-80">
                  <span className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail size={14} /> {user?.email}
                  </span>
                  <span className="flex items-center gap-2 justify-center md:justify-start">
                    <Phone size={14} /> {user?.phoneNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="border rounded-lg p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="text-red-500 shrink-0" />
                <div className="min-w-0">
                  <Link href={user?.resume || "#"}>
                    <p className="text-sm opacity-70 truncate hover:underline">
                      {user?.resume ?? "No resume uploaded"}
                    </p>
                  </Link>
                </div>
              </div>

              {user?.role !== "RECRUITER" && (
                <div className="w-full md:w-auto">
                  {/* Upload Resume Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"outline"}>
                        <Upload className="mr-2 h-4 w-4" />
                        Update Resume
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogDescription>
                          <p className="mb-4">
                            Upload your latest resume (PDF only).
                          </p>
                          <form onSubmit={handleResumeUploadSubmit}>
                            <div className="space-y-4">
                              <div
                                onClick={() => resumeInputRef.current?.click()}
                                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50"
                              >
                                <div className="flex flex-col items-center gap-3">
                                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <UploadCloud
                                      size={22}
                                      className="text-blue-600"
                                    />
                                  </div>

                                  <div>
                                    <p className="font-medium text-sm">
                                      {selectedResume
                                        ? selectedResume.name
                                        : "Click to upload your resume"}
                                    </p>
                                    <p className="text-xs opacity-60">
                                      PDF only • Max size 2MB
                                    </p>
                                  </div>

                                  {selectedResume && (
                                    <div className="flex items-center gap-2 text-green-600 text-xs">
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
                                className="w-full"
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

            {/* Skills Section */}
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.map((Skill) => (
                  <div key={Skill.id} className="flex items-center">
                    <Badge variant="secondary" className="mr-1">
                      {Skill.name}
                    </Badge>
                    <X
                      size={14}
                      className="text-red-900 cursor-pointer hover:scale-110"
                      onClick={() => handleRemoveSkill(Skill.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full m-auto h-10 flex gap-2 mt-4">
              <Input
                className="border border-b-2 font-semibold w-[80%]"
                placeholder="Skill e.g React"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
              />
              <Button className="mx-2" onClick={handleAddSkill}>
                <ArrowRight className="mr-2 h-4 w-4" />
                {addSkillLoading ? "Adding...." : "Add skill"}
              </Button>
            </div>
            <hr className="h-1" />
             {
              user?.role==="RECRUITER"?
               
                <RecruiterCompanies/>
                :<CandidateApplications/>
          
        }
          </CardContent>
          
        </Card>
       
      </div>
    </>
  );
};

export default AccountPage;
