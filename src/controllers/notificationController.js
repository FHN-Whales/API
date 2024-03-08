const notificationRepository = require('../repositories/notificationRepository');
const cron = require('node-cron');
const { firebase } = require('../config/firebase/firebase')
exports.gettimenow = async (req, res) => {
  try {
    const sendNotification = await notificationRepository.fetchRemindersContainingToday();
    res.status(200).json(sendNotification);
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
}

async function sendNotificationsForTodayReminders() {
  try {
    const { treatmentReminders } = await notificationRepository.fetchRemindersContainingToday();

    for (const treatmentReminder of treatmentReminders) {
      const { _id, timeOfDay, treatmentTime, medications } = treatmentReminder;

      const deviceToken = 'f1hXotwnQkC1mZftrJSdXm:APA91bFjOxFiuHKnUXDElazBu2WNXAiqRzKaBn-JVQUuY2qEqcGNKJfq0tWof31LsIACGJfL_VuKeYSpCrnRcZerxkRG0nZ5_fIKoC5vQjUqGMR-Mk-A-kVyu1rhYAvmBlDkQr4K99Ia'; 
      const title = 'Treatment reminder';
      const body = `Treatment time: ${treatmentTime}`;
      await sendNotificationToDevice(deviceToken, title, body);
      console.log(`Sent notification for treatment reminder at ${treatmentTime}`);
    }

    console.log('Notification sent successfully.');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}


// cron.schedule('00 23 * * *', () => {
//   sendNotificationsForTodayReminders();
//   console.log('Công việc được lên lịch để gửi thông báo cho những nhắc nhở trong ngày.');
// });



setTimeout(() => {
  sendNotificationsForTodayReminders();
  console.log('Đã gửi thông báo cho những nhắc nhở trong ngày.');
}, 2000);



async function sendNotificationToDevice(deviceToken, title, body) {
  try {
    console.log("deviceToken: ",deviceToken);
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
