import prisma from "../lib/prisma.js";
import { User } from "../middlewares/authenticate.js";
import getBufferDataUri from "../utils/buffer.js";
import ErrorHandler from "../utils/erroHanler.js";
import ApiError from "../utils/apiError.js";
import axios from "axios";

interface IUpdate {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

export class UserService {
  async getUserProfile(id:number) {
    const user = await prisma.userProfile.findFirst({
      where: {
        id,
      },
    });

    return user;
  }

  async updatUser(user: User, data: IUpdate) {
    const { name, email, phoneNumber } = data;
    const toUpdate: IUpdate = {};
    if (name) {
      toUpdate.name = name;
    }
    if (email) {
      toUpdate.email = email;
    }
    if (phoneNumber) {
      toUpdate.phoneNumber = phoneNumber;
    }
    const updatedUser = await prisma.userProfile.update({
      where: {
        id: user.id,
      },
      data: toUpdate,
    });
    return updatedUser;
  }
  async updateProfilPic(user: User, file: Express.Multer.File) {
    const odlpublicId = user.profilePicturePublicId;

    const buffer = getBufferDataUri(file);
    if (!buffer || !buffer.content) {
      throw new ErrorHandler("failed to generate buffer", 500);
    }
    const cloude = await axios.post(
      process.env.UTIL_SERVICE_URL + "/api/utils/upload",
      {
        buffer: buffer.content,
      }
    );

    const updatedUser = await prisma.userProfile.updateManyAndReturn({
      where: {
        email: user.email,
      },
      data: {
        profilePicture: cloude.data.url,
        profilePicturePublicId: cloude.data.public_id,
      },
    });

    return updatedUser;
  }
  async updateResume(user: User, file: Express.Multer.File) {
    const oldPublicId = user.resumePublicId;

    const buffer = getBufferDataUri(file);
    if (!buffer || !buffer.content) {
      throw new ErrorHandler("failed to generate buffer", 500);
    }

    const cloud = await axios.post(
      process.env.UTIL_SERVICE_URL + "/api/utils/upload",
      {
        buffer: buffer.content,
      }
    );

    const updatedUser = await prisma.userProfile.updateManyAndReturn({
      where: {
        email: user.email,
      },
      data: {
        resume: cloud.data.url,
        resumePublicId: cloud.data.public_id,
      },
    });

    return updatedUser;
  }
  async skillAdd(user: User, skillName: string) {
    if (!skillName || !skillName.trim()) {
      throw new ApiError("Skill name is required", 400);
    }
    const skill = await prisma.skill.upsert({
      where: { name: skillName.trim() },
      update: {},
      create: { name: skillName.trim() },
    });
    const exists = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId: user.id,
          skillId: skill.id,
        },
      },
    });

    if (exists) {
      throw new ApiError("Skill already added", 409);
    }
    await prisma.userSkill.create({
      data: {
        userId: user.id,
        skillId: skill.id,
      },
    });

    const updatedSkills = await prisma.userSkill.findMany({
      where: { userId: user.id },
      include: { skill: true },
    });

    return updatedSkills.map((us) => us.skill);
  }
  async deleteSkill(user: User, skillId: string) {


    if (!skillId || !skillId.trim()) {
      throw new ApiError("Skill id is required", 400);
    }

    const findSkill = await prisma.skill.findUnique({
      where: {
        id: skillId,
      },
    });

    if (!findSkill) {
      throw new ApiError("Skill is not present", 400);
    }

    const findUserskill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          skillId: findSkill.id,
          userId: user.id,
        },
      },
    });
    if (!findUserskill) {
      throw new ApiError("Skil is not associated with the user", 400);
    }

    const deletedUserSkill = await prisma.userSkill.delete({
      where: {
        userId_skillId: {
          userId: user.id,
          skillId: findSkill.id,
        },
      },
    });

    return deletedUserSkill;
  }
}
