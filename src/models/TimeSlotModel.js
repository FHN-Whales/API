const mongoose = require('mongoose');
const { Schema } = mongoose;

const TimeSlotSchema = new mongoose.Schema({
  timeOfDay: String,
  treatmentTime: String,
  medications: [{
    medicationName: String,
    dosage: String
  }]
});

const TimeSlot= mongoose.model('TimeSlotSchedule', TimeSlotSchema);

module.exports = TimeSlot;
