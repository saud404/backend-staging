const validator = require('validator');
const InventoryUsageLogs = require('../models/InventoryUsageLogs');

exports.allinventoryusagelogs = (req, res, next) => {
	InventoryUsageLogs.findAll({ where: { isVisible: 1 } })
		.then((InventoryUsageLogsList) => {
			console.log(InventoryUsageLogsList);
			res.status(200).send({
				success: true,
				message: 'InventoryUsageLogs fetched successfully',
				data: InventoryUsageLogsList,
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
exports.addinventoryusagelogs = (req, res, next) => {
	console.log('in add inventory usage');
	const { projectId, inventoryId, userId, status, subinventoryId } = req.body;
	const validationErrors = [];
	if (validator.isEmpty(projectId)) {
		validationErrors.push('projectId is required.');
	}
	if (validator.isEmpty(inventoryId)) {
		validationErrors.push('inventroyId is required.');
	}
	if (validator.isEmpty(userId)) {
		validationErrors.push('userId is required.');
	}
	if (validator.isEmpty(status)) {
		validationErrors.push('status is required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	} else {
		const statusId = [];
		// if (status.includes(',')) {
		// 	let ids = status.split(',');
		// 	for (i = 0; i < ids.length; i++) {
		// 		statusId.push({
		// 			projectId,
		// 			userId,
		// 			status: ids[i],
		// 			inventoryId,
		// 			subinventoryId,
		// 			isVisible: 1,
		// 		});
		// 	}
		// } else {
		statusId.push({
			projectId,
			userId,
			status,
			inventoryId,
			subinventoryId,
			isVisible: 1,
		});
		// }
		console.log(statusId);
		InventoryUsageLogs.bulkCreate(statusId, { returning: true })
			.then((newTask) => {
				res.status(200).send({
					success: true,
					message: 'Inventory Usage Logs added successfully',
					data: newTask,
				});
			})
			.catch((err) => {
				res.status(400).send({
					success: false,
					message: 'Something went wrong' + err,
				});
			});
	}
};
exports.singleInventoryUsageLogs = (req, res, next) => {
	const { id } = req.params;
	if (id) {
		InventoryUsageLogs.findOne({ where: { id, isVisible: 1 } })
			.then((allInventroy) => {
				if (allInventroy) {
					res.status(200).send({
						success: true,
						message: ' inventroy usage logs fetched successfully',
						data: allInventroy,
					});
				} else {
					res.status(400).send({
						success: false,
						message: `No inventroy usage logs  found`,
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
	} else {
		res.status(400).send({
			success: false,
			message: `id is required`,
		});
	}
};

exports.singleInventoryUsageLogsByInventoryId = (req, res, next) => {
	const { id } = req.params;
	if (id) {
		InventoryUsageLogs.findAll({ where: { inventoryId: id, isVisible: 1 } })
			.then((allInventroy) => {
				if (allInventroy) {
					res.status(200).send({
						success: true,
						message: ' inventroy usage logs fetched successfully',
						data: allInventroy,
					});
				} else {
					res.status(400).send({
						success: false,
						message: `No inventroy usage logs  found`,
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
	} else {
		res.status(400).send({
			success: false,
			message: `id is required`,
		});
	}
};

exports.singleInventoryUsageLogsBySubInventoryId = (req, res, next) => {
	const { id } = req.params;
	if (id) {
		InventoryUsageLogs.findAll({ where: { subinventoryId: id, isVisible: 1 } })
			.then((allInventroy) => {
				if (allInventroy) {
					res.status(200).send({
						success: true,
						message: ' inventroy usage logs fetched successfully',
						data: allInventroy,
					});
				} else {
					res.status(400).send({
						success: false,
						message: `No inventroy usage logs  found`,
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
	} else {
		res.status(400).send({
			success: false,
			message: `id is required`,
		});
	}
};
exports.updateInventoryUsageLogs = (req, res, next) => {
	const { id, status } = req.body;
	const validationErrors = [];
	if (validator.isEmpty(status) || validator.isEmpty(id)) {
		validationErrors.push('Status and Id are required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
	InventoryUsageLogs.findOne({ where: { id, isVisible: 1 } })
		.then((task) => {
			if (task) {
				task
					.update({ status })
					.then((updateTask) => {
						res.status(200).send({
							success: true,
							message: 'Satus updated successfully',
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
exports.removeInventoryUsageLogs = (req, res, next) => {
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
	InventoryUsageLogs.findOne({ where: { id, isVisible: 1 } })
		.then((iul) => {
			if (iul) {
				iul
					.update({ isVisible: 0 })
					.then((updateIUL) => {
						res.status(200).send({
							success: true,
							message: 'Inventroy Usage Logs deleted successfully',
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
					message: 'Inventroy Usage Logs doesnt exists',
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
