// Importing all required Librarires
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const JWT_SECRET = "Anna$Restro$Project";
const jwt = require("jsonwebtoken");

router.post("/Register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User Aleady Exist " });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({
      status: true,
      authtoken,
      user: { name: user.username, email: user, email },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("INTERNALE SERVER ERROR MANUAL");
  }
});
router.post(
  "/login",
  [
    body("email", "Enter the Valid Email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success,
          error: "User Not Exist Please Log in",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: "Please Check Credintails Again",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({
        success,
        authtoken,
        user: { name: user.name, email: user, email },
      });
    } catch (error) {}
  }
);

module.exports = router;
