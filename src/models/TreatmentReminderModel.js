const mongoose = require('mongoose');
const { Schema } = mongoose;

const treatmentReminderSchema = new mongoose.Schema({

  timeOfDay: String,
  treatmentTime: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} không phải là định dạng thời gian hợp lệ!`
    }
  }, medications: [{
    medicationName: String,
    dosage: Number
  }],
  reminderId: { type: Schema.Types.ObjectId, ref: 'Reminders' },
});

const TreatmentReminder = mongoose.model('TreatmentReminders', treatmentReminderSchema);

module.exports = TreatmentReminder;
