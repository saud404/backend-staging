const validator = require('validator');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const ContractorBridgeLogo = require('../models/ContractorBridgeLogo');


const path = require('path');
const fs = require('fs');
const sendMail = require('../helpher/sendMail');
const { createEmailVerificationToken } = require(`../helpher/jwtFunctions`);
exports.allUserContractor = (req, res, next) => {
	User.findAll({
		where: {
			roleId: 2,
			isShown: 1,
		},
	})
		.then((allContractors) => {
			res.status(200).send({
				success: true,
				message: 'All contractors fetched successfully',
				data: allContractors,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};
exports.allUserEmployee = (req, res, next) => {
	User.findAll({
		where: {
			roleId: 3,
			isShown: 1,
		},
	})
		.then((allContractors) => {
			res.status(200).send({
				success: true,
				message: 'All employees fetched successfully',
				data: allContractors,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};
exports.allUserCustomer = (req, res, next) => {
	User.findAll({
		where: {
			roleId: 4,
			isShown: 1,
		},
	})
		.then((allContractors) => {
			res.status(200).send({
				success: true,
				message: 'All Customer fetched successfully',
				data: allContractors,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};
exports.addUser = (req, res, next) => {
	const validationErrors = [];
	const { email, company, roleId } = req.body;
	if (email && roleId) {
		if (
			!validator.isNumeric(roleId) ||
			validator.isNumeric(roleId) <= 0 ||
			validator.isNumeric(roleId) >= 5
		) {
			validationErrors.push('Role ID is required and should be from 1-4');
		}
		if (!validator.isEmail(email)) {
			validationErrors.push('Email is invalid');
		}
		if (roleId == 2 && !company) {
			validationErrors.push('Company name is required');
		}
		if (validationErrors.length) {
			res.status(400).send({
				success: false,
				message: 'Issue with data being send',
				data: validationErrors,
			});
		} else {
			User.findOne({
				where: {
					email,
				},
			})
				.then((user) => {
					if (user) {
						res.status(400).send({
							success: false,
							message: 'This email already exists',
						});
					} else {
						User.create({
							email,
							company: company || null,
							isShown: 1,
							roleId,
						})
							.then((userObj) => {
								console.log(userObj);
								const token = createEmailVerificationToken(roleId, email);
								try {
									sendMail(email, token, 1, '', '');
									res.status(200).send({
										success: true,
										message: 'User added successfully',
										data: userObj,
									});
								} catch (error) {
									res.status(400).send({
										success: false,
										message: `Issue sending email ${error}`,
									});
								}
							})
							.catch((error) => {
								res.status(400).send({
									success: false,
									message: `Something went wrong ${error}`,
								});
							});
					}
				})
				.catch((error) => {
					console.log(error);
					res.status(400).send({
						success: false,
						message: `Something went wrong ${error}`,
					});
				});
		}
	} else {
		res.status(400).send({ sucess: false, message: 'Missing data' });
	}
};

exports.userProfile = (req, res, next) => {
	const { firstName, lastName, phone, oneSignalId, company, city } = req.body;
	const { id } = req.params;
	if (id) {
		User.findOne({
			where: {
				id,
				isVerified: 1,
			},
		})
			.then((user) => {
				if (user) {
					if (req.files) {
						const dir = path.join(__dirname, '../../public', '/uploads/');
						let profileImage = req.files.file;
						if (!fs.existsSync(dir)) {
							fs.mkdirSync(dir);
						}
						const filePath = path.join(__dirname + '../../../public');
						if (fs.existsSync(filePath + user.image)) {
							fs.unlinkSync(filePath + user.image);
						}
						var currentDate = new Date().getTime();
						//Use the mv() method to place the file in upload directory (i.e. "uploads")
						profileImage.mv(dir + currentDate + profileImage.name);
					}
					user
						.update({
							firstName: firstName ? firstName : user.firstName,
							lastName: lastName ? lastName : user.lastName,
							phone: phone ? phone : user.phone,
							company: company ? company : user.company,
							city: city ? city : user.city,
							image: req.files
								? '/uploads/' + currentDate + req.files.file.name
								: user.image,
							oneSignalId: oneSignalId ? oneSignalId : user.oneSignalId,
						})
						.then((data) => {
							res.status(200).send({
								success: true,
								message: 'User updated successfully =)',
								data: data,
							});
						})
						.catch((err) => {
							res.status(400).send({
								success: false,
								message: err,
							});
						});
				} else {
					res.status(400).send({
						success: false,
						message: 'User not found',
					});
				}
			})
			.catch((err) => console.log(err));
	} else {
		res.status(400).send({ success: false, message: 'id of user is required' });
	}
};

exports.deleteUser = (req, res, next) => {
	const { id } = req.body;
	if (id) {
		console.log('in if delete', id);
		User.findOne({
			where: {
				id,
				isShown: 1,
			},
		}).then((user) => {
			if (user) {
				user
					.update({ isShown: 0 })
					.then((updatedObj) => {
						res.status(200).send({
							success: true,
							message: 'User deleted successfully',
						});
					})
					.catch((error) => {
						res.status(400).send({
							success: false,
							message: error,
						});
					});
			} else {
				res.status(400).send({
					success: false,
					message: 'User not found',
				});
			}
		});
	} else {
		res.status(400).send({
			success: false,
			message: 'ID of the user is required',
		});
	}
};
exports.getUser = (req, res, next) => {
	const { id } = req.params;
	if (id) {
		console.log('in if get', id);
		User.findOne({
			where: {
				id,
				isShown: 1,
			},
		})
			.then((user) => {
				if (user) {
					res.status(200).send({
						success: true,
						message: 'User fetched successfully',
						data: user,
					});
				}
				res.status(400).send({
					success: false,
					message: 'Contractor not found',
				});
			})
			.catch((error) => {
				console.log(error);
			});
	} else {
		res.status(400).send({
			success: false,
			message: 'ID of the user is required',
		});
	}
};
