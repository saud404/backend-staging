const validator = require('validator');
const Project = require('../models/Projects');
const projectTask = require('../models/ProjectTask');

exports.updateProjectTaskStatus = (req, res, next) => {
	const { id, isCompleted } = req.body;
	console.log(req.body);
	projectTask
		.findOne({ where: { id, isVisible: 1 } })
		.then((projectT) => {
			if (projectT) {
				projectT
					.update({ isCompleted })
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
					message: 'Task not found',
				});
			}
		})
		.catch((err) => {
			res.status(200).send({
				success: true,
				message: `Something went worng ${err}`,
			});
		});
};
exports.getProjectTasks = (req, res, next) => {
	const { id } = req.params;
	projectTask
		.findAll({ where: { projectId: id, isVisible: 1 } })
		.then((projectT) => {
			if (projectT) {
				res.status(200).send({
					success: true,
					message: 'task fetched successfully',
					data: projectT,
				});
			} else {
				res.status(400).send({
					success: false,
					message: 'No tasks found',
				});
			}
		})
		.catch((err) => {
			res.status(200).send({
				success: true,
				message: `Something went worng ${err}`,
			});
		});
};
exports.addProjectTasks = (req, res, next) => {
	const { taskId, projectId } = req.body;
	console.log(taskId, projectId);
	let temp = [];
	if (taskId.includes(',')) {
		let ids = taskId.split(',');
		for (i = 0; i < ids.length; i++) {
			temp.push({
				projectId,
				taskId: ids[i],
				isVisible: 1,
			});
		}
	} else {
		temp.push({
			projectId,
			taskId: taskId,
			isVisible: 1,
		});
	}
	projectTask
		.bulkCreate(temp, { returning: true })
		.then((projectT) => {
			res.status(200).send({
				success: true,
				message: 'task added successfully',
				data: projectT,
			});
		})
		.catch((err) => {
			res.status(200).send({
				success: true,
				message: `Something went worng ${err}`,
			});
		});
};
exports.removeProjectTasks = (req, res, next) => {
	const { id } = req.body;
	projectTask
		.findOne({ where: { id, isVisible: 1 } })
		.then((projectT) => {
			if (projectT) {
				projectT
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
					message: 'task not found',
				});
			}
		})
		.catch((err) => {
			res.status(200).send({
				success: true,
				message: `Something went worng ${err}`,
			});
		});
};
