const { parse } = require("dotenv");
const prisma = require("../../config/db");
const { deleteImage } = require("../services/imageService");

const getProjects = async (userId) => {
	const projects = await prisma.projects.findMany({
		where: { user_id: userId },
		include: {
			projectTech: {
				include: {
					technologies: true,
				},
			},
			images: true,
		},
	});

	return projects;
};

const getProjectById = async (projectId, userId) => {
	const project = await prisma.projects.findFirst({
		where: {
			id: projectId,
			user_id: userId,
		},
		include: {
			projectTech: {
				include: {
					technologies: true,
				},
			},
			images: true,
		},
	});

	if (!project) {
		throw new Error("Project not found!");
	}

	return project;
};

const createProject = async (userId, projectData) => {
	const { project_title, project_description, live_url, images, techStack } =
		projectData;

	const project = await prisma.projects.create({
		data: {
			user_id: userId,
			project_title,
			project_description,
			live_url,
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

			await prisma.project_Tech.create({
				data: {
					project_id: project.id,
					tech_id: tech.id,
				},
			});
		}
	}

	if (images && images.length > 0) {
		for (let i = 0; i < images.length; i++) {
			const image = images[i];
			await prisma.project_Image.create({
				data: {
					project_id: project.id,
					url: image.url,
					public_id: image.public_id,
				},
			});
		}
	}

	return getProjectById(project.id, userId);
};

const updateProject = async (projectId, userId, projectData) => {
	const { project_title, project_description, live_url, images, techStack } =
		projectData;

	const project = await prisma.projects.findFirst({
		where: {
			id: projectId,
			user_id: userId,
		},
	});

	if (!project) {
		throw new Error("Project not found!");
	}

	await prisma.projects.update({
		where: { id: projectId },
		data: {
			project_title,
			project_description,
			live_url,
		},
	});

	await prisma.project_Tech.deleteMany({
		where: { project_id: projectId },
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

			await prisma.project_Tech.create({
				data: {
					project_id: projectId,
					tech_id: tech.id,
				},
			});
		}
	}

	if (images !== undefined) {
		const existingImages = await prisma.project_Image.findMany({
			where: { project_id: projectId },
		});

		for (const image of existingImages) {
			try {
				await deleteImage(image.public_id);
			} catch (error) {
				console.error(`Failed to delete image ${image.public_id}:`, error);
			}
		}

		await prisma.project_Image.deleteMany({
			where: { project_id: projectId },
		});

		if (images && images.length > 0) {
			for (const image of images) {
				await prisma.project_Image.create({
					data: {
						project_id: projectId,
						url: image.url,
						public_id: image.public_id,
					},
				});
			}
		}
	}

	return getProjectById(projectId, userId);
};

const deleteProject = async (projectId, userId) => {
	try {
		const parseProjectId = parseInt(projectId);
		const project = await prisma.projects.findFirst({
			where: {
				id: parseProjectId,
				user_id: userId,
			},
			include: {
				images: true,
			},
		});

		if (!project) throw new Error("Project not found!");

		for (const image of project.images) {
			try {
				await deleteImage(image.public_id);
			} catch (error) {
				console.error(`Failed to delete image ${image.public_id}`, error);
			}
		}

		await prisma.project_Image.deleteMany({
			where: { project_id: parseProjectId },
		});

		const deleteTechRelations = await prisma.project_Tech.deleteMany({
			where: { project_id: parseProjectId },
		});

		const deletedProject = await prisma.projects.delete({
			where: {
				id: parseProjectId,
			},
		});

		return { message: "Project deleted successfully!", deletedProject };
	} catch (error) {
		console.error("❌ [Service] Error in deleteProject:", error);
		console.error("❌ [Service] Error code:", error.code);
		console.error("❌ [Service] Error message:", error.message);

		if (error.meta) {
			console.error("❌ [Service] Error meta:", error.meta);
		}

		if (error.code === "P2025") {
			console.error("Project not found error caught in service layer.");

			throw new Error("Project not found!");
		}

		if (error.code === "P2003") {
			console.error("❌ [Service] Foreign key constraint violation!");
			console.error(
				"❌ [Service] This means Project_Tech deleteMany didn't work properly"
			);
			throw new Error(
				"Cannot delete project due to existing technology relations"
			);
		}

		throw error;
	}
};

module.exports = {
	getProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
};
