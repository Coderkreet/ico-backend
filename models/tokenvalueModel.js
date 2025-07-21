// models/TokenPrice.js
const mongoose = require('mongoose');

const priceStages = [
  0.0015, 0.001571, 0.001643, 0.001714, 0.001786, 0.001857, 0.001929, 
  0.002, 0.002071, 0.002143, 0.002214, 0.002286, 0.002357, 0.002429, 0.0025
];

const TokenPriceSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  totalQuantity: {
    type: Number,   
    required: true,
    default: 3000000000 // 3 billion tokens
  },
  stage: {
    type: Number,
    required: true,
    default: 1  // Initial stage starts at 1
  },
  soldQuantity: {
    type: Number, 
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Logic to handle price increase after every stage (15 stages in total)
TokenPriceSchema.methods.updatePrice = function() {
  // Define the maximum number of stages (15 stages)
  const totalStages = 15;

  // Ensure the current stage doesn't exceed the total number of stages
  if (this.stage <= totalStages) {
    this.price = priceStages[this.stage - 1];  // Price is taken from the predefined array for the current stage
  }

  // Increase stage after 200 million tokens are sold
  const milestones = Math.floor(this.soldQuantity / 200000000);

  // Update the stage if milestones have been crossed and the stage is less than 15
  if (this.stage <= totalStages && milestones > this.stage - 1) {
    this.stage = milestones + 1;
  }

  // Ensure soldQuantity doesn't exceed totalQuantity (3 billion tokens)
  if (this.soldQuantity >= this.totalQuantity) {
    this.soldQuantity = this.totalQuantity;
  }

  // Update the updatedAt field every time the price or soldQuantity changes
  this.updatedAt = Date.now();
};

module.exports = mongoose.model('TokenValue', TokenPriceSchema);
