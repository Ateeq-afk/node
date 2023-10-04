const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Express
const app = express();

// Use JSON middleware
app.use(express.json());

// MongoDB Connection
if (mongoose.connection.readyState == 0) {
    mongoose.connect('mongodb+srv://ateeq:<davzaw-quMnyw-5guqpi>@backpackers-united.nyynurw.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch(err => {
        console.log('MongoDB Connection Error:', err);
    });
}

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
});

const User = mongoose.model('User', userSchema);

// Register Route
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ message: 'Logged in', token });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
