const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HealthCheckReminderSchema = new mongoose.Schema({
  reExaminationDate: { type: Date, required: true },
  reExaminationTime: { type: String, required: true },
  reExaminationLocation: { type: String, required: true },
  nameHospital: { type: String, required: true, },
  userNote: { type: String, required: false },
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },

});


const HealthCheck = mongoose.model("HealthChecks", HealthCheckReminderSchema);

module.exports = HealthCheck;