import prisma from "../utils/db_connection.js";

export const createVehicle = async (data) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random alphanumeric string
    const vehicle_number = `VHC-${timestamp}-${randomString}`;

	return await prisma.vehicle.create({ data: { ...data, vehicle_number } });
};

export const getAllVehicles = async () => {
	return await prisma.vehicle.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const getVehicleById = async (id) => {
	return await prisma.vehicle.findUnique({ where: { id: parseInt(id) } });
};
