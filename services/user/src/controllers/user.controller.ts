import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../middlewares/authenticate.js";
import { UserService } from "../services/user.service.js";
import ApiError from "../utils/apiError.js";
import getBufferDataUri from "../utils/buffer.js";
import ErrorHandler from "../utils/erroHanler.js";

const userService = new UserService();

export class UserController {
  static myProfil = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, nex: NextFunction) => {
      const user = req.user;

      return res.status(200).json({ user });
    }
  );
  static getProfile = asyncHandler(
    async (req: Request, res: Response, nex: NextFunction) => {
      const getUser = await userService.getUserProfile(Number(req.params.id as string));
      if (!getUser) {
        throw new ApiError("User Not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "User found",
        user: getUser,
      });
    }
  );

  static updateProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, nex: NextFunction) => {
      if (!req.user) {
        throw new ApiError("Authentication required", 401);
      }
      console.log(req.body);
      const updateUser = await userService.updatUser(req.user, req.body);

      if (!updateUser) {
        return res.status(400).json({
          success: false,
          message: "User not updated",
        });
      }
      return res.status(200).json({
        succcess: true,
        message: "User has been updated",
        user: updateUser,
      });
    }
  );

  static updateProfilePic = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, nex: NextFunction) => {
      const user = req.user;

      if (!user) {
        throw new ApiError("Authentication required", 401);
      }
      const file = req.file;

      if (!file) {
        throw new ApiError("No image file provide", 400);
      }

      const updateuser = await userService.updateProfilPic(req.user!, file);

      if (!updateuser) {
        return res.status(400).json({
          success: false,
          message: "User profilepic not updated",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User profilepic has beeen updated",
        user: updateuser,
      });
    }
  );
  static updateResume = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, nex: NextFunction) => {
      const user = req.user;

      if (!user) {
        throw new ApiError("Authentication required", 401);
      }

      const file = req.file;

      if (!file) {
        throw new ApiError("No resume file provided", 400);
      }

      const updateuser = await userService.updateResume(req.user!, file);

      if (!updateuser) {
        return res.status(400).json({
          success: false,
          message: "User resume not updated",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User resume has been updated",
        user: updateuser,
      });
    }
  );
  static addSkill = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {

      if (!req.user) {
        throw new ApiError("Authentication required", 401);
      }

      const { skill } = req.body;

      const skills = await userService.skillAdd(req.user, skill);

      return res.status(200).json({
        success: true,
        message: "Skill added successfully",
        skills,
      });
    }
  );
  static deleteSkill = asyncHandler(
    async(req:AuthenticatedRequest,res:Response,nex:NextFunction)=>{
      if (!req.user) {
        throw new ApiError("Authentication required", 401);
      }

      const { skill } = req.body;

      const deletedskill = await userService.deleteSkill(req.user,skill);

      if(!deletedskill){
        return res.status(400).json({
          succcess:false,
          message:"Skill is not deleted"
        })
      }


      return res.status(200).json({
        success:true,
        message:"Skill is deleted",
        skill:deletedskill,
      })


  })
}
