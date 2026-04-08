const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const TaxCalculator = require('./utils/calculator');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Get all stays for a user
app.get('/api/stays/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const stays = await prisma.stay.findMany({
      where: { userId },
      orderBy: { arrivalDate: 'asc' },
    });
    res.json(stays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new stay
app.post('/api/stays', async (req, res) => {
  try {
    const { userId, countryCode, countryName, arrivalDate, departureDate, notes } = req.body;

    // 1. Check for overlaps
    const overlaps = await prisma.stay.findFirst({
      where: {
        userId,
        OR: [
          {
            arrivalDate: { lte: new Date(departureDate) },
            departureDate: { gte: new Date(arrivalDate) },
          },
        ],
      },
    });

    if (overlaps) {
      return res.status(400).json({ error: 'Stay overlaps with an existing record' });
    }

    // 2. Create stay
    const newStay = await prisma.stay.create({
      data: {
        userId,
        countryCode,
        countryName,
        arrivalDate: new Date(arrivalDate),
        departureDate: new Date(departureDate),
        notes,
      },
    });

    res.status(201).json(newStay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get residency summary
app.get('/api/summary/:userId/:countryCode', async (req, res) => {
  try {
    const { userId, countryCode } = req.params;
    const stays = await prisma.stay.findMany({ where: { userId } });

    // Calculate for current year
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31);

    const daysUsed = TaxCalculator.calculateDaysInWindow(stays, countryCode, yearStart, yearEnd);
    
    // For Schengen, do a compliance check
    let schengenStatus = null;
    if (countryCode === 'SCH') {
      // Check compliance for "today"
      schengenStatus = TaxCalculator.checkSchengenCompliance(stays, now, now);
    }

    res.json({
      countryCode,
      daysUsed,
      threshold: countryCode === 'SCH' ? 90 : 183,
      schengenStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed Initial User (Mock)
app.post('/api/init-mock', async (req, res) => {
  try {
    const user = await prisma.user.upsert({
      where: { email: 'demo@nomad.com' },
      update: {},
      create: {
        email: 'demo@nomad.com',
        name: 'Demo Nomad',
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
