const bcrypt = require('bcryptjs');
const validator = require('validator');
const Admin = require('../models/Admin');
const adminSession = require('../models/AdminSession');
const jwt = require('jsonwebtoken');
const createToken = async (admin) => {
	const token = jwt.sign({ id: admin.id }, process.env.ADMIN_JWT_TOKEN_KEY, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
	});
	const session = await new adminSession({
		userId: admin.id,
		accessToken: token,
	});
	if (session) {
		var sessionSaved = await session
			.save()
			.then(() => {
				admin.dataValues.accessToken = token;
				return admin;
			})
			.catch((err) => {
				console.log('err while creating session', err);
				return -1;
			});
		return sessionSaved;
	}
	// save user token
};
exports.login = (req, res, next) => {
	const validationErrors = [];
	const { email, password } = req.body;
	if (password && email) {
		if (!validator.isEmail(email)) {
			validationErrors.push('Please enter a valid email address.');
		}
		if (validator.isEmpty(password)) {
			validationErrors.push('Password cannot be blank.');
		}
	} else {
		validationErrors.push('Email and Password are required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue in data which is being send',
			data: validationErrors,
		});
	}
	Admin.findOne({
		where: {
			email: email,
		},
	})
		.then((admin) => {
			if (admin) {
				bcrypt
					.compare(password, admin.password)
					.then(async (doMatch) => {
						if (doMatch) {
							//req.session.isLoggedIn = true;
							//req.session.user = user.dataValues;
							//return req.session.save((err) => {
							//	console.log(err);
							var updatedUserObj = await createToken(admin);
							if (updatedUserObj != -1 && updatedUserObj) {
								res.status(200).send({
									success: true,
									message: 'Successful login',
									data: updatedUserObj,
								});
							} else {
								res.status(400).send({
									success: false,
									message: 'failed to create session token',
								});
							}
							//});
						}
						res.status(400).send({
							success: false,
							message: 'Invalid email or password',
						});
					})
					.catch((err) => {
						console.log(err);
						res.status(400).send({
							success: false,
							message: 'Sorry! Somethig went wrong.',
						});
					});
			} else {
				res.status(400).send({
					success: false,
					message: 'No user found with this email.',
				});
			}
		})
		.catch((err) => console.log(err));
};

exports.logout = (req, res, next) => {
	const validationErrors = [];
	const { userId } = req.body;
	if (validator.isEmpty(userId)) {
		validationErrors.push('userId is required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue in data which is being send',
			data: validationErrors,
		});
	}
	userSession
		.findOne({
			where: {
				userId,
			},
		})
		.then((session) => {
			if (!session) {
				res.status(400).send({
					success: false,
					message: 'No session found against the userId',
				});
			} else {
				session.destroy();
				res.status(200).send({
					success: true,
					message: 'Logout successful',
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(400).send({
				success: false,
				message: err,
			});
		});
};

exports.signUp = (req, res, next) => {
	const validationErrors = [];
	const { firstName, lastName, email, password } = req.body;
	if (password && firstName && lastName && email) {
		if (
			validator.isEmpty(password) ||
			validator.isEmpty(firstName) ||
			validator.isEmpty(lastName)
		) {
			validationErrors.push(
				'Email, First name, Last name  and Password are required.'
			);
		}
	} else {
		if (!validator.isEmail(email)) {
			validationErrors.push('Please enter a valid email address.');
		}
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
	Admin.findOne({
		where: {
			email: email,
		},
	})
		.then((admin) => {
			if (!admin) {
				bcrypt.hash(password, 12).then(async (hashedPassword) => {
					const admin = new Admin({
						email,
						firstName,
						lastName,
						password: hashedPassword,
					});
					admin
						.save()
						.then((data) => {
							res.status(200).send({
								success: true,
								message: 'Admin Created =)',
								data: data,
							});
						})
						.catch((err) => {
							res.status(400).send({
								success: false,
								message: err,
							});
						});
				});
			} else {
				res.status(400).send({
					success: false,
					message: 'E-Mail exists already, please pick a different one.',
				});
			}
		})
		.catch((err) => console.log(err));
};

exports.forgotPassword = (req, res, next) => {
	const validationErrors = [];
	const { email, password } = req.body;

	if (!validator.isEmail(email)) {
		validationErrors.push('Please enter a valid email address.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
	// crypto.randomBytes(32, (err, buffer) => {
	// 	if (err) {
	// 		console.log(err);
	// 		// return res.redirect('/forgot-password');
	// 	}
	// 	const token = buffer.toString('hex');
	Admin.findOne({
		where: {
			email: email,
		},
	})
		.then(async (admin) => {
			if (!admin) {
				res.status(400).send({
					success: false,
					message: 'No user found with this email.',
				});
			} else {
				var hashedPassword = await bcrypt.hash(password, 12);
				admin
					.update({
						password: hashedPassword,
					})
					.then((result) => {
						res.status(200).send({
							success: true,
							message: 'Password updated successfully',
						});
					})
					.catch((err) => {
						res.status(400).send({
							success: false,
							message: 'Failed to update password successfully',
						});
					});
			}
			// user.resetToken = token;
			// user.resetTokenExpiry = Date.now() + 3600000;
			// return user.save();
		})

		.catch((err) => {
			console.log(err);
		});
	//});
};
