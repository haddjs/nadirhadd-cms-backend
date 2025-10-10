const { login } = require("../services/authService");

const loginController = async (req, res) => {
	try {
		const { username, password } = req.body;
		const result = await login(username, password);
		res.json({ message: "Login successful", ...result });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	login: loginController,
};
