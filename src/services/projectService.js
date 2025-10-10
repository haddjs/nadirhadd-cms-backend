const prisma = require("../../config/db");

const getProjects = async (userId) => {
	const projects = await prisma.projects.findMany({
		where: { user_id: userId },
		include: {
			projectTech: {
				include: {
					technologies: true,
				},
			},
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
		},
	});

	if (!project) {
		throw new Error("Project not found!");
	}

	return project;
};

const createProject = async (userId, projectData) => {
	const { project_title, project_description, live_url, techStack } =
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
	return getProjectById(project.id, userId);
};

const updateProject = async (projectId, userId, projectData) => {
	const { project_title, project_description, live_url, techStack } =
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

	return getProjectById(projectId, userId);
};

const deleteProject = async (projectId, userId) => {
	const project = await prisma.projects.findFirst({
		where: {
			id: projectId,
			user_id: userId,
		},
	});

	if (!project) {
		throw new Error("Project not found!");
	}

	await prisma.projects.delete({
		where: { id: projectId },
	});

	return { message: "Project deleted successfully!" };
};

module.exports = {
	getProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
};
