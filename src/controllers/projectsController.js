const {
	getProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
} = require("../services/projectService");

const getProjectsController = async (req, res) => {
	try {
		const projects = await getProjects(req.user.id);
		res.json(projects);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getProjectByIdController = async (req, res) => {
	try {
		const projectId = parseInt(req.params.id);
		const project = await getProjectById(projectId, req.user.id);
		res.json(project);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const createProjectController = async (req, res) => {
	try {
		const projectData = req.body;
		const project = await createProject(req.user.id, projectData);
		res.status(201).json({ message: "Project added!", project });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateProjectController = async (req, res) => {
	try {
		const projectId = parseInt(req.params.id);
		const projectData = req.body;
		const project = await updateProject(projectId, req.user.id, projectData);
		res.json({ message: "Project updated!", project });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteProjectController = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		console.log(
			`[Controller] Received request to delete project with ID: ${id} for user ID: ${userId}`
		);

		const result = await deleteProject(id, userId);

		console.log("[Controller] Project deletion successful:", result);
		res.json(result);
	} catch (error) {
		console.error("[Controller] Error deleting project:", error);
		console.error("[Controller] Error code:", error.code);

		if (error.message === "Project not found!") {
			return res.status(404).json({ message: error.message });
		}

		if (
			error.message.includes("Foreign key constraint failed") ||
			error.message.includes("associated")
		) {
			return res.status(400).json({
				message:
					"Cannot delete project with associated technologies. Please remove associated technologies first.",
			});
		}

		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = {
	getProjects: getProjectsController,
	getProjectById: getProjectByIdController,
	createProject: createProjectController,
	updateProject: updateProjectController,
	deleteProject: deleteProjectController,
};
