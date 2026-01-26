"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, FileText, User, Briefcase, CheckCircle2 } from "lucide-react";
import { SpinnerButton } from "@/components/Spinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { IResponseUser } from "@/types/User";

const AccountPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [user, setUser] = useState<IResponseUser | null>(null);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_USER_URL}/user/${id}`,
        );
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [id]);

  return isLoading ? (
    <SpinnerButton />
  ) : (
    <>
      <div className="relative overflow-hidden bg-blue-50/50 min-h-screen w-full flex items-center justify-center p-4">
        {/* Background Blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        {/* Main Card */}
        <Card className="md:w-[50%] w-full relative z-10 shadow-xl border-blue-200 bg-white/70 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-black">
              <User size={20} className="text-black" />
              User Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-32 w-32 rounded-full overflow-hidden border border-gray-300 shadow-sm">
                <img
                  src={user?.profilePicture || "/vercel.svg"}
                  alt="Profile Picture"
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="text-center md:text-left space-y-2">
                <h2 className="text-2xl font-semibold text-black">
                  {user?.name}
                </h2>

                <div className="flex flex-col gap-2 text-sm text-black">
                  <span className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail size={14} className="text-black" /> {user?.email}
                  </span>
                  
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    {user?.role !== "CANDIDATE" ? (
                      <>
                        <Briefcase size={14} className="text-black" />
                        <span className="font-medium">{user?.role}</span>
                      </>
                    ) : (
                      <>
                        <User size={14} className="text-black" />
                        <span className="font-medium">{user?.role}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="border border-blue-200 bg-white/60 rounded-lg p-4 flex items-center gap-3 w-full">
              <FileText className="text-black shrink-0" />
              <div className="min-w-0">
                {user?.resume ? (
                  <Link href={user.resume} target="_blank">
                    <p className="text-sm text-black truncate hover:underline font-medium">
                      View Resume
                    </p>
                  </Link>
                ) : (
                  <p className="text-sm text-gray-600">No resume uploaded</p>
                )}
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <h3 className="font-semibold mb-2 text-black">Bio</h3>
              {user?.bio ? (
                <p className="text-sm text-black leading-relaxed">{user.bio}</p>
              ) : (
                <p className="text-sm text-gray-500">No bio provided.</p>
              )}
            </div>

            {/* Skills Section */}
            <div>
              <h3 className="font-semibold mb-2 text-black">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((Skill) => (
                    <Badge
                      key={Skill.skillId}
                      variant="secondary"
                      className="border border-black text-black bg-white hover:bg-gray-100"
                    >
                      {Skill.skill.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">
                    No skills listed.
                  </span>
                )}
              </div>
            </div>

            <hr className="h-px bg-gray-200 border-0" />

            {/* Subscription Badge */}
            {user?.isSubscribed && (
              <div className="flex items-center">
                 <Badge className="bg-green-100 border border-green-600 text-green-800 hover:bg-green-200 px-4 py-1 h-auto flex gap-2">
                  <CheckCircle2 size={14} /> Subscribed
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AccountPage;