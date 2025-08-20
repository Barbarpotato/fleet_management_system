import express from 'express';
import {
	getAllApprovalsController,
	createApprovalController,
	postApprovalController,
    approveBookingController, // Import new controller functions
    rejectBookingController   // Import new controller functions
} from '../controller/approvalController.js';
import { isApprover } from '../middleware/auth.js'; // Import isApprover middleware

const router = express.Router();


router.get('/', isApprover, getAllApprovalsController); // Protect with isApprover
router.get('/create', isApprover, createApprovalController); // Protect with isApprover
router.post('/', isApprover, postApprovalController); // Protect with isApprover

router.post('/:id/approve', isApprover, approveBookingController); // New route for approval
router.post('/:id/reject', isApprover, rejectBookingController);   // New route for rejection

export default router;
