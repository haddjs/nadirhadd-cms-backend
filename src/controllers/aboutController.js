const { getAbout, updateAbout } = require("../services/aboutService");

const getAboutController = async (req, res) => {
	try {
		const about = await getAbout(req.user.id);
		res.json(about);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateAboutController = async (req, res) => {
	try {
		const { profile_picture, summary_profile } = req.body;
		const about = await updateAbout(
			req.user.id,
			profile_picture,
			summary_profile
		);
		res.json({ message: "About section updated successfully", about });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAbout: getAboutController,
	updateAbout: updateAboutController,
};
