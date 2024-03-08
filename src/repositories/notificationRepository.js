
const Reminder = require("../models/ReminderModel")
const TreatmentReminder = require("../models/TreatmentReminderModel")

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
        foundReminders.push({ _id: reminder._id, userId: reminder.userId });
      } else {
        console.log("Ngày hôm nay không nằm trong khoảng thời gian của reminder này.");
      }
    });

    console.log("foundReminders",foundReminders);


    // const reminders = await Reminder.find({
    //   startDate: { $lte: today },
    //   endDate: { $gte: today }
    // }).select('_id userId');

    // console.log(reminders);

    // if (reminders.lenght == 0) {
    //   return {
    //     completed: true,
    //     message: "There is no calendar for reminders"
    //   };
    // }


    // const out = await fetchTreatmentRemindersByReminderIds(modifiedReminders)
    // return out
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhắc nhở:', error);
    throw error;
  }
}


async function fetchTreatmentRemindersByReminderIds(modifiedReminders) {
  try {
    const reminderIds = modifiedReminders.map(reminder => reminder.reminderId);

    const treatmentReminders = await TreatmentReminder.find({
      reminderId: { $in: reminderIds }
    }).select('_id timeOfDay treatmentTime medications.medicationName medications.dosage');
    return {
      treatmentReminders,
    };
  } catch (error) {
    console.error('Error fetching treatment reminders by reminder IDs:', error);
    throw error;
  }
}


module.exports = {
  fetchRemindersContainingToday
};

