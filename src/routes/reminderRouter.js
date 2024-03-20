const reminderController = require('../controllers/reminderController');
const express = require('express');

const ReminderRouter = express.Router();

// ReminderRouter.get('/getAllTreatmentReminders', reminderController.getAllTreatmentReminders);
ReminderRouter.get('/getTreatmentRemindersByUserId/:familyId/:userId', reminderController.getTreatmentRemindersByUserId);
ReminderRouter.post('/CreateTreatmentReminders', reminderController.CreateTreatmentReminders);
ReminderRouter.get('/GetTreatmentRemindersbyTreatmentId/:treatmentId', reminderController.GetTreatmentReminderByTreatmentId);
ReminderRouter.put('/EditTreatmentReminders/:treatmentId', reminderController.EditTreatmentReminders);
ReminderRouter.delete('/DeleteTreatmentReminders/:treatmentReminderId', reminderController.deleteTreatmentReminders);
ReminderRouter.get('/getRemindersTreatmentRemindersByYearMonthDay/:date/:familyId/:userId', reminderController.getRemindersTreatmentRemindersByYearMonthDay);
ReminderRouter.post('/CreateHealthCheckReminder', reminderController.CreateHealthCheck);
ReminderRouter.put('/EditHealthCheckReminder/:healthCheckId', reminderController.EditHealthCheck);
ReminderRouter.delete('/DeleteHealthCheckReminder/:healthCheckId', reminderController.DeleteHealthCheck);
ReminderRouter.get('/getHealthCheckRemindersByUserId/:familyId/:userId', reminderController.getAllHealthCheckReminderToday);
ReminderRouter.get('/getHealthCheckRemindersByHealthCheckId/:healthCheckId', reminderController.getHealthCheckReminderById);



module.exports = ReminderRouter;
