const { uploadImage, deleteImage } = require("../services/imageService");
const fs = require("fs");

const uploadImageController = async (req, res) => {
	try {
		if (!req.file)
			return res.status(400).json({ message: "No image file provided" });

		const imageData = await uploadImage(req.file.path);

		fs.unlinkSync(req.file.path);
		res.json({
			url: imageData.url,
			public_id: imageData.publicId,
		});
	} catch (error) {
		if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
		res.status(500).json({ message: "Image upload failed" });
	}
};

const deleteImageController = async (req, res) => {
	try {
		const { publicId } = req.body;

		if (!publicId)
			return res.status(400).json({ message: "Public ID is required" });

		await deleteImage(publicId);
		res.json({ message: "Image deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Image deletion failed" });
	}
};

module.exports = {
	uploadImage: uploadImageController,
	deleteImage: deleteImageController,
};
