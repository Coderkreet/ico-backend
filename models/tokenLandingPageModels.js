const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  // maxSupply: {
  //   type: Number,
  //   required: true,
  // },
  // totalSupply: {
  //   type: Number,
  //   required: true,
  // },
  // circulatingSupply: {
  //   type: Number,
  //   required: true,
  // },

  name: {
    type: String,
    default: 'XIO',
  },
  ticker: {
    type: String,
    default: 'XIO',
  },
  chain: {
    type: String,
    default: 'BNB',
  },
  description: {
    type: String,
    default: 'Our token distribution ensures a robust ecosystem...',
  },

  saleStart: {
    type: Date,
    required: true,
  },
  saleEnd: {
    type: Date,
    required: true,
  },
  tokensForSale: {
    type: Number,
    required: true,
  },

  exchangeRate: {
    type: String, // e.g. "1 USDT = 400 XIO | 1 BNB = 150 XIO"
    required: true,
  },

  minTransaction: {
    type: String, // "0.1 USDT / 0.1 BNB"
    required: true,
  },

  acceptedCurrencies: {
    type: [String],
    default: ['USDT', 'BNB'],
  },
  logoImage : {
    type: String,
  },
  title : {
    type: String,
  },
  subtitle : {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Token', TokenSchema);
