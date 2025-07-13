const mongoose = require("mongoose");


const ListedPlatformSchema = new mongoose.Schema({
    platformName: { type: String, required: true },
    platforms:[
        {
            image: { type: String, required: true },
            title: { type: String, required: true }, 
            link : { type: String, required: true }
        }
    ],
   
    createdAt: { type: Date, default: Date.now }
});

const ListedPlatform = mongoose.model("ListedPlatform", ListedPlatformSchema);

module.exports = ListedPlatform;
