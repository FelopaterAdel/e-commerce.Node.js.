import express from 'express';
import {Register, Login, Reset_password, Update_user, Delete_user ,forgot_password } from '../controllers/user.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.patch('/',auth, Update_user);
router.delete('/',auth, Delete_user);
router.post('/Register',Register);
router.post('/login', Login);   
router.post('/reset_password',auth, Reset_password);
router.post('/forgot-password',forgot_password)
router.post('/reset-password/:token',Reset_password)


export default router;