import express from "express";
import {
	getAllDriversController,
	createDriverController,
	postDriverController,
} from "../controller/driverController.js";
import { isLoggedIn, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isLoggedIn, getAllDriversController);
router.get("/create", isLoggedIn, isAdmin, createDriverController);
router.post("/", isLoggedIn, isAdmin, postDriverController);

export default router;
