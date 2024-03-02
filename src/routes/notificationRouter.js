const notificationController = require('../controllers/notificationController');
const express = require('express');

const NotificationRouter = express.Router();

NotificationRouter.post('/SendNotificationOutappp', notificationController.sendPushNotification);



module.exports = NotificationRouter;
