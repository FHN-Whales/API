const mongoose = require('mongoose');
const { Schema } = mongoose;

const treatmentReminderSchema = new mongoose.Schema({

  timeOfDay: String,
  treatmentTime: String,
  medications: [{
    medicationName: String,
    dosage: Number
  }],
  reminderId: { type: Schema.Types.ObjectId, ref: 'Reminders' },
});

const TreatmentReminder = mongoose.model('TreatmentReminders', treatmentReminderSchema);

module.exports = TreatmentReminder;
