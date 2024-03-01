const authRouter = require("./authRouter")
const fileRouter = require("./fileRouter")
const reminderRouter = require("./reminderRouter")


function route(app) {
    app.use('/auth', authRouter);
    app.use('/Reminder', reminderRouter);
    
    // app.use('/file', fileRouter);
}

module.exports = route