import express from 'express';
import {
	getAllBookingsController,
	createBookingController,
	postBookingController,
    exportBookingsToExcel, // Import new controller function
    getBookingDetailsController // Import new controller function
} from '../controller/bookingController.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllBookingsController);
router.get('/create', isAdmin, createBookingController);
router.post('/', isAdmin, postBookingController);
router.get('/:id', getBookingDetailsController); // New route for booking details

router.get('/export/excel', isAdmin, exportBookingsToExcel); // New route for Excel export

export default router;
