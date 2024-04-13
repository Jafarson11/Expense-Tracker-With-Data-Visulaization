const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./user'); 
const Todo = require('./todo');// Make sure the path to user.js is correct

const app = express();
const PORT = process.env.PORT || 4510;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/plaubertDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MongoDB connected successfully');
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/home/home.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login page/login.html');
});

app.get('/expense', (req, res) => {
    res.sendFile(__dirname + '/public/expense/expense.html');
});

app.get('/todo', (req, res) => {
    res.sendFile(__dirname + '/public/todolist/index.html');
});

app.get('/blog', (req, res) => {
    res.sendFile(__dirname + '/public/blog/index.html');
});

app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/public/contact/index.html');
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/home/home.html');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Incorrect password');
        }

        // Redirect to expense.html upon successful login
        res.redirect('/expense');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.redirect('/login'); // Redirect to login page after successful signup
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Example route to create a new todo
app.post('/todos', async (req, res) => {
    const { task } = req.body;

    try {
        const newTodo = new Todo({
            task,
            completed: false // Assuming newly created todo is not completed
        });

        // Save the newTodo
        await newTodo.save();

        res.status(201).json(newTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Example route to update a todo
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
        res.json(updatedTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Example route to delete a todo
app.post('/todos', async (req, res) => {
    const { task } = req.body;

    try {
        const newTodo = new Todo({
            task,
            completed: false // Assuming newly created todo is not completed
        });

        // Save the newTodo
        await newTodo.save();

        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
