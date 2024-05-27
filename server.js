require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

// Mock in-memory database
let users = [];

// Helper function to generate unique IDs
const generateId = () => {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
};

// Fetch all users
app.get('/users', (req, res) => {
    res.json(users);
});

// Create a new user
app.post('/users', (req, res) => {
    const newUser = { id: generateId(), ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Update an existing user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(user => user.id == id);
    if (index !== -1) {
        users[index] = { id: parseInt(id), ...req.body };
        res.json(users[index]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(user => user.id == id);
    if (index !== -1) {
        const deletedUser = users.splice(index, 1);
        res.json(deletedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
