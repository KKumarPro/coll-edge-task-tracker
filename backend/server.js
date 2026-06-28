require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('[DATABASE] MongoDB securely connected.'))
  .catch((err) => {
    console.error('[DATABASE] Connection FAILED:', err.message);
    process.exit(1); // Kill the server if the database fails
  });

// Routes (We will hook these up in Step 5)
app.use('/api/tasks', require('./routes/taskRoutes'));

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SERVER] System online. Running on port ${PORT}`);
});