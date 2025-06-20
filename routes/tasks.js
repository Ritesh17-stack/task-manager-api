const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET /api/tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send('Task not found');
  res.json(task);
});

// POST /api/tasks
router.post('/', async (req, res) => {
  const newTask = new Task(req.body);
  const savedTask = await newTask.save();
  res.status(201).json(savedTask);
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedTask) return res.status(404).send('Task not found');
  res.json(updatedTask);
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const deletedTask = await Task.findByIdAndDelete(req.params.id);
  if (!deletedTask) return res.status(404).send('Task not found');
  res.send('Task deleted successfully');
});

module.exports = router;
