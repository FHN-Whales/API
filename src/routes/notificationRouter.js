const notificationController = require('../controllers/notificationController');
const express = require('express');

const NotificationRouter = express.Router();

NotificationRouter.get('/getNotifications', notificationController.getNotifications);



module.exports = NotificationRouter;
