import express from 'express';
import Leave from '../models/Leave.js';
import { verifyUser, verifyAdmin } from '../middleware/authmiddleware.js';

const router = express.Router();

// POST: Employee applies for leave
router.post('/', verifyUser, async (req, res) => {
  try {
    const { reason, date } = req.body;

    if (!reason || !date) {
      return res.status(400).json({ success: false, message: 'Reason and date are required.' });
    }

    const newLeave = new Leave({
      employee: req.user._id,
      reason,
      date: new Date(date),
    });

    await newLeave.save();
    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully.',
      data: newLeave,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET: Admin sees all | Employee sees their own
router.get('/', verifyUser, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { employee: req.user._id };

    const leaves = await Leave.find(filter).populate('employee', 'name email role');

    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch leave requests' });
  }
});

// PUT: Admin updates leave status (approve/reject)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    leave.status = status;
    leave.note = note || '';
    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave ${status}`,
      data: leave,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating leave status' });
  }
});

export default router;
