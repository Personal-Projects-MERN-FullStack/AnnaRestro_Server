const express = require('express');
const router = express.Router();
const Order = require('../models/Orders'); // Assuming your module is named 'orderModel'
const User = require("../models/Users");


// Route to place a new order
router.post('/place-order', async (req, res) => {
  try {
    const { customer, products, total } = req.body;
    const newOrder = new Order({ customer, products, total });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to fetch orders by customer id
router.get('/:customerId', async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const orders = await Order.find({ customer: customerId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update the status of an order
router.patch('/:orderId/update-status', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/:userId/add-to-basket', async (req, res) => {
  try {
    const userId = req.params.userId;
    const products = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // console.log(products.products)
    user.basket = products.products
    await user.save();

    res.json(user.basket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:userId/basket', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.basket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
