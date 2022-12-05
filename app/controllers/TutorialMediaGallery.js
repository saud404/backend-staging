const validator = require('validator');
const fs = require('fs');
const path = require('path');
const Project = require('../models/Projects');
const TutorialMediaGallery = require('../models/TutorialMediaGallery');
const taskMedia = require('../models/BridgeTaskMedia');
exports.getTutorialMediaGallery = (req, res, next) => {
	const { id } = req.params;
	if (id) {
		TutorialMediaGallery.findOne({ where: { id: id, isVisible: 1 } })
			.then((media) => {
				if (media) {
					res.status(200).send({
						success: true,
						message: 'Media fetched',
						data: media,
					});
				} else {
					res.status(400).send({
						success: false,
						message: 'No media found',
					});
				}
			})
			.catch((err) => {
				res.status(400).send({
					success: false,
					message: 'Something went wrong' + err,
				});
			});
	} else {
		res.status(400).send({
			success: false,
			message: ' id is required ',
		});
	}
};
exports.getAllTutorialMediaGallery = (req, res, next) => {
	if (id) {
		TutorialMediaGallery.findAll({ where: { isVisible: 1 } })
			.then((media) => {
				if (media) {
					res.status(200).send({
						success: true,
						message: 'Media fetched',
						data: media,
					});
				} else {
					res.status(400).send({
						success: false,
						message: 'No media found',
					});
				}
			})
			.catch((err) => {
				res.status(400).send({
					success: false,
					message: 'Something went wrong' + err,
				});
			});
	} else {
		res.status(400).send({
			success: false,
			message: ' id is required ',
		});
	}
};
exports.updateTutorialMediaGallery = (req, res, next) => {
	const validationErrors = [];
	const { id } = req.params;
	if (!req.files) {
		validationErrors.push('project media is required');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	} else {
		const dir = path.join(
			__dirname,
			'../../public',
			'/uploads/projectTutorialMedia/'
		);
		let projectImage = req.files.file;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		var currentDate = new Date().getTime();
		//Use the mv() method to place the file in upload directory (i.e. "uploads")
		projectImage.mv(dir + currentDate + projectImage.name);
		console.log(currentDate);
		TutorialMediaGallery.findOne({
			where: {
				id,
				isVisible: 1,
			},
		})
			.then((project) => {
				if (project) {
					project
						.update({
							image:
								'/uploads/projectTutorialMedia/' +
								currentDate +
								projectImage.name,
						})
						.then((data) => {
							res.status(200).send({
								success: true,
								message: 'Media updated successfully',
								data: data,
							});
						})
						.catch((err) => {
							res.status(400).send({
								success: false,
								message: `Something went worng ${err}`,
							});
						});
				} else {
					res.status(400).send({
						success: false,
						message: 'Media doesnt exists ',
					});
				}
			})
			.catch((err) =>
				res.status(400).send({
					success: false,
					message: `Something went worng ${err}`,
				})
			);
	}
};
exports.addTutorialMediaGallery = (req, res, next) => {
	const validationErrors = [];
	const { name, description, taskId } = req.body;
	console.log(req.file);
	if (!req.files) {
		validationErrors.push('project media is required');
	}
	if (!name) {
		validationErrors.push('name is required');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	} else {
		const dir = path.join(
			__dirname,
			'../../public',
			'/uploads/projectTutorialMedia/'
		);
		let projectImage = req.files.file;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		var currentDate = new Date().getTime();
		//Use the mv() method to place the file in upload directory (i.e. "uploads")
		projectImage.mv(dir + currentDate + projectImage.name);
		console.log(currentDate);
		TutorialMediaGallery.create({
			name,
			description,
			image: '/uploads/projectTutorialMedia/' + currentDate + projectImage.name,
			isVisible: 1,
		})
			.then((pm) => {
				taskMedia
					.create({ taskId, mediaId: pm.id })
					.then((result) => {
						res.status(200).send({
							success: true,
							message: 'Added successfully',
							data: pm,
							taskMedia: result,
						});
					})
					.catch((err) => {
						res.status(400).send({
							success: false,
							message: `Something went worng ${err}`,
						});
					});
			})
			.catch((err) => {
				res.status(400).send({
					success: false,
					message: `Something went worng ${err}`,
				});
			});
	}
};
exports.removeTutorialMediaGallery = (req, res, next) => {
	const { id } = req.body;
	const validationErrors = [];
	if (validator.isEmpty(id)) {
		validationErrors.push('Id are required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
	TutorialMediaGallery.findOne({ where: { id, isVisible: 1 } })
		.then((pro) => {
			if (pro) {
				pro
					.update({ isVisible: 0 })
					.then((updateIUL) => {
						res.status(200).send({
							success: true,
							message: 'TutorialMediaGallery deleted successfully',
							data: updateIUL,
						});
					})
					.catch((err) => {
						res.status(400).send({
							success: false,
							message: 'Something went wrong' + err,
						});
					});
			} else {
				res.status(400).send({
					success: false,
					message: 'TutorialMediaGallery doesnt exists',
				});
			}
		})
		.catch((err) => {
			res.status(400).send({
				success: false,
				message: err,
			});
			console.log(err);
		});
};
exports.getTutorialMediaGalleryByTaskId = (req, res, next) => {
	const { id } = req.params;
	if (id) {
		taskMedia
			.findAll({
				include: [
					{
						model: TutorialMediaGallery,
					},
				],

				where: { taskId: id, isVisible: 1 },
			})
			.then((media) => {
				if (media) {
					res.status(200).send({
						success: true,
						message: 'Media fetched',
						data: media,
					});
				} else {
					res.status(400).send({
						success: false,
						message: 'No media found',
					});
				}
			})
			.catch((err) => {
				res.status(400).send({
					success: false,
					message: 'Something went wrong' + err,
				});
			});
	} else {
		res.status(400).send({
			success: false,
			message: ' id is required ',
		});
	}
};
