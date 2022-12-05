const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const validator = require('validator');
const User = require('../models/User');
const userSession = require('../models/UserSession');
const sendMail = require('../helpher/sendMail');
const {
	verifyEmailVerificationToken,
	createAccessToken,
	verifyAccessToken,
} = require('../helpher/jwtFunctions');

const createToken = async (user) => {
	const token = createAccessToken(user.id, user.email);
	const session = await new userSession({
		userId: user.id,
		accessToken: token,
	});
	if (session) {
		var sessionSaved = await session
			.save()
			.then(() => {
				user.dataValues.accessToken = token;
				return user;
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
	User.findOne({
		where: {
			email: email,
			isShown: 1,
		},
	})
		.then((user) => {
			if (user) {
				bcrypt
					.compare(password, user.password)
					.then(async (doMatch) => {
						if (doMatch) {
							var updatedUserObj = await createToken(user);
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
						} else {
							res.status(400).send({
								success: false,
								message: 'Invalid email or password',
							});
						}
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
exports.pushNotification = (req, res, next) => {
	const { userId, content } = req.body;
	User.findOne({
		where: {
			id: userId,
			isShown: 1,
		},
	})
		.then(async (user) => {
			if (user) {
				if (user.oneSignalId) {
					await sendPushNotification(oneSignalId, content);
					res.status(200).send({
						success: true,
						message: 'Notification sent',
					});
				} else {
					res.status(400).send({
						success: false,
						message: 'No one signal ID exists',
					});
				}
			} else {
				res.status(400).send({
					success: false,
					message: 'No user found',
				});
			}
		})
		.catch((error) => {
			res.status(400).send({
				success: false,
				message: `Something went worng ${error}`,
			});
		});
};
exports.signUp = (req, res, next) => {
	const validationErrors = [];
	const { firstName, lastName, email, password, roleId, phone, oneSignalId } =
		req.body;
	console.log(req.body);
	if (password && firstName && lastName && email && roleId) {
		if (!req.files) {
			validationErrors.push('Profile image is required');
		}
		if (
			validator.isEmpty(password) ||
			validator.isEmpty(firstName) ||
			validator.isEmpty(lastName) ||
			validator.isEmpty(roleId)
		) {
			validationErrors.push(
				'Email, First name, Last name, Role id  and Password are required.'
			);
		} else {
			if (!validator.isEmail(email)) {
				validationErrors.push('Please enter a valid email address.');
			}
			if (
				!validator.isNumeric(roleId) &&
				validator.isNumeric(roleId) > 0 &&
				validator.isNumeric(roleId) < 5
			) {
				console.log(roleId, validator.isNumeric(roleId));
				validationErrors.push('Please enter a valid role id.');
			}
			if (roleId == 2 && !phone) {
				validationErrors.push('Phone number is required ');
			}
		}
		if (validationErrors.length) {
			res.status(400).send({
				success: false,
				message: 'Issue with data being send',
				data: validationErrors,
			});
		} else {
			const dir = path.join(__dirname, '../../public', '/uploads/');
			let profileImage = req.files.file;
			console.log(profileImage);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			var currentDate = new Date().getTime();
			//Use the mv() method to place the file in upload directory (i.e. "uploads")
			profileImage.mv(dir + currentDate + profileImage.name);
			console.log(currentDate);
			User.findOne({
				where: {
					email: email,
					isVerified: 1,
					roleId,
				},
			})
				.then((user) => {
					if (user) {
						bcrypt.hash(password, 12).then(async (hashedPassword) => {
							user
								.update(
									{
										firstName,
										lastName,
										password: hashedPassword,
										phone,
										image: '/uploads/' + currentDate + profileImage.name,
										oneSignalId,
									},
									{ where: { email, roleId } }
								)
								.then((data) => {
									res.status(200).send({
										success: true,
										message: 'User signed up =)',
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
							message: 'User doesnt exist or isnt verified ',
						});
					}
				})
				.catch((err) => console.log(err));
		}
	} else {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
};

exports.forgotPassword = (req, res, next) => {
	const validationErrors = [];
	const { email } = req.body;

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
	User.findOne({
		where: {
			email: email,
		},
	})
		.then(async (user) => {
			if (!user) {
				res.status(400).send({
					success: false,
					message: 'No user found with this email.',
				});
			} else {
				try {
					const code = Math.floor(1000 + Math.random() * 9000);
					sendMail(email, code, 2, user.firstName, user.lastName);
					user
						.update({ code })
						.then((userObj) => {
							res.status(200).send({
								success: true,
								message: 'Forgot passowrd email sent',
							});
						})
						.catch((error) => {
							res.status(400).send({
								success: false,
								message: `Something went worng ${error}`,
							});
						});
				} catch (error) {
					res.status(400).send({
						success: false,
						message: `Issue sending email ${error}`,
					});
				}
			}
		})

		.catch((err) => {
			console.log(err);
		});
};

exports.resendCode = (req, res, next) => {
	const validationErrors = [];
	const { email } = req.body;

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
	User.findOne({
		where: {
			email: email,
		},
	})
		.then(async (user) => {
			if (!user) {
				res.status(400).send({
					success: false,
					message: 'No user found with this email.',
				});
			} else {
				try {
					const code = Math.floor(1000 + Math.random() * 9000);
					sendMail(email, code, 3);
					user
						.update({ code })
						.then((userObj) => {
							res.status(200).send({
								success: true,
								message: 'Email for forgot password sent',
							});
						})
						.catch((error) => {
							res.status(400).send({
								success: false,
								message: `Something went worng ${error}`,
							});
						});
				} catch (error) {
					res.status(400).send({
						success: false,
						message: `Issue sending mail ${error}`,
					});
				}
			}
		})

		.catch((err) => {
			console.log(err);
		});
};

exports.verifyCode = (req, res, next) => {
	const validationErrors = [];
	const { email, code } = req.body;

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
	User.findOne({
		where: {
			email: email,
		},
	})
		.then(async (user) => {
			if (!user) {
				res.status(400).send({
					success: false,
					message: 'No user found with this email.',
				});
			} else {
				if (user.code == code) {
					res.status(200).send({
						success: true,
						message: 'Valid code.',
					});
				} else {
					res.status(400).send({
						success: false,
						message: 'Invalid code.',
					});
				}
			}
		})

		.catch((err) => {
			console.log(err);
		});
};

exports.updatePassword = (req, res, next) => {
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
	User.findOne({
		where: {
			email: email,
		},
	})
		.then(async (user) => {
			if (!user) {
				res.status(400).send({
					success: false,
					message: 'No user found with this email.',
				});
			} else {
				var hashedPassword = await bcrypt.hash(password, 12);
				console.log('hashedPassword', hashedPassword);
				user
					.update({
						password: hashedPassword,
						code: null,
					})
					.then((result) => {
						console.log(result);
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
		})

		.catch((err) => {
			console.log(err);
		});
};

exports.verifyToken = (req, res, next) => {
	const { token } = req.params;
	if (token) {
		try {
			const decoded = verifyEmailVerificationToken(token);
			console.log(decoded);
			User.findOne({
				where: {
					email: decoded.email,
					roleId: decoded.roleId,
				},
			})
				.then((user) => {
					if (user) {
						user
							.update({ isVerified: 1 })
							.then((result) => {
								return res.status(200).send({
									success: true,
									message: 'Token verified',
									data: decoded,
								});
							})
							.catch((error) => {
								return res.status(400).send({
									success: false,
									message: `Something went wrong ${error}`,
								});
							});
					} else {
						res.status(400).send({ success: false, message: 'No user found' });
					}
				})
				.catch((error) => {
					return res.status(400).send({
						success: false,
						message: `Something went wrong ${error}`,
					});
				});
		} catch (error) {
			console.log(error);
			return res.status(400).send({
				success: false,
				message: 'URL has expired',
			});
		}
	}
};

exports.verifyAuthToken = (req, res, next) => {
	const { token } = req.params;
	if (token) {
		try {
			const decoded = verifyAccessToken(token);
			res.status(200).send({
				success: true,
				message: 'Token verified',
				data: decoded,
			});
			// console.log(decoded);
			// User.findOne({
			// 	where: {
			// 		email: decoded.email,
			// 		roleId: decoded.roleId,
			// 	},
			// })
			// 	.then((user) => {
			// 		if (user) {
			// 			user
			// 				.update({ isVerified: 1 })
			// 				.then((result) => {
			// 					return res.status(200).send({
			// 						success: true,
			// 						message: 'Token verified',
			// 						data: decoded,
			// 					});
			// 				})
			// 				.catch((error) => {
			// 					return res.status(400).send({
			// 						success: false,
			// 						message: `Something went wrong ${error}`,
			// 					});
			// 				});
			// 		} else {
			// 			res.status(400).send({ success: false, message: 'No user found' });
			// 		}
			// 	})
			// 	.catch((error) => {
			// 		return res.status(400).send({
			// 			success: false,
			// 			message: `Something went wrong ${error}`,
			// 		});
			// 	});
		} catch (error) {
			console.log(error);
			return res.status(400).send({
				success: false,
				message: 'URL has expired',
			});
		}
	}
};
