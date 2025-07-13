const mongoose = require('mongoose');

const OverviewSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  topDescription : {
    type: String,
    required: true,
  },
  card :[
    {
      title : {
        type: String,
      },
      description : {
        type: String,
      },
      image : {
        type: String,
      }
    }
  ]
  
}, { timestamps: true });

module.exports = mongoose.model('Overview', OverviewSchema);
