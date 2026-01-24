"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, FileText, User, Briefcase } from "lucide-react";
import { SpinnerButton } from "@/components/Spinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { IResponseUser } from "@/types/User";
import { Button } from "@/components/ui/button";

const AccountPage = () => {
  const [isLoading, setIsloaing] = useState(true);
  const { id } = useParams();
  const [user, setUser] = useState<IResponseUser | null>(null);
  useEffect(() => {
    async function init() {
      setIsloaing(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_USER_URL}/user/${id}`,
        );
        console.log(data);
        setUser(data.user);
        console.log(data.user);
      } catch {
      } finally {
        setIsloaing(false);
      }
    }
    init();
  }, []);

  return isLoading ? (
    <SpinnerButton />
  ) : (
    <>
      <div className="bg-linear-to-r from-blue-400 to-blue-100 min-h-screen w-full flex items-center justify-center p-4">
        <Card className="md:w-[50%] w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              User Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-32 w-32 rounded-full overflow-hidden border">
                <img
                  src={user?.profilePicture || "/vercel.svg"}
                  alt="Profile Picture"
                  className="object-cover w-full h-full"
                />
              </div>
              {user?.role!=="CANDIDATE" ? 
              <div className="flex"><Briefcase/> <span className="ml-1">{user?.role}</span> </div>:
              <div className="flex"><User/> <span className="ml-1">{user.role}</span> </div>
              }

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-semibold">{user?.name}</h2>

                <div className="flex flex-col gap-2 mt-2 text-sm opacity-80">
                  <span className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail size={14} /> {user?.email}
                  </span>
                  
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 flex items-center gap-3 w-full">
              <FileText className="text-red-500 shrink-0" />
              <div className="min-w-0">
                {user?.resume ? (
                  <Link href={user.resume} target="_blank">
                    <p className="text-sm opacity-70 truncate hover:underline hover:text-blue-600">
                      View Resume
                    </p>
                  </Link>
                ) : (
                  <p className="text-sm opacity-70">No resume uploaded</p>
                )}
              </div>
            </div>
            {/* Bio Section */}
            <div>
              <h3 className="font-semibold mb-2">Bio</h3>
              {user?.bio ? (
                <p className="text-sm opacity-80 leading-relaxed">{user.bio}</p>
              ) : (
                <p className="text-sm text-gray-500">No bio provided.</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((Skill) => (
                    <Badge key={Skill.skillId} variant="secondary">
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

            <hr className="h-1" />
            {
              !user?.isSubscribed && (
                <Badge className="bg-green-100 border border-black text-green-700 dark:bg-green-950 dark:text-green-600 h-10 w-1xl">Subscribed</Badge>
              )
            }
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AccountPage;
