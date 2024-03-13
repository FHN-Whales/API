const reminderController = require('../controllers/reminderController');
const express = require('express');

const ReminderRouter = express.Router();

// ReminderRouter.get('/getAllTreatmentReminders', reminderController.getAllTreatmentReminders);
ReminderRouter.get('/getTreatmentRemindersByUserId/:familyId/:userId', reminderController.getTreatmentRemindersByUserId);
ReminderRouter.post('/CreateTreatmentReminders', reminderController.CreateTreatmentReminders);
ReminderRouter.put('/UpdateTreatmentReminders', reminderController.updateTreatmentReminders);
ReminderRouter.delete('/DeleteTreatmentReminders/:id', reminderController.deleteTreatmentReminders);
ReminderRouter.get('/getRemindersTreatmentRemindersByYearMonthDay/:date/:familyId/:userId', reminderController.getRemindersTreatmentRemindersByYearMonthDay);
ReminderRouter.post('/CreateHealthCheckReminder', reminderController.CreateHealthCheck);







module.exports = ReminderRouter;
