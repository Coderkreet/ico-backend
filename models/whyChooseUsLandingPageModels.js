const mongoose = require('mongoose');

const WhyChooseUsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('WhyChooseUs', WhyChooseUsSchema);
