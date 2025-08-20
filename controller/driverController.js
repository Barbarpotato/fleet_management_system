import {
	getAllDrivers,
	createDriver
} from "../model/driver.js";

export const getAllDriversController = async (req, res) => {
	try {
		const drivers = await getAllDrivers();
        res.locals.controllerName = 'Drivers';
		res.render("driver/index", {
			drivers
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

export const createDriverController = (req, res) => {
    res.locals.controllerName = 'Drivers';
	res.render("driver/create");
};

export const postDriverController = async (req, res) => {
	try {
		await createDriver(req.body);
		req.flash('success', 'Driver created successfully!');
		res.redirect("/drivers");
	} catch (error) {
		req.flash('error', `Error creating driver: ${error.message}`);
		res.status(500).send(error.message);
	}
};