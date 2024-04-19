const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    email: {

        type: String,
        
          },
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Todo', todoSchema);