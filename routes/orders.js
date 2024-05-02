const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const User = require("../models/Users");
const OrderChangeStateLog = require("../models/OrderChangeStateLog");

// Function to create a log entry for order state change
async function createOrderStateChangeLog(
  orderId,
  previousState,
  newState,
  userId,
  changedByAdmin
) {
  try {
    const logEntry = new OrderChangeStateLog({
      orderId: orderId,
      previousState: previousState,
      newState: newState,
      changedByAdmin: changedByAdmin,
      timestamp: new Date(),
    });
    await logEntry.save();
  } catch (error) {
    console.error("Error creating order state change log:", error);
    throw error; // Throw the error for further handling
  }
}

// Route to place an order
router.post("/place-order", async (req, res) => {
  try {
    const { customer, products, total } = req.body;
    const user = await User.findById(customer);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.wallet.coins < total) {
      return res.status(400).json({ message: "Insufficient funds in wallet" });
    }

    user.wallet.coins -= total;

    // Create the order with default state "new"
    const newOrder = new Order({ customer, products, total, status: "new" });
    const savedOrder = await newOrder.save();

    // Log the order state change from default to "new"
    await createOrderStateChangeLog(savedOrder._id, "new", "new", user._id, " "); 
    await user.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(400).json({ message: error.message });
  }
});

// Route to update the status of an order
router.patch("/:orderId/update-status", async (req, res) => {
  // console.log(req.body);
  try {
    const orderId = req.params.orderId;
    const { status, adminid } = req.body;

    const order = await Order.findById(orderId);
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    // Log the order state change
    await createOrderStateChangeLog(
      orderId,
      order.status,
      status,
      updatedOrder.customer,
      adminid
    );

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(400).json({ message: error.message });
  }
});

// Route to fetch orders by customer id
router.get("/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const orders = await Order.find({ customer: customerId }).sort({ createdAt: -1 }); // Sorting by createdAt in ascending order
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Sorting by createdAt in ascending order
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route to add products to user's basket
router.post("/:userId/add-to-basket", async (req, res) => {
  try {
    const userId = req.params.userId;
    const products = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.basket = products.products;
    await user.save();

    res.json(user.basket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to get user's basket
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



router.get("/orderlog/:customerid", async (req, res) => {
  try {
    const customerId = req.params.customerid;

    // Fetch orders associated with the customer ID
    const customerOrders = await Order.find({ customer: customerId });

    // Extract order IDs from the fetched orders
    const orderIds = customerOrders.map(order => order._id);

    // Fetch order change logs for the extracted order IDs
    const orderChangeLogs = await OrderChangeStateLog.find({ orderId: { $in: orderIds } })
      .sort({ createdAt: -1 }); // Sort by latest to oldest

    res.json(orderChangeLogs);
  } catch (error) {
    console.error("Error fetching order change logs:", error);
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;
