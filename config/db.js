const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
	log: ["query", "info", "warn", "error"],
});

async function testConnection() {
	try {
		await prisma.$connect();
		console.log("Database connected!");
	} catch (error) {
		console.error("Something went wrongg!", error);
		process.exit(1);
	}
}

testConnection();

module.exports = prisma;
