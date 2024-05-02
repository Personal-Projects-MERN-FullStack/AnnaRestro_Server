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
const orderroutes = require("./routes/orders")
const walletroutes = require("./routes/wallet")
// creating the use cases
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/auth", authroutes);
app.use("/menu", menuroutes)
app.use("/orders", orderroutes)
app.use("/wallet", walletroutes)

app.get("/", (req, res) => {
  res.send("Hello world");
});

const port = 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToMongo()
});
