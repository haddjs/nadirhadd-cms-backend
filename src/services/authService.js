const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/db");

const login = async (username, password) => {
	const user = await prisma.user.findUnique({
		where: { username },
	});

	if (!user) {
		throw new Error("Invalid credentials");
	}

	const isMatch = await bcrypt.compare(password, user.password_hash);
	if (!isMatch) {
		throw new Error("Invalid credentials");
	}

	const token = jwt.sign(
		{ id: user.id, username: user.username },
		process.env.JWT_SECRET,
		{ expiresIn: "1d" }
	);

	return {
		token,
		user: {
			id: user.id,
			username: user.username,
			email: user.email,
		},
	};
};

module.exports = { login };
