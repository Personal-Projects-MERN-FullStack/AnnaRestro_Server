const mongoose = require("mongoose");

// Define order change state log schema
const orderChangeStateLogSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  previousState: {
    type: String,
    required: true,
  },
  newState: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  changedByAdmin: {
    type: String,
    required : true,
  },
  notes: {
    type: String,
  },
});

// Create order change state log model
const OrderChangeStateLog = mongoose.model("OrderChangeStateLog", orderChangeStateLogSchema);

module.exports = OrderChangeStateLog;
