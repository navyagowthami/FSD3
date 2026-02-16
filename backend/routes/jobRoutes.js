import express from 'express';
import {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, admin, createJob);
router.put('/:id', protect, admin, updateJob);
router.delete('/:id', protect, admin, deleteJob);

export default router;
