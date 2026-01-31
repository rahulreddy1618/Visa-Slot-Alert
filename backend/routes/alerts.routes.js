const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/alerts.json');

const VALID_VISA_TYPES = ['Tourist', 'Business', 'Student'];
const VALID_STATUSES = ['Active', 'Booked', 'Expired'];

/**
 * Read alerts from JSON file
 */
const readAlerts = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

/**
 * Write alerts to JSON file
 */
const writeAlerts = (alerts) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(alerts, null, 2), 'utf8');
};

/**
 * GET /alerts
 * Returns all alerts with optional query filters: ?country= & ?status=
 */
router.get('/', (req, res, next) => {
  try {
    let alerts = readAlerts();
    const { country, status } = req.query;

    if (country) {
      alerts = alerts.filter((a) => a.country.toLowerCase().includes(country.toLowerCase()));
    }
    if (status) {
      alerts = alerts.filter((a) => a.status === status);
    }

    res.status(200).json(alerts);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /alerts
 * Creates a new alert with validation
 */
router.post('/', (req, res, next) => {
  try {
    const { country, city, visaType } = req.body;

    if (!country || typeof country !== 'string' || !country.trim()) {
      const err = new Error('Country is required');
      err.statusCode = 400;
      return next(err);
    }
    if (!city || typeof city !== 'string' || !city.trim()) {
      const err = new Error('City is required');
      err.statusCode = 400;
      return next(err);
    }
    if (!visaType || !VALID_VISA_TYPES.includes(visaType)) {
      const err = new Error(`Visa type must be one of: ${VALID_VISA_TYPES.join(', ')}`);
      err.statusCode = 400;
      return next(err);
    }

    const alerts = readAlerts();
    const newAlert = {
      id: uuidv4(),
      country: country.trim(),
      city: city.trim(),
      visaType,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    alerts.push(newAlert);
    writeAlerts(alerts);

    res.status(201).json(newAlert);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /alerts/:id
 * Updates alert status only
 */
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      const err = new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
      err.statusCode = 400;
      return next(err);
    }

    const alerts = readAlerts();
    const index = alerts.findIndex((a) => a.id === id);

    if (index === -1) {
      const err = new Error('Alert not found');
      err.statusCode = 404;
      return next(err);
    }

    alerts[index].status = status;
    writeAlerts(alerts);

    res.status(200).json(alerts[index]);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /alerts/:id
 * Deletes an alert
 */
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const alerts = readAlerts();
    const index = alerts.findIndex((a) => a.id === id);

    if (index === -1) {
      const err = new Error('Alert not found');
      err.statusCode = 404;
      return next(err);
    }

    const deleted = alerts.splice(index, 1)[0];
    writeAlerts(alerts);

    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
