import {
	getAllVehicles,
	createVehicle
} from "../model/vehicle.js";

export const getAllVehiclesController = async (req, res) => {
	try {
		const vehicles = await getAllVehicles();
        res.locals.controllerName = 'Vehicles';
		res.render("vehicle/index", {
			vehicles
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

export const createVehicleController = (req, res) => {
    res.locals.controllerName = 'Vehicles';
	res.render("vehicle/create");
};

export const postVehicleController = async (req, res) => {
	try {
		const { year, lastOdometer, ...rest } = req.body;
		await createVehicle({
			...rest,
			year: parseInt(year),
			lastOdometer: parseInt(lastOdometer),
		});
		res.redirect("/vehicles");
	} catch (error) {
		res.status(500).send(error.message);
	}
};