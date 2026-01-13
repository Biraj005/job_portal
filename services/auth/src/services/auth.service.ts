// services/auth.service.ts
import { Request } from "express";
import { IUser } from "../schemas/userSchema.js";
import ApiError from "../utils/apiError.js";
import { User } from "../schemas/userSchema.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

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
    console.log("Creating user with data:", userExists);
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

      await prisma.user.create({
        data: {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          phone_number: newUser.phone_number ?? null,
          bio: newUser.bio ?? null,
        },
      });
    }
    return result.data;
  }
}
