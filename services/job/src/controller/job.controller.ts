import { NextFunction, raw, Response } from "express";
import { JobAuthenticatedRequest, User } from "../middlewares/authentcate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Role } from "../utils/Role.js";
import { JobService } from "../services/job.service.js";
import { application_status } from "../generated/prisma/enums.js";

const jobservice = new JobService();

export class JobController {
  static createCompany = asyncHandler(
    async (req: JobAuthenticatedRequest, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!user?.role || user.role !== Role.RECRUITER) {
        return res.status(409).json({
          success: false,
          message: "Forbiedden Only recruiter allowd",
        });
      }

      const result = await jobservice.createCompany(
        req.body,
        req.file,
        req.user?.id!,
      );

      if (!result) {
        return res.status(400).json({
          success: false,
          message: "Company not created",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Company has been created",
        company: result,
      });
    },
  );

  static deleteCompany = asyncHandler(
    async (req: JobAuthenticatedRequest, res: Response, next: NextFunction) => {
      const user = req.user;
      const job_id = req.params.id;
      if (!user?.role || user.role !== Role.RECRUITER) {
        return res.status(409).json({
          success: false,
          message: "Forbiedden Only recruiter allowd",
        });
      }
      const deletedjob = await jobservice.deleteCompany(
        Number(job_id as string),
        user.id,
      );

      if (!deletedjob) {
        return res.status(400).json({
          success: false,
          message: "Company is not deleted",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Compay has been delete",
      });
    },
  );
  static createJob = asyncHandler(
    async (req: JobAuthenticatedRequest, res: Response, next: NextFunction) => {
      const user = req.user;

      if (!user?.role || user.role !== Role.RECRUITER) {
        return res.status(409).json({
          success: false,
          message: "Forbiedden Only recruiter allowd",
        });
      }
      const newJob = await jobservice.createJob(req.body, user.id);

      if (!newJob) {
        return res.status(400).json({
          success: false,
          message: "Job is not created",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Job has been created",
        job: newJob,
      });
    },
  );

  static updateJob = asyncHandler(
    async (req: JobAuthenticatedRequest, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!user?.role || user.role !== Role.RECRUITER) {
        return res.status(409).json({
          success: false,
          message: "Forbiedden Only recruiter allowd",
        });
      }

      const updatedJob = await jobservice.updateJob(
        req.body,
        user.id,
        req.params.id as string,
      );
      if (!updatedJob) {
        return res.status(400).json({
          success: false,
          message: "Job is not updated",
        });
      }

      return res.status(200).json({
        sucess: true,
        message: "Job has been updated",
        updatedJob,
      });
    },
  );
  static getAllCompnies = asyncHandler(
    async (req: JobAuthenticatedRequest, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!user?.role || user.role !== Role.RECRUITER) {
        return res.status(409).json({
          success: false,
          message: "Forbiedden Only recruiter allowd",
        });
      }

      const getAllCompanies = await jobservice.getAllCompanies(user.id);

      return res.status(200).json({
        success: true,
        companies: getAllCompanies,
      });
    },
  );

  static getCompany = asyncHandler(
    async (req: JobAuthenticatedRequest, res: Response, next: NextFunction) => {
      const user = req.user;
      const company_id = Number(req.params.id);
      console.log(company_id)

      if (!user?.role || (user.role!==Role.CANDIDATE && user.role!==Role.RECRUITER)) {
        return res.status(409).json({
          success: false,
          message: "Forbidden: Only recruiter allowed",
        });
      }

      if (!company_id) {
        return res.status(400).json({
          success: false,
          message: "Company id is required",
        });
      }

      const company = await jobservice.getCompanyDetails(company_id, user.id);

      return res.status(200).json({
        success: true,
        company,
      });
    },
  );
  static getJobs = asyncHandler(
    async (req: JobAuthenticatedRequest, res: Response) => {
      if(!req.user || !req.user.role){
        return res.status(403).json({
          success:false,
          message:"Unauthorized"
        })
      }
      const { active, location } = req.query;

      const is_active = active !== undefined ? active === "true" : undefined;

      const work_location = location ? (location as string) : undefined;

      const jobs = await jobservice.getJobsWithFilters(
        is_active,
        work_location,
      );

      return res.status(200).json({
        success: true,
        total: jobs.length,
        jobs,
      });
    },
  );
  static getSingleJob = asyncHandler(
    async (req: JobAuthenticatedRequest, res: Response) => {
      const job_id = Number(req.params.id);

      if (!job_id) {
        return res.status(400).json({
          success: false,
          message: "Job id is required",
        });
      }

      const job = await jobservice.getSingleJob(job_id);

      return res.status(200).json({
        success: true,
        job,
      });
    },
  );
  static applyJob = asyncHandler(
    async (req: JobAuthenticatedRequest, res: Response) => {
      const user = req.user;
      const job_id = Number(req.params.id);
      const { resume } = req.body;
      if (!user || user.role !== "CANDIDATE") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized you must be an candidate",
        });
      }

      if (!job_id) {
        return res.status(400).json({
          success: false,
          message: "Job id is required",
        });
      }

      if (!resume) {
        return res.status(400).json({
          success: false,
          message: "Resume is required",
        });
      }

      const application = await jobservice.applyJob(
        job_id,
        Number(user.id),
        user.email!,
        resume,
        user.subcribed,
      );

      return res.status(201).json({
        success: true,
        message: "Applied successfully",
        application,
      });
    },
  );
  static getAllApplicationsforJob = asyncHandler(
    async (req: JobAuthenticatedRequest, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!req.params.id) {
        return res.status(400).json({
          sucess: false,
          message: "Job id is required",
        });
      }
      const job_id = Number(req.params.id);

      if (!user?.role || user.role !== Role.RECRUITER) {
        return res.status(409).json({
          success: false,
          message: "Forbidden: Only recruiter allowed",
        });
      }

      const applications = await jobservice.getAllApplicationsforJob(
        user.id,
        job_id,
      );

      return res.status(200).json({
        success: true,
        applications,
      });
    },
  );
  static updateapplicationStatus = asyncHandler(
    async (req: JobAuthenticatedRequest, res: Response, next: NextFunction) => {
      const user = req.user;
     
      const job_id = Number(req.params.jobid);
      const application_id = Number(req.params.applicantionid);
   

      if (!user?.role || user.role !== Role.RECRUITER) {
        return res.status(409).json({
          success: false,
          message: "Forbidden: Only recruiter allowed",
        });
      }
      if (!job_id || !application_id) {
        return res.status(400).json({
          success: false,
          message: "App fields required",
        });
      }

      const updateapplicationStatu = await jobservice.updateApplicationStatus(
        user.id,
        job_id,
        application_id,
        req.body.status as application_status,
      );

      if (!updateapplicationStatu) {
        return res.status(400).json({
          success: false,
          message: "application has not updated",
        });
      }

      return res.status(200).json({
        success: true,
        message: "application has been updated",
      });
    },
  );
}
