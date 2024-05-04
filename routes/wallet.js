const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { jwtAuthMiddleware } = require("../middleware/jwt");
const razorpay = require('razorpay');
const instance = new razorpay({
  key_id: 'rzp_test_Fi0R6nv5oCjMYn',
  key_secret: 'lMpeU8yGQkaoAnnCW4JOhjeh' 
});

// Add money to wallet

router.post("/addmoney/:userId", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const amount = req.body.amount;
    const razorpay_payment_id = req.body.razorpay_payment_id;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Fetch payment details from Razorpay
    const payment = await instance.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'authorized') {
      return res.status(400).json({ message: "Payment not successful" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the payment ID already exists in the transactions array
    const existingPayment = user.wallet.transactions.find(transaction => transaction.payment_id === razorpay_payment_id);
    if (existingPayment) {
      return res.status(400).json({ message: "Duplicate payment" });
    }

    // Update user's wallet balance
    user.wallet.coins += amount;

    // Add transaction log data
    user.wallet.transactions.push({
      payment_id: razorpay_payment_id,
      amount: amount,
      status: payment.status,
      timestamp: new Date()
    });

    const updatedUser = await user.save();
    // console.log(req.body, updatedUser);
    res.json(updatedUser);
  } catch (err) {
    console.error('Error adding money:', err);
    res.status(500).json({ message: err.message });
  }
});

// Activate wallet and set PIN
router.put("/activate/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const pin = req.body.pin;

    // Check if pin is a 4-digit number
    if (!pin || isNaN(pin) || pin.toString().length !== 4) {
      return res.status(400).json({ message: "PIN must be a 4-digit number" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wallet.active = true;
    user.wallet.pin = pin;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/:userId",jwtAuthMiddleware ,async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const walletDetails = user.wallet;
    res.json(walletDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
