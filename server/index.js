const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const generateRoute = require('./routes/generate');
app.use('/api/generate', generateRoute);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
