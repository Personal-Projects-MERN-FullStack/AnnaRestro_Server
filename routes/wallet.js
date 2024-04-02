const express = require('express');
const router = express.Router();
const User = require("../models/Users");

// Add money to wallet
router.post('/addmoney/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const amount = req.body.amount;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wallet.coins += amount;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Activate wallet and set PIN
router.put('/activate/:userId', async (req, res) => {
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
router.get('/:userId', async (req, res) => {
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
