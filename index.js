import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import passport from "passport";
import initializePassport from "./config/passport-config.js"; // We will create this file
import { isLoggedIn } from "./middleware/auth.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import approvalRoutes from "./routes/approvalRoutes.js";
import seedRoutes from "./routes/seedRoutes.js"; // New import

import driverRoutes from "./routes/driverRoutes.js"; // New import

import usageRoutes from "./routes/usageRoutes.js"; // New import
import { getDashboardStatsController } from "./controller/usageController.js"; // Import dashboard controller

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Get __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up EJS
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Session configuration
const sessionConfig = {
	secret: process.env.SESSION_SECRET || "thisshouldbeabettersecret!",
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());

// Passport configuration
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currentUser = req.user; // Make user available in all templates
	res.locals.controllerName = ""; // Initialize controllerName
	next();
});

// Root route - should be defined before other routes to avoid being caught by general middleware
app.get("/", isLoggedIn, getDashboardStatsController); // Use dashboard controller for root

// Use routes
app.use("/", userRoutes);
app.use("/", seedRoutes); // Mount seedRoutes

// Apply isLoggedIn middleware to all routes after userRoutes, except for the root route
app.use(isLoggedIn);

app.use("/vehicles", vehicleRoutes);
app.use("/bookings", bookingRoutes);
app.use("/approvals", approvalRoutes);
app.use("/drivers", driverRoutes); // Mount driverRoutes
app.use("/usages", usageRoutes); // Mount usageRoutes

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something broke!';
    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
