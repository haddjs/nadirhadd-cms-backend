const {
	getAllTechnologies,
	createTechnology,
} = require("../services/techServices");

const getAllTechnologiesController = async (req, res) => {
	try {
		console.log("[Controller] Fetching all technologies...");
		const technologies = await getAllTechnologies();
		console.log("[Controller] Technologies fetched:", technologies.length);
		res.json(technologies);
	} catch (error) {
		console.error(
			"❌ [Controller] Error in getAllTechnologiesController:",
			error
		);
		res.status(500).json({ message: error.message });
	}
};

const createTechnologyController = async (req, res) => {
	try {
		const { name } = req.body;
		console.log(`[Controller] Creating technology with name: ${name}`);

		if (!name || name.trim() === "") {
			return res.status(400).json({ message: "Technology name is required." });
		}

		const technology = await createTechnology(name.trim());

		console.log("[Controller] Technology created:", technology);
		res.status(201).json({ message: "Technology added!", technology });
	} catch (error) {
		console.error(
			"❌ [Controller] Error in createTechnologyController:",
			error
		);
		if (error.code === "P2002") {
			return res.status(409).json({ message: "Technology already exists." });
		}

		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllTechnologies: getAllTechnologiesController,
	createTechnology: createTechnologyController,
};
