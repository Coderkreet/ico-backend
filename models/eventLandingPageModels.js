const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['event', 'upcoming', 'gallery'],
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
