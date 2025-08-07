const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Import & Use Routes
const draftRoutes = require('./routes/draft');
app.use('/api/draft', draftRoutes);

const championRoutes = require('./routes/champions');
app.use('/api/champions', championRoutes);

app.get('/', (req, res) => {
  res.send('LoL Draft Assistant API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});