require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todoapp';

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dateTime: { type: Number, required: true },
  deadline: { type: Number, required: true },
  priority: { type: String, required: true, enum: ['High', 'Medium', 'Low'] },
  category: { type: String, required: true, enum: ['Work', 'Personal', 'Health', 'Other'] },
  status: { type: String, required: true, enum: ['Incomplete', 'Completed'] },
  userId: { type: String, required: true },
  createdAt: { type: Number, required: true }
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/api/tasks/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    // Map _id to id for frontend compatibility
    const formattedTasks = tasks.map(t => {
      const obj = t.toObject();
      obj.id = obj._id.toString();
      delete obj._id;
      delete obj.__v;
      return obj;
    });
    res.json(formattedTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    
    const obj = savedTask.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    
    res.status(201).json(obj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    
    const obj = updatedTask.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    
    res.json(obj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start Server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
