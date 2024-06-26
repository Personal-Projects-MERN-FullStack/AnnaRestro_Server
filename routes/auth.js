// Importing all required Librarires
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const User = require("../models/Users");
const Admin = require("../models/Admin");
const Sadmin = require("../models/Sadmin");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const  {jwtAuthMiddleware, generateToken} = require("../middleware/jwt")
const  {adminjwtAuthMiddleware, admingenerateToken} = require("../middleware/adminjwt")

router.post("/Register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User Already Exists" });
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
        username:user.username,
        email:user.email
      },
    };
    // const authtoken = jwt.sign(data, JWT_SECRET);
    const authtoken = generateToken(data)
    res.json({
      status: true,
      authtoken,
      user: { name: user.username, email: user.email, id: user.id },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("INTERNAL SERVER ERROR");
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
          username :user.username,
          email:user.email
        },
      };
      // const authtoken = jwt.sign(data, JWT_SECRET);
      const authtoken = generateToken(data)
      success = true;
      res.json({
        success,
        authtoken,
        user: { name: user.username, email: user, email ,id:user.id},
      });
    } catch (error) {}
  }
);


router.post("/admin/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if admin with the given email already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin
    admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Admin Login
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    // console.log(email)
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    data={
      id:admin.id,
      username: admin.username,
      email: admin.email
    }
    const authtoken = admingenerateToken(data)
    // Return admin data if login successful
    res.json({authtoken , username: admin.username, email: admin.email });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});



router.get("/admins",adminjwtAuthMiddleware, async (req, res) => {
  try {
    const admins = await Admin.find({}, { _id: 0, password: 0 }); // Exclude _id and password fields
    res.json(admins);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;


router.post("/sadmin/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if admin with the given email already exists
    let sadmin = await Sadmin.findOne({ email });
    if (sadmin) {
      return res.status(400).json({ error: "sAdmin already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin
    sadmin = await Sadmin.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({ message: "sAdmin registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Admin Login
router.post("/sadmin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
   
    let sadmin = await Sadmin.findOne({ email });
    // console.log(email)
    if (!sadmin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, sadmin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const data ={
      id: sadmin.id,
      username: sadmin.username,
      email: sadmin.email
    }
    const authtoken = admingenerateToken(data)
    // Return admin data if login successful
    res.json({authtoken, username: sadmin.username, email: sadmin.email });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
