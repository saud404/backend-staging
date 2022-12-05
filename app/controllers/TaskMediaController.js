const validator = require('validator');
const taskMedia = require('../models/BridgeTaskMedia');

exports.updateTaskMedia = (req, res, next) => {
	const { id, taskId, mediaId } = req.body;
	console.log(req.body);
	taskMedia
		.findOne({ where: { id, isVisible: 1 } })
		.then((projectT) => {
			if (projectT) {
				projectT
					.update({
						taskId: taskId ? taskId : projectT.taskId,
						mediaId: mediaId ? mediaId : projectT.mediaId,
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
exports.getTaskMedia = (req, res, next) => {
	const { id } = req.params;
	taskMedia
		.findAll({ where: { id: id, isVisible: 1 } })
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
exports.addTaskMedia = (req, res, next) => {
	const { taskId, mediaId } = req.body;
	let temp = [];
	if (taskId.includes(',')) {
		let ids = taskId.split(',');
		for (i = 0; i < ids.length; i++) {
			temp.push({
				mediaId,
				taskId: ids[i],
				isVisible: 1,
			});
		}
	} else {
		temp.push({
			mediaId,
			taskId: taskId,
			isVisible: 1,
		});
	}
	taskMedia
		.bulkCreate(temp)
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
exports.removeTaskMedia = (req, res, next) => {
	const { id } = req.body;
	taskMedia
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
