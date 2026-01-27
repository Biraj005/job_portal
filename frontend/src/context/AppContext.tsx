"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios, { Axios, AxiosError } from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
export type Role = "ADMIN" | "RECRUITER" | "CANDIDATE";

export interface Skill {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  name: string;
  phoneNumber?: string | null;
  role: Role;
  email: string;

  bio?: string | null;
  resume?: string | null;
  resumePublicId?: string | null;

  profilePicture?: string | null;
  profilePicturePublicId?: string | null;

  isSubscribed: boolean;

  skills: Skill[];
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuth: boolean;
  applyBtn: number | null;
  logout: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  fetchUser: () => Promise<void>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  applyJob: (id: number) => Promise<void>;
}
export const USER_SERVICE = process.env.NEXT_PUBLIC_USER_URL;
export const AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_URL;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [applyBtn, setApplyBtn] = useState<number | null>(null);
  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) return;
      const { data } = await axios.get(`${USER_SERVICE}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const applyJob = async (id: number) => {
    setApplyBtn(id);
    const token = Cookies.get('token');
    try {
          const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_JOB_URL}/job/${id}/apply`,
        {
          resume: user?.resume,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setApplyBtn(null);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    fetchUser();
  }, [token]);

  const logout = async () => {
    setUser(null);
    setToken(null);
    setIsAuth(false);
    Cookies.remove("token");
    toast.success("Logout successfullly");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        logout,
        setUser,
        isAuth,
        fetchUser,
        setIsAuth,
        applyBtn,
        applyJob,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AppData = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
