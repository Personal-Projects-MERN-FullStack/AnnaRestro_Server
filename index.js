const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const connectToMongo = require("./database/db");
const WebSocket = require("ws");
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
// const Product = require("./models/Product");

// Importing the Routes
const authroutes = require("./routes/auth");
const menuroutes = require("./routes/menu")
// creating the use cases
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/auth", authroutes);
app.use("/menu", menuroutes)

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Function to send products to WebSocket client
// async function sendProducts(ws) {
//   try {
//     const products = await Product.find();
//     ws.send(JSON.stringify(products));
//   } catch (error) {
//     console.error("Error sending products:", error);
//   }
// }

// // WebSocket connection event
// wss.on("connection", (ws) => {
//   console.log("WebSocket connection established.");

//   // Send initial products to the connected WebSocket client
//   sendProducts(ws);

//   // Handle incoming WebSocket messages
//   ws.on("message", (message) => {
//     console.log(`Received message: ${message}`);
//     // Process the message if needed
//   });

//   // Handle WebSocket errors
//   ws.on("error", (error) => {
//     console.error("WebSocket error:", error);
//   });

//   // Handle WebSocket close event
//   ws.on("close", () => {
//     console.log("WebSocket connection closed.");
//   });
// });

const port = 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToMongo()
});
