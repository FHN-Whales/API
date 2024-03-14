const notificationRepository = require('../repositories/notificationRepository');
const cron = require('node-cron');
const { firebase } = require('../config/firebase/firebase')
const http = require('http');

exports.sendNotificationsForTodayReminders = async () => {
  try {
    const { foundTreatmentReminders } = await notificationRepository.fetchRemindersContainingToday();
    if (foundTreatmentReminders.length == 0) {
      return {
        completed: true,
        message: "Hiện tại các thành viên gia đình bạn không có lịch"
      };
    }
    const now = new Date();
    const now_vietnam = new Date(now.getTime() + 7 * 3600000);
    for (const treatmentReminder of foundTreatmentReminders) {
      const { _id, timeOfDay, treatmentTime, medications, noteTreatment, username, deviceToken } = treatmentReminder;
      if (treatmentTime !== now_vietnam.toISOString().slice(11, 16)) {
        continue;
      }
      let medicationsString = '';
      for (const medication of medications) {
        medicationsString += `   + ${medication.medicationName}: ${medication.dosage}, \n`;
      }
      medicationsString = medicationsString.slice(0, -3);
      console.log(medicationsString);
      const title = 'Treatment reminder | Hello ' + `${username}`;
      const body = `- Drinking time: ${treatmentTime}\n${medicationsString}\n- Note: ${noteTreatment}`;
      await sendNotificationToDevice(deviceToken, title, body);
      await handleSendNotification(deviceToken, title, body)
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
const handleSendNotification = async (deviceToken, title, body) => {
  const request = require('request');
  const options = {
    method: 'POST',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      Authorization: 'key=AAAAIW-xU0Q:APA91bExpd0_CnejidHGRFqWmpXXMN_z2W1E_Ejhtljhf1rZrDGx_01Go_qdLJ7ZUbOxpTYu28nptRDJFpe6ftkquibSJszz-qFk94jgDsPpOzBVqcs0hMjlV8wYz9o1d9OziGUqkR7p',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      registration_ids: [deviceToken],
      notification: {
        title: title,
        body: body
      }
    })
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

