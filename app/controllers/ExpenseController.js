const validator = require('validator');
const Expenses = require('../models/Expenses');

exports.Expenses = (req, res, next) => {
	Expenses.findAll({ where: { isVisible: 1 } })
		.then((ExpensesList) => {
			res.status(200).send({
				success: true,
				message: 'Expenses fetched successfully',
				data: ExpensesList,
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
exports.addExpense = (req, res, next) => {
	const { name } = req.body;
	const expenseName = name.toLowerCase();
	const validationErrors = [];
	if (validator.isEmpty(name)) {
		validationErrors.push('Name of the expense is required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
	Expenses.findOne({ where: { name: expenseName } })
		.then((expense) => {
			if (!expense) {
				console.log('in if');
				Expenses.create({ name: expenseName, isVisible: 1 })
					.then((newExpense) => {
						res.status(200).send({
							success: true,
							message: 'Expenses added successfully',
							data: newExpense,
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
					message: 'Expense with this name already exists',
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

exports.updateExpense = (req, res, next) => {
	const { id, name } = req.body;
	const expenseName = name.toLowerCase();
	const validationErrors = [];
	if (validator.isEmpty(name) || validator.isEmpty(id)) {
		validationErrors.push('Expense name and Id are required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}
	Expenses.findOne({ where: { id } })
		.then((expense) => {
			if (expense) {
				expense
					.update({ name: expenseName })
					.then((updateExpense) => {
						res.status(200).send({
							success: true,
							message: 'Expenses updated successfully',
							data: updateExpense,
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
					message: 'Expense doesnt exists',
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
exports.removeExpense = (req, res, next) => {
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
	Expenses.findOne({ where: { id } })
		.then((expense) => {
			if (expense) {
				expense
					.update({ isVisible: 0 })
					.then((updateExpense) => {
						res.status(200).send({
							success: true,
							message: 'Expenses deleted successfully',
							data: updateExpense,
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
					message: 'Expense doesnt exists',
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
