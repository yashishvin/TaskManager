const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Load SSL Certificate (Ensure these files exist!)
const sslOptions = {
    key: fs.readFileSync('/etc/ssl/private/nginx-selfsigned.key'),
    cert: fs.readFileSync('/etc/ssl/certs/nginx-selfsigned.crt')
};

// CORS Configuration (Allow HTTPS Frontend Requests)
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://13.52.246.199'], // Allow frontend origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Task Schema
const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    assignee: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error(' Error fetching tasks:', error.message);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const { name, description, assignee } = req.body;
        const task = new Task({ name, description, assignee });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error(' Error creating task:', error.message);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        console.error(' Error updating task:', error.message);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});

// Force Redirect HTTP to HTTPS
const httpApp = express();
httpApp.use((req, res, next) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
});
httpApp.listen(5000, () => {
    console.log('🔄 Redirecting all HTTP traffic to HTTPS...');
});

// Start Secure HTTPS Server
const PORT = process.env.PORT || 5001;
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Secure Server is running on https://13.52.246.199:${PORT}`);
});
