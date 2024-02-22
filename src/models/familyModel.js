const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FamilySchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    verifyCode: { type: Number, required: true },
    verifyCodeExpires: { type: Date, default: null },
    status: { type: Boolean, default: false }
});

const Family = mongoose.model("Families", FamilySchema);

module.exports = Family;