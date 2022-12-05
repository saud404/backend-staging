const jwt = require('jsonwebtoken');
const verifyEmailVerificationToken = (token) => {
	console.log('in verifyEmailVerificationToken');
	try {
		const decoded = jwt.verify(token, process.env.JWT_VERIFY_TOKEN_KEY);
		console.log(decoded, 'decoded');
		return decoded;
	} catch (err) {
		return err;
	}
};
const verifyAccessToken = (token) => {
	console.log('in verifyAccessToken');
	try {
		const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
		return decoded;
	} catch (err) {
		return err;
	}
};
const createAccessToken = (id, email) => {
	console.log('in createAccessToken', id, email);
	return jwt.sign({ id, email }, process.env.JWT_TOKEN_KEY, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
	});
};
const createEmailVerificationToken = (roleId, email) => {
	console.log('in createEmailVerificationToken');
	return jwt.sign({ roleId, email }, process.env.JWT_VERIFY_TOKEN_KEY, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
	});
};

module.exports = {
	verifyEmailVerificationToken,
	verifyAccessToken,
	createAccessToken,
	createEmailVerificationToken,
};
