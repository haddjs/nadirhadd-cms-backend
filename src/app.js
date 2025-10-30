const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const aboutRoutes = require("./routes/about");
const projectRoutes = require("./routes/projects");
const techRoutes = require("./routes/tech");
const experienceRoutes = require("./routes/experience");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin) return callback(null, true);

			const allowedOrigins = [process.env.VITE_URL];

			if (allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "Accept"],
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tech", techRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/upload", uploadRoutes);

app.use((err, req, res, next) => {
	console.error(err.stack);
	if (err.message === "Only image files are allowed!") {
		return res.status(400).json({ message: err.message });
	}

	if (err.code === "LIMIT_FILE_SIZE") {
		return res
			.status(400)
			.json({ message: "File too large. Maximum size is 5MB" });
	}

	res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
