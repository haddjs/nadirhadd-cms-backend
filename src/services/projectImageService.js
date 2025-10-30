const prisma = require("../../config/db");
const { deleteImage } = require("../services/imageService");

const getProjectImages = async (projectId) => {
	try {
		const images = await prisma.project_Image.findMany({
			where: { project_id: projectId },
			orderBy: { id: "asc" },
		});
		return images;
	} catch (error) {
		console.error("[Service] Error in projectImageServices", error);
		throw error;
	}
};

const addProjectImage = async (projectId, imageData) => {
	try {
		const image = await prisma.project_Image.create({
			data: {
				project_id: projectId,
				url: imageData.url,
				public_id: imageData.public_id,
			},
		});
		return image;
	} catch (error) {
		console.error("[Service] Error in addProjectImage", error);
		throw error;
	}
};

const deleteProjectImage = async (imageId) => {
	try {
		const image = await prisma.project_Image.findUnique({
			where: { id: imageId },
		});

		if (!image) throw new Error("Image not found!");

		await deleteImage(image.public_id);

		await prisma.project_Image.delete({
			where: { id: imageId },
		});

		return { message: "Image deleted successfully!" };
	} catch (error) {
		console.error("[Service] Error in deleteProjectImage", error);
		throw error;
	}
};

module.exports = {
	getProjectImages,
	addProjectImage,
	deleteProjectImage,
};
