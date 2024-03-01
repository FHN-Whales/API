const reminderController = require('../controllers/reminderController');
const express = require('express');

const ReminderRouter = express.Router();

ReminderRouter.post('/CreateTreatmentReminders', reminderController.CreateTreatmentReminders);
ReminderRouter.push('/UpdateTreatmentReminders', reminderController.updateTreatmentReminders);
ReminderRouter.delete('/DeleteTreatmentReminders/:id', reminderController.deleteTreatmentReminders);





module.exports = ReminderRouter;
