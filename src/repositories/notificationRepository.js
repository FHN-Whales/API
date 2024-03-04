
const Reminder = require("../models/ReminderModel")
const TreatmentReminder = require("../models/TreatmentReminderModel")

async function fetchRemindersContainingToday() {
  try {
    const today = new Date();

    const reminders = await Reminder.find({
      startDate: { $lte: today },
      endDate: { $gte: today }
    }).select('_id');
    if (reminders.lenght == 0) {
      return {
        completed: true,
        message: "There is no calendar for reminders"
      };
    }
    const modifiedReminders = reminders.map(reminder => {
      return { reminderId: reminder._id };
    });

    const out = await fetchTreatmentRemindersByReminderIds(modifiedReminders)
    return out
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
    // const treatmentTimes = treatmentReminders.map(reminder => reminder.treatmentTime);
    // console.log(treatmentTimes);
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

