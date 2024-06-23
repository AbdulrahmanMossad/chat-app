const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const authRoute = require("./routes/authRoute");
const messageRoute = require("./routes/messageRoute");
const connection = require("./database/connect");
const usersRoute = require("./routes/usersRoute");
const cookieParser = require("cookie-parser");
const { app, server, io } = require("./socket/socket");

// Load environment variables early
dotenv.config();

const PORT = process.env.PORT || 5000;
const dirname = path.resolve();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this origin
  credentials: true, // Allow cookies to be sent along with requests
};

// Use CORS middleware
app.use(cors(corsOptions));

// Parse incoming requests with JSON payloads (from req.body)
app.use(express.json());

// Parse incoming cookies
app.use(cookieParser());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(dirname, "uploads")));

// Mount routes using middleware
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/users", usersRoute);

// Serve static files for the frontend
app.use(express.static(path.join(dirname, "frontend", "dist")));

// Handle all other routes by serving the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(dirname, "frontend", "dist", "index.html"));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server and establish the database connection
server.listen(PORT, () => {
  connection()
    .then(() => {
      console.log(`Connected to database and listening on port ${PORT}`);
    })
    .catch((err) => {
      console.error("Failed to connect to the database", err);
    });
});
