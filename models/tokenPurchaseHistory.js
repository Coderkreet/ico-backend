// models/TokenPurchase.js
const mongoose = require("mongoose");

const tokenPurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Userdetail',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  valueInUSDT: {
    type: Number,
    required: true,
  },
  tokenPriceAtPurchase: {
    type: Number,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("TokenPurchase", tokenPurchaseSchema);
