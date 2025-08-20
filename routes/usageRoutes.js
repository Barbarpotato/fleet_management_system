import express from "express";
import {
	getAllUsagesController,
	createUsageController,
	postUsageController,
    getDashboardStatsController // Import new controller function
} from "../controller/usageController.js";
import { isLoggedIn, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isLoggedIn, getAllUsagesController);
router.get("/create", isLoggedIn, isAdmin, createUsageController);
router.post("/", isLoggedIn, isAdmin, postUsageController);

export default router;
