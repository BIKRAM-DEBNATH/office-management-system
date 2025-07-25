import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { verifyAdmin } from '../middleware/authmiddleware.js';

const router = express.Router();

// Get all employees
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get employee count
router.get('/count', verifyAdmin, async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'employee' });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new employee
router.post('/', verifyAdmin, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, role: 'employee', password: hashedPassword });
    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update employee
router.put('/:id', verifyAdmin, async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete employee
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
