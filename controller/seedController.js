import bcrypt from "bcryptjs";
import { createUser } from "../model/user.js";
import prisma from "../utils/db_connection.js";

export const seedUsers = async (req, res) => {
	try {
		// Create Admin User
		const adminPassword = await bcrypt.hash("admin123", 10);
		await createUser({
			username: "admin@example.com",
			password: adminPassword,
			fullName: "Admin User",
			role: "ADMIN",
			department: "IT",
		});

		// Create Approver User 1
		const approver1Password = await bcrypt.hash("approver123", 10);
		await createUser({
			username: "approver1@example.com",
			password: approver1Password,
			fullName: "Approver One",
			role: "APPROVER",
			department: "Finance",
		});

		// Create Approver User 2
		const approver2Password = await bcrypt.hash("approver456", 10);
		await createUser({
			username: "approver2@example.com",
			password: approver2Password,
			fullName: "Approver Two",
			role: "APPROVER",
			department: "HR",
		});

		req.flash("success", "Users seeded successfully!");
		res.redirect("/login");
	} catch (error) {
		req.flash("error", `Error seeding users: ${error.message}`);
		res.status(500).send(error.message);
	}
};

export const seedVehicles = async (req, res) => {
    try {
        await prisma.vehicle.createMany({
            data: [
                { licensePlate: 'B 1234 ABC', model: 'Toyota Avanza', year: 2020, status: 'ACTIVE', lastOdometer: 50000, vehicle_number: `VHC-${Date.now()}-ABC` },
                { licensePlate: 'B 5678 DEF', model: 'Honda CRV', year: 2018, status: 'ACTIVE', lastOdometer: 75000, vehicle_number: `VHC-${Date.now() + 1}-DEF` },
                { licensePlate: 'B 9101 GHI', model: 'Mitsubishi Xpander', year: 2021, status: 'UNAVAILABLE', lastOdometer: 30000, vehicle_number: `VHC-${Date.now() + 2}-GHI` },
            ],
            skipDuplicates: true,
        });
        req.flash("success", "Vehicles seeded successfully!");
        res.redirect("/login"); // Or wherever appropriate
    } catch (error) {
        req.flash("error", `Error seeding vehicles: ${error.message}`);
        res.status(500).send(error.message);
    }
};

export const seedDrivers = async (req, res) => {
    try {
        await prisma.driver.createMany({
            data: [
                { name: 'John Doe', licenseNo: 'SIM1234567890', isActive: true, driver_number: 'DRV001' },
                { name: 'Jane Smith', licenseNo: 'SIM0987654321', isActive: true, driver_number: 'DRV002' },
                { name: 'Peter Jones', licenseNo: 'SIM1122334455', isActive: false, driver_number: 'DRV003' },
            ],
            skipDuplicates: true,
        });
        req.flash("success", "Drivers seeded successfully!");
        res.redirect("/login"); // Or wherever appropriate
    } catch (error) {
        req.flash("error", `Error seeding drivers: ${error.message}`);
        res.status(500).send(error.message);
    }
};

export const clearNonUserDataController = async (req, res) => {
	try {
		console.log("Clearing non-user data...");
		// Delete in order to respect foreign key constraints
		await prisma.usage.deleteMany({});
		await prisma.approval.deleteMany({});
		await prisma.booking.deleteMany({});
		await prisma.vehicle.deleteMany({});
		await prisma.driver.deleteMany({});

		console.log("Non-user data cleared successfully!");

		req.flash("success", "Non-user data cleared successfully!");
		res.redirect("/"); // Redirect to home or a suitable page
	} catch (error) {
		console.log("Error clearing non-user data:", error);
		req.flash("error", `Error clearing non-user data: ${error.message}`);
		res.status(500).send(error.message);
	}
};