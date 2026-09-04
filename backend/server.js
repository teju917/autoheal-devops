const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Deployment = require("./models/Deployment");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
require("dotenv").config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

// Health API
app.get("/api/health", async (req, res) => {
    const databaseStatus =
        mongoose.connection.readyState === 1
            ? "connected"
            : "disconnected";

    res.json({
        status: "healthy",
        service: "AutoHeal Backend",
        database: databaseStatus
    });
});

// Version API
app.get("/api/version", (req, res) => {
    res.json({
        version: "1.0.0"
    });
});

app.get("/api/deployments", async (req, res) => {
    try {
        const deployments = await Deployment
            .find()
            .sort({ timestamp: -1 });

        res.json(deployments);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch deployments"
        });
    }
});

app.post("/api/deployments", async (req, res) => {
    try {
        const deployment = new Deployment({
            version: req.body.version,
            environment: req.body.environment,
            status: req.body.status
        });

        const savedDeployment = await deployment.save();

        res.status(201).json(savedDeployment);

    } catch (error) {
        res.status(500).json({
            message: "Failed to create deployment"
        });
    }
});
app.listen(PORT, () => {
    console.log(`AutoHeal backend running on port ${PORT}`);
});