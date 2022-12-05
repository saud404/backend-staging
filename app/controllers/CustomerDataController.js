const validator = require('validator');
const CustomerData = require('../models/CustomerData');

exports.cd = (req, res, next) => {
	CustomerData.findAll({ where: { isVisible: 1 } })
		.then((cdList) => {
			res.status(200).send({
				success: true,
				message: 'Customer Data fetched successfully',
				data: cdList,
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

exports.singleCD = (req, res, next) => {
	const { id } = req.params;
	CustomerData.findAll({ where: { userId: id, isVisible: 1 } })
		.then((cdList) => {
			res.status(200).send({
				success: true,
				message: 'Customer Data fetched successfully',
				data: cdList,
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
exports.addCD = (req, res, next) => {
	const { name, userId, content } = req.body;
	const validationErrors = [];
	if (validator.isEmpty(name)) {
		validationErrors.push('Name is required.');
	}
	if (validator.isEmpty(content)) {
		validationErrors.push('Content is required.');
	}
	if (validator.isEmpty(userId)) {
		validationErrors.push('User ID is required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
	CustomerData.create({ name, userId, isVisible: 1, content })
		.then((cd) => {
			res.status(200).send({
				success: true,
				message: 'CustomerData added successfully',
				data: cd,
			});
		})
		.catch((err) => {
			res.status(400).send({
				success: false,
				message: 'Something went wrong' + err,
			});
		});
};

exports.updateCD = (req, res, next) => {
	const { id, name, userId, content } = req.body;
	const validationErrors = [];
	if (validator.isEmpty(name) || validator.isEmpty(id)) {
		validationErrors.push('Customer Data name and Id are required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
	CustomerData.findOne({ where: { id, isVisible: 1 } })
		.then((cd) => {
			if (cd) {
				cd.update({
					name: name ? name : cd.name,
					userId: userId ? userId : cd.userId,
					content: content ? content : cd.content,
				})
					.then((updateTask) => {
						res.status(200).send({
							success: true,
							message: 'Customer Details updated successfully',
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
					message: 'Customer Details doesnt exists',
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

exports.removeCD = (req, res, next) => {
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
	CustomerData.findOne({ where: { id } })
		.then((cd) => {
			if (cd) {
				cd.update({ isVisible: 0 })
					.then((updatecd) => {
						res.status(200).send({
							success: true,
							message: 'CustomerData deleted successfully',
							data: updatecd,
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
