 const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
  subject: {
    type: String,
    required: true,
    trim:true
  },
  message: {
    type: String,
    required: true,
    trim:true

  },
  status: {
    type: String,
    default: "Pending",
  },
  response: {
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Support", supportSchema);
