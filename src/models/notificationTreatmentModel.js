const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationsTreatmentReminderSchema = new mongoose.Schema({

  treatmentTime: String,
  medications: [{
    medicationName: String,
    dosage: Number
  }],
  noteTreatment: { type: String, default: null },
  username: { type: String, required: true },
  deviceToken: { type: String, require: false, default: null },
  userId:  { type: Schema.Types.ObjectId, ref: 'Users' },
});

const NotificationsTreatment = mongoose.model('NotificationsTreatment', NotificationsTreatmentReminderSchema);

module.exports = NotificationsTreatment;
