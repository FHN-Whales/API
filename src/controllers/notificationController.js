const notificationRepository = require('../repositories/notificationRepository');


exports.sendPushNotification = async (req, res) => {
  try {
    const sendNotification = await notificationRepository.sendNotification(req.body);
    res.status(200).json(sendNotification);
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
}
