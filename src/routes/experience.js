const express = require("express");
const router = express.Router();
const {
	getExperiences,
	getExperienceById,
	addExperience,
	updateExperience,
	deleteExperience,
} = require("../controllers/experienceController");
const authenticateToken = require("../middlewares/auth");

router
	.route("/")
	.get(authenticateToken, getExperiences)
	.post(authenticateToken, addExperience);

router
	.route("/:id")
	.get(authenticateToken, getExperienceById)
	.put(authenticateToken, updateExperience)
	.delete(authenticateToken, deleteExperience);

module.exports = router;
