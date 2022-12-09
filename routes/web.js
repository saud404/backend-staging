const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController');
const UserController = require('../app/controllers/UserController');
const ProjectController = require('../app/controllers/ProjectController');
const ProjectExpenseController = require('../app/controllers/ProjectExpenseController');
const TaskController = require('../app/controllers/TaskController');
const ExpenseController = require('../app/controllers/ExpenseController');
const InventoryController = require('../app/controllers/InventoryController');
const ProjectTaskController = require('../app/controllers/ProjectTaskController');
const InventoryUsageLogsController = require('../app/controllers/InventoryLogsController');
const ProjectMediaController = require('../app/controllers/ProjectMediaController');
const CustomerDataController = require('../app/controllers/CustomerDataController');
const ContractorLogoController = require('../app/controllers/ContractorLogoController');
const CustomerTaskController = require('../app/controllers/CustomerTaskController');
const TutorialMediaController = require('../app/controllers/TutorialMediaGallery');
const TaskMediaController = require('../app/controllers/TaskMediaController');
const NotificationController = require('../app/controllers/NotificationController');
const AttendanceController = require('../app/controllers/AttendanceController.js');
const isAuth = require('../app/middleware/isAuth');
const ProjectTasks = require('../app/models/ProjectTask');
const adminPrefix = '/admin';
const projectPrefix = '/project';
const inventoryPrefix = '/inventory';

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post(
	'/sign-up',
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/',
		limits: { fileSize: 50 * 1024 * 1024 },
	}),
	AuthController.signUp
);
router.post('/update-password', AuthController.updatePassword);
router.post('/resend-code', AuthController.resendCode);
router.post('/send-notification', AuthController.pushNotification);
router.post('/verify-code', AuthController.verifyCode);
router.post('/forgot-password', AuthController.forgotPassword);
router.get('/verifytoken/:token', AuthController.verifyToken);
router.get('/verify-auth/:token', AuthController.verifyAuthToken);
//admin
router.post(`${adminPrefix}/user`, UserController.addUser);
router.get(`${adminPrefix}/contractors`, UserController.allUserContractor);
router.get(`${adminPrefix}/employees`, UserController.allUserEmployee);
router.get(`${adminPrefix}/customers`, UserController.allUserCustomer);

// ----------------------PHASE-2 Manger & Foreman Flow --------------------
//Manager & Foreman Roles
router.get(`${adminPrefix}/managers`, UserController.allUserCustomer);
router.get(`${adminPrefix}/foremans`, UserController.allUserCustomer);
//Expenses
router.get('/expense', ExpenseController.Expenses);
router.get(`${projectPrefix}/project-expense/:id`, ProjectExpenseController.getProjectExpenses);

//Attendance report
router.get(`${projectPrefix}/attendance/`, AttendanceController.findAllAttendance);
router.post(`${projectPrefix}/attendance`, AttendanceController.addAttendance);
router.patch(`${projectPrefix}/attendance/:id`, AttendanceController.updateAttendance);
router.delete(`${projectPrefix}/attendance/:id`, AttendanceController.removeAttendance);
router.get(`${projectPrefix}/attendance/`, AttendanceController.oneToManyAttendanceBetweenSelectedTimes);
router.post(`${projectPrefix}/attendance/`, AttendanceController.manyAttendancesBetweenTwoDates);
// router.post(`/attendance/`, AttendanceController.getStartAndEndTime);
//Work Report

// ----------------------PHASE-2 Manager & Foreman Flow --------------------

//router.patch(`${ adminPrefix } / contractor /: id`, UserController.updateContractor);
// API to delete contractor, customer and employee
router.delete(`${adminPrefix}/user`, UserController.deleteUser);
// API to get a single contractor, customer and employee
router.get(`${adminPrefix}/user/:id`, UserController.getUser);
//router.put(`${ adminPrefix } / user /: id`, UserController.userProfile);

//for users
router.get(`/user/:id`, UserController.getUser);
router.put(
	`/user/:id`,
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/',
		limits: { fileSize: 50 * 1024 * 1024 },
	}),
	UserController.userProfile
);
//For expense

router.get('/expense', isAuth, ExpenseController.Expenses);
router.post('/expense', isAuth, ExpenseController.addExpense);
router.patch('/expense', isAuth, ExpenseController.updateExpense);
router.delete('/expense', isAuth, ExpenseController.removeExpense);
// for projects expense

router.post(`${projectPrefix}/project-expense`, isAuth, ProjectExpenseController.addProjectExpenses);
router.put(`${projectPrefix}/project-expense/:id`, isAuth, ProjectExpenseController.updateProjectExpenses);
router.get(`${projectPrefix}/project-expense/:id`, isAuth, ProjectExpenseController.getProjectExpenses);

router.post(`${adminPrefix}/project`, isAuth, ProjectController.project);
router.get(`${adminPrefix}/projects`, isAuth, ProjectController.getAllProject);
router.get(
	`${adminPrefix}/project/:id`,
	isAuth,
	ProjectController.singleProject
);
router.delete(`${adminPrefix}/project`, ProjectController.removeProject);
router.patch(`${adminPrefix}/project/:id`, ProjectController.updateProject);
router.post('/contractor/project', isAuth, ProjectController.projectContractor);
router.patch(
	'/contractor/project/:id',
	isAuth,
	ProjectController.updateprojectContractor
);
router.get(
	'/contractor/project/:id',
	isAuth,
	ProjectController.projectsOfContractors
);
router.get(
	`${projectPrefix}/project-tasks/:id`,
	ProjectTaskController.getProjectTasks
);
router.post(
	`${projectPrefix}/project-tasks/`,
	ProjectTaskController.addProjectTasks
);
// router.post(
// 	`${ projectPrefix } / project - tasks / `,
// 	ProjectTaskController.addProjectTasks
// );
router.patch(
	`${projectPrefix}/project-tasks/`,
	ProjectTaskController.updateProjectTaskStatus
);
router.delete(
	`${projectPrefix}/project- asks/`,
	ProjectTaskController.removeProjectTasks
);
router.get(
	`${projectPrefix}/media/:id`,
	isAuth,
	ProjectMediaController.getProjectMedia
);
router.post(
	`${projectPrefix}/media/`,
	[
		isAuth,
		fileUpload({
			useTempFiles: true,
			tempFileDir: '/tmp/',
			limits: { fileSize: 50 * 1024 * 1024 },
		}),
	],
	ProjectMediaController.addProjectMedia
);
router.patch(
	`${projectPrefix}/media/:id`,
	[
		isAuth,
		fileUpload({
			useTempFiles: true,
			tempFileDir: '/tmp/',
			limits: { fileSize: 50 * 1024 * 1024 },
		}),
	],
	ProjectMediaController.updateProjectMedia
);
router.delete(
	`${projectPrefix}/media/`,
	isAuth,
	ProjectMediaController.removeProjectMedia
);
//for tasks
router.get('/tasks', isAuth, TaskController.tasks);
router.post('/task', isAuth, TaskController.addTask);
router.patch('/task', isAuth, TaskController.updateTask);
router.delete('/task', isAuth, TaskController.removeTask);
//customerData

router.get('/customerData', isAuth, CustomerDataController.cd);
router.get('/customerData/:id', isAuth, CustomerDataController.singleCD);
router.post('/customerData', isAuth, CustomerDataController.addCD);
router.patch('/customerData', isAuth, CustomerDataController.updateCD);
router.delete('/customerData', isAuth, CustomerDataController.removeCD);

//for inventory
router.get('/inventory', isAuth, InventoryController.allInventroy);
router.get('/inventory/:id', isAuth, InventoryController.singleInventroy);
router.get('/subinventory/:id', isAuth, InventoryController.subInventroy);
router.post(
	`${adminPrefix}/inventory`,
	isAuth,
	InventoryController.addInventory
);
router.patch(
	`${adminPrefix}/inventory`,
	isAuth,
	InventoryController.updateInventory
);
router.delete(
	`${adminPrefix}/inventory`,
	isAuth,
	InventoryController.removeInventory
);

//for inventory usage logs
router.get(
	`/ inventoryUsageLogs`,
	InventoryUsageLogsController.allinventoryusagelogs
);
router.get(
	`/inventoryUsageLogs/:id`,
	InventoryUsageLogsController.singleInventoryUsageLogs
);
router.get(
	`/inventoryUsageLogs/inventory/:id`,
	InventoryUsageLogsController.singleInventoryUsageLogsByInventoryId
);
router.get(
	`/inventoryUsageLogs/subinventory/:id`,
	InventoryUsageLogsController.singleInventoryUsageLogsBySubInventoryId
);
router.post(
	`/ inventoryUsageLogs`,
	InventoryUsageLogsController.addinventoryusagelogs
);
router.patch(
	`/ inventoryUsageLogs`,
	isAuth,
	InventoryUsageLogsController.updateInventoryUsageLogs
);
router.delete(
	`/ inventoryUsageLogs`,
	InventoryUsageLogsController.removeInventoryUsageLogs
);
//for contractor logo
router.get(
	'/contractorLogo',
	isAuth,
	ContractorLogoController.ContractorBridgeLogo
);
router.get(
	'/contractorLogo/:id',
	isAuth,
	ContractorLogoController.getContractorBridgeLogo
);
router.post('/contractorLogo', isAuth, ContractorLogoController.addBulkCBL);
router.patch('/contractorLogo', isAuth, ContractorLogoController.updateCBL);
router.delete('/contractorLogo', isAuth, ContractorLogoController.removeCBL);

//for customer tasks
router.get(
	'/customerTasks/:id',
	isAuth,
	CustomerTaskController.getCustomerTasks
);
router.post('/customerTasks', isAuth, CustomerTaskController.addCustomerTasks);
router.patch(
	'/customerTasks',
	isAuth,
	CustomerTaskController.updateCutomerTasks
);
router.delete(
	'/customerTasks',
	isAuth,
	CustomerTaskController.removeCustomerTasks
);
//tutorial Media

router.get(
	'/tutorialMedia',
	isAuth,
	TutorialMediaController.getAllTutorialMediaGallery
);
router.get(
	'/tutorialMedia/:id',
	isAuth,
	TutorialMediaController.getTutorialMediaGallery
);
router.get(
	'/tasks/tutorialMedia/:id',
	isAuth,
	TutorialMediaController.getTutorialMediaGalleryByTaskId
);
router.post(
	'/tutorialMedia',
	[
		isAuth,
		fileUpload({
			useTempFiles: true,
			tempFileDir: '/tmp/',
			limits: { fileSize: 50 * 1024 * 1024 },
		}),
	],
	TutorialMediaController.addTutorialMediaGallery
);
router.patch(
	'/tutorialMedia',
	[
		isAuth,
		fileUpload({
			useTempFiles: true,
			tempFileDir: '/tmp/',
			limits: { fileSize: 50 * 1024 * 1024 },
		}),
	],
	TutorialMediaController.updateTutorialMediaGallery
);
router.delete(
	'/tutorialMedia',
	isAuth,
	TutorialMediaController.removeTutorialMediaGallery
);

//task Media

// router.get('/taskMedia', isAuth, TaskMediaController.getTaskMedia);
router.get('/taskMedia/:id', isAuth, TaskMediaController.getTaskMedia);
router.post('/taskMedia', isAuth, TaskMediaController.addTaskMedia);
router.patch('/taskMedia', isAuth, TaskMediaController.updateTaskMedia);
router.delete('/taskMedia', isAuth, TaskMediaController.removeTaskMedia);

// Notification
router.get('/notification/:id', isAuth, NotificationController.notification);
router.post('/notification', isAuth, NotificationController.addNotif);

module.exports = router;
