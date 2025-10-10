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
		const projectId = parseInt(req.params.id);
		const result = await deleteProject(projectId, req.user.id);
		res.json(result);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
	getProjects: getProjectsController,
	getProjectById: getProjectByIdController,
	createProject: createProjectController,
	updateProject: updateProjectController,
	deleteProject: deleteProjectController,
};
