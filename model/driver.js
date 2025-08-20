import prisma from "../utils/db_connection.js";

export const createDriver = async (data) => {
	const currentYear = new Date().getFullYear();
	const yearPrefix = `DR-${currentYear.toString().slice(2)}`;

	const lastDriver = await prisma.driver.findFirst({
		where: {
			driver_number: {
				startsWith: yearPrefix,
			},
		},
		orderBy: {
			driver_number: "desc",
		},
	});

	let nextIncrement = 1;
	if (lastDriver) {
		const lastNumber = lastDriver.driver_number;
		const lastIncrement = parseInt(lastNumber.split("-")[2]);
		nextIncrement = lastIncrement + 1;
	}

	const formattedIncrement = String(nextIncrement).padStart(4, "0");
	const driver_number = `Driver-${yearPrefix}-${formattedIncrement}`;

    // Extract and convert isActive to boolean
    const isActiveBoolean = data.isActive === 'true'; // Assuming 'true' or 'false' string from form

    // Ensure name and licenseNo are present
    const { name, licenseNo } = data; // Only destructure name and licenseNo
    if (!name || !licenseNo) {
        throw new Error("Name and License Number are required.");
    }

	return await prisma.driver.create({
        data: {
            name: name,
            licenseNo: licenseNo,
            isActive: isActiveBoolean,
            driver_number: driver_number,
            // No ...rest here to avoid unexpected properties
        }
    });
};

export const getAllDrivers = async () => {
	return await prisma.driver.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const getDriverById = async (id) => {
	return await prisma.driver.findUnique({ where: { id: parseInt(id) } });
};

export const getActiveDrivers = async () => {
    return await prisma.driver.findMany({
        where: {
            isActive: true
        }
    });
};
