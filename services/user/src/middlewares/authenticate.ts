import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { Role } from "../generated/prisma/enums.js";
import { Skill } from "../generated/prisma/client.js";

export interface User {
  name: string;
  id: number;
  email: string;
  phoneNumber: string | null;
  role: Role;
  bio: string | null;
  resume?: string | null;
  resumePublicId?: string | null;
  profilePicture: string | null;
  profilePicturePublicId: string | null;
  isSubscribed: boolean;
  skills: Skill[];
}
export interface UserSkill {
  id: string;
  userId: string;
  skill: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: token missing",
      });
    }
    const userFromDb = await prisma.userProfile.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        profilePicturePublicId: true,
        resume: true,
        role: true,
        bio: true,
        phoneNumber: true,
        resumePublicId: true,
        isSubscribed: true,
        skills: {
          select: {
            skill: true,
          },
        },
      },
    });
    if (!userFromDb) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token no longer exists",
      });
    }

    const user: User = {
      id: userFromDb.id,
      email: userFromDb.email,
      phoneNumber: userFromDb.phoneNumber,
      name: userFromDb.name,
      role: userFromDb.role,
      bio: userFromDb.bio,
      resume: userFromDb.resume,
      resumePublicId: userFromDb.resumePublicId,
      profilePicture: userFromDb.profilePicture,
      isSubscribed: userFromDb.isSubscribed,
      profilePicturePublicId: userFromDb.profilePicturePublicId,
      skills: userFromDb.skills.map((us) => us.skill),
    };

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: invalid or expired token",
    });
  }
};
