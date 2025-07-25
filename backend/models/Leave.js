import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    note: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);

export default Leave;
