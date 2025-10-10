const express = require("express");
const router = express.Router();
const {
	getExperience,
	getExperienceById,
	addExperience,
	updateExperience,
	deleteExperience,
} = require("../controllers/experienceController");
const authenticateToken = require("../middlewares/auth");

router
	.route("/")
	.get(authenticateToken, getExperience)
	.post(authenticateToken, addExperience);

router
	.route("/:id")
	.get(authenticateToken, getExperienceById)
	.put(authenticateToken, updateExperience)
	.delete(authenticateToken, deleteExperience);

module.exports = router;
