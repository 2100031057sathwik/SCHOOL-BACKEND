const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes'); // Adjust path if necessary
const studentRoutes = require('./routes/studentRoutes'); // Adjust path if necessary

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect("mongodb+srv://school:school@cluster0.gvro7rs.mongodb.net/school?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});

// Use routes
app.use('/user', userRoutes);
app.use('/student', studentRoutes);

// Start server
app.listen(3041, () => {
  console.log("Server is running on port 3041");
});
