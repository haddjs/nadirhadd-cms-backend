const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const aboutRoutes = require("./routes/about");
const projectRoutes = require("./routes/projects");
const experienceRoutes = require("./routes/experience");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experience", experienceRoutes);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
