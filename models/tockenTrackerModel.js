const mongoose = require('mongoose');

const tokenTrackerSchema = new mongoose.Schema({
    totalHolders: {
        type: Number,
        required: true
    },
    holdersChange: {
        type: String,
        default: null
    },
    totalTransactions: {
        type: Number,
        required: true
    },
    transactionsChange: {
        type: String,
        default: null
    },
    circulatingSupply: {
        type: Number,
        required: true
    },
    totalSupply: {
        type: Number,
        required: true
    },
     BurnedToken: {
        type: Number,
        required: true
    },
    maxSupply: {
        type: Number,
    },
}, { timestamps: true, versionKey: false });

const TokenTrackerModel = mongoose.model('TokenTracker', tokenTrackerSchema);
module.exports = { TokenTrackerModel };