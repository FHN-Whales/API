const User = require('../models/userModel');
const Family = require("../models/familyModel")
const Reminder = require("../models/ReminderModel")
const TreatmentReminder = require("../models/TreatmentReminderModel")
const Users = require('../models/userModel')
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.configDotenv()


exports.CreateTreatmentReminders = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      return {
        completed: false,
        message: "Data is not provided."
      };
    }
    const validTimeRegex = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/;

    const { userId, startDate, endDate, frequency, timeOfDay, treatmentTime, medications } = data;

    if (!userId) {
      return {
        completed: false,
        message: "UserId is missing."
      };
    }
    for (let time of treatmentTime) {
      if (!validTimeRegex.test(time)) {
        return {
          completed: false,
          message: "Invalid format for treatmentTime. Please use the format hh:mm in 24-hour notation."
        };
      }
    }
    if (!startDate) {
      return {
        completed: false,
        message: "startDate cannot be left blank."
      };
    }

    if (!endDate) {
      return {
        completed: false,
        message: "endDate cannot be left blank."
      };
    }

    if (!frequency) {
      return {
        completed: false,
        message: "frequency cannot be left blank."
      };
    }

    if (!timeOfDay) {
      return {
        completed: false,
        message: "timeOfDay cannot be left blank."
      };
    }

    if (!treatmentTime) {
      return {
        completed: false,
        message: "treatmentTime cannot be left blank."
      };
    }

    if (!medications || medications.length === 0) {
      return {
        completed: false,
        message: "medications cannot be left blank."
      };
    }

    const newReminder = await Reminder.create({ userId, startDate, endDate, frequency });

    const newReminderId = newReminder._id;

    const createdReminder = await Reminder.findById(newReminder._id);

    // Đảm bảo cả hai mảng có cùng độ dài
    if (timeOfDay.length !== treatmentTime.length) {
      return {
        completed: false,
        message: "Invalid data: timeOfDay and treatmentTime arrays must have the same length.",
      };
    }
    const newTreatmentReminderSchedules = [];
    for (let i = 0; i < timeOfDay.length; i++) {
      const timeOfDayItem = timeOfDay[i];
      const treatmentTimeItem = treatmentTime[i];
      const newTreatmentReminderSchedule = await TreatmentReminder.create({
        reminderId: newReminderId,
        timeOfDay: timeOfDayItem,
        treatmentTime: treatmentTimeItem,
        medications
      });
      newTreatmentReminderSchedules.push(newTreatmentReminderSchedule);
    }
    const newdataTreatmentReminder = await TreatmentReminder.find({ reminderId: newReminderId });
    return {
      completed: true,
      message: "Data has been successfully added.",
      dataRemimder: createdReminder,
      dataTreatmentReminder: newdataTreatmentReminder
    };

  } catch (error) {
    console.error('Error when adding data:', error);
    return {
      completed: false,
      message: "Failed to register user: " + error.message
    };
  }
}


exports.updateTreatmentReminders = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      return {
        completed: false,
        message: "Data is not provided."
      };
    }
    const { treatmentReminderId, timeOfDay, treatmentTime, medications } = data;
    const existingTreatmentReminder = await TreatmentReminder.findById(treatmentReminderId);
    if (!existingTreatmentReminder) {
      return {
        completed: false,
        message: "TreatmentReminder not found."
      };
    }

    if (!timeOfDay && !treatmentTime && (!medications || medications.length === 0)) {
      return {
        completed: false,
        message: "No new data to update."
      };
    }

    const updateTreatmentReminder = await TreatmentReminder.updateMany({
      _id: treatmentReminderId,
    },
      {
        $set: {
          timeOfDay: timeOfDay,
          treatmentTime: treatmentTime,
          medications
        }
      });
    if (updateTreatmentReminder) {
      const updatedData = await TreatmentReminder.findById(treatmentReminderId);
      return {
        completed: true,
        message: "Data has been successfully updated.",
        data: updatedData
      };
    }
  } catch (error) {
    console.error('Error when updating data:', error);
    return {
      completed: false,
      message: "Failed to register user: " + error.message
    };
  }
}


exports.deleteTreatmentReminder = async (treatmentReminderId) => {

  try {
    if (!treatmentReminderId) {
      return {
        completed: false,
        message: "TreatmentReminderId is not provided."
      };
    }
    const existingTreatmentReminder = await TreatmentReminder.findById(treatmentReminderId);
    if (!existingTreatmentReminder) {
      return {
        completed: false,
        message: "TreatmentReminder not found."
      };
    }
    await TreatmentReminder.deleteOne({ _id: treatmentReminderId });

    return {
      completed: true,
      message: "TreatmentReminder has been successfully deleted.",
    };
  } catch (error) {
    console.error('Error when deleting data:', error);
    return {
      completed: false,
      message: "Failed to delete TreatmentReminder: " + error.message
    };
  }
}

// exports.getAllTreatmentReminders = async () => {
//   try {
//     const allTreatmentReminders = await TreatmentReminder.find();

//     if (allTreatmentReminders && allTreatmentReminders.length != 0) {
//       return {
//         completed: true,
//         message: "All treatment reminders have been successfully retrieved.",
//         data: allTreatmentReminders
//       };
//     } else if (allTreatmentReminders.length == 0) {
//       return {
//         completed: false,
//         message: "All members are healthy so there are no calendar reminders"
//       };
//     }
//   } catch (error) {
//     console.error('Error when updating data:', error);
//     return {
//       completed: false,
//       message: "Failed to register user: " + error.message
//     };
//   }
// }

exports.getAllTreatmentRemindersByYearMonthDay = async (data) => {
  const { date, userId } = data;
  const [year, month, day] = date.split('/');
  if (!userId) {
    return {
      completed: false,
      message: "UserId is missing."
    };
  }
  if (!year || !month || !day) {
    return {
      completed: true,
      message: "Year, month, and day cannot be left blank."
    };
  }
  try {
    const users = await User.find({ _id: userId });
    if (users.length == 0) {
      return {
        completed: false,
        message: "User not found."
      }
    };

    const reminders = await Reminder.find({
      startDate: { $lte: new Date(year, month - 1, day + 1) },
      endDate: { $gte: new Date(year, month - 1, day) }
    });


    if (users[0].role === "Dad") {
      const getAllreminders = await Reminder.find({ userId: userId });
      if (getAllreminders.length == 0) {
        return {
          completed: true,
          message: "Hiện tại các thành viên gia đình bạn không có lịch",
        };
      }

      const userReminders = await getAllReminders(reminders);
      return {
        completed: true,
        message: "Success",
        data: userReminders
      };
    }
    if (users[0].role !== "Dad") {
      const checkUserInReminder = await Reminder.find({ userId: userId });
      if (checkUserInReminder.length == 0) {
        return {
          completed: true,
          message: "Hiện tại bạn không có lịch cần nhắc nhở"
        }
      };
      const userReminders = await getReminderFollowUserId(reminders, userId);
      return {
        completed: true,
        message: "Success",
        data: userReminders
      };
    }
    return {
      completed: false,
      message: "User is not authorized."
    };
  } catch (error) {
    console.error(error);
  }
}

exports.getTreatmentRemindersByUserId = async (userId) => {
  try {
    if (!userId) {
      return {
        completed: false,
        message: "UserId is missing."
      };
    }
    const users = await User.find({ _id: userId });
    if (!users) {
      return {
        completed: false,
        message: "User not found."
      }
    };

    if (users[0].role === "Dad") {
      const reminders = await Reminder.find();
      console.log(reminders);
      if (reminders.length == 0) {
        return {
          completed: true,
          message: "Hiện tại các thành viên gia đình bạn không có lịch",
        };
      }
      const userReminders = await getAllReminders(reminders);
      if (userReminders.length == 0) {
        return {
          completed: true,
          message: "Success",

        };
      }
      return {
        completed: true,
        message: "Hiện tại các thành viên gia đình bạn không có lịch1"
      };

    }
    if (users[0].role !== "Dad") {
      const checkUserInReminder = await Reminder.find({ userId: userId });
      console.log(checkUserInReminder);
      if (checkUserInReminder.length == 0) {
        return {
          completed: true,
          message: "Hiện tại bạn không có lịch cần nhắc nhở"
        }
      };
      const userReminders = await getReminderFollowUserId(checkUserInReminder, userId);
      return {
        completed: true,
        message: "Success",
        data: userReminders
      };
    }

  } catch (error) {
    console.error('Error getting treatment reminders:', error);
    return {
      completed: false,
      message: "Failed to get treatment reminders."
    };
  }
}




const getAllReminders = async (getAllreminders) => {
  console.log(getAllreminders);
  const UserReminder = [];
  for (let reminder of getAllreminders) {
    console.log(reminder.userId);
    const user = await User.findById({ _id: reminder.userId });
    const username = user.username;
    const treatmentReminders = await TreatmentReminder.find({ reminderId: reminder._id }, { reminderId: 0, __v: 0 });

    UserReminder.push({ username: username, treatmentReminders: treatmentReminders });
  }
  return UserReminder
}

const getReminderFollowUserId = async (reminders, userId) => {
  const remindersWithMatchingUserId = [];
  for (let reminder of reminders) {
    if (reminder.userId.equals(userId)) {
      const user = await User.findById(userId);
      const username = user.username;
      const treatmentReminders = await TreatmentReminder.find({ reminderId: reminder._id }, { reminderId: 0, __v: 0 });

      remindersWithMatchingUserId.push({ username: username, treatmentReminders: treatmentReminders });
    }
  }
  return remindersWithMatchingUserId;
}



