import {
	getAllApprovals,
	createApproval,
    getPendingApprovalsForApprover,
    updateApprovalStatus
} from "../model/approval.js";
import { getAllBookings, getPendingBookingsForApprover, getBookingById, updateBookingStatus } from "../model/booking.js"; // Added getBookingById, updateBookingStatus
import { getAllUsers } from "../model/user.js";
import prisma from "../utils/db_connection.js"; // Import prisma

export const getAllApprovalsController = async (req, res) => {
	try {
		const filter = req.query.filter || '';
        const approverId = req.user.id; // Get logged-in approver's ID
		const approvals = await getPendingApprovalsForApprover(approverId); // Fetch only pending approvals for this approver
        res.locals.controllerName = 'Approvals';
		res.render("approval/index", {
			approvals,
            filter
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

export const createApprovalController = async (req, res) => {
	try {
		const bookings = await getAllBookings();
		const users = await getAllUsers();
        res.locals.controllerName = 'Approvals';
		res.render("approval/create", { bookings, users });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

export const postApprovalController = async (req, res) => {
	try {
		await createApproval(req.body);
		res.redirect("/approvals");
	} catch (error) {
		res.status(500).send(error.message);
	}
};

export const approveBookingController = async (req, res) => {
    try {
        const { id: bookingId } = req.params;
        const approverId = req.user.id;

        // Update approval record status
        await updateApprovalStatus(bookingId, approverId, 'APPROVED');

        // Check if both approvers have approved
        const booking = await getBookingById(bookingId);
        if (!booking) {
            req.flash('error', 'Booking not found.');
            return res.redirect('/approvals');
        }

        const approvals = await prisma.approval.findMany({
            where: { bookingId: parseInt(bookingId), status: 'APPROVED' }
        });

        // Assuming there are always two approvers for a booking
        if (approvals.length === 2) {
            await updateBookingStatus(bookingId, 'APPROVED');
            req.flash('success', 'Booking approved by both levels!');
        } else {
            req.flash('success', `Booking approved. Waiting for other approvals.`);
        }

        res.redirect('/approvals');
    } catch (error) {
        req.flash('error', `Error approving booking: ${error.message}`);
        res.status(500).send(error.message);
    }
};

export const rejectBookingController = async (req, res) => {
    try {
        const { id: bookingId } = req.params;
        const approverId = req.user.id;

        // Update approval record status to REJECTED
        await updateApprovalStatus(bookingId, approverId, 'REJECTED');

        // Update booking status to REJECTED
        await updateBookingStatus(bookingId, 'REJECTED');
        req.flash('success', 'Booking rejected.');
        res.redirect('/approvals');
    } catch (error) {
        req.flash('error', `Error rejecting booking: ${error.message}`);
        res.status(500).send(error.message);
    }
};