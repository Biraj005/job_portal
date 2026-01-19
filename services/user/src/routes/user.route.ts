import express from 'express';
import { isAuth } from '../middlewares/authenticate.js';
import { UserController } from '../controllers/user.controller.js';
import { uploadFile } from '../middlewares/multer.js';

const router =express.Router();
router.get('/me',isAuth,UserController.myProfil);
router.get('/:id',isAuth,UserController.getProfile);
router.put('/profile',isAuth,UserController.updateProfile);
router.put('/profilepic',isAuth,uploadFile,UserController.updateProfilePic);
router.put('/resume',isAuth,uploadFile,UserController.updateResume);
router.post('/skill',isAuth,UserController.addSkill);
router.delete('/skill',isAuth,UserController.deleteSkill);

export default router;