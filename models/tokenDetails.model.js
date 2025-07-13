const mongoose = require('mongoose');


const tokenSchema = new mongoose.Schema({
    tokenName : {
        type: String
    },
    symbol : {
        type: String
    },
    decimals : {
        type: Number
    },
    address:{
        type: String
    },
    network: {
        type: String,
    },
})



module.exports = mongoose.model('TokenDetails', tokenSchema);