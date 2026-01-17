const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());

// Body Parser with increased limit for Base64 file uploads (Reports/Insurance)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const medRoutes = require('./routes/medRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const wellnessRoutes = require('./routes/wellnessRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const recordRoutes = require('./routes/recordRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meds', medRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/records', recordRoutes);

// Base Route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Middleware (Must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});