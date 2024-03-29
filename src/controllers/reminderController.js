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

exports.updateTreatmentReminders = async (req, res) => {
  try {
    const updateTreatmentReminders = await reminderRepository.updateTreatmentReminders(req.body);
    return res.json(updateTreatmentReminders)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}


exports.deleteTreatmentReminders = async (req, res) => {
  try {
    const deleteTreatmentReminder = await reminderRepository.deleteTreatmentReminder(req.params.id);
    return res.json(deleteTreatmentReminder)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}


exports.getAllTreatmentReminders = async (req, res) => {
  try {
    const getAllTreatmentReminder = await reminderRepository.getAllTreatmentReminders(req.params.id);
    return res.json(getAllTreatmentReminder)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}

exports.getTreatmentRemindersByUserId = async (req, res) => {
  try {
    const getTreatmentReminderByUserId = await reminderRepository.getTreatmentRemindersByUserId(req.params.id);
    return res.json(getTreatmentReminderByUserId)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}


