import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectdb from './db/connectdb.js';
import Admindb from './db/admindb.js';
import authRouter from './routes/auth.js';
import employeeRoutes from './routes/employee.js';
import taskRoutes from './routes/task.js';
import leaveRoutes from './routes/leaveRoutes.js';
import createDefaultAdmin from './utils/createDefaultAdmin.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow listed domains
const allowedOrigins = [
  'http://localhost:5173',
  'https://office-management-system-ok962mkma.vercel.app',
  'https://office-management-system-rho.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use('/api/auth', authRouter);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leaves', leaveRoutes);

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ Error Handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: err.message });
});

// ✅ 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start Server
const startServer = async () => {
  try {
    await connectdb();
    await Admindb();
    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
  }
};

startServer();
