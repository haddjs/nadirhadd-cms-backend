const express = require("express");
const multer = require("multer");
const { uploadImage, deleteImage } = require("../controllers/imageController");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();
const upload = multer({
	dest: "uploads/",
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed!"), false);
		}
	},
});

router.post("/", authenticateToken, upload.single("image"), uploadImage);
router.delete("/", authenticateToken, deleteImage);

module.exports = router;
