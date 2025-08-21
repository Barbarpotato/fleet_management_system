import prisma from '../utils/db_connection.js'

export const createApproval = async (data) => {
    // Fetch snapshot data and validate existence
    const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });
    if (!booking) throw new Error(`Booking with ID ${data.bookingId} not found.`);

    const approver = await prisma.user.findUnique({ where: { id: data.approverId } });
    if (!approver) throw new Error(`Approver with ID ${data.approverId} not found.`);

    return await prisma.approval.create({ data: { 
        ...data, 
        booking_number: booking.booking_number,
        approver_username: approver.username
    } });
};

export const getAllApprovals = async () => {
  return await prisma.approval.findMany({
        include: {
            booking: true, // Include booking details for filtering/display
            approver: true // Include approver details for filtering/display
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const getApprovalById = async (id) => {
  return await prisma.approval.findUnique({ where: { id: parseInt(id) } });
};

export const getPendingApprovalsForApprover = async (approverId) => {
    return await prisma.approval.findMany({
        where: {
            approverId: approverId,
            status: "PENDING",
        },
        include: {
            booking: true, // Include booking details
            approver: true, // Include approver details
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
};

export const updateApprovalStatus = async (bookingId, approverId, newStatus) => {
    return await prisma.approval.updateMany({
        where: {
            bookingId: parseInt(bookingId),
            approverId: parseInt(approverId),
        },
        data: {
            status: newStatus,
            approvedAt: new Date(),
        },
    });
};