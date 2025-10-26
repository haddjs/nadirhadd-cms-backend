const { PrismaClient } = require("@prisma/client");
const prisma = require("../config/db");

async function cleanUpDuplicate() {
	try {
		console.log("Finding duplicate...");

		const duplicates =
			await prisma.$queryRaw`SELECT name, COUNT(*) as count FROM "Technologies" GROUP BY name HAVING COUNT(*) > 1`;

		console.log("Duplicates found", duplicates);

		for (const dup of duplicates) {
			console.log("Cleaning up duplicates: ", dup.name);

			const technologies = await prisma.technologies.findMany({
				where: { name: dup.name },
				orderBy: { id: "asc" },
			});

			const toDelete = technologies.slice(1);

			for (const tech of toDelete) {
				console.log(`Delete technology ID: ${tech.id} - ${tech.name}`);

				await prisma.project_Tech.deleteMany({
					where: { tech_id: tech.id },
				});

				await prisma.technologies.delete({
					where: { id: tech.id },
				});
			}
		}
	} catch (error) {
		console.error("Error during cleanup", error);
	} finally {
		await prisma.$disconnect();
	}
}

cleanUpDuplicate();
