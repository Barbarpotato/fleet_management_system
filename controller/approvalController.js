import {
	getAllApprovals,
	createApproval
} from "../model/approval.js";
import { getAllBookings, getPendingBookingsForApprover, getBookingById, updateBookingStatus } from "../model/booking.js"; // Added getBookingById, updateBookingStatus
import { getAllUsers } from "../model/user.js";
import prisma from "../utils/db_connection.js"; // Import prisma

export const getAllApprovalsController = async (req, res) => {
	try {
		const filter = req.query.filter || '';
		const approvals = await getAllApprovals();
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
        const { level } = req.body;
        const approverId = req.user.id;

        // Create approval record
        await createApproval({
            bookingId: parseInt(bookingId),
            approverId: approverId,
            level: parseInt(level),
            status: 'APPROVED',
            approvedAt: new Date()
        });

        // Check if both approvers have approved
        const booking = await getBookingById(bookingId);
        if (!booking) {
            req.flash('error', 'Booking not found.');
            return res.redirect('/approvals');
        }

        const approvals = await prisma.approval.findMany({
            where: { bookingId: parseInt(bookingId), status: 'APPROVED' }
        });

        const approvedLevels = approvals.map(app => app.level);

        if (approvedLevels.includes(1) && approvedLevels.includes(2)) {
            await updateBookingStatus(bookingId, 'APPROVED');
            req.flash('success', 'Booking approved by both levels!');
        } else {
            req.flash('success', `Booking approved by level ${level}. Waiting for other approvals.`);
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
        const { level } = req.body;
        const approverId = req.user.id;

        // Create rejection record
        await createApproval({
            bookingId: parseInt(bookingId),
            approverId: approverId,
            level: parseInt(level),
            status: 'REJECTED',
            approvedAt: new Date() // Use approvedAt for rejection timestamp as well
        });

        // Update booking status to REJECTED
        await updateBookingStatus(bookingId, 'REJECTED');
        req.flash('success', 'Booking rejected.');
        res.redirect('/approvals');
    } catch (error) {
        req.flash('error', `Error rejecting booking: ${error.message}`);
        res.status(500).send(error.message);
    }
};