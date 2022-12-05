const validator = require('validator');
const Tasks = require('../models/Task');

exports.tasks = (req, res, next) => {
	Tasks.findAll({ where: { isVisible: 1 } })
		.then((tasksList) => {
			res.status(200).send({
				success: true,
				message: 'Tasks fetched successfully',
				data: tasksList,
			});
		})
		.catch((err) => {
			res.status(400).send({
				success: false,
				message: err,
			});
			console.log(err);
		});
};
exports.addTask = (req, res, next) => {
	const { name } = req.body;
	const taskName = name.toLowerCase();
	const validationErrors = [];
	if (validator.isEmpty(name)) {
		validationErrors.push('Name of the task is required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
	Tasks.findOne({ where: { name: taskName } })
		.then((task) => {
			if (!task) {
				console.log('in if');
				Tasks.create({ name: taskName, isVisible: 1 })
					.then((newTask) => {
						res.status(200).send({
							success: true,
							message: 'Tasks added successfully',
							data: newTask,
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
					message: 'Task with this name already exists',
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

exports.updateTask = (req, res, next) => {
	const { id, name } = req.body;
	const taskName = name.toLowerCase();
	const validationErrors = [];
	if (validator.isEmpty(name) || validator.isEmpty(id)) {
		validationErrors.push('Task name and Id are required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
	Tasks.findOne({ where: { id } })
		.then((task) => {
			if (task) {
				task
					.update({ name: taskName })
					.then((updateTask) => {
						res.status(200).send({
							success: true,
							message: 'Tasks updated successfully',
							data: updateTask,
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
					message: 'Task doesnt exists',
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
exports.removeTask = (req, res, next) => {
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
	Tasks.findOne({ where: { id } })
		.then((task) => {
			if (task) {
				task
					.update({ isVisible: 0 })
					.then((updateTask) => {
						res.status(200).send({
							success: true,
							message: 'Tasks deleted successfully',
							data: updateTask,
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
					message: 'Task doesnt exists',
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
