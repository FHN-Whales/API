const reminderController = require('../controllers/reminderController');
const express = require('express');

const ReminderRouter = express.Router();

ReminderRouter.post('/CreateTreatmentReminders', reminderController.CreateTreatmentReminders);



module.exports = ReminderRouter;
