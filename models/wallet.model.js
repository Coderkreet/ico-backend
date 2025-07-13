const mogoose = require('mongoose');

const WalletSchema = new mogoose.Schema({
  rightTitle : { type: String },
  rightDescription: { type: String },
  leftTitle: { type: String },
  leftDescription: { type: String },
},{ timestamps: true });

module.exports = mogoose.model("Connectallet", WalletSchema);
