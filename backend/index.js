import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectdb from './db/connectdb.js';
import Admindb from './db/admindb.js';
import authRouter from './routes/auth.js';
import employeeRoutes from './routes/employee.js';
import taskRoutes from './routes/task.js';
import leaveRoutes from './routes/leaveRoutes.js';
import createDefaultAdmin from './utils/createDefaultAdmin.js'; // ✅ Add this line

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leaves', leaveRoutes);

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EMS Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ Catch-all route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Server start function
const startServer = async () => {
  try {
    await connectdb();          // Connect to EMS DB
    await Admindb();            // Optional: Connect to Admin DB if needed
    await createDefaultAdmin(); // ✅ Create default admin user

    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Startup DB connection error:', err.message);
  }
};

startServer();
