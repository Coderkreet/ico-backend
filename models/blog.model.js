const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },            
  image: { type: String },
  textArea: [
    {
      textTitle: { type: String },
      textContent: { type: String },
    }
  ],
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
