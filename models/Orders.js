const mongoose = require('mongoose');

// Define the schema for orders
const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  products: [{
    productName: String,
    productQty: Number,
    price: Number,
    imageUrl: String,
    nutrientsItems: [String],
    typeOfMenu: String
    // Add more fields as needed
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
