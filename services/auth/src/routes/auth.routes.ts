import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { uploadFile } from '../middlewares/multer.js';


const router = express.Router();

// Example route for user login
router.post('/register',uploadFile,AuthController.registerUser);
// router.post('/login',registerUser);

export default router;