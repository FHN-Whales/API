const authRouter = require("./authRouter")
const fileRouter = require("./fileRouter")

function route(app) {
    app.use('/auth', authRouter);
    // app.use('/file', fileRouter);

}

module.exports = route