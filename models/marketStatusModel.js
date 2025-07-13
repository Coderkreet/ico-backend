const mongoose = require('mongoose');

const marketStatsSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  change24h: {
    type: Number,
    required: true,
  },
  marketCap: {
    type: String,
    required: true,
  },
  volume24h: {
    type: String,
    required: true,
  }
}, { timestamps: true, versionKey: false });

const MarketStatsModel = mongoose.model('MarketStats', marketStatsSchema);
module.exports = { MarketStatsModel };
