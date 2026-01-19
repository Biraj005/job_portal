import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../utils/Role.js";

export interface User{
  id:number,
  role:Role,
  email:string,
  subcribed :boolean
}
export interface JobAuthenticatedRequest extends Request {
  user?:User
}

export const isAuth = (
  req: JobAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded?.id || !decoded?.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: invalid token payload",
      });
    }
    const decodedUser:User = {
      id: decoded.id,
      role: decoded.role,
      email:decoded.email,
      subcribed:decoded.subcribed
    } as User;

    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      subcribed:decoded.subcribed
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: invalid or expired token",
    });
  }
};
