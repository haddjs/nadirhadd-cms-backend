require("dotenv").config();
const app = require("./src/app");
const prisma = require("./config/db");
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
