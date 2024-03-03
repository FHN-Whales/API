const User = require('../models/userModel');
const Family = require("../models/familyModel")
const Reminder = require("../models/ReminderModel")
const TreatmentReminder = require("../models/TreatmentReminderModel")
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

    const { userId, startDate, endDate, frequency, timeOfDay, treatmentTime, medications } = data;

    if (!userId) {
      return {
        completed: false,
        message: "UserId is missing."
      };
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

exports.getAllTreatmentReminders = async () => {
  try {
    const allTreatmentReminders = await TreatmentReminder.find();

    if (allTreatmentReminders && allTreatmentReminders.length != 0) {
      return {
        completed: true,
        message: "All treatment reminders have been successfully retrieved.",
        data: allTreatmentReminders
      };
    } else if(allTreatmentReminders.length == 0) {
      return {
        completed: false,
        message: "All members are healthy so there are no calendar reminders"
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

exports.getTreatmentRemindersByUserId = async (userId) => {
  try {
    const reminders = await Reminder.find({ userId });

    const reminderIds = reminders.map(reminder => reminder._id);

    const treatmentReminders = await TreatmentReminder.find({ reminderId: { $in: reminderIds } });
    console.log();
    if (treatmentReminders && treatmentReminders.length != 0) {
      return {
        completed: true,
        message: "Treatment reminders have been successfully retrieved.",
        data: treatmentReminders
      };
    } else if (treatmentReminders.length == 0) {
      return {
        completed: false,
        message: "There are no calendar reminders"
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
