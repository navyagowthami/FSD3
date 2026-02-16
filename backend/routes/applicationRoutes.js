import express from 'express';
import {
    applyForJob,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, applyForJob);
router.get('/me', protect, getMyApplications);
router.get('/', protect, admin, getAllApplications);
router.put('/:id/status', protect, admin, updateApplicationStatus);

export default router;
