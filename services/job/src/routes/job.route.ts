import expess from 'express';
import { JobController } from '../controller/job.controller.js';
import { uploadFile } from '../middlewares/multer.js';
import { isAuth } from '../middlewares/authentcate.js';


const router = expess();

router.post('/company/new',isAuth,uploadFile,JobController.createCompany);
router.delete("/company/:id",isAuth,JobController.deleteCompany);
router.post('/new',isAuth,JobController.createJob);
router.put('/:id',isAuth,JobController.updateJob);
router.get('/company',isAuth,JobController.getAllCompnies)
router.get('/company/:id',isAuth,JobController.getCompany);
router.get("/:id",JobController.getSingleJob);
router.get("/", isAuth,JobController.getJobs);
router.post("/:id/apply",isAuth, JobController.applyJob);
router.get('/:id/application',isAuth,JobController.getAllApplicationsforJob);
router.patch('/:jobid/application/:applicantionid',isAuth,JobController.updateapplicationStatus);





export default router;