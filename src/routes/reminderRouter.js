const reminderController = require('../controllers/reminderController');
const express = require('express');

const ReminderRouter = express.Router();

ReminderRouter.get('/getAllTreatmentReminders', reminderController.getAllTreatmentReminders);
ReminderRouter.get('/getTreatmentRemindersByUserId/:id', reminderController.getTreatmentRemindersByUserId);
ReminderRouter.post('/CreateTreatmentReminders', reminderController.CreateTreatmentReminders);
ReminderRouter.put('/UpdateTreatmentReminders', reminderController.updateTreatmentReminders);
ReminderRouter.delete('/DeleteTreatmentReminders/:id', reminderController.deleteTreatmentReminders);
ReminderRouter.get('/GetAllTreatmentRemindersByYearMonthDay', reminderController.getAllTreatmentRemindersByYearMonthDay);






module.exports = ReminderRouter;
