import express from 'express'
import isVerified from '../middleware/isVerified.js'
import upload from '../middleware/multerConfig.js'
import { messageFriend, getMessages } from '../controllers/messageController.js';


const router = express.Router();

router.post('/send/:id', isVerified, messageFriend);
router.get('/getmessage/:id', isVerified, getMessages);

export default router;