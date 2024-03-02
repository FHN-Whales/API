const authRouter = require("./authRouter")
const fileRouter = require("./fileRouter")
const reminderRouter = require("./reminderRouter")
const notificationRouter = require("./notificationRouter")


function route(app) {
    app.use('/auth', authRouter);
    app.use('/Reminder', reminderRouter);
    app.use('/Notification', notificationRouter);


    
    // app.use('/file', fileRouter);
}

module.exports = route