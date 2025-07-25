
import express from 'express';
import { login, verify } from '../controllers/authcontrollers.js';
import { verifyUser } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', verifyUser, verify); 

export default router;
