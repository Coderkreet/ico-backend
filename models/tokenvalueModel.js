// models/TokenPrice.js
const mongoose = require('mongoose');

const TokenPriceSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TokenValue', TokenPriceSchema);
