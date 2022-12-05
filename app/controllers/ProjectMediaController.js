const validator = require('validator');
const fs = require('fs');
const path = require('path');
const Project = require('../models/Projects');
const ProjectMedia = require('../models/ProjectMedia');
exports.getProjectMedia = (req, res, next) => {
	const { id } = req.params;
	if (id) {
		ProjectMedia.findAll({ where: { projectId: id, isVisible: 1 } })
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
			message: 'Project id is required ',
		});
	}
};

exports.updateProjectMedia = (req, res, next) => {
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
		const dir = path.join(__dirname, '../../public', '/uploads/projectMedia/');
		let projectImage = req.files.file;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		var currentDate = new Date().getTime();
		//Use the mv() method to place the file in upload directory (i.e. "uploads")
		projectImage.mv(dir + currentDate + projectImage.name);
		console.log(currentDate);
		ProjectMedia.findOne({
			where: {
				id,
				isVisible: 1,
			},
		})
			.then((project) => {
				if (project) {
					project
						.update({
							image: '/uploads/projectMedia/' + currentDate + projectImage.name,
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
exports.addProjectMedia = (req, res, next) => {
	const validationErrors = [];
	const { projectId } = req.body;
	console.log(req.file);
	if (!req.files) {
		validationErrors.push('project media is required');
	}
	if (!projectId) {
		validationErrors.push('project id is required');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	} else {
		const dir = path.join(__dirname, '../../public', '/uploads/projectMedia/');
		let projectImage = req.files.file;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		var currentDate = new Date().getTime();
		//Use the mv() method to place the file in upload directory (i.e. "uploads")
		projectImage.mv(dir + currentDate + projectImage.name);
		console.log(currentDate);
		ProjectMedia.create({
			projectId,
			image: '/uploads/projectMedia/' + currentDate + projectImage.name,
			isVisible: 1,
		})
			.then((pm) => {
				res.status(200).send({
					success: true,
					message: 'Added successfully',
					data: pm,
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
exports.removeProjectMedia = (req, res, next) => {
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
	ProjectMedia.findOne({ where: { id, isVisible: 1 } })
		.then((pro) => {
			if (pro) {
				pro
					.update({ isVisible: 0 })
					.then((updateIUL) => {
						res.status(200).send({
							success: true,
							message: 'Project media deleted successfully',
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
					message: 'Project media doesnt exists',
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
