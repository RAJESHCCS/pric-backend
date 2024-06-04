
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        mongoose.set('strictQuery', false);
        clearDatabase();  // Clear the database on startup
    })
    .catch(err => console.error('Failed to connect to MongoDB', err));

// User Schema
const pric_db = new mongoose.Schema({
    name: String,
    // email: String,
    // age: Number,
});


//you can remove email and age no issue, since i am posting name only in req body
// Model
const User = mongoose.model('User', pric_db, 'pric_db'); // 'pric_db' is the collection name

// Clear the database on startup
const clearDatabase = async () => {
    try {
        await User.deleteMany({});
        console.log('Database cleared');
    } catch (error) {
        console.error('Error clearing database', error);
    }
};

// Fetch all users
app.get('/users', async (req, res) => {
    
    try {
        const users = await User.find();    
        console.log("getting in .get method",users);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Bad request' });
    }
});

// Update an existing user by name
app.put('/users', async (req, res) => {
    try {
        // const { name } = req.params;
        console.log(" req .body line 135",req.body)
        const { _id ,name } = req.body; // Extract updated name from request body
        // console.log("newName for update",_id);
        // console.log("old name already present",name);

        // Check if the new name is provided in the request body
        // if (!_id) {
        //     return res.status(400).json({ message: 'New name is required for update' });
        // }
        const getUser = await User.find();
        // console.log("getUser line 145", getUser);
      
        const updatedUser = await User.findOneAndUpdate({ _id }, { name: name }, { new: true });
        console.log("update user",updatedUser);
        if (updatedUser) {
            res.json(updatedUser);
        } else {

            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a user by name
app.delete('/users/:name', async (req, res) => {
    try {
        console.log("req.params line 165 ", req.params);
        const { name } = req.params; // Extract the name from the route parameters

        // Find the user by name and delete it
        const deletedUser = await User.findOneAndDelete({ name });

        if (deletedUser) {
            res.json(deletedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/refresh', async (req, res) => {
    console.log("inside refresh")
    await User.deleteMany({});
    

    // res.redirect('/');
    res.status(200).json({ message: 'database cleared' });

  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
