const mongoose = require('mongoose');

const tokenomicsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    percentage: {
        type: Number,
        required: true
    },
    tokenQuantity: {
        type: Number,
        required: true
    }
}, { timestamps: true, versionKey: false });

const TokenomicsModel = mongoose.model('Tokenomics', tokenomicsSchema);

module.exports = { TokenomicsModel };