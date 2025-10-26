const prisma = require("../../config/db");

const getAbout = async (userId) => {
	const about = await prisma.about.findUnique({
		where: { user_id: userId },
		include: {
			user: {
				select: {
					username: true,
					email: true,
				},
			},
		},
	});

	if (!about) {
		throw new Error("About section not found!");
	}

	return about;
};

const updateAbout = async (userId, profile_picture, summary_profile) => {
	const about = await prisma.about.upsert({
		where: { user_id: userId },
		update: { profile_picture, summary_profile },
		create: { user_id: userId, profile_picture, summary_profile },
	});

	// const existingAbout = await prisma.about.findUnique({
	// 	where: { user_id: userId },
	// });

	// let about;
	// if (existingAbout) {
	// 	about = await prisma.about.update({
	// 		where: { user_id: userId },
	// 		data: {
	// 			profile_picture,
	// 			summary_profile,
	// 		},
	// 	});
	// } else {
	// 	about = await prisma.about.create({
	// 		data: {
	// 			user_id: userId,
	// 			profile_picture,
	// 			summary_profile,
	// 		},
	// 	});
	// }

	return about;
};

module.exports = {
	getAbout,
	updateAbout,
};
