const validator = require('validator');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { Op } = require('sequelize');
// const Sequelize = require("sequelize");
var moment = require('moment');

exports.findAllAttendance = (req, res, next) => {
  Attendance.findAll({
    // User: {
    //   id,
    //   firstName,
    //   lastName,
    //   email,
    // },
    include: [{
      model: User,
      // where: 'User.id',
      // as: 'users'
      // as: 'User',
      // attributes: ['id', 'first_name', 'last_name'],
      required: true,
    }]

  })
    .then((attendanceList) => {
      res.status(200).send({
        success: true,
        message: 'Attendance fetched successfully',
        data: attendanceList,
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

exports.addAttendance = (req, res, next) => {

  Attendance.create({
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    name: req.body.name,
    present: req.body.present,
    late: req.body.late,
    hoursWorked: req.body.hoursWorked,
    userId: req.body.userId
  })
    .then((newAttendance) => {
      res.status(200).send({
        success: true,
        message: 'Attendance added successfully',
        data: newAttendance,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: 'Something went wrong' + err,
      });
      console.log(err);
    });
};

exports.updateAttendance = (req, res, next) => {


  const { id } = req.params;
  console.log(id);
  const validationErrors = [];
  if (validationErrors.length) {
    res.status(400).send({
      success: false,
      message: 'Issue with data being send',
      data: validationErrors,
    });
  }
  Attendance.findOne({ where: { id } })
    .then((attendance) => {
      if (attendance) {
        attendance
          .update({
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            name: req.body.name,
            present: req.body.present,
            late: req.body.late,
            hoursWorked: req.body.hoursWorked,
            user_id: req.body.user_id
          })
          .then((updateAttendance) => {
            res.status(200).send({
              success: true,
              message: 'Attendance updated successfully',
              data: updateAttendance,
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
          message: 'attendance does not exists',
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

exports.removeAttendance = (req, res, next) => {
  const { id } = req.params;
  if (id) {
    console.log('in if delete', id);
    Attendance.destroy({
      where: {
        id
      },
    }).then((attendance) => {
      console.log(attendance);
      if (attendance) {

        res.status(200).send({
          success: true,
          message: 'Attendance deleted successfully',
        });

        // });
      } else {
        res.status(400).send({
          success: false,
          message: 'Attendance not found',
        });
      }
    })
      .catch(err => {
        res.status(400).send({
          success: false,
          message: err,
        });
      })
      ;
  } else {
    res.status(400).send({
      success: false,
      message: 'ID of attendance is required',
    });
  }
};
//Getting One User Attendance between two dates
exports.oneToManyAttendanceBetweenSelectedTimes = (req, res, next) => {
  let { startDate, endDate, userId } = req.query;
  //  const userId = req.params.userId;
  User.findAll({
    include: [{
      model: Attendance,
      // attributes: ['startDate', 'endDate'],
      where: {
        userId: userId,
        // userId: req.params.userId,
        [Op.or]: [{
          startDate: {
            [Op.between]: [startDate, endDate]
          }
        }, {
          endDate: {
            [Op.between]: [startDate, endDate]
          }
        }]
      }
    },
    ],

  })
    .then((attendanceList) => {
      res.status(200).send({
        success: true,
        message: 'Attendance fetched successfully',
        data: attendanceList,
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

//Getting All Users Attendance between two dates
exports.manyAttendancesBetweenTwoDates = (req, res, next) => {
  let { startDate, endDate } = req.query;

  Attendance.findAll({
    where: {
      //userId: 2,

      [Op.or]: [{
        startDate: {
          [Op.between]: [startDate, endDate]
        }
      }, {
        endDate: {
          [Op.between]: [startDate, endDate]
        }
      }]
    },
    include: [{
      model: User,
      // attributes: ['startDate', 'endDate'],

    },
    ],

  })
    .then((attendanceList) => {
      res.status(200).send({
        success: true,
        message: 'Attendance fetched successfully',
        data: attendanceList,
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






// exports.getStartAndEndTime = (req, res, next) => {
//   console.log(req.query)
//   const { startDate, endDate } = req.query;

//   console.log(startDate)
//   // const totalDate = { startDate, endDate }
//   res.send({ startDate, endDate });
  // const sequelize = new Sequelize('tropicaldb5', 'root', 'root', {
  //   host: 'localhost',
  //   dialect: 'mysql',

  //   pool: {
  //     max: 5,
  //     min: 0,
  //     acquire: 30000,
  //     idle: 10000
  //   },
  // SQLite only
  // storage: 'path/to/database.sqlite',

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  // operatorsAliases: false
  // });
  // console.log("--------------------------------------------")
  // console.log(moment().format)
  // const { id } = req.params;
  // console.log(id)
  // const { startDate } = req.params;
  // const { endDate } = req.params;
  // const startDate = new Date("2000-12-12 00:00:00");
  // const endDate = new Date("2022-12-26 00:00:00");
  // moment().format('YYYY-MM-DD 00:00:01');
  // newDate = endDate(parseDate) - startDate(parseDate)
  // console.log("--------------------------------------------")
  // console.log(req)
  // const results = sequelize.query(
  //   "SELECT * FROM `attendances` INNER JOIN `users` ON `attendances`.`user_id`= `users`.`id` WHERE `startDate` = ${startDate} AND `endDate` = ${endDate} ",
  // );
  // const results = sequelize.query(
  //   "SELECT * FROM `attendances`",
  // );
  // .then(results => {
  //   console.log(results);
  // }
  // console.log("----------------------Results & Meta Data----------------------")
  // console.log("---------------------------------------------------------------")
  // console.log(results)
  // console.log(metadata)
  // console.log("---------------------------------------------------------------")
  // console.log("---------------------------------------------------------------")
  // Attendance.findAll({
  //   attributes: ['id', 'startDate', 'endDate', 'hoursWorked', 'user_id', 'present', 'late'],
  //   where: {
  // User,
  // id,
  // from: {
  //   $between: [startDate, endDate]
  // }

  // $or: [{
  //   from: {
  //     $between: [start]
  //   }
  // }, {
  //   to: {
  //     $between: [endDate]
  //   }
  // }]

  // [Op.between]: [startDate(parseDate), endDate(parseDate)]
  //  [Op.between]: [startDate, endDate]
  // [Op.between]: [startDate(parseDate), endDate(parseDate)]

  // from: {
  //   between: ['startDate', 'endDate']
  // }
  //where: { [Op.between]: [startDate(parseDate), endDate(parseDate)] }
  //where: { id: id, startDate: startDate, endDate: endDate },
  // where: { id: id },
  //     },
  //     include: {
  //       model: User
  //     }
  //   })
  //     .then((myData) => {
  //       console.log(myData)
  //       res.json({ myData })

  //     })
  //     .catch((err) => {
  //       res.status(400).send({
  //         success: false,
  //         message: err,
  //       });

  //       console.log(err);
  //     });
  // }
  // };
// }