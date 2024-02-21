const express = require('express');
const router = express.Router();
const BreakfastProduct = require("../models/Menu")

router.post('/addmenu', async (req, res) => {
    try {
      const newMenuItem = await BreakfastProduct.create(req.body);
      res.json(newMenuItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Fetch all menu items
  router.get('/getmenu', async (req, res) => {
    try {
      const menuItems = await BreakfastProduct.find();
      res.json(menuItems);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update a menu item
  router.put('/:id', async (req, res) => {
    try {
      const updatedMenuItem = await BreakfastProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedMenuItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  module.exports = router;