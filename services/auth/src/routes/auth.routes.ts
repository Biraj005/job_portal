import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import {uploadFile } from '../middlewares/multer.js';


const router = express.Router();

router.post('/register',uploadFile,AuthController.registerUser);
router.post('/login',AuthController.loginUser);
router.post('/forgot-password',AuthController.forgetpassword);
router.post('/reset-password/:token',AuthController.resetpassword);

export default router;