// services/auth.service.ts
import { Request } from "express";
import { IUser } from "../schemas/userSchema.js";
import ApiError from "../utils/apiError.js";
import { User } from "../schemas/userSchema.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import getBufferDataUri from "../utils/buffer.js";
import axios from "axios";
import { sendDataToQueue } from "../utils/queue-config.js";
import { getHtml } from "../utils/htmpltemplet.js";

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

    let createdUser;
    if (newUser.role == "RECRUITER") {
      createdUser = await prisma.user.create({
        data: {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          phone_number: newUser.phone_number ?? null,
          bio: newUser.bio ?? null,
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

      createdUser = await prisma.user.create({
        data: {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          resume: cloude.data.url,
          resume_public_id: cloude.data.public_id,
          phone_number: newUser.phone_number ?? null,
          bio: newUser.bio ?? null,
        },
      });
    }
    sendDataToQueue({
      to: createdUser!.email,
      subject:"Welcome message",
      html: getHtml(createdUser!.name),
    });
    return createdUser;
  }

  async loginUser(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone_number: true,
        role: true,
        bio: true,
        resume: true,
        profile_picture: true,
        isSubscribed: true,
        createdAt: true,
        updatedAt: true,
        password: true,
        skills: {
          select: {
            skill: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
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
}
