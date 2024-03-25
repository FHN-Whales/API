const reminderRepository = require('../repositories/reminderRepository');

exports.CreateTreatmentReminders = async (req, res) => {
  try {
    const CreateTreatmentReminders = await reminderRepository.CreateTreatmentReminders(req.body);
    return res.json(CreateTreatmentReminders)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}

exports.GetTreatmentReminderByTreatmentId = async (req, res) => {
  try {
    const treatmentId = req.params.treatmentId;
    const getTreatmentReminderByTreatmentId = await reminderRepository.getTreatmentReminderByTreatmentId(treatmentId);
    return res.json(getTreatmentReminderByTreatmentId)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}

exports.EditTreatmentReminders = async (req, res) => {
  try {
    const treatmentId = req.params.treatmentId
    const dataTreatmentReminder = req.body
    const updateTreatmentReminders = await reminderRepository.editTreatmentReminders(treatmentId, dataTreatmentReminder);
    return res.json(updateTreatmentReminders)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}


exports.deleteTreatmentReminders = async (req, res) => {
  try {
    const treatmentReminderId = req.params.treatmentReminderId
    const deleteTreatmentReminder = await reminderRepository.deleteTreatmentReminder(treatmentReminderId);
    return res.json(deleteTreatmentReminder)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}


// exports.getAllTreatmentReminders = async (req, res) => {
//   try {
//     const getAllTreatmentReminder = await reminderRepository.getAllTreatmentReminders(req.params.id);
//     return res.json(getAllTreatmentReminder)
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).json({ error: error.message });
//   }
// }

exports.getTreatmentRemindersByUserId = async (req, res) => {
  try {
    const familyId = req.params.familyId;
    const userId = req.params.userId;
    const getTreatmentReminderByUserId = await reminderRepository.getTreatmentRemindersByUserId(familyId, userId);
    return res.json(getTreatmentReminderByUserId)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}

exports.getRemindersByYearMonthDay = async (req, res) => {
  try {
    const date = req.params.date;
    const familyId = req.params.familyId;
    const userId = req.params.userId;
    const getTreatmentReminderByUserId = await reminderRepository.getRemindersByYearMonthDay(date, familyId, userId);
    return res.json(getTreatmentReminderByUserId)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}

// HEALTH CHECK

exports.CreateHealthCheck = async (req, res) => {
  try {
    const CreateHealthCheckReminder = await reminderRepository.CreateHealthCheck(req.body);
    return res.json(CreateHealthCheckReminder);
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json({ error: error.message })
  }
}

exports.EditHealthCheck = async (req, res) => {
  try {
    const healthCheckId = req.params.healthCheckId;
    const newDataHealthCheck = req.body
    const EditHealthCheckReminder = await reminderRepository.EditHealthCheck(healthCheckId, newDataHealthCheck);
    return res.json(EditHealthCheckReminder);
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json({ error: error.message })
  }
}

exports.DeleteHealthCheck = async (req, res) => {
  try {
    const healthCheckId = req.params.healthCheckId;
    const DeleteHealthCheckReminder = await reminderRepository.DeleteHealthCheck(healthCheckId);
    return res.json(DeleteHealthCheckReminder);
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json({ error: error.message })
  }
}

exports.getAllHealthCheckReminderToday = async (req, res) => {
  try {
    const familyId = req.params.familyId;
    const userId = req.params.userId;
    const GetHealthCheckReminnders = await reminderRepository.GetHealthCheckReminder(familyId, userId)
    return res.json(GetHealthCheckReminnders)
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: error.message })
  }
}
exports.getHealthCheckReminderById = async (req, res) => {
  try {
    const healthCheckId = req.params.healthCheckId;
    const GetHealthCheckReminnderById = await reminderRepository.GetHealthCheckReminderById(healthCheckId)
    return res.json(GetHealthCheckReminnderById)
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: error.message })
  }
}



