import { Request } from "express";
import { IUser } from "../schemas/userSchema.js";
import ApiError from "../utils/apiError.js";
import { User } from "../schemas/userSchema.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import getBufferDataUri from "../utils/buffer.js";
import axios from "axios";
import { publishEvent, ROUTING_KEYS } from "../utils/queue-config.js";
import {
  getHtmlForRegistration,
  getHtmlFroReset,
} from "../utils/htmpltemplet.js";
import jwt from "jsonwebtoken";
import { redisclient } from "../utils/redis.js";

enum HELPER {
  USER_CREATED = "user_created",
  SEND_MSG = "message_service",
}

export class AuthService {
  async registerUser(req: Request) {
    const result = IUser.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      throw new ApiError("Validation failed", 400, errors);
    }

    const userExists = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (userExists) {
      throw new ApiError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const newUser: User = {
      ...result.data,
      password: hashedPassword,
    };
    console.log(newUser)

    let createdUser;
    let resume_link = null;
    if (newUser.role == "RECRUITER") {
      createdUser = await prisma.user.create({
        data: {
          email: newUser.email,
          name: newUser.name,
          password: hashedPassword,
          role: newUser.role,
        },
      });

      console.log("Created candidate user:", createdUser);
    } else if (newUser.role == "CANDIDATE") {
      const file = req.file;

      if (!file) {
        throw new ApiError("Profile picture is required for candidates", 400);
      }
      const fileBuffer = getBufferDataUri(file);
      if (!fileBuffer || !fileBuffer.content) {
        throw new ApiError("Profile picture is required for candidates", 400, [
          { field: "profile_picture", message: "Invalid profile picture" },
        ]);
      }

      const cloude = await axios.post(
        process.env.UTIL_SERVICE_URL + "/api/utils/upload",
        {
          buffer: fileBuffer.content,
        }
      );
      resume_link = cloude.data;

      createdUser = await prisma.user.create({
        data: {
          name: newUser.name,
          email: newUser.email,
          password: hashedPassword,
          role: newUser.role,
        },
      });
    }
    const url = resume_link?.url;
    const public_id = resume_link?.public_id;
    const DataTosend = {
      email:newUser.email,
      id: createdUser?.id,
      name: createdUser?.name,
      phoneNumber: newUser.phone_number,
      role: newUser.role,
      resume: url,
      bio:newUser.bio,
      resumePublicId: public_id,
    };
    publishEvent(ROUTING_KEYS.USER_CREATED, DataTosend);
    publishEvent(ROUTING_KEYS.SEND_EMAIL, {
      to: createdUser!.email,
      subject: "Welcome message",
      html: getHtmlForRegistration(newUser.name),
    });
    return createdUser;
  }

  async loginUser(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError("Invalid credentials", 401);
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  async forgetPassword(data: { email: string }) {
    const { email } = data;

    if (!email) throw new ApiError("Invalid email", 400);

    const finduser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!finduser) {
      throw new ApiError("User not found", 400);
    }
    const resetToken = jwt.sign(
      {
        email: finduser.email,
        type: "reset",
      },
      process.env.JWT_PASS_RESET as string,
      {
        expiresIn: "15m",
      }
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await redisclient.set(`forgot:${finduser.email}`, resetToken, {
      EX: 900,
    });

    const message = {
      to: finduser.email,
      subject: "RESET YOUR PASSWORD USING THE LINL",
      html: getHtmlFroReset(resetLink, finduser.name),
    };
    
    publishEvent(ROUTING_KEYS.SEND_EMAIL, message);

    return { success: true, message: "Email send" };
  }
  async resetpassword(token: string, password: string) {
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_PASS_RESET as string);
    } catch (error: any) {
      console.log(error.message, "jooo");
      throw new ApiError("Expired token", 400);
    }

    if (decoded.type !== "reset") {
      throw new ApiError("Invalid token type", 400);
    }
    const email = decoded.email;
    const storedToken = await redisclient.get(`forgot:${email}`);

    if (!storedToken || storedToken !== token) {
      throw new ApiError("Expired token", 400);
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedpassword,
      },
    });

    await redisclient.del(`forgot:${email}`);

    return { success: true, message: "Password changed succesfully" };
  }
}
