
const Reminder = require("../models/ReminderModel")
const TreatmentReminder = require("../models/TreatmentReminderModel")
const User = require('../models/userModel');

async function fetchRemindersContainingToday() {

  try {
    const today = new Date();

    const getYearMonthDayOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    console.log(getYearMonthDayOfToday);

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
    for (const reminder of foundReminders) {
      const { ReminderId, userId } = reminder;

      const treatmentReminder = await TreatmentReminder.findOne({ reminderId: ReminderId });

      const user = await User.findById({ _id: userId }).select('username deviceToken');
      console.log(treatmentReminder);
      console.log(user);

      if (treatmentReminder && user) {
        const combinedInfo = {
          _id: treatmentReminder._id,
          timeOfDay: treatmentReminder.timeOfDay,
          treatmentTime: treatmentReminder.treatmentTime,
          medications: treatmentReminder.medications,
          noteTreatment: treatmentReminder.noteTreatment,
          username: user.username,
          deviceToken: user.deviceToken
        };
        foundTreatmentReminders.push(combinedInfo);
      } else {
        return {
          completed: true,
          message: "Hiện tại các thành viên gia đình bạn không có lịch",
        };
      }
    }
    return {
      foundTreatmentReminders,
    };
  } catch (error) {
    console.error('Error fetching treatment reminders by reminder IDs:', error);
    throw error;
  }
}


module.exports = {
  fetchRemindersContainingToday
};

