import { job_location, job_type } from "../generated/prisma/enums.js";
import { application_status } from "../generated/prisma/enums.js";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/apiError.js";
import getBufferDataUri from "../utils/buffer.js";
import axios from "axios";
import { jobStatuseUpdateTemplete } from "../utils/templetes.js";
import { publishEvent, ROUTING_KEYS } from "../utils/queue-config.js";

interface JobBody {
  name?: string;
  description?: string;
  website?: string;
}

export interface Job {
  title?: string;
  description?: string;
  salary?: string; // Prisma Decimal is usually handled as string in TS
  location?: string;
  jobType?: job_type;
  openings?: number;
  role?: string;
  work_location?: job_location;
  company_id?: number;
  recuiter_id?: string;
  is_active?: boolean;
}

export class JobService {
  async createCompany(Data: JobBody, file: any, id: number) {
    if (!Data.description || !Data.name || !Data.website) {
      throw new ApiError("All fields required", 400);
    }

    const existingCompany = await prisma.companies.findFirst({
      where: {
        name: Data.name,
      },
    });

    if (existingCompany) {
      throw new ApiError("Company already exist", 409);
    }

    if (!file) {
      throw new ApiError("Company logo is required", 400);
    }

    const buffer = getBufferDataUri(file);

    if (!buffer || !buffer.content) {
      throw new ApiError("Internal server error", 500);
    }

    const cloud = await axios.post(
      process.env.UTIL_SERVICE_URL + "/api/utils/upload",
      {
        buffer: buffer.content,
      },
    );
    const newCompany = await prisma.companies.create({
      data: {
        name: Data.name,
        description: Data.description,
        website: Data.website!,
        logo: cloud.data.url,
        logo_public_id: cloud.data.public_id,
        recurter_id: id,
      },
    });
    return newCompany;
  }
  async deleteCompany(job_id: number, recuiter_id: number) {
    const find_job = await prisma.companies.findFirst({
      where: {
        company_id: job_id,
      },
    });

    if (!find_job) {
      throw new ApiError("Not valid job id", 400);
    }

    if (find_job.recurter_id !== recuiter_id) {
      throw new ApiError("Forbiden", 403);
    }

    return await prisma.companies.delete({
      where: {
        company_id: job_id,
      },
    });
  }
  async createJob(data: Job, id: number) {
    const {
      title,
      description,
      salary,
      location,
      jobType,
      openings,
      role,
      work_location,
      company_id,
    } = data;
    console.log(data);

    if (
      !title ||
      !description ||
      !salary ||
      !location ||
      !jobType ||
      !openings ||
      !role ||
      !work_location ||
      !company_id
    ) {
      throw new ApiError("All fields required", 400);
    }

    const findCompany = await prisma.companies.findFirst({
      where: {
        recurter_id: id,
        company_id: company_id,
      },
    });

    if (!findCompany) {
      throw new ApiError("Company not found", 404);
    }
    console.log(data);

    const newJob = await prisma.jobs.create({
      data: {
        description,
        title,
        jobType,
        location,
        openings,
        recuiter_id: id,
        role,
        salary,
        work_location,
        company_id,
      },
    });

    return newJob;
  }
  async updateJob(data: Job, id: number, job_id: string) {
    const {
      title,
      description,
      salary,
      location,
      jobType,
      openings,
      role,
      work_location,
      company_id,
      is_active,
    } = data;
    console.log(data);

    if (
      !title ||
      !description ||
      !salary ||
      !location ||
      !jobType ||
      !openings ||
      !role ||
      !work_location ||
      !company_id ||
      is_active == undefined
    ) {
      throw new ApiError("All fields required", 400);
    }

    const find_job = await prisma.jobs.findFirst({
      where: {
        job_id: Number(job_id),
      },
    });
    if (!find_job) {
      throw new ApiError("Job not found", 404);
    }

    if (find_job.recuiter_id !== id) {
      return new ApiError("Fobidden", 403);
    }
    const updatedJob = await prisma.jobs.update({
      where: {
        job_id: Number(job_id),
      },
      data: {
        title,
        description,
        salary,
        location,
        jobType,
        openings,
        role,
        work_location,
        company_id,
        is_active,
      },
    });

    return updatedJob;
  }

  async getAllCompanies(id: number) {
    return await prisma.companies.findMany({
      where: {
        recurter_id: id,
      },
    });
  }
  async getCompanyDetails(company_id: number, recruiter_id: number) {
    const company = await prisma.companies.findFirst({
      where: {
        company_id,

      },
      include: {
        jobs: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            application: true,
          },
        },
      },
    });

    if (!company) {
      throw new ApiError("Company not found", 404);
    }

    return company;
  }

  async getJobsWithFilters(is_active?: boolean, location?: string) {
    const where: any = {};

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (location) {
      where.location = location;
    }

    return await prisma.jobs.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        companis: {
          select: {
            company_id: true,
            name: true,
            logo: true,
            website: true,
          },
        },
      },
    });
  }
  async getSingleJob(job_id: number) {
    const job = await prisma.jobs.findFirst({
      where: {
        job_id,
      },
      include: {
        companis: {
          select: {
            company_id: true,
            name: true,
            description: true,
            website: true,
            logo: true,
          },
        },
      },
    });

    if (!job) {
      throw new ApiError("Job not found", 404);
    }

    return job;
  }
  async applyJob(
    job_id: number,
    applicant_id: number,
    applicant_email: string,
    resume: string,
    subcribed: boolean,
  ) {
    console.log(job_id, applicant_id, subcribed, resume);

    const job = await prisma.jobs.findFirst({
      where: {
        job_id,
        is_active: true,
      },
    });

    if (!job) {
      throw new ApiError("Job not found or inactive", 404);
    }
    const alreadyApplied = await prisma.applications.findUnique({
      where: {
        job_id_applicant_id: {
          job_id,
          applicant_id,
        },
        subsribed: subcribed,
      },
    });

    if (alreadyApplied) {
      throw new ApiError("Already applied to this job", 409);
    }
    const application = await prisma.applications.create({
      data: {
        job_id,
        applicant_id,
        applicant_email,
        resume,
        subsribed: subcribed,
      },
    });

    return application;
  }
  async getAllApplicationsforJob(id: number, jobid: number) {
    const find_job = await prisma.jobs.findFirst({
      where: {
        job_id: jobid,
      },
    });

    if (!find_job) {
      throw new ApiError("Invalid job id", 404);
    }
    if (find_job.recuiter_id !== id) {
      throw new ApiError("Forbiden ", 403);
    }

    return await prisma.applications.findMany({
      where: {
        job_id: jobid,
      },
      orderBy: [{ subsribed: "desc" }, { applied_at: "asc" }],
    });
  }

  async updateApplicationStatus(
    recruiter_id: number,
    job_id: number,
    applicantion_id: number,
    status: application_status,
  ) {
    const job = await prisma.jobs.findFirst({
      where: {
        job_id,
        recuiter_id: recruiter_id,
      },
    });

    if (!job) {
      throw new ApiError("Job not found or forbidden", 403);
    }

    const application = await prisma.applications.findUnique({
      where: {
        id: applicantion_id,
        job_id: job_id,
      },
    });

    if (!application) {
      throw new ApiError("Application not found", 404);
    }

    const updatedApplication = await prisma.applications.update({
      where: {
        id: applicantion_id,
        job_id: job_id,
      },
      data: {
        status,
      },
    });

    const message:any = {
      to:updatedApplication.applicant_email,
      subject:"Application update - Job portal",
      html:jobStatuseUpdateTemplete(job.title,status)

    }
    publishEvent(ROUTING_KEYS.SEND_EMAIL,message);

    return updatedApplication;
  }
}
