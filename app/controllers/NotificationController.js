const validator = require('validator');
const Notification = require('../models/Notification');

exports.notification = (req, res, next) => {
	const { id } = req.params;
	Notification.findAll({ where: { userId: id } })
		.then((notif) => {
			res.status(200).send({
				success: true,
				message: 'Notification fetched successfully',
				data: notif,
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
exports.addNotif = (req, res, next) => {
	const { content, userId } = req.body;
	const validationErrors = [];
	if (validator.isEmpty(content)) {
		validationErrors.push('content of the notification is required.');
	}
	if (validator.isEmpty(userId)) {
		validationErrors.push('userId of the notification is required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
	Notification.create({ content, userId })
		.then((notif) => {
			res.status(200).send({
				success: true,
				message: 'Notification added successfully',
				data: notif,
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
