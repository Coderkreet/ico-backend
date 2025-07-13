const mongoose = require("mongoose")

const termAndConditionSchema = new mongoose.Schema(
  {
    termCondition : [
        {
            title: {
             type: String,
            },
            description: {
             type: String,
            },
        }
    ]
   } , { timestamps: true }
);


module.exports = mongoose.model("TermAndCondition", termAndConditionSchema);