const validator = require('validator');
const ContractorBridgeLogo = require('../models/ContractorBridgeLogo');

exports.ContractorBridgeLogo = (req, res, next) => {
	ContractorBridgeLogo.findAll({ where: { isVisible: 1 } })
		.then((cb) => {
			res.status(200).send({
				success: true,
				message: 'Contractor logos fetched successfully',
				data: cb,
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
exports.getContractorBridgeLogo = (req, res, next) => {
	const { id } = req.params;
	ContractorBridgeLogo.findAll({ where: { contractorId: id, isVisible: 1 } })
		.then((cb) => {
			res.status(200).send({
				success: true,
				message: 'Contractor logos fetched successfully',
				data: cb,
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
exports.addCBL = (req, res, next) => {
	const { contractorId, contractorAssociatedId } = req.body;
	const validationErrors = [];
	if (validator.isEmpty(contractorId)) {
		validationErrors.push('contractorId is required.');
	}
	if (validator.isEmpty(contractorAssociatedId)) {
		validationErrors.push('contractorAssociatedId is required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	}

	ContractorBridgeLogo.create({
		contractorId,
		contractorAssociatedId,
		isVisible: 1,
	})
		.then((cbl) => {
			res.status(200).send({
				success: true,
				message: 'Tasks added successfully',
				data: cbl,
			});
		})
		.catch((err) => {
			res.status(400).send({
				success: false,
				message: 'Something went wrong' + err,
			});
		});
};
exports.addBulkCBL = (req, res, next) => {
	const { contractorId, contractorAssociatedId } = req.body;
	const validationErrors = [];
	if (validator.isEmpty(contractorId)) {
		validationErrors.push('contractorId is required.');
	}
	if (validator.isEmpty(contractorAssociatedId)) {
		validationErrors.push('contractorAssociatedId is required.');
	}
	if (validationErrors.length) {
		res.status(400).send({
			success: false,
			message: 'Issue with data being send',
			data: validationErrors,
		});
	} else {
		const associateId = [];
		if (contractorAssociatedId.includes(',')) {
			let ids = contractorAssociatedId.split(',');
			for (i = 0; i < ids.length; i++) {
				associateId.push({
					contractorId,
					contractorAssociatedId: ids[i],
					isVisible: 1,
				});
			}
		} else {
			associateId.push({
				contractorId,
				contractorAssociatedId: contractorAssociatedId,
				isVisible: 1,
			});
		}
		ContractorBridgeLogo.bulkCreate(associateId, { returning: true })
			.then((cbl) => {
				res.status(200).send({
					success: true,
					message: 'Tasks added successfully',
					data: cbl,
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
exports.updateCBL = (req, res, next) => {
	const { contractorId, contractorAssociatedId, id } = req.body;

	ContractorBridgeLogo.findOne({ where: { id } })
		.then((cbl) => {
			if (cbl) {
				cbl
					.update({
						contractorId: contractorId ? contractorId : cbl.contractorId,
						contractorAssociatedId: contractorAssociatedId
							? contractorAssociatedId
							: cbl.contractorAssociatedId,
					})
					.then((updatedcbl) => {
						res.status(200).send({
							success: true,
							message: 'CBL updated successfully',
							data: updatedcbl,
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
					message: 'CBL doesnt exists',
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
exports.removeCBL = (req, res, next) => {
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
	ContractorBridgeLogo.findOne({ where: { id } })
		.then((cbl) => {
			if (cbl) {
				cbl
					.update({ isVisible: 0 })
					.then((updatecbl) => {
						res.status(200).send({
							success: true,
							message: 'CBL deleted successfully',
							data: updatecbl,
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
					message: 'CBL doesnt exists',
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
