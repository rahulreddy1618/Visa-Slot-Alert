require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const logger = require('./middleware/logger');
const errorHandler = require('./utils/errorHandler');
const alertsRoutes = require('./routes/alerts.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const alertsFile = path.join(dataDir, 'alerts.json');
if (!fs.existsSync(alertsFile)) {
  fs.writeFileSync(alertsFile, '[]', 'utf8');
}

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/alerts', alertsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Visa Slot Alerts API running on http://localhost:${PORT}`);
});
