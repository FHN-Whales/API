const User = require('../models/userModel');
const Family = require("../models/familyModel")
const TreatmentReminder = require("../models/TreatmentReminderModel")
const TimeSlot = require("../models/TimeSlotModel")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.configDotenv()


exports.CreateTreatmentReminders = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      return {
        completed: false,
        message: "Data is not provided."
      };
    }

    const { userId, startDate, endDate, frequency, timeOfDay, treatmentTime, medications } = data;

    if (!userId) {
      return {
        completed: false,
        message: "UserId is missing."
      };
    }

    if (!startDate) {
      return {
        completed: false,
        message: "startDate cannot be left blank."
      };
    }

    if (!endDate) {
      return {
        completed: false,
        message: "endDate cannot be left blank."
      };
    }

    if (!frequency) {
      return {
        completed: false,
        message: "frequency cannot be left blank."
      };
    }

    if (!timeOfDay) {
      return {
        completed: false,
        message: "timeOfDay cannot be left blank."
      };
    }

    if (!treatmentTime) {
      return {
        completed: false,
        message: "treatmentTime cannot be left blank."
      };
    }

    if (!medications || medications.length === 0) {
      return {
        completed: false,
        message: "medications cannot be left blank."
      };
    }

    const newTreatmentReminder = await TreatmentReminder.create({ userId, startDate, endDate, frequency });

    const remindTreatmentRemindererId = newTreatmentReminder._id;

    // Đảm bảo cả hai mảng có cùng độ dài
    if (timeOfDay.length !== treatmentTime.length) {
      return {
        completed: false,
        message: "Invalid data: timeOfDay and treatmentTime arrays must have the same length.",
      };
    }
    for (let i = 0; i < timeOfDay.length; i++) {
      const timeOfDayItem = timeOfDay[i];
      const treatmentTimeItem = treatmentTime[i];
      const newTimeSlotSchedule = await TimeSlot.create({
        remindTreatmentRemindererId,
        timeOfDay: timeOfDayItem,
        treatmentTime: treatmentTimeItem,
        medications
      });
    }
    return {
      completed: true,
      message: "Data has been successfully added.",
    };
  } catch (error) {
    console.error('Error when adding data:', error);
    return {
      completed: false,
      message: "Failed to register user: " + error.message
    };
  }
}
