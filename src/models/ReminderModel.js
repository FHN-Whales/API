const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReminderSchema = new mongoose.Schema({
  userId:  { type: Schema.Types.ObjectId, ref: 'Users' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  frequency: { type: Number, required: true },
});


const Reminder = mongoose.model("Reminders", ReminderSchema);

module.exports = Reminder;