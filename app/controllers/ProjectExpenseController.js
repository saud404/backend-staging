const validator = require('validator');
const Project = require('../models/Projects');
const projectExpense = require('../models/ProjectExpense');
const Expenses = require('../models/Expenses');

exports.updateProjectExpenseStatus = (req, res, next) => {
	const { id, isCompleted } = req.body;
	console.log(req.body);
	projectExpense
		.findOne({ where: { id, isVisible: 1 } })
		.then((projectT) => {
			if (projectT) {
				projectT
					.update({ isCompleted })
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
					message: 'Expense not found',
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

exports.getProjectExpenses = (req, res, next) => {
	const { id } = req.params;
	projectExpense
		.findAll({ where: { projectId: id, isVisible: 1 }, include: [{ model: Expenses, attributes: ['name'] }] })
		.then((projectT) => {
			if (projectT) {
				res.status(200).send({
					success: true,
					message: 'expense fetched successfully',
					data: projectT,
				});
			} else {
				res.status(400).send({
					success: false,
					message: 'No expenses found',
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

exports.addProjectExpenses = (req, res, next) => {
	const { expenseId, projectId, budget, expense } = req.body;
	console.log(expenseId, projectId);
	let temp = [];
	if (expenseId && Array.isArray(expenseId)) {
		let ids = expenseId.split(',');
		for (i = 0; i < ids.length; i++) {
			temp.push({
				projectId,
				expenseId: ids[i],
				budget: budget[i],
				expense: expense[i],
				isVisible: 1,
			});
		}
	} else {
		temp.push({
			projectId,
			expenseId: expenseId,
			budget: budget,
			expense: expense,
			isVisible: 1,
		});
	}
	projectExpense
		.bulkCreate(temp, { returning: true })
		.then((projectT) => {
			res.status(200).send({
				success: true,
				message: 'expense added successfully',
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

exports.updateProjectExpenses = (req, res, next) => {
	const { expenseId, projectId ,budget,expense} = req.body;
	console.log(expenseId, projectId);
	let temp = [];
	if (expenseId&& Array.isArray(expenseId)	) {
		let ids = expenseId.split(',');
		for (i = 0; i < ids.length; i++) {
			temp.push({
				projectId,
				expenseId: ids[i],
				budget:budget[i],
				expense:expense[i],
				isVisible: 1,
			});
		}
	} else {
		temp.push({
			projectId,
			expenseId: expenseId,
			budget:budget,
			expense:expense,
			isVisible: 1,
		});
	}
	projectExpense
		.bulkCreate(temp, { returning: true ,    updateOnDuplicate: ["projectId", "expenseId"],
})
		.then((projectT) => {
			res.status(200).send({
				success: true,
				message: 'expense added successfully',
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
exports.removeProjectExpenses = (req, res, next) => {
	const { id } = req.body;
	projectExpense
		.findOne({ where: { id, isVisible: 1 } })
		.then((projectT) => {
			if (projectT) {
				projectT
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
					message: 'expense not found',
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
