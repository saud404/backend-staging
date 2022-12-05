const validator = require('validator');
const Project = require('../models/Projects');
const projectContractor = require('../models/ProjectContractor');
const projectTask = require('../models/ProjectTask');
exports.getAllProject = (req, res, next) => {
	Project.findAll({ where: { isVisible: 1 } })
		.then((project) => {
			console.log(project);
			if (project) {
				res.status(200).send({
					success: true,
					message: `Project found`,
					data: project,
				});
			} else {
				res.status(400).send({
					success: false,
					message: `project not found`,
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(400).send({
				success: false,
				message: `Something went worng ${err}`,
			});
		});
};
exports.project = (req, res, next) => {
	console.log(req);
	const {
		name,
		projectOwnerFirstName,
		projectOwnerLastName,
		projectOwnerPhone,
		street,
		city,
		state,
		image,
		message,
		tasks,
		location,
	} = req.body;
	const validationErrors = [];
	if (
		name &&
		projectOwnerFirstName &&
		projectOwnerLastName &&
		projectOwnerPhone &&
		street &&
		city &&
		state &&
		image &&
		message &&
		tasks &&
		location
	) {
		console.log(tasks);
		if (
			validator.isEmpty(name) ||
			validator.isEmpty(projectOwnerFirstName) ||
			validator.isEmpty(projectOwnerLastName) ||
			validator.isEmpty(projectOwnerPhone) ||
			validator.isEmpty(street) ||
			validator.isEmpty(city) ||
			validator.isEmpty(state) ||
			validator.isEmpty(message) ||
			validator.isEmpty(location) ||
			validator.isEmpty(tasks)
		) {
			validationErrors.push('Please fill the required fields');
		}
		if (validationErrors.length) {
			res.status(400).send({
				success: false,
				message: 'Issue in data which is being send',
				data: validationErrors,
			});
		}
	} else {
		res.status(400).send({
			success: false,
			message: 'Issue in data which is being send',
		});
	}
	var project = new Project({
		name,
		projectOwnerFirstName,
		projectOwnerLastName,
		projectOwnerPhone,
		street,
		city,
		state,
		image,
		message,
		location,
		isVisible: 1,
	});
	project
		.save()
		.then((project) => {
			if (project) {
				const pId = project.dataValues.id;
				const tempTasks = [];
				if (tasks.includes(',')) {
					let ids = tasks.split(',');
					for (i = 0; i < ids.length; i++) {
						console.log(task);
						tempTasks.push({
							projectId: pId,
							taskId: ids[i],
							isCompleted: 0,
						});
					}
				} else {
					tempTasks.push({
						projectId: pId,
						taskId: tasks,
						isCompleted: 0,
					});
				}
				console.log(tempTasks);
				projectTask
					.bulkCreate(tempTasks, { returning: true })
					.then((task) => {
						console.log(task);
						res.status(200).send({
							success: true,
							message: 'Project created successfully ',
							data: project,
						});
					})
					.catch((err) => {
						console.log('something went worng', err);
						res.status(400).send({
							success: false,
							message: `Task doesnt Exists ${err}`,
						});
					});
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.updateProject = (req, res, next) => {
	const { id } = req.params;
	const {
		name,
		projectOwnerFirstName,
		projectOwnerLastName,
		projectOwnerPhone,
		street,
		city,
		state,
		message,
		location,
	} = req.body;

	Project.findOne({ where: { id, isVisible: 1 } })
		.then((project) => {
			if (project) {
				project
					.update({
						name: name ? name : project.name,
						projectOwnerFirstName: projectOwnerFirstName
							? projectOwnerFirstName
							: project.projectOwnerFirstName,
						projectOwnerLastName: projectOwnerLastName
							? projectOwnerLastName
							: project.projectOwnerLastName,
						projectOwnerPhone: projectOwnerPhone
							? projectOwnerPhone
							: project.projectOwnerPhone,
						street: street ? street : project.street,
						city: city ? city : project.city,
						state: state ? state : project.state,
						message: message ? message : project.message,
						location: location ? location : project.location,
					})
					.then((result) => {
						res.status(200).send({
							success: true,
							message: 'updated',
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
					message: `project not found`,
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
};
exports.projectContractor = (req, res, next) => {
	const { contractorId, projectId, taskId } = req.body;

	const validationErrors = [];
	if (contractorId && projectId) {
		if (validator.isEmpty(contractorId) || validator.isEmpty(projectId)) {
			validationErrors.push('Please fill the required fields');
		}
		if (validationErrors.length) {
			res.status(400).send({
				success: false,
				message: 'Issue in data which is being send',
				data: validationErrors,
			});
		}
	} else {
		res.status(400).send({
			success: false,
			message: 'Issue in data which is being send',
		});
	}
	var contractorProject = new projectContractor({
		projectId,
		projectContractorId: contractorId,
		projecttaskId: taskId,
	});
	contractorProject
		.save()
		.then((result) => {
			console.log(result);
			res.status(200).send({
				success: true,
				message: 'Contractor added to project successfully',
			});
		})
		.catch((err) => {
			console.log('err', err);
			res.status(200).send({
				success: false,
				message: 'Something went wrong',
			});
		});
};
exports.updateprojectContractor = (req, res, next) => {
	const { contractorId, projectId, taskId, jobStatus } = req.body;
	const { id } = req.params;
	projectContractor
		.findOne({ where: { id } })
		.then((cp) => {
			if (cp) {
				cp.update({
					projectId: projectId ? projectId : cp.projectId,
					projectContractorId: contractorId
						? contractorId
						: cp.projectContractorId,
					projecttaskId: taskId ? taskId : cp.projecttaskId,
					jobStatus: jobStatus ? jobStatus : cp.jobStatus,
				})
					.then((result) => {
						res.status(200).send({
							success: true,
							message: 'updated',
							data: result,
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
					message: `id not found`,
				});
			}
		})
		.catch((err) => {
			console.log('err', err);
			res.status(200).send({
				success: false,
				message: `Something went wrong ${err}`,
			});
		});
};
exports.projectsOfContractors = (req, res, next) => {
	const validationErrors = [];
	const { id } = req.params;
	console.log(id);
	// projectContractor
	// 	.findAll({
	// 		where: {
	// 			projectContractorId: contractorId,
	// 		},
	// 	})
	projectContractor
		.findAll({ where: { projectContractorId: id } })
		.then((projectsData) => {
			if (projectsData) {
				res.status(200).send({
					success: true,
					message: 'projects of the contractor',
					data: projectsData,
				});
			} else {
				res.status(400).send({
					success: false,
					message: 'projects of the contractor doesnt exists',
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

exports.removeProject = (req, res, next) => {
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
	Project.findOne({ where: { id, isVisible: 1 } })
		.then((pro) => {
			if (pro) {
				pro
					.update({ isVisible: 0 })
					.then((updateIUL) => {
						res.status(200).send({
							success: true,
							message: 'Project Logs deleted successfully',
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
					message: 'Project doesnt exists',
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

exports.singleProject = (req, res, next) => {
	const { id } = req.params;
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
	Project.findOne({ where: { id, isVisible: 1 } })
		.then((pro) => {
			if (pro) {
				res.status(200).send({
					success: true,
					message: 'Project found',
					data: pro,
				});
			} else {
				res.status(400).send({
					success: false,
					message: 'Project doesnt exists',
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
