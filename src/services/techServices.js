const prisma = require("../../config/db");

const getAllTechnologies = async () => {
	try {
		const technologies = await prisma.technologies.findMany({
			orderBy: { name: "asc" },
		});
		return technologies;
	} catch (error) {
		console.error("❌ [Service] Error in getAllTechnologies:", error);
		throw error;
	}
};

const createTechnology = async (name) => {
	try {
		const existingTech = await prisma.technologies.findUnique({
			where: { name: name.trim() },
		});

		if (existingTech) {
			console.error("❌ [Service] Technology already exists:", name);
			error.code = "P2002";
			throw error;
		}

		const technology = await prisma.technologies.create({
			data: { name: name.trim() },
		});
		return technology;
	} catch (error) {
		console.error("❌ [Service] Error in createTechnology:", error);
		throw error;
	}
};

module.exports = { getAllTechnologies, createTechnology };
