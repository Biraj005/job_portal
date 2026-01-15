import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  RECRUITER = "RECRUITER",
}


export interface User {
  id: string;
  email: string;
  password: string;
  name: string;

  phone_number?: string | null;
  role: Role;

  bio?: string | null;

  resume?: string | null;
  resume_public_id?: string | null;

  profile_picture?: string | null;
  profile_picture_public_id?: string | null;

  isSubscribed: boolean;

  skills: UserSkill[];

  createdAt: Date;
  updatedAt: Date;
}
export interface UserSkill {
  id: string;
  userId: string;
  skill: string;
}


export interface AuthenticatedRequest extends Request{
  user?:User
}

export const isAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: token missing",
      });
    }
    
    /// get User

    


  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: invalid or expired token",
    });
  }
};
