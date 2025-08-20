export const isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must be signed in first!");
		return res.redirect("/login");
	}
	next();
};

export const isAdmin = (req, res, next) => {
	console.log("User object in isAdmin middleware:", req.user);
	if (req.isAuthenticated() && req.user.role === "ADMIN") {
		return next();
	}
	res.redirect("/");
};

export const isApprover = (req, res, next) => {
	if (req.isAuthenticated() && req.user.role === "APPROVER") {
		next();
	} else {
		req.flash("error", "You do not have approver permission to do that!");
		res.redirect("/");
	}
};
