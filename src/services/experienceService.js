const prisma = require("../../config/db");

const getExperiences = async (userId) => {
	const experiences = await prisma.experiences.findMany({
		where: { user_id: userId },
		include: {
			experienceTech: {
				include: {
					technologies: true,
				},
			},
		},
		orderBy: {
			start_date: "desc",
		},
	});

	return experiences;
};

const getExperienceById = async (experienceId, userId) => {
	const experience = await prisma.experiences.findFirst({
		where: {
			id: experienceId,
			user_id: userId,
		},
		include: {
			experienceTech: {
				include: {
					technologies: true,
				},
			},
		},
	});

	if (!experience) {
		throw new Error("Experience not found!");
	}

	return experience;
};

const addExperience = async (userId, experienceData) => {
	const {
		company_name,
		job_title,
		job_description,
		employment_type,
		start_date,
		end_date,
		techStack,
	} = experienceData;

	const experience = await prisma.experiences.create({
		data: {
			user_id: userId,
			company_name,
			job_title,
			job_description,
			employment_type,
			start_date: new Date(start_date),
			end_date: end_date ? new Date(end_date) : null,
		},
	});

	if (techStack && techStack.length > 0) {
		for (const techName of techStack) {
			let tech = await prisma.technologies.findUnique({
				where: { name: techName },
			});

			if (!tech) {
				tech = await prisma.technologies.create({
					data: { name: techName },
				});
			}

			await prisma.experiences_Tech.create({
				data: {
					experience_id: experience.id,
					tech_id: tech.id,
				},
			});
		}
	}

	return getExperienceById(experience.id, userId);
};

const updateExperience = async (experienceId, userId, experienceData) => {
	const {
		company_name,
		job_title,
		job_description,
		employment_type,
		start_date,
		end_date,
		techStack,
	} = experienceData;

	const experience = await prisma.experiences.findFirst({
		where: {
			id: experienceId,
			user_id: userId,
		},
	});

	if (!experience) {
		throw new Error("Experience not found!");
	}

	await prisma.experiences.update({
		where: { id: experienceId },
		data: {
			company_name,
			job_title,
			job_description,
			employment_type,
			start_date: new Date(start_date),
			end_date: end_date ? new Date(end_date) : null,
		},
	});

	await prisma.experiences_Tech.deleteMany({
		where: { experience_id: experienceId },
	});

	if (techStack && techStack.length > 0) {
		for (const techName of techStack) {
			let tech = await prisma.technologies.findUnique({
				where: { name: techName },
			});
			if (!tech) {
				tech = await prisma.technologies.create({
					data: { name: techName },
				});
			}

			await prisma.experiences_Tech.create({
				data: {
					experience_id: experienceId,
					tech_id: tech.id,
				},
			});
		}
	}

	return getExperienceById(experienceId, userId);
};

const deleteExperience = async (experienceId, userId) => {
	try {
		const parseExpId = parseInt(experienceId);
		const experience = await prisma.experiences.findFirst({
			where: {
				id: parseExpId,
				user_id: userId,
			},
		});

		if (!experience) {
			throw new Error("Experience not found!");
		}

		const deleteTechRelations = await prisma.experiences_Tech.deleteMany({
			where: { experience_id: parseExpId },
		});

		await prisma.experiences.delete({
			where: { id: experienceId },
		});

		return { message: "Experience deleted successfully!" };
	} catch (error) {
		console.error("[Backend Services] error deleting experience", error);

		if (error.code === "P2025") throw new Error("Experience not found");
		if (error.code === "P2025") throw new Error("Experience not found");
	}
};

module.exports = {
	getExperiences,
	getExperienceById,
	addExperience,
	updateExperience,
	deleteExperience,
};
