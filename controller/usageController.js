import { getAllUsages, createUsage, getVehicleUsageStats } from "../model/usage.js";
import { getAllVehicles } from "../model/vehicle.js";
import prisma from "../utils/db_connection.js"; // Import prisma

export const getAllUsagesController = async (req, res) => {
	try {
		const usages = await getAllUsages();
        res.locals.controllerName = 'Usages';
		res.render("usage/index", {
			usages
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

export const createUsageController = async (req, res) => {
    // You might need to fetch vehicles and drivers to populate dropdowns in the form
    // For now, just render the form
    res.locals.controllerName = 'Usages';
	res.render("usage/create");
};

export const postUsageController = async (req, res) => {
	try {
		await createUsage(req.body);
		req.flash('success', 'Usage record created successfully!');
		res.redirect("/usages");
	} catch (error) {
		req.flash('error', `Error creating usage record: ${error.message}`);
		res.status(500).send(error.message);
	}
};

export const getDashboardStatsController = async (req, res) => {
    try {
        // Data for Approved Bookings by Vehicle
        const approvedBookingsStats = await prisma.booking.groupBy({
            by: ['vehicleId'],
            _count: {
                id: true,
            },
            where: {
                status: 'APPROVED',
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
        });

        const vehicles = await getAllVehicles(); // Fetch all vehicles to map IDs to names

        const vehicleChartData = {
            labels: [], // Vehicle names
            datasets: [{
                label: 'Number of Approved Bookings',
                data: [], // Count of approved bookings for each vehicle
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        approvedBookingsStats.forEach(stat => {
            const vehicle = vehicles.find(v => v.id === stat.vehicleId);
            if (vehicle) {
                vehicleChartData.labels.push(vehicle.model);
                vehicleChartData.datasets[0].data.push(stat._count.id);
            }
        });

        // Data for Booking Counts by Date
        const allApprovedBookings = await prisma.booking.findMany({
            where: {
                status: 'APPROVED',
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        const bookingCountsByDate = {};
        allApprovedBookings.forEach(booking => {
            const date = booking.createdAt.toISOString().split('T')[0]; // Get YYYY-MM-DD
            bookingCountsByDate[date] = (bookingCountsByDate[date] || 0) + 1;
        });

        const dateChartData = {
            labels: Object.keys(bookingCountsByDate),
            datasets: [{
                label: 'Number of Bookings',
                data: Object.values(bookingCountsByDate),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        };

        res.locals.controllerName = 'Dashboard';
        res.render("dashboard/index", {
            vehicleChartData: JSON.stringify(vehicleChartData),
            dateChartData: JSON.stringify(dateChartData)
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};