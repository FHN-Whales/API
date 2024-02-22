const authRouter = require("./authRouter")

function route(app) {
    app.use('/auth', authRouter);
}

module.exports = route