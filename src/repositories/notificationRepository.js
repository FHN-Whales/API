

// repositories/notificationRepository.js

const firebase = require('../config/firebase/firebase');

async function sendNotification(data) {
  const { deviceToken, title, body } = data;

  try {
    const message = {
      notification: {
        title: title,
        body: body
      },
      token: deviceToken
    };

    const response = await firebase.send(message);
    console.log('Notification sent successfully:', response);
    if (response) {
      return {
        completed: true,
        message: "Notification sent successfully",
        updateTreatmentReminder
      };
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

module.exports = {
  sendNotification
};
