const mongoose = require("mongoose")


const footerDescriptionSchema = new mongoose.Schema({
    description: { type: String, required: true },
})


module.exports = mongoose.model("FooterDescription", footerDescriptionSchema);
