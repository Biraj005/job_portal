import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthService } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { email, success } from "zod";

const authService = new AuthService();

export class AuthController {
  static registerUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.registerUser(req);

    const token = jwt.sign(
      {
        id: user?.id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
      token: token,
    });
  });

  static loginUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.loginUser(req.body);

    const token = jwt.sign(
      {
        id: user?.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      token: token,
      message: "User logged in successfully",
      user,
    });
  });
  static forgetpassword = asyncHandler(async (req: Request, res: Response) => {
    //
    const result = await authService.forgetPassword(req.body);

    if (!result.success)
      return res.status(400).json({
        success: false,
        message: "Resent link not sent",
      });
    res.status(200).json({
      success: true,
      message: "Resent link sent successfully",
    });
  });

  static resetpassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { token } = req.params;
      const { password } = req.body;
      const result = await authService.resetpassword(token as string, password);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Password not changed",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Password has been updated",
      });
    }
  );
}
