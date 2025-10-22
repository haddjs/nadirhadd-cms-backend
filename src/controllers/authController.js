const { login, logout } = require("../services/authService");

const loginController = async (req, res) => {
	try {
		const { username, password } = req.body;
		const result = await login(username, password);
		res.json({ message: "Login successful", ...result });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const logoutController = async (req, res) => {
	try {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];

		if (!token) {
			return res.status(400).json({ message: "Token is missing" });
		}

		const result = await logout(token);
		res.json(result);
	} catch (error) {
		console.error("Logout error:", error);
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	login: loginController,
	logout: logoutController,
};
