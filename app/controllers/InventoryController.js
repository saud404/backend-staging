const validator = require('validator');
const Inventory = require('../models/Inventory');

exports.allInventroy = (req, res, next) => {
	Inventory.findAll({ where: { isVisible: 1 } })
		.then((allInventroy) => {
			res.status(200).send({
				success: true,
				message: 'All inventroy fetched successfully',
				data: allInventroy,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(400).send({
				success: false,
				message: `Something went worng ${err}`,
			});
		});
};

exports.singleInventroy = (req, res, next) => {
	const { id } = req.params;
	if (id) {
		Inventory.findOne({ where: { id, isVisible: 1 } })
			.then((allInventroy) => {
				if (allInventroy) {
					res.status(200).send({
						success: true,
						message: 'All inventroy fetched successfully',
						data: allInventroy,
					});
				} else {
					res.status(400).send({
						success: false,
						message: `No inventroy found`,
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
			message: `Inventory id is required`,
		});
	}
};

exports.subInventroy = (req, res, next) => {
	const { id } = req.params;
	if (id) {
		Inventory.findOne({ where: { parentId: id, isVisible: 1 } })
			.then((subinventroy) => {
				if (subinventroy) {
					res.status(200).send({
						success: true,
						message: 'All inventroy fetched successfully',
						data: subinventroy,
					});
				} else {
					res.status(400).send({
						success: false,
						message: `No inventroy found`,
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
			message: `Parent inventory id is required`,
		});
	}
};

exports.addInventory = (req, res, next) => {
	const validationErrors = [];
	const { name, quantity, noOfAvailable, noOfOccupied, parentId } = req.body;
	console.log(name, quantity, noOfAvailable, parentId);
	if (parentId) {
		console.log('in if');
		if (name && quantity && noOfAvailable) {
			if (validator.isEmpty(name)) {
				validationErrors.push('Inventory name is required');
			}
			if (!validator.isNumeric(quantity)) {
				validationErrors.push('Inventory quantity is required');
			}
			if (!validator.isNumeric(noOfAvailable)) {
				validationErrors.push('Inventory quantity is required');
			}
		} else {
			console.log();
			validationErrors.push(
				'Missing data. Name, quantity and noOfAvailable are required'
			);
		}
	} else {
		if (validator.isEmpty(name)) {
			validationErrors.push('Inventory name is required');
		}
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	} else {
		Inventory.findOne({
			where: {
				name,
				isVisible: 1,
			},
		})
			.then((inventroy) => {
				if (inventroy) {
					res.status(400).send({
						success: false,
						message: 'Inventory with this name already exists',
					});
				} else {
					Inventory.create({
						name,
						quantity,
						parentId,
						noOfAvailable,
						noOfOccupied,
						isVisible: 1,
					})
						.then((inventroyObj) => {
							res.status(200).send({
								success: true,
								message: 'Inventory added successfully',
								data: inventroyObj,
							});
						})
						.catch((error) => {
							res.status(400).send({
								success: false,
								message: `Something went wrong ${error}`,
							});
						});
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(400).send({
					success: false,
					message: `Something went wrong ${error}`,
				});
			});
	}
};

exports.updateInventory = (req, res, next) => {
	const { id, name, quantity, noOfAvailable, noOfOccupied, parentId } =
		req.body;
	const inventroyName = name.toLowerCase();
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
	Inventory.findOne({ where: { id, isVisible: 1 } })
		.then((inventroy) => {
			if (inventroy) {
				inventroy
					.update({
						name: inventroyName,
						quantity: quantity ? quantity : inventroy.quantity,
						noOfAvailable: noOfAvailable
							? noOfAvailable
							: inventroy.noOfAvailable,
						noOfOccupied: noOfOccupied ? noOfOccupied : inventroy.noOfOccupied,
						parentId: parentId ? parentId : inventroy.parentId,
					})
					.then((updateInventroy) => {
						res.status(200).send({
							success: true,
							message: 'Inventroy updated successfully',
							data: updateInventroy,
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
					message: 'Inventroy doesnt exists',
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

exports.removeInventory = (req, res, next) => {
	const { id } = req.body;
	console.log(req.body);
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
	} else {
		Inventory.findOne({ where: { id } })
			.then((inventroy) => {
				if (inventroy) {
					if (inventroy.parentId) {
						inventroy
							.update({ isVisible: 0 })
							.then((updateInventroy) => {
								res.status(200).send({
									success: true,
									message: 'Inventroy deleted successfully',
									data: updateInventroy,
								});
							})
							.catch((err) => {
								res.status(400).send({
									success: false,
									message: 'Something went wrong' + err,
								});
							});
					} else {
						Inventory.update({ isVisible: 0 }, { where: { parentId: id } })
							.then(() => {
								inventroy
									.update({ isVisible: 0 })
									.then(() => {
										res.status(200).send({
											success: true,
											message: `deleted`,
										});
									})
									.catch((err) => {
										res.status(400).send({
											success: false,
											message: `Something went worng ${err}`,
										});
									});
							})
							.catch((err) => {
								res.status(400).send({
									success: false,
									message: `Something went worng ${err}`,
								});
							});
					}
				} else {
					res.status(400).send({
						success: false,
						message: 'Inventroy doesnt exists',
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
	}
};
