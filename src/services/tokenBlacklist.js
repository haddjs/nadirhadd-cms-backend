const tokenBlacklist = new Set();

const addToBlacklist = (token) => {
	if (typeof token !== "string") {
		console.error("Tried to blacklist a non-string token:", token);
		return;
	}
	tokenBlacklist.add(token);
	console.log(`Token blacklisted: ${token.substring(0, 20)}...`);
};

const isBlacklisted = (token) => {
	return tokenBlacklist.has(token);
};

const cleanupExpiredTokens = () => {
	const count = tokenBlacklist.size;
	tokenBlacklist.clear();
	console.log(`Cleared ${count} tokens from blacklist.`);
};

setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);

module.exports = {
	addToBlacklist,
	isBlacklisted,
};
