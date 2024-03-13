const dotenv = require('dotenv');                                                                                                                                                                                  const connect = require('../config/database.js')
const notifController = require('../controllers/notificationController')
dotenv.configDotenv();
connect().then(() =>
    notifController.sendNotificationsForTodayReminders().then(() =>
        process.exit()
    )
);