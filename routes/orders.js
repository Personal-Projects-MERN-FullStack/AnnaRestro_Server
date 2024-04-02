const express = require("express");
const router = express.Router();
const Order = require("../models/Orders"); // Assuming your module is named 'orderModel'
const User = require("../models/Users");

router.post("/place-order", async (req, res) => {
  try {
    const { customer, products, total } = req.body;

    // console.log("Request Body:", req.body);

    // Find the user
    const user = await User.findById(customer);

    // console.log("User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has sufficient funds in the wallet
    console.log("User Wallet Coins Before Deduction:", user.wallet.coins);
    if (user.wallet.coins < total) {
      return res.status(400).json({ message: "Insufficient funds in wallet" });
    }

    // Deduct the total amount from the user's wallet
    user.wallet.coins -= total;
    await user.save();

    // console.log("User Wallet Coins After Deduction:", user.wallet.coins);

    // Create and save the order
console.log(products)
    const newOrder = new Order({ customer, products, total });
    // console.log("New Order:", newOrder);
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ message: err.message });
  }
});


// Route to fetch orders by customer id
router.get("/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const orders = await Order.find({ customer: customerId });
    // console.log(orders)
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update the status of an order
router.patch("/:orderId/update-status", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/:userId/add-to-basket", async (req, res) => {
  try {
    const userId = req.params.userId;
    const products = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(products.products)
    user.basket = products.products;
    await user.save();

    res.json(user.basket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/:userId/basket", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.basket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
