const { verifyAccessToken } = require('../helpher/jwtFunctions');
module.exports = (req, res, next) => {
	const token = req.headers?.authorization?.split(' ')[1];
	console.log(token);
	if (token) {
		try {
			const decoded = verifyAccessToken(token);
			req.user = decoded.id;
			next();
		} catch (err) {
			return res.status(401).send({
				success: false,
				message: 'User unauthorized..',
			});
		}
	} else {
		return res.status(401).send({
			success: false,
			message: 'User unauthorized',
		});
	}
};
