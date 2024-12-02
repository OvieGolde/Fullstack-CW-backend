const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;

// Enable CORS for cross-origin requests
app.use(cors());
app.use(express.json());

// File paths for lessons and orders data
const lessonsFilePath = path.join(__dirname, 'data', 'lessons.json');
const ordersFilePath = path.join(__dirname, 'data', 'orders.json');

// Read the JSON files
const readJsonFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};

// Routes

// Get all lessons
app.get('/lessons', async (req, res) => {
  try {
    const lessons = await readJsonFile(lessonsFilePath);
    res.json(lessons);
  } catch (err) {
    res.status(500).send('Error retrieving lessons');
  }
});

// Get a specific lesson by ID
app.get('/lessons/:id', async (req, res) => {
  const lessonId = parseInt(req.params.id);
  try {
    const lessons = await readJsonFile(lessonsFilePath);
    const lesson = lessons.find((lesson) => lesson.id === lessonId);
    if (!lesson) {
      return res.status(404).send('Lesson not found');
    }
    res.json(lesson);
  } catch (err) {
    res.status(500).send('Error retrieving lesson');
  }
});

// Create an order
app.post('/orders', async (req, res) => {
  const newOrder = req.body;
  try {
    const orders = await readJsonFile(ordersFilePath);
    newOrder.id = orders.length + 1; // Set the ID of the new order
    orders.push(newOrder);

    // Write the updated orders back to the file
    fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error saving order');
      }
      res.status(201).send(newOrder);
    });
  } catch (err) {
    res.status(500).send('Error processing the order');
  }
});

// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await readJsonFile(ordersFilePath);
    res.json(orders);
  } catch (err) {
    res.status(500).send('Error retrieving orders');
  }
});

// Get a specific order by ID
app.get('/orders/:id', async (req, res) => {
  const orderId = parseInt(req.params.id);
  try {
    const orders = await readJsonFile(ordersFilePath);
    const order = orders.find((order) => order.id === orderId);
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.json(order);
  } catch (err) {
    res.status(500).send('Error retrieving order');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
