const notificationRepository = require('../repositories/notificationRepository');
const cron = require('node-cron');
const { firebase } = require('../config/firebase/firebase')


async function sendNotificationsForTodayReminders() {
  try {
    const { foundTreatmentReminders } = await notificationRepository.fetchRemindersContainingToday();
    console.log("foundTreatmentReminders: ", foundTreatmentReminders);
    if (foundTreatmentReminders.length == 0) {
      console.log("Khong co lich de notification");
      return {
        completed: true,
        message: "Hiện tại các thành viên gia đình bạn không có lịch",
      };
    }
    for (const treatmentReminder of foundTreatmentReminders) {
      const { _id, timeOfDay, treatmentTime, medications, noteTreatment, username, deviceToken } = treatmentReminder;

      let medicationsString = '';
      for (const medication of medications) {
        medicationsString += `   + ${medication.medicationName}: ${medication.dosage}, \n`;
      }
      medicationsString = medicationsString.slice(0, -3);
      console.log(medicationsString);
      const title = 'Treatment reminder | Hello ' + `${username}`;
      const body = `- Drinking time: ${treatmentTime}\n${medicationsString}\n- Note: ${noteTreatment}`;
      await sendNotificationToDevice(deviceToken, title, body);
      console.log(`Sent notification for treatment reminder at ${treatmentTime}`);
    }

    console.log('Notification sent successfully.');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}


async function sendNotificationToDevice(deviceToken, title, body) {
  try {
    console.log("deviceToken: ", deviceToken);
    const message = {
      notification: {
        title: title,
        body: body
      },
      token: deviceToken
    };

    const response = await firebase.messaging().send(message);
    console.log('Notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}
