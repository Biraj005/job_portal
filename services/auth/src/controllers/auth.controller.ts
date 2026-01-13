import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthService } from "../services/auth.service.js";
const authService = new AuthService();


export class AuthController {

  static  registerUser = asyncHandler(
    async (req: Request, res: Response) => {
      const user =await authService.registerUser(req);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    }
  );

  
}
