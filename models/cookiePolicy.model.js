const mongoose = require("mongoose")

const cookiePolicySchema = new mongoose.Schema(
  {
    cookiePolicy : [
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


module.exports = mongoose.model("CookiePolicy", cookiePolicySchema);