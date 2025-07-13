const mongoose = require('mongoose');

const bitcoinStatsSchema = new mongoose.Schema({
  dailyLow: {
    type: Number,
    required: true,
  },
  dailyHigh: {
    type: Number,
    required: true,
  },
  weeklyLow: {
    type: Number,
    required: true,
  },
  weeklyHigh: {
    type: Number,
    required: true,
  },
}, { timestamps: true, versionKey: false });

const BitcoinStats = mongoose.model('BitcoinStats', bitcoinStatsSchema);
module.exports = BitcoinStats;
