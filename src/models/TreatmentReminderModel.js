const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TreatmentReminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  frequency: { type: Number, required: true },
});


const TreatmentReminder = mongoose.model("TreatmentReminder", TreatmentReminderSchema);

module.exports = TreatmentReminder;