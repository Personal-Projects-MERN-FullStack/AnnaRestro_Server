const mongoose = require("mongoose");

// Define breakfast product schema
const breakfastProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productQty: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  nutrientsItems: {
    type: [String],
    required: true,
  },
  typeOfMenu: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

// Create breakfast product model
const BreakfastProduct = mongoose.model("Menu", breakfastProductSchema);

module.exports = BreakfastProduct;
