import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employee.js';
import taskRoutes from './routes/taskRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow your frontend domains
const allowedOrigins = [
  'https://office-management-system-ok962mkma.vercel.app',
  'https://office-management-system.vercel.app',
  'https://office-managem-git-41ceee-bikramdebnath907yt-gmailcoms-projects.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leaves', leaveRoutes);

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Office Management API is running...');
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start server after DB connects
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
