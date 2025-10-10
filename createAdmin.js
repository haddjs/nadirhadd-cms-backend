const bcrypt = require("bcryptjs");
const prisma = require("./config/db");

async function createAdmin() {
	try {
		const salt = await bcrypt.genSalt(10);
		const password_hash = await bcrypt.hash("matchalatte22", salt);

		const user = await prisma.user.create({
			data: {
				username: "haddjs",
				email: "portfolio@nadirhadd.com",
				password_hash: password_hash,
			},
			select: {
				id: true,
				username: true,
				email: true,
			},
		});
		console.log("Admin created!", user);
		console.log("Username: haddjs");
		console.log("Password: matchalatte22");
	} catch (error) {
		console.error("Error creating user:", error.message);
	} finally {
		await prisma.$disconnect();
	}
}

createAdmin();
