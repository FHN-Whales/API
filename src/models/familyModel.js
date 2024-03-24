const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FamilySchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: false },
    verifyCode: { type: Number, required: false },
    verifyCodeExpires: { type: Date, default: null },
    status: { type: Boolean, default: false }
});

const Family = mongoose.model("Families", FamilySchema);

module.exports = Family;