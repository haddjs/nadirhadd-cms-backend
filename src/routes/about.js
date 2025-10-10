const express = require("express");
const router = express.Router();
const { getAbout, updateAbout } = require("../controllers/aboutController");
const authenticateToken = require("../middlewares/auth");

router
	.route("/")
	.get(authenticateToken, getAbout)
	.put(authenticateToken, updateAbout);

module.exports = router;
