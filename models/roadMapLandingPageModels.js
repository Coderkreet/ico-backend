const mongoose = require('mongoose');

const RoadMapSchema = new mongoose.Schema({
  milestone: {
    type: String,
    required: true,
  },
  quarter: {
    type: String,
    required: true,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],  // optional strict values
  },
  year: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'planned',
  },
  list: {
    type: [String], // This allows an array of strings
    default: [],
  }
}, { timestamps: true });

module.exports = mongoose.model('RoadMap', RoadMapSchema);
