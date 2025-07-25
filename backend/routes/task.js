import express from 'express';
import Task from '../models/task.js';
import { verifyUser } from '../middleware/authmiddleware.js';

const router = express.Router();

// Create a new task
router.post('/', verifyUser, async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch all tasks (used in admin dashboard task manager)
router.get('/', verifyUser, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name')
      .populate('assignedBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tasks created by the current admin
router.get('/admin', verifyUser, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedBy: req.user.id }).populate('assignedTo', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tasks assigned to the logged-in employee
router.get('/employee', verifyUser, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Mark a task as completed
router.put('/:id/complete', verifyUser, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found or unauthorized" });

    task.status = "completed";
    await task.save();
    res.json({ success: true, message: "Task marked as completed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
