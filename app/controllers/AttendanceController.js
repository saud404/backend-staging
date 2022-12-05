const validator = require('validator');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
// const { Op } = require('sequelize');


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
    user_id: req.body.user_id
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


exports.getStartAndEndTime = async (req, res, next) => {
  console.log("--------------------------------------------")
  const { id } = req.params;
  // console.log(id)
  // const { startDate } = req.params;
  // const { endDate } = req.params;

  console.log("--------------------------------------------")
  console.log(req)
  await Attendance.findAll({
    //attributes: ['id', 'startDate', 'endDate', 'user_id'],
    where: {
      id,
      // startDate, endDate
      // between: [startDate(parseDate), endDate(parseDate)]
      //where: { [Op.between]: [startDate(parseDate), endDate(parseDate)] }
      //where: { id: id, startDate: startDate, endDate: endDate },
      // where: { id: id },
    },
    include: {
      model: User
    }
  })
    .then((myData) => {
      console.log(myData)
      res.json({ myData })

    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: err,
      });
      console.log(err);
    });
};
