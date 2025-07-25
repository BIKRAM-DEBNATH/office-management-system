import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true }
});

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
export default Employee;
