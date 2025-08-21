import { getAllBookings, createBooking, getBookingById } from "../model/booking.js";
import { getAllUsers } from "../model/user.js";
import { getAllVehicles } from "../model/vehicle.js";
import { getAllDrivers, getActiveDrivers } from "../model/driver.js"; // Corrected import
import ExcelJS from 'exceljs'; // Import ExcelJS

export const getAllBookingsController = async (req, res) => {
	try {
		const bookings = await getAllBookings();
        res.locals.controllerName = 'Bookings';
		res.render("booking/index", {
			bookings,
            currentUser: req.user
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

export const createBookingController = async (req, res) => {
	try {
		const users = await getAllUsers(); // Still need this to filter approvers
        const approvers = users.filter(user => user.role === 'APPROVER'); // Filter for approvers
		const vehicles = await getAllVehicles();
		const drivers = await getActiveDrivers(); // Using getActiveDrivers
        res.locals.controllerName = 'Bookings';
		res.render("booking/create", { vehicles, drivers, approvers }); // Removed 'users'
	} catch (error) {
		res.status(500).send(error.message);
	}
};

export const postBookingController = async (req, res) => {
	try {
		const {
			startDate, // Extract startDate
			endDate,   // Extract endDate
			driverId,
			vehicleId,
			approver1Id,
			approver2Id,
			...rest
		} = req.body;
		await createBooking({
			...rest,
			startDate: new Date(startDate), // Convert to Date object
			endDate: new Date(endDate),     // Convert to Date object
			driverId: parseInt(driverId),
			vehicleId: parseInt(vehicleId),
			approver1Id: parseInt(approver1Id),
			approver2Id: parseInt(approver2Id),
		});
		res.redirect("/bookings");
	} catch (error) {
		res.status(500).send(error.message);
	}
};

export const exportBookingsToExcel = async (req, res) => {
    try {
        const bookings = await getAllBookings(); // Assuming getAllBookings fetches all necessary data

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Booking Report');

        // Add headers
        worksheet.columns = [
            { header: 'Booking ID', key: 'id', width: 10 },
            { header: 'Booking Number', key: 'booking_number', width: 20 },
            { header: 'Driver', key: 'driver_number', width: 20 },
            { header: 'Vehicle', key: 'vehicle_licensePlate', width: 20 },
            { header: 'Start Date', key: 'startDate', width: 15 },
            { header: 'End Date', key: 'endDate', width: 15 },
            { header: 'Destination', key: 'destination', width: 30 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Approver 1', key: 'approver1_fullName', width: 20 },
            { header: 'Approver 2', key: 'approver2_fullName', width: 20 },
        ];

        // Add rows
        bookings.forEach(booking => {
            worksheet.addRow({
                id: booking.id,
                booking_number: booking.booking_number,
                driver_number: booking.driver.driver_number, // Use booking.driver.driver_number
                vehicle_licensePlate: booking.vehicle.licensePlate,
                startDate: booking.startDate.toLocaleDateString(),
                endDate: booking.endDate.toLocaleDateString(),
                destination: booking.destination,
                status: booking.status,
                approver1_fullName: booking.approver1 ? booking.approver1.fullName : '',
                approver2_fullName: booking.approver2 ? booking.approver2.fullName : '',
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'BookingReport.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const getBookingDetailsController = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await getBookingById(id);

        if (!booking) {
            req.flash('error', 'Booking not found.');
            return res.redirect('/bookings');
        }

        res.locals.controllerName = 'Booking Details';
        res.render('booking/show', { booking });
    } catch (error) {
        req.flash('error', `Error fetching booking details: ${error.message}`);
        res.status(500).send(error.message);
    }
};