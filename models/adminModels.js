const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    picture: {
        type: String,
        default: null
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    otp: {
        type: String,
        default: null,
    },
    status: {
        type: Boolean,
        default: true
    },
});



const AdminModel = mongoose.model("admin", adminSchema);

module.exports = AdminModel