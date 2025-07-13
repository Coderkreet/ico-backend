const mongoose = require('mongoose');

const ecosystemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cards: [
    {
      serialNumber: {
        type: Number,
        required: true
      },
      logo: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true, versionKey: false });

const EcosystemModel = mongoose.model('Ecosystem', ecosystemSchema);
module.exports = { EcosystemModel };
