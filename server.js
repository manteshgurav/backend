// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3001;

mongoose.set("strictQuery", false);

// Connect to MongoDB Cloud database
mongoose
  .connect(
    "mongodb+srv://user2000:user3000@test-pro-db.wu36v74.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(cors());
app.use(express.json());

// Define a Mongoose model for your data
const Item = mongoose.model("Item", {
  name: String,
  description: String,

  // Add other fields as needed
});

// API endpoint to get all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to create a new item
app.post("/api/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to update an item by ID
app.put("/api/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "Mashu" && password === "12345") {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// API endpoint to delete an item by ID
app.delete("/api/items/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findOneAndDelete({ _id: req.params.id });

    if (!deletedItem) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(deletedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
