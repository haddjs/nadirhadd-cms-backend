const {
	getExperiences,
	getExperienceById,
	addExperience,
	updateExperience,
	deleteExperience,
} = require("../services/experienceService");

const getExperienceController = async (req, res) => {
	try {
		const experiences = await getExperiences(req.user.id);
		res.json(experiences);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getExperienceByIdController = async (req, res) => {
	try {
		const experienceId = parseInt(req.params.id);
		const experience = await getExperienceById(experienceId, req.user.id);
		res.json(experience);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const addExperienceController = async (req, res) => {
	try {
		const experienceData = req.body;
		const experience = await addExperience(req.user.id, experienceData);
		res.status(201).json({ message: "Experience created!", experience });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateExperienceController = async (req, res) => {
	try {
		const experienceId = parseInt(req.params.id);
		const experienceData = req.body;
		const experience = await updateExperience(
			experienceId,
			req.user.id,
			experienceData
		);
		res.json({ message: "Experience updated!", experience });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteExperienceController = async (req, res) => {
	try {
		const experienceId = parseInt(req.params.id);
		const result = await deleteExperience(experienceId, req.user.id);
		res.json(result);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
	getExperiences: getExperienceController,
	getExperienceById: getExperienceByIdController,
	addExperience: addExperienceController,
	updateExperience: updateExperienceController,
	deleteExperience: deleteExperienceController,
};
