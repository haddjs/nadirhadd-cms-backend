const jwt = require("jsonwebtoken");
const { isBlacklisted } = require("../services/tokenBlacklist");

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	console.log('[Auth Middleware] Path: ', req.path);
	console.log('[Auth Middleware] Token: ', !!token);
	

	if (!token) {
		return res.status(401).json({ message: "Access Token Required" });
	}

	if (isBlacklisted(token)) {
		return res.status(403).json({ message: "Token has been invalidated" });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid or expired token!" });
		}
		req.user = user;
		req.token = token;
		next();
	});
};

module.exports = authenticateToken;
