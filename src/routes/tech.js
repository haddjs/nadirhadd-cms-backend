const express = require("express");
const router = express.Router();
const {
	getAllTechnologies,
	createTechnology,
} = require("../controllers/techController");
const authenticateToken = require("../middlewares/auth");

router
	.route("/")
	.get(authenticateToken, getAllTechnologies)
	.post(authenticateToken, createTechnology);

module.exports = router;
