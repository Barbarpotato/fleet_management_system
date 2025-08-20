import prisma from '../utils/db_connection.js'

export const createUsage = async (data) => {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `US-${currentYear.toString().slice(2)}`;

  const lastUsage = await prisma.usage.findFirst({
    where: {
      usage_number: {
        startsWith: yearPrefix
      }
    },
    orderBy: {
      usage_number: 'desc'
    }
  });

  let nextIncrement = 1;
  if (lastUsage) {
    const lastNumber = lastUsage.usage_number;
    const lastIncrement = parseInt(lastNumber.split('-')[2]);
    nextIncrement = lastIncrement + 1;
  }

  const formattedIncrement = String(nextIncrement).padStart(4, '0');
  const usage_number = `US-${yearPrefix}-${formattedIncrement}`;

    // Fetch snapshot data and validate existence
    const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });
    if (!booking) throw new Error(`Booking with ID ${data.bookingId} not found.`);

    const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
    if (!vehicle) throw new Error(`Vehicle with ID ${data.vehicleId} not found.`);

    const driver = await prisma.driver.findUnique({ where: { id: data.driverId } });
    if (!driver) throw new Error(`Driver with ID ${data.driverId} not found.`);

  return await prisma.usage.create({ data: { 
    ...data, 
    usage_number,
    booking_number: booking.booking_number,
    vehicle_number: vehicle.vehicle_number,
    driver_number: driver.driver_number
  } });
};

export const getAllUsages = async () => {
  return await prisma.usage.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const getUsagesByVehicleId = async (vehicleId) => {
  return await prisma.usage.findMany({ where: { vehicleId: parseInt(vehicleId) } });
};

export const getVehicleUsageStats = async () => {
    return await prisma.usage.groupBy({
        by: ['vehicleId'],
        _sum: {
            startOdometer: true,
            endOdometer: true,
        },
        _count: {
            vehicleId: true,
        },
        orderBy: {
            _count: {
                vehicleId: 'desc',
            },
        },
    });
};