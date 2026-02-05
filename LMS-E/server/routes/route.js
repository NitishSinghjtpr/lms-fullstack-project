
import express, { Router } from 'express'
import { getProfile, login, logout, register,forgotPassword ,resetPassword, updateUser, changePassword} from '../controllers/user.controller.js';
import {isLoggedIn} from '../middleware/auth.middleware.js';
import upload from './../middleware/multer.middleware.js';

const router = express.Router();

router.post('/register',upload.single("avatar"),register)
router.post("/login", login);
router.get("/profile", isLoggedIn, getProfile );
router.get("/logout", isLoggedIn, logout);

router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:resetToken',resetPassword);
router.post('/change-password',isLoggedIn,changePassword);
router.put('/update/profile/:id', isLoggedIn, upload.single("avatar"), updateUser);

export default router;
