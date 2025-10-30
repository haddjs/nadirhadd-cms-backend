const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (file) => {
	try {
		const result = await cloudinary.uploader.upload(file, {
			folder: "portfolio",
			resource_type: "image",
			transformation: [
				{ width: 1200, height: 800, crop: "limit" },
				{ quality: "auto" },
				{ format: "webp" },
			],
		});
		return {
			url: result.secure_url,
			publicId: result.public_id,
			width: result.width,
			height: result.height,
		};
	} catch (error) {
		console.error("Image upload error:", error);
		throw new Error("Failed to upload image to cloud storage");
	}
};

const deleteImage = async (publicId) => {
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.error("Image deletion error!", error);
		throw error;
	}
};

module.exports = {
	uploadImage,
	deleteImage,
};
