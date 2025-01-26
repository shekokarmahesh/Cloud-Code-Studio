import express from 'express';
// import pingCheck from './ping';
import projectRouter from './project.js';


const router = express.Router();

// router.use('/ping', pingCheck);

router.use('/projects', projectRouter);

export default router;