const mongoose = require("mongoose")


const HeaderSliderSchema = new mongoose.Schema({
    images : [{
        type : String,
    }]

})
 module.exports = mongoose.model("HeaderSlider", HeaderSliderSchema);