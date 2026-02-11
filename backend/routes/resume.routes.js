import express from 'express';
import upload from '../middleware/fileHandling.middleware.js';
import {checkToken} from '../middleware/auth.middleware.js'
import { resumeHistory, resumeQuestion, uploadResume, getUserResumes } from '../controllers/resume.controller.js';
import { deleteResume } from '../controllers/deleteResume.controller.js';

const resumeRouter = express.Router();


resumeRouter.post('/upload',checkToken,upload.single('resume'),uploadResume);
resumeRouter.post('/question',checkToken,resumeQuestion);
resumeRouter.get('/history/:resumeID',checkToken,resumeHistory);
resumeRouter.delete('/delete/:resumeID',checkToken,deleteResume);
resumeRouter.get("/list", checkToken, getUserResumes);



export default resumeRouter;