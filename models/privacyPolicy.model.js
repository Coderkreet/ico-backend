const mongoose = require("mongoose")

const privacyPolicySchema = new mongoose.Schema(
  {
    privacyPolicy : [
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


module.exports = mongoose.model("PrivacyPolicy", privacyPolicySchema);