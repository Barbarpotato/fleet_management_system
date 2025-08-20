import prisma from "../utils/db_connection.js";

export const createBooking = async (data) => {
    if (data.approver1Id === data.approver2Id) {
        throw new Error("Approver 1 and Approver 2 cannot be the same.");
    }

	const timestamp = Date.now();
	const randomString = Math.random().toString(36).substring(2, 8); // Generate a random alphanumeric string
	const booking_number = `BK-${timestamp}-${randomString}`;

	// Fetch snapshot data and validate existence
	const vehicle = await prisma.vehicle.findUnique({
		where: { id: data.vehicleId },
	});
	if (!vehicle)
		throw new Error(`Vehicle with ID ${data.vehicleId} not found.`);

	const driver = await prisma.driver.findUnique({
		where: { id: data.driverId },
	});
	if (!driver) throw new Error(`Driver with ID ${data.driverId} not found.`);

	return await prisma.booking.create({
		data: {
			...data,
			booking_number,
			vehicle_number: vehicle.vehicle_number,
			driver_number: driver.driver_number,
			approver1Id: data.approver1Id,
			approver2Id: data.approver2Id,
		},
	});
};

export const getAllBookings = async () => {
	return await prisma.booking.findMany({
		include: {
			approver1: true, // Include approver1 details
			approver2: true, // Include approver2 details
			vehicle: true, // Include vehicle details
			driver: true, // Include driver details
		},
        orderBy: {
            createdAt: 'desc' // Order by creation date, newest first
        }
	});
};

export const getBookingById = async (id) => {
	return await prisma.booking.findUnique({
		where: { id: parseInt(id) },
		include: {
			approvals: {
				include: {
					approver: true, // Include approver details for each approval
				},
			},
			vehicle: true,
			driver: true,
			approver1: true,
			approver2: true,
		},
	});
};

export const getPendingBookingsForApprover = async (approverId) => {
	return await prisma.booking.findMany({
		where: {
			status: "PENDING",
			OR: [{ approver1Id: approverId }, { approver2Id: approverId }],
		},
		include: {
			approvals: true, // Include related approvals to check approval status
			vehicle: true, // Include vehicle details
			driver: true, // Include driver details
		},
	});
};

export const updateBookingStatus = async (id, newStatus) => {
	return await prisma.booking.update({
		where: { id: parseInt(id) },
		data: { status: newStatus },
	});
};
