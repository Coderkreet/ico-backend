const mongoose = require('mongoose');

const LogoSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Logo', LogoSchema);
