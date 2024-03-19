const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationsHealthSchema = new mongoose.Schema({
  reExaminationDate: { type: Date, required: true },
  reExaminationTime: { type: String, required: true },
  reExaminationLocation: { type: String, required: true },
  nameHospital: { type: String, required: true, },
  userNote: { type: String, required: false },
  username: { type: String, required: true },
  deviceToken: { type: String, require: false, default: null },
  userId:  { type: Schema.Types.ObjectId, ref: 'Users' },
});


const NotificationsHealth = mongoose.model("NotificationsHealth", NotificationsHealthSchema);

module.exports = NotificationsHealth;