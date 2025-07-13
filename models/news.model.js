const mongoose = require("mongoose")


const newsSchema = new mongoose.Schema({
    images : [{
        image : String,
        link : String
    }]

})
 module.exports = mongoose.model("News", newsSchema);