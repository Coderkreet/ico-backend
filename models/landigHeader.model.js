const mongoose = require('mongoose');



const LandingHeaderSchema = new mongoose.Schema({
  headerTitle: { type: String },
  subTitle: { type: String },
  navLogo: { type: String },
  logoImage: { type: String },
  staticImage: { type: String },
  lightPaper: { type: String },
  whitePaper: { type: String },
  description: { type: String },
  auditReport: { type: String },
  solidProof: { type: String },
  onePager: { type: String },
  sideLogo: { type: String },
  sideLogoTitle: { type: String },

});

module.exports = mongoose.model("LandingHeader", LandingHeaderSchema);
