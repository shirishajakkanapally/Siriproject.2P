// routes/index.js

const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// Welcome Page
router.get('/', (req, res) => res.render('home'));

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Retrieve todos associated with the current user
    const todos = await Todo.find({ email: req.user.email });
    res.render('dashboard', {
      user: req.user,
      todos
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add Todo
router.post('/todos', async (req, res) => {
  const { text } = req.body;
  const { email } = req.user;

  try {
    // Create a new todo associated with the current user
    const newTodo = new Todo({
      text,
      email
    });
    await newTodo.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Mark Todo as Completed
router.post('/todos/:id/complete', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the todo by ID and email to ensure it belongs to the current user
    const todo = await Todo.findOne({ _id: id, email: req.user.email });
    if (!todo) {
      return res.status(404).send('Todo not found');
    }
    todo.completed = true;
    await todo.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Delete Todo
router.post('/todos/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    // Delete the todo by ID and email to ensure it belongs to the current user
    await Todo.findOneAndDelete({ _id: id, email: req.user.email });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Update Todo
router.post('/todos/:id/update', async (req, res) => {
  const { id } = req.params;
  const { updatedText } = req.body;
  try {
    // Find the todo by ID and email to ensure it belongs to the current user
    const todo = await Todo.findOne({ _id: id, email: req.user.email });
    if (!todo) {
      return res.status(404).send('Todo not found');
    }
    todo.text = updatedText;
    await todo.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


module.exports = router;