const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors()); // Allow React frontend to connect
app.use(express.json()); // Parse JSON request bodies

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "GroceryWise Backend Running!" });
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
