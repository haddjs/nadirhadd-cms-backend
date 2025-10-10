const express = require("express");
const router = express.Router();
const {
	getProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
} = require("../controllers/projectsController");
const authenticateToken = require("../middlewares/auth");

router
	.route("/")
	.get(authenticateToken, getProjects)
	.post(authenticateToken, createProject);

router
	.route("/:id")
	.get(authenticateToken, getProjectById)
	.put(authenticateToken, updateProject)
	.delete(authenticateToken, deleteProject);

module.exports = router;
