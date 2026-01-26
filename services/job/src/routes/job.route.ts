import expess from 'express';
import { JobController } from '../controller/job.controller.js';
import { uploadFile } from '../middlewares/multer.js';
import { isAuth } from '../middlewares/authentcate.js';


const router = expess();

router.get('/user-application', isAuth, JobController.getapplicationsOfUser);
router.post('/company/new', isAuth, uploadFile, JobController.createCompany);
router.delete('/company/:id', isAuth, JobController.deleteCompany);

router.get('/company', isAuth, JobController.getAllCompnies);
router.get('/company/:id', isAuth, JobController.getCompany);

router.post('/new', isAuth, JobController.createJob);
router.put('/:id', isAuth, JobController.updateJob);
router.delete("/:id", isAuth, JobController.deleteJob);

router.get('/:id', JobController.getSingleJob);
router.get('/', isAuth, JobController.getJobs);

router.get('/:id/application', isAuth, JobController.getAllApplicationsforJob);
router.patch('/:jobid/application/:applicantionid', isAuth, JobController.updateapplicationStatus);

router.post('/:id/apply', isAuth, JobController.applyJob);


export default router;
