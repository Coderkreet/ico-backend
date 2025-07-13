const mongoose = require('mongoose');

const ourProductSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    cards: [
      {
        url: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('OurProduct', ourProductSchema);

