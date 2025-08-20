import bcrypt from 'bcryptjs';
import {
	getAllUsers,
	createUser
} from "../model/user.js";

export const getAllUsersController = async (req, res) => {
	try {
		const users = await getAllUsers();
        res.locals.controllerName = 'Users';
		res.render("user/index", {
			users
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

export const createUserController = (req, res) => {
    res.locals.controllerName = 'Users';
	res.render("user/create");
};

export const postUserController = async (req, res) => {
	try {
		const { username, password, fullName, role, department } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
		await createUser({ username, password: hashedPassword, fullName, role, department });
		req.flash('success', 'User created successfully!');
		res.redirect("/users");
	} catch (error) {
		req.flash('error', `Error creating user: ${error.message}`);
		res.status(500).send(error.message);
	}
};