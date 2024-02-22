const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    Username: { type: String, required: true },
    Avatar: { type: String, require: false, default: null},
    Role: { type: String, require: true },
    DateOfBirth: { type: Date, require: false, default: null },
    Gender: { type: String, require: false, default: null },
    Family_id: { type: Schema.Types.ObjectId, ref: 'Family' },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;