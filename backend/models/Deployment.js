const mongoose = require("mongoose");

const deploymentSchema = new mongoose.Schema({
    version: {
        type: String,
        required: true
    },

    environment: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Deployment", deploymentSchema);