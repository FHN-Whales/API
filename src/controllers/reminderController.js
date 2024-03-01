const reminderRepository = require('../repositories/reminderRepository');

exports.CreateTreatmentReminders = async (req, res) => {
  try {
    const MedicationReminders = await reminderRepository.CreateTreatmentReminders(req.body);
    return res.json(MedicationReminders)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}


