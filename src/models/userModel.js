const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, require: false, default: null},
    role: { type: String, require: true },
    dateOfBirth: { type: Date, require: false, default: null },
    gender: { type: String, require: false, default: null },
    deviceToken: { type: String, require: false, default: null },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family' },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;