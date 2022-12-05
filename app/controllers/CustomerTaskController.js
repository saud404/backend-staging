const validator = require('validator');
const Project = require('../models/Projects');
const customerTasks = require('../models/CustomerTasks');

exports.updateCutomerTasks = (req, res, next) => {
	const { id, isCompleted, userId, taskId } = req.body;
	console.log(req.body);
	customerTasks
		.findOne({ where: { id, isVisible: 1 } })
		.then((projectT) => {
			if (projectT) {
				projectT
					.update({
						isCompleted: isCompleted ? isCompleted : projectT.isCompleted,
						userId: userId ? userId : projectT.userId,
						taskId: taskId ? taskId : projectT.taskId,
					})
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
exports.getCustomerTasks = (req, res, next) => {
	const { id } = req.params;
	customerTasks
		.findAll({ where: { userId: id, isVisible: 1 } })
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
exports.addCustomerTasks = (req, res, next) => {
	const { taskId, userId } = req.body;
	console.log(taskId, userId);
	let temp = [];
	if (taskId.includes(',')) {
		let ids = taskId.split(',');
		for (i = 0; i < ids.length; i++) {
			temp.push({
				userId,
				taskId: ids[i],
				isVisible: 1,
			});
		}
	} else {
		temp.push({
			userId,
			taskId: taskId,
			isVisible: 1,
		});
	}
	customerTasks
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
exports.removeCustomerTasks = (req, res, next) => {
	const { id } = req.body;
	customerTasks
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
