const bcrypt = require("bcryptjs");
const prisma = require("../config/db");

async function createTech() {
	try {
		const salt = await bcrypt.genSalt(10);
		const password_hash = await bcrypt.hash("matchalatte22", salt);
		const user = await prisma.user.create({
			data: {
				username: "haddjs",
				email: "portfolio@nadirhadd.com",
				password_hash: password_hash,
				about: {
					create: {
						profile_picture: "https://picsum.photos/id/237/200/300",
						summary_profile: "Hello World!",
					},
				},
				projects: {
					create: [
						{
							project_title: "Test",
							project_description: "Test description",
							live_url: "https://youtu.be/YGNOrGlYSmk?si=nb_Za5-XF4nDReq1",
							projectTech: {
								create: [
									{
										technologies: {
											create: {
												name: "React",
											},
										},
									},
								],
							},
						},
					],
				},
				experiences: {
					create: [
						{
							company_name: "Cup of Joe garis keras",
							job_title: "Viewer",
							job_description: "Multo enak bat cok",
							start_date: new Date("2025-10-24"),
							end_date: null,
							experienceTech: {
								create: [
									{
										technologies: {
											create: {
												name: "gitar",
											},
										},
									},
								],
							},
						},
					],
				},
			},
			include: {
				about: true,
				projects: {
					include: {
						projectTech: {
							include: {
								technologies: true,
							},
						},
					},
				},
				experiences: {
					include: {
						experienceTech: {
							include: {
								technologies: true,
							},
						},
					},
				},
			},
		});

		console.log("Admin created!", user);
		console.log(`Username ${user.username}`);
		console.log(`Email ${user.email}`);

		const allTech = new Set();
		user.projects.forEach((project) => {
			project.projectTech.forEach((pt) => allTech.add(pt.technologies.name));
		});
		user.experiences.forEach((exp) => {
			exp.experienceTech.forEach((et) => allTech.add(et.technologies.name));
		});
	} catch (error) {
		console.error("Error creating tech:", error.message);
	} finally {
		await prisma.$disconnect();
	}
}

createTech();
