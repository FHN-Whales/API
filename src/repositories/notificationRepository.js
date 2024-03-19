
const Reminder = require("../models/ReminderModel")
const TreatmentReminder = require("../models/TreatmentReminderModel")
const User = require('../models/userModel');
const HealthCheck = require('../models/healthCheckReminderModel');
const NotificationsTreatment = require('../models/notificationTreatmentModel')
const NotificationsHealth = require('../models/notificationHealthModel')


async function fetchRemindersContainingToday() {

  try {
    const today = new Date();

    const getYearMonthDayOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const reminders = await Reminder.find();
    let foundReminders = [];
    reminders.forEach((Reminder) => {
      const startDate = new Date(Reminder.startDate);
      const endDate = new Date(Reminder.endDate);

      const getYearMonthDayOfstartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1);
      const getYearMonthDayOfendDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1);
      if (getYearMonthDayOfToday >= getYearMonthDayOfstartDate && getYearMonthDayOfToday <= getYearMonthDayOfendDate) {
        foundReminders.push({ ReminderId: Reminder._id, userId: Reminder.userId });
      } else {

      }
    });
    const out = await fetchTreatmentRemindersByReminderIds(foundReminders)
    return out
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhắc nhở:', error);
    throw error;
  }
}


async function fetchTreatmentRemindersByReminderIds(foundReminders) {
  try {
    let foundTreatmentReminders = [];
    let foundHealthChecks = [];

    for (const reminder of foundReminders) {
      const { ReminderId, userId } = reminder;

      const treatmentReminder = await TreatmentReminder.findOne({ reminderId: ReminderId });

      const user = await User.findById({ _id: userId }).select('username deviceToken')

      if (treatmentReminder && user) {
        const combinedInfo = {
          _id: treatmentReminder._id,
          timeOfDay: treatmentReminder.timeOfDay,
          treatmentTime: treatmentReminder.treatmentTime,
          medications: treatmentReminder.medications,
          noteTreatment: treatmentReminder.noteTreatment,
          username: user.username,
          deviceToken: user.deviceToken,
          userId: userId
        };
        foundTreatmentReminders.push(combinedInfo);
      }
      const healthCheck = await HealthCheck.findOne({ userId });

      if (healthCheck && user) {
        const combinedInfoHealthCheck = {
          _id: healthCheck._id,
          reExaminationDate: healthCheck.reExaminationDate,
          reExaminationTime: healthCheck.reExaminationTime,
          reExaminationLocation: healthCheck.reExaminationLocation,
          nameHospital: healthCheck.nameHospital,
          userNote: healthCheck.userNote,
          username: user.username,
          deviceToken: user.deviceToken,
          userId: userId
        };
        foundHealthChecks.push(combinedInfoHealthCheck);
      }
    }
    console.log("foundTreatmentReminders:", foundTreatmentReminders);
    console.log("foundTreatmentReminders:", foundHealthChecks);

    return {
      foundTreatmentReminders,
      foundHealthChecks
    };
  } catch (error) {
    console.error('Error fetching treatment reminders by reminder IDs:', error);
    throw error;
  }
}

const getNotifications = async (userId) => {
  try {
    const treatmentNotifications = await NotificationsTreatment.find({ userId: userId });

    const healthNotifications = await NotificationsHealth.find({ userId: userId });


    const combinedNotifications = {
      treatmentNotifications: [...treatmentNotifications],
      healthNotifications: [...healthNotifications]
    };
    if (combinedNotifications.length === 0) {
      return {
        completed: true,
        message: "You currently have no calendars that need reminders"
      }
    }
    return {
      completed: true,
      message: "You currently have no calendars that need reminders",
      dataNotifications: combinedNotifications
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

module.exports = {
  fetchRemindersContainingToday,
  getNotifications
};

